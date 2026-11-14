import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { contrastRatio, type Palette } from '@foundry/design-system';
import {
  dateKey, monthDays, SHIFT_ABBREVIATIONS, SHIFT_LABELS, type Shift, weekDays,
} from '../domain/roster';
import { fullDate } from '../utils/presentation';

export function PageHeader({
  eyebrow, title, subtitle, p, right,
}: { eyebrow: string; title: string; subtitle?: string; p: Palette; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.eyebrow, { color: p.accent }]}>{eyebrow}</Text>
        <Text accessibilityRole="header" style={[styles.headline, { color: p.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subheading, { color: p.muted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Action({
  label, onPress, p, secondary = false, destructive = false, disabled = false,
  accessibilityHint,
}: {
  label: string; onPress: () => void; p: Palette; secondary?: boolean; destructive?: boolean;
  disabled?: boolean; accessibilityHint?: string;
}) {
  const danger = contrastRatio('#AF372E', p.surface) >= 4.5 ? '#AF372E' : '#FF948A';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: secondary || destructive ? p.surface : p.accent, borderColor: destructive ? danger : secondary ? p.border : p.accent, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.actionText, { color: destructive ? danger : secondary ? p.ink : p.onAccent }]}>{label}</Text>
    </Pressable>
  );
}

export function Section({
  title, p, right,
}: { title: string; p: Palette; right?: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: p.ink }]}>{title}</Text>
      {right}
    </View>
  );
}

function Badge({ shift, p }: { shift: Shift; p: Palette }) {
  return (
    <View style={[styles.badge, { backgroundColor: shift.kind === 'off' ? p.surface : p.tint, borderColor: p.border }]}>
      <Text style={{ color: shift.kind === 'off' ? p.muted : p.onTint, fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }}>
        {SHIFT_ABBREVIATIONS[shift.kind]}
      </Text>
    </View>
  );
}

