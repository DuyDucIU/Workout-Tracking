# Backend

## Base package

`com.duyduciu.workout_tracking`

## Package structure

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

## Naming conventions

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

## API docs config (application.properties)

```properties
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

Swagger UI available at `http://localhost:8080/swagger-ui.html` when running locally.

## Testing strategy

- JUnit 5 unit tests for service layer + MockMvc integration tests for controllers
- Test sources: `backend/src/test/java/com/duyduciu/workout_tracking/`
- Unit test class: `<ClassName>Test.java` | Integration test: `<ClassName>IntegrationTest.java`
- Always run `./mvnw test` and confirm green before declaring a feature done

## Common gotchas

- **JJWT 0.12.x**: use `.subject()`, `.issuedAt()`, `.expiration()` (not `set*()` variants); parse with `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)`
- **MapStruct + Lombok order**: Lombok processor must come before MapStruct in `maven-compiler-plugin` annotation processor paths; if MapStruct bean is missing at runtime, run `mvnw clean`
- **ddl-auto=validate**: never change to `create` or `update` — see [database.md](database.md)
- **Bodyweight exercises**: `weight_kg` / `actual_weight_kg` are nullable — never assume non-null
- **Snapshot fields**: log name snapshot columns preserve history when plans/exercises are deleted — always populate them at log creation time
