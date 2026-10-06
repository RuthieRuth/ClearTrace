/*
  Warnings:

  - The values [ready] on the enum `request_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "request_status_new" AS ENUM ('submitted', 'in_review', 'approved', 'rejected', 'accessed', 'expired');
ALTER TABLE "public"."requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "requests" ALTER COLUMN "status" TYPE "request_status_new" USING ("status"::text::"request_status_new");
ALTER TYPE "request_status" RENAME TO "request_status_old";
ALTER TYPE "request_status_new" RENAME TO "request_status";
DROP TYPE "public"."request_status_old";
ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'submitted';
COMMIT;
