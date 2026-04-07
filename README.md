# ClearTrace

**This project is currently in active development. Features, structure, and documentation are subject to change.**

---

## Overview

ClearTrace is a multi-tenant SaaS platform for centralising access to sensitive records with strict, role-based control and full audit trails. It connects record-holding organisations with authorised third parties who require verified information for legitimate purposes — all through a governed, permission-gated interface.

Access is tiered by organisation type and individual role, ensuring each user sees only what they are permitted to see.

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
