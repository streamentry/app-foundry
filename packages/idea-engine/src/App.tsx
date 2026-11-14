import { useEffect, useState } from 'react';
import {
  Alert, Pressable, Text, TextInput, View, useColorScheme,
} from 'react-native';
import {
  DateField, ErrorLine, Field, Screen, Tap, TimeField,
  dayKey, uniqueId, useLocalRecords,
} from '@foundry/mobile-kit';
import {
  calculate, cleanValues, daysBetween, ensureUnique, findSpec, increment,
  leadingDate, makeEntry, recordLabel, sortedEntries, summarize,
  toBackup, toCSV, toggleDone, todayKey, validateBackup,
  type Entry, type IdeaSpec, type FieldSpec,
} from './domain.ts';
import { shareText } from './export';
import { visualIdentity, type Palette, type VisualIdentity } from './theme';

function makeDefaults(spec:IdeaSpec):Record<string,string>{
  const today=todayKey();
  const result:Record<string,string>={};
  for(const field of spec.fields){
    result[field.key]=field.type==='date'?today:
      field.type==='time'?'09:00':
      field.type==='choice'?field.options?.[0]??'':
      spec.rule==='cash'&&field.type==='number'?'0':'';
  }
  return result;
}

function readableError(error:unknown):string{
  return error instanceof Error?error.message:'Could not complete this action.';
}

function headingFont(visual:VisualIdentity):string|undefined{
  return visual.serif?'Georgia':undefined;
}
function radius(visual:VisualIdentity):number{return visual.shape==='sharp'?6:visual.shape==='round'?26:15;}

const labelStyle={fontSize:11,fontWeight:'800' as const,letterSpacing:1.35};
const bodyText={fontSize:16,lineHeight:24};

function PreviewBadge({p}: {p:Palette}){
  return <View style={{borderWidth:1,borderColor:p.border,borderRadius:100,paddingHorizontal:12,paddingVertical:8,alignSelf:'flex-start'}}>
    <Text style={{color:p.muted,fontWeight:'800',fontSize:11,letterSpacing:0.7}}>OFFLINE RESEARCH MVP</Text>
  </View>;
}

function Hero({
  spec,p,visual,entries,
}: {spec:IdeaSpec;p:Palette;visual:VisualIdentity;entries:readonly Entry[]}) {
  const now=todayKey();
  const summary=summarize(spec,entries,now);
  const baseRadius=radius(visual);
  const isLedger=spec.layout==='ledger';
  const isTimeline=spec.layout==='timeline';
  const isTiles=spec.layout==='tiles';
  const isPaper=spec.layout==='paper';
  const background=isLedger?p.ink:p.tint;
  const ink=isLedger?p.canvas:p.onTint;
  const muted=isLedger?p.canvas:p.onTint;
  const mainSize=summary.main.length>12?37:summary.main.length>7?45:61;
  return <View style={{
    padding:isTiles?28:24, gap:14, minHeight:isTiles?245:202,
    borderRadius:baseRadius,backgroundColor:background,
    borderWidth:isPaper?1.5:0,borderColor:p.accent,borderStyle:isPaper?'dashed':'solid',
    justifyContent:'flex-end',overflow:'hidden',
  }}>
    {isTimeline?<View style={{position:'absolute',right:31,top:23,bottom:23,width:2,backgroundColor:p.accent,opacity:0.5}}/>:null}
    {isTiles?<View style={{position:'absolute',right:-40,top:-40,width:165,height:165,borderRadius:85,borderWidth:2,borderColor:p.accent,opacity:0.35}}/>:null}
    {spec.layout==='hero'?<View style={{position:'absolute',right:10,top:12,width:100,height:100,borderRadius:30,backgroundColor:p.accent,opacity:0.1,transform:[{rotate:'24deg'}]}}/>:null}
    <Text style={{...labelStyle,color:muted,opacity:isLedger?0.84:1}}>{visual.motif} / {spec.id}</Text>
    <Text adjustsFontSizeToFit minimumFontScale={0.55} numberOfLines={2}
      style={{fontSize:mainSize,lineHeight:mainSize*1.09,fontFamily:headingFont(visual),
        fontWeight:'800',color:ink,letterSpacing:-1.2,fontVariant:['tabular-nums']}}>
      {summary.main}
    </Text>
    <Text style={{fontSize:16,fontWeight:'700',color:ink}}>{summary.label}</Text>
    <View style={{height:1,backgroundColor:isLedger?p.canvas:p.accent,opacity:0.28}}/>
    <Text style={{...bodyText,color:muted,opacity:isLedger?0.9:1}}>{summary.secondary}</Text>
  </View>;
}

