import React, { useEffect, useRef } from 'react';

export default function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const codeSnippets = [
      'const x = () => {}',
      'function init()',
      'npm install',
      'git commit',
      'import React',
      'export default',
      'async/await',
      'fetch(url)',
      'return data',
      '{ status: 200 }',
      'localhost:3000',
      'console.log()',
      'try { } catch',
      'if (condition)',
      'map(item =>',
      'filter(x =>',
      '.then(res =>',
      'onClick={',
      'useState(0)',
      'useEffect()',
    ];

    const fontSize = 14;
    const columns = Math.floor(canvas.width / 80);
    const drops: number[] = [];
    const snippets: string[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
      snippets[i] = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    }

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = snippets[i];
        const x = i * 80;
        const y = drops[i] * fontSize;

        // Gradient effect
        const gradient = ctx.createLinearGradient(x, y - 50, x, y + 50);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0.2)');

        ctx.fillStyle = gradient;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
          snippets[i] = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
}
