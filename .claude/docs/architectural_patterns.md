# Architectural Patterns

Cross-cutting design patterns observed across the codebase. Consult when building new features to maintain consistency.

---

## Backend Patterns

### 1. Service layer structure

Every service follows the same shape: `@Service`, `@RequiredArgsConstructor`, private helper methods at the bottom.

```java
@Service
@RequiredArgsConstructor
public class WorkoutPlanService {
    private final WorkoutPlanRepository planRepo;
    private final WorkoutPlanMapper planMapper;
    private final UserRepository userRepo;

    // Public methods: list, getById, create, update, delete
    // Private helpers: findOrThrow, assertOwnership, getEmail, getCurrentUserId
}
```

- Constructor injection via Lombok `@RequiredArgsConstructor` — no `@Autowired`
- Dependencies are `private final` fields
- `@Transactional(readOnly = true)` on reads, `@Transactional` on writes

Used in: all services (`WorkoutPlanService`, `WorkoutLogService`, `ExerciseService`, `WorkoutSessionService`, `SessionExerciseService`, `AuthService`)

### 2. Ownership assertion

Every service that operates on user data has a private `assertOwnership` method:

```java
private void assertOwnership(Long resourceUserId, Long currentUserId) {
    if (!resourceUserId.equals(currentUserId)) {
        throw new AccessDeniedException("You do not have access to this resource");
    }
}
```

- Called before every read/update/delete that touches user-owned data
- Current user resolved via `SecurityContextHolder → email → UserRepository`
- Each service has its own `getCurrentUserId()` / `getCurrentUser()` helper

Used in: `WorkoutPlanService`, `WorkoutLogService`, `WorkoutSessionService`, `SessionExerciseService`, `ExerciseService`

### 3. Find-or-throw pattern

Every entity lookup uses a private helper that returns the entity or throws `ResourceNotFoundException`:

```java
private WorkoutPlan findPlanOrThrow(Long planId) {
    return planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found"));
}
```

Used in: all services

### 4. Thin controller, fat service

Controllers contain zero business logic. They delegate to the service and wrap the result in `ResponseEntity`:

```java
@PostMapping
public ResponseEntity<WorkoutPlanDto> create(@Valid @RequestBody CreatePlanRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(planService.create(request));
}
```

- `@Valid` on request body for bean validation
- OpenAPI annotations (`@Operation`, `@Tag`, `@SecurityRequirement`) on every controller
- Return `ResponseEntity<T>` always — never return raw objects

Used in: all controllers

### 5. MapStruct mapper composition

Mappers are interfaces with `@Mapper(componentModel = "spring")`. Complex mappers compose via `uses = {}`:

```java
@Mapper(componentModel = "spring", uses = {WorkoutSessionMapper.class})
public interface WorkoutPlanMapper {
    @Mapping(target = "sessionCount", expression = "java(plan.getSessions().size())")
    WorkoutPlanDto toDto(WorkoutPlan plan);
}
```

- Nullable FK mappings use `@Named` default methods (e.g., `mapPlanId` in `WorkoutLogMapper`)
- `toDto()` for full response, `toSummaryDto()` for list views
- No manual mapping — always MapStruct

Used in: all mappers (`WorkoutPlanMapper`, `WorkoutLogMapper`, `WorkoutLogEntryMapper`, `WorkoutSessionMapper`, `SessionExerciseMapper`, `ExerciseMapper`)

### 6. Centralized error handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) maps exceptions to consistent `ErrorResponse`:

```java
private ResponseEntity<ErrorResponse> buildResponse(
        HttpStatus status, String message, HttpServletRequest request) {
    ErrorResponse body = new ErrorResponse(
            LocalDateTime.now(), status.value(), status.getReasonPhrase(),
            message, request.getRequestURI());
    return ResponseEntity.status(status).body(body);
}
```

Exception → status mapping:
- `ResourceNotFoundException` → 404
- `DuplicateResourceException` → 409
- `AccessDeniedException` → 403
- `MethodArgumentNotValidException` → 422
- `BadCredentialsException` → 401
- Catch-all `Exception` → 500

### 7. Entity timestamp lifecycle

All entities with timestamps use `@PrePersist` / `@PreUpdate` callbacks:

```java
@PrePersist
void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

@PreUpdate
void onUpdate() { updatedAt = LocalDateTime.now(); }
```

- Entities use Lombok `@Getter @Setter @Builder @AllArgsConstructor` + explicit no-arg constructor
- Collection fields use `@Builder.Default` with `new ArrayList<>()`
- Parent → child: `CascadeType.ALL` + `orphanRemoval = true`

### 8. Record-based DTOs with Jakarta Validation

Request DTOs are Java records with inline validation annotations:

```java
public record CreatePlanRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 500) String description,
        boolean isActive
) {}
```

- Immutable by design — no setters
- `@Valid` on controller `@RequestBody` triggers validation automatically
- Response DTOs also records: `WorkoutPlanDto`, `WorkoutLogSummaryDto`, etc.

