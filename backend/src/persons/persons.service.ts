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

  findOne(id: string) {
    return this.prisma.person.findUnique({ where: { id } });
  }

  create(data: CreatePersonDto) {
    return this.prisma.person.create({ data });
  }

  update(id: string, data: UpdatePersonDto) {
    return this.prisma.person.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
