import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { ErrorLine, Field, Screen, Tap, TimeField, dayKey, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { completedToday, makeRoutine, routinesForDay, toggleRoutine, type Routine } from '../src/domain';

export default function DaylightScreen() {
  const {p}=useProductTheme('elderly-routine');
  const store=useLocalRecords<Routine>('daylight.routines');
  const today=dayKey(new Date());
  const items=routinesForDay(store.records,today);
  const next=items.find((r)=>!completedToday(r,today));
  const completed=items.filter((r)=>completedToday(r,today)).length;
  const [title,setTitle]=useState('');
  const [time,setTime]=useState('09:00');
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  async function save(){
    try{
      const routine=makeRoutine(editing??uniqueId(),title,time);
      if(editing)await store.update(editing,(old)=>({...routine,completedOn:old.completedOn}));
      else await store.add(routine);
      setTitle('');setTime('09:00');setEditing(null);setError(null);
    }catch(failure){setError(failure instanceof Error?failure.message:'Could not save routine.');}
  }
  async function toggle(item:Routine){
    try{await store.update(item.id,(previous)=>toggleRoutine(previous,today));setError(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'Could not save.');}
  }
  function remove(item:Routine){
    Alert.alert('Remove routine?',item.title+' will be removed from this device.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(item.id).catch(() => undefined);}}
    ]);
  }
  return <Screen p={p} maxWidth={640} inset={26}>
    <View style={{paddingTop:14,gap:8}}>
      <Text style={{color:p.accent,fontSize:13,fontWeight:'800',letterSpacing:1.3}}>TODAY · YOUR PACE</Text>
      <Text accessibilityRole="header" style={{color:p.ink,fontWeight:'800',fontSize:39,lineHeight:48}}>A gentle day.</Text>
      <Text style={{color:p.muted,fontSize:20,lineHeight:31}}>One thing at a time. You can choose when to begin.</Text>
    </View>
    <View style={{borderRadius:16,backgroundColor:p.surface,borderColor:p.border,borderWidth:1,padding:26,gap:20,minHeight:300}}>
      <Text style={{color:p.muted,fontSize:14,fontWeight:'800',letterSpacing:1.3}}>{next?'NEXT MOMENT':'TODAY AT A GLANCE'}</Text>
      <Text style={{color:p.ink,fontSize:49,fontWeight:'800',letterSpacing:-1,fontVariant:['tabular-nums']}}>{next?next.time:'✓'}</Text>
      <Text style={{color:p.ink,fontSize:27,fontWeight:'700',lineHeight:37}}>{next?next.title:items.length===0?'Begin with one routine':'You have finished for today.'}</Text>
      <Text style={{color:p.muted,fontSize:17,lineHeight:26}}>{next?'Take your time.':'Nothing else is scheduled right now.'}</Text>
      {next?<Tap p={p} label={'Done for today: '+next.title} onPress={()=>{void toggle(next);}}/>:null}
      <Text style={{color:p.muted,fontSize:16}}>{completed} of {items.length} completed today</Text>
    </View>
    <View style={{gap:15}}>
      <Text accessibilityRole="header" style={{fontSize:25,fontWeight:'800',color:p.ink}}>Your daily moments</Text>
      {items.map((item)=>{
        const done=completedToday(item,today);
        return <View key={item.id} style={{backgroundColor:done?p.tint:p.surface,borderColor:p.border,borderWidth:1,
          borderRadius:14,padding:18,gap:12}}>
          <View style={{flexDirection:'row',gap:14,alignItems:'center'}}>
            <Text style={{fontSize:23,fontWeight:'800',color:done?p.onTint:p.ink,fontVariant:['tabular-nums']}}>{item.time}</Text>
            <View style={{flex:1,gap:5}}>
              <Text style={{color:done?p.onTint:p.ink,fontWeight:'700',fontSize:21,lineHeight:29}}>{item.title}</Text>
              <Text style={{color:done?p.onTint:p.muted,fontSize:16}}>{done?'Completed today':'Not completed yet'}</Text>
            </View>
          </View>
          <Tap p={p} kind={done?'quiet':'primary'} label={done?'Undo completion':'Mark complete'} onPress={()=>{void toggle(item);}}/>
          <View style={{flexDirection:'row',gap:22}}>
            <Pressable accessibilityRole="button" style={{minHeight:48,justifyContent:'center'}} onPress={()=>{setEditing(item.id);setTitle(item.title);setTime(item.time);}}>
              <Text style={{color:p.accent,fontWeight:'700',fontSize:16}}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={{minHeight:48,justifyContent:'center'}} onPress={()=>remove(item)}>
              <Text style={{color:p.muted,fontSize:16}}>Remove</Text>
            </Pressable>
          </View>
        </View>;
      })}
    </View>
    <View style={{gap:17,paddingTop:20,borderTopColor:p.border,borderTopWidth:1}}>
      <Text accessibilityRole="header" style={{color:p.ink,fontSize:25,fontWeight:'800'}}>{editing?'Change a moment':'Add a daily moment'}</Text>
      <Field p={p} label="What would you like to do?" value={title} onChange={setTitle} placeholder="Take a walk, call family…" maxLength={80}/>
      <TimeField p={p} label="Usual time" time={time} onChange={setTime}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save changes':'Add to my day'} disabled={store.loading} onPress={()=>{void save();}}/>
      {editing?<Tap p={p} label="Cancel changes" kind="quiet" onPress={()=>{setEditing(null);setTitle('');}}/>:null}
    </View>
    <Text style={{color:p.muted,fontSize:14,lineHeight:24}}>
      Designed for independence. No automatic alerts, caregiver monitoring, medical instructions or cloud access. This checklist is not a substitute for urgent care or personal support.
    </Text>
  </Screen>;
}
