import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, ErrorLine, Field, Screen, Tap, dayKey, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { completeChore, daysUntilChore, makeChore, undoChore, type Chore } from '../src/domain';

export default function CleaningScreen() {
  const {theme,p}=useProductTheme('cleaning-schedule');
  const store=useLocalRecords<Chore>('tempo.chores');
  const today=dayKey(new Date());
  const chores=[...store.records].sort((a,b)=>daysUntilChore(a,today)-daysUntilChore(b,today));
  const due=chores.filter((c)=>daysUntilChore(c,today)<=0&&!c.doneOn.includes(today));
  const finished=chores.filter((c)=>c.doneOn.includes(today));
  const [title,setTitle]=useState('');
  const [interval,setInterval]=useState('7');
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);

  async function save(){
    try{
      const item=makeChore(editing??uniqueId(),title,Number(interval),today);
      if(editing)await store.update(editing,(prev)=>({...item,startOn:prev.startOn,doneOn:prev.doneOn}));
      else await store.add(item);
      setTitle('');setInterval('7');setEditing(null);setError(null);
    }catch(failure){setError(failure instanceof Error?failure.message:'Could not save chore.');}
  }
  async function toggle(item:Chore){
    try{await store.update(item.id,(prev)=>prev.doneOn.includes(today)?undoChore(prev,today):completeChore(prev,today));setError(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'Could not save completion.');}
  }
  function remove(item:Chore){
    Alert.alert('Remove this chore?',item.title+' and its history will be deleted.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(item.id).catch(() => undefined);}}
    ]);
  }
  const tasksToday=due.length+finished.length;
  const progress=tasksToday===0?100:Math.round(finished.length/tasksToday*100);
  return <Screen p={p} maxWidth={660}>
    <BrandHeading p={p} theme={theme} subtitle="A little order, with no pressure to keep a streak." />
    <View style={{backgroundColor:p.surface,borderRadius:20,padding:20,gap:19}}>
      <View style={{flexDirection:'row',alignItems:'baseline',justifyContent:'space-between'}}>
        <Text style={{fontSize:52,fontWeight:'800',color:p.ink,letterSpacing:-2}}>{finished.length} / {tasksToday}</Text>
        <Text style={{fontSize:13,color:p.muted,fontWeight:'700'}}>DONE OF TODAY'S TASKS</Text>
      </View>
      <View style={{backgroundColor:p.tint,height:15,borderRadius:9,overflow:'hidden'}}>
        <View style={{backgroundColor:p.accent,width:progress+'%',height:'100%',borderRadius:9}}/>
      </View>
      <Text style={{color:p.muted,fontSize:15,lineHeight:22}}>
        {chores.length===0?'Start with one small task.':due.length>0?due.length+' task'+(due.length===1?'':'s')+' due now.':'You are free to enjoy the moment.'}
      </Text>
    </View>
    <View style={{gap:14}}>
      <Text accessibilityRole="header" style={{fontSize:22,fontWeight:'800',color:p.ink}}>Your rhythm</Text>
      {chores.length===0?<Text style={{color:p.muted,lineHeight:24}}>Add a simple recurring chore. You can skip any day without penalty.</Text>:null}
      {chores.map((item)=>{
        const done=item.doneOn.includes(today);
        const remaining=daysUntilChore(item,today);
        return <View key={item.id} style={{backgroundColor:p.surface,borderRadius:16,borderColor:p.border,borderWidth:1,padding:16,gap:13}}>
          <View style={{flexDirection:'row',gap:12,alignItems:'center'}}>
            <Pressable accessibilityRole="checkbox" accessibilityState={{checked:done}} accessibilityLabel={item.title+', '+(done?'completed today':'not completed today')}
              onPress={()=>{void toggle(item);}} style={{height:56,width:56,backgroundColor:done?p.tint:p.canvas,borderRadius:15,
                borderColor:p.accent,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:done?p.onTint:p.accent,fontSize:28,fontWeight:'800'}}>{done?'✓':'○'}</Text>
            </Pressable>
            <View style={{flex:1,gap:6}}>
              <Text style={{color:p.ink,fontWeight:'800',fontSize:19}}>{item.title}</Text>
              <Text style={{color:p.muted,fontSize:13}}>{done?'Completed today':remaining<0?'Overdue by '+Math.abs(remaining)+' days':remaining===0?'Due today':'Next due in '+remaining+' days'} · every {item.intervalDays} days</Text>
            </View>
          </View>
          <View style={{flexDirection:'row',gap:22}}>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>{setEditing(item.id);setTitle(item.title);setInterval(String(item.intervalDays));}}>
              <Text style={{color:p.accent,fontWeight:'700'}}>Edit task</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>remove(item)}>
              <Text style={{color:p.muted}}>Remove</Text>
            </Pressable>
          </View>
        </View>;
      })}
    </View>
    <View style={{borderRadius:16,borderWidth:1,borderColor:p.border,backgroundColor:p.surface,padding:20,gap:14}}>
      <Text accessibilityRole="header" style={{color:p.ink,fontSize:21,fontWeight:'800'}}>{editing?'Edit the rhythm':'Make room for one more'}</Text>
      <Field p={p} label="Chore" value={title} onChange={setTitle} placeholder="Tidy kitchen, change sheets…" maxLength={90}/>
      <Field p={p} label="Repeat every (days)" value={interval} onChange={setInterval} keyboardType="numeric" maxLength={3}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save task':'Add a task'} disabled={store.loading} onPress={()=>{void save();}}/>
      {editing?<Tap p={p} label="Cancel edit" kind="quiet" onPress={()=>{setEditing(null);setTitle('');setInterval('7');}}/>:null}
    </View>
    <Text style={{color:p.muted,fontSize:12,lineHeight:19}}>No streak penalties, accounts, or remote tracking. Tasks repeat after their last actual completion; overdue days do not count as failures.</Text>
  </Screen>;
}
