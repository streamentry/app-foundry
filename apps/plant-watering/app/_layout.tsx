import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useProductTheme } from '@foundry/mobile-kit';

export default function RootLayout() {
  const { p } = useProductTheme('plant-watering');
  const dark = useColorScheme() === 'dark';
  return <>
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: p.canvas } }} />
    <StatusBar style={dark ? 'light' : 'dark'} />
  </>;
}
