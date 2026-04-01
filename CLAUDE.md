# Workout Tracker

Full-stack workout tracking application. Users create workout plans with sessions and exercises, log completed workouts, and view progress reports. React frontend communicates with a Spring Boot REST API backed by MySQL.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Spring Boot | 4.0.3 |
| Language | Java | 25 |
| Build | Maven (`mvnw` wrapper) | — |
| ORM | Spring Data JPA / Hibernate | — |
| Database | MySQL | 8+ |
| Migrations | Flyway | — |
| Auth | Spring Security 6 + JJWT | 0.12.6 |
| Mapping | MapStruct | 1.6.3 |
| Boilerplate | Lombok | — |
| API docs | SpringDoc OpenAPI | 3.0.2 |
| Frontend | React + TypeScript + Vite | React 19, TS 5.9, Vite 8 |
| UI | shadcn/ui + Tailwind CSS | — |
| Routing | React Router v7 | — |
| Server state | TanStack Query | — |
| Client state | Zustand (persist) | — |
| HTTP | Axios | — |
| Charts | Recharts | — |
| Forms | react-hook-form + Zod | — |

---

## Repository Layout

```
Workout-Tracking/
├── .claude/
│   ├── docs/         Detailed documentation (see Additional Docs below)
│   └── rules/        Auto-loaded rules (workflow)
├── backend/          Spring Boot application
│   └── src/main/java/com/duyduciu/workout_tracking/
│       ├── config/       Security, JWT, OpenAPI config
│       ├── security/     JWT service, filter, user details
│       ├── entity/       JPA entities
│       ├── enums/        UnitPreference, ExerciseCategory, MuscleGroup, WorkoutDayOfWeek
│       ├── repository/   Spring Data JPA interfaces
│       ├── dto/          Request/response DTOs (subdirs per domain)
│       ├── mapper/       MapStruct mappers
│       ├── service/      Business logic
│       ├── controller/   REST controllers
│       └── exception/    Global handler, custom exceptions
├── frontend/         React + Vite application
│   └── src/
│       ├── lib/          Axios client, query client, utils
│       ├── store/        Zustand stores (auth, theme)
│       ├── types/        TypeScript interfaces
│       ├── hooks/        TanStack Query hooks
│       ├── components/   UI components (ui/, layout/, auth/, plans/, logs/, shared/)
│       └── pages/        One file per route
├── CLAUDE.md         This file
└── IMPLEMENTATION.md Feature-by-feature build checklist
```

---

## Key Commands

### Backend (from `backend/`)
```bash
./mvnw spring-boot:run      # start dev server (port 8080)
./mvnw test                 # run all tests
./mvnw package -DskipTests  # build JAR
# Windows PowerShell: use mvnw.cmd instead of ./mvnw
```

### Frontend (from `frontend/`)
```bash
npm run dev       # Vite dev server (port 5173, proxies /api → 8080)
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

---

## Important Caveats

- **Weights are always kg in the API** — frontend converts for display via `<WeightDisplay>`
- **ddl-auto=validate** — Flyway owns the schema; never change to `create` or `update`
- **Never edit existing Flyway migrations** — always create a new `V{n}__description.sql`
- **JJWT 0.12.x** — use `.subject()`, `.issuedAt()`, `.expiration()` (not `set*()` variants)
- **MapStruct + Lombok** — Lombok processor must come before MapStruct in annotation processor config; run `mvnw clean` if `*MapperImpl` is missing
- **DaoAuthenticationProvider (Spring Boot 4)** — no-arg constructor removed; use `new DaoAuthenticationProvider(userDetailsService)`
- **Ownership checks** — every service method on user data must call `assertOwnership()` before proceeding
- **Snapshot fields** — log name snapshot columns preserve history when plans/exercises are deleted; always populate at log creation time
- **Bodyweight exercises** — `weight_kg` / `actual_weight_kg` are nullable; never assume non-null

---

## Additional Documentation

Detailed docs in `.claude/docs/` — consult when working on the relevant area:

| File | Topic |
|------|-------|
| [database.md](.claude/docs/database.md) | Schema (8 tables), Flyway migrations, DB config — when adding entities or migrations |
| [api.md](.claude/docs/api.md) | API conventions, endpoints, status codes, error shape — when writing controllers or FE hooks |
| [security.md](.claude/docs/security.md) | JWT flow, auth rules, ownership, refresh tokens, silent refresh — when touching auth or protected endpoints |
| [backend.md](.claude/docs/backend.md) | Package structure, naming conventions, testing, BE gotchas — when writing any backend code |
| [frontend.md](.claude/docs/frontend.md) | Source structure, naming conventions, routes, state management, forms — when writing any frontend code |
| [ui-ux.md](.claude/docs/ui-ux.md) | Theme, color palette, WeightDisplay, shadcn, icons — when building UI components or pages |
| [architectural_patterns.md](.claude/docs/architectural_patterns.md) | Cross-cutting design patterns and conventions — when designing a new feature or reviewing code |
