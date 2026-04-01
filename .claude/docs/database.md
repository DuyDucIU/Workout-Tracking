# Database

## Schema (8 tables)

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

### Key relationships

- `workout_plans` → `workout_sessions` → `session_exercises` (CASCADE delete)
- `workout_logs` → `workout_log_entries` (CASCADE delete)
- Logs use `SET NULL` for plan/session/exercise FKs — snapshot fields preserve names when originals are deleted
- `weight_kg` / `actual_weight_kg` are NULLABLE (bodyweight exercises)

## Flyway migrations

Location: `backend/src/main/resources/db/migration/`

| File | Purpose |
|------|---------|
| `V1__create_schema.sql` | All 8 tables |
| `V2__seed_exercises.sql` | ~35 seeded system exercises |
| `V3__alter_workout_sessions_day_of_week_nullable.sql` | Make `day_of_week` nullable |
| `V4__alter_order_index_nullable.sql` | Make `order_index` nullable |
| `V5__add_indexes.sql` | Add `idx_se_exercise_id` on `session_exercises(exercise_id)` |

### Migration rules

- **Never edit an existing migration** — always create a new `V{n}__description.sql`
- `ddl-auto=validate` — Flyway owns the schema; Hibernate never creates or alters tables
- Never change ddl-auto to `create` or `update`

## application.properties — DB config

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workout_tracking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=<your-password>
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

Do not commit credentials.
