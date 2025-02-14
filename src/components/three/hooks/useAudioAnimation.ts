
import { useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import { AudioAnalyzer } from '../AudioAnalyzer';

interface AudioAnimationProps {
  cubeRef: MutableRefObject<THREE.Mesh | undefined>;
  analyzerRef: MutableRefObject<AudioAnalyzer | undefined>;
  settings: {
    audioReactionEnabled: boolean;
    bassIntensity: number;
    pulseEnabled: boolean;
    pulseIntensity: number;
    bounceEnabled: boolean;
    bounceIntensity: number;
  };
}

export const useAudioAnimation = ({
  cubeRef,
  analyzerRef,
  settings,
}: AudioAnimationProps) => {
  useEffect(() => {
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }
  }, []);

  const processAudioFrame = () => {
    if (!settings.audioReactionEnabled || !analyzerRef.current || !cubeRef.current) return;

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
  };

  return { processAudioFrame };
};
