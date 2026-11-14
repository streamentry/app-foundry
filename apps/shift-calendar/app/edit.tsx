import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  assertDateKey, dateKey, DEFAULT_TIMES, durationMinutes, makeShift,
  SHIFT_KINDS, SHIFT_LABELS, type ShiftKind,
} from '../src/domain/roster';
import { deleteShift, listShifts, remindersEnabled, upsertShift } from '../src/data/repository';
import { syncReminders } from '../src/services/reminders';
import { fullDate, readableError } from '../src/utils/presentation';
import { useSignalTheme } from '../src/ui/theme';
import { Action, PageHeader, styles } from '../src/ui/components';

function selectedDate(raw: string | undefined): string {
  if (raw) {
    try { assertDateKey(raw); return raw; } catch { /* fall through to today */ }
  }
  return dateKey(new Date());
}

export default function EditShiftScreen() {
  const { p } = useSignalTheme();
  const params = useLocalSearchParams<{ date: string }>();
  const date = selectedDate(typeof params.date === 'string' ? params.date : undefined);
  const [ready, setReady] = useState(false);
  const [existing, setExisting] = useState(false);
  const [kind, setKind] = useState<ShiftKind>('day');
  const [start, setStart] = useState(DEFAULT_TIMES.day.start);
  const [end, setEnd] = useState(DEFAULT_TIMES.day.end);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setReady(false);
    const load = async () => {
      try {
        const record = (await listShifts()).find((shift) => shift.date === date);
        if (!alive) return;
        setExisting(Boolean(record));
        const chosenKind = record?.kind ?? 'day';
        setKind(chosenKind);
        const defaults = chosenKind === 'off' ? DEFAULT_TIMES.day : DEFAULT_TIMES[chosenKind];
        setStart(record?.start ?? defaults.start);
        setEnd(record?.end ?? defaults.end);
        setNote(record?.note ?? '');
        setError(null);
      } catch (failure) {
        if (alive) setError('Unable to open your saved schedule: ' + readableError(failure));
      } finally {
        if (alive) setReady(true);
      }
    };
    void load();
    return () => { alive = false; };
  }, [date]);

  function chooseKind(next: ShiftKind): void {
    setKind(next);
    if (next !== 'off') {
      setStart(DEFAULT_TIMES[next].start);
      setEnd(DEFAULT_TIMES[next].end);
    }
    setError(null);
  }

  async function updateReminders(): Promise<void> {
    try {
      if (await remindersEnabled()) await syncReminders(await listShifts());
    } catch {
      Alert.alert('Reminder update failed', 'The schedule was saved, but reminders could not be refreshed. Check Settings.');
    }
  }

  async function save(): Promise<void> {
    if (saving || !ready) return;
    setSaving(true);
    setError(null);
    try {
      const shift = makeShift(date, kind, start, end, note);
      await upsertShift(shift);
      await updateReminders();
      router.back();
    } catch (failure) {
      setError(readableError(failure));
    } finally {
      setSaving(false);
    }
  }

  function askDelete(): void {
    if (saving || !existing) return;
    Alert.alert('Remove this entry?', fullDate(date) + ' will become unscheduled.', [
      { text: 'Keep shift', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: () => {
          void (async () => {
            setSaving(true);
            try {
              await deleteShift(date);
              await updateReminders();
              router.back();
            } catch (failure) {
              setError(readableError(failure));
              setSaving(false);
            }
          })();
        },
      },
    ]);
  }

  let hours: number | null = null;
  if (kind !== 'off') {
    try { hours = durationMinutes(makeShift(date, kind, start, end)) / 60; } catch { /* invalid draft */ }
  }

  const inputStyle = {
    color: p.ink, backgroundColor: p.surface, borderColor: p.border, borderWidth: 1,
    borderRadius: 9, paddingHorizontal: 14, minHeight: 54, fontSize: 19,
    fontVariant: ['tabular-nums'] as const,
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, { backgroundColor: p.canvas }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
          <PageHeader eyebrow={existing ? 'EDIT ROSTER' : 'NEW ROSTER ENTRY'} title={fullDate(date)}
            subtitle="One entry per day. Overnight shifts end the next calendar day." p={p} />

          <View style={{ gap: 12 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '800' }}>Shift type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {SHIFT_KINDS.map((value) => {
                const selected = kind === value;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={SHIFT_LABELS[value]}
                    onPress={() => chooseKind(value)}
                    style={{ width: '48%', minHeight: 66, paddingHorizontal: 12, gap: 5, justifyContent: 'center',
                      borderRadius: 9, borderWidth: 1.5, borderColor: selected ? p.accent : p.border, backgroundColor: selected ? p.tint : p.surface }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '800', color: selected ? p.onTint : p.ink }}>{SHIFT_LABELS[value]}</Text>
                    <Text style={{ fontSize: 12, color: selected ? p.onTint : p.muted }}>
                      {value === 'off' ? 'No scheduled work' : DEFAULT_TIMES[value].start + '–' + DEFAULT_TIMES[value].end}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {kind !== 'off' ? (
            <View style={{ gap: 12 }}>
              <Text style={{ color: p.ink, fontSize: 17, fontWeight: '800' }}>Working hours · 24-hour time</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={{ color: p.muted, fontSize: 14 }}>Start (HH:mm)</Text>
                  <TextInput
                    style={inputStyle} value={start} onChangeText={setStart}
                    keyboardType="numbers-and-punctuation" autoCorrect={false} maxLength={5}
                    accessibilityLabel="Shift start time in 24-hour format" placeholder="07:00" placeholderTextColor={p.muted}
                  />
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={{ color: p.muted, fontSize: 14 }}>End (HH:mm)</Text>
                  <TextInput
                    style={inputStyle} value={end} onChangeText={setEnd}
                    keyboardType="numbers-and-punctuation" autoCorrect={false} maxLength={5}
                    accessibilityLabel="Shift end time in 24-hour format" placeholder="15:00" placeholderTextColor={p.muted}
                  />
                </View>
              </View>
              <Text style={{ color: p.muted, fontSize: 13 }}>
                {hours === null ? 'Enter valid times (e.g., 07:00 and 15:00).' :
                  hours + ' nominal scheduled hours' + (end <= start ? ' · overnight' : '')}
              </Text>
            </View>
          ) : null}

          <View style={{ gap: 9 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '800' }}>Note (optional)</Text>
            <TextInput
              style={{ color: p.ink, backgroundColor: p.surface, borderColor: p.border, borderWidth: 1,
                borderRadius: 9, minHeight: 94, fontSize: 16, padding: 14, textAlignVertical: 'top' }}
              value={note} onChangeText={setNote} multiline maxLength={160}
              accessibilityLabel="Optional shift note"
              placeholder="Ward, location, or personal reminder" placeholderTextColor={p.muted}
            />
            <Text style={{ color: p.muted, fontSize: 12, textAlign: 'right' }}>{note.length} / 160</Text>
          </View>

          {error ? <Text accessibilityRole="alert" style={{ color: p.ink, borderWidth: 1, borderColor: p.accent, padding: 12 }}>{error}</Text> : null}
          <Action label={saving ? 'Saving…' : kind === 'off' ? 'Save day off' : 'Save shift'}
            disabled={!ready || saving || (kind !== 'off' && hours === null)} p={p} onPress={() => { void save(); }} />

          {existing ? <Action label="Remove this entry" destructive p={p} disabled={!ready || saving} onPress={askDelete} /> : null}

          <Text style={{ color: p.muted, fontSize: 13, lineHeight: 20 }}>
            Saved only to this device. No account, no cloud sync. Use Settings to export a CSV backup.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
