# Security

## Public vs protected routes

- **Public:** `POST /api/v1/auth/{register,login,refresh}`, `/swagger-ui/**`, `/v3/api-docs/**`
- **Everything else** requires `Authorization: Bearer <accessToken>`

## JWT flow (Backend)

- Access token: short-lived (15 min default)
- Refresh token: long-lived (7 days default)
- Config in `application.properties`:
  ```properties
  jwt.secret=<256-bit-base64-encoded-secret>
  jwt.access-token-expiration=900000
  jwt.refresh-token-expiration=604800000
  ```
- Key classes: `JwtService`, `JwtAuthenticationFilter`, `CustomUserDetailsService`
- Located in: `backend/src/main/java/.../security/`

## Refresh token rotation

- Refresh tokens stored as `SHA-256(rawToken)` in `refresh_tokens` table
- On every refresh call, the old token is revoked and a new one is issued
- Prevents token replay attacks

## Ownership assertion

Every service method operating on user data must validate ownership before proceeding. Pattern:
```java
assertOwnership(resource.getUserId(), currentUserId);
```
- Throws 403 Forbidden if mismatch
- Applied in every service, not in controllers

## Silent refresh (Frontend — lib/api.ts)

Axios response interceptor on 401:
1. If `!originalRequest._retry`: set `_retry = true`
2. Use `isRefreshing` flag + `failedRequestsQueue` array to deduplicate concurrent 401s
3. Call `POST /api/v1/auth/refresh` with refresh token from `authStore`
4. On success: update `authStore`, retry queued requests
5. On failure: `clearAuth()` + navigate to `/login`

## Spring Security config

- `SecurityConfig` in `config/` package
- **DaoAuthenticationProvider (Spring Boot 4):** no-arg constructor removed — use `new DaoAuthenticationProvider(userDetailsService)` and call only `setPasswordEncoder()`; `setUserDetailsService()` no longer exists
