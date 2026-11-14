import { useColorScheme } from 'react-native';
import { getBrandTheme, type Palette } from '@foundry/design-system';

function requireSignal() {
  const found = getBrandTheme('shift-calendar');
  if (!found) throw new Error('Missing Signal design tokens');
  return found;
}
const signal = requireSignal();

/** Local design contract. Never re-skin other consumer apps using this layout. */
export function useSignalTheme(): { p: Palette; dark: boolean } {
  const dark = useColorScheme() === 'dark';
  return { p: signal.colors[dark ? 'dark' : 'light'], dark };
}
