
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useThreeScene } from './hooks/useThreeScene';
import { useMouseControls } from './hooks/useMouseControls';
import { useAudioAnimation } from './hooks/useAudioAnimation';
import type { AudioAnalyzer } from './AudioAnalyzer';

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
  const cubeRef = useRef<THREE.Mesh>();
  const edgesRef = useRef<THREE.LineSegments>();
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const analyzerRef = useRef<AudioAnalyzer>();
  const textureLoaderRef = useRef(new THREE.TextureLoader());
  const frameIdRef = useRef<number>();

  const { sceneRef, cameraRef, rendererRef } = useThreeScene(containerRef);

  // Memoize materials
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

  // Initialize cube and edges
  useMemo(() => {
    if (!sceneRef.current) return;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    sceneRef.current.add(cube);
    cubeRef.current = cube;

    const edges = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: settings.edgeColor 
    });
    const edgesLines = new THREE.LineSegments(edges, edgesMaterial);
    cube.add(edgesLines);
    edgesRef.current = edgesLines;

    return () => {
      geometry.dispose();
      materials.forEach(material => material.dispose());
    };
  }, [materials, settings.edgeColor, sceneRef.current]);

  // Setup mouse controls
  useMouseControls({
    cubeRef,
    cameraRef,
    isDraggingRef,
    previousMousePositionRef,
  });

  // Setup audio animation
  const { processAudioFrame } = useAudioAnimation({
    cubeRef,
    analyzerRef,
    settings,
  });

  // Handle window resize
  const handleResize = () => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  // Animation loop
  const animate = () => {
    frameIdRef.current = requestAnimationFrame(animate);

    if (!isDraggingRef.current && cubeRef.current) {
      cubeRef.current.rotation.y += 0.002;
    }

    processAudioFrame();

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // Update edges visibility and color
  if (edgesRef.current) {
    edgesRef.current.visible = settings.edgesVisible;
    (edgesRef.current.material as THREE.LineBasicMaterial).color.set(settings.edgeColor);
  }

  // Update camera zoom
  if (cameraRef.current) {
    cameraRef.current.position.z = settings.zoomLevel;
  }

  // Start animation
  animate();

  return <div ref={containerRef} className="w-full h-[400px]" />;
};
