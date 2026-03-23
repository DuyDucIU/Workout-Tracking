# IMPLEMENTATION.md — Feature Build Plan

Build one complete vertical slice at a time: backend → frontend → verify, then move on.
Status: `[ ]` = todo · `[x]` = done · `[~]` = in progress

---

## Foundation (pre-requisite for everything)

**Backend wiring before any feature can be built.**

- [x] Fix `pom.xml`: replace non-standard test starters with `spring-boot-starter-test`; add JJWT 0.12.6 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`); add MapStruct 1.6.3 + `mapstruct-processor`; add H2 (test scope); add `mapstruct-processor` to annotation processor paths (after Lombok)
- [x] Configure `application.properties`: datasource (MySQL), JPA (`ddl-auto=validate`), Flyway, JWT secret/expiry, SpringDoc paths
- [x] Create `V1__create_schema.sql`: all 8 tables (`users`, `refresh_tokens`, `exercises`, `workout_plans`, `workout_sessions`, `session_exercises`, `workout_logs`, `workout_log_entries`)
- [x] Create `V2__seed_exercises.sql`: ~35 exercises across all categories/muscle groups (`is_system=TRUE`)
- [x] Verify: app starts, Flyway runs V1+V2 cleanly, Swagger UI loads at `/swagger-ui.html`

---

## Feature 1 — Authentication

### Backend
- [x] Enums: `UnitPreference`, `ExerciseCategory`, `MuscleGroup`, `WorkoutDayOfWeek`
- [x] `User` entity + `RefreshToken` entity (Lombok, JPA)
- [x] `UserRepository` (`findByEmail`, `existsByEmail`, `existsByUsername`)
- [x] `RefreshTokenRepository` (`findByToken`, `deleteByUserId`)
- [x] `JwtConfig` — `@ConfigurationProperties("jwt")` binding secret + expiry
- [x] `JwtService` — generate access token (15min) + refresh token (7d), validate, extract claims; store `userId` as custom claim; derive `SecretKey` with `Keys.hmacShaKeyFor`
- [x] `CustomUserDetailsService` — load user by email
- [x] `JwtAuthenticationFilter` — `OncePerRequestFilter`, reads Bearer token, sets `SecurityContextHolder`
- [x] `SecurityConfig` — stateless, CSRF off, CORS (`http://localhost:5173`), permit public paths, add JWT filter before `UsernamePasswordAuthenticationFilter`; expose `AuthenticationManager` + `BCryptPasswordEncoder` beans
- [x] `OpenApiConfig` — register JWT bearer auth scheme so Swagger UI supports Authorize button
- [x] `AuthService` — register (uniqueness check, bcrypt), login (authenticate, issue tokens, store hashed refresh token), refresh (validate hash, rotate token), logout (revoke token)
- [x] `AuthController` — `POST /api/v1/auth/{register,login,refresh,logout}`
- [x] DTOs: `RegisterRequest`, `LoginRequest`, `RefreshRequest`, `LogoutRequest`, `AuthResponse`
- [x] `GlobalExceptionHandler` + exception classes (`ResourceNotFoundException`, `AccessDeniedException`, `DuplicateResourceException`, `InvalidTokenException`) + `ErrorResponse`
- [x] `UserService` — `getMe`, `updateMe`, `changePassword`
- [x] `UserController` — `GET/PATCH /api/v1/users/me`, `PUT /api/v1/users/me/password`
- [x] Unit tests: `AuthService` (Mockito), `@WebMvcTest` for `AuthController`

### Frontend
- [x] Install all dependencies: Tailwind + `@tailwindcss/vite`, shadcn/ui (init), `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `zustand`, `axios`, `recharts`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`
- [x] `vite.config.ts`: add Tailwind plugin + proxy `/api → http://localhost:8080`
- [x] `src/index.css`: Tailwind directives + shadcn CSS variables (light + dark, sky/emerald accent)
- [x] Remove all Vite boilerplate (App.css, template assets, placeholder content in App.tsx)
- [x] `src/store/authStore.ts` — Zustand: `accessToken`, `user`, `setAuth`, `clearAuth`
- [x] `src/store/themeStore.ts` — Zustand + persist: `'light' | 'dark'`, `toggleTheme`; apply `dark` class to `<html>`
- [x] `src/lib/api.ts` — Axios instance; request interceptor attaches `Authorization: Bearer`; response interceptor: 401 → silent refresh → retry (queue concurrent 401s with `isRefreshing` flag); on refresh failure → `clearAuth()` + redirect `/login`
- [x] `src/lib/queryClient.ts` — TanStack Query client
- [x] `src/lib/utils.ts` — `cn()` + `kgToLbs` / `lbsToKg`
- [x] `src/types/auth.ts`, `src/types/user.ts`
- [x] `src/router/ProtectedRoute.tsx` — redirect to `/login` if no `accessToken` in store
- [x] `src/main.tsx` — `QueryClientProvider` + `RouterProvider`
- [x] `src/App.tsx` — route definitions; public routes: `/login`, `/register`; protected: all others
- [x] `components/shared/ThemeToggle.tsx`
- [x] `components/shared/LoadingSpinner.tsx`, `ErrorMessage.tsx`
- [x] `components/layout/AuthLayout.tsx` — centered card layout
- [x] `components/layout/Sidebar.tsx`, `TopBar.tsx`, `AppLayout.tsx` — app shell (nav + theme toggle + user menu with logout)
- [x] `components/auth/LoginForm.tsx` — email + password, Zod schema, react-hook-form
- [x] `components/auth/RegisterForm.tsx` — email + username + password + confirm
- [x] `hooks/useAuth.ts` — login/register mutations, logout, current user query
- [x] `pages/LoginPage.tsx`, `pages/RegisterPage.tsx`
- [x] `pages/DashboardPage.tsx` — placeholder "Welcome" page (will be filled in Feature 5)

