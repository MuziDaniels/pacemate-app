import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../theme/index.js";
import { useAuthStore } from "../features/auth/auth.store.js";
import { LoginScreen } from "../features/auth/LoginScreen.js";
import { SignupScreen } from "../features/auth/SignupScreen.js";
import { CoachHomeScreen, RunnerHomeScreen } from "../features/home/HomeScreens.js";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type RunnerStackParamList = { RunnerHome: undefined };
export type CoachStackParamList = { CoachHome: undefined };

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RunnerStack = createNativeStackNavigator<RunnerStackParamList>();
const CoachStack = createNativeStackNavigator<CoachStackParamList>();

export function AppNavigator() {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.profile?.role);

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.surface }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {status === "signedOut" ? (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Signup" component={SignupScreen} />
        </AuthStack.Navigator>
      ) : role === "coach" ? (
        <CoachStack.Navigator screenOptions={{ headerShown: false }}>
          <CoachStack.Screen name="CoachHome" component={CoachHomeScreen} />
        </CoachStack.Navigator>
      ) : (
        <RunnerStack.Navigator screenOptions={{ headerShown: false }}>
          <RunnerStack.Screen name="RunnerHome" component={RunnerHomeScreen} />
        </RunnerStack.Navigator>
      )}
    </NavigationContainer>
  );
}
