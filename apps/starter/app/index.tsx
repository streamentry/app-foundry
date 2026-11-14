import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, Pressable, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { brandThemes, getPalette, type ColorMode } from '@foundry/design-system';

export default function GalleryScreen() {
  const mode: ColorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.eyebrow}>APP FOUNDRY / INTERNAL TOOL</Text>
        <Text style={styles.heading} accessibilityRole="header">Ten distinct product identities.</Text>
        <Text style={styles.intro}>
          One engineering foundation. Different composition, typography, interaction and tone for each audience.
          These are prototypes, not released apps or approved trademarks.
        </Text>
        {brandThemes.map((theme, index) => {
          const p = getPalette(theme, mode);
          return (
            <Pressable
              key={theme.id}
              accessibilityRole="button"
              accessibilityLabel={`Preview ${theme.name}, ${theme.archetype}`}
              onPress={() => router.push({ pathname: '/preview/[id]', params: { id: theme.id } })}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
            >
              <View style={[styles.preview, { backgroundColor: p.canvas, borderRadius: theme.shape.cardRadius, borderColor: p.border }]}>
                <View style={[styles.stripe, { backgroundColor: p.accent, borderRadius: theme.shape.buttonRadius }]} />
                <Text style={[styles.tileName, { color: p.ink, letterSpacing: theme.typography.tracking * 0.5 }]} numberOfLines={1}>{theme.name}</Text>
                <Text style={[styles.tileMeta, { color: p.muted }]} numberOfLines={2}>{theme.archetype}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.index}>{String(index + 1).padStart(2, '0')} / {theme.id}</Text>
                <Text style={styles.name}>{theme.copy.headline}</Text>
                <Text style={styles.audience} numberOfLines={2}>{theme.audience}</Text>
                <Text style={styles.more}>Explore direction ›</Text>
              </View>
            </Pressable>
          );
        })}
        <Text style={styles.footer}>Design decisions require user testing, legal brand clearance and device QA before release.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F8FA' },
  list: { padding: 20, paddingBottom: 48, gap: 16, maxWidth: 760, alignSelf: 'center', width: '100%' },
  eyebrow: { color: '#235ECA', fontSize: 12, fontWeight: '700', letterSpacing: 1.4, marginTop: 18 },
  heading: { fontSize: 32, fontWeight: '800', letterSpacing: -0.7, color: '#17212B', lineHeight: 39 },
  intro: { fontSize: 16, lineHeight: 24, color: '#4C5A66', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 14, minHeight: 156, alignItems: 'stretch' },
  preview: { flex: 0.46, borderWidth: 1, padding: 16, justifyContent: 'flex-end', gap: 8, minWidth: 120 },
  stripe: { width: 44, height: 7, marginBottom: 6 },
  tileName: { fontSize: 20, fontWeight: '800' },
  tileMeta: { fontSize: 12, lineHeight: 17 },
  details: { flex: 0.54, justifyContent: 'center', gap: 8 },
  index: { color: '#697685', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  name: { color: '#17212B', fontSize: 18, fontWeight: '700', lineHeight: 23 },
  audience: { color: '#4C5A66', fontSize: 13, lineHeight: 19 },
  more: { color: '#235ECA', fontWeight: '700', fontSize: 13 },
  footer: { fontSize: 12, color: '#697685', lineHeight: 18, marginTop: 24 },
});
