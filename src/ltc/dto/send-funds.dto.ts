import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SendFundsDto {
  @IsNotEmpty()
  @IsString()
  readonly accountId: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly recipientAddress: string;
}