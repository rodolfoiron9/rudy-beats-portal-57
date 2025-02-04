import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface TrackUploaderProps {
  onUpload: (audioUrl: string, title: string, duration: string) => void;
}

export const TrackUploader = ({ onUpload }: TrackUploaderProps) => {
  const { toast } = useToast();

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
      const formattedDuration = formatDuration(duration);
      const title = file.name.replace(/\.[^/.]+$/, "");
      
      onUpload(audioUrl, title, formattedDuration);
      
      toast({
        title: "Track uploaded",
        description: `${title} has been added to your playlist.`,
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Upload failed",
        description: "There was an error loading the audio file.",
        variant: "destructive",
      });
      
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    }
  };

  return (
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
  );
};