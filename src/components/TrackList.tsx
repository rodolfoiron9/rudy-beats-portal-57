import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrackItem } from "./track/TrackItem";
import { TrackUploader } from "./track/TrackUploader";
import { AudioPlayer } from "./track/AudioPlayer";

interface Track {
  id: number;
  title: string;
  duration: string;
  isPremium: boolean;
  audioUrl?: string;
}

const initialTracks: Track[] = [
  { id: 1, title: "Summer Vibes", duration: "2:45", isPremium: false },
  { id: 2, title: "Night Drive", duration: "3:12", isPremium: true },
  { id: 3, title: "Urban Flow", duration: "2:58", isPremium: false },
  { id: 4, title: "Chill Wave", duration: "3:30", isPremium: true },
];

export const TrackList = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  const handleTrackUpload = (audioUrl: string, title: string, duration: string) => {
    const newTrack: Track = {
      id: tracks.length + 1,
      title,
      duration,
      isPremium: false,
      audioUrl,
    };
    setTracks(prev => [...prev, newTrack]);
  };

  const handlePlayTrack = (track: Track) => {
    if (currentlyPlaying === track.id) {
      setCurrentlyPlaying(null);
      return;
    }
    setCurrentlyPlaying(track.id);
  };

  const getCurrentTrack = () => {
    return tracks.find(track => track.id === currentlyPlaying) || null;
  };

  useEffect(() => {
    return () => {
      tracks.forEach(track => {
        if (track.audioUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(track.audioUrl);
        }
      });
    };
  }, [tracks]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Featured Tracks</h2>
            <TrackUploader onUpload={handleTrackUpload} />
          </div>
          <div className="space-y-2">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                currentlyPlaying={currentlyPlaying}
                onPlay={handlePlayTrack}
              />
            ))}
          </div>
        </div>
      </motion.div>
      <AudioPlayer
        currentTrack={getCurrentTrack()}
        onPlaybackEnd={() => setCurrentlyPlaying(null)}
      />
    </div>
  );
};