// Lexend for headings and metrics, Plus Jakarta Sans for body.
// Family names must match the keys registered in App.tsx useFonts.
export const fonts = {
  heading: "Lexend_600SemiBold",
  headingBold: "Lexend_700Bold",
  body: "PlusJakartaSans_400Regular",
  bodyMedium: "PlusJakartaSans_500Medium",
  bodyBold: "PlusJakartaSans_700Bold",
} as const;

export const typeScale = {
  displayLarge: { fontFamily: fonts.headingBold, fontSize: 40, lineHeight: 46 },
  headlineMedium: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 30 },
  titleMedium: { fontFamily: fonts.heading, fontSize: 18, lineHeight: 24 },
  bodyLarge: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  labelLarge: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 20 },
  metricHuge: { fontFamily: fonts.headingBold, fontSize: 56, lineHeight: 60 },
  paceCode: { fontFamily: fonts.headingBold, fontSize: 22, lineHeight: 28, letterSpacing: 2 },
} as const;
