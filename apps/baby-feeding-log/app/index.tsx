import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, ErrorLine, Field, Screen, dayKey, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { latestOf, makeEntry, recentEntries, type BabyEntry, type EntryKind } from '../src/domain';

function dateLabel(iso: string) {
  return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',month:'short',day:'numeric'}).format(new Date(iso));
}
export default function BabyScreen() {
  const { theme,p }=useProductTheme('baby-feeding-log');
  const store=useLocalRecords<BabyEntry>('nest.entries');
  const [note,setNote]=useState('');
  const [error,setError]=useState<string|null>(null);
  const [now,setNow]=useState(()=>new Date());
  const today=dayKey(now);
  const recent=recentEntries(store.records,now);
  const lastFeed=latestOf(store.records,'feed');
  const lastDiaper=latestOf(store.records,'diaper');

  async function log(kind:EntryKind) {
    try {
      await store.add(makeEntry(uniqueId(),kind,new Date().toISOString(),note));
      setNow(new Date());setNote('');setError(null);
    } catch (failure) {setError(failure instanceof Error?failure.message:'Could not save.');}
  }
  function remove(entry:BabyEntry) {
    Alert.alert('Remove this log?',dateLabel(entry.at)+' will be removed from this device.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(entry.id);setNow(new Date());}}
    ]);
  }
  const button=(kind:EntryKind,title:string,symbol:string)=>(
    <Pressable key={kind} accessibilityRole="button" accessibilityLabel={'Log '+title+' now'} disabled={store.loading}
      onPress={()=>{void log(kind);}}
      style={({pressed})=>({flex:1, minHeight:178, padding:20, borderRadius:26, backgroundColor:kind==='feed'?p.tint:p.surface,
        borderColor:p.border,borderWidth:1,opacity:pressed?0.8:1,justifyContent:'space-between'})}>
      <Text style={{fontSize:34,color:kind==='feed'?p.onTint:p.ink}}>{symbol}</Text>
      <Text style={{fontSize:23,fontWeight:'800',color:kind==='feed'?p.onTint:p.ink}}>{title}</Text>
      <Text style={{fontSize:14,color:kind==='feed'?p.onTint:p.muted}}>Tap once to record</Text>
    </Pressable>
  );
  return <Screen p={p} maxWidth={650} inset={24}>
    <BrandHeading p={p} theme={theme} subtitle="One-handed journaling, even in the small hours." />
    <View style={{gap:14}}>
      <Text style={{color:p.ink,fontSize:20,fontWeight:'700'}}>Right now</Text>
      <View style={{flexDirection:'row',gap:12}}>
        {button('feed','Feeding','◒')}{button('diaper','Diaper','◌')}
      </View>
      <Field p={p} label="Optional note for your next tap" value={note} onChange={setNote} maxLength={120} placeholder="Milk amount, context…" />
      <ErrorLine p={p} error={error??store.error}/>
    </View>
    <View style={{flexDirection:'row',gap:12}}>
      {[{title:'LAST FEED',event:lastFeed},{title:'LAST DIAPER',event:lastDiaper}].map(({title,event})=>(
        <View key={title} style={{flex:1,borderRadius:18,backgroundColor:p.surface,borderColor:p.border,borderWidth:1,padding:15,gap:9}}>
          <Text style={{color:p.muted,fontSize:11,fontWeight:'800',letterSpacing:1}}>{title}</Text>
          <Text style={{color:p.ink,fontSize:19,fontWeight:'800'}}>{event?new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date(event.at)):'—'}</Text>
          <Text style={{color:p.muted,fontSize:12}}>{event?new Date(event.at).toDateString(): 'Not logged yet'}</Text>
        </View>
      ))}
    </View>
    <View style={{gap:12}}>
      <Text accessibilityRole="header" style={{color:p.ink,fontSize:22,fontWeight:'800'}}>{'Past 24 hours · '+recent.length+' entries'}</Text>
      {recent.length===0?<Text style={{color:p.muted,fontSize:16}}>No logs yet. Your first tap starts a timeline.</Text>:null}
      {recent.map((entry)=>(
        <View key={entry.id} style={{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:13,borderBottomWidth:1,borderColor:p.border}}>
          <View style={{height:48,width:48,backgroundColor:p.tint,borderRadius:24,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:p.onTint,fontSize:23}}>{entry.kind==='feed'?'◒':'◌'}</Text>
          </View>
          <View style={{flex:1,gap:4}}>
            <Text style={{color:p.ink,fontSize:17,fontWeight:'700'}}>{entry.kind==='feed'?'Feeding':'Diaper'}</Text>
            <Text style={{color:p.muted,fontSize:13}}>{dateLabel(entry.at)}{entry.note?' · '+entry.note:''}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={'Remove '+entry.kind+' entry'} style={{minHeight:48,justifyContent:'center'}} onPress={()=>remove(entry)}>
            <Text style={{color:p.accent,fontWeight:'700'}}>Undo</Text>
          </Pressable>
        </View>
      ))}
      {store.records.length>recent.length?<Text style={{color:p.muted,fontSize:13}}>Older logs are stored locally but this screen shows the latest 24 hours only.</Text>:null}
    </View>
    <Text style={{color:p.muted,fontSize:12,lineHeight:20}}>Today: {today}. No baby profile, cloud account, health scoring or medical advice. Records live only on this device; export and recovery are not included in this MVP.</Text>
  </Screen>;
}
