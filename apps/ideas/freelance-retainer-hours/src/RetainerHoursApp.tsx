import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Storage from 'expo-sqlite/kv-store';
import { DateField, dayKey, uniqueId, useLocalRecords } from '@foundry/mobile-kit';
import {
  STORAGE_NAMESPACE, emptyAgreement, emptyLine, makeAgreement, makeLine,
  validateLedger, agreementsOf, entriesOf, balanceOf, periodStatus,
  splitDuration, displayDuration, exportCsv, exportBackup, importBackup, statement,
  type Agreement, type AgreementInput, type Line, type LineInput, type LedgerRecord, type LineKind,
} from './domain.ts';
import { LEGACY_KEY, previewLegacy, appendLegacy } from './legacy.ts';
import { shareDocument } from './share.ts';
import {
  DAY,NIGHT,Button,Card,Field,Rule,Micro,MiniPair,BalanceStrip,DurationInput,AlertLine,
  numberFace,type Colors,
} from './ui.tsx';

type Page='home'|'agreement'|'agreement-form'|'line-form'|'data';
const message=(e:unknown):string=>e instanceof Error?e.message:'This action could not be completed';
const formatDay=(day:string):string=>{
  const [y,m,d]=day.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined,{day:'numeric',month:'short',year:'numeric'})
    .format(new Date(y!,m!-1,d!,12));
};
const statusLabel=(s:ReturnType<typeof periodStatus>):string=>({
  archived:'Archived',upcoming:'Not started',ended:'Period ended',
  overdrawn:'Over allowance','near-limit':'Almost used','in-progress':'In progress',
})[s];
const palette=(c:Colors)=>({
  canvas:c.canvas,surface:c.surface,ink:c.ink,muted:c.muted,
  accent:c.primary,onAccent:c.onPrimary,tint:c.soft,onTint:c.onSoft,border:c.border,
});

function Header({c}:{c:Colors}){
  return <View style={{paddingHorizontal:21,paddingTop:14,paddingBottom:15,
    borderBottomWidth:1,borderColor:c.border,flexDirection:'row',gap:11,alignItems:'center'}}>
    <View style={{height:45,width:45,backgroundColor:c.primary,borderRadius:12,
      justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:c.onPrimary,fontSize:21,fontFamily:numberFace,fontWeight:'900'}}>H.</Text>
    </View>
    <View style={{flex:1,gap:3}}>
      <Text style={{fontWeight:'900',fontSize:22,color:c.ink,letterSpacing:-0.7}}>HOURS LEFT</Text>
      <Text style={{fontSize:11,color:c.muted,fontWeight:'800',letterSpacing:1}}>
        RETAINER LEDGER / ON DEVICE
      </Text>
    </View>
  </View>;
}
function Tab({c,label,active,onPress}:{c:Colors;label:string;active:boolean;onPress:()=>void}){
  return <Pressable accessibilityRole="tab" accessibilityState={{selected:active}}
    onPress={onPress}
    style={{flex:1,minHeight:48,borderBottomWidth:active?3:1,
      borderColor:active?c.primary:c.border,alignItems:'center',justifyContent:'center'}}>
    <Text style={{fontSize:14,fontWeight:active?'900':'700',color:active?c.primary:c.muted}}>{label}</Text>
  </Pressable>;
}
function PageHeading({c,kicker,title,body}:{c:Colors;kicker:string;title:string;body:string}){
  return <View style={{gap:10,paddingTop:12,paddingBottom:4}}>
    <Micro c={c}>{kicker}</Micro>
    <Text accessibilityRole="header" style={{fontSize:36,lineHeight:42,letterSpacing:-1.2,
      fontWeight:'900',color:c.ink}}>{title}</Text>
    <Text style={{fontSize:16,color:c.muted,lineHeight:25}}>{body}</Text>
  </View>;
}
function HoursForm({c,hours,minutes,onHours,onMinutes}:{c:Colors;hours:string;minutes:string;
  onHours:(x:string)=>void;onMinutes:(x:string)=>void}){
  return <View style={{gap:7}}>
    <Micro c={c}>Hours and minutes · exact increments</Micro>
    <DurationInput c={c} hours={hours} minutes={minutes} onHours={onHours} onMinutes={onMinutes}/>
    <Text style={{color:c.muted,fontSize:12,lineHeight:19}}>
      Whole minutes only. No decimal-hour rounding or hidden changes.
    </Text>
  </View>;
}

