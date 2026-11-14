import { useColorScheme } from 'react-native';
import { getBrandTheme, type Palette } from '@foundry/design-system';

const signal = getBrandTheme('shift-calendar');
if (!signal) throw new Error('Missing Signal design tokens');

/** Local design contract. Never re-skin other consumer apps using this layout. */
export function useSignalTheme(): { p: Palette; dark: boolean } {
  const dark = useColorScheme() === 'dark';
  return { p: signal.colors[dark ? 'dark' : 'light'], dark };
}
