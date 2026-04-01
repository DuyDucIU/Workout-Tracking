# Development Workflow

**IMPORTANT:** Must follow superpowers workflow for all feature work and bug fixes.

## Git rules

- Feature: `feature/<name>` | Bug fix: `fix/<name>`
- All work stays on the feature branch for the session
- Merge back to `main` only after end-to-end verification: `./mvnw test` (backend) + `npm run lint && npm run build` (frontend) must be green
- Squash merge preferred — keeps `main` history clean
- If using git worktrees, integrate changes back to the feature branch before pushing
- **Never commit automatically** — only commit when the user explicitly asks. After completing a feature or fix, wait for the user's instruction to commit.

