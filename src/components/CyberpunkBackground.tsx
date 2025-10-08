import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CyberpunkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Ensure canvas has valid dimensions before proceeding
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = window.innerWidth || 800;
      canvas.height = window.innerHeight || 600;
    }

    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.z -= 1;

        if (this.y > canvas.height) this.y = 0;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.z < 0) this.z = 1000;
      }

      draw() {
        const scale = (1000 - this.z) / 1000;
        const x = this.x;
        const y = this.y;
        const size = this.size * scale;

        // Validate values before drawing
        if (isNaN(x) || isNaN(y) || isNaN(size) || size <= 0) return;

        ctx.fillStyle = `rgba(0, 255, 0, ${this.opacity * scale})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle());
    }

    // Floating lines
    class FloatingLine {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 100 + 50;
        this.speed = Math.random() * 0.3 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height + 50) {
          this.y = -50;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        // Validate values before drawing
        const x2 = this.x + Math.cos(this.angle) * this.length;
        const y2 = this.y + Math.sin(this.angle) * this.length;

        if (isNaN(this.x) || isNaN(this.y) || isNaN(x2) || isNaN(y2)) return;

        ctx.strokeStyle = `rgba(0, 255, 0, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    const lines: FloatingLine[] = [];
    for (let i = 0; i < 30; i++) {
      lines.push(new FloatingLine());
    }

    // Grid lines
    const drawGrid = (time: number) => {
      const gridSize = 50;
      const offset = (time * 0.5) % gridSize;

      // Validate canvas dimensions
      if (canvas.width === 0 || canvas.height === 0 || isNaN(offset)) return;

      ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = -offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Animation loop
    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid(time);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Update and draw lines
      lines.forEach(line => {
        line.update();
        line.draw();
      });

      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Canvas particle system */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* CSS Animated geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute border-2 border-green-500/20"
          style={{
            width: `${100 + i * 40}px`,
            height: `${100 + i * 40}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
            transform: 'rotate(45deg)',
          }}
          animate={{
            rotate: [45, 405],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Pulsing circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full border border-green-400/30"
          style={{
            width: '20px',
            height: '20px',
            left: `${20 + i * 25}%`,
            top: `${30 + i * 15}%`,
          }}
          animate={{
            scale: [1, 3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Glowing gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-500/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-500/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-500/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-500/30" />
    </div>
  );
}
