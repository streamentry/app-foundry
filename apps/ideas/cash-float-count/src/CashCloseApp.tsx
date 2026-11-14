import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Storage from 'expo-sqlite/kv-store';
import { DateField, dayKey, uniqueId, useLocalRecords } from '@foundry/mobile-kit';
import {
  CURRENCIES, MAX_QUANTITY, denominations, emptyDraft, formatMoney, makeSession,
  parseMoney, profile, reconciliation, sortedSessions, sumCash, totalMinor,
  draftFromSession, exportCsv, exportBackup, importBackup, validateSession,
  type CurrencyCode, type CountDraft, type CloseSession,
} from './domain.ts';
import { LEGACY_STORAGE_KEY, legacySessions, appendLegacy } from './legacy.ts';
import { shareDocument } from './share';
import {
  Action, DAY, NIGHT, Label, Panel, Field, DenominationRow, Receipt,
  errorMessage, formatDay, flexRow, mono,
} from './components';
const DRAFT_KEY='foundry.cash-close.draft.v1';
type Step='count'|'review'|'history'|'detail';

function preferredCurrency():CurrencyCode{
  try{return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith('vi')?'VND':'USD';}
  catch{return 'USD';}
}
function hasChanges(d:CountDraft):boolean{
  return Object.values(d.counts).some(n=>n>0)||Boolean(
    d.drawer.trim()||d.note.trim()||d.otherInput.trim()||d.expectedInput.trim(),
  );
}
function restoreDraft(raw:string):{draft:CountDraft;editingId:string|null}|null{
  const data:unknown=JSON.parse(raw);
  if(!data||typeof data!=='object'||Array.isArray(data))return null;
  const env=data as Record<string,unknown>;
  if(env.version!==1||!env.draft||typeof env.draft!=='object'||Array.isArray(env.draft))return null;
  const obj=env.draft as Record<string,unknown>;
  if(typeof obj.currency!=='string'||!CURRENCIES.includes(obj.currency as CurrencyCode)||
    typeof obj.businessDay!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(obj.businessDay)||
    typeof obj.drawer!=='string'||obj.drawer.length>72||
    typeof obj.note!=='string'||obj.note.length>500||
    typeof obj.otherInput!=='string'||obj.otherInput.length>40||
    typeof obj.expectedInput!=='string'||obj.expectedInput.length>40||
    !obj.counts||typeof obj.counts!=='object'||Array.isArray(obj.counts))return null;
  const counts=obj.counts as Record<string,unknown>;
  const allowed=new Set(denominations(obj.currency as CurrencyCode).map(d=>d.id));
  if(Object.entries(counts).some(([key,value])=>!allowed.has(key)||typeof value!=='number'||
    !Number.isSafeInteger(value)||value<0||value>MAX_QUANTITY))return null;
  const editingId=env.editingId===null?null:
    typeof env.editingId==='string'&&/^[a-zA-Z0-9_-]{1,100}$/.test(env.editingId)?env.editingId:null;
  return {draft:obj as unknown as CountDraft,editingId};
}
function moneyInputHint(code:CurrencyCode):string{
  return code==='VND'?'e.g. 1250000 (whole đồng)':'e.g. 1234.56 (no thousands separators)';
}

