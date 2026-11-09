# Slice 1 spec: Auth + profiles

Status: In progress
Depends on: Slice 0 (schema applied to a fresh Supabase project)

## Goal
A person installs the app, signs up as a runner or a coach, confirms their
email, logs in, and lands on the home screen for their role. Their profile
row exists with a server-generated PM code. This survives app restart.

## Scope
- Email/password signup with display name and role selection
- Email confirmation handling (Supabase default flow)
- Login, logout, session persistence via AsyncStorage
- Profile fetch into the auth store; role decides the navigator
- Server-side PM code generation (migration 0001, `generate_pace_code()`)

Out of scope: social login, password reset UI (stub a "forgot password" send
only), coach-runner connections (Slice 3), any run recording.

## Behaviour
1. Signup screen: display name, email, password, role toggle (runner/coach).
   Client validates: name 1-60 chars, password >= 8 chars.
2. On signup, metadata `{ display_name, role }` goes to Supabase. The DB
   trigger creates the profile and generates the PM code. The app shows a
   "confirm your email" state, not the home screen.
3. Login with an unconfirmed email shows a clear message with a resend option.
4. After login, the store loads the profile. `role = runner` mounts the
   runner stack, `role = coach` the coach stack.
5. Kill and reopen the app: still logged in, same screen family, no flash of
   the login screen after the splash resolves.
6. Logout returns to login and clears the store.

## Errors (friendly, specific)
- Wrong credentials: "Email or password is incorrect."
- Email already registered: say so, offer login.
- Network failure: say it is a connection problem, offer retry. Never show a
  raw Supabase error string to the user.

## Acceptance (demonstrated on a physical device)
- [ ] New runner signup -> confirm email -> login -> runner home shows their
      display name and PM code
- [ ] Same for a coach -> coach home
- [ ] App restart keeps the session (screen recording)
- [ ] RLS proof: an authenticated user querying another user's sessions rows
      gets zero rows (SQL test, not trust)
- [ ] `pnpm typecheck` green including `apps/mobile`

## Implementation notes
- `apps/mobile/src/features/auth/` owns screens, store, service
- Service returns typed results (`{ ok: true, ... } | { ok: false, error }`),
  per CONVENTIONS section 3
- Theme tokens only; no hex codes in screens
