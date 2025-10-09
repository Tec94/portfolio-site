import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function Experience3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    // Disable 3D rendering if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported');
        return;
      }
    } catch (e) {
      console.warn('WebGL check failed:', e);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 50, 500);
    sceneRef.current = scene;

    // Camera
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    if (width === 0 || height === 0) return;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 50, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
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
      console.error('Failed to create renderer:', error);
      return;
    }

    // Floating data cubes - reduced on mobile
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cubeCount = isMobile ? 8 : 20;

    for (let i = 0; i < cubeCount; i++) {
      try {
        const edges = new THREE.EdgesGeometry(cubeGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.6,
          linewidth: 1,
        });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);

        wireframe.position.set(
          (Math.random() - 0.5) * 400,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        );

        wireframe.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        wireframe.userData.rotationSpeed = {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        };

        scene.add(wireframe);
        cubes.push(wireframe);
      } catch (error) {
        console.error('Failed to create cube:', error);
      }
    }

    // Data stream lines - reduced on mobile
    const streams: THREE.Line[] = [];
    const streamCount = isMobile ? 10 : 30;
    for (let i = 0; i < streamCount; i++) {
      try {
        const points = [];
        const startX = (Math.random() - 0.5) * 300;
        const startZ = (Math.random() - 0.5) * 300;

        for (let j = 0; j < 50; j++) {
          points.push(new THREE.Vector3(
            startX + (Math.random() - 0.5) * 20,
            j * 5 - 100,
            startZ + (Math.random() - 0.5) * 20
          ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.3,
        });

        const line = new THREE.Line(geometry, material);
        line.userData.offset = Math.random() * 100;
        scene.add(line);
        streams.push(line);
      } catch (error) {
        console.error('Failed to create stream:', error);
      }
    }

    // Hexagonal grid floor
    const hexagons: THREE.Line[] = [];
    const createHexagon = (x: number, z: number, radius: number) => {
      try {
        const points = [];
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          points.push(new THREE.Vector3(
            x + Math.cos(angle) * radius,
            0,
            z + Math.sin(angle) * radius
          ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.2,
        });

        const hexagon = new THREE.Line(geometry, material);
        return hexagon;
      } catch (error) {
        console.error('Failed to create hexagon:', error);
        return null;
      }
    };

    const hexRadius = 20;
    const hexSpacing = hexRadius * 1.73; // sqrt(3) for hex grid
    // Simplified grid on mobile: ~5x8 vs 11x17 grid
    const rowRange = isMobile ? { min: -2, max: 2 } : { min: -5, max: 5 };
    const colRange = isMobile ? { min: -4, max: 4 } : { min: -8, max: 8 };

    for (let row = rowRange.min; row <= rowRange.max; row++) {
      for (let col = colRange.min; col <= colRange.max; col++) {
        const x = col * hexSpacing + (row % 2) * (hexSpacing / 2);
        const z = row * (hexRadius * 1.5);
        const hex = createHexagon(x, z, hexRadius);
        if (hex) {
          hex.position.y = -50;
          scene.add(hex);
          hexagons.push(hex);
        }
      }
    }

    // Orbiting data nodes - reduced on mobile
    const nodes: THREE.Mesh[] = [];
    const nodeCount = isMobile ? 4 : 10;
    for (let i = 0; i < nodeCount; i++) {
      try {
        const geometry = new THREE.SphereGeometry(3, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.8,
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.userData.angle = Math.random() * Math.PI * 2;
        sphere.userData.radius = 100 + Math.random() * 50;
        sphere.userData.speed = 0.0005 + Math.random() * 0.001;
        sphere.userData.height = (Math.random() - 0.5) * 100;

        scene.add(sphere);
        nodes.push(sphere);
      } catch (error) {
        console.error('Failed to create node:', error);
      }
    }

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.3);
    scene.add(ambientLight);

    // Point lights
    const pointLight1 = new THREE.PointLight(0x00ff00, 1, 200);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ff00, 0.5, 200);
    pointLight2.position.set(-50, 30, -50);
    scene.add(pointLight2);

    // Animation
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      try {
        const time = Date.now() * 0.001;

        // Rotate cubes
        cubes.forEach((cube) => {
          if (cube.userData.rotationSpeed) {
            cube.rotation.x += cube.userData.rotationSpeed.x;
            cube.rotation.y += cube.userData.rotationSpeed.y;
            cube.rotation.z += cube.userData.rotationSpeed.z;
          }
        });

        // Animate data streams
        streams.forEach((stream, idx) => {
          const material = stream.material as THREE.LineBasicMaterial;
          const offset = stream.userData.offset || 0;
          material.opacity = 0.2 + Math.sin(time + idx + offset) * 0.1;
        });

        // Pulse hexagons
        hexagons.forEach((hex, idx) => {
          const material = hex.material as THREE.LineBasicMaterial;
          material.opacity = 0.1 + Math.sin(time * 2 + idx * 0.1) * 0.1;
        });

        // Orbit nodes
        nodes.forEach((node) => {
          node.userData.angle += node.userData.speed;
          node.position.x = Math.cos(node.userData.angle) * node.userData.radius;
          node.position.z = Math.sin(node.userData.angle) * node.userData.radius;
          node.position.y = node.userData.height + Math.sin(time + node.userData.angle) * 10;
        });

        // Gentle camera movement
        cameraRef.current.position.x = Math.sin(time * 0.1) * 20;
        cameraRef.current.position.y = 50 + Math.cos(time * 0.15) * 10;
        cameraRef.current.lookAt(0, 0, 0);

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationIdRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error:', error);
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      }
    };

    animate();

    // Resize handler
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
      }

      // Dispose geometries and materials
      [...cubes, ...streams, ...hexagons, ...nodes].forEach((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0) {
          sceneRef.current.remove(sceneRef.current.children[0]);
        }
      }

      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
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
