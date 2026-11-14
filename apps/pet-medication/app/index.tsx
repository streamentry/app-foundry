import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, DateField, ErrorLine, Field, Screen, Tap, dayKey, niceDay, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { makeTreatment, recordGiven, treatmentRemaining, undoLast, type Treatment } from '../src/domain';

export default function PetScreen() {
  const {theme,p}=useProductTheme('pet-medication');
  const store=useLocalRecords<Treatment>('companion.treatments');
  const today=dayKey(new Date());
  const items=[...store.records].sort((a,b)=>treatmentRemaining(a,today)-treatmentRemaining(b,today));
  const due=items.filter((item)=>treatmentRemaining(item,today)<=0);
  const [pet,setPet]=useState('');const [name,setName]=useState('');
  const [date,setDate]=useState(today);const [interval,setInterval]=useState('30');
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  async function save(){
    try{
      const record=makeTreatment(editing??uniqueId(),pet,name,date,Number(interval));
      if(editing)await store.update(editing,(prev)=>({...record,history:prev.history}));
      else await store.add(record);
      setEditing(null);setPet('');setName('');setDate(today);setError(null);
    }catch(failure){setError(failure instanceof Error?failure.message:'Could not save treatment.');}
  }
  function confirmGiven(item:Treatment){
    Alert.alert('Record treatment as given?',item.name+' for '+item.pet+' on '+niceDay(today)+'. Only confirm if it was actually given.',[
      {text:'Cancel',style:'cancel'}, {text:'Yes, record it',onPress:()=>{
        void store.update(item.id,(prev)=>recordGiven(prev,today)).catch((failure:unknown)=>setError(failure instanceof Error?failure.message:'Could not save.'));
      }}
    ]);
  }
  function remove(item:Treatment){
    Alert.alert('Remove treatment?',item.name+' for '+item.pet+' and its history will be deleted.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(item.id).catch(() => undefined);}}
    ]);
  }
  return <Screen p={p} maxWidth={650}>
    <BrandHeading p={p} theme={theme} subtitle="A treatment belongs to one pet. Keep the record clear." />
    <View style={{backgroundColor:p.tint,borderRadius:22,padding:22,flexDirection:'row',alignItems:'center',gap:15}}>
      <View style={{height:74,width:74,borderRadius:37,backgroundColor:p.surface,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:p.accent,fontSize:34,fontWeight:'800'}}>♥</Text>
      </View>
      <View style={{flex:1,gap:6}}>
        <Text style={{fontSize:12,fontWeight:'800',letterSpacing:1.1,color:p.onTint}}>CARE BOARD</Text>
        <Text style={{fontSize:30,fontWeight:'800',color:p.onTint}}>{due.length} due now</Text>
        <Text style={{fontSize:14,color:p.onTint}}>{items.length} scheduled treatments</Text>
      </View>
    </View>
    <View style={{gap:15}}>
      <Text accessibilityRole="header" style={{fontSize:22,fontWeight:'800',color:p.ink}}>Treatment timeline</Text>
      {items.length===0?<Text style={{color:p.muted,lineHeight:24}}>Add a pet and one care plan to get started.</Text>:null}
      {items.map((item)=>{
        const remaining=treatmentRemaining(item,today);
        const canUndo=item.history.length>0;
        return <View key={item.id} style={{borderColor:p.border,borderWidth:1,borderRadius:18,padding:17,backgroundColor:p.surface,gap:12}}>
          <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
            <View style={{backgroundColor:p.tint,borderRadius:25,width:50,height:50,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:p.onTint,fontSize:21,fontWeight:'800'}}>{item.pet.slice(0,1).toUpperCase()}</Text>
            </View>
            <View style={{flex:1,gap:4}}>
              <Text style={{fontSize:13,fontWeight:'800',color:p.accent}}>{item.pet.toUpperCase()}</Text>
              <Text style={{fontSize:19,fontWeight:'800',color:p.ink}}>{item.name}</Text>
            </View>
          </View>
          <Text style={{color:p.ink,fontSize:16,fontWeight:'700'}}>{remaining<0?'Overdue by '+Math.abs(remaining)+' days':remaining===0?'Due today':'Next due in '+remaining+' days'}</Text>
          <Text style={{color:p.muted,fontSize:13}}>Due {niceDay(item.dueOn)} · repeats every {item.intervalDays} days · {item.history.length} records</Text>
          <Tap p={p} label="Record as given" onPress={()=>confirmGiven(item)}/>
          <View style={{flexDirection:'row',gap:22,flexWrap:'wrap'}}>
            {canUndo?<Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>{void store.update(item.id,undoLast).catch((e:unknown)=>setError(e instanceof Error?e.message:'Could not undo.'));}}>
              <Text style={{color:p.accent,fontWeight:'700'}}>Undo last</Text>
            </Pressable>:null}
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>{setEditing(item.id);setPet(item.pet);setName(item.name);setDate(item.dueOn);setInterval(String(item.intervalDays));}}>
              <Text style={{color:p.accent,fontWeight:'700'}}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>remove(item)}><Text style={{color:p.muted}}>Remove</Text></Pressable>
          </View>
        </View>;
      })}
    </View>
    <View style={{gap:15,padding:20,borderRadius:18,borderWidth:1,borderColor:p.border,backgroundColor:p.surface}}>
      <Text accessibilityRole="header" style={{fontSize:20,fontWeight:'800',color:p.ink}}>{editing?'Edit care plan':'Add a care plan'}</Text>
      <Field p={p} label="Pet name" value={pet} onChange={setPet} maxLength={50} placeholder="Milo"/>
      <Field p={p} label="Treatment name" value={name} onChange={setName} maxLength={80} placeholder="As prescribed or labeled"/>
      <DateField p={p} label="Next due date" day={date} onChange={setDate}/>
      <Field p={p} label="Repeat every (days)" value={interval} onChange={setInterval} keyboardType="numeric" maxLength={3}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save changes':'Add treatment'} onPress={()=>{void save();}} disabled={store.loading}/>
      {editing?<Tap p={p} label="Cancel edit" kind="quiet" onPress={()=>{setEditing(null);setPet('');setName('');}}/>:null}
    </View>
    <Text style={{color:p.muted,fontSize:12,lineHeight:20}}>A recordkeeping tool, not veterinary guidance. Consult your veterinarian about dosing and missed treatments. No reminders, accounts or synchronization in this MVP.</Text>
  </Screen>;
}