Used in: all DTOs under `dto/` subdirectories

### 9. Custom @Query for fetch joins

Repositories define JPQL queries with `LEFT JOIN FETCH` to prevent N+1 problems:

```java
@Query("SELECT l FROM WorkoutLog l LEFT JOIN FETCH l.entries WHERE l.id = :id")
Optional<WorkoutLog> findByIdWithEntries(@Param("id") Long id);

@Query("SELECT DISTINCT p FROM WorkoutPlan p LEFT JOIN FETCH p.sessions WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
```

Used in: `WorkoutLogRepository`, `WorkoutPlanRepository`

### 10. JpaSpecificationExecutor for dynamic filtering

`ExerciseRepository` extends `JpaSpecificationExecutor<Exercise>` for runtime-built queries:

```java
Specification<Exercise> spec = (root, query, cb) -> cb.conjunction();
if (category != null) {
    spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
}
return exerciseRepository.findAll(spec, pageable).map(exerciseMapper::toDto);
```

Used in: `ExerciseService` (exercise listing with optional filters)

### 11. Snapshot preservation

When logging a workout, snapshot fields capture the current name of plan/session/exercise so history survives deletions:

```java
WorkoutLog log = WorkoutLog.builder()
        .planNameSnap(plan.getName())
        .sessionNameSnap(session.getName())
        .build();

WorkoutLogEntry entry = WorkoutLogEntry.builder()
        .exerciseNameSnap(exercise.getName())
        .build();
```

FKs use `SET NULL` on delete so the snapshot remains even if the original is removed.

---

## Frontend Patterns

### 12. TanStack Query hook structure

One hook file per domain. Each exports named functions following this pattern:

```typescript
// Query: useX (list), useX (single by ID)
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get<WorkoutPlanDto[]>('/workout-plans').then((r) => r.data),
  })
}

// Mutation: useCreateX, useUpdateX, useDeleteX
export function useCreatePlan() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data: CreatePlanRequest) =>
      api.post<WorkoutPlanDto>('/workout-plans', data).then((r) => r.data),
    onSuccess: (plan) => {
      qc.invalidateQueries({ queryKey: ['plans'] })
      navigate(`/plans/${plan.id}`)
    },
  })
}
```

- Queries: `queryKey` is `['domain']` for lists, `['domain', id]` for single
- Mutations: `onSuccess` invalidates related queries + optional navigation
- `enabled: !!id` for conditional single-item queries
- All API calls go through the shared `api` instance — never raw `axios`

Used in: `usePlans.ts`, `useLogs.ts`, `useSessions.ts`, `useExercises.ts`, `useReports.ts`, `useAuth.ts`

### 13. Zustand store pattern

Stores use `create<State>()` with `persist` middleware for data that survives page reload:

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'workout-auth' }
  )
)
```

- State + actions in one object (no separate slice pattern)
- `persist` for auth and theme; name maps to `localStorage` key
- Access outside React via `useAuthStore.getState()` (used in axios interceptors)

Used in: `authStore.ts`, `themeStore.ts`

### 14. Silent refresh with queue

Axios response interceptor deduplicates concurrent 401s using a `failedQueue`:

1. First 401 triggers refresh, sets `isRefreshing = true`
2. Subsequent 401s push to `failedQueue` and await
3. On refresh success: process queue with new token, retry all
4. On refresh failure: `clearAuth()` + redirect to `/login`

This prevents multiple refresh calls when several API requests fail simultaneously.

### 15. Reusable form components

Forms accept `onSubmit`, `defaultValues`, `isPending` props — reused for both create and edit:

```typescript
interface PlanFormProps {
  onSubmit: (values: CreatePlanRequest) => void
  isPending?: boolean
  defaultValues?: Partial<WorkoutPlanDto>
  submitLabel?: string
}
```

- Create mode: `<PlanForm onSubmit={handleCreate} />`
- Edit mode: `<PlanForm onSubmit={handleUpdate} defaultValues={plan} submitLabel="Save Changes" />`

Used in: `PlanForm`, `SessionForm`

### 16. ConfirmDialog for destructive actions

Delete and other destructive actions require confirmation via `ConfirmDialog`:

```typescript
<ConfirmDialog
  title="Delete Plan"
  description={`Delete "${plan.name}" and all its sessions?`}
  onConfirm={() => deletePlan.mutate(plan.id)}
>
  <button>delete</button>
</ConfirmDialog>
```

Used in: `PlanDetailPage`, `SessionCard`

### 17. DTO type mirroring

Frontend TypeScript interfaces mirror backend DTOs 1:1:
- Request types: `Create*Request`, `Update*Request`
- Response types: `*Dto`, `*SummaryDto`
- Shared types in `types/common.ts` (e.g., `PageResponse<T>`)

When a backend DTO changes, the corresponding frontend type must be updated to match.