function SpecField({
  field, value, onChange,p,
}: {field:FieldSpec;value:string;onChange:(value:string)=>void;p:Palette}){
  if(field.type==='date'){
    return <DateField p={p} label={field.label} day={value||todayKey()} onChange={onChange}/>;
  }
  if(field.type==='time'){
    return <TimeField p={p} label={field.label} time={value||'09:00'} onChange={onChange}/>;
  }
  if(field.type==='choice'){
    return <View style={{gap:8}}>
      <Text style={{fontWeight:'700',fontSize:16,color:p.ink}}>{field.label}</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:9}}>
        {field.options?.map(option=><Pressable key={option}
          accessibilityRole="radio" accessibilityState={{selected:value===option}}
          onPress={()=>onChange(option)}
          style={{minHeight:48,minWidth:60,justifyContent:'center',alignItems:'center',paddingHorizontal:14,
            borderRadius:11,borderWidth:1,borderColor:value===option?p.accent:p.border,
            backgroundColor:value===option?p.accent:p.surface}}>
          <Text style={{fontSize:14,fontWeight:'700',color:value===option?p.onAccent:p.ink}}>{option}</Text>
        </Pressable>)}
      </View>
    </View>;
  }
  return <Field p={p} label={field.label+(field.required?'':' (optional)')} value={value}
    onChange={onChange} keyboardType={field.type==='number'?'decimal-pad':'default'}
    maxLength={field.type==='notes'?500:field.type==='text'?160:50}
    multiline={field.type==='notes'}
    placeholder={field.type==='number'?'0':field.type==='notes'?'Relevant details…':field.label}/>;
}

