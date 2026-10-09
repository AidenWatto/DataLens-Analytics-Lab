import { useMemo } from 'react';
import { useApp } from './AppContext';
import { getColors } from '@/lib/theme';
import type { ThemeColors } from '@/lib/types';

export function useColors(): ThemeColors {
  const { theme } = useApp();
  return useMemo(() => getColors(theme), [theme]);
}
