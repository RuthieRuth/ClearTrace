import { RequestStatus } from '@prisma/client';

export class UpdateRequestDto {
  status: RequestStatus;
}
