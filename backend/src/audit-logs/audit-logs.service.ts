import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.auditLog.findMany();
  }

  findByUser(userId: string) {
    return this.prisma.auditLog.findMany({ where: { user_id: userId } });
  }

  findByPerson(personId: string) {
    return this.prisma.auditLog.findMany({ where: { person_id: personId } });
  }
}
