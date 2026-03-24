# Feature 4 — Workout Logging Design Spec

**Date:** 2026-03-24
**Status:** Approved
**Approach:** Single endpoint, nested create (atomic)

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Log flow | Guided from plan (select plan -> session -> fill actuals) | Users always log against an existing plan/session |
| Bodyweight weight field | Hidden if plan exercise has no weight | Clean UX, no confusion for bodyweight exercises |
| History filter | Date range (from/to) + pagination, sort newest first | Sufficient for MVP; plan filter unreliable due to SET NULL on delete |
| Delete log | Allowed with ConfirmDialog | Consistent with existing plan delete UX |
| History detail | Expand inline in list | Consistent with SessionCard expand pattern |
| Multiple logs per day | Allowed, no limit | Users may train multiple sessions per day |

---

## Backend

### Entities

#### WorkoutLog

| Field | Type | Notes |
|---|---|---|
| id | Long | PK, auto-increment |
| user | User (ManyToOne LAZY) | FK, not null, CASCADE delete |
| plan | WorkoutPlan (ManyToOne LAZY) | FK, nullable (SET NULL on plan delete) |
| session | WorkoutSession (ManyToOne LAZY) | FK, nullable (SET NULL on session delete) |
| planNameSnap | String | Nullable in DB, always populated on creation — snapshot of plan name |
| sessionNameSnap | String | Nullable in DB, always populated on creation — snapshot of session name |
| completedDate | LocalDate | NOT NULL — date the workout was completed |
| notes | String | Nullable |
| createdAt | LocalDateTime | @PrePersist, @Column(updatable = false) — immutable |
| entries | List\<WorkoutLogEntry\> | OneToMany, CASCADE ALL, orphanRemoval |

#### WorkoutLogEntry

| Field | Type | Notes |
|---|---|---|
| id | Long | PK, auto-increment |
| log | WorkoutLog (ManyToOne LAZY) | FK, CASCADE delete |
| exercise | Exercise (ManyToOne LAZY) | FK, nullable (SET NULL on exercise delete) |
| exerciseNameSnap | String | NOT NULL — snapshot of exercise name |
| actualSets | Integer | |
| actualReps | Integer | |
| actualWeightKg | BigDecimal | Nullable (bodyweight exercises) |
| notes | String | Nullable |

### DTOs

**Request:**
- `CreateWorkoutLogRequest` — record with: `planId` (Long, @NotNull), `sessionId` (Long, @NotNull), `completedDate` (LocalDate, @NotNull), `notes` (String, @Size(max = 2000), nullable), `entries` (List\<CreateLogEntryRequest\>, @NotEmpty)
- `CreateLogEntryRequest` — record with: `exerciseId` (Long, @NotNull), `actualSets` (Integer, @NotNull, @Min(1), @Max(100)), `actualReps` (Integer, @NotNull, @Min(1), @Max(1000)), `actualWeightKg` (BigDecimal, nullable), `notes` (String, @Size(max = 500), nullable)

**DTO package:** `dto/log/` — all log-related DTOs live here

**Response:**
- `WorkoutLogDto` — id, planId, sessionId, planNameSnap, sessionNameSnap, completedDate, notes, createdAt, entries (List\<WorkoutLogEntryDto\>)
- `WorkoutLogSummaryDto` — id, planNameSnap, sessionNameSnap, completedDate, entryCount
- `WorkoutLogEntryDto` — id, exerciseId (nullable), exerciseNameSnap, actualSets, actualReps, actualWeightKg (nullable), notes

### API Endpoints

| Method | Path | Body | Response | Status |
|---|---|---|---|---|
| POST | `/api/v1/logs` | CreateWorkoutLogRequest | WorkoutLogDto | 201 |
| GET | `/api/v1/logs?from&to&page&size` | — | Page\<WorkoutLogSummaryDto\> | 200 |
| GET | `/api/v1/logs/{id}` | — | WorkoutLogDto | 200 |
| DELETE | `/api/v1/logs/{id}` | — | — | 204 |

- `from`/`to` query params are optional ISO dates — omit for all logs
- Default sort: `completedDate DESC, createdAt DESC`
- Ownership check on all endpoints

### Service — WorkoutLogService

**Create flow (single @Transactional):**
1. Get current user from SecurityContext
2. Fetch plan -> assertOwnership(plan.user.id, userId)
3. Fetch session -> verify session belongs to plan (session.plan.id == plan.id)
4. Build WorkoutLog entity, snapshot plan.getName() + session.getName()
5. Batch-fetch all exercises by IDs (`exerciseRepository.findAllById(exerciseIds)`), build ID->Exercise map, then loop entries: lookup exercise from map, snapshot exercise.getName(), build WorkoutLogEntry
6. Save log (cascade saves entries)
7. Return mapped DTO

**List flow (@Transactional readOnly):**
- If from/to provided: `findByUserIdAndCompletedDateBetween(userId, from, to, pageable)`
- If not: `findByUserId(userId, pageable)`
- Map to WorkoutLogSummaryDto

**GetById flow (@Transactional readOnly):**
- Fetch log with entries (JOIN FETCH)
- assertOwnership
- Map to WorkoutLogDto

**Delete flow (@Transactional):**
- Fetch log, assertOwnership, delete (CASCADE removes entries)

