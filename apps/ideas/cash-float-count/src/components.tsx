import type { ReactNode } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import {
  denominations, denominationLabel, formatMoney, reconciliation, sumCash, totalMinor,
  type CurrencyCode, type Denomination, type CloseSession,
} from './domain.ts';

export type Colors={
  bg:string;card:string;receipt:string;ink:string;sub:string;brand:string;onBrand:string;
  focus:string;onFocus:string;line:string;danger:string;onDanger:string;
};
export const DAY:Colors={
  bg:'#F4F3EB',card:'#FFFFFF',receipt:'#FFFEF8',ink:'#1B3028',sub:'#495F53',
  brand:'#234D36',onBrand:'#FFFFFF',focus:'#D9EDB4',onFocus:'#213B2B',
  line:'#C8D4C7',danger:'#9E3028',onDanger:'#FFFFFF',
};
export const NIGHT:Colors={
  bg:'#111B17',card:'#1D2D25',receipt:'#20332A',ink:'#F5F4E9',sub:'#C4D2C5',
  brand:'#DAF4A0',onBrand:'#1A2D22',focus:'#344832',onFocus:'#F1FFE2',
  line:'#496150',danger:'#F5A79E',onDanger:'#30201F',
};
export const mono=Platform.OS==='ios'?'Menlo':'monospace';
export const flexRow={flexDirection:'row' as const,alignItems:'center' as const};
export const errorMessage=(error:unknown):string=>error instanceof Error?error.message:'Could not complete this action';
export function formatDay(day:string):string{
  const [year,month,date]=day.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined,{day:'numeric',month:'short',year:'numeric'})
    .format(new Date(year!,month!-1,date!,12));
}
export function Label({children,c}:{children:string;c:Colors}){
  return <Text style={{color:c.sub,fontSize:12,letterSpacing:1.15,fontWeight:'800'}}>{children.toUpperCase()}</Text>;
}
export function Action({c,children,onPress,kind='primary',disabled=false}:{
  c:Colors;children:string;onPress:()=>void;kind?:'primary'|'outline'|'danger';disabled?:boolean;
}){
  const bg=kind==='primary'?c.brand:kind==='danger'?c.danger:c.card;
  const foreground=kind==='primary'?c.onBrand:kind==='danger'?c.onDanger:c.ink;
  return <Pressable accessibilityRole="button" accessibilityLabel={children}
    accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>({
      minHeight:54,paddingVertical:13,paddingHorizontal:18,borderRadius:12,
      borderWidth:1,borderColor:kind==='outline'?c.line:bg,backgroundColor:bg,
      alignItems:'center',justifyContent:'center',opacity:disabled?0.48:pressed?0.78:1,
    })}>
    <Text style={{fontSize:16,fontWeight:'800',color:foreground,textAlign:'center'}}>{children}</Text>
  </Pressable>;
}
export function Panel({children,c}:{children:ReactNode;c:Colors}){
  return <View style={{backgroundColor:c.card,borderWidth:1,borderColor:c.line,borderRadius:16,padding:18,gap:14}}>{children}</View>;
}
export function Field({c,label,value,onChange,placeholder,keyboardType='default',multiline=false,maxLength=100}:{
  c:Colors;label:string;value:string;onChange:(text:string)=>void;placeholder:string;
  keyboardType?:'default'|'decimal-pad'|'number-pad';multiline?:boolean;maxLength?:number;
}){
  return <View style={{gap:9}}>
    <Text style={{fontSize:15,fontWeight:'700',color:c.ink}}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChange}
      placeholder={placeholder} placeholderTextColor={c.sub} keyboardType={keyboardType}
      multiline={multiline} maxLength={maxLength} textAlignVertical={multiline?'top':'center'}
      style={{
        color:c.ink,backgroundColor:c.card,borderRadius:10,borderColor:c.line,borderWidth:1,
        minHeight:multiline?100:52,paddingVertical:12,paddingHorizontal:14,fontSize:17,
      }}/>
  </View>;
}
export function Divider({c}:{c:Colors}){
  return <View style={{borderTopWidth:1,borderStyle:'dashed',borderColor:c.line}}/>;
}
export function MoneyLine({c,label,value,currency,strong=false}:{
  c:Colors;label:string;value:number;currency:CurrencyCode;strong?:boolean;
}){
  return <View style={{...flexRow,justifyContent:'space-between',gap:12}}>
    <Text style={{color:strong?c.ink:c.sub,fontSize:strong?17:15,fontWeight:strong?'800':'600',flex:1}}>{label}</Text>
    <Text style={{fontFamily:mono,color:c.ink,fontSize:strong?21:16,fontWeight:strong?'800':'700'}}>{formatMoney(value,currency)}</Text>
  </View>;
}
export function DenominationRow({c,item,currency,quantity,onChange}:{
  c:Colors;item:Denomination;currency:CurrencyCode;quantity:number;onChange:(quantity:number)=>void;
}){
  const face=denominationLabel(currency,item);
  const set=(n:number)=>onChange(Math.max(0,Math.min(99999,n)));
  return <View style={{...flexRow,gap:10,paddingVertical:12,borderBottomWidth:1,borderColor:c.line}}>
    <View style={{flex:1,gap:5,minWidth:76}}>
      <Text style={{color:c.ink,fontWeight:'800',fontSize:18}}>{face}</Text>
      <Text style={{color:c.sub,fontSize:12,fontFamily:mono}}>{quantity?formatMoney(item.minor*quantity,currency):'—'}</Text>
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={'Remove one '+face}
      accessibilityState={{disabled:quantity===0}} disabled={quantity===0}
      onPress={()=>set(quantity-1)}
      style={({pressed})=>({
        height:48,width:48,borderRadius:10,backgroundColor:c.bg,borderColor:c.line,borderWidth:1,
        justifyContent:'center',alignItems:'center',opacity:quantity===0?0.45:pressed?0.65:1,
      })}>
      <Text style={{color:c.ink,fontSize:26}}>−</Text>
    </Pressable>
    <TextInput accessibilityLabel={face+' quantity'} accessibilityHint="Enter number of pieces"
      keyboardType="number-pad" selectTextOnFocus maxLength={5} value={String(quantity)}
      onChangeText={raw=>{if(raw===''||/^\d{1,5}$/.test(raw))set(raw?Number(raw):0);}}
      style={{
        fontFamily:mono,minWidth:64,height:48,paddingHorizontal:6,fontSize:20,fontWeight:'800',
        borderRadius:9,borderWidth:1,borderColor:c.line,textAlign:'center',color:c.ink,backgroundColor:c.card,
      }}/>
    <Pressable accessibilityRole="button" accessibilityLabel={'Add one '+face}
      accessibilityState={{disabled:quantity===99999}} disabled={quantity===99999}
      onPress={()=>set(quantity+1)}
      style={({pressed})=>({
        height:48,width:48,borderRadius:10,backgroundColor:c.brand,
        justifyContent:'center',alignItems:'center',opacity:pressed?0.7:1,
      })}>
      <Text style={{color:c.onBrand,fontSize:25}}>+</Text>
    </Pressable>
  </View>;
}
export function Receipt({c,session,showDetails=true}:{
  c:Colors;session:CloseSession;showDetails?:boolean;
}){
  const status=reconciliation(session);
  const notes=sumCash(session.currency,session.counts,'note');
  const coins=sumCash(session.currency,session.counts,'coin');
  return <View style={{backgroundColor:c.receipt,borderWidth:1,borderColor:c.line,
    borderRadius:4,padding:22,gap:15}}>
    <Label c={c}>CLOSE RECORD / {session.businessDay}</Label>
    <Text accessibilityRole="header" style={{fontFamily:mono,fontWeight:'800',fontSize:25,color:c.ink}}>
      {session.drawer||'Unlabelled till'}
    </Text>
    <Text style={{fontSize:13,color:c.sub}}>{new Date(session.createdAt).toLocaleString()} · {session.currency}</Text>
    <Divider c={c}/>
    <MoneyLine c={c} label="Banknotes" value={notes} currency={session.currency}/>
    {denominations(session.currency).some(d=>d.kind==='coin')?<MoneyLine c={c} label="Coins" value={coins} currency={session.currency}/>:null}
    {session.otherMinor>0?<MoneyLine c={c} label="Other counted cash" value={session.otherMinor} currency={session.currency}/>:null}
    <Divider c={c}/>
    <MoneyLine c={c} label="Counted cash" value={totalMinor(session)} currency={session.currency} strong/>
    {session.expectedMinor!==null?<MoneyLine c={c} label="Expected from POS" value={session.expectedMinor} currency={session.currency}/>:null}
    <View style={{padding:16,backgroundColor:c.focus,borderRadius:9,gap:6}}>
      <Text style={{fontSize:12,fontWeight:'800',color:c.onFocus,letterSpacing:1.1}}>{status.label.toUpperCase()}</Text>
      <Text style={{fontFamily:mono,color:c.onFocus,fontSize:27,fontWeight:'800'}}>
        {status.difference===null?'Not compared':formatMoney(status.difference,session.currency)}
      </Text>
      <Text style={{fontSize:13,lineHeight:19,color:c.onFocus}}>
        {status.difference===null?'Saved without a POS expectation.':
          status.difference===0?'Cash agrees with the amount you entered.':
          status.difference>0?'You counted more than the expected cash.':'You counted less than the expected cash.'}
      </Text>
    </View>
    {showDetails?<><Divider c={c}/><Label c={c}>Piece breakdown</Label>
      {denominations(session.currency).filter(d=>(session.counts[d.id]??0)>0).map(d=>
        <View key={d.id} style={{...flexRow,justifyContent:'space-between',gap:9}}>
          <Text style={{fontFamily:mono,fontSize:14,color:c.ink}}>{denominationLabel(session.currency,d)} × {session.counts[d.id]}</Text>
          <Text style={{fontFamily:mono,fontSize:14,color:c.ink}}>{formatMoney(d.minor*(session.counts[d.id]??0),session.currency)}</Text>
        </View>)}
      {Object.values(session.counts).every(v=>v===0)?<Text style={{color:c.sub}}>No physical pieces entered.</Text>:null}
      {session.note?<><Divider c={c}/><Label c={c}>Notes</Label>
        <Text style={{fontSize:15,lineHeight:24,color:c.ink}}>{session.note}</Text></>:null}
    </>:null}
    {session.source==='legacy-import'?<Text style={{color:c.sub,fontSize:13}}>
      Imported from an old prototype; USD assumption needs verification.
    </Text>:null}
    <Divider c={c}/>
    <Text style={{textAlign:'center',fontFamily:mono,fontSize:12,color:c.sub}}>
      LOCAL RECORD • NOT A POS CERTIFICATE
    </Text>
  </View>;
}
