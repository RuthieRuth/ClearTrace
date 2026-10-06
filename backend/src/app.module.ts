import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { PersonsModule } from './persons/persons.module';
import { OffensesModule } from './offenses/offenses.module';
import { CompaniesModule } from './companies/companies.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { RequestsModule } from './requests/requests.module';
//import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    PersonsModule,
    OffensesModule,
    CompaniesModule,
    RequestsModule,
    AuditLogsModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
