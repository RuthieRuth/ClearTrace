# ClearTrace

**This project is currently in active development. Features, structure, and documentation are subject to change.**

---

## Overview

ClearTrace is a controlled-access record management system built around a multi-tiered Role-Based Access Control (RBAC) model. A central authority owns and manages the data. Authorised agencies can query it at different permission levels depending on their role. Private companies can submit formal requests to access specific records — such as background checks — through a request and approval workflow.

Every action is logged in a full audit trail. Access is tiered by organisation type and individual role, ensuring each user sees only what they are permitted to see.

In its current form, ClearTrace operates as a single, self-contained registry — equivalent to one tenant in a SaaS model. The architecture is designed with that future in mind: multiple independent registries (e.g. different jurisdictions) could each run as isolated tenants on the same platform.

---

## Status

Work in progress — not ready for production use.

- Authentication and role-based access are functional
- Core data entry and search are in active development
- Architecture and database design are still being refined

---

## Planned features

- Multi-tenant onboarding with organisation-level isolation
- Tiered, role-scoped access to verified records
- Request lifecycle management for cross-organisation data queries
- Complete audit trail of all actions across all tenants
- Duplicate and conflicting record detection and review

---

## Tech stack

- **Frontend** — Next.js, Tailwind CSS
- **Backend** — NestJS, TypeScript
- **Database** — PostgreSQL, Prisma ORM
- **Auth** — Clerk

---

## Project structure

```
cleartrace/
├── frontend/
├── backend/
├── database/
└── README.md
```

---

## Getting started

Local setup instructions will be added once the core modules are stable. Feel free to open an issue with questions in the meantime.

---

## Contributing

Solo project — not accepting external contributions at this time.
