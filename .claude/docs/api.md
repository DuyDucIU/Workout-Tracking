# API Conventions

## Base path

`/api/v1`

## Data conventions

- All dates: ISO-8601 (`yyyy-MM-dd`)
- All weights: **always kg in the API** — frontend converts for display
- Pagination: `page` (0-indexed) + `size` query params → Spring `Page<T>`

## Endpoint naming

- kebab-case, plural nouns: `/api/v1/workout-plans`
- RESTful: `GET /plans`, `POST /plans`, `GET /plans/:id`, `PUT /plans/:id`, `DELETE /plans/:id`

## Error response shape

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/workout-plans"
}
```

## Status codes

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

## Dev proxy

`vite.config.ts` proxies `/api → http://localhost:8080` — no CORS issues in development.
