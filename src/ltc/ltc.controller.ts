import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LitecoinService } from './ltc.service';
import { CreateLtcAccountDto } from './dto/create-ltc-account.dto';
import { SendFundsDto } from './dto/send-funds.dto';

@Controller('ltc')
export class LitecoinController {
  constructor(private readonly litecoinService: LitecoinService) {}

  /**
   * Создает новый Litecoin аккаунт.
   * 
   * @param createLtcAccountDto DTO с данными для создания аккаунта.
   * @returns Объект с созданным Litecoin адресом.
   */
  @Post('create-account')
  async createLtcAccount(@Body() createLtcAccountDto: CreateLtcAccountDto): Promise<{ ltcAddress: string }> {
    const ltcAddress = await this.litecoinService.createLtcAccount(createLtcAccountDto);
    return { ltcAddress };
  }
  
  /**
   * Отправляет средства с одного Litecoin аккаунта на другой.
   * 
   * @param sendFundsDto DTO с информацией для отправки средств.
   */
  @Post('send-funds')
  async sendFunds(@Body() sendFundsDto: SendFundsDto): Promise<void> {
    await this.litecoinService.sendFunds(sendFundsDto);
  }

  /**
   * Получает баланс Litecoin аккаунта.
   * 
   * @param id Идентификатор аккаунта, для которого запрашивается баланс.
   * @returns Объект с балансом аккаунта.
   */
  @Get('balance/:id')
  async getLtcBalance(@Param('id') id: string): Promise<{ ltcBalance: number }> {
    const ltcBalance = await this.litecoinService.getLtcBalance(id);
    return { ltcBalance };
  }
}
