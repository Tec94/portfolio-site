import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function InteractiveBackground3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch (e) {
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

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 150;
    cameraRef.current = camera;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to create renderer:', error);
      return;
    }

    // Create interconnected network structure
    const nodes: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    const nodeCount = isMobile ? 30 : 80;
    const nodePositions: THREE.Vector3[] = [];

    // Create nodes (spheres)
    const nodeGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    for (let i = 0; i < nodeCount; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.3, 1, 0.5 + Math.random() * 0.3),
        transparent: true,
        opacity: 0.8,
      });

      const node = new THREE.Mesh(nodeGeometry, material);

      // Distribute nodes in a sphere
      const radius = 80 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      node.position.x = radius * Math.sin(phi) * Math.cos(theta);
      node.position.y = radius * Math.sin(phi) * Math.sin(theta);
      node.position.z = radius * Math.cos(phi);

      nodePositions.push(node.position.clone());

      // Store velocity for animation
      node.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );

      scene.add(node);
      nodes.push(node);
    }

    // Create connections between nearby nodes
    const maxConnectionDistance = 40;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < maxConnectionDistance) {
          const points = [nodes[i].position, nodes[j].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.15,
            linewidth: 1,
          });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
          connections.push(line);
        }
      }
    }

    // DNA Helix structure
    const helixPoints: THREE.Mesh[] = [];
    const helixRadius = 30;
    const helixHeight = 200;
    const helixTurns = 4;
    const pointsPerTurn = isMobile ? 15 : 30;

    for (let i = 0; i < helixTurns * pointsPerTurn; i++) {
      const t = i / (helixTurns * pointsPerTurn);
      const angle = t * Math.PI * 2 * helixTurns;
      const y = (t - 0.5) * helixHeight;

      // First strand
      const sphere1 = new THREE.Mesh(
        new THREE.SphereGeometry(2, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.6,
        })
      );
      sphere1.position.set(
        Math.cos(angle) * helixRadius,
        y,
        Math.sin(angle) * helixRadius
      );
      scene.add(sphere1);
      helixPoints.push(sphere1);

      // Second strand (opposite)
      const sphere2 = new THREE.Mesh(
        new THREE.SphereGeometry(2, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.6,
        })
      );
      sphere2.position.set(
        Math.cos(angle + Math.PI) * helixRadius,
        y,
        Math.sin(angle + Math.PI) * helixRadius
      );
      scene.add(sphere2);
      helixPoints.push(sphere2);

      // Connect strands
      if (i % 3 === 0) {
        const points = [sphere1.position, sphere2.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          transparent: true,
          opacity: 0.3,
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    }

    // Geometric lattice
    const latticeSize = 60;
    const latticeSpacing = 20;
    const lattice: THREE.Line[] = [];

    for (let x = -latticeSize; x <= latticeSize; x += latticeSpacing) {
      for (let y = -latticeSize; y <= latticeSize; y += latticeSpacing) {
        for (let z = -latticeSize; z <= latticeSize; z += latticeSpacing) {
          // Create edges of cube
          if (Math.abs(x) === latticeSize || Math.abs(y) === latticeSize || Math.abs(z) === latticeSize) {
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.LineBasicMaterial({
              color: 0x00ff00,
              transparent: true,
              opacity: 0.1,
            });

            // Small cube at each lattice point
            const size = 2;
            const vertices = new Float32Array([
              x-size, y-size, z-size,  x+size, y-size, z-size,
              x+size, y-size, z-size,  x+size, y+size, z-size,
              x+size, y+size, z-size,  x-size, y+size, z-size,
              x-size, y+size, z-size,  x-size, y-size, z-size,
            ]);

            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const line = new THREE.LineSegments(geometry, material);
            scene.add(line);
            lattice.push(line);
          }
        }
      }
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00ff00, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff00, 1, 200);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.5, 200);
    pointLight2.position.set(-50, -50, -50);
    scene.add(pointLight2);

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Scroll handler
    const handleScroll = () => {
      scrollProgressRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      try {
        const time = Date.now() * 0.0005;

        // Rotate camera based on mouse (smooth follow)
        const targetRotationY = mouseRef.current.x * 0.5;
        const targetRotationX = mouseRef.current.y * 0.3;
        cameraRef.current.rotation.y += (targetRotationY - cameraRef.current.rotation.y) * 0.05;
        cameraRef.current.rotation.x += (targetRotationX - cameraRef.current.rotation.x) * 0.05;

        // Move camera based on scroll
        cameraRef.current.position.y = scrollProgressRef.current * 100 - 50;
        cameraRef.current.position.z = 150 - scrollProgressRef.current * 50;

        // Animate network nodes
        nodes.forEach((node, i) => {
          const velocity = node.userData.velocity as THREE.Vector3;
          node.position.add(velocity);

          // Keep nodes within bounds
          const maxDist = 120;
          if (node.position.length() > maxDist) {
            node.position.normalize().multiplyScalar(maxDist);
            velocity.multiplyScalar(-1);
          }

          // Pulse animation
          const scale = 1 + Math.sin(time * 2 + i) * 0.2;
          node.scale.setScalar(scale);

          // Color shift
          const hue = (0.3 + Math.sin(time + i * 0.1) * 0.1) % 1;
          (node.material as THREE.MeshBasicMaterial).color.setHSL(hue, 1, 0.5);
        });

        // Update connections
        connections.forEach((connection, i) => {
          const positions = connection.geometry.attributes.position.array as Float32Array;
          const idx1 = Math.floor(i / (nodes.length - 1));
          const idx2 = i % (nodes.length - 1) + idx1 + 1;

          if (nodes[idx1] && nodes[idx2]) {
            positions[0] = nodes[idx1].position.x;
            positions[1] = nodes[idx1].position.y;
            positions[2] = nodes[idx1].position.z;
            positions[3] = nodes[idx2].position.x;
            positions[4] = nodes[idx2].position.y;
            positions[5] = nodes[idx2].position.z;
            connection.geometry.attributes.position.needsUpdate = true;

            // Update opacity based on distance
            const distance = nodes[idx1].position.distanceTo(nodes[idx2].position);
            (connection.material as THREE.LineBasicMaterial).opacity =
              Math.max(0, 0.3 - (distance / maxConnectionDistance) * 0.3);
          }
        });

        // Rotate helix
        helixPoints.forEach((point, i) => {
          point.rotation.y = time * 0.5;
          const scale = 1 + Math.sin(time * 3 + i * 0.2) * 0.15;
          point.scale.setScalar(scale);
        });

        // Pulse lattice
        lattice.forEach((line, i) => {
          (line.material as THREE.LineBasicMaterial).opacity =
            0.05 + Math.sin(time + i * 0.05) * 0.05;
        });

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

      const newWidth = containerRef.current.clientWidth || window.innerWidth;
      const newHeight = containerRef.current.clientHeight || window.innerHeight;
      if (newWidth === 0 || newHeight === 0) return;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);

      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Dispose geometries and materials
      [...nodes, ...helixPoints].forEach(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      [...connections, ...lattice].forEach(obj => {
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

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-40"
      style={{ pointerEvents: 'none' }}
    />
  );
}
