import { Role } from '@prisma/client';

export class CreateUserDto {
  full_name: string;
  username: string;
  password: string;
  role: Role;
}
