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
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ErrorText, Field, PrimaryButton } from "../../components/ui.js";
import { colors, kineticGradient, radius, spacing, typeScale } from "../../theme/index.js";
import { resendConfirmation, sendPasswordReset, signIn } from "./auth.service.js";
import type { AuthStackParamList } from "../../navigation/AppNavigator.js";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    setNotice(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error);
    // success: auth store listener flips the navigator, nothing to do here
  }

  async function handleResend() {
    const result = await resendConfirmation(email);
    setNotice(result.ok ? "Confirmation email sent." : result.error);
  }

  async function handleForgot() {
    if (!email) {
      setError("Enter your email first, then tap forgot password.");
      return;
    }
    const result = await sendPasswordReset(email);
    setNotice(result.ok ? "Password reset email sent." : result.error);
  }

  const needsConfirm = error?.toLowerCase().includes("confirm") ?? false;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={kineticGradient} style={styles.hero}>
          <Text style={styles.heroTitle}>PaceMate</Text>
          <Text style={styles.heroSub}>Your coach, in your ear.</Text>
        </LinearGradient>

        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          <ErrorText>{error}</ErrorText>
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
          {needsConfirm ? (
            <Pressable onPress={handleResend}>
              <Text style={styles.link}>Resend confirmation email</Text>
            </Pressable>
          ) : null}
          <PrimaryButton label="Log in" onPress={handleLogin} loading={loading} />
          <Pressable onPress={handleForgot}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>New here? Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: { flexGrow: 1 },
  hero: {
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTitle: { ...typeScale.displayLarge, color: colors.onPrimary },
  heroSub: { ...typeScale.bodyLarge, color: colors.primaryContainer, marginTop: spacing.xs },
  form: { padding: spacing.lg, gap: spacing.md },
  link: { ...typeScale.bodyMedium, color: colors.primary, textAlign: "center" },
  notice: { ...typeScale.bodyMedium, color: colors.success },
});
