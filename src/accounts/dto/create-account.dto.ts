// create-account.dto.ts
import { IsString, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(3, 20)
  readonly username: string;
}