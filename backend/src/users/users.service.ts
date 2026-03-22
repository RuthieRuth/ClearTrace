import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserDto) {
    // 1. Create user in Clerk
    const clerkUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      publicMetadata: { role: data.role },
    });

    try {
      // 2. Save to Postgres
      return this.prisma.user.create({
        data: {
          clerk_id: clerkUser.id,
          full_name: data.full_name,
          username: data.username,
          role: data.role,
          agency_type: data.agency_type || null,
          company_id: data.company_id,
        },
      });
    } catch (error) {
      // If saving to Postgres fails, delete the user from Clerk
      await clerk.users.deleteUser(clerkUser.id);
      throw error;
    }
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
