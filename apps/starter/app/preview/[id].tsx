import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBrandTheme, getPalette, type ColorMode } from '@foundry/design-system';
import { ThemeHero } from '../../src/components/ThemeHero';

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [override, setOverride] = useState<ColorMode | null>(null);
  const systemMode: ColorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = getBrandTheme(typeof params.id === 'string' ? params.id : '');
  if (!theme) return <SafeAreaView style={styles.empty}><Text>Unknown design profile.</Text></SafeAreaView>;
  const mode = override ?? systemMode;
  const palette = getPalette(theme, mode);
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: palette.muted }]}>DESIGN DIRECTION · {theme.id.toUpperCase()}</Text>
        <Text style={[styles.title, { color: palette.ink }]} accessibilityRole="header">{theme.name}</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>{theme.archetype} · {theme.audience}</Text>
        <View style={styles.modes} accessibilityRole="radiogroup" accessibilityLabel="Preview appearance">
          {(['light', 'dark'] as const).map((choice) => (
            <Pressable
              key={choice}
              accessibilityRole="radio"
              accessibilityState={{ selected: mode === choice }}
              onPress={() => setOverride(choice)}
              style={[styles.modeButton, { borderColor: palette.border, backgroundColor: mode === choice ? palette.accent : palette.surface }]}
            >
              <Text style={{ color: mode === choice ? palette.onAccent : palette.ink, fontWeight: '700' }}>
                {choice === 'light' ? 'Light' : 'Dark'}
              </Text>
            </Pressable>
          ))}
        </View>
        <ThemeHero theme={theme} palette={palette} />
        <View style={[styles.notes, { borderColor: palette.border }]}>
          <Text style={[styles.section, { color: palette.ink }]}>Signature</Text>
          <Text style={[styles.note, { color: palette.muted }]}>{theme.signature}</Text>
          <Text style={[styles.section, { color: palette.ink }]}>Information architecture</Text>
          <Text style={[styles.note, { color: palette.muted }]}>{theme.layout}</Text>
          <Text style={[styles.section, { color: palette.ink }]}>Motion</Text>
          <Text style={[styles.note, { color: palette.muted }]}>{theme.motion}</Text>
          <Text style={[styles.section, { color: palette.ink }]}>Avoid</Text>
          <Text style={[styles.note, { color: palette.muted }]}>{theme.avoid}</Text>
        </View>
        <Text style={[styles.disclaimer, { color: palette.muted }]}>Design preview only. No account, tracking, saved records, notifications or paid features.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { gap: 14, padding: 20, paddingBottom: 54, alignSelf: 'center', maxWidth: 720, width: '100%' },
  eyebrow: { marginTop: 14, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 4 },
  modes: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  modeButton: { paddingHorizontal: 18, minHeight: 48, minWidth: 90, borderRadius: 99, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  notes: { gap: 7, borderTopWidth: 1, paddingTop: 20, marginTop: 10 },
  section: { fontSize: 15, fontWeight: '700', marginTop: 10 },
  note: { fontSize: 15, lineHeight: 23 },
  disclaimer: { fontSize: 12, lineHeight: 18, marginTop: 14 },
});
