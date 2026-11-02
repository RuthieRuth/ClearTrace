import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.company.findMany({
      include: {
        users: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  create(data: CreateCompanyDto, approvedById: string) {
    return this.prisma.company.create({
      data: {
        ...data,
        approved: true, // Set approved to true by default
        approved_by_id: approvedById,
        approved_at: new Date(),
      },
    });
  }

  update(id: string, data: UpdateCompanyDto) {
    return this.prisma.company.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}
