# CLAUDE.md — Workout Tracker Project Guide

Source of truth for conventions, structure, and commands.
**Keep this file up to date as features are built.**

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
| Auth | Spring Security 6 + JJWT | JJWT 0.12.6 |
| Mapping | MapStruct | 1.6.3 |
| Boilerplate | Lombok | — |
| API docs | SpringDoc OpenAPI (Swagger UI) | 3.0.2 |
| Frontend | React + TypeScript + Vite | React 19, TS 5.9, Vite 8 |
| UI | shadcn/ui + Tailwind CSS | — |
| Routing | React Router | v7 |
| Server state | TanStack Query | — |
| Client state | Zustand (with persist) | — |
| HTTP | Axios | — |
| Charts | Recharts | — |
| Forms | react-hook-form + Zod | — |
| Icons | lucide-react | — |

---

## Repository Layout

```
Workout-Tracking/
├── backend/          Spring Boot application
├── frontend/         React + Vite application
├── CLAUDE.md         This file — project conventions
└── IMPLEMENTATION.md Feature-by-feature build checklist
```

---

## Backend

### Base package
`com.duyduciu.workout_tracking`

### Package structure
```
src/main/java/com/duyduciu/workout_tracking/
├── config/           SecurityConfig, JwtConfig, OpenApiConfig
├── security/         JwtService, JwtAuthenticationFilter, CustomUserDetailsService
├── entity/           JPA entities (one file per table)
├── enums/            UnitPreference, ExerciseCategory, MuscleGroup, WorkoutDayOfWeek
├── repository/       Spring Data JPA interfaces (one per entity)
├── dto/              Subdirectories per domain: auth/, user/, exercise/, plan/,
│                     session/, sessionexercise/, log/, report/
├── mapper/           MapStruct mappers (one per domain)
├── service/          Business logic (one class per domain)
├── controller/       REST controllers (mirrors service, one per domain)
└── exception/        GlobalExceptionHandler, custom exceptions, ErrorResponse
```

### Running the backend
Prefer **IntelliJ** — use the Run button on `WorkoutTrackingApplication`.

When IntelliJ is not available, use the Maven wrapper from the `backend/` directory:
```bash
./mvnw spring-boot:run      # start dev server (Windows: mvnw.cmd)
./mvnw test                 # run all tests
./mvnw package -DskipTests  # build JAR
```

### application.properties — required local setup
Configure before first run. Do not commit credentials.
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workout_tracking?useSSL=false&serverTimezone=UTC
spring.datasource.username=<mysql-user>
spring.datasource.password=<mysql-password>
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
jwt.secret=<256-bit-base64-encoded-secret>
jwt.access-token-expiration=900000
jwt.refresh-token-expiration=604800000
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### Flyway migrations
Location: `backend/src/main/resources/db/migration/`

| File | Purpose |
|------|---------|
| `V1__create_schema.sql` | All 8 tables |
| `V2__seed_exercises.sql` | ~35 seeded system exercises |

Rules:
- Never edit an existing migration file — always create a new `V{n}__description.sql`
- `ddl-auto=validate` — Flyway owns the schema; Hibernate never creates or alters tables

### Database schema (8 tables)

| Table | Key columns |
|-------|-------------|
| `users` | id, email UNIQUE, username UNIQUE, password (bcrypt), unit_pref ENUM('KG','LBS') |
| `refresh_tokens` | id, user_id FK, token (SHA-256 hash), expires_at, revoked |
| `exercises` | id, name UNIQUE, description, category ENUM, muscle_group ENUM, is_system BOOLEAN |
| `workout_plans` | id, user_id FK, name, description, is_active |
| `workout_sessions` | id, plan_id FK CASCADE, name, day_of_week ENUM, order_index |
| `session_exercises` | id, session_id FK CASCADE, exercise_id FK, sets, reps, weight_kg NULLABLE, notes, order_index |
| `workout_logs` | id, user_id FK, plan_id FK SET NULL, session_id FK SET NULL, plan_name_snap, session_name_snap, completed_date DATE, notes |
| `workout_log_entries` | id, log_id FK CASCADE, exercise_id FK SET NULL, exercise_name_snap NOT NULL, actual_sets, actual_reps, actual_weight_kg NULLABLE, notes |

### API conventions
- Base path: `/api/v1`
- All dates: ISO-8601 (`yyyy-MM-dd`)
- All weights: **always kg in the API** — frontend converts for display
- Pagination: `page` (0-indexed) + `size` query params → Spring `Page<T>`
- Error shape: `{ timestamp, status, error, message, path }`

| Status | Meaning |
|--------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (valid token, wrong user) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable (validation errors) |

### Security rules
- Public: `POST /api/v1/auth/{register,login,refresh}`, `/swagger-ui/**`, `/v3/api-docs/**`
- Everything else requires `Authorization: Bearer <accessToken>`
- Ownership validated in service layer — users can only access their own data
- Refresh tokens stored as `SHA-256(rawToken)` in DB; token is rotated on every refresh

### Naming conventions — Backend

