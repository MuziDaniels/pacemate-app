# ADR 0002: Modular monolith, not microservices
Status: Accepted (2026-11-09)

Context: Two founders, 5-10 h/week, pre-launch. Earlier plans sketched five
services (session, route, cheer, voice, gateway); none were built. Real risks
are GPS reliability and realtime fan-out, which services do not fix.

Decision: One deployable Fastify backend with four strictly bounded modules
(ingestion, sessions, terrain, coach). Boundaries lint-enforced. Supabase
Realtime carries all live traffic so the API holds no sockets.

Consequences: One pipeline, one log stream, one local setup. Module seams are
the future service boundaries; extraction triggers are listed in
ARCHITECTURE.md section 5. We accept that a later split costs a few days.
