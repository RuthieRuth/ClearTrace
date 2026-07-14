import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Role } from '@prisma/client';

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.person.findMany();
  }

  async findMany(query: string, clerkId: string) {
    // get the details of the one doing the search ie the user
    const user = await this.prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    // if found proceed

    // get the allowed acccess scope of the user
    const accessScopes = await this.prisma.userAccessScope.findMany({
      where: { user_id: user.id, revoked_at: null },
    });
    const allowedCategories = accessScopes.map((scope) => scope.category);

    // search person, filter the search results based on the access scope
    if (user.role === Role.superadmin || user.role === Role.data_officer) {
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
    return this.prisma.person.findMany({
      where: {
        OR: [
          { full_name: { contains: query, mode: 'insensitive' } },
          { national_id_no: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        offenses: {
          where: { category: { in: allowedCategories } },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.person.findUnique({ where: { id } });
  }

  verifyPerson(nationalId: string) {
    return this.prisma.person.findUnique({
      where: { national_id_no: nationalId },
      select: { id: true, full_name: true, national_id_no: true }, // only return the fields wanted
    });
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