export default function RetainerHoursApp(){
  const c=useColorScheme()==='dark'?NIGHT:DAY;
  const store=useLocalRecords<LedgerRecord>(STORAGE_NAMESPACE);
  const [page,setPage]=useState<Page>('home');
  const [chosen,setChosen]=useState<string|null>(null);
  const [editingAgreement,setEditingAgreement]=useState<string|null>(null);
  const [editingLine,setEditingLine]=useState<string|null>(null);
  const [agreementDraft,setAgreementDraft]=useState<AgreementInput>(()=>emptyAgreement());
  const [lineDraft,setLineDraft]=useState<LineInput>(()=>emptyLine());
  const [query,setQuery]=useState('');
  const [error,setError]=useState<string|null>(null);
  const [legacy,setLegacy]=useState<LedgerRecord[]>([]);
  const [legacyProblem,setLegacyProblem]=useState<string|null>(null);
  const [backupOpen,setBackupOpen]=useState(false);
  const [backupRaw,setBackupRaw]=useState('');
  const [busy,setBusy]=useState(false);
  const saving=useRef(false);

  const checked=useMemo(()=>{
    try{return validateLedger(store.records);}
    catch{return null;}
  },[store.records]);
  const agreements=agreementsOf(checked??[]);
  const active=agreements.filter(a=>a.state==='open');
  const today=dayKey(new Date());
  const selected=agreements.find(a=>a.id===chosen)??null;
  const selectedLines=selected?entriesOf(checked??[],selected.id):[];
  const pendingLegacy=legacy.filter(r=>!checked?.some(x=>x.id===r.id));
  const matches=agreements.filter(a=>
    [a.client,a.project,a.note].some(value=>value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));

  useEffect(()=>{
    let mounted=true;
    Storage.getItem(LEGACY_KEY).then(raw=>{
      if(!mounted||!raw)return;
      try{setLegacy(previewLegacy(raw));}
      catch(e){setLegacyProblem('Earlier prototype records are not automatically importable: '+message(e));}
    }).catch(e=>{if(mounted)setLegacyProblem('Unable to inspect previous local data: '+message(e));});
    return()=>{mounted=false;};
  },[]);

  function go(next:Page){setPage(next);setError(null);}
  function beginAgreement(a?:Agreement){
    if(a){
      const duration=splitDuration(a.includedMinutes);
      setAgreementDraft({client:a.client,project:a.project,from:a.from,to:a.to,
        hours:duration.hours,minutes:duration.minutes,note:a.note});
      setEditingAgreement(a.id);
    }else{
      setAgreementDraft(emptyAgreement(today));setEditingAgreement(null);
    }
    go('agreement-form');
  }
  function beginLine(action:LineKind,line?:Line){
    if(!selected)return;
    const useDay=today<selected.from?selected.from:today>selected.to?selected.to:today;
    if(line){
      const duration=splitDuration(line.minutes);
      setLineDraft({day:line.day,action:line.action,hours:duration.hours,minutes:duration.minutes,
        description:line.description});
      setEditingLine(line.id);
    }else{
      setLineDraft(emptyLine(useDay,action));setEditingLine(null);
    }
    go('line-form');
  }
  async function storeAgreement(){
    if(saving.current||store.loading||checked===null)return;
    saving.current=true;setBusy(true);setError(null);
    try{
      const previous=editingAgreement?agreements.find(x=>x.id===editingAgreement):undefined;
      if(editingAgreement&&!previous)throw new Error('The agreement no longer exists');
      const made=makeAgreement(agreementDraft,editingAgreement??uniqueId(),
        previous?.createdAt,previous?.state);
      await store.change(prior=>{
        const original=validateLedger(prior);
        const old=original.find(x=>x.id===made.id&&x.kind==='agreement') as Agreement|undefined;
        if(editingAgreement&&!old)throw new Error('Agreement changed while editing');
        if(old&&original.some(x=>x.kind==='line'&&x.agreementId===made.id)&&
          (old.from!==made.from||old.to!==made.to||old.includedMinutes!==made.includedMinutes))
          throw new Error('Period and allowance are locked after logging time. Add a credit or create a new period instead.');
        const next=old?original.map(r=>r.id===made.id?made:r):[made,...original];
        return validateLedger(next);
      });
      setChosen(made.id);setEditingAgreement(null);go('agreement');
    }catch(e){setError(message(e));}
    finally{saving.current=false;setBusy(false);}
  }
  async function storeLine(){
    if(saving.current||store.loading||checked===null||!chosen)return;
    saving.current=true;setBusy(true);setError(null);
    try{
      const id=editingLine??uniqueId();
      await store.change(prior=>{
        const current=validateLedger(prior);
        const parent=current.find(x=>x.kind==='agreement'&&x.id===chosen) as Agreement|undefined;
        if(!parent)throw new Error('Retainer no longer exists');
        const old=current.find(x=>x.kind==='line'&&x.id===id) as Line|undefined;
        if(editingLine&&!old)throw new Error('Time entry no longer exists');
        const made=makeLine(lineDraft,parent,id,old?.createdAt);
        if(old&&old.agreementId!==parent.id)throw new Error('Time entry belongs to another client');
        const next=old?current.map(x=>x.id===id?made:x):[...current,made];
        return validateLedger(next);
      });
      setEditingLine(null);go('agreement');
    }catch(e){setError(message(e));}
    finally{saving.current=false;setBusy(false);}
  }
  function deleteLine(item:Line){
    Alert.alert('Delete this time entry?',
      'Remove '+displayDuration(item.minutes)+' from the '+(item.action==='work'?'work':'hours-added')+
      ' ledger? The remaining balance will change.',[
        {text:'Keep entry',style:'cancel'},
        {text:'Delete entry',style:'destructive',onPress:()=>{
          void store.change(rows=>validateLedger(rows.filter(r=>r.id!==item.id)))
            .catch(e=>setError(message(e)));
        }},
      ]);
  }
  function toggleArchive(a:Agreement){
    const next=a.state==='archived'?'open':'archived';
    Alert.alert(next==='archived'?'Archive this period?':'Reopen this period?',
      'The records remain available. '+(next==='archived'?'No new work may be logged while archived.':
        'New work can be added again within the same dates.'),[
        {text:'Cancel',style:'cancel'},
        {text:next==='archived'?'Archive':'Reopen',onPress:()=>{
          void store.change(rows=>validateLedger(rows.map(x=>x.kind==='agreement'&&x.id===a.id?
            {...x,state:next}:x))).catch(e=>setError(message(e)));
        }},
      ]);
  }
  function deleteAgreement(a:Agreement){
    const n=entriesOf(checked??[],a.id).length;
    Alert.alert('Delete client period and its history?',
      'This permanently removes '+a.client+' / '+a.project+' and '+n+
      ' dated work/credit entries. Export a backup first.',[
        {text:'Keep everything',style:'cancel'},
        {text:'Delete period and entries',style:'destructive',onPress:()=>{
          void store.change(rows=>validateLedger(rows.filter(x=>x.id!==a.id&&
            !(x.kind==='line'&&x.agreementId===a.id))))
            .then(()=>{setChosen(null);go('home');})
            .catch(e=>setError(message(e)));
        }},
      ]);
  }
  async function share(kind:'csv'|'json'|'statement'){
    if(busy||checked===null||store.loading)return;
    setBusy(true);setError(null);
    try{
      if(kind==='statement'){
        if(!selected)throw new Error('Choose a client period to share');
        await shareDocument('retainer-client-update-'+today,'txt',statement(selected,selectedLines));
      }else{
        await shareDocument('retainer-hours-'+today,kind,
          kind==='csv'?exportCsv(checked):exportBackup(checked));
      }
    }catch(e){setError(message(e));}
    finally{setBusy(false);}
  }
  function restore(){
    if(checked===null)return;
    let imported:LedgerRecord[];
    try{imported=importBackup(backupRaw);}
    catch(e){setError('Backup not restored: '+message(e));return;}
    Alert.alert('Replace ALL local retainer records?',
      'This replaces '+checked.length+' saved records with '+imported.length+
      ' records from this backup. Export the current JSON first.',[
        {text:'Cancel',style:'cancel'},
        {text:'Replace records',style:'destructive',onPress:()=>{
          void store.change(()=>imported)
            .then(()=>{setChosen(null);setBackupRaw('');setBackupOpen(false);go('home');})
            .catch(e=>setError(message(e)));
        }},
      ]);
  }
  function importOld(){
    if(!checked||pendingLegacy.length===0)return;
    Alert.alert('Import old calculator snapshots?',
      'This imports '+pendingLegacy.length+' legacy record(s), grouped into single-day ARCHIVED '+
      'snapshots. Earlier records had no contract period or line dates. Old data is not deleted.',[
        {text:'Cancel',style:'cancel'},
        {text:'Import as historical snapshots',onPress:()=>{
          void store.change(rows=>appendLegacy(validateLedger(rows),pendingLegacy))
            .then(()=>{setLegacy([]);go('home');})
            .catch(e=>setError(message(e)));
        }},
      ]);
  }
  function backFromForm(){
    if(page==='agreement-form')go(editingAgreement?'agreement':'home');
    else go('agreement');
  }

  return <SafeAreaView style={{flex:1,backgroundColor:c.canvas}}>
    <Header c={c}/>
    <View style={{flexDirection:'row',paddingHorizontal:20,gap:9}}>
      <Tab c={c} label="Retainers" active={page==='home'||page==='agreement'||page==='agreement-form'||page==='line-form'}
        onPress={()=>go('home')}/>
      <Tab c={c} label="Data & backups" active={page==='data'} onPress={()=>go('data')}/>
    </View>
    <ScrollView key={page+(chosen??'')} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{padding:21,paddingBottom:85,gap:18,maxWidth:740,width:'100%',alignSelf:'center'}}>
      {error||store.error?<AlertLine c={c} message={error??store.error??''}/>:null}
      {store.loading?<Text style={{color:c.muted,fontSize:15}}>Opening offline ledger…</Text>:null}
      {checked===null&&!store.loading?<AlertLine c={c}
        message="Stored data is in an unsupported format. Editing is blocked so the original records are not overwritten. Get developer help to recover the raw SQLite store."/>:null}

      {page==='home'?<>
        <PageHeading c={c} kicker="Your work / your allowance" title="Hours under control."
          body="Know what is left before you promise another deliverable. Only logged hours count; no background time tracking."/>
        <View style={{flexDirection:'row',gap:11}}>
          <View style={{flex:1,backgroundColor:c.soft,padding:17,borderRadius:14,gap:6}}>
            <Micro c={c}>OPEN PERIODS</Micro>
            <Text style={{color:c.onSoft,fontFamily:numberFace,fontWeight:'900',fontSize:32}}>{active.length}</Text>
          </View>
          <View style={{flex:1,backgroundColor:c.soft,padding:17,borderRadius:14,gap:6}}>
            <Micro c={c}>OVER ALLOWANCE</Micro>
            <Text style={{color:c.onSoft,fontFamily:numberFace,fontWeight:'900',fontSize:32}}>
              {active.filter(a=>balanceOf(a,entriesOf(checked??[],a.id)).remaining<0).length}
            </Text>
          </View>
        </View>
        <Button c={c} label="+ Create a retainer period" onPress={()=>beginAgreement()}
          disabled={store.loading||checked===null||busy}/>
        <Field c={c} label="Find a client or project" value={query}
          placeholder="Search active and archived periods" onChange={setQuery}/>
        <View style={{gap:13}}>
          {matches.length===0&&!store.loading?<Card c={c}>
            <Text style={{color:c.ink,fontWeight:'800',fontSize:19}}>
              {agreements.length===0?'Start with one real client period.':'No retainers match this search.'}
            </Text>
            <Text style={{color:c.muted,fontSize:15,lineHeight:23}}>
              {agreements.length===0?'Enter the period, allowance and project; then log work or agreed additional hours. No sample data is fabricated.':'Try another client or project name.'}
            </Text>
          </Card>:null}
          {matches.map(a=>{
            const lines=entriesOf(checked??[],a.id);
            const balance=balanceOf(a,lines);
            const state=periodStatus(a,lines,today);
            return <Pressable key={a.id} accessibilityRole="button"
              accessibilityLabel={'Open '+a.client+' '+a.project}
              onPress={()=>{setChosen(a.id);go('agreement');}}
              style={({pressed})=>({opacity:pressed?0.7:1})}>
              <Card c={c}>
                <View style={{flexDirection:'row',justifyContent:'space-between',gap:10,alignItems:'flex-start'}}>
                  <View style={{flex:1,gap:5}}>
                    <Text style={{color:c.ink,fontWeight:'900',fontSize:19}}>{a.client}</Text>
                    <Text style={{color:c.muted,fontSize:14}}>{a.project}</Text>
                  </View>
                  <Text style={{color:c.primary,fontWeight:'900',fontSize:11}}>{statusLabel(state).toUpperCase()}</Text>
                </View>
                <BalanceStrip c={c} balance={balance}/>
                <Text style={{color:c.muted,fontSize:12}}>{formatDay(a.from)} – {formatDay(a.to)} · {lines.length} entries</Text>
                <Text style={{color:c.primary,fontSize:14,fontWeight:'800'}}>Open period ›</Text>
              </Card>
            </Pressable>;
          })}
        </View>
      </>:null}

      {page==='agreement'&&selected?<><Button c={c} label="← All retainers" variant="secondary" onPress={()=>go('home')}/>
        <PageHeading c={c} kicker="Client / prepaid hours" title={selected.client}
          body={selected.project+' · '+formatDay(selected.from)+' – '+formatDay(selected.to)}/>
        <BalanceStrip c={c} balance={balanceOf(selected,selectedLines)} large/>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
          <Text style={{color:c.muted,fontSize:13,fontWeight:'800'}}>
            STATUS · {statusLabel(periodStatus(selected,selectedLines,today))}
          </Text>
        </View>
        <Card c={c}>
          <Micro c={c}>PERIOD ACCOUNTING</Micro>
          <MiniPair c={c} label="Original prepaid hours" value={displayDuration(selected.includedMinutes)}/>
          <MiniPair c={c} label="Hours added" value={displayDuration(balanceOf(selected,selectedLines).credited)}/>
          <MiniPair c={c} label="Time delivered" value={displayDuration(balanceOf(selected,selectedLines).delivered)}/>
          <Rule c={c}/>
          <MiniPair c={c} strong label="Balance remaining" value={displayDuration(balanceOf(selected,selectedLines).remaining)}/>
          {selected.note?<Text style={{color:c.muted,fontSize:13,lineHeight:21}}>{selected.note}</Text>:null}
        </Card>
        {selected.state==='open'?<>
          <Button c={c} label="+ Log delivered work" onPress={()=>beginLine('work')}/>
          <Button c={c} label="+ Record added prepaid hours" variant="secondary" onPress={()=>beginLine('topup')}/>
        </>:<Text style={{color:c.muted,fontSize:14}}>This period is archived. Reopen it to add new entries.</Text>}
        <Button c={c} label="Share client-ready period statement" variant="secondary"
          disabled={busy||store.loading} onPress={()=>{void share('statement');}}/>
        <View style={{gap:13,marginTop:8}}>
          <Text accessibilityRole="header" style={{color:c.ink,fontSize:22,fontWeight:'900'}}>
            Dated work ledger · {selectedLines.length}
          </Text>
          {selectedLines.length===0?<Card c={c}>
            <Text style={{color:c.muted,fontSize:15}}>No work or additional hours logged yet. Add the first real entry.</Text>
          </Card>:null}
          {selectedLines.map(entry=><Card key={entry.id} c={c}>
            <View style={{flexDirection:'row',justifyContent:'space-between',gap:10}}>
              <View style={{flex:1,gap:5}}>
                <Micro c={c}>{entry.action==='work'?'WORK DELIVERED':'HOURS ADDED'}</Micro>
                <Text style={{color:c.ink,fontWeight:'800',fontSize:16}}>{entry.description}</Text>
                <Text style={{color:c.muted,fontSize:13}}>{formatDay(entry.day)}</Text>
              </View>
              <Text style={{fontFamily:numberFace,color:c.primary,fontSize:18,fontWeight:'900'}}>
                {entry.action==='work'?'−':'+'}{displayDuration(entry.minutes)}
              </Text>
            </View>
            <Rule c={c}/>
            <View style={{flexDirection:'row',gap:17,flexWrap:'wrap'}}>
              {selected.state==='open'?<Pressable accessibilityRole="button" onPress={()=>beginLine(entry.action,entry)}
                style={{minHeight:48,justifyContent:'center'}}>
                <Text style={{color:c.primary,fontWeight:'800'}}>Edit entry</Text>
              </Pressable>:null}
              <Pressable accessibilityRole="button" onPress={()=>deleteLine(entry)}
                style={{minHeight:48,justifyContent:'center'}}>
                <Text style={{color:c.danger,fontWeight:'800'}}>Remove</Text>
              </Pressable>
            </View>
          </Card>)}
        </View>
        <Card c={c}>
          <Micro c={c}>PERIOD CONTROLS</Micro>
          <Button c={c} label="Edit client or period details" variant="secondary" onPress={()=>beginAgreement(selected)}/>
          <Text style={{color:c.muted,fontSize:12,lineHeight:20}}>
            Once work is logged, the original allowance and dates are locked. Record extra hours as a separate ledger entry.
          </Text>
          <Button c={c} label={selected.state==='open'?'Archive this period':'Reopen this period'}
            variant="secondary" onPress={()=>toggleArchive(selected)}/>
          <Button c={c} label="Delete period and all entries" variant="destructive"
            onPress={()=>deleteAgreement(selected)}/>
        </Card>
      </>:null}

      {page==='agreement-form'?<>
        <Button c={c} label="← Back without saving" variant="secondary" onPress={backFromForm}/>
        <PageHeading c={c} kicker={editingAgreement?'Update client period':'New prepaid period'}
          title={editingAgreement?'Edit the agreement.':'Define the allowance.'}
          body="One client, one project, one explicit period. Log every work item or added allowance separately."/>
        <Card c={c}>
          <Field c={c} label="Client name" value={agreementDraft.client}
            placeholder="e.g. Acme Studio" maxLength={80}
            onChange={client=>setAgreementDraft(old=>({...old,client}))}/>
          <Field c={c} label="Project / retainer name" value={agreementDraft.project}
            placeholder="e.g. Monthly website support" maxLength={96}
            onChange={project=>setAgreementDraft(old=>({...old,project}))}/>
          <DateField p={palette(c)} label="Period starts" day={agreementDraft.from}
            onChange={from=>setAgreementDraft(old=>({...old,from}))}/>
          <DateField p={palette(c)} label="Period ends" day={agreementDraft.to}
            onChange={to=>setAgreementDraft(old=>({...old,to}))}/>
          <HoursForm c={c} hours={agreementDraft.hours} minutes={agreementDraft.minutes}
            onHours={hours=>setAgreementDraft(old=>({...old,hours}))}
            onMinutes={minutes=>setAgreementDraft(old=>({...old,minutes}))}/>
          <Field c={c} label="Agreement note (optional)" value={agreementDraft.note}
            placeholder="e.g. Work included; exclusions; how the client approved the hours" multiline maxLength={500}
            onChange={note=>setAgreementDraft(old=>({...old,note}))}/>
          <Text style={{color:c.muted,fontSize:13,lineHeight:20}}>
            The saved allowance is user-entered. This does not certify contractual approval, billing rights or rollover.
          </Text>
        </Card>
        <Button c={c} label={busy?'Saving…':editingAgreement?'Save agreement changes':'Create period'}
          disabled={busy||store.loading||checked===null}
          onPress={()=>{void storeAgreement();}}/>
      </>:null}

      {page==='line-form'&&selected?<>
        <Button c={c} label="← Back to client ledger" variant="secondary" onPress={backFromForm}/>
        <PageHeading c={c} kicker={lineDraft.action==='work'?'Debit / delivered work':'Credit / additional hours'}
          title={editingLine?'Correct this entry.':lineDraft.action==='work'?'Log real work.':'Add prepaid hours.'}
          body={selected.client+' · '+selected.project}/>
        <Card c={c}>
          <Micro c={c}>{'PERIOD '+selected.from+' TO '+selected.to}</Micro>
          <Text style={{color:c.muted,fontSize:13,lineHeight:22}}>
            {lineDraft.action==='work'?'Work reduces available hours.':'Record hours added only after independently confirming client authorization.'}
          </Text>
          <DateField p={palette(c)} label="Entry date" day={lineDraft.day}
            onChange={day=>setLineDraft(old=>({...old,day}))}/>
          <HoursForm c={c} hours={lineDraft.hours} minutes={lineDraft.minutes}
            onHours={hours=>setLineDraft(old=>({...old,hours}))}
            onMinutes={minutes=>setLineDraft(old=>({...old,minutes}))}/>
          <Field c={c} label={lineDraft.action==='work'?'Work delivered (required)':'Reason / authorization note (required)'}
            value={lineDraft.description} maxLength={240} multiline
            placeholder={lineDraft.action==='work'?'e.g. 32-minute client call + API fix':'e.g. Email approval for 2 extra hours'}
            onChange={description=>setLineDraft(old=>({...old,description}))}/>
          <Text style={{color:c.muted,fontSize:13,lineHeight:22}}>
            Dates outside the agreement period cannot be saved. All durations are exact whole minutes.
          </Text>
        </Card>
        <Button c={c} label={busy?'Saving…':editingLine?'Save corrected entry':
          lineDraft.action==='work'?'Save worked time':'Record added hours'}
          disabled={busy||store.loading||checked===null||selected.state!=='open'}
          onPress={()=>{void storeLine();}}/>
      </>:null}

      {page==='data'?<>
        <PageHeading c={c} kicker="Private / recoverable" title="Your records. Your call."
          body="No account or backend. Exports happen only when you choose to share a file. Back up before changing phones."/>
        <Card c={c}>
          <Micro c={c}>FULL PORTFOLIO EXPORTS</Micro>
          <Text style={{color:c.muted,fontSize:14,lineHeight:23}}>
            CSV includes each prepaid period, every work entry and additional hours as separate lines. JSON supports full restore.
          </Text>
          <Button c={c} label="Export ledger to CSV" variant="secondary"
            disabled={busy||store.loading||checked===null} onPress={()=>{void share('csv');}}/>
          <Button c={c} label="Export full JSON backup" variant="secondary"
            disabled={busy||store.loading||checked===null} onPress={()=>{void share('json');}}/>
          <Button c={c} label={backupOpen?'Hide restore':'Restore from JSON backup'}
            variant="secondary" onPress={()=>setBackupOpen(old=>!old)}/>
          {backupOpen?<View style={{gap:12}}>
            <Text style={{color:c.muted,fontSize:14,lineHeight:22}}>
              Paste the complete JSON export from this same app. You will be asked to confirm before ALL existing records are replaced.
            </Text>
            <TextInput accessibilityLabel="Paste full JSON backup" multiline textAlignVertical="top"
              value={backupRaw} maxLength={2000000} onChangeText={setBackupRaw}
              placeholder="Paste JSON backup" placeholderTextColor={c.muted}
              style={{height:145,padding:13,color:c.ink,backgroundColor:c.canvas,
                borderColor:c.border,borderWidth:1,borderRadius:11,fontFamily:numberFace,fontSize:13}}/>
            <Button c={c} label="Validate and replace current records" variant="destructive"
              disabled={busy||store.loading||checked===null||!backupRaw.trim()} onPress={restore}/>
          </View>:null}
        </Card>
        {pendingLegacy.length>0?<Card c={c} accent>
          <Micro c={c}>OLDER CALCULATOR FOUND</Micro>
          <Text style={{color:c.ink,fontWeight:'900',fontSize:19}}>Old retainer snapshots available</Text>
          <Text style={{color:c.muted,lineHeight:22}}>
            The original calculator did not record contract periods. Import as dated, archived one-day snapshots—never as verified contracts. The original key remains untouched.
          </Text>
          <Button c={c} label={'Review and import '+pendingLegacy.length+' old record(s)'}
            onPress={importOld} disabled={store.loading||checked===null}/>
        </Card>:null}
        {legacyProblem?<AlertLine c={c} message={legacyProblem}/>:null}
        <Card c={c}>
          <Micro c={c}>HOW DATA IS PROTECTED</Micro>
          <Text style={{color:c.muted,fontSize:14,lineHeight:24}}>
            On-device SQLite storage, strict backup validation and confirmation before deletion or restore.
            Data is not application-encrypted beyond OS protections and has no automatic remote backup.
            Uninstalling or losing the device may permanently remove records.
          </Text>
        </Card>
      </>:null}
      <View style={{borderTopWidth:1,borderColor:c.border,paddingTop:16,gap:7}}>
        <Text style={{color:c.muted,fontSize:12,lineHeight:20}}>
          INTERNAL RESEARCH BUILD · No automatic timers, reminders, analytics, login, cloud storage or payments.
          Client statements summarize your own entries and are not approved invoices, payroll or legal records.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
