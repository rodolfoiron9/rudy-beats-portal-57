
import { useEffect, RefObject } from 'react';
import * as THREE from 'three';

interface MouseControlsProps {
  cubeRef: RefObject<THREE.Mesh>;
  cameraRef: RefObject<THREE.PerspectiveCamera>;
  isDraggingRef: RefObject<boolean>;
  previousMousePositionRef: RefObject<{ x: number; y: number }>;
}

export const useMouseControls = ({
  cubeRef,
  cameraRef,
  isDraggingRef,
  previousMousePositionRef,
}: MouseControlsProps) => {
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
        x: e.clientX - previousMousePositionRef.current!.x,
        y: e.clientY - previousMousePositionRef.current!.y
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
};
