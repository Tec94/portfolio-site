import React from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function Scanlines() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* CRT Scanlines Effect - reduced opacity on mobile */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 ${isMobile ? 'opacity-5' : 'opacity-10'}`}
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Screen flicker overlay - disabled on mobile */}
      {!isMobile && (
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-5 animate-pulse"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 255, 0, 0.1) 100%)',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </>
  );
}
