import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super();
  }

  /**
   * Вызывается при уничтожении модуля. Закрывает соединение с базой данных.
   */ 
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Очищает базу данных. Используется во время тестирования.
   */
  async cleanDatabase() {
    // Предположим, что у вас есть несколько таблиц: 'accounts', 'transactions', и т.д.
    // Пример удаления всех записей из этих таблиц:
    await this.transaction.deleteMany();
    await this.account.deleteMany();
    // Добавьте здесь вызовы deleteMany для других таблиц
  }

  /**
   * Создает новый аккаунт в базе данных.
   * 
   * @param accountData Данные для создания аккаунта.
   * @returns Промис, разрешающийся в созданном аккаунте.
   */
   async createAccount(accountData: { username: string }) {
    return this.account.create({
      data: accountData,
    });
  }
}
