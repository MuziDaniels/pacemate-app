# ADR 0003: TypeScript end to end; Django branch retired
Status: Accepted (2026-11-09)

Context: Repo contains a contractor-built Django/DRF/Channels backend (django
branch) and founder-built React Native + Supabase mobile work. Two backends
cannot both be real.

Decision: TypeScript everywhere (Expo mobile, Fastify API, shared packages).
The Django branch's code is retired; its specs in docs/ are kept as
requirements input. Written IP assignment from the contractor is required
before any of that branch's code or docs are reused verbatim.

Consequences: Shared types between app and server kill a class of bugs; one
language for two founders and for AI sessions. Python remains available later
for isolated ML workers if ever needed, behind the job queue.
