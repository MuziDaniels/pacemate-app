// Expo inlines EXPO_PUBLIC_* variables at build time; declare the two we use
// so we do not pull all of @types/node into a React Native app.
declare const process: {
  env: {
    EXPO_PUBLIC_SUPABASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
  };
};
