import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Создает новый аккаунт.
   * 
   * @param createAccountDto DTO с данными для создания аккаунта.
   * @returns Промис, разрешающийся в ID созданного аккаунта.
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<string> {
    const { username } = createAccountDto;
    const createdAccount = await this.prismaService.account.create({
      data: { username },
    });
    return createdAccount.id;
  }

  /**
   * Возвращает аккаунт по его ID.
   * 
   * @param id Идентификатор аккаунта.
   * @throws NotFoundException, если аккаунт не найден.
   * @returns Найденный аккаунт.
   */
  async getAccountById(id: string) {
    const account = await this.prismaService.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  /**
   * Обновляет данные аккаунта.
   * 
   * @param id Идентификатор аккаунта.
   * @param updateAccountDto DTO с обновленными данными аккаунта.
   * @throws NotFoundException, если аккаунт не найден.
   * @returns Обновленный аккаунт.
   */
  async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
    const updatedAccount = await this.prismaService.account.update({
      where: { id },
      data: updateAccountDto,
    });

    if (!updatedAccount) {
      throw new NotFoundException('Account not found');
    }
    return updatedAccount;
  }

  /**
   * Удаляет аккаунт по его ID.
   * 
   * @param id Идентификатор аккаунта.
   * @throws NotFoundException, если аккаунт не найден.
   * @returns Промис без возвращаемого значения.
   */
  async deleteAccount(id: string): Promise<void> {
    const deletedAccount = await this.prismaService.account.delete({
      where: { id },
    });

    if (!deletedAccount) {
      throw new NotFoundException('Account not found');
    }
  }
}
