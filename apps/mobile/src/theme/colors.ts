// Canonical PaceMate palette, ported from the web app's design system.
// No hex codes anywhere else in the app (CONVENTIONS section 4).
export const colors = {
  primary: "#005235",
  onPrimary: "#FFFFFF",
  primaryContainer: "#9CF6C9",
  onPrimaryContainer: "#00210F",

  secondary: "#4D6357",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#CFE9D9",
  onSecondaryContainer: "#0A1F16",

  surface: "#F5FBF4",
  onSurface: "#171D19",
  surfaceContainerLow: "#EFF5EE",
  surfaceContainer: "#E9EFE8",
  surfaceContainerHigh: "#E3EAE2",
  surfaceContainerHighest: "#DDE4DC",
  onSurfaceVariant: "#404943",

  outline: "#707973",
  outlineVariant: "#C0C9C1",

  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",

  success: "#1A6B4A",
  live: "#D32F2F",
} as const;

export const kineticGradient = ["#005235", "#1A6B4A"] as const;
