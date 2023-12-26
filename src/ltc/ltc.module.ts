import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LitecoinController } from './ltc.controller';
import { LitecoinService } from './ltc.service';

@Module({
  imports: [PrismaModule],
  controllers: [LitecoinController],
  providers: [LitecoinService],
})
export class LitecoinModule {}