### Mappers

- `WorkoutLogMapper` (`mapper/WorkoutLogMapper.java`) — `@Mapper(componentModel = "spring", uses = {WorkoutLogEntryMapper.class})`; toDto (with entries), toSummaryDto (with computed entryCount)
- `WorkoutLogEntryMapper` (`mapper/WorkoutLogEntryMapper.java`) — `@Mapper(componentModel = "spring")`; toDto; maps exercise.id -> exerciseId (nullable)

### Repositories

- `WorkoutLogRepository` extends JpaRepository
  - `Page<WorkoutLog> findByUserId(Long userId, Pageable pageable)` — sorting handled via `PageRequest.of(page, size, Sort.by(Sort.Order.desc("completedDate"), Sort.Order.desc("createdAt")))` in service
  - `Page<WorkoutLog> findByUserIdAndCompletedDateBetween(Long userId, LocalDate from, LocalDate to, Pageable pageable)` — same sort strategy via Pageable
  - `@Query` with LEFT JOIN FETCH entries for getById
- `WorkoutLogEntryRepository` extends JpaRepository (minimal — entries accessed via log, included for consistency with existing pattern)

### Tests

- `WorkoutLogServiceTest` (unit, Mockito):
  - Happy path: create log with entries -> snapshots populated, saved correctly
  - Ownership violation: wrong user -> AccessDeniedException
  - Session not in plan: -> ResourceNotFoundException
  - Not found: invalid log ID -> ResourceNotFoundException
- `@DataJpaTest` for date-range query verification (optional, verifies repository method)

---

## Frontend

### Types (`src/types/log.ts`)

```typescript
interface WorkoutLogDto {
  id: number
  planId: number | null
  sessionId: number | null
  planNameSnap: string
  sessionNameSnap: string
  completedDate: string
  notes: string | null
  createdAt: string
  entries: WorkoutLogEntryDto[]
}

interface WorkoutLogSummaryDto {
  id: number
  planNameSnap: string
  sessionNameSnap: string
  completedDate: string
  entryCount: number
}

interface WorkoutLogEntryDto {
  id: number
  exerciseId: number | null
  exerciseNameSnap: string
  actualSets: number
  actualReps: number
  actualWeightKg: number | null
  notes: string | null
}

interface CreateWorkoutLogRequest {
  planId: number
  sessionId: number
  completedDate: string
  notes?: string
  entries: CreateLogEntryRequest[]
}

interface CreateLogEntryRequest {
  exerciseId: number
  actualSets: number
  actualReps: number
  actualWeightKg?: number
  notes?: string
}
```

### Hooks (`src/hooks/useLogs.ts`)

- `useLogs(from?, to?, page, size)` — useQuery, queryKey: `['logs', { from, to, page, size }]`, returns Page\<WorkoutLogSummaryDto\>
- `useLog(id)` — useQuery, queryKey: `['logs', id]`, enabled: !!id, returns WorkoutLogDto
- `useCreateLog()` — useMutation, onSuccess: invalidate `['logs']`, navigate to `/history`
- `useDeleteLog()` — useMutation, onSuccess: invalidate `['logs']`

### Pages

#### LogWorkoutPage (`/log`) — Guided 3-step flow

1. **Select plan** — Dropdown of user's plans. Active plan pre-selected as default.
2. **Select session** — After plan is selected, show session list to pick from.
3. **Fill actuals** — Form with exercises from selected session:
   - Each exercise pre-populated with plan target values (sets/reps/weight) as defaults
   - User adjusts actual values
   - Date picker (defaults to today)
   - Optional notes textarea
   - Submit button

#### LogHistoryPage (`/history`) — Paginated list

- Date range picker (from/to) at top
- List of LogHistoryItem cards, newest first
- Pagination controls at bottom
- Empty state when no logs exist

### Components

#### ExerciseResultRow (`components/logs/ExerciseResultRow.tsx`)
- One row per exercise in the log form
- Shows: exercise name (read-only label), actual sets input, actual reps input
- Conditionally shows actual weight input (hidden if plan exercise weightKg is null)
- Optional notes input
- Pre-populated with plan target values

#### LogEntryForm (`components/logs/LogEntryForm.tsx`)
- Contains list of ExerciseResultRow components
- Date picker (defaults to today)
- Notes textarea
- Submit button with loading state
- react-hook-form + Zod validation

#### LogHistoryItem (`components/logs/LogHistoryItem.tsx`)
- Expandable card (click to toggle)
- Collapsed: completed date, session name snap, plan name snap, entry count
- Expanded: list of entries showing exercise name, actual sets/reps, weight (via WeightDisplay)
- Delete button -> ConfirmDialog -> delete

### UX Details

- Weight display: always use `<WeightDisplay>` component, never raw kg
- Forms: react-hook-form + Zod schema validation, shadcn Form wrapper
- Error handling: Axios error extraction pattern (consistent with existing components)
- Loading states: disable submit during mutation, show LoadingSpinner for queries
- Empty states: friendly message when no plans exist (link to create plan), when no logs exist
- Edge case: if selected plan has zero sessions, disable session step and show message
- Swagger annotations: `@Tag`, `@SecurityRequirement(name = "bearerAuth")`, `@Operation` on all controller methods (consistent with existing controllers)
