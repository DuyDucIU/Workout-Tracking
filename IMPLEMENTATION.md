# IMPLEMENTATION.md — Feature Build Plan

Build one complete vertical slice at a time: backend → frontend → verify, then move on.
Status: `[ ]` = todo · `[x]` = done · `[~]` = in progress

---

## Foundation (pre-requisite for everything)

**Backend wiring before any feature can be built.**

- [ ] Fix `pom.xml`: replace non-standard test starters with `spring-boot-starter-test`; add JJWT 0.12.6 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`); add MapStruct 1.6.3 + `mapstruct-processor`; add H2 (test scope); add `mapstruct-processor` to annotation processor paths (after Lombok)
- [ ] Configure `application.properties`: datasource (MySQL), JPA (`ddl-auto=validate`), Flyway, JWT secret/expiry, SpringDoc paths
- [ ] Create `V1__create_schema.sql`: all 8 tables (`users`, `refresh_tokens`, `exercises`, `workout_plans`, `workout_sessions`, `session_exercises`, `workout_logs`, `workout_log_entries`)
- [ ] Create `V2__seed_exercises.sql`: ~35 exercises across all categories/muscle groups (`is_system=TRUE`)
- [ ] Verify: app starts, Flyway runs V1+V2 cleanly, Swagger UI loads at `/swagger-ui.html`

---

## Feature 1 — Authentication

### Backend
- [ ] Enums: `UnitPreference`, `ExerciseCategory`, `MuscleGroup`, `WorkoutDayOfWeek`
- [ ] `User` entity + `RefreshToken` entity (Lombok, JPA)
- [ ] `UserRepository` (`findByEmail`, `existsByEmail`, `existsByUsername`)
- [ ] `RefreshTokenRepository` (`findByToken`, `deleteByUserId`)
- [ ] `JwtConfig` — `@ConfigurationProperties("jwt")` binding secret + expiry
- [ ] `JwtService` — generate access token (15min) + refresh token (7d), validate, extract claims; store `userId` as custom claim; derive `SecretKey` with `Keys.hmacShaKeyFor`
- [ ] `CustomUserDetailsService` — load user by email
- [ ] `JwtAuthenticationFilter` — `OncePerRequestFilter`, reads Bearer token, sets `SecurityContextHolder`
- [ ] `SecurityConfig` — stateless, CSRF off, CORS (`http://localhost:5173`), permit public paths, add JWT filter before `UsernamePasswordAuthenticationFilter`; expose `AuthenticationManager` + `BCryptPasswordEncoder` beans
- [ ] `OpenApiConfig` — register JWT bearer auth scheme so Swagger UI supports Authorize button
- [ ] `AuthService` — register (uniqueness check, bcrypt), login (authenticate, issue tokens, store hashed refresh token), refresh (validate hash, rotate token), logout (revoke token)
- [ ] `AuthController` — `POST /api/v1/auth/{register,login,refresh,logout}`
- [ ] DTOs: `RegisterRequest`, `LoginRequest`, `RefreshRequest`, `LogoutRequest`, `AuthResponse`
- [ ] `GlobalExceptionHandler` + exception classes (`ResourceNotFoundException`, `AccessDeniedException`, `DuplicateResourceException`, `InvalidTokenException`) + `ErrorResponse`
- [ ] `UserService` — `getMe`, `updateMe`, `changePassword`
- [ ] `UserController` — `GET/PATCH /api/v1/users/me`, `PUT /api/v1/users/me/password`
- [ ] Unit tests: `AuthService` (Mockito), `@WebMvcTest` for `AuthController`

### Frontend
- [ ] Install all dependencies: Tailwind + `@tailwindcss/vite`, shadcn/ui (init), `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `zustand`, `axios`, `recharts`, `react-hook-form`, `@hookform/resolvers`, `zod`, `lucide-react`
- [ ] `vite.config.ts`: add Tailwind plugin + proxy `/api → http://localhost:8080`
- [ ] `src/index.css`: Tailwind directives + shadcn CSS variables (light + dark, sky/emerald accent)
- [ ] Remove all Vite boilerplate (App.css, template assets, placeholder content in App.tsx)
- [ ] `src/store/authStore.ts` — Zustand: `accessToken`, `user`, `setAuth`, `clearAuth`
- [ ] `src/store/themeStore.ts` — Zustand + persist: `'light' | 'dark'`, `toggleTheme`; apply `dark` class to `<html>`
- [ ] `src/lib/api.ts` — Axios instance; request interceptor attaches `Authorization: Bearer`; response interceptor: 401 → silent refresh → retry (queue concurrent 401s with `isRefreshing` flag); on refresh failure → `clearAuth()` + redirect `/login`
- [ ] `src/lib/queryClient.ts` — TanStack Query client
- [ ] `src/lib/utils.ts` — `cn()` + `kgToLbs` / `lbsToKg`
- [ ] `src/types/auth.ts`, `src/types/user.ts`
- [ ] `src/router/ProtectedRoute.tsx` — redirect to `/login` if no `accessToken` in store
- [ ] `src/main.tsx` — `QueryClientProvider` + `RouterProvider`
- [ ] `src/App.tsx` — route definitions; public routes: `/login`, `/register`; protected: all others
- [ ] `components/shared/ThemeToggle.tsx`
- [ ] `components/shared/LoadingSpinner.tsx`, `ErrorMessage.tsx`
- [ ] `components/layout/AuthLayout.tsx` — centered card layout
- [ ] `components/layout/Sidebar.tsx`, `TopBar.tsx`, `AppLayout.tsx` — app shell (nav + theme toggle + user menu with logout)
- [ ] `components/auth/LoginForm.tsx` — email + password, Zod schema, react-hook-form
- [ ] `components/auth/RegisterForm.tsx` — email + username + password + confirm
- [ ] `hooks/useAuth.ts` — login/register mutations, logout, current user query
- [ ] `pages/LoginPage.tsx`, `pages/RegisterPage.tsx`
- [ ] `pages/DashboardPage.tsx` — placeholder "Welcome" page (will be filled in Feature 5)

