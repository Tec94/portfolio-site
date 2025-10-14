import React from 'react';
import { StatsigProvider } from '@statsig/react-bindings';

interface StatsigWrapperProps {
  children: React.ReactNode;
}

export const StatsigWrapper: React.FC<StatsigWrapperProps> = ({ children }) => {
  const clientKey = import.meta.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY;

  if (!clientKey) {
    console.error('Statsig client key not found');
    return <>{children}</>;
  }

  return (
    <StatsigProvider
      sdkKey={clientKey}
      user={{
        userID: 'anonymous-' + Math.random().toString(36).substring(7),
      }}
      options={{
        environment: { tier: 'production' },
      }}
    >
      {children}
    </StatsigProvider>
  );
};
