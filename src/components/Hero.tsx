import { useState } from "react";
import { ThreeCube } from "./three/ThreeCube";
import { ImageUploadPanel } from "./hero/ImageUploadPanel";
import { HeroTitle } from "./hero/HeroTitle";

export const Hero = () => {
  const [faceImages, setFaceImages] = useState({
    front: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    back: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    right: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    left: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    top: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    bottom: "/placeholder.svg"
  });

  const handleImageUpload = (face: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFaceImages(prev => ({
        ...prev,
        [face]: imageUrl
      }));
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ImageUploadPanel 
        faceImages={faceImages}
        onImageUpload={handleImageUpload}
      />
      
      <div className="w-full max-w-2xl mx-auto">
        <ThreeCube images={faceImages} />
      </div>

      <HeroTitle />
    </div>
  );
};