import type { ReactNode } from 'react';
import { PortfolioSoundProvider } from './SoundProvider';
import { PortfolioThemeProvider } from './ThemeProvider';

export function PortfolioProviders({ children }: { children: ReactNode }) {
  return (
    <PortfolioThemeProvider>
      <PortfolioSoundProvider>
        {children}
      </PortfolioSoundProvider>
    </PortfolioThemeProvider>
  );
}
