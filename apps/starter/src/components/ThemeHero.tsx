import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BrandTheme, Palette } from '@foundry/design-system';

interface ThemeHeroProps { theme: BrandTheme; palette: Palette }

function fontFor(theme: BrandTheme): string | undefined {
  if (theme.typography.family === 'serif') return Platform.OS === 'ios' ? 'Georgia' : 'serif';
  if (theme.typography.family === 'rounded') return Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-rounded';
  return undefined;
}

function HeroContent({ theme, p }: { theme: BrandTheme; p: Palette }) {
  const metric = theme.copy.metric;
  const label = theme.copy.metricLabel;
  const baseText = { color: p.ink };
  const muted = { color: p.muted };
  switch (theme.hero) {
    case 'roster':
      return <View style={[s.roster, { backgroundColor: p.surface, borderColor: p.border }]}>
        <View style={s.row}><Text style={[s.mono, muted]}>MON 16</Text><Text style={[s.bold, baseText]}>EARLY SHIFT</Text></View>
        <View style={[s.shiftBand, { backgroundColor: p.tint, borderLeftColor: p.accent }]}><Text style={[s.huge, { color: p.onTint }]}>{metric}</Text><Text style={[s.body, { color: p.onTint }]}>— 15:00 · Ward A</Text></View>
        <Text style={[s.caption, muted]}>● On duty    ○ Off duty    ▣ On call</Text>
      </View>;
    case 'orbit':
      return <View style={[s.orbitOuter, { borderColor: p.accent, backgroundColor: p.tint }]}>
        <View style={[s.orbitInner, { borderColor: p.border }]}>
          <Text style={[s.orbitNumber, { color: p.onTint }]}>{metric}</Text>
          <Text style={[s.orbitLabel, { color: p.onTint }]}>{label}</Text>
        </View>
      </View>;
    case 'care':
      return <View style={[s.care, { backgroundColor: p.surface, borderColor: p.border }]}>
        <Text style={[s.caption, muted]}>MONDAY · MORNING</Text>
        <Text style={[s.huge, baseText]}>{metric}</Text>
        <Text style={[s.body, baseText]}>Medication reminder</Text>
        <View style={[s.state, { backgroundColor: p.tint }]}><Text style={{ color: p.onTint, fontWeight: '700' }}>Not yet recorded</Text></View>
        <Text style={[s.caption, muted]}>{label}</Text>
      </View>;
    case 'nest':
      return <View style={s.nestRow}>
        <View style={[s.nestTile, { backgroundColor: p.tint }]}><Text style={[s.caption, { color: p.onTint }]}>FEED</Text><Text style={[s.huge, { color: p.onTint }]}>90</Text><Text style={{ color: p.onTint }}>ml · sample</Text></View>
        <View style={[s.nestTile, { backgroundColor: p.surface, borderWidth: 1, borderColor: p.border }]}><Text style={[s.caption, muted]}>LAST FEED</Text><Text style={[s.huge, baseText]}>2h</Text><Text style={muted}>15m ago</Text></View>
      </View>;
    case 'canopy':
      return <View style={[s.plant, { backgroundColor: p.tint }]}>
        <View style={[s.leaf, { backgroundColor: p.accent, transform: [{ rotate: '30deg' }] }]} />
        <View style={[s.leafSmall, { backgroundColor: p.accent, transform: [{ rotate: '-30deg' }] }]} />
        <Text style={[s.huge, { color: p.onTint, marginTop: 45 }]}>{metric} plants</Text>
        <Text style={[s.body, { color: p.onTint }]}>{label}</Text>
      </View>;
    case 'pet':
      return <View style={[s.pet, { backgroundColor: p.surface, borderColor: p.border }]}>
        <View style={[s.petBadge, { backgroundColor: p.tint }]}><Text style={{ fontSize: 31, color: p.onTint, fontWeight: '800' }}>M</Text></View>
        <Text style={[s.huge, baseText]}>{metric}</Text>
        <Text style={[s.body, muted]}>{label}</Text>
        <View style={[s.state, { backgroundColor: p.tint }]}><Text style={{ color: p.onTint, fontWeight: '700' }}>Upcoming treatment</Text></View>
      </View>;
    case 'ledger':
      return <View style={[s.ledger, { borderColor: p.border, backgroundColor: p.surface }]}>
        <View style={s.row}><Text style={[s.caption, muted]}>WEEK 46 / 2026</Text><Text style={[s.caption, muted]}>MILEAGE</Text></View>
        <Text style={[s.ledgerMetric, baseText]}>{metric}<Text style={{ fontSize: 18 }}> mi</Text></Text>
        <View style={[s.divider, { backgroundColor: p.border }]} />
        <View style={s.row}><Text style={[s.body, baseText]}>TOTAL TRIPS</Text><Text style={[s.bold, baseText]}>3</Text></View>
        <View style={s.row}><Text style={[s.body, muted]}>EST. REIMBURSEMENT</Text><Text style={[s.bold, baseText]}>$86.40</Text></View>
      </View>;
    case 'archive':
      return <View style={[s.archive, { backgroundColor: p.surface, borderColor: p.accent }]}>
        <Text style={[s.caption, { color: p.accent }]}>ARCHIVE / WARRANTY</Text>
        <Text style={[s.huge, baseText]}>{metric} days</Text>
        <Text style={[s.body, muted]}>{label}</Text>
        <View style={[s.divider, { backgroundColor: p.border }]} />
        <View style={s.row}><Text style={[s.caption, muted]}>DOCUMENT #0043</Text><Text style={[s.caption, muted]}>ACTIVE</Text></View>
      </View>;
    case 'tempo':
      return <View style={[s.tempo, { backgroundColor: p.surface }]}>
        <View style={s.row}><Text style={[s.huge, baseText]}>{metric}</Text><Text style={[s.caption, muted]}>DONE TODAY</Text></View>
        <View style={[s.track, { backgroundColor: p.tint }]}><View style={[s.progress, { backgroundColor: p.accent }]} /></View>
        {['✓ Make the bed', '✓ Wash dishes', '○ Tidy kitchen'].map((item) => <Text key={item} style={[s.task, baseText]}>{item}</Text>)}
      </View>;
    case 'daylight':
      return <View style={[s.daylight, { backgroundColor: p.surface, borderColor: p.border }]}>
        <Text style={[s.caption, muted]}>UP NEXT</Text><Text style={[s.huge, baseText]}>{metric}</Text>
        <Text style={[s.daylightAction, baseText]}>{label}</Text>
        <Text style={[s.body, muted]}>You can take your time.</Text>
      </View>;
  }
}

