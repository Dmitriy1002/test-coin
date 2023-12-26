import { IsNotEmpty, IsString } from 'class-validator';

export class GetLtcBalanceDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}