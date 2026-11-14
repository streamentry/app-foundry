import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/** Native navigation chrome is shared; content identity belongs to each product. */
export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShadowVisible: false, headerTintColor: '#17212B', headerStyle: { backgroundColor: '#F7F8FA' } }}>
        <Stack.Screen name="index" options={{ title: 'Foundry · Design Lab' }} />
        <Stack.Screen name="preview/[id]" options={{ title: 'Identity preview' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
