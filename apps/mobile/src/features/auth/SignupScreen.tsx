import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Role } from "@pacemate/shared";
import { ErrorText, Field, PrimaryButton } from "../../components/ui";
import { colors, radius, spacing, typeScale } from "../../theme/index";
import { signUp } from "./auth.service";
import type { AuthStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("runner");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSignup() {
    setError(null);
    if (displayName.trim().length === 0 || displayName.trim().length > 60) {
      setError("Please enter your name (up to 60 characters).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const result = await signUp({ displayName, email, password, role });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if ("needsEmailConfirm" in result) setConfirmSent(true);
  }

  if (confirmSent) {
    return (
      <View style={styles.confirmWrap}>
        <Text style={styles.confirmTitle}>Check your email</Text>
        <Text style={styles.confirmBody}>
          We sent a confirmation link to {email.trim()}. Tap it, then come back
          and log in.
        </Text>
        <PrimaryButton label="Go to login" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>

        <View style={styles.roleRow}>
          {(["runner", "coach"] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setRole(r)}
              style={[styles.roleChip, role === r && styles.roleChipActive]}
            >
              <Text style={[styles.roleLabel, role === r && styles.roleLabelActive]}>
                {r === "runner" ? "I run" : "I coach"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Field label="Your name" value={displayName} onChangeText={setDisplayName} />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Field
          label="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ErrorText>{error}</ErrorText>
        <PrimaryButton label="Sign up" onPress={handleSignup} loading={loading} />
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: { padding: spacing.lg, gap: spacing.md, paddingTop: spacing.xxl },
  title: { ...typeScale.headlineMedium, color: colors.onSurface },
  roleRow: { flexDirection: "row", gap: spacing.sm },
  roleChip: {
    flex: 1,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleLabel: { ...typeScale.labelLarge, color: colors.onSurfaceVariant },
  roleLabelActive: { color: colors.onPrimary },
  link: { ...typeScale.bodyMedium, color: colors.primary, textAlign: "center" },
  confirmWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  confirmTitle: { ...typeScale.headlineMedium, color: colors.onSurface, textAlign: "center" },
  confirmBody: {
    ...typeScale.bodyLarge,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
});
