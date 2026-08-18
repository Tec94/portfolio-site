import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-shell-theme';
const themeModes: ThemeMode[] = ['system', 'light', 'dark'];

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && themeModes.includes(value as ThemeMode);
}

export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return systemPrefersDark ? 'dark' : 'light';
  return mode;
}

function readStoredTheme(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const resolvedTheme = resolveTheme(mode, systemPrefersDark);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // The theme remains controllable in-session when storage is unavailable.
    }
  }, []);

  const cycleMode = useCallback(() => {
    setMode(themeModes[(themeModes.indexOf(mode) + 1) % themeModes.length]);
  }, [mode, setMode]);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    systemTheme.addEventListener('change', handleChange);
    return () => systemTheme.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const previousMode = root.dataset.portfolioThemeMode;
    const previousResolved = root.dataset.portfolioResolvedTheme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previousThemeColor = themeColor?.content;

    root.dataset.portfolioThemeMode = mode;
    root.dataset.portfolioResolvedTheme = resolvedTheme;
    themeColor?.setAttribute('content', resolvedTheme === 'dark' ? '#211e1b' : '#f2eee5');

    return () => {
      if (previousMode) root.dataset.portfolioThemeMode = previousMode;
      else delete root.dataset.portfolioThemeMode;
      if (previousResolved) root.dataset.portfolioResolvedTheme = previousResolved;
      else delete root.dataset.portfolioResolvedTheme;
      if (themeColor && previousThemeColor) themeColor.content = previousThemeColor;
    };
  }, [mode, resolvedTheme]);

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode, cycleMode }),
    [cycleMode, mode, resolvedTheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function usePortfolioTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('usePortfolioTheme must be used inside PortfolioThemeProvider.');
  return context;
}

