import { ConvictionStatus, OffenseCategory, Severity } from '@prisma/client';

export class UpdateOffenseDto {
  category?: OffenseCategory;
  date_of_offense?: string;
  severity?: Severity;
  conviction_status?: ConvictionStatus;
  court?: string;
  case_number?: string;
  sentence?: string;
  sentence_start?: string;
  sentence_end?: string;
  is_current?: boolean;
}
