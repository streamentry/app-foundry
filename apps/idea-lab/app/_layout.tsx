import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
export default function RootLayout() {
  const dark=useColorScheme()==='dark';
  return <>
    <Stack screenOptions={{
      headerShown:true,headerShadowVisible:false,
      headerStyle:{backgroundColor:dark?'#111B24':'#F3F6FB'},
      headerTintColor:dark?'#F5F8FC':'#16273E',
      headerBackTitle:'All ideas',
    }}>
      <Stack.Screen name="index" options={{title:'Idea Lab'}}/>
      <Stack.Screen name="idea/[slug]" options={{title:'Test workflow'}}/>
    </Stack>
    <StatusBar style={dark?'light':'dark'}/>
  </>;
}
