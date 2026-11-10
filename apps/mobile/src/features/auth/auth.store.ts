import { create } from "zustand";
import { supabase } from "../../services/supabase";
import { fetchProfile, type Profile } from "./auth.service";

interface AuthState {
  status: "loading" | "signedOut" | "signedIn";
  profile: Profile | null;
  /** Call once at app start; resolves initial session and subscribes. */
  bootstrap: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  profile: null,
  bootstrap: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        set({ status: "signedOut", profile: null });
        return;
      }
      void fetchProfile(session.user.id).then((profile) => {
        if (profile) set({ status: "signedIn", profile });
        else set({ status: "signedOut", profile: null });
      });
    });
  },
}));
