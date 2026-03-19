-- ============================================================
-- OFFENSE REGISTRY — PostgreSQL Schema
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE role AS ENUM ('superadmin', 'government', 'company');

CREATE TYPE agency_type AS ENUM (
  'police',
  'immigration',
  'courts',
  'prisons',
  'education',
  'health'
);

CREATE TYPE offense_category AS ENUM (
  'violent',
  'financial',
  'drug_related',
  'minors',
  'travel',
  'cybercrime',
  'property'
);

CREATE TYPE conviction_status AS ENUM (
  'convicted',
  'acquitted',
  'pending'
);

CREATE TYPE severity AS ENUM ('low', 'medium', 'high');

CREATE TYPE request_status AS ENUM (
  'submitted',
  'in_review',
  'ready',
  'accessed',
  'expired'
);

CREATE TYPE duplicate_status AS ENUM (
  'pending_review',
  'resolved',
  'dismissed'
);

CREATE TYPE offense_event_type AS ENUM (
  'CONVICTION_RECORDED',
  'SENTENCE_REDUCED',
  'SENTENCE_INCREASED',
  'CONVICTION_OVERTURNED',
  'APPEAL_FILED',
  'APPEAL_REJECTED',
  'PAROLE_GRANTED',
  'PAROLE_REVOKED',
  'EARLY_RELEASE',
  'SENTENCE_COMPLETED',
  'RECORD_CORRECTED'
);

-- ============================================================
-- COMPANIES
-- (created before users because users reference companies)
-- ============================================================

CREATE TABLE companies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  registration_no  VARCHAR(100) NOT NULL UNIQUE,
  industry         VARCHAR(100) NOT NULL,
  contact_email    VARCHAR(255) NOT NULL,
  contact_phone    VARCHAR(20),
  approved         BOOLEAN NOT NULL DEFAULT FALSE,
  approved_by_id   UUID,                          -- FK added after users table
  approved_at      TIMESTAMP,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(255) NOT NULL,
  username      VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  role          role NOT NULL,
  agency_type   agency_type,                      -- only for government users
  company_id    UUID REFERENCES companies(id),    -- only for company users
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  first_login   BOOLEAN NOT NULL DEFAULT TRUE,    -- force password change on first login
  last_login    TIMESTAMP,
  created_by_id UUID,                             -- FK added below (self-referential)
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- self-referential: who created this user
ALTER TABLE users
  ADD CONSTRAINT fk_users_created_by
  FOREIGN KEY (created_by_id) REFERENCES users(id);

-- companies: who approved this company
ALTER TABLE companies
  ADD CONSTRAINT fk_companies_approved_by
  FOREIGN KEY (approved_by_id) REFERENCES users(id);

-- ============================================================
-- USER ACCESS SCOPE
-- ============================================================

CREATE TABLE user_access_scope (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  category   offense_category NOT NULL,
  granted_by UUID NOT NULL REFERENCES users(id),
  granted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP
);

-- ============================================================
-- PERSONS
-- ============================================================

CREATE TABLE persons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      VARCHAR(255) NOT NULL,
  dob            DATE NOT NULL,
  national_id_no VARCHAR(50) NOT NULL UNIQUE,
  gender         VARCHAR(20),
  nationality    VARCHAR(100),
  photo_url      TEXT,
  address        TEXT,
  occupation     VARCHAR(150),
  is_flagged     BOOLEAN NOT NULL DEFAULT FALSE,  -- true if duplicate detected
  created_by_id  UUID NOT NULL REFERENCES users(id),
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- OFFENSES
-- ============================================================

CREATE TABLE offenses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id         UUID NOT NULL REFERENCES persons(id),
  category          offense_category NOT NULL,
  description       TEXT,
  date_of_offense   DATE NOT NULL,
  court             VARCHAR(255),
  case_number       VARCHAR(100),
  severity          severity NOT NULL,
  conviction_status conviction_status NOT NULL,
  sentence          VARCHAR(255),                 -- e.g. "10 years", "5 years probation"
  sentence_start    DATE,
  sentence_end      DATE,
  is_current        BOOLEAN NOT NULL DEFAULT TRUE, -- false = completed or released
  added_by_id       UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- OFFENSE EVENTS (timeline of changes per offense)
-- ============================================================

CREATE TABLE offense_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offense_id     UUID NOT NULL REFERENCES offenses(id),
  event_type     offense_event_type NOT NULL,
  changed_field  VARCHAR(100),                    -- e.g. "sentence", "conviction_status"
  previous_value TEXT,                            -- what it was before
  new_value      TEXT,                            -- what it changed to
  notes          TEXT,                            -- court order reference, ruling number
  changed_by_id  UUID NOT NULL REFERENCES users(id),
  changed_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DUPLICATE FLAGS
-- ============================================================

CREATE TABLE duplicate_flags (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id      UUID NOT NULL REFERENCES persons(id),
  national_id_no VARCHAR(50) NOT NULL,            -- the ID that triggered the duplicate
  flagged_by_id  UUID NOT NULL REFERENCES users(id),
  status         duplicate_status NOT NULL DEFAULT 'pending_review',
  notes          TEXT,
  flagged_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at    TIMESTAMP,
  resolved_by_id UUID REFERENCES users(id)
);

-- ============================================================
-- REQUESTS (company search requests)
-- ============================================================

CREATE TABLE requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id       UUID NOT NULL REFERENCES persons(id),
  company_id      UUID NOT NULL REFERENCES companies(id),
  requested_by_id UUID NOT NULL REFERENCES users(id),
  purpose         VARCHAR(100) NOT NULL,          -- pre-employment, tenancy, etc.
  status          request_status NOT NULL DEFAULT 'submitted',
  submitted_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMP,
  reviewed_by_id  UUID REFERENCES users(id),
  approved_at     TIMESTAMP,
  expires_at      TIMESTAMP,                      -- 30 days from approved_at
  accessed_at     TIMESTAMP,                      -- first time result was viewed
  access_count    INT NOT NULL DEFAULT 0,         -- how many times result was visited
  notes           TEXT                            -- reviewer notes
);

-- ============================================================
-- AUDIT LOGS (insert only — never update or delete)
-- ============================================================

CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  person_id  UUID REFERENCES persons(id),
  action     VARCHAR(100) NOT NULL,               -- LOGIN, SEARCH, VIEW_RECORD, etc.
  details    JSONB,                               -- additional context as JSON
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES (for common queries) can be deleted
-- ============================================================

-- persons: search by name and national ID
CREATE INDEX idx_persons_full_name     ON persons(full_name);
CREATE INDEX idx_persons_national_id   ON persons(national_id_no);
CREATE INDEX idx_persons_dob           ON persons(dob);

-- offenses: look up by person
CREATE INDEX idx_offenses_person_id    ON offenses(person_id);
CREATE INDEX idx_offenses_category     ON offenses(category);
CREATE INDEX idx_offenses_is_current   ON offenses(is_current);

-- offense events: look up by offense
CREATE INDEX idx_offense_events_offense_id ON offense_events(offense_id);

-- requests: look up by company and status
CREATE INDEX idx_requests_company_id   ON requests(company_id);
CREATE INDEX idx_requests_status       ON requests(status);
CREATE INDEX idx_requests_person_id    ON requests(person_id);

-- audit logs: look up by user and person
CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_person_id  ON audit_logs(person_id);
CREATE INDEX idx_audit_logs_timestamp  ON audit_logs(timestamp);

-- user access scope: look up by user
CREATE INDEX idx_user_access_scope_user_id ON user_access_scope(user_id);