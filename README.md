# Workout Tracking

A full-stack workout tracking application for planning, logging, and analyzing strength training sessions. Built for lifters who want a structured way to create workout plans, record completed sessions, and track progress over time.

---

## Tech Stack

**Backend**
- Java 25 · Spring Boot 4.0.3
- Spring Security 6 + JJWT 0.12.6 (JWT auth with refresh tokens)
- Spring Data JPA / Hibernate · MapStruct · Lombok
- MySQL 8+ · Flyway (schema migrations)
- SpringDoc OpenAPI (Swagger UI)
- Maven

**Frontend**
- React 19 · TypeScript 5.9 · Vite 8
- shadcn/ui · Tailwind CSS
- React Router v7 · TanStack Query · Zustand
- Axios · react-hook-form + Zod · Recharts

---

## Features

- **Authentication** — JWT-based register/login with silent refresh token rotation; sessions persist across page reloads
- **Exercise Catalog** — 35+ seeded system exercises searchable by name, category (Strength, Cardio, Flexibility…), and muscle group
- **Workout Plans** — create named plans containing multiple sessions; each session holds an ordered list of exercises with sets, reps, and target weight
- **Workout Logging** — guided log creation: select a plan/session, fill in actual sets/reps/weight per exercise; historical logs are immutable even if the original plan is later deleted (name snapshots)
- **Progress Reports** — per-exercise weight progression over time (line chart), total volume, personal records (max weight per exercise + date)
- **Unit preference** — kg or lbs toggle per user; all weights stored as kg in the API, converted on the frontend via `<WeightDisplay>`
- **Dark / light theme** — system-aware toggle, persisted across sessions

---

## Running Locally

### Prerequisites

- Java 25+
- Node.js 20+ / npm
- MySQL 8+

### 1 — Database

Create a MySQL database:

```sql
CREATE DATABASE workout_tracking;
```

### 2 — Backend configuration

Copy the sample and fill in your values:

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Required properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workout_tracking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=YOUR_BASE64_ENCODED_256BIT_SECRET
jwt.expiration=900000       # 15 min in ms
jwt.refresh-expiration=604800000  # 7 days in ms
```

> **Never commit `application.properties` with real credentials.**  
> Generate a JWT secret with: `openssl rand -base64 32`

### 3 — Start the backend

```bash
cd backend
./mvnw spring-boot:run        # macOS / Linux
mvnw.cmd spring-boot:run      # Windows PowerShell
```

Flyway will run all migrations automatically on startup. The API is available at `http://localhost:8080`.  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 4 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:5173`. Vite proxies all `/api` requests to port 8080 — no CORS configuration needed in development.

---

## API Endpoints

Base path: `/api/v1`  
All protected routes require `Authorization: Bearer <access_token>`.

### Auth

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login → access + refresh tokens |
| `POST` | `/auth/refresh` | Rotate refresh token → new access token |
| `POST` | `/auth/logout` | Revoke refresh token |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/users/me` | Get current user profile |
| `PATCH` | `/users/me` | Update username / unit preference |
| `PUT` | `/users/me/password` | Change password |

### Exercises

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/exercises` | Paginated list; query params: `category`, `muscleGroup`, `search`, `page`, `size` |
| `GET` | `/exercises/{id}` | Get single exercise |

### Workout Plans

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/workout-plans` | List user's plans |
| `POST` | `/workout-plans` | Create a plan |
| `GET` | `/workout-plans/{id}` | Get plan detail |
| `PUT` | `/workout-plans/{id}` | Update plan |
| `DELETE` | `/workout-plans/{id}` | Delete plan (cascades to sessions) |

### Sessions & Session Exercises

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/workout-plans/{planId}/sessions` | List sessions in a plan |
| `POST` | `/workout-plans/{planId}/sessions` | Add a session |
| `PUT` | `/workout-plans/{planId}/sessions/{id}` | Update session |
| `DELETE` | `/workout-plans/{planId}/sessions/{id}` | Delete session |
| `POST` | `/sessions/{sessionId}/exercises` | Add exercise to session |
| `PUT` | `/sessions/{sessionId}/exercises/{id}` | Update session exercise |
| `DELETE` | `/sessions/{sessionId}/exercises/{id}` | Remove exercise from session |

### Workout Logs

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/logs` | Paginated log history; query params: `from`, `to` (ISO date), `page`, `size` |
| `POST` | `/logs` | Create a workout log with entries |
| `GET` | `/logs/{id}` | Get log detail |
| `DELETE` | `/logs/{id}` | Delete log |

### Reports

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/reports/progress/{exerciseId}` | Time-series: max weight + volume per date |
| `GET` | `/reports/summary` | Total workouts, volume, current/longest streak |
| `GET` | `/reports/records` | Personal records (max weight per exercise) |

### Error response shape

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/workout-plans"
}
```

---

## Database Schema

8 tables managed by Flyway:

```
users
  id · email (unique) · username (unique) · password (bcrypt) · unit_pref (KG|LBS)

refresh_tokens
  id · user_id → users · token (SHA-256 hash) · expires_at · revoked

exercises
  id · name (unique) · description · category (ENUM) · muscle_group (ENUM) · is_system

workout_plans
  id · user_id → users · name · description · is_active

workout_sessions
  id · plan_id → workout_plans (CASCADE) · name · day_of_week (ENUM, nullable) · order_index

session_exercises
  id · session_id → workout_sessions (CASCADE) · exercise_id → exercises
     · sets · reps · weight_kg (nullable) · notes · order_index

workout_logs
  id · user_id → users · plan_id → workout_plans (SET NULL)
     · session_id → workout_sessions (SET NULL)
     · plan_name_snap · session_name_snap      ← preserved if plan/session deleted
     · completed_date · notes

workout_log_entries
  id · log_id → workout_logs (CASCADE) · exercise_id → exercises (SET NULL)
     · exercise_name_snap                       ← preserved if exercise deleted
     · actual_sets · actual_reps · actual_weight_kg (nullable) · notes
```

**Key relationships:** `workout_plans → workout_sessions → session_exercises` cascade on delete. Logs use `SET NULL` foreign keys paired with name snapshot columns so history is never lost when a plan or exercise is removed.

---

## Known Limitations & Future Improvements

**Current limitations**
- No custom user-created exercises — only the seeded system library is available
- Dashboard page is a placeholder (Feature 6 not yet implemented)
- Reports & Progress backend is not yet implemented (Feature 5 in progress)
- No export functionality (PDF / CSV)
- No mobile app — web only

**Planned improvements**
- Complete reports & dashboard (summary stats, personal records, progress charts)
- Allow users to create and manage their own exercises
- React error boundaries and loading skeletons on all pages
- Empty states for plans, logs, and chart data
- Social / sharing features
- Push notifications for scheduled sessions
- Support for mobile app
