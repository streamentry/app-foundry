import type { ReactNode } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { displayDuration, type Balance } from './domain.ts';

export interface Colors {
  canvas:string;surface:string;ink:string;muted:string;border:string;
  primary:string;onPrimary:string;soft:string;onSoft:string;
  danger:string;warning:string;onWarning:string;
}
export const DAY:Colors={
  canvas:'#F7F6F0',surface:'#FFFFFF',ink:'#1A2835',muted:'#506273',border:'#CAD2D7',
  primary:'#32349C',onPrimary:'#FFFFFF',soft:'#E9EAFB',onSoft:'#202779',
  danger:'#992E2C',warning:'#F4E3CA',onWarning:'#50351D',
};
export const NIGHT:Colors={
  canvas:'#101923',surface:'#1C2936',ink:'#F3F5FB',muted:'#C3D1E0',border:'#4D6071',
  primary:'#BDB7FF',onPrimary:'#191632',soft:'#30345A',onSoft:'#F5F3FF',
  danger:'#FFB7AB',warning:'#584631',onWarning:'#FFF0D8',
};
export const numberFace=Platform.OS==='ios'?'Menlo':'monospace';
export function Micro({c,children}:{c:Colors;children:string}){
  return <Text style={{color:c.muted,fontSize:11,fontWeight:'800',letterSpacing:1.1}}>{children.toUpperCase()}</Text>;
}
export function Button({c,label,onPress,variant='primary',disabled=false}:{
  c:Colors;label:string;onPress:()=>void;variant?:'primary'|'secondary'|'destructive';disabled?:boolean;
}){
  const primary=variant==='primary';
  const fg=primary?c.onPrimary:variant==='destructive'?c.danger:c.primary;
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{disabled}} onPress={onPress} disabled={disabled}
    style={({pressed})=>({
      minHeight:52,paddingHorizontal:16,paddingVertical:13,
      borderRadius:12,borderWidth:1,borderColor:primary?c.primary:c.border,
      backgroundColor:primary?c.primary:c.surface,alignItems:'center',justifyContent:'center',
      opacity:disabled?0.4:pressed?0.78:1,
    })}>
    <Text style={{color:fg,fontSize:15,fontWeight:'800',textAlign:'center'}}>{label}</Text>
  </Pressable>;
}
export function Card({children,c,accent=false}:{children:ReactNode;c:Colors;accent?:boolean}){
  return <View style={{backgroundColor:accent?c.soft:c.surface,borderRadius:17,borderWidth:1,
    borderColor:c.border,padding:19,gap:15}}>{children}</View>;
}
export function Field({c,label,value,onChange,placeholder='',keyboard='default',
  maxLength=120,multiline=false}:{
  c:Colors;label:string;value:string;onChange:(value:string)=>void;placeholder?:string;
  keyboard?:'default'|'number-pad';maxLength?:number;multiline?:boolean;
}){
  return <View style={{gap:8}}>
    <Text style={{color:c.ink,fontSize:15,fontWeight:'700'}}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChange}
      placeholder={placeholder} placeholderTextColor={c.muted} keyboardType={keyboard}
      maxLength={maxLength} multiline={multiline} textAlignVertical={multiline?'top':'center'}
      style={{backgroundColor:c.surface,color:c.ink,borderColor:c.border,borderWidth:1,
        borderRadius:11,fontSize:17,minHeight:multiline?93:52,paddingVertical:12,paddingHorizontal:13}}/>
  </View>;
}
export function Rule({c}:{c:Colors}){
  return <View style={{height:1,backgroundColor:c.border}}/>;
}
export function MiniPair({c,label,value,strong=false}:{
  c:Colors;label:string;value:string;strong?:boolean;
}){
  return <View style={{flexDirection:'row',justifyContent:'space-between',gap:12,alignItems:'center'}}>
    <Text style={{flex:1,color:strong?c.ink:c.muted,fontWeight:strong?'800':'600',fontSize:14}}>{label}</Text>
    <Text style={{fontFamily:numberFace,color:c.ink,fontWeight:'800',fontSize:strong?19:15}}>{value}</Text>
  </View>;
}
export function BalanceStrip({c,balance,large=false}:{
  c:Colors;balance:Balance;large?:boolean;
}){
  const negative=balance.remaining<0;
  return <View style={{backgroundColor:c.soft,borderRadius:14,padding:large?23:17,gap:12}}>
    <Micro c={c}>{negative?'OVER THE PREPAID ALLOWANCE':'HOURS STILL AVAILABLE'}</Micro>
    <Text accessibilityLiveRegion="polite" numberOfLines={1} adjustsFontSizeToFit
      style={{fontFamily:numberFace,color:c.onSoft,fontSize:large?38:28,fontWeight:'900',letterSpacing:-1}}>
      {displayDuration(negative?balance.overage:balance.remaining)}
    </Text>
    <View accessible accessibilityLabel={balance.percent+' percent of available time logged'}
      style={{height:8,backgroundColor:c.border,borderRadius:5,overflow:'hidden'}}>
      <View style={{backgroundColor:c.primary,height:'100%',width:balance.percent+'%'}}/>
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-between',gap:7}}>
      <Text style={{fontSize:12,color:c.onSoft,fontWeight:'700'}}>Used {displayDuration(balance.delivered)}</Text>
      <Text style={{fontSize:12,color:c.onSoft,fontWeight:'700'}}>Allowed {displayDuration(balance.available)}</Text>
    </View>
    {negative?<Text style={{fontSize:13,color:c.onSoft,lineHeight:20}}>
      This record exceeds the entered allowance. Confirm extra work with your client before billing.
    </Text>:null}
  </View>;
}
export function DurationInput({c,hours,minutes,onHours,onMinutes}:{
  c:Colors;hours:string;minutes:string;
  onHours:(text:string)=>void;onMinutes:(text:string)=>void;
}){
  return <View style={{flexDirection:'row',gap:10}}>
    <View style={{flex:1}}>
      <Field c={c} label="Hours" value={hours} onChange={onHours} keyboard="number-pad"
        placeholder="0" maxLength={4}/>
    </View>
    <View style={{flex:1}}>
      <Field c={c} label="Minutes" value={minutes} onChange={onMinutes} keyboard="number-pad"
        placeholder="0–59" maxLength={2}/>
    </View>
  </View>;
}
export function AlertLine({c,message}:{c:Colors;message:string}){
  return <View style={{borderColor:c.danger,borderWidth:1,borderRadius:11,padding:13,backgroundColor:c.surface}}>
    <Text accessibilityRole="alert" style={{color:c.ink,fontSize:14,lineHeight:22}}>{message}</Text>
  </View>;
}
