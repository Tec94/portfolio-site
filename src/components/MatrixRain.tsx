import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters - mix of katakana, latin letters, and numbers
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    // Larger font size on mobile = fewer columns = better performance
    const fontSize = isMobile ? 16 : 14;
    const columns = canvas.width / fontSize;

    // Array to store the y-position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start at random heights
    }

    // Drawing function
    function draw() {
      if (!ctx || !canvas) return;

      // Semi-transparent black to create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = '#0F0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient effect - brighter at the bottom
        const brightness = Math.min(1, (drops[i] % 20) / 20);
        ctx.fillStyle = `rgba(0, 255, 0, ${brightness})`;

        ctx.fillText(text, x, y);

        // Reset drop to top randomly after it crosses screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    // Animation loop - slower frame rate on mobile for better performance
    const frameInterval = isMobile ? 50 : 33; // ~20fps mobile, ~30fps desktop
    const interval = setInterval(draw, frameInterval);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-30 ${isMobile ? 'opacity-15' : 'opacity-20'} dark:opacity-10`}
      style={{ background: 'transparent' }}
    />
  );
}
