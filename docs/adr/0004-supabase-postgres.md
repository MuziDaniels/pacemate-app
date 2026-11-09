# ADR 0004: Supabase (Postgres + PostGIS, Auth, Realtime) as the platform
Status: Accepted (2026-11-09)

Decision: Supabase hosts auth, Postgres with PostGIS, and realtime channels.
The app talks to Supabase directly for CRUD/auth/subscriptions under RLS; the
Fastify API (Railway) handles secrets and heavy compute. Schema changes only
via supabase/migrations. pg-boss on the same Postgres is the job queue, so no
Redis until a measured need.

Consequences: Firestore schema is fully replaced by relational + geospatial
tables. RLS becomes the primary authorization layer and gets its own tests.