function RowActions({
  spec,entry,p,busy,onEdit,onDelete,onUpdate,onError,expanded,setExpanded,
}: {
  spec:IdeaSpec;entry:Entry;p:Palette;busy:boolean;
  onEdit:(entry:Entry)=>void;onDelete:(entry:Entry)=>void;
  onUpdate:(entry:Entry)=>Promise<void>;onError:(message:string)=>void;
  expanded:boolean;setExpanded:()=>void;
}){
  const flow=spec.flow;
  const toggleable=flow==='checklist'||flow==='handoff'||flow==='flashcard';
  const hasCount=flow==='counter';
  const inventory=flow==='inventory'&&Object.hasOwn(entry.values,'quantity');
  async function updateCounter(delta:number){
    try{
      if(hasCount)await onUpdate(increment(entry,delta));
      else{
        const n=Number(entry.values.quantity??'0')+delta;
        if(!Number.isFinite(n)||n<0)throw new RangeError('Quantity cannot be negative');
        await onUpdate({...entry,values:{...entry.values,quantity:String(n)}});
      }
    }catch(error){onError(readableError(error));}
  }
  async function toggle(){
    try{await onUpdate(toggleDone(entry));}
    catch(error){onError(readableError(error));}
  }
  const actionText={color:p.accent,fontSize:14,fontWeight:'800' as const};
  return <View style={{gap:12}}>
    {toggleable?<Tap p={p} kind={entry.done?'quiet':'primary'}
      disabled={busy} label={entry.done?'Undo completion':flow==='flashcard'?'Mark practiced':'Mark complete'}
      onPress={()=>{void toggle();}}/>:null}
    {flow==='flashcard'?<Tap p={p} kind="quiet" label={expanded?'Hide answer':'Reveal answer'}
      onPress={setExpanded}/>:null}
    {hasCount||inventory?<View style={{flexDirection:'row',alignItems:'center',gap:12}}>
      <Pressable accessibilityRole="button" accessibilityLabel="Decrease by one" disabled={busy}
        onPress={()=>{void updateCounter(-1);}}
        style={{width:54,height:54,borderRadius:16,borderColor:p.border,borderWidth:1,
          justifyContent:'center',alignItems:'center',backgroundColor:p.surface}}>
        <Text style={{fontSize:27,color:p.ink}}>−</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite" style={{flex:1,textAlign:'center',color:p.ink,fontSize:28,
        fontWeight:'800',fontVariant:['tabular-nums']}}>
        {hasCount?entry.count:entry.values.quantity}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Increase by one" disabled={busy}
        onPress={()=>{void updateCounter(1);}}
        style={{width:54,height:54,borderRadius:16,backgroundColor:p.accent,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:28,color:p.onAccent}}>+</Text>
      </Pressable>
    </View>:null}
    <View style={{flexDirection:'row',justifyContent:'flex-start',gap:28,flexWrap:'wrap'}}>
      <Pressable accessibilityRole="button" accessibilityLabel={'Edit '+recordLabel(spec,entry)}
        disabled={busy} style={{minHeight:48,justifyContent:'center'}} onPress={()=>onEdit(entry)}>
        <Text style={actionText}>Edit record</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={'Remove '+recordLabel(spec,entry)}
        disabled={busy} style={{minHeight:48,justifyContent:'center'}} onPress={()=>onDelete(entry)}>
        <Text style={{color:p.muted,fontSize:14,fontWeight:'700'}}>Remove</Text>
      </Pressable>
    </View>
  </View>;
}

function ReadOnlyRecord({
  entry,spec,p,visual,expanded,
}: {entry:Entry;spec:IdeaSpec;p:Palette;visual:VisualIdentity;expanded:boolean}){
  let metric=null;
  try{metric=calculate(spec,entry);}catch{/* Saved values may be from an older version. */}
  const isFlash=spec.flow==='flashcard';
  const date=leadingDate(spec,entry);
  const title=recordLabel(spec,entry);
  return <View style={{gap:11}}>
    <View style={{flexDirection:'row',gap:16,alignItems:'flex-start'}}>
      {spec.layout==='shelf'?<View style={{width:46,height:46,backgroundColor:p.tint,borderRadius:10,
        alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:21,fontWeight:'700',color:p.onTint}}>{title.slice(0,1).toUpperCase()}</Text>
      </View>:null}
      <View style={{flex:1,gap:5}}>
        <Text style={{fontSize:spec.layout==='paper'?22:19,lineHeight:27,fontWeight:'800',color:p.ink,
          fontFamily:headingFont(visual)}}>{title}</Text>
        {date?<Text style={{color:p.muted,fontSize:13}}>{date}{spec.flow==='timeline'?' · '+(daysBetween(todayKey(),date)>=0?
          'in '+daysBetween(todayKey(),date)+' days':'past by '+Math.abs(daysBetween(todayKey(),date))+' days'):''}</Text>:null}
      </View>
      {metric?<View style={{maxWidth:'45%',alignItems:'flex-end',gap:4}}>
        <Text style={{color:p.accent,fontSize:23,fontWeight:'800',fontVariant:['tabular-nums']}} numberOfLines={2} adjustsFontSizeToFit>{metric.display}</Text>
        <Text style={{color:p.muted,fontSize:11,textAlign:'right'}}>{metric.label}</Text>
      </View>:null}
    </View>
    {isFlash&&!expanded?<Text style={{color:p.muted,fontSize:15,fontStyle:'italic'}}>Recall first. Reveal when ready.</Text>:
      spec.fields.slice(1).filter(f=>Boolean(entry.values[f.key])).map(f=>
        <View key={f.key} style={{gap:2}}>
          <Text style={{fontSize:11,color:p.muted,fontWeight:'800',letterSpacing:0.4}}>{f.label.toUpperCase()}</Text>
          <Text style={{fontSize:15,lineHeight:22,color:p.ink}}>{entry.values[f.key]}</Text>
        </View>)}
    {entry.done?<Text style={{color:p.onTint,backgroundColor:p.tint,alignSelf:'flex-start',
      paddingHorizontal:10,paddingVertical:6,borderRadius:8,fontSize:12,fontWeight:'700'}}>Completed · tap Undo to change</Text>:null}
  </View>;
}

