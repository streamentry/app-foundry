import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSignalTheme } from '../src/ui/theme';

export default function RootLayout() {
  const { p } = useSignalTheme();
  const dark = useColorScheme() === 'dark';
  return (
    <>
      <Stack screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: p.canvas },
        headerTintColor: p.ink,
        headerTitleStyle: { fontWeight: '700' },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="edit" options={{ title: 'Edit shift', presentation: 'modal' }} />
        <Stack.Screen name="rotation" options={{ title: 'Fill a rotation' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </>
  );
}
