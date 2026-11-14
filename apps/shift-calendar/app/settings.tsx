import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllShifts, listShifts, remindersEnabled } from '../src/data/repository';
import { disableReminders, enableReminders, syncReminders } from '../src/services/reminders';
import { shareRosterCSV } from '../src/services/export';
import { readableError } from '../src/utils/presentation';
import { useSignalTheme } from '../src/ui/theme';
import { Action, PageHeader, Section, styles } from '../src/ui/components';

export default function SettingsScreen() {
  const { p } = useSignalTheme();
  const [enabled, setEnabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    void (async () => {
      try {
        const [setting, records] = await Promise.all([remindersEnabled(), listShifts()]);
        if (active) { setEnabled(setting); setTotal(records.length); setReady(true); setError(null); }
      } catch (failure) {
        if (active) { setReady(false); setError(readableError(failure)); }
      }
    })();
    return () => { active = false; };
  }, []));

  async function toggle(): Promise<void> {
    if (busy || !ready) return;
    setBusy(true);
    setError(null);
    try {
      if (enabled) {
        await disableReminders();
        setEnabled(false);
      } else {
        const allowed = await enableReminders();
        if (allowed) {
          setEnabled(true);
        } else {
          Alert.alert('Reminders not enabled', 'Notification permission was not granted. You can enable it in system settings and try again.');
        }
      }
    } catch (failure) { setError(readableError(failure)); }
    finally { setBusy(false); }
  }

  async function exportCSV(): Promise<void> {
    if (busy || !ready) return;
    setBusy(true);
    setError(null);
    try { await shareRosterCSV(); }
    catch (failure) { setError(readableError(failure)); }
    finally { setBusy(false); }
  }

  function confirmDelete(): void {
    if (!ready || busy || total === 0) return;
    Alert.alert('Delete your whole roster?', 'This cannot be undone. Export your CSV first if you want a backup.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete everything',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setBusy(true);
            try {
              await clearAllShifts();
              setTotal(0);
              if (enabled) await syncReminders([]);
              Alert.alert('Roster deleted', 'Your saved shifts have been removed from this device.');
            } catch (failure) { setError(readableError(failure)); }
            finally { setBusy(false); }
          })();
        },
      },
    ]);
  }

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, { backgroundColor: p.canvas }]}>
      <ScrollView contentContainerStyle={styles.page}>
        <PageHeader eyebrow="YOUR DATA / YOUR CONTROL" title="Settings." subtitle="Everything stays on your device unless you export it." p={p} />
        {error ? <Text accessibilityRole="alert" style={{ padding: 13, color: p.ink, borderColor: p.accent, borderWidth: 1 }}>{error}</Text> : null}

        <View style={{ gap: 13 }}>
          <Section title="Shift reminders" p={p} />
          <View style={{ padding: 17, borderWidth: 1, borderColor: p.border, borderRadius: 10, backgroundColor: p.surface, gap: 12 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '700' }}>{enabled ? 'Enabled in app' : 'Off by default'}</Text>
            <Text style={{ color: p.muted, lineHeight: 23, fontSize: 15 }}>
              Optional local notification one hour before a shift. Permission is requested only when you turn this on.
              Only upcoming shifts are scheduled; reminders are refreshed when you open the app or edit your roster.
            </Text>
            <Action label={enabled ? 'Turn reminders off' : 'Enable reminders'} p={p} secondary disabled={!ready || busy} onPress={() => { void toggle(); }} />
            <Text style={{ color: p.muted, lineHeight: 19, fontSize: 12 }}>
              Notifications are best effort: device settings, power saving, OS limits, and time changes can affect delivery.
            </Text>
          </View>
        </View>

        <View style={{ gap: 13 }}>
          <Section title="Export and backup" p={p} />
          <View style={{ padding: 17, borderWidth: 1, borderColor: p.border, borderRadius: 10, backgroundColor: p.surface, gap: 12 }}>
            <Text style={{ color: p.ink, fontSize: 17, fontWeight: '700' }}>{total} saved entries</Text>
            <Text style={{ color: p.muted, lineHeight: 22, fontSize: 15 }}>
              Export a spreadsheet-compatible CSV. The share sheet lets you choose where the file goes.
              No automatic cloud backup or import is provided in this preview.
            </Text>
            <Action label="Export my roster (.csv)" p={p} secondary disabled={!ready || busy} onPress={() => { void exportCSV(); }} />
          </View>
        </View>

        <View style={{ gap: 13 }}>
          <Section title="Privacy and ownership" p={p} />
          <Text style={{ color: p.muted, fontSize: 15, lineHeight: 24 }}>
            Shift Calendar stores your roster in a local SQLite database. No account, analytics, location tracking,
            advertising SDK or remote server is used. Uninstalling removes your local data; export first if you need to keep it.
            CSV files you share are managed by the destination you choose.
          </Text>
          <Text style={{ color: p.muted, fontSize: 14, lineHeight: 22 }}>
            Scheduled hours are estimates, not payroll, tax, overtime or legal advice. Overnight shifts are assigned to their start date.
          </Text>
        </View>

        <View style={{ borderTopWidth: 1, borderColor: p.border, paddingTop: 22, gap: 13 }}>
          <Section title="Remove data" p={p} />
          <Text style={{ color: p.muted, fontSize: 14, lineHeight: 21 }}>This removes all saved shifts, including days off. It does not delete a CSV you previously exported.</Text>
          <Action label="Delete all saved shifts" p={p} destructive disabled={!ready || busy || total === 0} onPress={confirmDelete} />
        </View>

        <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ paddingVertical: 16, minHeight: 48 }}>
          <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '700', color: p.accent }}>‹ Back to roster</Text>
        </Pressable>
        <Text style={{ fontSize: 12, lineHeight: 19, color: p.muted, textAlign: 'center' }}>
          App Foundry preview · Not yet a production App Store release
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