function FocusTimer({p,onStopped}: {p:Palette;onStopped:(minutes:string)=>void}){
  const [started,setStarted]=useState<number|null>(null);
  const [clock,setClock]=useState(Date.now());
  useEffect(()=>{
    if(started===null)return;
    const tick=setInterval(()=>setClock(Date.now()),1000);
    return()=>clearInterval(tick);
  },[started]);
  const elapsed=started===null?0:Math.max(0,Math.floor((clock-started)/1000));
  const min=String(Math.floor(elapsed/60)).padStart(2,'0');
  const sec=String(elapsed%60).padStart(2,'0');
  return <View style={{padding:17,borderRadius:16,borderWidth:1,borderColor:p.border,backgroundColor:p.tint,gap:12}}>
    <Text style={{color:p.onTint,...labelStyle}}>FOCUS TIMER · OPTIONAL</Text>
    <Text style={{color:p.onTint,fontSize:43,fontWeight:'800',fontVariant:['tabular-nums']}}>{min}:{sec}</Text>
    <Text style={{color:p.onTint,...bodyText}}>Starts a draft timer. Stopping fills the minutes field; you still choose when to save.</Text>
    {started===null?<Tap p={p} kind="quiet" label="Start timing" onPress={()=>{setClock(Date.now());setStarted(Date.now());}}/>:
      <Tap p={p} label="Stop and fill minutes" onPress={()=>{
        const minutes=Math.max(0.01,Math.round((Date.now()-started)/600)/100);
        onStopped(String(minutes));setStarted(null);
      }}/>}
    <Text style={{color:p.onTint,fontSize:12}}>Timer state is not preserved across app restarts or OS interruptions.</Text>
  </View>;
}

const privacyMessage=(spec:IdeaSpec):string=>{
  const category=spec.category;
  if(/medic|health|vaccin|emergency|smoke|pretrip/.test(spec.slug))return 'Recordkeeping only. Not medical, regulatory, inspection, or emergency certification. Verify important details with a qualified professional.';
  if(category==='Family & caregiving'||category==='Pets & animals')return 'Personal records stay on this device. This preview is not a medical, veterinary, child-safety, or caregiver monitoring service.';
  if(category==='Personal admin & money'||category==='Small-business admin')return 'Financial figures are user-entered estimates, not payroll, accounting, tax or legal advice. Verify independently.';
  return 'Your entries are stored locally in this app. No automatic cloud backup, user account, location tracking or analytics.';
};

export function IdeaApp({slug}: {slug:string}){
  const spec=findSpec(slug);
  if(!spec)return <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:24}}>
    <Text accessibilityRole="alert">Unknown prototype: {slug}</Text>
  </View>;
  return <LoadedIdeaApp key={spec.slug} spec={spec}/>;
}

