import type { ThemeColors } from './types';

export const lightColors: ThemeColors = {
  bg: '#f8f7f4',
  surface: '#ffffff',
  surface2: '#f1efea',
  border: '#e2ddd4',
  text: '#1a1a1a',
  textMuted: '#6b6760',
  primary: '#0d7c66',
  chartColors: ['#0d7c66', '#c2410c', '#1e3a5f', '#b45309', '#4d7c0f', '#9333ea', '#be185d', '#0e7490'],
};

export const darkColors: ThemeColors = {
  bg: '#111110',
  surface: '#1a1a18',
  surface2: '#242420',
  border: '#383834',
  text: '#e8e6e1',
  textMuted: '#9a968e',
  primary: '#34d3a8',
  chartColors: ['#34d3a8', '#f97316', '#60a5fa', '#fbbf24', '#84cc16', '#c084fc', '#f472b6', '#22d3ee'],
};

export function getColors(theme: 'light' | 'dark'): ThemeColors {
  return theme === 'dark' ? darkColors : lightColors;
}
