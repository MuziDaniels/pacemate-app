# PaceMate Engineering Conventions

Non-negotiable. Every pull request is checked against this file before merge.
AI-generated code (Fable, Claude Code, anything else) follows these rules or the
diff is rejected. When an AI session starts, this file is the first thing it reads.

## 1. Stack (locked)

Do not introduce alternatives to any of these without a new ADR in `docs/adr/`.

| Concern            | Choice                                               |
|--------------------|------------------------------------------------------|
| Language           | TypeScript, `strict: true`, everywhere               |
| Mobile             | Expo (React Native), React Navigation, Zustand       |
| Backend            | Fastify + Zod validation, one deployable (modular monolith) |
| Database           | Supabase Postgres + PostGIS. All auth via Supabase Auth |
| Realtime           | Supabase Realtime channels                           |
| Background jobs    | pg-boss (Postgres-backed queue, no Redis yet)        |
| Tests              | Vitest. Real GPX fixtures for geo math               |
| Lint/format        | ESLint (with boundary enforcement) + Prettier        |
| Package manager    | pnpm workspaces                                      |
| CI                 | GitHub Actions: typecheck, lint, test on every PR    |

## 2. Architecture rules

1. The backend is a modular monolith. Modules: `ingestion`, `sessions`,
   `terrain`, `coach`. New modules need an ADR.
2. A module is imported ONLY through its `public.ts`. Deep imports across
   modules are a lint error, not a style preference.
3. A module never reads or writes another module's tables. If it needs that
   data, it calls the owning module's public interface.
4. The mobile app talks to Supabase directly for CRUD, auth and realtime
   subscriptions. It talks to the API only for things that need secrets or
   heavy compute (terrain, AI, cheer fan-out).
5. LLM calls never sit in the live-session request path. Live cues come from
   the deterministic rules engine in `coach`. LLM work runs as pg-boss jobs.
6. The backend holds no WebSocket connections. Realtime fan-out goes through
   Supabase channels. (This is the seam that becomes a separate realtime
   service later, if ever needed.)
7. Database schema changes happen only via files in `supabase/migrations/`.
   Never by hand in the dashboard.

## 3. Code rules

- No dead code. No commented-out code. No `TODO` without a linked issue.
- No speculative abstraction. No interface with a single implementation,
  except at a module's `public.ts` boundary.
- No default exports. Named exports only.
- No `any`. `unknown` plus narrowing when genuinely dynamic.
- Every request body and every job payload is parsed with a Zod schema at the
  boundary. Inside the module, types are trusted.
- Errors: expected failures return typed results (`{ ok: false, error }`),
  unexpected ones throw and are caught once at the Fastify error handler.
- Every pure calculation (distance, pace, grade, climb segmentation, GAP) is a
  pure function in `packages/shared` or the owning module, with unit tests
  that run against recorded GPX fixtures, not synthetic straight lines.
- All timestamps UTC in storage (`timestamptz`), formatted at the edge.
- Naming: snake_case in SQL, camelCase in TS, mapping happens in one place
  per module, never ad hoc.

## 4. Mobile rules

- GPS recording is an append-only local log first, network second. The app
  must survive airplane mode for a full run and sync afterwards.
- Every uploaded batch is idempotent: client-generated `(session_id, seq)`
  keys, `on conflict do nothing` on the server.
- No business math in components. Components render; stores and pure
  functions compute.
- Design tokens come from `packages/shared/theme`. No hex codes in screens.

## 5. AI-assisted development rules

- One vertical slice per session, against a written spec with acceptance
  criteria. No "improve the app" prompts.
- The AI writes tests for the spec FIRST, then the implementation.
- A human (Muzi or Maureen) reads every diff in full before merge. If you
  cannot explain a line, it does not merge.
- If the AI wants to add a dependency, it must justify it in the PR
  description against "could 30 lines of our own code do this".
- Reject on sight: emoji section headers in code comments, restating the
  obvious in comments, wrapper functions that only rename, unused options
  objects "for flexibility".

## 6. Definition of done for any slice

1. `pnpm typecheck && pnpm lint && pnpm test` pass locally and in CI.
2. Acceptance criteria in the slice spec demonstrably met (screen recording
   for mobile UI, test output for logic).
3. Migration applied cleanly to a fresh database.
4. No console errors in the app during the happy path.
5. Diff reviewed by a human.
