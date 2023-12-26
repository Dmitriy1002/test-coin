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
    await this.transaction.deleteMany();
    await this.account.deleteMany();
  }
}