function LoadedIdeaApp({spec}: {spec:IdeaSpec}){
  const visual=visualIdentity(spec);
  const dark=useColorScheme()==='dark';
  const p=dark?visual.dark:visual.light;
  const store=useLocalRecords<Entry>('idea.'+spec.slug);
  const [values,setValues]=useState<Record<string,string>>(()=>makeDefaults(spec));
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [search,setSearch]=useState('');
  const [revealed,setRevealed]=useState<string|null>(null);
  const [showBackup,setShowBackup]=useState(false);
  const [backupText,setBackupText]=useState('');
  const [showForm,setShowForm]=useState(false);
  const all=sortedEntries(spec,store.records);
  const filtered=all.filter(entry=>
    !search.trim()||Object.values(entry.values).some(value=>value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
  );
  const summary=summarize(spec,store.records,todayKey());
  const formRadius=radius(visual);
  const updating=(newValues:Record<string,string>)=>setValues(newValues);

  async function save():Promise<void>{
    if(busy||store.loading)return;
    setBusy(true);setError(null);
    try{
      const id=editing??uniqueId().replace(/[^a-zA-Z0-9_-]/g,'');
      const prior=editing?store.records.find(r=>r.id===editing):undefined;
      const made=makeEntry(spec,id,values,prior?.createdAt);
      ensureUnique(spec,made,store.records);
      if(editing){
        if(!prior)throw new Error('Record no longer exists');
        await store.update(id,()=>({...made,done:prior.done,count:prior.count}));
      }else await store.add(made);
      setEditing(null);setValues(makeDefaults(spec));setShowForm(false);
    }catch(failure){setError(readableError(failure));}
    finally{setBusy(false);}
  }
  function edit(entry:Entry){
    setValues({...makeDefaults(spec),...entry.values});setEditing(entry.id);setError(null);setShowForm(true);
  }
  function remove(entry:Entry){
    Alert.alert('Remove record?',recordLabel(spec,entry)+' will be deleted from this device.',[
      {text:'Cancel',style:'cancel'},
      {text:'Remove',style:'destructive',onPress:()=>{
        void store.remove(entry.id).catch(failure=>setError(readableError(failure)));
      }},
    ]);
  }
  async function update(entry:Entry):Promise<void>{
    await store.update(entry.id,()=>entry);
  }
  async function share(ext:'csv'|'json'){
    setBusy(true);setError(null);
    try{
      await shareText(spec.slug,ext,ext==='csv'?toCSV(spec,store.records):toBackup(spec,store.records));
    }catch(failure){setError(readableError(failure));}finally{setBusy(false);}
  }
  function restore(){
    let records:Entry[];
    try{records=validateBackup(spec,JSON.parse(backupText));}
    catch(failure){setError('Backup not restored: '+readableError(failure));return;}
    Alert.alert('Replace all local records?','This replaces '+store.records.length+' records with '+records.length+
      ' records from a '+spec.name+' backup. Export your current JSON backup first.',[
        {text:'Cancel',style:'cancel'},
        {text:'Replace all',style:'destructive',onPress:()=>{
          void store.change(()=>records).then(()=>{setBackupText('');setShowBackup(false);setError(null);})
            .catch(failure=>setError(readableError(failure)));
        }},
      ]);
  }
  function clear(){
    if(store.records.length===0)return;
    Alert.alert('Delete all saved records?','This cannot be undone. Export a backup first.',[
      {text:'Keep data',style:'cancel'},
      {text:'Delete everything',style:'destructive',onPress:()=>{
        void store.change(()=>[]).catch(failure=>setError(readableError(failure)));
      }},
    ]);
  }

  const numberKeys=spec.fields.filter(f=>f.type==='number');
  let preview=null;
  try{
    if(spec.flow==='calculator'||spec.flow==='progress'){
      preview=calculate(spec,{id:'draft',createdAt:new Date(0).toISOString(),values:cleanValues(spec,values),count:0,done:false});
    }
  }catch{/* A partially filled form is not a valid calculation. */}

  return <Screen p={p} inset={visual.density==='dense'?20:24} maxWidth={710}>
    <View style={{gap:12,paddingTop:12}}>
      <Text style={{fontSize:11,fontWeight:'800',letterSpacing:1.25,color:p.accent}}>{spec.category.toUpperCase()} · CONCEPT {spec.id}</Text>
      <Text accessibilityRole="header" style={{fontFamily:headingFont(visual),fontWeight:'800',
        fontSize:visual.density==='dense'?34:39,lineHeight:visual.density==='dense'?40:46,
        letterSpacing:-0.9,color:p.ink}}>
        {spec.name}
      </Text>
      <Text style={{...bodyText,color:p.muted}}>{spec.job}.</Text>
      <PreviewBadge p={p}/>
    </View>

    <Hero spec={spec} p={p} visual={visual} entries={store.records}/>

    {spec.flow==='session'?<FocusTimer p={p} onStopped={minutes=>{setValues(old=>({...old,minutes}));setShowForm(true);}}/>:null}

    {error||store.error?<ErrorLine error={error??store.error} p={p}/>:null}
    {store.loading?<Text accessibilityRole="alert" style={{color:p.muted,...bodyText}}>Loading on-device records…</Text>:null}

    <View style={{gap:14}}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
        <Text accessibilityRole="header" style={{color:p.ink,fontSize:21,fontWeight:'800'}}>Your workspace</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={showForm?'Hide entry form':'Open entry form'}
          style={{backgroundColor:p.accent,paddingHorizontal:16,borderRadius:12,minHeight:48,justifyContent:'center'}}
          onPress={()=>setShowForm(v=>!v)}>
          <Text style={{color:p.onAccent,fontWeight:'800'}}>+ {spec.cta}</Text>
        </Pressable>
      </View>
      {showForm?<View style={{backgroundColor:p.surface,borderWidth:1,borderColor:p.border,borderRadius:formRadius,
        padding:20,gap:15}}>
        <Text accessibilityRole="header" style={{color:p.ink,fontSize:19,fontWeight:'800'}}>
          {editing?'Edit this record':spec.cta}
        </Text>
        {spec.fields.map(field=><SpecField key={field.key} field={field} p={p}
          value={values[field.key]??''} onChange={value=>updating({...values,[field.key]:value})}/>)}
        {preview?<View style={{backgroundColor:p.tint,borderRadius:12,padding:15,gap:7}}>
          <Text style={{fontWeight:'800',fontSize:12,color:p.onTint}}>{preview.label.toUpperCase()}</Text>
          <Text style={{fontSize:32,fontWeight:'800',fontVariant:['tabular-nums'],color:p.onTint}}>{preview.display}</Text>
          <Text style={{fontSize:12,color:p.onTint}}>Preview only. Save to keep this result.</Text>
        </View>:null}
        <Tap p={p} label={busy?'Saving…':editing?'Save changes':spec.cta}
          disabled={busy||store.loading} onPress={()=>{void save();}}/>
        {editing?<Tap p={p} kind="quiet" label="Cancel editing" onPress={()=>{
          setEditing(null);setValues(makeDefaults(spec));setShowForm(false);setError(null);
        }}/>:null}
      </View>:null}
      {numberKeys.length>0&&spec.flow==='calculator'?<Text style={{fontSize:13,color:p.muted,lineHeight:20}}>
        {spec.rule==='rounding'?'Rounding is illustrative only: labor laws and payroll policies vary.':
          spec.rule==='cutlist'?'Board kerf, grain and safety margins are not calculated.':
          spec.rule==='cash'?'Denominations are numeric units, not a linked cash register.':
          'Calculated from your entries only. Verify real-world assumptions independently.'}
      </Text>:null}
    </View>

    <View style={{gap:13}}>
      <Text accessibilityRole="header" style={{fontSize:21,fontWeight:'800',color:p.ink}}>
        {spec.flow==='timeline'?'Dates and deadlines':spec.flow==='counter'?'Active counters':
          spec.flow==='flashcard'?'Practice cards':'Your records'} · {filtered.length}
      </Text>
      {store.records.length>0?<Field p={p} label="Search saved records" value={search} onChange={setSearch}
        placeholder="Search names, notes or reference numbers" maxLength={120}/>:null}
      {store.records.length===0&&!store.loading?<View style={{borderRadius:formRadius,backgroundColor:p.surface,
        borderWidth:1,borderColor:p.border,padding:23,gap:10}}>
        <Text style={{fontSize:19,fontWeight:'800',color:p.ink}}>Start with one useful entry.</Text>
        <Text style={{...bodyText,color:p.muted}}>No sample data is silently inserted. Add a real entry to test this workflow.</Text>
      </View>:null}
      {store.records.length>0&&filtered.length===0?<Text style={{...bodyText,color:p.muted}}>No records match your search.</Text>:null}
      {filtered.map((entry,index)=><View key={entry.id} style={{
        borderRadius:spec.layout==='ledger'?6:formRadius,
        borderColor:p.border,borderWidth:1,backgroundColor:p.surface,
        padding:spec.layout==='ledger'?16:20,gap:16,overflow:'hidden',
      }}>
        {spec.layout==='ledger'?<View style={{flexDirection:'row',justifyContent:'space-between',gap:12}}>
          <Text style={{color:p.accent,...labelStyle}}>ENTRY {String(filtered.length-index).padStart(3,'0')}</Text>
          <Text style={{color:p.muted,fontSize:12}}>{entry.createdAt.slice(0,10)}</Text>
        </View>:null}
        <ReadOnlyRecord entry={entry} spec={spec} p={p} visual={visual} expanded={revealed===entry.id}/>
        <RowActions spec={spec} entry={entry} p={p} busy={busy||store.loading}
          onEdit={edit} onDelete={remove} onUpdate={update} onError={setError}
          expanded={revealed===entry.id} setExpanded={()=>setRevealed(old=>old===entry.id?null:entry.id)}/>
      </View>)}
    </View>

    <View style={{borderTopWidth:1,borderColor:p.border,paddingTop:20,gap:13}}>
      <Text accessibilityRole="header" style={{fontSize:19,fontWeight:'800',color:p.ink}}>Your data stays yours</Text>
      <Text style={{fontSize:14,lineHeight:23,color:p.muted}}>
        Local storage only · no account · no server · no tracking. Share CSV for analysis or a JSON backup for complete restore.
      </Text>
      <Tap p={p} kind="quiet" label="Export records (.csv)" disabled={busy||store.loading}
        onPress={()=>{void share('csv');}}/>
      <Tap p={p} kind="quiet" label="Share restorable backup (.json)" disabled={busy||store.loading}
        onPress={()=>{void share('json');}}/>
      <Tap p={p} kind="quiet" label={showBackup?'Hide restore':'Restore from pasted JSON backup'} onPress={()=>setShowBackup(v=>!v)}/>
      {showBackup?<View style={{backgroundColor:p.surface,borderColor:p.border,borderWidth:1,borderRadius:14,padding:16,gap:12}}>
        <Text style={{color:p.ink,fontSize:15,fontWeight:'700'}}>Paste a backup from this same app below</Text>
        <TextInput multiline value={backupText} onChangeText={setBackupText} accessibilityLabel="Backup JSON text"
          placeholder="Paste the entire .json backup here" placeholderTextColor={p.muted}
          maxLength={1500000} textAlignVertical="top"
          style={{backgroundColor:p.canvas,color:p.ink,borderWidth:1,borderColor:p.border,borderRadius:11,
            fontSize:14,padding:13,minHeight:120}}/>
        <Tap p={p} label="Validate and restore backup" disabled={busy||store.loading||!backupText.trim()}
          onPress={restore}/>
        <Text style={{color:p.muted,fontSize:12,lineHeight:19}}>Restore replaces existing entries after confirmation. Export current data first.</Text>
      </View>:null}
      <Tap p={p} kind="danger" label="Delete all local records" disabled={busy||store.loading||store.records.length===0}
        onPress={clear}/>
    </View>
    <View style={{gap:8}}>
      <Text style={{fontSize:13,lineHeight:20,color:p.muted}}>{privacyMessage(spec)}</Text>
      <Text style={{fontSize:12,lineHeight:19,color:p.muted}}>
        Research prototype · no production branding, notifications, native screenshots, App Store approval or payment setup. Validate actual user value before publishing.
      </Text>
    </View>
  </Screen>;
}
