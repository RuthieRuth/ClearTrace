import { User } from '.prisma/client/default';

export class CreatePersonDto {
  full_name: string;
  dob: string;
  national_id_no: string;
  created_by_id: string;
  gender?: string;
  nationality?: string;
  occupation?: string;
  address?: string;
  photo_url?: string;
  created_by: User;
}
