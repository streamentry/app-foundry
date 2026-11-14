import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCount, increment } from '@foundry/core';

const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#17212B',
  muted: '#596775',
  accent: '#235ECA',
  border: '#DCE3E9',
};

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>APP FOUNDRY</Text>
        <Text style={styles.title} accessibilityRole="header">Small apps, useful lives.</Text>
        <Text style={styles.lead}>A minimal working canvas. Replace this screen with one clear user job, then validate it with real users.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Sample interaction</Text>
          <Text style={styles.count} accessibilityLiveRegion="polite">{formatCount(count)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase sample count"
            accessibilityHint="Adds one to the displayed count"
            onPress={() => setCount((current) => increment(current))}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Add one</Text>
          </Pressable>
        </View>
        <Text style={styles.footnote}>Offline by default · No account · No tracking</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 18, maxWidth: 640, width: '100%', alignSelf: 'center' },
  eyebrow: { color: colors.accent, fontWeight: '700', letterSpacing: 1.7, fontSize: 12 },
  title: { fontSize: 36, lineHeight: 43, fontWeight: '700', color: colors.text },
  lead: { fontSize: 17, lineHeight: 26, color: colors.muted },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 24, gap: 16 },
  label: { fontSize: 16, color: colors.muted },
  count: { fontSize: 44, fontWeight: '700', color: colors.text },
  button: { minHeight: 48, backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.82 },
  buttonText: { fontSize: 17, fontWeight: '700', color: colors.surface },
  footnote: { fontSize: 13, color: colors.muted, textAlign: 'center' },
});
