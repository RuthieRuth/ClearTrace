import { ConvictionStatus, OffenseCategory, Severity } from '@prisma/client';

export class CreateOffenseDto {
  person_id: string;
  category: OffenseCategory;
  date_of_offense: string;
  severity: Severity;
  conviction_status: ConvictionStatus;
  added_by_id: string;
}
