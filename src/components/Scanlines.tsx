import React from 'react';

export default function Scanlines() {
  return (
    <>
      {/* CRT Scanlines Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* Screen flicker overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5 animate-pulse"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 255, 0, 0.1) 100%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.9), inset 0 0 100px rgba(0, 0, 0, 0.6)',
        }}
      />
    </>
  );
}
