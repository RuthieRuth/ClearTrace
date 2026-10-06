import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { PrismaService } from 'src/prisma.service';
import { RequestsService } from './requests.service';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
})
export class RequestsModule {}