| Thing | Convention | Example |
|-------|-----------|---------|
| Classes | PascalCase | `WorkoutPlanService` |
| Methods / fields | camelCase | `findByUserId` |
| Enums / constants | UPPER_SNAKE | `FULL_BODY`, `KG` |
| REST paths | kebab-case, plural nouns | `/api/v1/workout-plans` |
| DTO response | `Dto` suffix | `WorkoutPlanDto` |
| DTO input | `Request` suffix | `CreatePlanRequest` |
| Mappers | `Mapper` suffix | `WorkoutPlanMapper` |
| DB columns | snake_case | `completed_date`, `weight_kg` |
| DB tables | snake_case, plural | `workout_plans` |

### Testing strategy

| Type | Annotation | Scope |
|------|-----------|-------|
| Unit | `@ExtendWith(MockitoExtension.class)` | Service classes |
| Controller | `@WebMvcTest` | Controller classes |
| Repository | `@DataJpaTest` (H2 in-memory) | Repository interfaces |

### Common gotchas — Backend
- **JJWT 0.12.x**: use `.subject()`, `.issuedAt()`, `.expiration()` (not `set*()` variants); parse with `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)`
- **MapStruct + Lombok order**: Lombok processor must come before MapStruct in `maven-compiler-plugin` annotation processor paths
- **ddl-auto=validate**: never change to `create` or `update`
- **Bodyweight exercises**: `weight_kg` / `actual_weight_kg` are nullable — never assume non-null
- **Ownership check**: every service method operating on user data must call `assertOwnership(resource.userId, currentUserId)` before proceeding
- **Snapshot fields**: log name snapshot columns preserve history when plans/exercises are deleted — always populate them at log creation time

---

## Frontend

### Running the frontend
```bash
# From frontend/
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

### Source structure
```
src/
├── lib/
│   ├── api.ts           Axios instance + interceptors (attach token, silent refresh)
│   ├── queryClient.ts   TanStack Query client
│   └── utils.ts         cn() + kgToLbs / lbsToKg
├── store/
│   ├── authStore.ts     accessToken, user (id, email, username, unitPref), setAuth, clearAuth
│   └── themeStore.ts    'light' | 'dark', toggleTheme — persisted to localStorage
├── types/               TypeScript interfaces mirroring backend DTOs
├── hooks/               TanStack Query hooks (one file per domain)
├── components/
│   ├── ui/              shadcn generated — do not hand-edit
│   ├── layout/          AppLayout, Sidebar, TopBar, AuthLayout
│   ├── auth/            LoginForm, RegisterForm
│   ├── plans/           PlanCard, PlanForm, SessionCard, SessionForm, ExercisePicker, SessionExerciseRow
│   ├── logs/            LogEntryForm, LogHistoryItem, ExerciseResultRow
│   ├── reports/         ProgressChart, SummaryStats, PersonalRecords
│   └── shared/          ThemeToggle, LoadingSpinner, ErrorMessage, ConfirmDialog, WeightDisplay
├── pages/               One file per route
└── router/
    └── ProtectedRoute.tsx
```

### Pages & routes

| Path | Page | Auth |
|------|------|------|
| `/login` | `LoginPage` | Public |
| `/register` | `RegisterPage` | Public |
| `/` | `DashboardPage` | Protected |
| `/plans` | `PlansPage` | Protected |
| `/plans/new` | `CreatePlanPage` | Protected |
| `/plans/:id` | `PlanDetailPage` | Protected |
| `/log` | `LogWorkoutPage` | Protected |
| `/history` | `LogHistoryPage` | Protected |
| `/reports` | `ReportsPage` | Protected |
| `/profile` | `ProfilePage` | Protected |

### Naming conventions — Frontend

| Thing | Convention | Example |
|-------|-----------|---------|
| React components | PascalCase files | `PlanCard.tsx` |
| Hooks | `use` prefix | `usePlans.ts` |
| Stores | `Store` suffix | `authStore.ts` |
| Types/interfaces | PascalCase | `WorkoutPlanDto` |
| Utility functions | camelCase | `kgToLbs` |
| CSS | Tailwind utilities only — no custom CSS except `index.css` |
| API calls | Only in `lib/api.ts` or hook files — never inline `axios` in components |

### Theme system
- CSS variables in `src/index.css` following shadcn convention
- Dark/light: `themeStore.toggleTheme` sets `dark` class on `<html>`
- Palette: slate base, accent `sky` (light blue) or `emerald` (green) — no red, yellow, orange

### Weight display rule
Always use `<WeightDisplay value={weightInKg} />` to render weights.
It reads `unitPref` from `authStore` and converts automatically.
Never format weights inline in components.

### Forms rule
All forms use `react-hook-form` + Zod schema validation.
Use shadcn `<Form>` wrapper for consistent error display.
Zod schemas live co-located with the form component.

### Axios silent refresh (lib/api.ts)
Response interceptor on 401:
1. If `!originalRequest._retry`: set `_retry = true`
2. Use `isRefreshing` flag + `failedRequestsQueue` array to deduplicate concurrent 401s
3. Call `POST /api/v1/auth/refresh` with refresh token from `authStore`
4. On success: update `authStore`, retry queued requests
5. On failure: `clearAuth()` + navigate to `/login`

### API proxy (dev)
`vite.config.ts` proxies `/api → http://localhost:8080` — no CORS issues in development.
