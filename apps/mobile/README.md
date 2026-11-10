# PaceMate mobile (Expo SDK 58)

## Run it
1. `cp .env.example .env` and fill in your Supabase project URL and anon key
2. From repo root: `pnpm install`
3. `cd apps/mobile` then `npx expo start`
4. Scan the QR with Expo Go (Android) or run on an emulator with `a`

If Expo complains about native dependency versions, run
`npx expo install --fix` and commit the result.

## Structure
```
src/theme        Brand tokens (the only place hex codes live)
src/services     Supabase client
src/features     auth, home (one folder per feature: screens + store + service)
src/navigation   Role-aware root navigator
src/components   Shared UI primitives
```
Slice specs live in /docs/BUILD_PLAN.md and /docs/specs/.
