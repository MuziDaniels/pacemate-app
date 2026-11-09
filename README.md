# PaceMate v2

Real-time coaching for runners: live telemetry, a coach in your ear, terrain
awareness, and an AI coach built on clean data. South Africa first (Comrades,
Two Oceans, club running).

This is the production rebuild. The Firebase web prototype and the Django
experiment are history, not dependencies.

## Read first, in order
1. `CONVENTIONS.md` - non-negotiable engineering rules (AI sessions start here)
2. `docs/ARCHITECTURE.md` - system shape and why
3. `docs/adr/` - decisions on record
4. `docs/BUILD_PLAN.md` - vertical slices and acceptance criteria

## Layout
```
apps/mobile      Expo React Native app (runner + coach)
apps/api         Fastify modular monolith (ingestion, sessions, terrain, coach)
packages/shared  Types, pure geo/pace math, design tokens
supabase/        Database migrations (the only way schema changes)
```

## Getting started
```
pnpm install
pnpm typecheck && pnpm lint && pnpm test
```
Mobile and Supabase project setup: see apps/mobile/README.md.
