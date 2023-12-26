import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Создает новый аккаунт.
   * 
   * @param createAccountDto DTO для создания аккаунта.
   * @returns Объект с ID созданного аккаунта.
   */
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<{ accountId: string }> {
    const accountId = await this.accountsService.createAccount(createAccountDto);
    return { accountId };
  }

  /**
   * Получает аккаунт по ID.
   * 
   * @param id Идентификатор аккаунта.
   * @returns Аккаунт.
   */
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return this.accountsService.getAccountById(id);
  }

  /**
   * Обновляет аккаунт.
   * 
   * @param id Идентификатор аккаунта.
   * @param updateAccountDto DTO для обновления аккаунта.
   * @returns Обновленный аккаунт.
   */
  @Put(':id')
  async updateAccount(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.updateAccount(id, updateAccountDto);
  }

  /**
   * Удаляет аккаунт по ID.
   * 
   * @param id Идентификатор аккаунта.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Param('id') id: string): Promise<void> {
    await this.accountsService.deleteAccount(id);
  }
}
