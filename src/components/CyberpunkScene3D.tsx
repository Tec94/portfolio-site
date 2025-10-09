import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function CyberpunkScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<THREE.Points[]>([]);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    // Disable 3D rendering if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, falling back to CSS animations');
        return;
      }
    } catch (e) {
      console.warn('WebGL check failed:', e);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 1000);
    sceneRef.current = scene;

    // Camera setup with validation
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    if (width === 0 || height === 0) {
      console.warn('Invalid container dimensions');
      return;
    }

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 300;
    cameraRef.current = camera;

    // Renderer setup with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      // Lower pixel ratio on mobile for better performance
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      return;
    }

    // Create particle systems
    const particleSystems: THREE.Points[] = [];

    // Main particle field - stars
    const createParticleField = (count: number, size: number, color: number, spread: number) => {
      try {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
          // Random position in sphere
          positions[i] = (Math.random() - 0.5) * spread;
          positions[i + 1] = (Math.random() - 0.5) * spread;
          positions[i + 2] = (Math.random() - 0.5) * spread;

          // Velocity for particle movement
          velocities[i] = (Math.random() - 0.5) * 0.5;
          velocities[i + 1] = (Math.random() - 0.5) * 0.5;
          velocities[i + 2] = (Math.random() - 0.5) * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
          size,
          color,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;

        return particles;
      } catch (error) {
        console.error('Failed to create particle field:', error);
        return null;
      }
    };

    // Create multiple particle layers with reduced counts on mobile
    const mainParticles = createParticleField(isMobile ? 500 : 2000, 3, 0x00ff00, 1000);
    if (mainParticles) {
      scene.add(mainParticles);
      particleSystems.push(mainParticles);
    }

    const smallParticles = createParticleField(isMobile ? 300 : 1000, 2, 0x00ff88, 800);
    if (smallParticles) {
      scene.add(smallParticles);
      particleSystems.push(smallParticles);
    }

    const glowParticles = createParticleField(isMobile ? 150 : 500, 6, 0x00ff00, 1200);
    if (glowParticles) {
      scene.add(glowParticles);
      particleSystems.push(glowParticles);
    }

    particlesRef.current = particleSystems;

    // Create tunnel rings
    const createTunnelRing = (radius: number, z: number, segments: number = 64) => {
      try {
        const geometry = new THREE.RingGeometry(radius, radius + 2, segments);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.position.z = z;
        return ring;
      } catch (error) {
        console.error('Failed to create tunnel ring:', error);
        return null;
      }
    };

    // Add tunnel rings - reduced on mobile
    const rings: THREE.Mesh[] = [];
    const ringCount = isMobile ? 5 : 15;
    for (let i = 0; i < ringCount; i++) {
      const ring = createTunnelRing(100 + i * 30, -i * 80);
      if (ring) {
        scene.add(ring);
        rings.push(ring);
      }
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.5);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      try {
        // Animate particles
        particleSystems.forEach((particleSystem, index) => {
          if (!particleSystem.geometry.attributes.position) return;

          const positions = particleSystem.geometry.attributes.position.array as Float32Array;
          const velocities = particleSystem.userData.velocities as Float32Array;

          if (!positions || !velocities) return;

          for (let i = 0; i < positions.length; i += 3) {
            // Update positions
            positions[i] += velocities[i] * 0.1;
            positions[i + 1] += velocities[i + 1] * 0.1;
            positions[i + 2] += velocities[i + 2];

            // Reset particles that go too far
            if (positions[i + 2] > 500) {
              positions[i + 2] = -500;
              positions[i] = (Math.random() - 0.5) * 1000;
              positions[i + 1] = (Math.random() - 0.5) * 1000;
            }
          }

          particleSystem.geometry.attributes.position.needsUpdate = true;
          particleSystem.rotation.z += 0.0001 * (index + 1);
        });

        // Animate tunnel rings
        rings.forEach((ring, i) => {
          ring.position.z += 2;
          ring.rotation.z += 0.01;

          // Reset rings that go too far
          if (ring.position.z > 500) {
            ring.position.z = -900;
          }

          // Pulsing opacity
          const material = ring.material as THREE.MeshBasicMaterial;
          material.opacity = 0.4 + Math.sin(Date.now() * 0.001 + i) * 0.2;
        });

        // Rotate camera slightly for depth effect
        cameraRef.current.rotation.z = Math.sin(Date.now() * 0.0001) * 0.05;

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationIdRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error:', error);
        // Stop animation on error
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      try {
        const newWidth = containerRef.current.clientWidth || window.innerWidth;
        const newHeight = containerRef.current.clientHeight || window.innerHeight;

        if (newWidth === 0 || newHeight === 0) return;

        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      } catch (error) {
        console.error('Resize error:', error);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      // Dispose of geometries and materials
      particleSystems.forEach((particles) => {
        if (particles.geometry) particles.geometry.dispose();
        if (particles.material) {
          if (Array.isArray(particles.material)) {
            particles.material.forEach(m => m.dispose());
          } else {
            particles.material.dispose();
          }
        }
      });

      rings.forEach((ring) => {
        if (ring.geometry) ring.geometry.dispose();
        if (ring.material) {
          if (Array.isArray(ring.material)) {
            ring.material.forEach(m => m.dispose());
          } else {
            ring.material.dispose();
          }
        }
      });

      // Clear scene
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(sceneRef.current.children[0]);
        }
      }

      // Remove renderer
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      particlesRef.current = [];
    };
  }, [isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