### Verify Feature 1
- [x] Register a new user → 201, tokens returned
- [x] Login → access + refresh tokens received, stored in `authStore`
- [x] Accessing `/users/me` without token → 401
- [x] Accessing `/users/me` with token → 200, user object
- [x] Frontend: register → redirected to dashboard; logout → redirected to login; refresh page → still logged in (token in store); expired access token → silent refresh happens transparently

---

## Feature 2 — Exercise Catalog

### Backend
- [x] `Exercise` entity
- [x] `ExerciseRepository` — findAll with dynamic filter (category, muscleGroup, name search), pageable
- [x] `ExerciseDto`
- [x] `ExerciseMapper` (MapStruct)
- [x] `ExerciseService` — paginated list with optional filters
- [x] `ExerciseController` — `GET /api/v1/exercises?category&muscleGroup&search&page&size`, `GET /api/v1/exercises/{id}`
- [x] Unit test: `ExerciseService`

### Frontend
- [x] `src/types/exercise.ts`
- [x] `hooks/useExercises.ts` — paginated/filtered list query
- [x] `components/plans/ExercisePicker.tsx` — searchable combobox with category filter chips

### Verify Feature 2
- [x] `GET /api/v1/exercises` returns seeded exercises with pagination
- [x] Filter by `category=STRENGTH` returns only strength exercises
- [x] Frontend `ExercisePicker` opens, searches by name, shows results

---

## Feature 3 — Workout Plans & Sessions

### Backend
- [x] Entities: `WorkoutPlan`, `WorkoutSession`, `SessionExercise`
- [x] Repositories: `WorkoutPlanRepository`, `WorkoutSessionRepository`, `SessionExerciseRepository`
- [x] DTOs: `WorkoutPlanDto`, `WorkoutPlanSummaryDto`, `CreatePlanRequest`, `UpdatePlanRequest`, `SessionDto`, `CreateSessionRequest`, `UpdateSessionRequest`, `SessionExerciseDto`, `CreateSessionExerciseRequest`, `UpdateSessionExerciseRequest`
- [x] Mappers: `WorkoutPlanMapper`, `WorkoutSessionMapper`, `SessionExerciseMapper`
- [x] `WorkoutPlanService` — CRUD + ownership check helper (`assertOwnership`)
- [x] `WorkoutSessionService` — CRUD (validates plan ownership)
- [x] `SessionExerciseService` — CRUD (validates session → plan → ownership chain)
- [x] Controllers: `WorkoutPlanController`, `WorkoutSessionController`, `SessionExerciseController`
- [x] Unit tests: `SessionExerciseServiceTest` (happy path, not-found, ownership enforcement)
- [x] Flyway V3: `day_of_week` nullable; V4: `order_index` nullable

### Frontend
- [x] `src/types/plan.ts`
- [x] `hooks/usePlans.ts` — list, detail, create, update, delete
- [x] `hooks/useSessions.ts` — list, create, update, delete + session exercise CRUD
- [x] `components/shared/WeightDisplay.tsx` — unit-aware weight renderer
- [x] `components/shared/ConfirmDialog.tsx` — native `<dialog>` with centered positioning + click propagation fix
- [x] `components/plans/PlanCard.tsx` — summary card (name, session count, delete with confirm)
- [x] `components/plans/PlanForm.tsx` — create/edit (name, description, active toggle)
- [x] `components/plans/SessionCard.tsx` — expandable session card with day-of-week chip + exercise list
- [x] `components/plans/SessionExerciseRow.tsx` — inline sets/reps/weight/notes display + delete
- [x] `pages/PlansPage.tsx` — list of plans + "New Plan" button
- [x] `pages/CreatePlanPage.tsx` — plan form
- [x] `pages/PlanDetailPage.tsx` — plan info + session list + exercise builder per session

### Verify Feature 3
- [x] Create a plan with sessions and exercises → persists correctly
- [x] Add exercise via picker (search + category filter) → appears in session
- [x] Delete an exercise from a session → cascade works, count updates
- [x] Delete a session (confirm) → removed, plan session count decrements
- [x] Cancel delete dialog → no navigation, no action
- [x] Confirm dialog centered on screen
- [x] Frontend: full create/delete flow verified via Playwright browser tests

---

## Feature 4 — Workout Logging

