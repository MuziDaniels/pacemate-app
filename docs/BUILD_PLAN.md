# PaceMate v2 Build Plan

Vertical slices. Each slice ships something demonstrable, has a written spec
before any code, and meets the Definition of Done in `CONVENTIONS.md`.
One slice per AI working session.

## Slice 0: Foundations (this scaffold)
- Monorepo, strict TS, lint with boundary enforcement, CI green on an empty build.
- Canonical schema `0001_core.sql` applied to a fresh Supabase project.
- ADRs 0001-0006 accepted.
- Accept: `pnpm typecheck && pnpm lint && pnpm test` green in CI; migration applies clean.

## Slice 1: Auth + profiles
- Signup/login (email), role selection, PM code generation, profile row via trigger.
- Accept: new user lands on the right home screen after app restart; RLS proven
  by a failing cross-user read test.

## Slice 2: Rock-solid solo run recording
- Background location, append-only local log, offline for a full run, batched
  idempotent upload, live map polyline, distance/time/pace from tested pure functions.
- Accept: 30 min walk test with airplane mode in the middle; zero lost points
  after sync; replayed batch creates zero duplicates.

## Slice 3: Live session (the core product)
- Connection flow via PM code. Coach sees live position + stats over Realtime.
- Coach quick cues -> TTS in runner's ears. Session end -> summary for both.
- Accept: two physical phones, coach sees movement within 5 s, cue heard in
  under 3 s, summary matches runner's screen.

## Slice 4: Terrain engine
- Elevation profile for a route, climb segmentation, lookahead cue
  ("6% climb, 400 m ahead, 900 m long"), grade-adjusted pace in summary.
- Pre-loaded Comrades + Two Oceans profiles.
- Accept: unit tests against real GPX fixtures with known climbs; lookahead
  fires at the right distance on a recorded replay.

## Slice 5: Bluetooth heart rate
- Pair any standard BLE HR strap/watch broadcast, live bpm + zone in session,
  HR stored with telemetry, zone rules in the cue engine.
- Accept: works with a real strap; dropout and reconnect handled mid-run.

## Slice 6: Voice
- In-app coach-runner voice during a live session (LiveKit candidate, verify
  pricing first). Audio ducks TTS cues.
- Accept: call survives screen lock on both platforms for 10 min.

## Slice 7: Health import
- HealthKit + Health Connect one-way import of historical runs for the AI
  coach's context. Not live data.
- Accept: 90 days of history imported and visible in run history.

## Slice 8: AI coach
- 8a: post-run analysis (job queue, LLM, grounded in session + terrain data).
- 8b: plan generation from history + goal race.
- 8c: AI-authored rule tuning for live cues (engine stays deterministic).
- Accept: analysis references real numbers from the run, no hallucinated data;
  POPIA consent + cross-border note shipped before 8a goes live.

## Slice 9: Cheer
- Public token page rebuilt on v2 (live map, stats, message queue -> TTS
  behind coach cues, SOS state).
- Accept: supporter on a laptop sees runner within 5 s, cheer heard on the run.

## Later, explicitly not now
- watchOS companion app (true live HR from Apple Watch)
- Garmin API integration (needs business approval)
- Payments and subscriptions (parked by decision)
- Groups, training programs marketplace

## Honest timeline
At 5-10 founder hours/week with AI doing the heavy lifting: slices 0-4 are a
credible, impressive demo and roughly a quarter's work. The full list is a
year-class effort. Do not promise it all at once.
