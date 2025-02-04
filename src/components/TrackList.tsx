import { motion } from "framer-motion";
import { Play, Download, Lock, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const audioUrl = URL.createObjectURL(file);
      
      // Create a promise to handle audio loading
      const getDuration = () => {
        return new Promise<number>((resolve, reject) => {
          const audio = new Audio();
          audio.src = audioUrl;
          
          audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
          });
          
          audio.addEventListener('error', (e) => {
            reject(new Error(`Error loading audio: ${e}`));
          });
        });
      };

      const duration = await getDuration();
      
      const newTrack: Track = {
        id: tracks.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        duration: formatDuration(duration),
        isPremium: false,
        audioUrl: audioUrl,
      };

      setTracks(prev => [...prev, newTrack]);
      
      toast({
        title: "Track uploaded",
        description: `${newTrack.title} has been added to your playlist.`,
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Upload failed",
        description: "There was an error loading the audio file.",
        variant: "destructive",
      });
      
      // Clean up the failed upload URL
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    }
  };

  const handlePlayTrack = async (track: Track) => {
    try {
      if (!track.audioUrl) {
        throw new Error('No audio URL available');
      }

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create and play new audio
      const audio = new Audio(track.audioUrl);
      audioRef.current = audio;
      
      await audio.play();
      
      toast({
        title: "Now Playing",
        description: track.title,
      });

      // Handle audio completion
      audio.addEventListener('ended', () => {
        audioRef.current = null;
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Playback error",
        description: "There was an error playing the track.",
        variant: "destructive",
      });
    }
  };

  // Cleanup function for audio resources
  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    tracks.forEach(track => {
      if (track.audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(track.audioUrl);
      }
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, []);

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
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Upload className="h-4 w-4" />
                  Upload Track
                </Button>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="track-row flex items-center justify-between p-4 rounded-lg hover:bg-black/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:scale-105 transition-transform"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                  <span className="font-medium">{track.title}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">{track.duration}</span>
                  {track.isPremium ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:scale-105 transition-transform"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};