import React from 'react';
import PaymentTerminal from '../components/PaymentTerminal';

export default function PaymentDemoPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen overflow-auto bg-[#f7f4ef] px-3 py-3 text-[#161b26] sm:px-4 sm:py-4 lg:h-[100dvh] lg:overflow-hidden"
      style={{ fontFamily: '"Avenir Next", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif' }}
    >
      <div className="flex min-h-[calc(100vh-1.5rem)] items-center justify-center lg:h-full lg:min-h-0">
        <PaymentTerminal />
      </div>
    </main>
  );
}
