import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.person.findMany();
  }

  findMany(query: string) {
    return this.prisma.person.findMany({
      where: {
        OR: [
          { full_name: { contains: query, mode: 'insensitive' } },
          { national_id_no: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { offenses: true },
    });
  }

  findOne(id: string) {
    return this.prisma.person.findUnique({ where: { id } });
  }

  create(data: CreatePersonDto) {
    return this.prisma.person.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: {
        ...data,
        dob: new Date(data.dob),
      } as any,
    });
  }

  update(id: string, data: UpdatePersonDto) {
    return this.prisma.person.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
