import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, ErrorLine, Field, Screen, Tap, TimeField, dayKey, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { dueToday, isLogged, makeMedication, toggleLog, type Medication } from '../src/domain';

export default function MedicationScreen() {
  const { theme, p } = useProductTheme('medication-checklist');
  const store = useLocalRecords<Medication>('clarity.daily-medications');
  const today = dayKey(new Date());
  const sorted = [...store.records].sort((a,b)=>a.time.localeCompare(b.time));
  const finished = sorted.filter((m)=>isLogged(m,today)).length;
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    try {
      const base = makeMedication(editing ?? uniqueId(), name, time);
      if (editing) await store.update(editing, (prev)=>({...base,loggedDays:prev.loggedDays}));
      else await store.add(base);
      setEditing(null); setName(''); setError(null);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not save.'); }
  }
  async function toggle(m: Medication) {
    try { await store.update(m.id, (prev)=>toggleLog(prev,today)); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not update log.'); }
  }
  function remove(m: Medication) {
    Alert.alert('Remove from checklist?', 'This will also delete locally logged days for '+m.name+'.', [
      { text:'Cancel',style:'cancel' },
      { text:'Remove',style:'destructive',onPress:()=>{void store.remove(m.id).catch(() => undefined);} },
    ]);
  }
  const pending = dueToday(sorted,today);
  return <Screen p={p} maxWidth={650}>
    <BrandHeading p={p} theme={theme} subtitle="A simple daily record. You decide and confirm what you have actually taken." />
    <View style={{ backgroundColor: p.tint, padding: 24, borderRadius: 17, gap: 10 }}>
      <Text style={{ color: p.onTint, fontSize: 12, letterSpacing: 1.3, fontWeight: '800' }}>TODAY'S LOG · {today}</Text>
      <Text style={{ color: p.onTint, fontWeight: '800', fontSize: 46 }}>{finished} / {sorted.length}</Text>
      <Text style={{ color: p.onTint, fontSize: 17, lineHeight: 25 }}>
        {sorted.length === 0 ? 'Add your first medicine to begin.' : pending.length === 0 ? 'All entries have been logged for today.' : pending.length+' still not logged today.'}
      </Text>
      <Text style={{ color: p.onTint, fontSize: 12, lineHeight: 18 }}>A notification or checklist is never evidence that a dose was taken.</Text>
    </View>
    <View style={{ gap: 14 }}>
      <Text accessibilityRole="header" style={{ color: p.ink, fontSize: 22, fontWeight: '800' }}>Today's routine</Text>
      {sorted.map((m)=> {
        const done=isLogged(m,today);
        return <View key={m.id} style={{ flexDirection: 'row', gap: 14, backgroundColor: p.surface,
          borderRadius: 13, borderColor: p.border, borderWidth: 1, padding: 15, alignItems: 'center' }}>
          <View style={{ minWidth: 62, alignItems: 'center', gap: 5 }}>
            <Text style={{ color: p.ink, fontSize: 19, fontWeight: '800', fontVariant:['tabular-nums'] }}>{m.time}</Text>
            <View style={{ backgroundColor: done ? p.tint : p.canvas, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}>
              <Text style={{ color: done ? p.onTint : p.muted, fontSize: 11, fontWeight: '700' }}>{done ? 'LOGGED' : 'NOT LOGGED'}</Text>
            </View>
          </View>
          <View style={{ flex: 1, gap: 9 }}>
            <Text style={{ fontWeight: '700', fontSize: 18, lineHeight: 24, color: p.ink }}>{m.name}</Text>
            <Tap p={p} label={done ? 'Undo taken log' : 'Log as taken'} kind={done?'quiet':'primary'} onPress={()=>{void toggle(m);}} />
            <View style={{ flexDirection:'row',gap:24 }}>
              <Pressable style={{ minHeight:44, justifyContent:'center' }} accessibilityRole="button" onPress={()=>{setEditing(m.id);setName(m.name);setTime(m.time);}}>
                <Text style={{color:p.accent,fontWeight:'700'}}>Edit</Text>
              </Pressable>
              <Pressable style={{ minHeight:44, justifyContent:'center' }} accessibilityRole="button" onPress={()=>remove(m)}>
                <Text style={{color:p.muted}}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>;
      })}
    </View>
    <View style={{ backgroundColor:p.surface,borderWidth:1,borderColor:p.border,borderRadius:17,padding:20,gap:16 }}>
      <Text accessibilityRole="header" style={{ color:p.ink,fontWeight:'800',fontSize:20 }}>{editing?'Edit daily entry':'Add a daily entry'}</Text>
      <Field label="Medicine name" value={name} onChange={setName} p={p} placeholder="As written on your label" maxLength={70} />
      <TimeField label="Usual check-in time" time={time} onChange={setTime} p={p} />
      <ErrorLine error={error ?? store.error} p={p} />
      <Tap label={editing?'Save changes':'Add to checklist'} p={p} onPress={()=>{void save();}} disabled={store.loading} />
      {editing?<Tap label="Cancel" kind="quiet" p={p} onPress={()=>{setEditing(null);setName('');}}/>:null}
    </View>
    <Text style={{color:p.muted,lineHeight:21,fontSize:13}}>
      For personal tracking only. Not medical advice, dosage guidance, or an emergency reminder service. No notifications or caregiver sync are included yet. Do not change prescribed medicines based on this app.
    </Text>
  </Screen>;
}
