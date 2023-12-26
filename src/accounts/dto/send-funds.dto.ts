// send-funds.dto.ts
import { IsString, IsPositive } from 'class-validator';

export class SendFundsDto {
  @IsString()
  readonly fromAccountId: string;

  @IsString()
  readonly toAccountId: string;

  @IsPositive()
  readonly amount: number;
}