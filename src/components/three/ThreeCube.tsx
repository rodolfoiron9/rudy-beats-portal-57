import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { AudioAnalyzer } from './AudioAnalyzer';

interface ThreeCubeProps {
  images: {
    front: string;
    back: string;
    right: string;
    left: string;
    top: string;
    bottom: string;
  };
  audioElement?: HTMLAudioElement | null;
}

export const ThreeCube = ({ images, audioElement }: ThreeCubeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cubeRef = useRef<THREE.Mesh>();
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const analyzerRef = useRef<AudioAnalyzer>();
  const textureLoaderRef = useRef(new THREE.TextureLoader());
  const frameIdRef = useRef<number>();

  // Memoize materials to prevent unnecessary texture reloads
  const materials = useMemo(() => 
    Object.values(images).map(url => 
      new THREE.MeshPhongMaterial({
        map: textureLoaderRef.current.load(url),
        transparent: true,
        opacity: 0.9
      })
    ),
    [images]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
    containerRef.current.appendChild(renderer.domElement);

    // Lighting with optimized shadow settings
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create cube with optimized geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    geometry.computeBoundingSphere(); // Precompute for better culling
    
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 5;

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    cubeRef.current = cube;

    // Audio analyzer setup
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }
    
    if (audioElement && analyzerRef.current) {
      analyzerRef.current.connectAudio(audioElement);
    }

    // Optimized animation loop with RAF cleanup
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (!isDraggingRef.current && cubeRef.current) {
        cubeRef.current.rotation.y += 0.002;
      }

      if (analyzerRef.current && cubeRef.current) {
        const { bass, kick, snare } = analyzerRef.current.getFrequencyData();
        
        const bassScale = 1 + (bass / 512) * 0.2;
        cubeRef.current.scale.setScalar(bassScale);
        cubeRef.current.rotation.x += (kick / 512) * 0.01;
        cubeRef.current.position.y = (snare / 512) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Optimized resize handler with debounce
    let resizeTimeout: number;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = window.setTimeout(() => {
        if (containerRef.current && camera && renderer) {
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (geometry) geometry.dispose();
      materials.forEach(material => material.dispose());
      if (renderer) renderer.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [materials]);

  // Optimized mouse controls with throttling
  useEffect(() => {
    let lastTime = 0;
    const throttleInterval = 16; // ~60fps

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleInterval) return;
      
      if (!isDraggingRef.current || !cubeRef.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePositionRef.current.x,
        y: e.clientY - previousMousePositionRef.current.y
      };

      cubeRef.current.rotation.y += deltaMove.x * 0.005;
      cubeRef.current.rotation.x += deltaMove.y * 0.005;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      lastTime = currentTime;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      
      const currentTime = Date.now();
      if (currentTime - lastTime < throttleInterval) return;
      
      cameraRef.current.position.z = Math.max(
        3,
        Math.min(10, cameraRef.current.position.z + e.deltaY * 0.01)
      );
      
      lastTime = currentTime;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[400px]" />;
};