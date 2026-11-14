import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, DateField, ErrorLine, Field, Screen, Tap, dayKey, niceDay, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { fromKm, makeTrip, totalDistance, tripsCSV, type Trip, type Unit } from '../src/domain';
import { shareTrips } from '../src/export';

export default function MileageScreen() {
  const {theme,p}=useProductTheme('mileage-log');
  const store=useLocalRecords<Trip>('ledger.trips');
  const today=dayKey(new Date());
  const [unit,setUnit]=useState<Unit>('km');
  const [distance,setDistance]=useState('');
  const [purpose,setPurpose]=useState('');
  const [day,setDay]=useState(today);
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const trips=[...store.records].sort((a,b)=>b.day.localeCompare(a.day));
  const total=totalDistance(trips,unit);
  async function save(){
    try{
      const row=makeTrip(editing??uniqueId(),day,Number(distance),unit,purpose);
      if(editing) await store.update(editing,()=>row); else await store.add(row);
      setDistance('');setPurpose('');setDay(today);setEditing(null);setError(null);
    }catch(failure){setError(failure instanceof Error?failure.message:'Could not save trip.');}
  }
  function remove(t:Trip){
    Alert.alert('Delete trip?',niceDay(t.day)+' · '+t.purpose,[
      {text:'Keep',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{void store.remove(t.id);}}
    ]);
  }
  async function exportFile(){
    try{await shareTrips(tripsCSV(trips));setError(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'Could not export.');}
  }
  return <Screen p={p} maxWidth={650} inset={22}>
    <BrandHeading p={p} theme={theme} subtitle="Every trip, recorded clearly. No background tracking."/>
    <View style={{backgroundColor:p.ink,borderRadius:10,padding:24,gap:17}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color:p.canvas,fontSize:11,fontWeight:'800',letterSpacing:1.4}}>YOUR TRIP LEDGER</Text>
        <Text style={{color:p.canvas,fontSize:13}}>{trips.length} records</Text>
      </View>
      <Text adjustsFontSizeToFit numberOfLines={1} style={{color:p.canvas,fontSize:57,fontWeight:'800',letterSpacing:-2,fontVariant:['tabular-nums']}}>
        {total.toFixed(1)} <Text style={{fontSize:24}}>{unit}</Text>
      </Text>
      <View style={{height:1,backgroundColor:p.canvas,opacity:0.28}}/>
      <Text style={{color:p.canvas,fontSize:14}}>Total distance entered · all dates</Text>
    </View>
    <View style={{gap:14}}>
      <Text accessibilityRole="header" style={{color:p.ink,fontSize:23,fontWeight:'800'}}>Record a trip</Text>
      <View style={{flexDirection:'row',gap:8,justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color:p.muted,fontSize:14}}>DISTANCE UNIT</Text>
        <View style={{flexDirection:'row',gap:8}}>{(['km','mi'] as const).map((u)=>(
          <Pressable accessibilityRole="radio" accessibilityState={{selected:unit===u}} key={u}
            style={{minWidth:70,minHeight:48,justifyContent:'center',alignItems:'center',backgroundColor:unit===u?p.accent:p.surface,borderRadius:8,borderWidth:1,borderColor:unit===u?p.accent:p.border}}
            onPress={()=>setUnit(u)}><Text style={{color:unit===u?p.onAccent:p.ink,fontWeight:'800'}}>{u}</Text></Pressable>
        ))}</View>
      </View>
      <Field p={p} label={'Distance ('+unit+')'} value={distance} onChange={setDistance} placeholder="12.5" keyboardType="decimal-pad" maxLength={12}/>
      <Field p={p} label="Trip purpose" value={purpose} onChange={setPurpose} placeholder="Client visit, supplies…" maxLength={120}/>
      <DateField p={p} label="Trip date" day={day} onChange={setDay}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save edited trip':'Add trip'} disabled={store.loading} onPress={()=>{void save();}}/>
      {editing?<Tap p={p} label="Cancel edit" kind="quiet" onPress={()=>{setEditing(null);setDistance('');setPurpose('');setDay(today);}}/>:null}
    </View>
    <View style={{gap:13}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text accessibilityRole="header" style={{color:p.ink,fontSize:21,fontWeight:'800'}}>Recent entries</Text>
        <Pressable style={{minHeight:48,justifyContent:'center'}} accessibilityRole="button" accessibilityLabel="Export CSV of all trips"
          onPress={()=>{void exportFile();}}><Text style={{color:p.accent,fontWeight:'800'}}>Export CSV ›</Text></Pressable>
      </View>
      <View style={{borderTopColor:p.border,borderTopWidth:1}}>
        {trips.length===0?<Text style={{color:p.muted,paddingVertical:20}}>No trips recorded yet.</Text>:null}
        {trips.map((t,i)=>(
          <View key={t.id} style={{borderBottomWidth:1,borderColor:p.border,paddingVertical:15,gap:9}}>
            <View style={{flexDirection:'row',alignItems:'center',gap:12,justifyContent:'space-between'}}>
              <View style={{flex:1,gap:4}}>
                <Text style={{color:p.muted,fontSize:12,fontWeight:'800'}}>#{String(trips.length-i).padStart(3,'0')} · {niceDay(t.day)}</Text>
                <Text style={{color:p.ink,fontSize:17,fontWeight:'700'}}>{t.purpose}</Text>
              </View>
              <Text style={{color:p.ink,fontSize:20,fontWeight:'800',fontVariant:['tabular-nums']}}>{fromKm(t.distanceKm,unit).toFixed(1)} {unit}</Text>
            </View>
            <View style={{flexDirection:'row',gap:24}}>
              <Pressable style={{minHeight:44,justifyContent:'center'}} accessibilityRole="button" onPress={()=>{setEditing(t.id);setDay(t.day);setPurpose(t.purpose);setDistance(fromKm(t.distanceKm,unit).toFixed(2));}}>
                <Text style={{color:p.accent,fontWeight:'700'}}>Edit</Text>
              </Pressable>
              <Pressable style={{minHeight:44,justifyContent:'center'}} accessibilityRole="button" onPress={()=>remove(t)}>
                <Text style={{color:p.muted}}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
    <Text style={{color:p.muted,fontSize:12,lineHeight:19}}>Manual distance records only. No GPS, background location, tax classification or reimbursement calculations. Check local rules independently. Data stays on this device until you export it.</Text>
  </Screen>;
}