export default function CashCloseApp(){
  const c=useColorScheme()==='dark'?NIGHT:DAY;
  const store=useLocalRecords<CloseSession>('cash-close.sessions');
  const [step,setStep]=useState<Step>('count');
  const [draft,setDraft]=useState<CountDraft>(()=>emptyDraft(preferredCurrency()));
  const [editingId,setEditingId]=useState<string|null>(null);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [draftReady,setDraftReady]=useState(false);
  const [draftWritable,setDraftWritable]=useState(true);
  const [draftStatus,setDraftStatus]=useState('Draft stays on this device');
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [backupOpen,setBackupOpen]=useState(false);
  const [backupText,setBackupText]=useState('');
  const [legacy,setLegacy]=useState<CloseSession[]>([]);
  const [legacyError,setLegacyError]=useState<string|null>(null);
  const writes=useRef<Promise<void>>(Promise.resolve());
  const savingRef=useRef(false);

  useEffect(()=>{
    let mounted=true;
    Promise.all([Storage.getItem(DRAFT_KEY),Storage.getItem(LEGACY_STORAGE_KEY)])
      .then(([raw,old])=>{
        if(!mounted)return;
        if(raw){
          try{
            const recovered=restoreDraft(raw);
            if(recovered){
              setDraft(recovered.draft);setEditingId(recovered.editingId);
              setDraftStatus('Recovered unfinished count');
            }else {setDraftWritable(false);setError('The unfinished draft cannot be read. It has been preserved; choose whether to discard it.');}
          }catch{setDraftWritable(false);setError('The unfinished draft could not be parsed. It has not been overwritten.');}
        }
        if(old){
          try{setLegacy(legacySessions(old));}
          catch(failure){setLegacyError('Old prototype data needs manual review: '+errorMessage(failure));}
        }
      }).catch(failure=>{if(mounted){setDraftWritable(false);setError('Could not load draft; it was not overwritten: '+errorMessage(failure));}})
      .finally(()=>{if(mounted)setDraftReady(true);});
    return()=>{mounted=false;};
  },[]);
  useEffect(()=>{
    if(!draftReady||!draftWritable)return;
    const timer=setTimeout(()=>{
      const payload=JSON.stringify({version:1,draft,editingId});
      const next=writes.current.catch(()=>undefined).then(()=>Storage.setItem(DRAFT_KEY,payload));
      writes.current=next;
      void next.then(()=>setDraftStatus('Unfinished count saved locally'))
        .catch(failure=>setError('Could not save draft: '+errorMessage(failure)));
    },350);
    return()=>clearTimeout(timer);
  },[draft,draftReady,draftWritable,editingId]);

  const valid=useMemo(()=>{
    try{return store.records.map(validateSession);}
    catch{return null;}
  },[store.records]);
  const entries=sortedSessions(valid??[]);
  const selected=entries.find(s=>s.id===selectedId)??null;
  const pendingLegacy=legacy.filter(s=>!entries.some(saved=>saved.id===s.id));
  const denoms=denominations(draft.currency);
  const setQuantity=(id:string,n:number)=>setDraft(previous=>({
    ...previous,counts:{...previous.counts,[id]:n},
  }));
  let other=0;
  let totalError:string|null=null;
  try{other=draft.otherInput.trim()?parseMoney(draft.otherInput,draft.currency):0;}
  catch(failure){totalError=errorMessage(failure);}
  let counted=0;
  try{counted=sumCash(draft.currency,draft.counts)+other;}
  catch(failure){totalError=errorMessage(failure);}

  function go(next:Step){
    setStep(next);setError(null);
  }
  function currencyChange(code:CurrencyCode){
    if(code===draft.currency||editingId)return;
    const change=()=>{setDraft(emptyDraft(code,draft.businessDay));setStep('count');setError(null);};
    if(hasChanges(draft)){
      Alert.alert('Switch currency?','This clears the unfinished count. Saved history stays intact.',[
        {text:'Keep this count',style:'cancel'},
        {text:'Clear and switch',style:'destructive',onPress:change},
      ]);
    }else change();
  }
  function startOver(){
    const clear=()=>{
      setEditingId(null);setSelectedId(null);
      setDraft(emptyDraft(draft.currency,dayKey(new Date())));go('count');
    };
    if(hasChanges(draft)){
      Alert.alert('Start a new count?','The unfinished draft will be cleared. Saved records remain intact.',[
        {text:'Keep draft',style:'cancel'},
        {text:'Discard draft',style:'destructive',onPress:clear},
      ]);
    }else clear();
  }
  async function saveCount(){
    if(!draftReady||!draftWritable||busy||savingRef.current||store.loading||!valid)return;
    savingRef.current=true;
    setBusy(true);setError(null);
    try{
      const old=editingId?entries.find(s=>s.id===editingId):null;
      if(editingId&&!old)throw new Error('The record being edited is no longer present');
      const fresh=makeSession(draft,editingId??uniqueId(),old?.createdAt);
      const item:CloseSession=old?{...fresh,source:old.source}:fresh;
      if(editingId)await store.update(item.id,()=>item);
      else await store.add(item);
      setEditingId(null);setSelectedId(item.id);
      setDraft(emptyDraft(draft.currency,dayKey(new Date())));
      setStep('detail');
      await writes.current.catch(()=>undefined);
      await Storage.removeItem(DRAFT_KEY);
    }catch(failure){setError(errorMessage(failure));}
    finally{savingRef.current=false;setBusy(false);}
  }
  function edit(session:CloseSession){
    const change=()=>{
      setDraft(draftFromSession(session));
      setEditingId(session.id);setStep('count');
      };
    if(hasChanges(draft)&&editingId!==session.id){
      Alert.alert('Replace unfinished draft?','Opening this close for editing clears your unfinished count.',[
        {text:'Keep draft',style:'cancel'},{text:'Edit saved close',onPress:change},
      ]);
    }else change();
  }
  function remove(session:CloseSession){
    Alert.alert('Delete saved close?',
      'Delete the '+formatDay(session.businessDay)+' count for '+(session.drawer||'this drawer')+'? This cannot be undone.',[
        {text:'Keep record',style:'cancel'},
        {text:'Delete',style:'destructive',onPress:()=>{
          void store.remove(session.id).then(()=>{setSelectedId(null);setStep('history');})
            .catch(failure=>setError(errorMessage(failure)));
        }},
      ]);
  }
  async function share(extension:'csv'|'json'){
    if(!valid||store.loading)return;
    setBusy(true);setError(null);
    try{
      const content=extension==='csv'?exportCsv(valid):exportBackup(valid);
      await shareDocument('cash-close-'+dayKey(new Date()),extension,content);
    }catch(failure){setError(errorMessage(failure));}
    finally{setBusy(false);}
  }
  function restoreHistory(){
    if(!valid)return;
    let imported:CloseSession[];
    try{imported=importBackup(backupText);}
    catch(failure){setError('Backup rejected: '+errorMessage(failure));return;}
    Alert.alert('Replace saved close history?',
      'Replace all '+valid.length+' saved counts with '+imported.length+' from this backup? Export a copy first.',[
        {text:'Cancel',style:'cancel'},
        {text:'Replace all',style:'destructive',onPress:()=>{
          void store.change(()=>imported).then(()=>{
            setSelectedId(null);setStep('history');setBackupText('');setBackupOpen(false);setError(null);
          }).catch(failure=>setError(errorMessage(failure)));
        }},
      ]);
  }
  function discardUnreadableDraft(){
    Alert.alert('Discard unreadable draft?','Only the unfinished draft will be cleared. Previously saved close records remain untouched.',[
      {text:'Keep stored draft',style:'cancel'},
      {text:'Discard draft',style:'destructive',onPress:()=>{
        void Storage.removeItem(DRAFT_KEY).then(()=>{
          setDraft(emptyDraft(preferredCurrency()));setEditingId(null);
          setDraftWritable(true);setDraftStatus('New draft started');setError(null);
        }).catch(failure=>setError('Draft could not be removed: '+errorMessage(failure)));
      }},
    ]);
  }
  function importOld(){
    if(!valid||pendingLegacy.length===0)return;
    Alert.alert('Import old prototype records?',
      'Import '+pendingLegacy.length+' count(s) as USD. The old app used $100, $50, $20, $10, $5 and $1 quantities without recording a currency. Please verify the amounts. Old data stays intact.',[
        {text:'Cancel',style:'cancel'},
        {text:'Import as USD',onPress:()=>{
          void store.change(current=>appendLegacy(current,pendingLegacy)).then(()=>{
            setLegacy([]);setError(null);setStep('history');
          }).catch(failure=>setError(errorMessage(failure)));
        }},
      ]);
  }

  return <SafeAreaView style={{flex:1,backgroundColor:c.bg}}>
    <View style={{
      ...flexRow,justifyContent:'space-between',gap:12,
      paddingHorizontal:22,paddingTop:12,paddingBottom:13,
      borderBottomWidth:1,borderColor:c.line,backgroundColor:c.bg,
    }}>
      <View style={{flexDirection:'row',gap:12,alignItems:'center',flex:1}}>
        <View style={{width:49,height:49,borderRadius:11,backgroundColor:c.brand,
          justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontFamily:mono,fontSize:18,fontWeight:'900',color:c.onBrand}}>C/</Text>
        </View>
        <View style={{gap:2,flex:1}}>
          <Text style={{color:c.ink,fontSize:22,fontWeight:'900',letterSpacing:-1}}>COUNTER CLOSE</Text>
          <Text style={{color:c.sub,fontSize:11,fontWeight:'800',letterSpacing:1}}>CASH RECONCILIATION / LOCAL</Text>
        </View>
      </View>
    </View>
    <View style={{...flexRow,paddingHorizontal:22,paddingTop:14,gap:10}}>
      {([{id:'count',label:'Count cash',active:step==='count'||step==='review'},
        {id:'history',label:'Close history',active:step==='history'||step==='detail'}] as const).map(tab=>
        <Pressable key={tab.id} accessibilityRole="tab" accessibilityState={{selected:tab.active}}
          onPress={()=>go(tab.id)} style={{flex:1,minHeight:48,backgroundColor:tab.active?c.brand:c.card,
            borderRadius:12,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:tab.active?c.onBrand:c.ink,fontWeight:'800'}}>{tab.label}</Text>
        </Pressable>)}
    </View>
    <ScrollView key={step} keyboardShouldPersistTaps="handled"
      contentContainerStyle={{width:'100%',maxWidth:730,alignSelf:'center',padding:22,paddingBottom:84,gap:19}}>
      {error||store.error?<View style={{backgroundColor:c.card,padding:14,borderWidth:1,borderColor:c.danger,borderRadius:12}}>
        <Text accessibilityRole="alert" style={{color:c.ink,fontSize:15,lineHeight:23}}>{error||store.error}</Text>
      </View>:null}
      {!draftWritable?<Panel c={c}>
        <Text style={{color:c.ink,fontSize:17,fontWeight:'800'}}>Unreadable draft is protected</Text>
        <Text style={{color:c.sub,fontSize:14,lineHeight:22}}>The app will not replace your original draft until you explicitly discard it. Saved history is separate.</Text>
        <Action c={c} kind="danger" onPress={discardUnreadableDraft}>Discard unreadable draft</Action>
      </Panel>:null}
      {!draftReady||store.loading?<Text accessibilityRole="alert" style={{fontSize:15,color:c.sub}}>Opening on-device records…</Text>:null}
      {valid===null&&!store.loading?<Panel c={c}>
        <Text style={{color:c.ink,fontWeight:'900',fontSize:18}}>Saved record format needs attention</Text>
        <Text style={{color:c.sub,lineHeight:23}}>Editing is disabled so incompatible records are not overwritten. Export or inspect local storage with developer support.</Text>
      </Panel>:null}
      {step==='count'?<>
        <View style={{gap:9,paddingVertical:12}}>
          <Label c={c}>{editingId?'Editing saved close':'01 / Count first'}</Label>
          <Text accessibilityRole="header" style={{fontSize:36,lineHeight:43,fontWeight:'900',color:c.ink,letterSpacing:-1.4}}>
            Count what’s there.
          </Text>
          <Text style={{color:c.sub,fontSize:16,lineHeight:25}}>
            Start with physical notes and coins. Enter your POS expectation only after the count—so it can't anchor the result.
          </Text>
          <Text style={{color:c.sub,fontSize:12}}>{draftStatus}</Text>
        </View>
        <View style={{backgroundColor:c.brand,padding:25,borderRadius:16,gap:8}}>
          <Text style={{color:c.onBrand,opacity:0.85,fontSize:12,fontWeight:'800',letterSpacing:1.3}}>CASH COUNTED SO FAR</Text>
          <Text accessibilityLiveRegion="polite" adjustsFontSizeToFit numberOfLines={1}
            style={{fontFamily:mono,fontWeight:'900',color:c.onBrand,fontSize:39,lineHeight:49,letterSpacing:-1.1}}>
            {totalError?'—':formatMoney(counted,draft.currency)}
          </Text>
          <Text style={{fontSize:13,color:c.onBrand,opacity:0.9}}>Only the pieces you've counted.</Text>
        </View>
        {editingId?<View style={{backgroundColor:c.focus,padding:15,borderRadius:12}}>
          <Text style={{color:c.onFocus,fontWeight:'800',fontSize:14}}>Editing a saved record. Currency stays fixed.</Text>
        </View>:null}
        <View style={{gap:12}}>
          <Label c={c}>Currency</Label>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:9}}>
            {CURRENCIES.map(code=><Pressable key={code} accessibilityRole="radio"
              accessibilityState={{selected:draft.currency===code,disabled:!!editingId}}
              onPress={()=>currencyChange(code)} disabled={!!editingId}
              style={{paddingHorizontal:16,minHeight:49,justifyContent:'center',borderWidth:1,
                borderColor:draft.currency===code?c.brand:c.line,borderRadius:10,
                backgroundColor:draft.currency===code?c.focus:c.card}}>
              <Text style={{color:draft.currency===code?c.onFocus:c.ink,fontWeight:'800',fontSize:15}}>{code}</Text>
            </Pressable>)}
          </View>
          <Text style={{color:c.sub,fontSize:13,lineHeight:21}}>
            {profile(draft.currency).title}. These are selected everyday denominations; use “Other cash” for verified pieces not listed.
          </Text>
        </View>
        <Field c={c} label="Drawer or counter (optional)" value={draft.drawer} maxLength={72}
          onChange={drawer=>setDraft(old=>({...old,drawer}))} placeholder="e.g. Front counter"/>
        {(['note','coin'] as const).map(kind=>{
          const list=denoms.filter(d=>d.kind===kind);
          if(list.length===0)return null;
          return <Panel key={kind} c={c}>
            <View style={{...flexRow,justifyContent:'space-between',gap:8}}>
              <View style={{gap:4}}>
                <Label c={c}>{kind==='note'?'Banknotes':'Coins'}</Label>
                <Text style={{fontSize:13,color:c.sub}}>Count each {kind==='note'?'bill':'coin'}</Text>
              </View>
              <Text style={{fontFamily:mono,fontSize:19,fontWeight:'800',color:c.ink}}>
                {formatMoney(sumCash(draft.currency,draft.counts,kind),draft.currency)}
              </Text>
            </View>
            {list.map(item=><DenominationRow key={item.id} c={c} item={item}
              currency={draft.currency} quantity={draft.counts[item.id]??0}
              onChange={n=>setQuantity(item.id,n)}/>)}
          </Panel>;
        })}
        <Action c={c} disabled={!draftReady||!draftWritable||store.loading||valid===null} onPress={()=>go('review')}>Review this count →</Action>
        <Action c={c} kind="outline" onPress={startOver}>Clear and start fresh</Action>
      </>:null}

      {step==='review'?<>
        <View style={{gap:9,paddingVertical:12}}>
          <Label c={c}>02 / Review without guesswork</Label>
          <Text accessibilityRole="header" style={{color:c.ink,fontSize:34,fontWeight:'900',
            letterSpacing:-1,lineHeight:42}}>Does it balance?</Text>
          <Text style={{color:c.sub,fontSize:16,lineHeight:25}}>
            Compare with the POS expected balance—or save without comparison.
          </Text>
        </View>
        <View style={{padding:24,backgroundColor:c.focus,borderRadius:16,gap:8}}>
          <Text style={{color:c.onFocus,fontSize:12,fontWeight:'800',letterSpacing:1.1}}>COUNTED CASH / {draft.currency}</Text>
          <Text accessibilityLiveRegion="polite" numberOfLines={1} adjustsFontSizeToFit
            style={{color:c.onFocus,fontFamily:mono,fontSize:36,fontWeight:'900'}}>
            {totalError?'Check other cash':formatMoney(counted,draft.currency)}
          </Text>
          <Text style={{color:c.onFocus,fontSize:13}}>From the quantities you counted.</Text>
        </View>
        <Panel c={c}>
          <Label c={c}>Additional legal tender</Label>
          <Field c={c} label="Other verified cash (optional)" value={draft.otherInput}
            onChange={otherInput=>setDraft(old=>({...old,otherInput}))}
            keyboardType="decimal-pad" maxLength={32} placeholder={moneyInputHint(draft.currency)}/>
          <Text style={{color:c.sub,fontSize:13,lineHeight:21}}>
            For unusual denominations or counted bundles. Include only cash you physically verified.
          </Text>
        </Panel>
        <Panel c={c}>
          <Label c={c}>Reconciliation / optional</Label>
          <Field c={c} label="Expected cash from POS" value={draft.expectedInput}
            onChange={expectedInput=>setDraft(old=>({...old,expectedInput}))}
            keyboardType="decimal-pad" maxLength={32} placeholder={moneyInputHint(draft.currency)}/>
          <Text style={{color:c.sub,fontSize:13,lineHeight:20}}>
            No thousands separators. Decimal point or comma for USD, SGD and EUR.
          </Text>
          {draft.expectedInput.trim()&&!totalError?(()=>{
            try{
              const expected=parseMoney(draft.expectedInput,draft.currency);
              const difference=counted-expected;
              return <View style={{backgroundColor:c.focus,padding:18,borderRadius:12,gap:7}}>
                <Text style={{color:c.onFocus,fontWeight:'800',fontSize:12,letterSpacing:1.2}}>
                  {difference===0?'BALANCED':difference>0?'OVER':'SHORT'}
                </Text>
                <Text accessibilityLiveRegion="polite" style={{color:c.onFocus,fontFamily:mono,fontSize:30,fontWeight:'900'}}>
                  {formatMoney(difference,draft.currency)}
                </Text>
                <Text style={{color:c.onFocus,fontSize:13}}>Difference = counted cash minus POS expected cash.</Text>
              </View>;
            }catch(failure){return <Text accessibilityRole="alert" style={{color:c.danger}}>{errorMessage(failure)}</Text>;}
          })():null}
          {totalError?<Text accessibilityRole="alert" style={{color:c.danger,fontSize:13}}>{totalError}</Text>:null}
        </Panel>
        <Panel c={c}>
          <DateField p={{canvas:c.bg,surface:c.card,ink:c.ink,muted:c.sub,accent:c.brand,
            onAccent:c.onBrand,tint:c.focus,onTint:c.onFocus,border:c.line}}
            label="Business date" day={draft.businessDay}
            onChange={businessDay=>setDraft(old=>({...old,businessDay}))}/>
          <Field c={c} label="Close note (optional)" value={draft.note} multiline
            maxLength={500} placeholder="Explain a discrepancy or note a handover"
            onChange={note=>setDraft(old=>({...old,note}))}/>
        </Panel>
        <Action c={c} disabled={!draftReady||!draftWritable||busy||store.loading||valid===null}
          onPress={()=>{void saveCount();}}>
          {editingId?'Save corrected close':'Save close on this device'}
        </Action>
        <Action c={c} kind="outline" onPress={()=>go('count')}>← Back to quantities</Action>
        <Text style={{color:c.sub,fontSize:13,lineHeight:22}}>
          The saved record includes the piece breakdown, date, expected amount and optional notes. Nothing is uploaded automatically.
        </Text>
      </>:null}

      {step==='history'?<>
        <View style={{gap:9,paddingVertical:12}}>
          <Label c={c}>Close archive</Label>
          <Text accessibilityRole="header" style={{fontSize:36,fontWeight:'900',lineHeight:44,
            color:c.ink,letterSpacing:-1.2}}>Every close counts.</Text>
          <Text style={{fontSize:16,lineHeight:24,color:c.sub}}>
            A clear local history. Different currencies are always kept separate.
          </Text>
        </View>
        {pendingLegacy.length>0?<View style={{backgroundColor:c.focus,borderRadius:13,padding:16,gap:11}}>
          <Text style={{color:c.onFocus,fontWeight:'900',fontSize:17}}>Old prototype entries found</Text>
          <Text style={{color:c.onFocus,lineHeight:22,fontSize:14}}>
            {pendingLegacy.length} records can be imported as USD. The original records will not be deleted.
          </Text>
          <Action c={c} onPress={importOld}>Review & import old records</Action>
        </View>:null}
        {legacyError?<Text accessibilityRole="alert" style={{color:c.danger,fontSize:14}}>{legacyError}</Text>:null}
        {entries.length===0&&!store.loading?<Panel c={c}>
          <Text style={{color:c.ink,fontWeight:'800',fontSize:20}}>Your first close starts here.</Text>
          <Text style={{color:c.sub,fontSize:15,lineHeight:23}}>No counts are saved yet. Start with one drawer.</Text>
          <Action c={c} onPress={startOver}>Start counting</Action>
        </Panel>:null}
        {entries.map(session=>{
          const status=reconciliation(session);
          return <Pressable key={session.id} accessibilityRole="button"
            accessibilityLabel={'View '+formatDay(session.businessDay)+' '+(session.drawer||'drawer')+' close'}
            onPress={()=>{setSelectedId(session.id);go('detail');}}
            style={({pressed})=>({
              backgroundColor:c.card,borderRadius:12,borderColor:c.line,
              borderWidth:1,padding:19,gap:11,opacity:pressed?0.72:1,
            })}>
            <View style={{...flexRow,justifyContent:'space-between',gap:9}}>
              <Label c={c}>{formatDay(session.businessDay)}</Label>
              <Text style={{color:c.sub,fontWeight:'800',fontSize:12}}>{session.currency}</Text>
            </View>
            <Text style={{color:c.ink,fontSize:19,fontWeight:'800'}}>{session.drawer||'Unlabelled drawer'}</Text>
            <Text style={{color:c.ink,fontSize:27,fontWeight:'900',fontFamily:mono}}>
              {formatMoney(totalMinor(session),session.currency)}
            </Text>
            <View style={{...flexRow,justifyContent:'space-between',gap:12}}>
              <Text style={{color:c.sub,fontWeight:'700'}}>{status.label}</Text>
              <Text style={{color:c.sub,fontFamily:mono}}>
                {status.difference===null?'Not compared':formatMoney(status.difference,session.currency)}
              </Text>
            </View>
          </Pressable>;
        })}
        <Panel c={c}>
          <Text accessibilityRole="header" style={{color:c.ink,fontSize:19,fontWeight:'900'}}>Your records. Your control.</Text>
          <Text style={{color:c.sub,fontSize:14,lineHeight:22}}>
            Export CSV for spreadsheet review or a JSON backup for restoration. You choose where to share the file.
          </Text>
          <Action c={c} kind="outline" disabled={busy||store.loading||valid===null}
            onPress={()=>{void share('csv');}}>Share CSV history</Action>
          <Action c={c} kind="outline" disabled={busy||store.loading||valid===null}
            onPress={()=>{void share('json');}}>Share restorable JSON backup</Action>
          <Action c={c} kind="outline" onPress={()=>setBackupOpen(value=>!value)}>
            {backupOpen?'Hide restore':'Restore from JSON backup'}
          </Action>
          {backupOpen?<View style={{gap:12}}>
            <Text style={{color:c.sub,fontSize:14,lineHeight:21}}>
              Paste a JSON backup from Counter Close. Restoring replaces existing history after confirmation. Export your current records first.
            </Text>
            <TextInput accessibilityLabel="Backup JSON input" multiline textAlignVertical="top"
              value={backupText} maxLength={2_000_000} onChangeText={setBackupText}
              placeholder="Paste complete JSON backup" placeholderTextColor={c.sub}
              style={{minHeight:120,color:c.ink,borderWidth:1,borderColor:c.line,borderRadius:10,
                padding:13,backgroundColor:c.bg,fontFamily:mono,fontSize:13}}/>
            <Action c={c} kind="danger" disabled={busy||!backupText.trim()||valid===null}
              onPress={restoreHistory}>Validate and replace history</Action>
          </View>:null}
        </Panel>
      </>:null}

      {step==='detail'?selected?<><View style={{gap:10}}>
        <Label c={c}>Saved / reconciliation</Label>
        <Text accessibilityRole="header" style={{color:c.ink,fontSize:32,fontWeight:'900',lineHeight:39}}>Close recorded.</Text>
      </View>
        <Receipt c={c} session={selected}/>
        <Action c={c} onPress={()=>edit(selected)}>Edit saved close</Action>
        <Action c={c} kind="outline" onPress={()=>go('history')}>All saved closes</Action>
        <Action c={c} kind="danger" onPress={()=>remove(selected)}>Delete this record</Action>
      </>:<View style={{gap:11}}>
        <Text style={{color:c.ink,fontSize:19,fontWeight:'800'}}>The selected record is no longer available.</Text>
        <Action c={c} onPress={()=>go('history')}>Go to history</Action>
      </View>:null}

      <View style={{paddingTop:16,borderTopColor:c.line,borderTopWidth:1,gap:8}}>
        <Text style={{color:c.sub,fontSize:12,lineHeight:20}}>
          OFFLINE BY DEFAULT. No account, tracking, automatic backups, payroll logic, payment processing or sync.
          This is a counting aid, not a certified point-of-sale or audit system.
        </Text>
        <Text style={{color:c.sub,fontSize:12,lineHeight:20}}>
          Denominations are everyday presets; other legal tender may need the optional “Other cash” field.
          Always verify the physical cash and POS expectation yourself.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
