import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addDays, currentOrNextShift, dateKey, monthSummary, SHIFT_LABELS,
  shiftMonth, type Shift,
} from '../src/domain/roster';
import { listShifts, remindersEnabled } from '../src/data/repository';
import { syncReminders } from '../src/services/reminders';
import { fullDate, monthTitle, readableError, shortDate } from '../src/utils/presentation';
import { useSignalTheme } from '../src/ui/theme';
import { Action, MonthGrid, PageHeader, Section, ShiftCard, WeekStrip, styles } from '../src/ui/components';

export default function HomeScreen() {
  const { p } = useSignalTheme();
  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    const load = async () => {
      if (active) { setLoading(true); setError(null); setNow(new Date()); }
      try {
        const records = await listShifts();
        if (active) { setShifts(records); setLoading(false); }
        // A best-effort refresh when returning to the app, never part of data loading.
        if (await remindersEnabled()) {
          try { await syncReminders(records); } catch { /* Settings explains how to troubleshoot permission/scheduling. */ }
        }
      } catch (failure) {
        if (active) { setLoading(false); setError(readableError(failure)); }
      }
    };
    void load();
    return () => { active = false; };
  }, []));

  const today = dateKey(now);
  const highlighted = shifts.find((shift) => shift.date === selected);
  const focus = currentOrNextShift(shifts, now);
  const stats = monthSummary(shifts, selected);
  const upcoming = shifts.filter((shift) => shift.kind !== 'off' && shift.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? '').localeCompare(b.start ?? ''))
    .slice(0, 3);
  const move = (delta: number) => setSelected((current) =>
    mode === 'week' ? addDays(current, delta * 7) : shiftMonth(current, delta),
  );
  const edit = (day = selected) => router.push({ pathname: '/edit', params: { date: day } });
  const rotate = () => router.push({ pathname: '/rotation', params: { date: selected } });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: p.canvas }]}>
      <ScrollView contentContainerStyle={[styles.page, { gap: 22 }]} keyboardShouldPersistTaps="handled">
        <PageHeader eyebrow="SHIFT CALENDAR" title="Your roster." subtitle="One glance. Know what's next." p={p}
          right={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => router.push('/settings')}
              style={{ padding: 12, minHeight: 48, justifyContent: 'center', borderRadius: 9, backgroundColor: p.surface, borderWidth: 1, borderColor: p.border }}
            >
              <Text style={{ color: p.ink, fontWeight: '800' }}>Settings</Text>
            </Pressable>
          }
        />

        <View style={{ borderRadius: 11, backgroundColor: p.ink, padding: 22, overflow: 'hidden', gap: 10, minHeight: 155 }}>
          <Text style={{ color: p.canvas, opacity: 0.82, letterSpacing: 1.5, fontSize: 12, fontWeight: '800' }}>
            {focus?.state === 'ongoing' ? 'ON SHIFT' : 'NEXT SHIFT'}
          </Text>
          {focus ? (
            <>
              <Text style={{ color: p.canvas, fontSize: 38, fontWeight: '800', letterSpacing: -1.5, fontVariant: ['tabular-nums'] }}>
                {focus.shift.start} — {focus.shift.end}
              </Text>
              <Text style={{ color: p.canvas, fontSize: 15, lineHeight: 23 }}>
                {SHIFT_LABELS[focus.shift.kind]} · {fullDate(focus.shift.date)}
              </Text>
            </>
          ) : (
            <>
              <Text style={{ color: p.canvas, fontSize: 30, fontWeight: '800', letterSpacing: -1 }}>Nothing scheduled yet.</Text>
              <Text style={{ color: p.canvas, opacity: 0.82, lineHeight: 21 }}>Add one shift or fill a repeating rotation.</Text>
            </>
          )}
          <View style={{ width: 58, height: 5, marginTop: 5, backgroundColor: p.canvas, opacity: 0.75 }} />
        </View>

        {error ? (
          <View accessibilityRole="alert" style={{ borderColor: p.accent, borderWidth: 1, padding: 14 }}>
            <Text style={{ color: p.ink }}>Unable to load your local schedule: {error}</Text>
            <Action label="Try again" p={p} onPress={() => router.replace('/')} secondary />
          </View>
        ) : null}

        <View style={{ gap: 14 }}>
          <Section title="Schedule" p={p}
            right={
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['week', 'month'] as const).map((value) => (
                  <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: mode === value }}
                    onPress={() => setMode(value)}
                    style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 9, backgroundColor: mode === value ? p.accent : p.surface, borderWidth: 1, borderColor: mode === value ? p.accent : p.border }}>
                    <Text style={{ color: mode === value ? p.onAccent : p.ink, fontWeight: '800', textTransform: 'capitalize' }}>{value}</Text>
                  </Pressable>
                ))}
              </View>
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pressable accessibilityRole="button" accessibilityLabel={'Previous ' + mode} onPress={() => move(-1)}
              style={{ minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ color: p.accent, fontSize: 26, fontWeight: '700' }}>‹</Text>
            </Pressable>
            <Text style={{ color: p.ink, fontSize: 16, fontWeight: '800', textAlign: 'center' }}>
              {mode === 'month' ? monthTitle(selected) : shortDate(addDays(selected, -((new Date(selected + 'T12:00:00').getDay() + 6) % 7))) + ' week'}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel={'Next ' + mode} onPress={() => move(1)}
              style={{ minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ color: p.accent, fontSize: 26, fontWeight: '700' }}>›</Text>
            </Pressable>
          </View>
          {mode === 'week' ? <WeekStrip selected={selected} shifts={shifts} onSelect={setSelected} p={p} /> :
            <MonthGrid selected={selected} shifts={shifts} onSelect={setSelected} p={p} />}
        </View>

        <View style={{ gap: 13 }}>
          <Section title="Selected day" p={p} />
          <ShiftCard date={selected} shift={highlighted} onPress={() => edit()} p={p} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Action label={highlighted ? 'Edit shift' : '+ Add shift'} p={p} onPress={() => edit()} /></View>
            <View style={{ flex: 1 }}><Action label="Fill rotation" p={p} secondary onPress={rotate} /></View>
          </View>
        </View>

        <View style={{ borderTopWidth: 1, borderColor: p.border, paddingTop: 18, gap: 14 }}>
          <Section title={monthTitle(selected) + ' · overview'} p={p} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            {[
              { label: 'WORK SHIFTS', value: String(stats.shifts) },
              { label: 'DAYS OFF', value: String(stats.off) },
              { label: 'SCHEDULED HRS', value: String(stats.hours) },
            ].map((metric) => (
              <View key={metric.label} style={{ flex: 1, backgroundColor: p.surface, padding: 12, borderRadius: 9, gap: 7, borderColor: p.border, borderWidth: 1 }}>
                <Text adjustsFontSizeToFit minimumFontScale={0.7} numberOfLines={1} style={{ color: p.ink, fontSize: 26, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{metric.value}</Text>
                <Text style={{ color: p.muted, fontSize: 10, fontWeight: '700', lineHeight: 15 }}>{metric.label}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: p.muted, fontSize: 12, lineHeight: 18 }}>
            Nominal scheduled hours only. Breaks, payroll and daylight-saving changes aren't calculated.
          </Text>
        </View>

        <View style={{ gap: 10, paddingTop: 4 }}>
          <Section title="Coming up" p={p} />
          {loading ? <Text style={{ color: p.muted }}>Loading your schedule…</Text> :
            upcoming.length === 0 ? <Text style={{ color: p.muted, fontSize: 15, lineHeight: 23 }}>No upcoming working shifts. Start by adding one above.</Text> :
            upcoming.map((shift) => <ShiftCard key={shift.date} date={shift.date} shift={shift} p={p} onPress={() => edit(shift.date)} />)}
        </View>
        <Text style={{ textAlign: 'center', color: p.muted, fontSize: 12, lineHeight: 18 }}>
          Private by default · Available offline · No account required
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
