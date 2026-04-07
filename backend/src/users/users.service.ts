import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createClerkClient } from '@clerk/backend';

import { OffenseCategory } from '@prisma/client';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // custom queary to get the user details of the one making the request (during sign-in), using the clerk id from the jwt token
  findMe(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerk_id: clerkId },
      include: { user_access_scope: true },
    });
  }

  // read options
  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { user_access_scope: true },
    });
  }

  async create(data: CreateUserDto) {
    // 1. Create user in Clerk
    const clerkUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      publicMetadata: { role: data.role },
    });

    try {
      const newUser = await this.prisma.user.create({
        data: {
          clerk_id: clerkUser.id,
          full_name: data.full_name,
          username: data.username,
          role: data.role,
          agency_type: data.agency_type || null,
          company_id: data.company_id,
        },
      });

      if (data.offense_access && data.offense_access.length > 0) {
        await this.prisma.userAccessScope.createMany({
          data: data.offense_access.map((category) => ({
            user_id: newUser.id,
            category: category as OffenseCategory,
            granted_by: newUser.id,
          })),
        });
      }

      return newUser;
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
