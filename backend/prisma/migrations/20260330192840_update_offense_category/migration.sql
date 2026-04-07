/*
  Warnings:

  - The values [violent,financial,drug_related,minors,travel,cybercrime,property] on the enum `offense_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- Clear existing data using old enum values before altering the enum
DELETE FROM "user_access_scope";
DELETE FROM "offenses";

-- AlterEnum
BEGIN;
CREATE TYPE "offense_category_new" AS ENUM ('offenses_against_person', 'offenses_against_property', 'offenses_against_public_order', 'offenses_against_state', 'narcotic_offenses', 'sexual_offenses', 'offenses_involving_minors', 'economic_and_financial_offenses', 'cybercrime_offenses', 'road_traffic_offenses', 'immigration_offenses');
ALTER TABLE "user_access_scope" ALTER COLUMN "category" TYPE "offense_category_new" USING ("category"::text::"offense_category_new");
ALTER TABLE "offenses" ALTER COLUMN "category" TYPE "offense_category_new" USING ("category"::text::"offense_category_new");
ALTER TYPE "offense_category" RENAME TO "offense_category_old";
ALTER TYPE "offense_category_new" RENAME TO "offense_category";
DROP TYPE "public"."offense_category_old";
COMMIT;
