import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BrandHeading, DateField, ErrorLine, Field, Screen, Tap, dayKey, niceDay, uniqueId, useLocalRecords, useProductTheme } from '@foundry/mobile-kit';
import { daysLeft, estimatedExpiry, makeWarranty, orderedWarranties, type Warranty } from '../src/domain';

export default function WarrantyScreen() {
  const {theme,p}=useProductTheme('warranty-tracker');
  const store=useLocalRecords<Warranty>('archive.warranties');
  const today=dayKey(new Date());
  const items=orderedWarranties(store.records);
  const next=items.find((w)=>daysLeft(w,today)>=0);
  const [product,setProduct]=useState('');
  const [merchant,setMerchant]=useState('');
  const [purchased,setPurchased]=useState(today);
  const [months,setMonths]=useState('12');
  const [editing,setEditing]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  async function save(){
    try{
      const item=makeWarranty(editing??uniqueId(),product,purchased,Number(months),merchant);
      if(editing) await store.update(editing,()=>item); else await store.add(item);
      setEditing(null);setProduct('');setMerchant('');setPurchased(today);setMonths('12');setError(null);
    }catch(failure){setError(failure instanceof Error?failure.message:'Could not save warranty.');}
  }
  function remove(item:Warranty){
    Alert.alert('Remove warranty?',item.product+' will be removed from the archive.',[
      {text:'Keep',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{void store.remove(item.id).catch(() => undefined);}}
    ]);
  }
  return <Screen p={p} maxWidth={630} inset={22}>
    <BrandHeading p={p} theme={theme} subtitle="Keep the dates and proof of purchase close."/>
    <View style={{padding:23,backgroundColor:p.surface,borderColor:p.accent,borderWidth:1.5,borderStyle:'dashed',borderRadius:5,gap:13}}>
      <Text style={{fontSize:12,letterSpacing:1.4,fontWeight:'800',color:p.accent}}>THE LITTLE ARCHIVE / UPCOMING EXPIRY</Text>
      <Text style={{fontSize:51,fontWeight:'700',fontFamily:'serif',color:p.ink}}>{next?daysLeft(next,today)+' days':'—'}</Text>
      <Text style={{color:p.ink,fontSize:19,fontWeight:'700'}}>{next?next.product:'Nothing in your archive yet'}</Text>
      <View style={{height:1,backgroundColor:p.border}}/>
      <Text style={{color:p.muted,fontSize:13}}>{next?'Estimated expiry · '+niceDay(estimatedExpiry(next)):'Add an item and its coverage term below.'}</Text>
    </View>
    <View style={{gap:14}}>
      <Text accessibilityRole="header" style={{fontSize:22,fontFamily:'serif',fontWeight:'700',color:p.ink}}>Your documents · {items.length}</Text>
      {items.length===0?<Text style={{color:p.muted,lineHeight:22}}>A record begins with a product and its purchase date.</Text>:null}
      {items.map((item,i)=>{
        const days=daysLeft(item,today);
        return <View key={item.id} style={{backgroundColor:p.surface,borderBottomWidth:1,borderColor:p.border,padding:18,gap:10}}>
          <View style={{flexDirection:'row',alignItems:'flex-start',gap:12}}>
            <Text style={{fontFamily:'serif',fontSize:24,color:p.accent}}>{String(i+1).padStart(2,'0')}</Text>
            <View style={{flex:1,gap:5}}>
              <Text style={{color:p.ink,fontSize:19,fontWeight:'700'}}>{item.product}</Text>
              <Text style={{color:p.muted,fontSize:14}}>Purchased {niceDay(item.purchasedOn)} {item.merchant?'· '+item.merchant:''}</Text>
            </View>
          </View>
          <View style={{backgroundColor:p.tint,padding:12,borderRadius:5}}>
            <Text style={{color:p.onTint,fontWeight:'800',fontSize:14}}>
              {days<0?'Expired '+Math.abs(days)+' days ago':days===0?'Estimated expiry today':'About '+days+' days of coverage remaining'}
            </Text>
            <Text style={{color:p.onTint,fontSize:12}}>Through {niceDay(estimatedExpiry(item))} · {item.termMonths} months</Text>
          </View>
          <View style={{flexDirection:'row',gap:22}}>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>{setEditing(item.id);setProduct(item.product);setMerchant(item.merchant);setPurchased(item.purchasedOn);setMonths(String(item.termMonths));}}>
              <Text style={{color:p.accent,fontWeight:'700'}}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={{minHeight:44,justifyContent:'center'}} onPress={()=>remove(item)}>
              <Text style={{color:p.muted}}>Remove</Text>
            </Pressable>
          </View>
        </View>;
      })}
    </View>
    <View style={{gap:14,paddingTop:20,borderTopColor:p.border,borderTopWidth:1}}>
      <Text accessibilityRole="header" style={{fontSize:23,fontFamily:'serif',fontWeight:'700',color:p.ink}}>{editing?'Correct a record':'File a new warranty'}</Text>
      <Field p={p} label="Product name" value={product} onChange={setProduct} placeholder="Laptop, kettle, headphones…" maxLength={80}/>
      <Field p={p} label="Store or seller (optional)" value={merchant} onChange={setMerchant} placeholder="Where you bought it" maxLength={80}/>
      <DateField p={p} label="Purchase date" day={purchased} onChange={setPurchased}/>
      <Field p={p} label="Warranty term (months)" value={months} onChange={setMonths} keyboardType="numeric" maxLength={3}/>
      <ErrorLine p={p} error={error??store.error}/>
      <Tap p={p} label={editing?'Save corrections':'Add to archive'} onPress={()=>{void save();}} disabled={store.loading}/>
      {editing?<Tap p={p} label="Cancel changes" kind="quiet" onPress={()=>{setEditing(null);setProduct('');setMerchant('');setMonths('12');}}/>:null}
    </View>
    <Text style={{color:p.muted,fontSize:12,lineHeight:20}}>Expiry is an estimate calculated from purchase date plus months. Actual legal coverage depends on the warranty terms and jurisdiction. Receipts, camera scanning and alerts are not included in this MVP. Private on this device.</Text>
  </Screen>;
}
