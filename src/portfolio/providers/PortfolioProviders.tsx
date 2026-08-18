import type { ReactNode } from 'react';
import { PortfolioCursorProvider } from './CursorProvider';
import { PortfolioSoundProvider } from './SoundProvider';
import { PortfolioThemeProvider } from './ThemeProvider';

export function PortfolioProviders({ children }: { children: ReactNode }) {
  return (
    <PortfolioThemeProvider>
      <PortfolioSoundProvider>
        <PortfolioCursorProvider>{children}</PortfolioCursorProvider>
      </PortfolioSoundProvider>
    </PortfolioThemeProvider>
  );
}