export function WeekStrip({
  selected, onSelect, shifts, p,
}: { selected: string; onSelect: (date: string) => void; shifts: readonly Shift[]; p: Palette }) {
  const dates = weekDays(selected);
  const map = new Map(shifts.map((shift) => [shift.date, shift]));
  const today = dateKey(new Date());
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekStrip}>
      {dates.map((day) => {
        const highlighted = day === selected;
        const shift = map.get(day);
        const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(day + 'T12:00:00'));
        return (
          <Pressable
            key={day}
            onPress={() => onSelect(day)}
            accessibilityRole="button"
            accessibilityLabel={fullDate(day) + ', ' + (shift ? SHIFT_LABELS[shift.kind] : 'not scheduled')}
            accessibilityState={{ selected: highlighted }}
            style={[styles.day, { backgroundColor: highlighted ? p.accent : p.surface, borderColor: highlighted ? p.accent : p.border }]}
          >
            <Text style={[styles.dayLabel, { color: highlighted ? p.onAccent : p.muted }]}>{weekday}</Text>
            <Text style={[styles.dayNumber, { color: highlighted ? p.onAccent : p.ink }]}>{Number(day.slice(-2))}</Text>
            {shift ? (
              <View style={[styles.marker, { backgroundColor: highlighted ? p.onAccent : shift.kind === 'off' ? p.border : p.accent }]} />
            ) : <View style={styles.marker} />}
            {today === day ? <View style={[styles.todayDot, { borderColor: highlighted ? p.onAccent : p.accent }]} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function MonthGrid({
  selected, onSelect, shifts, p,
}: { selected: string; onSelect: (date: string) => void; shifts: readonly Shift[]; p: Palette }) {
  const { fontScale, width } = useWindowDimensions();
  const cells = monthDays(selected);
  const map = new Map(shifts.map((shift) => [shift.date, shift]));
  const month = selected.slice(0, 7);
  const today = dateKey(new Date());
  const size = Math.max(46, Math.floor((Math.min(width, 760) - 40) / 7), Math.ceil(fontScale * 45));
  const minWidth = 7 * size;
  const weekLabels = ['M','T','W','T','F','S','S'];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth }}>
      <View style={{ width: minWidth }}>
        <View style={styles.gridRow}>
          {weekLabels.map((label, i) => (
            <Text key={String(i)} style={[styles.columnLabel, { color: p.muted, width: size }]}>{label}</Text>
          ))}
        </View>
        {Array.from({ length: Math.ceil(cells.length / 7) }, (_, week) => (
          <View key={week} style={styles.gridRow}>
            {cells.slice(week * 7, week * 7 + 7).map((day) => {
              const shift = map.get(day);
              const selectedDay = selected === day;
              const isCurrent = day.slice(0, 7) === month;
              return (
                <Pressable
                  key={day}
                  accessibilityRole="button"
                  accessibilityLabel={fullDate(day) + ', ' + (shift ? SHIFT_LABELS[shift.kind] : 'not scheduled')}
                  accessibilityState={{ selected: selectedDay }}
                  onPress={() => onSelect(day)}
                  style={[styles.cell, {
                    width: size, minHeight: Math.max(62, fontScale * 60),
                    backgroundColor: selectedDay ? p.accent : p.surface,
                    borderColor: day === today && !selectedDay ? p.accent : p.border,
                    opacity: isCurrent ? 1 : 0.55,
                  }]}
                >
                  <Text style={{ color: selectedDay ? p.onAccent : p.ink, fontWeight: '700', fontSize: 13 }}>{Number(day.slice(-2))}</Text>
                  {shift ? (
                    <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: '800', color: selectedDay ? p.onAccent : shift.kind === 'off' ? p.muted : p.accent }}>
                      {SHIFT_ABBREVIATIONS[shift.kind]}
                    </Text>
                  ) : <Text style={{ fontSize: 10, color: p.muted }}>·</Text>}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function ShiftCard({
  date, shift, onPress, p,
}: { date: string; shift?: Shift; onPress: () => void; p: Palette }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={fullDate(date) + '. ' + (shift ? SHIFT_LABELS[shift.kind] : 'No shift planned') + '. Edit schedule.'}
      style={({ pressed }) => [styles.shiftCard, { borderColor: p.border, backgroundColor: p.surface, opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.verticalRail, { backgroundColor: shift?.kind === 'off' ? p.border : p.accent }]} />
      <View style={{ flex: 1, gap: 7 }}>
        <Text style={[styles.cardEyebrow, { color: p.muted }]}>{fullDate(date)}</Text>
        <Text style={[styles.cardTitle, { color: p.ink }]}>{shift ? SHIFT_LABELS[shift.kind] : 'No shift planned'}</Text>
        <Text style={{ color: p.muted, fontSize: 15, lineHeight: 22 }}>{shift?.kind === 'off' ? 'Rest day' : shift?.start && shift.end ? shift.start + ' — ' + shift.end : 'Tap to add a shift'}</Text>
        {shift?.note ? <Text style={{ color: p.muted, fontSize: 14 }} numberOfLines={2}>{shift.note}</Text> : null}
      </View>
      {shift ? <Badge shift={shift} p={p} /> : null}
      <Text style={{ color: p.accent, fontSize: 19, fontWeight: '700' }}>›</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  page: { padding: 20, paddingBottom: 64, width: '100%', maxWidth: 760, alignSelf: 'center', gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 8 },
  headline: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -1 },
  subheading: { fontSize: 15, lineHeight: 22, marginTop: 6 },
  action: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 16, paddingVertical: 13, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  badge: { minWidth: 40, height: 32, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  weekStrip: { flexDirection: 'row', gap: 7, paddingVertical: 4 },
  day: { borderWidth: 1, borderRadius: 10, minWidth: 48, minHeight: 80, alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 5 },
  dayLabel: { fontSize: 11, fontWeight: '700' },
  dayNumber: { fontSize: 19, fontWeight: '800', fontVariant: ['tabular-nums'] },
  marker: { width: 14, height: 4, borderRadius: 2 },
  todayDot: { position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderWidth: 1.5, borderRadius: 4 },
  gridRow: { flexDirection: 'row', gap: 0, alignItems: 'stretch' },
  columnLabel: { textAlign: 'center', fontSize: 11, fontWeight: '800', paddingVertical: 9 },
  cell: { borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', gap: 7 },
  shiftCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, overflow: 'hidden', minHeight: 110, gap: 14, paddingRight: 17 },
  verticalRail: { width: 5, alignSelf: 'stretch' },
  cardEyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  cardTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
});
