
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
  settings: {
    bassIntensity: number;
    audioReactionEnabled: boolean;
    zoomLevel: number;
    pulseEnabled: boolean;
    pulseIntensity: number;
    bounceEnabled: boolean;
    bounceIntensity: number;
    edgesVisible: boolean;
    edgeColor: string;
  };
  audioElement?: HTMLAudioElement | null;
}

export const ThreeCube = ({ images, settings, audioElement }: ThreeCubeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cubeRef = useRef<THREE.Mesh>();
  const edgesRef = useRef<THREE.LineSegments>();
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Create edges
    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: settings.edgeColor 
    });
    const edgesLines = new THREE.LineSegments(edges, edgesMaterial);
    cube.add(edgesLines);

    camera.position.z = settings.zoomLevel;

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    cubeRef.current = cube;
    edgesRef.current = edgesLines;

    // Audio analyzer setup
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }
    
    if (audioElement && analyzerRef.current) {
      analyzerRef.current.connectAudio(audioElement);
    }

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (!isDraggingRef.current && cubeRef.current) {
        cubeRef.current.rotation.y += 0.002;
      }

      if (settings.audioReactionEnabled && analyzerRef.current && cubeRef.current) {
        const { bass, kick, snare } = analyzerRef.current.getFrequencyData();
        
        const bassScale = 1 + (bass / 512) * (settings.bassIntensity / 100) * 0.2;
        cubeRef.current.scale.setScalar(bassScale);

        if (settings.bounceEnabled) {
          const bounceAmount = (kick / 512) * (settings.bounceIntensity / 100);
          cubeRef.current.position.y = Math.sin(Date.now() * 0.005) * bounceAmount;
        }

        if (settings.pulseEnabled) {
          const pulseAmount = (snare / 512) * (settings.pulseIntensity / 100);
          cubeRef.current.scale.addScalar(pulseAmount);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
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
  }, [materials, settings]);

  // Mouse controls
  useEffect(() => {
    let lastTime = 0;
    const throttleInterval = 16;

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

  // Update edges visibility and color
  useEffect(() => {
    if (edgesRef.current) {
      edgesRef.current.visible = settings.edgesVisible;
      (edgesRef.current.material as THREE.LineBasicMaterial).color.set(settings.edgeColor);
    }
  }, [settings.edgesVisible, settings.edgeColor]);

  // Update camera zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = settings.zoomLevel;
    }
  }, [settings.zoomLevel]);

  return <div ref={containerRef} className="w-full h-[400px]" />;
};
