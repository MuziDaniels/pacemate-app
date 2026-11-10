import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Lexend_600SemiBold,
  Lexend_700Bold,
  useFonts,
} from "@expo-google-fonts/lexend";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { useAuthStore } from "./src/features/auth/auth.store";

export default function App() {
  const [fontsLoaded] = useFonts({
    Lexend_600SemiBold,
    Lexend_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
