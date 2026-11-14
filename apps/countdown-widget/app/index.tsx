import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, DateField, ErrorLine, Field, Screen, Tap, dayKey, niceDay, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { daysUntil, makeMoment, timeline, type Moment } from '../src/domain';

export default function CountdownScreen() {
  const { theme, p } = useProductTheme('countdown-widget');
  const store = useLocalRecords<Moment>('orbit.moments');
  const today = dayKey(new Date());
  const events = timeline(store.records, today);
  const hero = events[0];
  const count = hero ? daysUntil(hero, today) : null;
  const [name, setName] = useState('');
  const [day, setDay] = useState(today);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    try {
      const event = makeMoment(editing ?? uniqueId(), name, day);
      if (editing) await store.update(editing, () => event);
      else await store.add(event);
      setName(''); setDay(today); setEditing(null); setError(null);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not save event.'); }
  }

  function remove(event: Moment) {
    Alert.alert('Remove event?', event.title + ' will be removed from this device.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { void store.remove(event.id).catch(() => undefined); } },
    ]);
  }

  return <Screen p={p} maxWidth={600}>
    <BrandHeading p={p} theme={theme} subtitle="Only the moments that matter, with room to breathe." />
    <View style={{ paddingVertical: 32, alignItems: 'center', gap: 22 }}>
      <View style={{ width: 254, height: 254, borderRadius: 127, borderWidth: 2, borderColor: p.accent,
        backgroundColor: p.tint, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: p.onTint, fontSize: 87,
          fontFamily: 'serif', letterSpacing: -2, fontWeight: '600' }}>{count === null ? '—' : Math.abs(count)}</Text>
        <Text style={{ color: p.onTint, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
          {count === null ? 'Create your first moment' : count === 0 ? 'Today is the day' : count! > 0 ? 'days to go' : 'days ago'}
        </Text>
      </View>
      <Text style={{ fontSize: 24, lineHeight: 31, fontFamily: 'serif', color: p.ink, textAlign: 'center' }}>
        {hero ? hero.title : 'Anticipation has a shape.'}
      </Text>
      {hero ? <Text style={{ color: p.muted }}>{niceDay(hero.day)}</Text> : null}
    </View>
    <View style={{ padding: 20, gap: 14, borderRadius: 24, backgroundColor: p.surface, borderWidth: 1, borderColor: p.border }}>
      <Text accessibilityRole="header" style={{ color: p.ink, fontSize: 21, fontWeight: '700', fontFamily: 'serif' }}>
        {editing ? 'Edit a moment' : 'A date worth remembering'}
      </Text>
      <Field p={p} label="What are you looking forward to?" value={name} onChange={setName} placeholder="Family holiday, reunion…" maxLength={70} />
      <DateField p={p} label="Event date" day={day} onChange={setDay} />
      <ErrorLine p={p} error={error ?? store.error} />
      <Tap p={p} label={editing ? 'Save changes' : 'Save moment'} onPress={() => { void save(); }} disabled={store.loading} />
      {editing ? <Tap p={p} kind="quiet" label="Cancel editing" onPress={() => { setEditing(null); setName(''); setDay(today); }} /> : null}
    </View>
    <View style={{ gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 20, color: p.ink, fontWeight: '700' }}>Your timeline · {events.length}</Text>
      {events.length === 0 ? <Text style={{ color: p.muted, lineHeight: 23 }}>No events yet. Your first countdown begins with one meaningful date.</Text> : null}
      {events.map((event) => (
        <View key={event.id} style={{ borderBottomWidth: 1, borderColor: p.border, paddingVertical: 15, gap: 9 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: p.ink, fontSize: 18, fontWeight: '700' }}>{event.title}</Text>
              <Text style={{ color: p.muted, fontSize: 14 }}>{niceDay(event.day)} · {daysUntil(event, today) >= 0 ? 'Upcoming' : 'Past'}</Text>
            </View>
            <Text style={{ color: p.accent, fontSize: 25, fontFamily: 'serif', fontWeight: '700' }}>{Math.abs(daysUntil(event, today))}d</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={'Edit '+event.title} style={{ minHeight: 44, justifyContent: 'center' }}
              onPress={() => { setEditing(event.id); setName(event.title); setDay(event.day); }}>
              <Text style={{ color: p.accent, fontWeight: '700' }}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={'Remove '+event.title} style={{ minHeight: 44, justifyContent: 'center' }}
              onPress={() => remove(event)}><Text style={{ color: p.muted }}>Remove</Text></Pressable>
          </View>
        </View>
      ))}
    </View>
    <Text style={{ color: p.muted, lineHeight: 20, fontSize: 12 }}>
      Private on this device. Home-screen widget integration requires a separate native development build and is not enabled in this MVP.
    </Text>
  </Screen>;
}
