import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLtcAccountDto {
  @IsNotEmpty()
  @IsString()
  readonly accountId: string;
}