
import { useState, useCallback, memo } from "react";
import { ThreeCube } from "./three/ThreeCube";
import { ImageUploadPanel } from "./hero/ImageUploadPanel";
import { HeroTitle } from "./hero/HeroTitle";
import { CubeSettingsPanel } from "./cube/CubeSettingsPanel";

const defaultImages = {
  front: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  back: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  right: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  left: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
  top: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  bottom: "/placeholder.svg"
};

export const Hero = () => {
  const [faceImages, setFaceImages] = useState(defaultImages);
  const [cubeSettings, setCubeSettings] = useState({
    bassIntensity: 50,
    audioReactionEnabled: true,
    zoomLevel: 5,
    pulseEnabled: false,
    pulseIntensity: 50,
    bounceEnabled: false,
    bounceIntensity: 50,
    edgesVisible: true,
    edgeColor: "#ffffff",
  });

  const handleImageUpload = useCallback((face: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (faceImages[face as keyof typeof faceImages].startsWith('blob:')) {
        URL.revokeObjectURL(faceImages[face as keyof typeof faceImages]);
      }
      
      const imageUrl = URL.createObjectURL(file);
      setFaceImages(prev => ({
        ...prev,
        [face]: imageUrl
      }));
    }
  }, [faceImages]);

  return (
    <div className="relative min-h-screen flex">
      <CubeSettingsPanel onSettingsChange={setCubeSettings} />
      
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <ImageUploadPanel 
          faceImages={faceImages}
          onImageUpload={handleImageUpload}
        />
        
        <div className="w-full max-w-2xl mx-auto">
          <ThreeCube 
            images={faceImages}
            settings={cubeSettings}
          />
        </div>

        <HeroTitle />
      </div>
    </div>
  );
};
