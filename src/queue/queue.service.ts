import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SendFundsDto } from './dto/send-funds.dto'; // Убедитесь, что импортирован правильный DTO

/**
 * Сервис для работы с очередью транзакций Litecoin.
 */
@Injectable()
export class QueueService {
  /**
   * Конструктор для внедрения зависимостей.
   * 
   * @param litecoinQueue Очередь для транзакций Litecoin.
   */
  constructor(@InjectQueue('litecoinQueue') private litecoinQueue: Queue) {}

  /**
   * Добавляет транзакцию в очередь litecoinQueue.
   * 
   * @param data Данные транзакции, которые нужно добавить в очередь.
   */
  async addTransaction(data: SendFundsDto) {
    await this.litecoinQueue.add(data);
  }
}
