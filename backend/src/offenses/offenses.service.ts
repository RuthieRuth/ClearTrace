import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOffenseDto } from './dto/create-offense.dto';
import { UpdateOffenseDto } from './dto/update-offense.dto';
import { User } from '@prisma/client';

@Injectable()
export class OffensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: User) {
    // superadmin users can only see all offenses
    if (user.role === 'superadmin') {
      return this.prisma.offense.findMany();
    }

    // A. government users can only see all offenses that are related to their access scope
    // A1. get all the offenses per person
    const accessScope = await this.prisma.userAccessScope.findMany({
      where: {
        user_id: user.id,
        revoked_at: null,
      },
    });

    // A2. get all the allowed categories based on the access scope
    const allowedCategories = accessScope.map((scope) => scope.category);
    return this.prisma.offense.findMany({
      where: {
        category: { in: allowedCategories },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.offense.findUnique({ where: { id } });
  }

  create(data: CreateOffenseDto) {
    return this.prisma.offense.create({ data });
  }

  update(id: string, data: UpdateOffenseDto) {
    return this.prisma.offense.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.offense.delete({ where: { id } });
  }
}