### Backend
- [ ] Entities: `WorkoutLog`, `WorkoutLogEntry` (with snapshot fields for plan/session/exercise names)
- [ ] `WorkoutLogRepository` — `findByUserIdAndCompletedDateBetween` (pageable)
- [ ] `WorkoutLogEntryRepository`
- [ ] DTOs: `WorkoutLogDto`, `WorkoutLogSummaryDto`, `CreateWorkoutLogRequest`, `CreateLogEntryRequest`
- [ ] `WorkoutLogMapper`
- [ ] `WorkoutLogService` — create log + entries in single transaction, snapshot names at creation time, ownership check
- [ ] `WorkoutLogController` — `GET/POST /api/v1/logs`, `GET/DELETE /api/v1/logs/{id}`
- [ ] Unit test: `WorkoutLogService`; `@DataJpaTest` for date-range query

### Frontend
- [ ] `src/types/log.ts`
- [ ] `hooks/useLogs.ts` — create log mutation, paginated history query
- [ ] `components/logs/ExerciseResultRow.tsx` — actual sets/reps/weight input per exercise
- [ ] `components/logs/LogEntryForm.tsx` — select plan → session → fill in actuals per exercise (pre-populate with plan targets as defaults)
- [ ] `components/logs/LogHistoryItem.tsx` — card: date, session name, exercises summary
- [ ] `pages/LogWorkoutPage.tsx` — guided log creation (plan/session picker → exercise results form)
- [ ] `pages/LogHistoryPage.tsx` — paginated history list with date range filter

### Verify Feature 4
- [ ] Log a completed workout session with all exercises → saved correctly
- [ ] Verify snapshot: delete the plan → log still shows plan name from snapshot
- [ ] History list shows logs sorted by date, paginated
- [ ] Frontend: log flow works end-to-end; history renders correctly

---

## Feature 5 — Reports & Progress

### Backend
- [ ] `ReportService`
  - `getProgressData(userId, exerciseId, from, to)` — per-date: `MAX(actual_weight_kg)`, total volume (sets×reps×weight), total reps
  - `getSummaryStats(userId)` — total workouts, total volume kg, current streak (consecutive days with a log), longest streak
  - `getPersonalRecords(userId)` — `MAX(actual_weight_kg)` per exercise + date achieved
- [ ] DTOs: `ProgressDataPointDto`, `SummaryStatsDto`, `PersonalRecordDto`
- [ ] `ReportController` — `GET /api/v1/reports/progress/{exerciseId}`, `/summary`, `/records`
- [ ] Unit test: `ReportService`

### Frontend
- [ ] `src/types/report.ts`
- [ ] `hooks/useReports.ts` — progress, summary, records queries
- [ ] `components/reports/SummaryStats.tsx` — stat cards (total workouts, volume, current/longest streak)
- [ ] `components/reports/PersonalRecords.tsx` — table: exercise | max weight | date
- [ ] `components/reports/ProgressChart.tsx` — Recharts `LineChart`, exercise selector dropdown, date range picker, tooltips with weight + volume
- [ ] `pages/ReportsPage.tsx` — tab layout: **Overview** (summary stats + PR table) | **Progress** (chart with exercise selector)

### Verify Feature 5
- [ ] Progress endpoint returns correct time-series data
- [ ] Summary stats: total count, streak, volume are accurate
- [ ] PRs correctly identify max weight per exercise
- [ ] Frontend: chart renders, exercise selector updates chart, stats cards display with correct units (kg/lbs based on `unitPref`)

---

## Feature 6 — Dashboard & Profile

### Backend
*(Dashboard uses existing report + log endpoints — no new backend code needed unless a dedicated dashboard endpoint is warranted.)*
- [ ] `UserService.updateUnitPreference(userId, UnitPreference)` — if not already covered in Feature 1

### Frontend
- [ ] `pages/DashboardPage.tsx` — replace placeholder with:
  - Today's scheduled session(s) from active plan (match today's day-of-week)
  - Summary stat mini-cards (total workouts, current streak) — reuse `SummaryStats` data
  - Quick "Log Today's Workout" CTA linking to `LogWorkoutPage`
  - Upcoming sessions this week (next 7 days)
- [ ] `pages/ProfilePage.tsx`
  - Unit preference toggle (kg ↔ lbs) — calls `PATCH /users/me`, updates `authStore.user.unitPref`
  - Change password form (current + new + confirm)

### Verify Feature 6
- [ ] Dashboard shows correct session for today's day-of-week from active plan
- [ ] Switching unit preference → all weights across the app update immediately
- [ ] Password change works; wrong current password → error shown

---

## Polish & Hardening (after all features are done)

- [ ] React error boundaries on all route-level pages
- [ ] Loading skeletons on all data-fetching pages (no bare spinners)
- [ ] Empty states: no plans yet, no logs yet, no chart data
- [ ] Form disabled states during mutation (prevent double-submit)
- [ ] Dark/light theme verified on every page
- [ ] `WeightDisplay` used everywhere — no raw kg values in JSX
- [ ] Swagger UI: all endpoints documented and testable
- [ ] Backend: review and fill any missing unit/integration tests

---

## Out of Scope (Future)
- PDF/CSV export
- Custom user-created exercises
- Social / sharing features
- Mobile app
- Push notifications
