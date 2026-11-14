import { useState, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getBrandTheme, type BrandTheme, type Palette } from '@foundry/design-system';
import { asLocalDate, dayKey, niceDay, timeAsDate, timeString } from './dates';

export function useProductTheme(id: string): { theme: BrandTheme; p: Palette } {
  const dark = useColorScheme() === 'dark';
  const theme = getBrandTheme(id);
  if (!theme) throw new Error('Missing design identity ' + id);
  return { theme, p: theme.colors[dark ? 'dark' : 'light'] };
}

export function Screen({
  p, children, inset = 20, maxWidth = 700,
}: { p: Palette; children: ReactNode; inset?: number; maxWidth?: number }) {
  return <SafeAreaView style={{ flex: 1, backgroundColor: p.canvas }}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{
      padding: inset, paddingBottom: 64, width: '100%', maxWidth, alignSelf: 'center', gap: 20,
    }}>{children}</ScrollView>
  </SafeAreaView>;
}

export function Tap({
  p, label, onPress, kind = 'primary', disabled = false,
}: { p: Palette; label: string; onPress: () => void; kind?: 'primary'|'quiet'|'danger'; disabled?: boolean }) {
  const danger = '#9D332A';
  const foreground = kind === 'primary' ? p.onAccent : kind === 'danger' ? danger : p.ink;
  return <Pressable
    accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }}
    disabled={disabled} onPress={onPress} style={({ pressed }) => ({
      minHeight: 48, borderRadius: kind === 'quiet' ? 12 : 14, borderWidth: 1,
      borderColor: kind === 'danger' ? danger : kind === 'primary' ? p.accent : p.border,
      backgroundColor: kind === 'primary' ? p.accent : p.surface,
      opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
      justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    })}>
      <Text style={{ color: foreground, fontWeight: '800', fontSize: 16, textAlign: 'center' }}>{label}</Text>
    </Pressable>;
}

export function Field({
  label, value, onChange, p, placeholder = '', keyboardType = 'default', multiline = false, maxLength = 120,
}: {
  label: string; value: string; onChange: (text: string) => void; p: Palette;
  placeholder?: string; keyboardType?: 'default'|'decimal-pad'|'numeric'; multiline?: boolean; maxLength?: number;
}) {
  return <View style={{ gap: 8 }}>
    <Text style={{ color: p.ink, fontSize: 15, fontWeight: '700' }}>{label}</Text>
    <TextInput
      accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder}
      placeholderTextColor={p.muted} keyboardType={keyboardType} maxLength={maxLength}
      multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'}
      style={{ backgroundColor: p.surface, color: p.ink, borderColor: p.border, borderWidth: 1, borderRadius: 12,
        minHeight: multiline ? 92 : 52, fontSize: 17, paddingHorizontal: 15, paddingVertical: 12 }} />
  </View>;
}

export function DateField({ label, day, onChange, p }: { label: string; day: string; onChange: (day: string) => void; p: Palette }) {
  const [open, setOpen] = useState(false);
  return <View style={{ gap: 8 }}>
    <Text style={{ color: p.ink, fontSize: 15, fontWeight: '700' }}>{label}</Text>
    <Tap p={p} label={niceDay(day) + ' · change date'} onPress={() => setOpen((x) => !x)} kind="quiet" />
    {open ? <>
      <DateTimePicker
        mode="date" value={asLocalDate(day)} display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(_event, date) => {
          if (Platform.OS === 'android') setOpen(false);
          if (date) onChange(dayKey(date));
        }}
      />
      {Platform.OS === 'ios' ? <Tap p={p} label="Done" kind="quiet" onPress={() => setOpen(false)} /> : null}
    </> : null}
  </View>;
}

export function TimeField({ label, time, onChange, p }: { label: string; time: string; onChange: (time: string) => void; p: Palette }) {
  const [open, setOpen] = useState(false);
  return <View style={{ gap: 8 }}>
    <Text style={{ color: p.ink, fontSize: 15, fontWeight: '700' }}>{label}</Text>
    <Tap p={p} label={time + ' · change time'} kind="quiet" onPress={() => setOpen((x) => !x)} />
    {open ? <>
      <DateTimePicker mode="time" is24Hour value={timeAsDate(time)} display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(_event, selected) => {
          if (Platform.OS === 'android') setOpen(false);
          if (selected) onChange(timeString(selected));
        }} />
      {Platform.OS === 'ios' ? <Tap p={p} label="Done" kind="quiet" onPress={() => setOpen(false)} /> : null}
    </> : null}
  </View>;
}

export function SectionTitle({ p, children }: { p: Palette; children: string }) {
  return <Text accessibilityRole="header" style={{ fontSize: 19, fontWeight: '800', letterSpacing: -0.3, color: p.ink }}>{children}</Text>;
}

export function ErrorLine({ error, p }: { error: string | null; p: Palette }) {
  return error ? <Text accessibilityRole="alert" style={{
    borderColor: p.accent, borderWidth: 1, padding: 12, borderRadius: 9, color: p.ink, lineHeight: 22,
  }}>{error}</Text> : null;
}

export function BrandHeading({ p, theme, subtitle }: { p: Palette; theme: BrandTheme; subtitle?: string }) {
  return <View style={{ gap: 8 }}>
    <Text style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: p.accent }}>{theme.copy.eyebrow}</Text>
    <Text accessibilityRole="header" style={{
      fontSize: theme.typography.headlineSize, lineHeight: theme.typography.headlineSize * 1.15, fontWeight: theme.typography.weight,
      letterSpacing: theme.typography.tracking, color: p.ink,
      fontFamily: theme.typography.family === 'serif' ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : undefined,
    }}>{theme.copy.headline}</Text>
    <Text style={{ fontSize: Math.max(16, theme.typography.bodySize), lineHeight: 25, color: p.muted }}>{subtitle ?? theme.copy.body}</Text>
  </View>;
}

export const uiStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  cards: { gap: 12 },
});
