// Slice 1 home screens: prove role routing and show the PM code.
// Slice 2 (run recording) and Slice 3 (live sessions) replace the bodies.
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "../../components/ui";
import { colors, kineticGradient, radius, spacing, typeScale } from "../../theme/index";
import { useAuthStore } from "../auth/auth.store";
import { signOut } from "../auth/auth.service";

function HomeShell(props: { greetingSuffix: string }) {
  const profile = useAuthStore((s) => s.profile);
  if (!profile) return null;
  return (
    <View style={styles.flex}>
      <LinearGradient colors={kineticGradient} style={styles.hero}>
        <Text style={styles.greeting}>
          {profile.displayName} {props.greetingSuffix}
        </Text>
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your PaceMate code</Text>
          <Text style={styles.code}>{profile.paceCode}</Text>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <PrimaryButton label="Log out" onPress={() => void signOut()} />
      </View>
    </View>
  );
}

export function RunnerHomeScreen() {
  return <HomeShell greetingSuffix="- ready to run" />;
}

export function CoachHomeScreen() {
  return <HomeShell greetingSuffix="- pit wall" />;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  hero: {
    paddingTop: spacing.xxl + spacing.lg,
    padding: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    gap: spacing.lg,
  },
  greeting: { ...typeScale.headlineMedium, color: colors.onPrimary },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  codeLabel: { ...typeScale.bodyMedium, color: colors.onSurfaceVariant },
  code: { ...typeScale.paceCode, color: colors.primary },
  body: { padding: spacing.lg },
});
