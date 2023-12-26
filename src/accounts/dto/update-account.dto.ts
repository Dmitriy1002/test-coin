// update-account.dto.ts
import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @Length(3, 20)
  @IsOptional()
  readonly username?: string;
}