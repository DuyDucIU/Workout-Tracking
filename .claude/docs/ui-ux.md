# UI & UX Conventions

## Theme system

- CSS variables in `src/index.css` following shadcn convention
- Dark/light mode: `themeStore.toggleTheme` sets `dark` class on `<html>`
- Theme persisted to `localStorage` via Zustand persist middleware

## Color palette

- Base: **slate**
- Accents: **sky** (light blue) or **emerald** (green)
- Avoid: red, yellow, orange as primary accents

## Weight display

Always use `<WeightDisplay value={weightInKg} />` to render weights.
- Reads `unitPref` from `authStore` and converts automatically (kg ↔ lbs)
- Never format weights inline in components
- Conversion utilities in `lib/utils.ts`: `kgToLbs()`, `lbsToKg()`

## Component library

- **shadcn/ui** components live in `components/ui/` — do not hand-edit these files
- Add new shadcn components via CLI: `npx shadcn@latest add <component>`
- All custom components use shadcn primitives for consistency

## Icons

- Use `lucide-react` for all icons
- Import individually: `import { Plus } from 'lucide-react'`

## Layout

- `AppLayout` wraps all protected pages (sidebar + topbar)
- `AuthLayout` wraps login/register pages
- Shared components in `components/shared/`: `LoadingSpinner`, `ErrorMessage`, `ConfirmDialog`
