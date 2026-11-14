import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
export default function Layout() {
  const dark=useColorScheme()==='dark';
  return <><Stack screenOptions={{headerShown:false}}/><StatusBar style={dark?'light':'dark'}/></>;
}
