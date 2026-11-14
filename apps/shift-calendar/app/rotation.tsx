import { useEffect, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  assertDateKey, dateKey, planRotation, ROTATIONS, type Shift,
} from '../src/domain/roster';
import { insertRotation, listShifts, remindersEnabled } from '../src/data/repository';
import { syncReminders } from '../src/services/reminders';
import { fullDate, readableError } from '../src/utils/presentation';
import { useSignalTheme } from '../src/ui/theme';
import { Action, PageHeader, styles } from '../src/ui/components';

function safeDate(value?: string): string {
  if (value) { try { assertDateKey(value); return value; } catch { /* use today */ } }
  return dateKey(new Date());
}

export default function RotationScreen() {
  const { p } = useSignalTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const startDate = safeDate(typeof date === 'string' ? date : undefined);
  const [rotationId, setRotationId] = useState(ROTATIONS[0]!.id);
  const [days, setDays] = useState(28);
  const [dayStart, setDayStart] = useState('07:00');
  const [dayEnd, setDayEnd] = useState('19:00');
  const [nightStart, setNightStart] = useState('19:00');
  const [nightEnd, setNightEnd] = useState('07:00');
  const [existing, setExisting] = useState<Shift[]>([]);
  const [ready, setReady] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const records = await listShifts();
        if (active) { setExisting(records); setReady(true); setError(null); }
      } catch (failure) { if (active) { setReady(false); setError(readableError(failure)); } }
    };
    void load();
    return () => { active = false; };
  }, []);

  const plan = useMemo(() => {
    if (!ready) return null;
    try {
      return planRotation(startDate, rotationId, days, existing, {
        day: { start: dayStart, end: dayEnd },
        night: { start: nightStart, end: nightEnd },
      });
    } catch {
      return null;
    }
  }, [startDate, rotationId, days, existing, dayStart, dayEnd, nightStart, nightEnd, ready]);

  async function apply(): Promise<void> {
    if (!plan || !ready || applying) return;
    setApplying(true);
    setError(null);
    try {
      const count = await insertRotation(plan.additions);
      try {
        if (await remindersEnabled()) await syncReminders(await listShifts());
      } catch {
        Alert.alert('Schedule saved', 'The rotation was added, but some reminders could not be scheduled.');
      }
      Alert.alert('Rotation applied', count + ' days added. Existing entries were kept unchanged.');
      router.back();
    } catch (failure) {
      setError(readableError(failure));
    } finally {
      setApplying(false);
    }
  }

  const inputStyle = {
    color: p.ink, backgroundColor: p.surface, borderColor: p.border, borderWidth: 1,
    borderRadius: 9, paddingHorizontal: 14, minHeight: 50, fontSize: 18,
    fontVariant: ['tabular-nums'] as const,
  };
  const times = [
    { label: 'Day start', value: dayStart, set: setDayStart },
    { label: 'Day end', value: dayEnd, set: setDayEnd },
    { label: 'Night start', value: nightStart, set: setNightStart },
    { label: 'Night end', value: nightEnd, set: setNightEnd },
  ];
  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, { backgroundColor: p.canvas }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <PageHeader p={p} eyebrow="REPEATING SCHEDULE" title="Set a rotation."
            subtitle={'Starting ' + fullDate(startDate) + '. Your selected date is the first day of the cycle.'} />

          <View style={{ gap: 12 }}>
            {ROTATIONS.map((rotation) => {
              const active = rotation.id === rotationId;
              return (
                <Pressable
                  key={rotation.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => setRotationId(rotation.id)}
                  style={{ padding: 16, gap: 8, minHeight: 78, borderRadius: 9, borderWidth: active ? 2 : 1,
                    borderColor: active ? p.accent : p.border, backgroundColor: active ? p.tint : p.surface }}
                >
                  <Text style={{ color: active ? p.onTint : p.ink, fontSize: 18, fontWeight: '800' }}>{rotation.name}</Text>
                  <Text style={{ color: active ? p.onTint : p.muted, fontSize: 14, lineHeight: 20 }}>{rotation.description}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: 10 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '800' }}>How far ahead?</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[28, 56, 84].map((length) => (
                <Pressable key={length} accessibilityRole="radio" accessibilityState={{ selected: days === length }}
                  onPress={() => setDays(length)}
                  style={{ flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 9,
                    backgroundColor: days === length ? p.accent : p.surface, borderWidth: 1, borderColor: days === length ? p.accent : p.border }}>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: days === length ? p.onAccent : p.ink }}>{length} days</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '800' }}>Shift hours · 24-hour time</Text>
            <Text style={{ color: p.muted, fontSize: 14, lineHeight: 21 }}>
              These times apply to the entire new rotation. You can edit any individual day later.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {times.map((time) => (
                <View key={time.label} style={{ width: '47%', gap: 7 }}>
                  <Text style={{ color: p.muted, fontSize: 13, fontWeight: '700' }}>{time.label}</Text>
                  <TextInput value={time.value} onChangeText={time.set} style={inputStyle} maxLength={5}
                    keyboardType="numbers-and-punctuation" autoCorrect={false}
                    accessibilityLabel={time.label + ', 24-hour HH:mm'} />
                </View>
              ))}
            </View>
          </View>

          <View style={{ padding: 16, borderColor: p.border, borderWidth: 1, backgroundColor: p.surface, gap: 10, borderRadius: 9 }}>
            <Text style={{ color: p.ink, fontSize: 19, fontWeight: '800' }}>Before you apply</Text>
            {plan ? (
              <>
                <Text style={{ color: p.ink, fontSize: 16 }}>{plan.additions.length} entries will be added</Text>
                <Text style={{ color: p.muted, fontSize: 15 }}>{plan.skipped} existing days will be preserved</Text>
              </>
            ) : <Text style={{ color: p.muted }}>Enter valid 24-hour times to preview your schedule.</Text>}
            <Text style={{ color: p.muted, lineHeight: 20, fontSize: 13 }}>
              Existing entries are never replaced. Off days count as entries. No work hours, breaks or pay are calculated automatically.
            </Text>
          </View>
          {error ? <Text accessibilityRole="alert" style={{ color: p.ink, padding: 12, borderColor: p.accent, borderWidth: 1 }}>{error}</Text> : null}
          <Action label={applying ? 'Applying…' : 'Add rotation'} disabled={!plan || plan.additions.length === 0 || applying}
            p={p} onPress={() => { void apply(); }} />
          <Text style={{ color: p.muted, fontSize: 12, lineHeight: 18 }}>
            Changes are saved locally. You can edit or remove individual days in the calendar.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