### Verify Feature 1
- [ ] Register a new user → 201, tokens returned
- [ ] Login → access + refresh tokens received, stored in `authStore`
- [ ] Accessing `/users/me` without token → 401
- [ ] Accessing `/users/me` with token → 200, user object
- [ ] Frontend: register → redirected to dashboard; logout → redirected to login; refresh page → still logged in (token in store); expired access token → silent refresh happens transparently

---

## Feature 2 — Exercise Catalog

### Backend
- [ ] `Exercise` entity
- [ ] `ExerciseRepository` — findAll with dynamic filter (category, muscleGroup, name search), pageable
- [ ] `ExerciseDto`
- [ ] `ExerciseMapper` (MapStruct)
- [ ] `ExerciseService` — paginated list with optional filters
- [ ] `ExerciseController` — `GET /api/v1/exercises?category&muscleGroup&search&page&size`, `GET /api/v1/exercises/{id}`
- [ ] Unit test: `ExerciseService`

### Frontend
- [ ] `src/types/exercise.ts`
- [ ] `hooks/useExercises.ts` — paginated/filtered list query
- [ ] `components/plans/ExercisePicker.tsx` — searchable combobox (shadcn `Command` + `Popover`) with category/muscle-group filter chips

### Verify Feature 2
- [ ] `GET /api/v1/exercises` returns seeded exercises with pagination
- [ ] Filter by `category=STRENGTH` returns only strength exercises
- [ ] Frontend `ExercisePicker` opens, searches by name, shows results

---

## Feature 3 — Workout Plans & Sessions

### Backend
- [ ] Entities: `WorkoutPlan`, `WorkoutSession`, `SessionExercise`
- [ ] Repositories: `WorkoutPlanRepository`, `WorkoutSessionRepository`, `SessionExerciseRepository`
- [ ] DTOs: `WorkoutPlanDto`, `WorkoutPlanSummaryDto`, `CreatePlanRequest`, `UpdatePlanRequest`, `SessionDto`, `CreateSessionRequest`, `UpdateSessionRequest`, `SessionExerciseDto`, `CreateSessionExerciseRequest`, `UpdateSessionExerciseRequest`
- [ ] Mappers: `WorkoutPlanMapper`, `WorkoutSessionMapper`, `SessionExerciseMapper`
- [ ] `WorkoutPlanService` — CRUD + ownership check helper (`assertOwnership`)
- [ ] `WorkoutSessionService` — CRUD (validates plan ownership)
- [ ] `SessionExerciseService` — CRUD (validates session → plan → ownership chain)
- [ ] Controllers: `WorkoutPlanController`, `WorkoutSessionController`, `SessionExerciseController`
- [ ] Unit tests for all three services; `@WebMvcTest` for controllers

### Frontend
- [ ] `src/types/plan.ts`, `src/types/session.ts`
- [ ] `hooks/usePlans.ts` — list, detail, create, update, delete
- [ ] `hooks/useSessions.ts` — list, create, update, delete within a plan
- [ ] `components/shared/WeightDisplay.tsx` — unit-aware weight renderer
- [ ] `components/shared/ConfirmDialog.tsx` — shadcn `AlertDialog` wrapper for deletes
- [ ] `components/plans/PlanCard.tsx` — summary card (name, session count, active badge)
- [ ] `components/plans/PlanForm.tsx` — create/edit (name, description, active toggle)
- [ ] `components/plans/SessionCard.tsx` — session card with day-of-week chip
- [ ] `components/plans/SessionForm.tsx` — create/edit session (name, day-of-week)
- [ ] `components/plans/SessionExerciseRow.tsx` — inline sets/reps/weight/notes editor
- [ ] `pages/PlansPage.tsx` — list of plans + "New Plan" button
- [ ] `pages/CreatePlanPage.tsx` — plan form
- [ ] `pages/PlanDetailPage.tsx` — plan info + session list + exercise builder per session (add/edit/remove exercises with `ExercisePicker`)

### Verify Feature 3
- [ ] Create a plan with 2 sessions, each with 3 exercises → persists correctly
- [ ] Update plan name, session day, exercise weight → all update correctly
- [ ] Delete an exercise from a session; delete a session; delete a plan → cascade works
- [ ] Attempting to access another user's plan → 403
- [ ] Frontend: full create/edit/delete flow works end-to-end with correct loading/error states

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
