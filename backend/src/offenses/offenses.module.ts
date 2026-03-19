import { Module } from '@nestjs/common';
import { OffensesController } from './offenses.controller';
import { OffensesService } from './offenses.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OffensesController],
  providers: [OffensesService, PrismaService],
})
export class OffensesModule {}