export function ThemeHero({ theme, palette: p }: ThemeHeroProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <View style={[s.shell, { backgroundColor: p.canvas }]}>
      <Text style={[s.kicker, { color: p.accent }]}>{theme.copy.eyebrow}</Text>
      <Text style={{ fontSize: theme.typography.headlineSize, lineHeight: theme.typography.headlineSize * 1.12, fontWeight: theme.typography.weight, letterSpacing: theme.typography.tracking, fontFamily: fontFor(theme), color: p.ink }} accessibilityRole="header">{theme.copy.headline}</Text>
      <Text style={{ color: p.muted, fontSize: theme.typography.bodySize, lineHeight: theme.typography.bodySize * 1.5 }}>{theme.copy.body}</Text>
      <View style={{ marginVertical: theme.density === 'spacious' ? 26 : theme.density === 'compact' ? 12 : 18 }}>
        <HeroContent theme={theme} p={p} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Shows preview feedback only; does not save data"
        onPress={() => setPressed((value) => !value)}
        style={({ pressed: down }) => [s.button, { backgroundColor: p.accent, borderRadius: theme.shape.buttonRadius, opacity: down ? 0.88 : 1 }]}
      ><Text style={{ color: p.onAccent, fontSize: Math.max(16, theme.typography.bodySize), fontWeight: '700', textAlign: 'center' }}>Preview: {theme.copy.primaryAction}</Text></Pressable>
      <Text accessibilityLiveRegion="polite" style={[s.sample, { color: p.muted }]}>{pressed ? 'Sample response: activated. Nothing was saved.' : theme.copy.secondaryLabel}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  shell: { gap: 14, padding: 20, width: '100%' },
  kicker: { fontSize: 12, letterSpacing: 1.4, fontWeight: '800' },
  button: { minHeight: 52, padding: 15, alignItems: 'center', justifyContent: 'center' },
  sample: { fontSize: 13, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  body: { fontSize: 16, lineHeight: 23 },
  bold: { fontSize: 16, fontWeight: '800' },
  huge: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  mono: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  divider: { height: 1, marginVertical: 8 },
  roster: { gap: 18, borderWidth: 1, borderRadius: 10, padding: 16 },
  shiftBand: { borderLeftWidth: 5, padding: 14, gap: 5 },
  orbitOuter: { width: 230, height: 230, borderWidth: 2, borderRadius: 130, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 13 },
  orbitInner: { width: 204, height: 204, borderRadius: 110, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 22 },
  orbitNumber: { fontSize: 92, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', letterSpacing: -4 },
  orbitLabel: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  care: { borderWidth: 1, borderRadius: 16, padding: 24, gap: 15 },
  state: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 99 },
  nestRow: { flexDirection: 'row', gap: 12 },
  nestTile: { flex: 1, padding: 17, minHeight: 170, gap: 11, justifyContent: 'center', borderRadius: 26 },
  plant: { borderRadius: 30, overflow: 'hidden', minHeight: 220, padding: 24, justifyContent: 'flex-end' },
  leaf: { position: 'absolute', top: -45, right: 28, width: 155, height: 160, borderTopLeftRadius: 150, borderBottomRightRadius: 150, opacity: 0.18 },
  leafSmall: { position: 'absolute', top: 20, right: -60, width: 135, height: 135, borderTopLeftRadius: 140, borderBottomRightRadius: 140, opacity: 0.1 },
  pet: { borderRadius: 20, padding: 22, borderWidth: 1, alignItems: 'flex-start', gap: 12 },
  petBadge: { height: 62, width: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  ledger: { borderWidth: 1, borderRadius: 8, padding: 18, gap: 13 },
  ledgerMetric: { fontSize: 51, fontWeight: '800', letterSpacing: -1.8, fontVariant: ['tabular-nums'] },
  archive: { borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 4, padding: 24, gap: 19 },
  tempo: { borderRadius: 16, padding: 20, gap: 14 },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  progress: { width: '60%', height: '100%', borderRadius: 6 },
  task: { fontSize: 16, fontWeight: '600', paddingVertical: 7 },
  daylight: { borderWidth: 1, borderRadius: 14, padding: 26, gap: 18 },
  daylightAction: { fontSize: 23, lineHeight: 30, fontWeight: '700' },
});
