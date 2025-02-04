import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = Object.values(images).map(url => 
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(url),
        transparent: true,
        opacity: 0.9
      })
    );
    
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 5;

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    cubeRef.current = cube;

    // Audio analyzer setup
    analyzerRef.current = new AudioAnalyzer();
    if (audioElement) {
      analyzerRef.current.connectAudio(audioElement);
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isDraggingRef.current && cubeRef.current) {
        cubeRef.current.rotation.y += 0.002;
      }

      // Audio reactive animations
      if (analyzerRef.current && cubeRef.current) {
        const { bass, kick, snare } = analyzerRef.current.getFrequencyData();
        
        // Scale based on bass
        const bassScale = 1 + (bass / 512) * 0.2;
        cubeRef.current.scale.setScalar(bassScale);

        // Rotate based on kick
        cubeRef.current.rotation.x += (kick / 512) * 0.01;
        
        // Bounce based on snare
        cubeRef.current.position.y = (snare / 512) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [images]);

  // Mouse controls
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cubeRef.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePositionRef.current.x,
        y: e.clientY - previousMousePositionRef.current.y
      };

      cubeRef.current.rotation.y += deltaMove.x * 0.005;
      cubeRef.current.rotation.x += deltaMove.y * 0.005;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!cameraRef.current) return;
      
      cameraRef.current.position.z = Math.max(
        3,
        Math.min(10, cameraRef.current.position.z + e.deltaY * 0.01)
      );
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