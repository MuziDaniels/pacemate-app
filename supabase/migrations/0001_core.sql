-- PaceMate v2 canonical core schema
-- Slice 0. Apply to a fresh Supabase project. RLS: default deny, then policies.

create extension if not exists postgis;

-- ============================================================
-- profiles (1:1 with auth.users, created by trigger on signup)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  role text not null check (role in ('runner', 'coach')),
  pace_code text not null unique check (pace_code ~ '^PM-[A-Z0-9]{4,8}$'),
  created_at timestamptz not null default now()
);

-- ============================================================
-- connections (coach <-> runner, request/accept)
-- ============================================================
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles (id),
  runner_id uuid not null references public.profiles (id),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'ended')),
  initiated_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (coach_id, runner_id),
  check (coach_id <> runner_id)
);

-- ============================================================
-- routes (planned or recorded; terrain module owns enrichment)
-- ============================================================
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id),
  name text not null,
  geom geography (linestring, 4326) not null,
  distance_m double precision not null,
  is_public boolean not null default false, -- marquee routes (Comrades etc.)
  created_at timestamptz not null default now()
);

-- terrain module cache: per-segment elevation and grade
create table public.route_segments (
  route_id uuid not null references public.routes (id) on delete cascade,
  seq integer not null,
  start_m double precision not null,  -- distance from route start
  length_m double precision not null,
  elevation_m double precision not null,
  grade_pct double precision not null,
  primary key (route_id, seq)
);

-- ============================================================
-- sessions
-- ============================================================
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  runner_id uuid not null references public.profiles (id),
  connection_id uuid references public.connections (id), -- null = solo run
  route_id uuid references public.routes (id),
  status text not null default 'active'
    check (status in ('active', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  distance_m double precision not null default 0,
  duration_s integer not null default 0,
  avg_pace_s_per_km double precision,
  gap_s_per_km double precision -- grade-adjusted pace, terrain module fills
);

-- telemetry: client supplies seq; replays are no-ops (idempotent batches)
create table public.gps_points (
  session_id uuid not null references public.sessions (id) on delete cascade,
  seq integer not null,
  recorded_at timestamptz not null,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  altitude_m double precision,
  accuracy_m double precision,
  speed_mps double precision,
  primary key (session_id, seq)
);

create table public.hr_samples (
  session_id uuid not null references public.sessions (id) on delete cascade,
  seq integer not null,
  recorded_at timestamptz not null,
  bpm smallint not null check (bpm between 25 and 250),
  primary key (session_id, seq)
);

-- cues: coach quick-cues, rules-engine cues, system alerts. TTS on the phone.
create table public.cues (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  sender_id uuid references public.profiles (id), -- null = engine/system
  kind text not null check (kind in ('coach', 'engine', 'cheer', 'sos')),
  text text not null check (char_length(text) between 1 and 280),
  created_at timestamptz not null default now()
);

-- ============================================================
-- cheer (public, tokenised, expiring)
-- ============================================================
create table public.cheer_tokens (
  token text primary key check (token ~ '^PM-[A-Z0-9]{8}$'),
  session_id uuid not null references public.sessions (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.cheers (
  id uuid primary key default gen_random_uuid(),
  token text not null references public.cheer_tokens (token) on delete cascade,
  sender_name text not null check (char_length(sender_name) between 1 and 40),
  message text not null check (char_length(message) between 1 and 200),
  created_at timestamptz not null default now()
);

-- ============================================================
-- indexes for the hot paths
-- ============================================================
create index idx_sessions_runner on public.sessions (runner_id, started_at desc);
create index idx_sessions_connection_active on public.sessions (connection_id)
  where status = 'active';
create index idx_cues_session on public.cues (session_id, created_at);
create index idx_routes_geom on public.routes using gist (geom);

-- ============================================================
-- RLS: default deny everything, then explicit policies
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.connections    enable row level security;
alter table public.routes         enable row level security;
alter table public.route_segments enable row level security;
alter table public.sessions       enable row level security;
alter table public.gps_points     enable row level security;
alter table public.hr_samples     enable row level security;
alter table public.cues           enable row level security;
alter table public.cheer_tokens   enable row level security;
alter table public.cheers         enable row level security;

-- profiles: read any (PM code lookup), write only your own, role immutable
create policy profiles_select on public.profiles
  for select using (true);
create policy profiles_update on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles p where p.id = auth.uid()));

-- connections: participants read; create as initiator; receiver updates status
create policy connections_select on public.connections
  for select using (auth.uid() in (coach_id, runner_id));
create policy connections_insert on public.connections
  for insert with check (initiated_by = auth.uid() and auth.uid() in (coach_id, runner_id));
create policy connections_update on public.connections
  for update using (auth.uid() in (coach_id, runner_id) and auth.uid() <> initiated_by);

-- routes: owner full access; public routes readable by all
create policy routes_select on public.routes
  for select using (owner_id = auth.uid() or is_public);
create policy routes_insert on public.routes
  for insert with check (owner_id = auth.uid());
create policy routes_delete on public.routes
  for delete using (owner_id = auth.uid());
create policy route_segments_select on public.route_segments
  for select using (exists (
    select 1 from public.routes r
    where r.id = route_id and (r.owner_id = auth.uid() or r.is_public)));

-- sessions: runner owns; connected coach reads
create policy sessions_select on public.sessions
  for select using (
    runner_id = auth.uid()
    or exists (select 1 from public.connections c
               where c.id = connection_id and c.coach_id = auth.uid()
                 and c.status = 'accepted'));
create policy sessions_insert on public.sessions
  for insert with check (runner_id = auth.uid());
create policy sessions_update on public.sessions
  for update using (runner_id = auth.uid());

-- telemetry: runner writes own; runner + connected coach read
create policy gps_points_insert on public.gps_points
  for insert with check (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.runner_id = auth.uid() and s.status = 'active'));
