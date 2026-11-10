import type { Role } from "@pacemate/shared";
import { supabase } from "../../services/supabase";

export interface Profile {
  id: string;
  displayName: string;
  role: Role;
  paceCode: string;
}

export type AuthResult =
  | { ok: true }
  | { ok: true; needsEmailConfirm: true }
  | { ok: false; error: string };

// CONVENTIONS section 3: expected failures return typed results; the raw
// provider error never reaches a screen.
function friendlyAuthError(message: string): string {
  // The raw provider error never reaches a screen, but it must reach the
  // developer: it shows in the Metro terminal during development.
  console.error("[auth] raw error:", message);
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email or password is incorrect.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "This email already has an account. Try logging in.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first. Check your inbox.";
  if (m.includes("network") || m.includes("fetch"))
    return "Connection problem. Check your signal and try again.";
  return "Something went wrong. Please try again.";
}

export async function signUp(params: {
  displayName: string;
  email: string;
  password: string;
  role: Role;
}): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: params.email.trim(),
    password: params.password,
    options: {
      data: { display_name: params.displayName.trim(), role: params.role },
    },
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  if (!data.session) return { ok: true, needsEmailConfirm: true };
  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resendConfirmation(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  return { ok: true };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, pace_code")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    role: data.role,
    paceCode: data.pace_code,
  };
}
