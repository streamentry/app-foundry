import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, DateField, ErrorLine, Field, Screen, Tap, dayKey, niceDay, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { daysToWater, makePlant, nextWater, water, type Plant } from '../src/domain';

export default function PlantScreen() {
  const { theme, p } = useProductTheme('plant-watering');
  const store = useLocalRecords<Plant>('canopy.plants');
  const today = dayKey(new Date());
  const sorted = [...store.records].sort((a,b)=>daysToWater(a,today)-daysToWater(b,today));
  const due = sorted.filter((plant)=>daysToWater(plant,today)<=0);
  const [name,setName]=useState('');
  const [interval,setInterval]=useState('7');
  const [last,setLast]=useState(today);
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  async function save() {
    try {
      const plant=makePlant(editing??uniqueId(),name,Number(interval),last);
      if(editing) await store.update(editing,(previous)=>({...plant,history:previous.history}));
      else await store.add(plant);
      setName('');setInterval('7');setLast(today);setEditing(null);setError(null);
    } catch(failure){setError(failure instanceof Error?failure.message:'Could not save plant.');}
  }
  async function waterNow(plant:Plant) {
    try {await store.update(plant.id,(previous)=>water(previous,today));setError(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'Could not log watering.');}
  }
  function remove(plant:Plant){
    Alert.alert('Remove plant?',plant.name+' and its watering history will be removed.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(plant.id);}}
    ]);
  }
  return <Screen p={p} maxWidth={650}>
    <BrandHeading p={p} theme={theme} subtitle="Your plants, your rhythm. Care should feel light." />
    <View style={{minHeight:235,backgroundColor:p.tint,borderRadius:28,padding:25,justifyContent:'flex-end',gap:9,overflow:'hidden'}}>
      <View style={{height:138,width:138,borderRadius:90,position:'absolute',right:-20,top:-40,backgroundColor:p.accent,opacity:0.14,transform:[{rotate:'34deg'}]}}/>
      <View style={{height:106,width:106,borderRadius:72,position:'absolute',right:62,top:-10,backgroundColor:p.accent,opacity:0.1,transform:[{rotate:'-26deg'}]}}/>
      <Text style={{color:p.onTint,fontSize:12,fontWeight:'800',letterSpacing:1.3}}>NEED ATTENTION TODAY</Text>
      <Text style={{color:p.onTint,fontFamily:'serif',fontSize:62,fontWeight:'700'}}>{due.length}</Text>
      <Text style={{color:p.onTint,fontSize:18,lineHeight:26}}>{due.length===0?'All caught up, for now.':'A moment of care for your green corner.'}</Text>
    </View>
    <View style={{gap:12}}>
      <Text accessibilityRole="header" style={{fontSize:25,fontWeight:'700',fontFamily:'serif',color:p.ink}}>Your collection</Text>
      {sorted.length===0?<Text style={{color:p.muted,fontSize:16,lineHeight:23}}>Add a plant to start a simple, editable watering calendar.</Text>:null}
      {sorted.map((plant)=> {
        const remaining=daysToWater(plant,today);
        return <View key={plant.id} style={{backgroundColor:p.surface,borderRadius:20,padding:17,gap:12,borderWidth:1,borderColor:p.border}}>
          <View style={{flexDirection:'row',alignItems:'center',gap:14}}>
            <View style={{height:58,width:58,borderRadius:18,backgroundColor:p.tint,alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:28,color:p.onTint}}>✳</Text>
            </View>
            <View style={{flex:1,gap:4}}>
              <Text style={{color:p.ink,fontFamily:'serif',fontSize:23,fontWeight:'700'}}>{plant.name}</Text>
              <Text style={{color:p.muted,fontSize:13}}>{remaining<0?Math.abs(remaining)+' days overdue':remaining===0?'Due today':'In '+remaining+' days'} · {nextWater(plant)}</Text>
            </View>
          </View>
          <Text style={{color:p.muted,fontSize:13}}>Water every {plant.intervalDays} days · last recorded {niceDay(plant.lastWatered)}</Text>
          <Tap p={p} label={plant.history.includes(today)?'Watering logged today':'Log watering today'} kind={plant.history.includes(today)?'quiet':'primary'}
            disabled={plant.history.includes(today)} onPress={()=>{void waterNow(plant);}}/>
          <View style={{flexDirection:'row',gap:22}}>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>{setEditing(plant.id);setName(plant.name);setInterval(String(plant.intervalDays));setLast(plant.lastWatered);}}>
              <Text style={{color:p.accent,fontWeight:'700'}}>Edit plan</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>remove(plant)}>
              <Text style={{color:p.muted}}>Remove</Text>
            </Pressable>
          </View>
        </View>;
      })}
    </View>
    <View style={{borderTopColor:p.border,borderTopWidth:1,paddingTop:20,gap:15}}>
      <Text accessibilityRole="header" style={{fontSize:23,fontWeight:'700',fontFamily:'serif',color:p.ink}}>{editing?'Edit plant':'Welcome another plant'}</Text>
      <Field p={p} label="Plant name" value={name} onChange={setName} placeholder="Monstera, fern…" maxLength={70}/>
      <Field p={p} label="Remind me every (days)" value={interval} onChange={setInterval} keyboardType="numeric" maxLength={3}/>
      <DateField p={p} label="Last watered" day={last} onChange={setLast}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save changes':'Add plant'} disabled={store.loading} onPress={()=>{void save();}}/>
      {editing?<Tap p={p} label="Cancel edit" kind="quiet" onPress={()=>{setEditing(null);setName('');setInterval('7');setLast(today);}}/>:null}
    </View>
    <Text style={{fontSize:12,lineHeight:20,color:p.muted}}>Watering intervals are personal reminders, not botanical prescriptions. Adjust for plant species, soil, climate and season. Offline · no account.</Text>
  </Screen>;
}
