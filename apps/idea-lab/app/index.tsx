import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ideaSpecs } from '@foundry/idea-engine';
import type { IdeaSpec } from '@foundry/idea-engine';

const categories=['All categories',...new Set(ideaSpecs.map(x=>x.category))];
export default function IdeaLabHome() {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All categories');
  const dark=useColorScheme()==='dark';
  const p=dark?
    {canvas:'#111B24',surface:'#1D2B37',text:'#F5F8FC',muted:'#C9D3DA',accent:'#A8C9FF',line:'#3E5261'}:
    {canvas:'#F3F6FB',surface:'#FFFFFF',text:'#16273E',muted:'#425A71',accent:'#1A4C7B',line:'#CAD7E4'};
  const filtered=useMemo(()=>{
    const term=query.trim().toLocaleLowerCase();
    return ideaSpecs.filter(idea=>(category==='All categories'||idea.category===category)&&(
      !term||[idea.name,idea.job,idea.slug,idea.icp,idea.query].some(value=>value.toLocaleLowerCase().includes(term))
    )).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  },[query,category]);

  function render({item}:{item:IdeaSpec}){
    return <Pressable accessibilityRole="button" accessibilityLabel={'Open prototype '+item.name}
      onPress={()=>router.push({pathname:'/idea/[slug]',params:{slug:item.slug}})}
      style={({pressed})=>({padding:18,backgroundColor:p.surface,borderColor:p.line,borderWidth:1,borderRadius:15,
        gap:10,opacity:pressed?0.7:1})}>
      <View style={{flexDirection:'row',justifyContent:'space-between',gap:10,alignItems:'flex-start'}}>
        <Text style={{flex:1,fontSize:19,lineHeight:26,fontWeight:'800',color:p.text}}>{item.name}</Text>
        <Text style={{color:p.accent,fontSize:17,fontWeight:'800'}}>#{item.id}</Text>
      </View>
      <Text style={{color:p.muted,fontSize:14,lineHeight:20}}>{item.job}</Text>
      <Text style={{color:p.muted,fontSize:12}}>{item.icp} · {item.flow} · {item.layout}</Text>
      <Text style={{color:p.accent,fontSize:13,fontWeight:'800'}}>Open runnable prototype ›</Text>
    </Pressable>;
  }

  return <SafeAreaView edges={['bottom']} style={{flex:1,backgroundColor:p.canvas}}>
    <FlatList
      data={filtered} keyExtractor={item=>item.slug}
      renderItem={render}
      keyboardShouldPersistTaps="handled"
      ItemSeparatorComponent={()=> <View style={{height:12}}/>}
      ListHeaderComponent={<View style={{paddingBottom:16,gap:16}}>
        <Text style={{fontSize:12,fontWeight:'800',color:p.accent,letterSpacing:1.3}}>PRIVATE PRODUCT EXPERIMENTS</Text>
        <Text accessibilityRole="header" style={{fontSize:33,lineHeight:42,fontWeight:'800',color:p.text}}>100 jobs. 100 prototypes.</Text>
        <Text style={{fontSize:16,lineHeight:25,color:p.muted}}>
          Test the actual workflow before creating 100 consumer brands. All interactions are local to this Idea Lab installation.
        </Text>
        <TextInput
          accessibilityLabel="Search 100 app ideas"
          value={query} onChangeText={setQuery} placeholder="Search users, tasks, keywords…"
          placeholderTextColor={p.muted}
          style={{padding:15,minHeight:52,backgroundColor:p.surface,borderColor:p.line,borderWidth:1,
            borderRadius:12,color:p.text,fontSize:16}}
        />
        <FlatList horizontal data={categories} keyExtractor={value=>value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap:8,paddingVertical:6}}
          renderItem={({item})=><Pressable accessibilityRole="radio" accessibilityState={{selected:category===item}}
            onPress={()=>setCategory(item)}
            style={{minHeight:46,justifyContent:'center',paddingHorizontal:14,borderRadius:30,
              backgroundColor:category===item?p.accent:p.surface,borderColor:p.line,borderWidth:1}}>
            <Text style={{color:category===item?(dark?'#111B24':'#FFFFFF'):p.text,fontWeight:'700',fontSize:13}}>{item}</Text>
          </Pressable>}
        />
        <Text style={{fontSize:13,fontWeight:'700',color:p.muted}}>{filtered.length} concepts match · scores are unverified priors</Text>
      </View>}
      ListEmptyComponent={<Text style={{fontSize:16,color:p.muted}}>No concepts match. Try another search.</Text>}
      contentContainerStyle={{padding:20,paddingBottom:60,width:'100%',maxWidth:740,alignSelf:'center'}}
    />
  </SafeAreaView>;
}
