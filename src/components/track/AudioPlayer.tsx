import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: number;
  title: string;
  audioUrl?: string;
}

interface AudioPlayerProps {
  currentTrack: Track | null;
  onPlaybackEnd: () => void;
}

export const AudioPlayer = ({ currentTrack, onPlaybackEnd }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const playTrack = async () => {
    try {
      if (!currentTrack?.audioUrl) {
        throw new Error('No audio URL available');
      }

      const audio = new Audio(currentTrack.audioUrl);
      audioRef.current = audio;
      
      await audio.play();
      
      toast({
        title: "Now Playing",
        description: currentTrack.title,
      });

      audio.addEventListener('ended', onPlaybackEnd);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback error",
        description: "There was an error playing the track.",
        variant: "destructive",
      });
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  useEffect(() => {
    if (currentTrack) {
      stopTrack();
      playTrack();
    }
    return stopTrack;
  }, [currentTrack]);

  return null;
};