create policy gps_points_select on public.gps_points
  for select using (exists (
    select 1 from public.sessions s
    where s.id = session_id and (
      s.runner_id = auth.uid()
      or exists (select 1 from public.connections c
                 where c.id = s.connection_id and c.coach_id = auth.uid()
                   and c.status = 'accepted'))));
create policy hr_samples_insert on public.hr_samples
  for insert with check (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.runner_id = auth.uid() and s.status = 'active'));
create policy hr_samples_select on public.hr_samples
  for select using (exists (
    select 1 from public.sessions s
    where s.id = session_id and (
      s.runner_id = auth.uid()
      or exists (select 1 from public.connections c
                 where c.id = s.connection_id and c.coach_id = auth.uid()
                   and c.status = 'accepted'))));

-- cues: session participants read; coach or runner write; engine writes via service role
create policy cues_select on public.cues
  for select using (exists (
    select 1 from public.sessions s
    where s.id = session_id and (
      s.runner_id = auth.uid()
      or exists (select 1 from public.connections c
                 where c.id = s.connection_id and c.coach_id = auth.uid()
                   and c.status = 'accepted'))));
create policy cues_insert on public.cues
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.sessions s
      where s.id = session_id and s.status = 'active' and (
        s.runner_id = auth.uid()
        or exists (select 1 from public.connections c
                   where c.id = s.connection_id and c.coach_id = auth.uid()
                     and c.status = 'accepted'))));

-- cheer: NO anon policies. The public cheer page goes through the API
-- (service role) so tokens can be rate-limited and validated server-side.
create policy cheer_tokens_owner on public.cheer_tokens
  for all using (exists (
    select 1 from public.sessions s
    where s.id = session_id and s.runner_id = auth.uid()));

-- ============================================================
-- profile auto-creation on signup
-- PM code is generated server-side with a collision retry; the client
-- never supplies it (a client-generated code can collide or be forged).
-- ============================================================
create or replace function public.generate_pace_code()
returns text
language plpgsql as $$
declare
  candidate text;
begin
  for i in 1..10 loop
    candidate := 'PM-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
    exit when not exists (
      select 1 from public.profiles where pace_code = candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, role, pace_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Runner'),
    coalesce(new.raw_user_meta_data ->> 'role', 'runner'),
    public.generate_pace_code()
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
