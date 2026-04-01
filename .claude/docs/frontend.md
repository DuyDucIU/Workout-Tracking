# Frontend

## Source structure

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
│   └── common.ts        Shared types (e.g. Page<T> wrapper)
├── hooks/               TanStack Query hooks (one file per domain)
├── components/
│   ├── ui/              shadcn generated — do not hand-edit
│   ├── layout/          AppLayout, Sidebar, TopBar, AuthLayout
│   ├── auth/            LoginForm, RegisterForm
│   ├── plans/           PlanCard, PlanForm, SessionCard, SessionForm, ExercisePicker, SessionExerciseRow
│   ├── logs/            LogEntryForm, LogHistoryItem, ExerciseResultRow
│   └── shared/          ThemeToggle, LoadingSpinner, ErrorMessage, ConfirmDialog, WeightDisplay
├── pages/               One file per route
└── router/
    └── ProtectedRoute.tsx
```

## Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| React components | PascalCase files | `PlanCard.tsx` |
| Hooks | `use` prefix | `usePlans.ts` |
| Stores | `Store` suffix | `authStore.ts` |
| Types/interfaces | PascalCase | `WorkoutPlanDto` |
| Utility functions | camelCase | `kgToLbs` |
| CSS | Tailwind utilities only — no custom CSS except `index.css` |
| API calls | Only in `lib/api.ts` or hook files — never inline `axios` in components |

## Pages & routes

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
| `/profile` | `ProfilePage` | Protected — not yet built |

## State management

- **Server state:** TanStack Query — all API data fetching via custom hooks in `hooks/`
- **Client state:** Zustand with `persist` middleware — `authStore` (tokens + user), `themeStore` (theme preference)
- Never mix: API data stays in TanStack Query cache, UI/auth state stays in Zustand

## Forms

- All forms use `react-hook-form` + Zod schema validation
- Use shadcn `<Form>` wrapper for consistent error display
- Zod schemas live co-located with the form component
