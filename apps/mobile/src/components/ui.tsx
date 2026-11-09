import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { colors, radius, spacing, typeScale } from "../theme/index.js";

export function PrimaryButton(props: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const disabled = props.disabled || props.loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.buttonLabel}>{props.label}</Text>
      )}
    </Pressable>
  );
}

export function Field(props: TextInputProps & { label: string }) {
  const { label, ...input } = props;
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.outline}
        style={styles.input}
        {...input}
      />
    </View>
  );
}

export function ErrorText(props: { children: ReactNode }) {
  if (!props.children) return null;
  return <Text style={styles.error}>{props.children}</Text>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonPressed: { opacity: 0.85 },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { ...typeScale.labelLarge, color: colors.onPrimary },
  fieldWrap: { gap: spacing.xs },
  fieldLabel: { ...typeScale.bodyMedium, color: colors.onSurfaceVariant },
  input: {
    ...typeScale.bodyLarge,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.onSurface,
  },
  error: { ...typeScale.bodyMedium, color: colors.error },
});
