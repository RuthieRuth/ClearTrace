import { Role, AgencyType } from '@prisma/client';

export class CreateUserDto {
  full_name: string;
  username: string;
  password: string;
  role: Role;
  agency_type?: AgencyType;
  company_id?: string;
}
