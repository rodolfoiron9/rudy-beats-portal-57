import { motion } from "framer-motion";
import { Play, Download, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface Track {
  id: number;
  title: string;
  duration: string;
  isPremium: boolean;
}

const tracks: Track[] = [
  { id: 1, title: "Summer Vibes", duration: "2:45", isPremium: false },
  { id: 2, title: "Night Drive", duration: "3:12", isPremium: true },
  { id: 3, title: "Urban Flow", duration: "2:58", isPremium: false },
  { id: 4, title: "Chill Wave", duration: "3:30", isPremium: true },
];

export const TrackList = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Featured Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="track-row flex items-center justify-between p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:scale-105 transition-transform"
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