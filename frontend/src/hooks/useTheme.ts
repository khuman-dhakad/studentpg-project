import { useTheme as useThemeContext } from '@/context/ThemeProvider';

/**
 * Proxied theme hook matching custom workspace parameters.
 */
export function useTheme() {
  return useThemeContext();
}