import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLtcAccountDto } from './dto/create-ltc-account.dto';
import { SendFundsDto } from '../accounts/dto/send-funds.dto';
import { EncryptDecryptService } from '../security/encrypt-decrypt.service';
import { QueueService } from '../queue/queue.service';
import * as litecore from 'litecore-lib';
import { litecoinNodeConfig } from '../config/litecoin.config';

@Injectable()
export class LitecoinService {
  private readonly logger = new Logger(LitecoinService.name);

  private readonly litecoinNode = new litecore.Networks.litecoin(litecoinNodeConfig);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptDecryptService: EncryptDecryptService,
    private readonly queueService: QueueService
  ) {}

  /**
   * Создает новый аккаунт Litecoin и генерирует уникальный адрес LTC.
   * 
   * @param createLtcAccountDto Объект DTO с информацией для создания аккаунта.
   * @returns Возвращает сгенерированный адрес Litecoin.
   */
  async createLtcAccount(createLtcAccountDto: CreateLtcAccountDto): Promise<string> {
    const { accountId } = createLtcAccountDto;

    // Генерация уникального LTC-адреса
    const key = new litecore.PrivateKey();
    const ltcAddress = key.toAddress().toString();
    const encryptedLtcAddress = this.encryptDecryptService.encrypt(ltcAddress);

    await this.prismaService.account.update({
      where: { id: accountId },
      data: { ltcAddress: encryptedLtcAddress },
    });

    return ltcAddress;
  }

  /**
   * Помещает транзакцию на отправку средств в очередь для асинхронной обработки.
   * 
   * @param sendFundsDto Объект DTO, содержащий информацию о транзакции.
   * @throws NotFoundException Если аккаунт не найден.
   * @throws BadRequestException Если на аккаунте недостаточно средств.
   */
  async sendFunds(sendFundsDto: SendFundsDto): Promise<void> {
    const { accountId, amount, recipientAddress } = sendFundsDto;
    const account = await this.prismaService.account.findUnique({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    await this.queueService.addTransaction(sendFundsDto);
    this.logger.log(`Transaction queued: ${amount} from account ${accountId} to ${recipientAddress}`);
  }

  /**
   * Обрабатывает транзакцию Litecoin.
   * 
   * @param sendFundsDto Объект DTO с информацией о транзакции.
   * @throws NotFoundException Если аккаунт не найден.
   * @throws BadRequestException Если на аккаунте недостаточно средств.
   */
   async processTransaction(sendFundsDto: SendFundsDto): Promise<void> {
    const { accountId, amount, recipientAddress } = sendFundsDto;
    const account = await this.prismaService.account.findUnique({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const updatedBalance = account.balance - amount;
    await this.prismaService.account.update({
      where: { id: accountId },
      data: { balance: updatedBalance },
    });

    // Отправка средств в Litecoin
    const privateKey = new litecore.PrivateKey(account.privateKey); // Предположим, что у аккаунта есть приватный ключ
    const transaction = new litecore.Transaction()
      .from(account.unspentOutputs) // Предположим, что у аккаунта есть непотраченные выходы
      .to(recipientAddress, amount)
      .change(privateKey.toAddress())
      .sign(privateKey);
  
    // Отправка транзакции в сеть Litecoin
    transaction.serialize(); 
  }

  /**
   * Получает баланс Litecoin аккаунта.
   * 
   * @param id Уникальный идентификатор аккаунта.
   * @returns Возвращает баланс аккаунта в Litecoin.
   * @throws NotFoundException Если аккаунт не найден.
   */
  async getLtcBalance(id: string): Promise<number> {
    const account = await this.prismaService.account.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const ltcAddress = this.encryptDecryptService.decrypt(account.ltcAddress);
    const litecoinNode = new litecore.Networks.litecoin();
    const balance = await litecoinNode.getBalance(ltcAddress);

    return balance;
  }
}
