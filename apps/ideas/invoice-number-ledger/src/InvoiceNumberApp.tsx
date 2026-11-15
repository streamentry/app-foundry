import { useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateField, uniqueId, useLocalRecords } from '@foundry/mobile-kit';
import {
  STORE_KEY, emptySeries, createSeries, formatReference, todayKey,
  validateLedger, seriesOf, referencesOf, summaryOf, reserveNext,
  recordExisting, resolveReserved, archiveSeries, exportCsv, exportBackup, importBackup,
  type InvoiceSeries, type LedgerRecord, type Reference, type ReferenceStatus,
  type SeriesInput,
} from './domain.ts';
import { shareDocument } from './share.ts';
import {
  LIGHT,DARK,Button,Panel,Field,Rule,Eyebrow,Pair,Status,ReferenceRow,ErrorBanner,
  mono,type Palette,
} from './ui.tsx';

type Page='home'|'new-series'|'series'|'reference'|'existing'|'data';
type Filter='all'|ReferenceStatus;
type FinalAction='issue'|'void';
const message=(e:unknown)=>e instanceof Error?e.message:'Could not complete this action';
const dateText=(value:string)=>{
  const [year,month,day]=value.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined,{day:'numeric',month:'short',year:'numeric'})
    .format(new Date(year!,month!-1,day!,12));
};
const picker=(p:Palette)=>({
  canvas:p.bg,surface:p.card,ink:p.ink,muted:p.sub,accent:p.accent,
  onAccent:p.onAccent,tint:p.soft,onTint:p.onSoft,border:p.rule,
});
function Heading({p,eyebrow,title,body}:{
  p:Palette;eyebrow:string;title:string;body:string;
}){
  return <View style={{gap:10,paddingVertical:12}}>
    <Eyebrow p={p}>{eyebrow}</Eyebrow>
    <Text accessibilityRole="header" style={{
      color:p.ink,fontWeight:'900',fontSize:34,lineHeight:40,letterSpacing:-1,
    }}>{title}</Text>
    <Text style={{color:p.sub,fontSize:16,lineHeight:24}}>{body}</Text>
  </View>;
}
function Chip({p,label,active,onPress}:{p:Palette;label:string;active:boolean;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{selected:active}} onPress={onPress}
    style={({pressed})=>({
      minHeight:46,borderRadius:9,borderWidth:1,borderColor:active?p.accent:p.rule,
      paddingHorizontal:14,justifyContent:'center',alignItems:'center',
      backgroundColor:active?p.soft:p.card,opacity:pressed?.78:1,
    })}>
    <Text style={{fontSize:13,fontWeight:'800',color:active?p.onSoft:p.ink}}>{label}</Text>
  </Pressable>;
}
function BrandHeader({p}:{p:Palette}){
  return <View style={{
    flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:21,paddingTop:12,
    paddingBottom:14,borderBottomColor:p.rule,borderBottomWidth:1,
  }}>
    <View style={{width:48,height:48,borderRadius:4,backgroundColor:p.accent,
      justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:p.onAccent,fontFamily:mono,fontSize:20,fontWeight:'900'}}>№</Text>
    </View>
    <View style={{gap:2,flex:1}}>
      <Text style={{color:p.ink,fontSize:24,fontWeight:'900',letterSpacing:-0.8}}>FOLIO</Text>
      <Text style={{color:p.sub,fontSize:11,fontWeight:'900',letterSpacing:1.25}}>
        INVOICE REFERENCE LEDGER
      </Text>
    </View>
  </View>;
}
function ReferenceStamp({p,series,number,subtitle}:{
  p:Palette;series:InvoiceSeries;number:number|null;subtitle:string;
}){
  const text=number===null?'SERIES FULL':formatReference(series,number);
  return <View style={{backgroundColor:p.accent,borderRadius:4,padding:22,gap:11}}>
    <Text style={{color:p.onAccent,fontSize:11,fontWeight:'900',letterSpacing:1.4}}>
      {subtitle.toUpperCase()}
    </Text>
    <Text accessibilityLiveRegion="polite" numberOfLines={1} adjustsFontSizeToFit
      style={{color:p.onAccent,fontFamily:mono,fontSize:35,fontWeight:'900',letterSpacing:-1}}>
      {text}
    </Text>
    <Text style={{color:p.onAccent,fontSize:13,lineHeight:21}}>
      Reference only. No invoice PDF is created, sent or legally issued by this app.
    </Text>
  </View>;
}
function EventTimeline({p,selected}:{p:Palette;selected:Reference}){
  return <Panel p={p} receipt>
    <Eyebrow p={p}>Local event history · {selected.events.length} action(s)</Eyebrow>
    {selected.events.map((event,index)=><View key={event.id} style={{gap:7,paddingVertical:6}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',gap:8}}>
        <Text style={{color:p.ink,fontSize:15,fontWeight:'900'}}>
          {index+1}. {event.action==='reserve'?'Number reserved':
            event.action==='issue'?'Marked issued':
            event.action==='void'?'Marked void':
            event.action==='import_issue'?'Existing issued number recorded':
              'Existing void number recorded'}
        </Text>
        <Text style={{color:p.sub,fontSize:12}}>{event.day}</Text>
      </View>
      {event.client?<Text style={{color:p.sub,fontSize:14}}>Client: {event.client}</Text>:null}
      {event.note?<Text style={{color:p.sub,fontSize:14,lineHeight:21}}>{event.note}</Text>:null}
      {index!==selected.events.length-1?<Rule p={p}/>:null}
    </View>)}
    <Rule p={p}/>
    <Text style={{color:p.sub,fontSize:12,lineHeight:20}}>
      This is an editable device's local history, not a tamper-proof, synchronized or legally certified audit trail.
    </Text>
  </Panel>;
}
export default function InvoiceNumberApp(){
  const p=useColorScheme()==='dark'?DARK:LIGHT;
  const store=useLocalRecords<LedgerRecord>(STORE_KEY);
  const [page,setPage]=useState<Page>('home');
  const [seriesId,setSeriesId]=useState<string|null>(null);
  const [ordinal,setOrdinal]=useState<number|null>(null);
  const [draft,setDraft]=useState<SeriesInput>(emptySeries);
  const [filter,setFilter]=useState<Filter>('all');
  const [search,setSearch]=useState('');
  const [existingNumber,setExistingNumber]=useState('');
  const [existingStatus,setExistingStatus]=useState<'issued'|'void'>('issued');
  const [entryClient,setEntryClient]=useState('');
  const [entryNote,setEntryNote]=useState('');
  const [entryDay,setEntryDay]=useState(todayKey);
  const [resolveAction,setResolveAction]=useState<FinalAction|null>(null);
  const [backupText,setBackupText]=useState('');
  const [restoreVisible,setRestoreVisible]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const writing=useRef(false);

  const clean=useMemo(()=>{
    try{return validateLedger(store.records);}
    catch{return null;}
  },[store.records]);
  const valid=clean!==null&&!store.loading&&!store.error;
  const series=seriesOf(clean??[]);
  const chosen=series.find(s=>s.id===seriesId)??null;
  const refs=chosen?referencesOf(clean??[],chosen):[];
  const stats=chosen?summaryOf(chosen,refs):null;
  const ref=ordinal!==null?refs.find(r=>r.ordinal===ordinal)??null:null;
  const visible=refs.filter(r=>{
    const matchesFilter=filter==='all'||r.status===filter;
    const needle=search.trim().toLocaleLowerCase();
    return matchesFilter&&(!needle||r.formatted.toLocaleLowerCase().includes(needle)||
      r.client.toLocaleLowerCase().includes(needle));
  }).slice(0,150);
  const show=(next:Page)=>{setPage(next);setError(null);};
  const viewSeries=(s:InvoiceSeries)=>{
    setSeriesId(s.id);setOrdinal(null);setFilter('all');setSearch('');show('series');
  };
  const viewRef=(value:number)=>{
    setOrdinal(value);setResolveAction(null);setEntryClient('');setEntryNote('');
    setEntryDay(todayKey());show('reference');
  };
  function beginExisting(){
    setExistingNumber('');setExistingStatus('issued');
    setEntryClient('');setEntryNote('');setEntryDay(todayKey());show('existing');
  }
  async function persist(change:(rows:readonly LedgerRecord[])=>LedgerRecord[],
    after:()=>void){
    if(!valid||writing.current)return;
    writing.current=true;setBusy(true);setError(null);
    try{
      await store.change(previous=>change(validateLedger(previous)));
      after();
    }catch(e){setError(message(e));}
    finally{writing.current=false;setBusy(false);}
  }
  async function addSeries(){
    const id=uniqueId(),madeAt=new Date().toISOString();
    await persist(rows=>{
      const next=createSeries(draft,id,madeAt);
      return validateLedger([...rows,next]);
    },()=>{
      setSeriesId(id);setOrdinal(null);setDraft(emptySeries());show('series');
    });
  }
  async function reserve(){
    if(!chosen||!stats||stats.next===null)return;
    const eventId=uniqueId(),day=todayKey(),now=new Date().toISOString();
    const predicted=stats.next;
    await persist(rows=>{
      const next=reserveNext(rows,chosen.id,eventId,day,now);
      if(next.ordinal!==predicted)throw new Error('Number sequence changed. Reopen the series.');
      return next.rows;
    },()=>viewRef(predicted));
  }
  async function record(){
    if(!chosen)return;
    if(!/^\d{1,7}$/.test(existingNumber)){
      setError('Enter an existing whole reference number (digits only).');return;
    }
    const n=Number(existingNumber),eventId=uniqueId();
    const day=entryDay,client=entryClient,note=entryNote,status=existingStatus;
    const at=new Date().toISOString();
    await persist(rows=>recordExisting(rows,chosen.id,n,status,client,note,eventId,day,at),
      ()=>viewRef(n));
  }
  function applyResolution(){
    if(!chosen||!ref||!resolveAction)return;
    const action=resolveAction,day=entryDay,client=entryClient,note=entryNote;
    if(action==='void'&&!note.trim()){
      setError('Enter why this reserved reference was voided.');return;
    }
    const title=action==='issue'?'Mark this reference issued?':'Void this reserved number?';
    const detail=action==='issue'
      ?'Only mark issued after an invoice was actually issued in your external tool. This action cannot be undone here.'
      :'A voided reference will never be reused. Keep the reason in the local event log.';
    Alert.alert(title,detail,[
      {text:'Cancel',style:'cancel'},
      {text:action==='void'?'Void number':'Mark issued',
        style:action==='void'?'destructive':'default',
        onPress:()=>{
          const id=uniqueId(),at=new Date().toISOString();
          void persist(rows=>resolveReserved(rows,chosen.id,ref.ordinal,action,client,note,id,day,at),
            ()=>{setResolveAction(null);setEntryNote('');});
        }},
    ]);
  }
  function changeArchived(){
    if(!chosen)return;
    const next=!chosen.archived;
    Alert.alert(next?'Archive this numbering series?':'Reopen this numbering series?',
      'History stays visible. '+(next?'No more reservations or status changes can be made while archived.':
        'New references may be reserved from the next unused number.'),[
        {text:'Cancel',style:'cancel'},
        {text:next?'Archive':'Reopen',onPress:()=>{
          void persist(rows=>archiveSeries(rows,chosen.id,next),()=>show('series'));
        }},
      ]);
  }
  async function share(ext:'csv'|'json'){
    if(!valid||!clean||writing.current)return;
    writing.current=true;setBusy(true);setError(null);
    try{
      const content=ext==='csv'?exportCsv(clean):exportBackup(clean);
      await shareDocument('invoice-reference-ledger-'+todayKey(),ext,content);
    }catch(e){setError(message(e));}
    finally{writing.current=false;setBusy(false);}
  }
  function restore(){
    if(!valid||!clean)return;
    let imported:LedgerRecord[];
    try{imported=importBackup(backupText);}
    catch(e){setError('Backup rejected: '+message(e));return;}
    Alert.alert('Replace ALL local ledger history?',
      'Replace '+clean.length+' records with '+imported.length+
      ' backup records? This replaces every series and event. Export the existing JSON first.',[
        {text:'Keep existing',style:'cancel'},
        {text:'Replace history',style:'destructive',onPress:()=>{
          void persist(()=>imported,()=>{
            setSeriesId(null);setOrdinal(null);setBackupText('');
            setRestoreVisible(false);show('home');
          });
        }},
      ]);
  }
  return <SafeAreaView style={{flex:1,backgroundColor:p.bg}}>
    <BrandHeader p={p}/>
    <View style={{flexDirection:'row',paddingHorizontal:21,gap:12}}>
      {([{target:'home',label:'Numbering books',active:page!=='data'},
        {target:'data',label:'Export & restore',active:page==='data'}] as const).map(item=>
        <Pressable key={item.target} accessibilityRole="tab"
          accessibilityState={{selected:item.active}}
          onPress={()=>show(item.target)}
          style={{flex:1,minHeight:48,borderBottomColor:item.active?p.accent:p.rule,
            borderBottomWidth:item.active?3:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontWeight:'900',fontSize:14,color:item.active?p.accent:p.sub}}>
            {item.label}
          </Text>
        </Pressable>)}
    </View>
    <ScrollView key={page+(seriesId??'')+(ordinal??'')} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{width:'100%',maxWidth:740,alignSelf:'center',
        padding:22,paddingBottom:82,gap:18}}>
      {error||store.error?<ErrorBanner p={p} text={error??store.error??''}/>:null}
      {store.loading?<Text style={{color:p.sub}}>Opening local reference records…</Text>:null}
      {clean===null&&!store.loading?<Panel p={p}>
        <Text style={{color:p.ink,fontSize:18,fontWeight:'900'}}>History needs attention</Text>
        <Text style={{color:p.sub,fontSize:14,lineHeight:22}}>
          The stored ledger has an incompatible format. Editing is blocked to avoid erasing records.
          Restore a verified backup only after recovering the current file with developer support.
        </Text>
      </Panel>:null}

      {page==='home'?<>
        <Heading p={p} eyebrow="One reference · one recorded decision"
          title="No missing numbers."
          body="Know which invoice references were reserved, issued or voided. Each numbering series stays separate and offline."/>
        <View style={{backgroundColor:p.soft,padding:18,borderRadius:14,gap:8}}>
          <Eyebrow p={p}>Important boundary</Eyebrow>
          <Text style={{color:p.onSoft,fontSize:14,lineHeight:23}}>
            This app does not create invoices or verify your accounting records.
            A missing number here may already exist somewhere else. Reconcile with your actual invoicing system.
          </Text>
        </View>
        <Button p={p} label="+ Start a numbering series" disabled={!valid||busy}
          onPress={()=>{setDraft(emptySeries());show('new-series');}}/>
        {series.length===0&&!store.loading?<Panel p={p}>
          <Text style={{color:p.ink,fontSize:20,fontWeight:'900'}}>Begin with your real sequence.</Text>
          <Text style={{color:p.sub,lineHeight:23}}>
            Choose a prefix and the next reference number from your own records.
            We won't invent earlier invoices or reset numbering automatically.
          </Text>
        </Panel>:null}
        {series.map(s=>{
          const summary=summaryOf(s,referencesOf(clean??[],s));
          return <Pressable key={s.id} accessibilityRole="button"
            accessibilityLabel={'Open '+s.label+' series '+s.code}
            onPress={()=>viewSeries(s)} style={({pressed})=>({opacity:pressed?.72:1})}>
            <Panel p={p}>
              <View style={{flexDirection:'row',justifyContent:'space-between',gap:12}}>
                <View style={{flex:1,gap:5}}>
                  <Eyebrow p={p}>{s.archived?'Archived series':'Active series'}</Eyebrow>
                  <Text style={{color:p.ink,fontSize:20,fontWeight:'900'}}>{s.label}</Text>
                </View>
                <Text style={{color:p.accent,fontSize:13,fontWeight:'900'}}>{s.code}</Text>
              </View>
              <Rule p={p}/>
              <Eyebrow p={p}>Next available reference</Eyebrow>
              <Text numberOfLines={1} adjustsFontSizeToFit
                style={{color:p.ink,fontFamily:mono,fontSize:26,fontWeight:'900'}}>
                {summary.next===null?'MAX REACHED':formatReference(s,summary.next)}
              </Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
                <Text style={{color:p.sub,fontWeight:'700',fontSize:13}}>
                  {summary.issued} issued · {summary.reserved} reserved · {summary.voided} void
                </Text>
                <Text style={{color:summary.unaccounted?p.danger:p.sub,fontWeight:'800',fontSize:13}}>
                  {summary.unaccounted} unaccounted here
                </Text>
              </View>
              <Text style={{color:p.accent,fontSize:14,fontWeight:'900'}}>Open ledger ›</Text>
            </Panel>
          </Pressable>;
        })}
      </>:null}

      {page==='new-series'?<>
        <Button p={p} label="← Back without saving" kind="outline" onPress={()=>show('home')}/>
        <Heading p={p} eyebrow="New reference book"
          title="Define the sequence."
          body="Every series has a permanent prefix and independent increasing number. Use a new prefix for a new year or business unit."/>
        <Panel p={p}>
          <Field p={p} label="Series name" value={draft.label} maxLength={72}
            placeholder="e.g. Consulting invoices" onChange={label=>setDraft(s=>({...s,label}))}/>
          <Field p={p} label="Prefix (must end in -)" value={draft.code} maxLength={18}
            placeholder="INV-2026-" onChange={code=>setDraft(s=>({...s,code}))}/>
          <Field p={p} label="Next number to use" value={draft.start}
            keyboard="number-pad" maxLength={8}
            onChange={start=>setDraft(s=>({...s,start}))}/>
          <Field p={p} label="Minimum digits (1 to 8)" value={draft.width}
            keyboard="number-pad" maxLength={1}
            onChange={width=>setDraft(s=>({...s,width}))}/>
          <View style={{backgroundColor:p.soft,padding:15,borderRadius:10,gap:6}}>
            <Eyebrow p={p}>Example reference</Eyebrow>
            <Text numberOfLines={1} adjustsFontSizeToFit
              style={{color:p.onSoft,fontFamily:mono,fontWeight:'900',fontSize:24}}>
              {/^\d{1,8}$/.test(draft.start)&&/^\d$/.test(draft.width)&&
              Number(draft.start)>0&&Number(draft.width)>0?
                draft.code.toUpperCase()+draft.start.padStart(Number(draft.width),'0'):'Check sequence'}
            </Text>
            <Text style={{color:p.onSoft,fontSize:13,lineHeight:20}}>
              Starting from 215 means earlier numbers are outside this ledger. No historical invoices will be assumed.
            </Text>
          </View>
        </Panel>
        <Button p={p} label={busy?'Saving…':'Create reference book'} disabled={!valid||busy}
          onPress={()=>{void addSeries();}}/>
      </>:null}

      {page==='series'&&chosen&&stats?<>
        <Button p={p} label="← Numbering books" kind="outline" onPress={()=>show('home')}/>
        <Heading p={p} eyebrow={'Reference series / '+chosen.code}
          title={chosen.label}
          body={'Started at '+formatReference(chosen,chosen.start)+
            '. Each reserved or issued number remains in this record.'}/>
        <ReferenceStamp p={p} series={chosen} number={stats.next}
          subtitle={chosen.archived?'Archived / next counter':'Next reference to reserve'}/>
        <Button p={p} label={chosen.archived?'Archived (read-only)':'Reserve next number'}
          disabled={!valid||busy||chosen.archived||stats.next===null}
          onPress={()=>{void reserve();}}/>
        <Button p={p} label="+ Record an existing external number" kind="outline"
          disabled={!valid||busy||chosen.archived} onPress={beginExisting}/>
        <Panel p={p}>
          <Eyebrow p={p}>Number audit · this device only</Eyebrow>
          <Pair p={p} label="Marked issued" value={String(stats.issued)}/>
          <Pair p={p} label="Reserved, unresolved" value={String(stats.reserved)}/>
          <Pair p={p} label="Voided, never reused" value={String(stats.voided)}/>
          <Rule p={p}/>
          <Pair p={p} label="Unaccounted in local ledger" value={String(stats.unaccounted)} emphasis/>
          {stats.gaps.length>0?<View style={{backgroundColor:p.soft,padding:14,gap:8,borderRadius:9}}>
            <Text style={{color:p.onSoft,fontWeight:'900'}}>Check these missing ranges</Text>
            {stats.gaps.slice(0,5).map(g=><Text key={g.first} style={{color:p.onSoft,
              fontFamily:mono,fontSize:13}}>
              {formatReference(chosen,g.first)}{g.last===g.first?'':' → '+formatReference(chosen,g.last)}
            </Text>)}
            {stats.gaps.length>5?<Text style={{color:p.onSoft,fontSize:12}}>
              {stats.gaps.length-5} further ranges omitted here; export for full history.
            </Text>:null}
            <Text style={{color:p.onSoft,fontSize:12,lineHeight:19}}>
              A gap only means that number is not logged here. Check original invoices before labeling it void.
            </Text>
          </View>:null}
        </Panel>
        <View style={{gap:11}}>
          <Text accessibilityRole="header" style={{color:p.ink,fontSize:23,fontWeight:'900'}}>
            Reference history
          </Text>
          <View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>
            {(['all','reserved','issued','void'] as const).map(value=>
              <Chip key={value} p={p} label={value==='all'?'All':value==='void'?'Voided':
                value==='issued'?'Issued':'Reserved'} active={filter===value}
                onPress={()=>setFilter(value)}/>)}
          </View>
          <Field p={p} label="Find a reference or client" value={search}
            placeholder="e.g. INV-2026-0003" onChange={setSearch}/>
          {visible.length===0?<Panel p={p}>
            <Text style={{color:p.sub,fontSize:14,lineHeight:21}}>
              No references match this view. Reserving a number is always an explicit action.
            </Text>
          </Panel>:null}
          {visible.map(value=><ReferenceRow key={value.ordinal} p={p} ref={value}
            onPress={()=>viewRef(value.ordinal)}/>)}
          {visible.length===150?<Text style={{color:p.sub,fontSize:12}}>
            Showing at most 150 records. Narrow your search or export the full CSV.
          </Text>:null}
        </View>
        <Panel p={p}>
          <Eyebrow p={p}>Close or reopen a book</Eyebrow>
          <Button p={p} kind="outline" disabled={busy||!valid}
            label={chosen.archived?'Reopen numbering series':'Archive numbering series'}
            onPress={changeArchived}/>
          <Text style={{color:p.sub,fontSize:13,lineHeight:22}}>
            No series deletion button exists. Prior allocations and voids remain visible, including in backups.
          </Text>
        </Panel>
      </>:null}

      {page==='reference'&&chosen&&ref?<>
        <Button p={p} label="← Back to series" kind="outline" onPress={()=>show('series')}/>
        <Heading p={p} eyebrow={'Reference / '+chosen.code}
          title="A number with history."
          body="Reservations, issues and voids stay linked to this exact reference. Nothing is sent to a customer."/>
        <Panel p={p} receipt>
          <Eyebrow p={p}>Recorded invoice reference</Eyebrow>
          <Text numberOfLines={1} adjustsFontSizeToFit
            style={{color:p.ink,fontSize:32,fontFamily:mono,fontWeight:'900'}}>
            {ref.formatted}
          </Text>
          <Status p={p} status={ref.status}/>
          <Rule p={p}/>
          <Pair p={p} label="Latest event date" value={dateText(ref.lastDay)}/>
          <Pair p={p} label="Client label" value={ref.client||'Not entered'}/>
        </Panel>
        {ref.status==='reserved'&&!chosen.archived?<>
          <Panel p={p}>
            <Eyebrow p={p}>Resolve this reservation</Eyebrow>
            <View style={{flexDirection:'row',gap:9}}>
              <View style={{flex:1}}>
                <Button p={p} label="Mark issued" kind={resolveAction==='issue'?'primary':'outline'}
                  onPress={()=>{setResolveAction('issue');setError(null);}}/>
              </View>
              <View style={{flex:1}}>
                <Button p={p} label="Void number" kind={resolveAction==='void'?'primary':'outline'}
                  onPress={()=>{setResolveAction('void');setError(null);}}/>
              </View>
            </View>
            {resolveAction?<View style={{gap:13}}>
              <Text style={{color:p.sub,fontSize:14,lineHeight:23}}>
                {resolveAction==='issue'?
                  'Use this only after the actual invoice was issued outside Folio.':
                  'This number will be permanently marked void, and will not be reused.'}
              </Text>
              <DateField p={picker(p)} label="Event date" day={entryDay} onChange={setEntryDay}/>
              <Field p={p} label="Client label (optional)" value={entryClient}
                placeholder="e.g. Westbrook Studio" onChange={setEntryClient}/>
              <Field p={p} label={resolveAction==='void'?'Why was it voided? (required)':'Note (optional)'}
                value={entryNote} multiline maxLength={500}
                placeholder={resolveAction==='void'?'e.g. Draft was cancelled before sending':'e.g. Issued in accounting app'}
                onChange={setEntryNote}/>
              <Button p={p} disabled={!valid||busy}
                label={resolveAction==='issue'?'Confirm issued':'Confirm void — no reuse'}
                onPress={applyResolution}/>
            </View>:null}
          </Panel>
        </>:<Panel p={p}>
          <Text style={{color:p.ink,fontSize:16,fontWeight:'900'}}>
            {chosen.archived?'Series archived.':ref.status==='issued'?'Already marked issued.':'This number was voided.'}
          </Text>
          <Text style={{color:p.sub,fontSize:14,lineHeight:22}}>
            This local ledger will not recycle the reference. Real invoice cancellation or correction must
            follow your accounting process outside this app.
          </Text>
        </Panel>}
        <EventTimeline p={p} selected={ref}/>
      </>:null}

      {page==='existing'&&chosen?<>
        <Button p={p} label="← Back to series" kind="outline" onPress={()=>show('series')}/>
        <Heading p={p} eyebrow="Bring an old number into the ledger"
          title="Reconcile an existing reference."
          body="Only log a number that exists in your external records. This does not verify or import the invoice itself."/>
        <Panel p={p}>
          <Eyebrow p={p}>{'Existing prefix / '+chosen.code}</Eyebrow>
          <Field p={p} label="Numeric suffix" value={existingNumber}
            onChange={setExistingNumber} keyboard="number-pad" maxLength={7}
            placeholder={'At least '+chosen.start}/>
          <View style={{flexDirection:'row',gap:10}}>
            <View style={{flex:1}}>
              <Chip p={p} label="Already issued" active={existingStatus==='issued'}
                onPress={()=>setExistingStatus('issued')}/>
            </View>
            <View style={{flex:1}}>
              <Chip p={p} label="Previously voided" active={existingStatus==='void'}
                onPress={()=>setExistingStatus('void')}/>
            </View>
          </View>
          <DateField p={picker(p)} label="External record date" day={entryDay} onChange={setEntryDay}/>
          <Field p={p} label="Client label (optional)" value={entryClient}
            placeholder="Only the name or local alias you choose" onChange={setEntryClient}/>
          <Field p={p} label="Source / explanation (required)" value={entryNote}
            multiline maxLength={500} onChange={setEntryNote}
            placeholder="e.g. Confirmed INV-0215 in accountant export"/>
          <Text style={{color:p.sub,fontSize:13,lineHeight:21}}>
            Entering number 215 does NOT imply that numbers 1–214 existed. Every gap stays unaccounted
            until you deliberately log evidence for each external reference.
          </Text>
        </Panel>
        <Button p={p} label={busy?'Saving…':'Record existing reference'}
          onPress={()=>{void record();}} disabled={!valid||busy||chosen.archived}/>
      </>:null}

      {page==='data'?<>
        <Heading p={p} eyebrow="Manual exports / local-only"
          title="Keep your ledger portable."
          body="Your records stay on this device until you deliberately share them. Keep your own backup before replacing a device."/>
        <Panel p={p}>
          <Eyebrow p={p}>Export what actually happened</Eyebrow>
          <Text style={{color:p.sub,fontSize:14,lineHeight:22}}>
            CSV records every allocation, issue and void event, with timestamp, date and optional note.
            JSON includes the full linked history for restoration in this app.
          </Text>
          <Button p={p} kind="outline" label="Export full event CSV"
            disabled={!valid||busy} onPress={()=>{void share('csv');}}/>
          <Button p={p} kind="outline" label="Export complete JSON backup"
            disabled={!valid||busy} onPress={()=>{void share('json');}}/>
          <Button p={p} kind="outline"
            label={restoreVisible?'Hide restore':'Restore JSON backup'}
            onPress={()=>setRestoreVisible(s=>!s)}/>
          {restoreVisible?<View style={{gap:13}}>
            <Text style={{color:p.sub,fontSize:14,lineHeight:22}}>
              Paste a JSON export from Folio. This replaces ALL series and records after validation
              and a destructive confirmation. Export current history first.
            </Text>
            <TextInput accessibilityLabel="Paste JSON backup" value={backupText}
              onChangeText={setBackupText} multiline maxLength={2_000_000}
              textAlignVertical="top" placeholder="Paste entire JSON backup"
              placeholderTextColor={p.sub} style={{color:p.ink,backgroundColor:p.bg,
                padding:14,borderRadius:9,borderColor:p.rule,borderWidth:1,
                minHeight:140,fontSize:13,fontFamily:mono}}/>
            <Button p={p} kind="danger" label="Validate and replace all records"
              disabled={!valid||busy||!backupText.trim()} onPress={restore}/>
          </View>:null}
        </Panel>
        <Panel p={p}>
          <Eyebrow p={p}>Data and safety boundaries</Eyebrow>
          <Text style={{color:p.sub,fontSize:14,lineHeight:24}}>
            No login, analytics, cloud sync, digital signatures, invoice creation, amount calculations
            or tax compliance checks. Local device storage is not a tamper-proof audit system.
            It is not independently encrypted by this app. Uninstalling the app without saving a backup may lose everything.
            Numbers issued from a second device or tool are invisible here until manually recorded.
          </Text>
        </Panel>
      </>:null}
      <View style={{borderTopColor:p.rule,borderTopWidth:1,paddingTop:15,gap:7}}>
        <Text style={{color:p.sub,fontSize:12,lineHeight:20}}>
          RESEARCH BUILD / NOT A CERTIFIED INVOICE REGISTER.
          Your legal numbering and electronic invoicing requirements depend on your jurisdiction and accounting system.
          Always reconcile against your official invoices.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
