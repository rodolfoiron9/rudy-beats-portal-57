import { Play, Download, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface Track {
  id: number;
  title: string;
  duration: string;
  isPremium: boolean;
  audioUrl?: string;
}

interface TrackItemProps {
  track: Track;
  currentlyPlaying: number | null;
  onPlay: (track: Track) => void;
}

export const TrackItem = ({ track, currentlyPlaying, onPlay }: TrackItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="track-row flex items-center justify-between p-4 rounded-lg hover:bg-black/5 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className={`hover:scale-105 transition-transform ${currentlyPlaying === track.id ? 'text-primary' : ''}`}
          onClick={() => onPlay(track)}
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
  );
};