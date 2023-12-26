import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LitecoinService } from '../ltc/ltc.service';
import { SendFundsDto } from './dto/send-funds.dto';

/**
 * Обработчик очереди для асинхронной обработки транзакций Litecoin.
 */
@Processor('litecoinQueue')
export class QueueProcessor {
  /**
   * Конструктор для внедрения зависимостей.
   * 
   * @param litecoinService Сервис для обработки транзакций Litecoin.
   */
  constructor(
    private litecoinService: LitecoinService // Инжектировать LitecoinService
  ) {}

  /**
   * Обрабатывает задачу отправки средств.
   * 
   * @param job Задача, содержащая данные DTO для отправки средств.
   */
  @Process()
  async handleTransaction(job: Job<SendFundsDto>) {
    try {
      await this.litecoinService.processTransaction(job.data);
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  }
}
