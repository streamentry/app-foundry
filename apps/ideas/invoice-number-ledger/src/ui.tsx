import type { ReactNode } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import type { Reference, ReferenceStatus } from './domain.ts';
export interface Palette{
  bg:string;card:string;sheet:string;ink:string;sub:string;rule:string;
  accent:string;onAccent:string;soft:string;onSoft:string;danger:string;
}
export const LIGHT:Palette={
  bg:'#FAF6EF',card:'#FFFFFF',sheet:'#FFFDF9',ink:'#272522',sub:'#63594E',
  rule:'#D9CEC2',accent:'#973C28',onAccent:'#FFFFFF',soft:'#F6E6CC',
  onSoft:'#50351E',danger:'#91382D',
};
export const DARK:Palette={
  bg:'#181713',card:'#28241E',sheet:'#2D2921',ink:'#FFF7ED',sub:'#D2C4B5',
  rule:'#645548',accent:'#F3BA8A',onAccent:'#302019',soft:'#45372B',
  onSoft:'#FFEDD9',danger:'#FFB9AC',
};
export const mono=Platform.OS==='ios'?'Menlo':'monospace';
export const row={flexDirection:'row' as const,alignItems:'center' as const};
export function Eyebrow({children,p}:{children:string;p:Palette}){
  return <Text style={{color:p.sub,fontSize:11,letterSpacing:1.3,fontWeight:'900'}}>
    {children.toUpperCase()}
  </Text>;
}
export function Panel({children,p,receipt=false}:{
  children:ReactNode;p:Palette;receipt?:boolean;
}){
  return <View style={{
    backgroundColor:receipt?p.sheet:p.card,borderColor:p.rule,borderWidth:1,
    borderRadius:receipt?4:16,padding:19,gap:14,
  }}>{children}</View>;
}
export function Button({p,label,onPress,kind='primary',disabled=false}:{
  p:Palette;label:string;onPress:()=>void;kind?:'primary'|'outline'|'danger';
  disabled?:boolean;
}){
  const main=kind==='primary',fg=main?p.onAccent:kind==='danger'?p.danger:p.ink;
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{disabled}} disabled={disabled} onPress={onPress}
    style={({pressed})=>({
      backgroundColor:main?p.accent:p.card,borderColor:main?p.accent:p.rule,
      borderWidth:1,borderRadius:11,minHeight:53,paddingHorizontal:15,
      paddingVertical:13,justifyContent:'center',alignItems:'center',
      opacity:disabled?.4:pressed?.76:1,
    })}>
    <Text style={{color:fg,fontWeight:'900',fontSize:15,textAlign:'center'}}>{label}</Text>
  </Pressable>;
}
export function Field({p,label,value,onChange,placeholder='',keyboard='default',
  multiline=false,maxLength=96}:{
  p:Palette;label:string;value:string;onChange:(s:string)=>void;
  placeholder?:string;keyboard?:'number-pad'|'default';multiline?:boolean;maxLength?:number;
}){
  return <View style={{gap:8}}>
    <Text style={{color:p.ink,fontWeight:'700',fontSize:15}}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChange}
      placeholder={placeholder} placeholderTextColor={p.sub}
      keyboardType={keyboard} multiline={multiline} maxLength={maxLength}
      textAlignVertical={multiline?'top':'center'}
      style={{
        borderColor:p.rule,borderWidth:1,borderRadius:9,paddingHorizontal:13,
        paddingVertical:12,minHeight:multiline?95:53,backgroundColor:p.card,
        color:p.ink,fontSize:17,
      }}/>
  </View>;
}
export function Rule({p}:{p:Palette}){
  return <View style={{borderTopWidth:1,borderColor:p.rule,borderStyle:'dashed'}}/>;
}
export function Pair({p,label,value,emphasis=false}:{
  p:Palette;label:string;value:string;emphasis?:boolean;
}){
  return <View style={{...row,justifyContent:'space-between',gap:12}}>
    <Text style={{color:p.sub,fontSize:14,flex:1,fontWeight:'700'}}>{label}</Text>
    <Text style={{color:p.ink,fontFamily:mono,fontWeight:'900',fontSize:emphasis?20:15}}>{value}</Text>
  </View>;
}
export function Status({p,status}:{p:Palette;status:ReferenceStatus}){
  return <View style={{
    paddingHorizontal:10,paddingVertical:7,
    borderWidth:1,borderColor:status==='void'?p.danger:p.rule,
    backgroundColor:status==='reserved'?p.soft:p.card,borderRadius:6,
  }}>
    <Text style={{fontSize:11,fontWeight:'900',letterSpacing:0.8,
      color:status==='void'?p.danger:status==='reserved'?p.onSoft:p.ink}}>
      {status.toUpperCase()}
    </Text>
  </View>;
}
export function ReferenceRow({p,ref,onPress}:{
  p:Palette;ref:Reference;onPress:()=>void;
}){
  return <Pressable accessibilityRole="button"
    accessibilityLabel={'Open invoice reference '+ref.formatted+' '+ref.status}
    onPress={onPress} style={({pressed})=>({opacity:pressed?.7:1})}>
    <Panel p={p}>
      <View style={{...row,justifyContent:'space-between',gap:9}}>
        <Text style={{color:p.ink,fontSize:22,fontWeight:'900',
          fontFamily:mono,flex:1}} numberOfLines={1} adjustsFontSizeToFit>
          {ref.formatted}
        </Text>
        <Status p={p} status={ref.status}/>
      </View>
      <Text style={{color:p.sub,fontSize:13}}>
        {ref.client||'No client label'} · {ref.lastDay}
      </Text>
      <Text style={{color:p.accent,fontWeight:'800',fontSize:13}}>
        {ref.events.length} recorded event{ref.events.length===1?'':'s'} · See history ›
      </Text>
    </Panel>
  </Pressable>;
}
export function ErrorBanner({p,text}:{p:Palette;text:string}){
  return <View style={{borderColor:p.danger,borderWidth:1,borderRadius:10,
    padding:15,backgroundColor:p.card}}>
    <Text accessibilityRole="alert" style={{color:p.ink,fontSize:14,lineHeight:22}}>{text}</Text>
  </View>;
}
