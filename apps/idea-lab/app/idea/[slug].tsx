import { useLocalSearchParams } from 'expo-router';
import { IdeaApp } from '@foundry/idea-engine';

export default function IdeaLabDetail() {
  const {slug}=useLocalSearchParams<{slug:string}>();
  return <IdeaApp slug={typeof slug==='string'?slug:''}/>;
}
