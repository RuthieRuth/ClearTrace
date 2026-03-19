-- CreateEnum
CREATE TYPE "role" AS ENUM ('superadmin', 'government', 'company');

-- CreateEnum
CREATE TYPE "agency_type" AS ENUM ('police', 'immigration', 'courts', 'prisons', 'education', 'health');

-- CreateEnum
CREATE TYPE "offense_category" AS ENUM ('violent', 'financial', 'drug_related', 'minors', 'travel', 'cybercrime', 'property');

-- CreateEnum
CREATE TYPE "conviction_status" AS ENUM ('convicted', 'acquitted', 'pending');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('submitted', 'in_review', 'ready', 'accessed', 'expired');

-- CreateEnum
CREATE TYPE "duplicate_status" AS ENUM ('pending_review', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "offense_event_type" AS ENUM ('CONVICTION_RECORDED', 'SENTENCE_REDUCED', 'SENTENCE_INCREASED', 'CONVICTION_OVERTURNED', 'APPEAL_FILED', 'APPEAL_REJECTED', 'PAROLE_GRANTED', 'PAROLE_REVOKED', 'EARLY_RELEASE', 'SENTENCE_COMPLETED', 'RECORD_CORRECTED');

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "registration_no" VARCHAR(100) NOT NULL,
    "industry" VARCHAR(100) NOT NULL,
    "contact_email" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(20),
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_by_id" UUID,
    "approved_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "role" "role" NOT NULL,
    "agency_type" "agency_type",
    "company_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "first_login" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_access_scope" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category" "offense_category" NOT NULL,
    "granted_by" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "user_access_scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "dob" DATE NOT NULL,
    "national_id_no" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(20),
    "nationality" VARCHAR(100),
    "photo_url" TEXT,
    "address" TEXT,
    "occupation" VARCHAR(150),
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offenses" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "category" "offense_category" NOT NULL,
    "description" TEXT,
    "date_of_offense" DATE NOT NULL,
    "court" VARCHAR(255),
    "case_number" VARCHAR(100),
    "severity" "severity" NOT NULL,
    "conviction_status" "conviction_status" NOT NULL,
    "sentence" VARCHAR(255),
    "sentence_start" DATE,
    "sentence_end" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "added_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offense_events" (
    "id" UUID NOT NULL,
    "offense_id" UUID NOT NULL,
    "event_type" "offense_event_type" NOT NULL,
    "changed_field" VARCHAR(100),
    "previous_value" TEXT,
    "new_value" TEXT,
    "notes" TEXT,
    "changed_by_id" UUID NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offense_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duplicate_flags" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "national_id_no" VARCHAR(50) NOT NULL,
    "flagged_by_id" UUID NOT NULL,
    "status" "duplicate_status" NOT NULL DEFAULT 'pending_review',
    "notes" TEXT,
    "flagged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_id" UUID,

    CONSTRAINT "duplicate_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "requested_by_id" UUID NOT NULL,
    "purpose" VARCHAR(100) NOT NULL,
    "status" "request_status" NOT NULL DEFAULT 'submitted',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" UUID,
    "approved_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "accessed_at" TIMESTAMP(3),
    "access_count" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "person_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_registration_no_key" ON "companies"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "persons_national_id_no_key" ON "persons"("national_id_no");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_access_scope" ADD CONSTRAINT "user_access_scope_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_access_scope" ADD CONSTRAINT "user_access_scope_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offenses" ADD CONSTRAINT "offenses_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offenses" ADD CONSTRAINT "offenses_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offense_events" ADD CONSTRAINT "offense_events_offense_id_fkey" FOREIGN KEY ("offense_id") REFERENCES "offenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offense_events" ADD CONSTRAINT "offense_events_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_flags" ADD CONSTRAINT "duplicate_flags_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_flags" ADD CONSTRAINT "duplicate_flags_flagged_by_id_fkey" FOREIGN KEY ("flagged_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duplicate_flags" ADD CONSTRAINT "duplicate_flags_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
