
import { useState, useCallback } from "react";
import { ThreeCube } from "./three/ThreeCube";
import { ImageUploadPanel } from "./hero/ImageUploadPanel";
import { HeroTitle } from "./hero/HeroTitle";
import { CubeSettingsPanel } from "./cube/CubeSettingsPanel";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  const handleSettingsChange = (settings: Partial<typeof cubeSettings>) => {
    setCubeSettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-gray-50 to-white">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
          <CubeSettingsPanel onSettingsChange={handleSettingsChange} />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-start pt-16 overflow-hidden">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="fixed left-4 top-4 z-50"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <HeroTitle />
            </div>
            
            <div className="w-full max-w-2xl mx-auto mt-8">
              <ThreeCube 
                images={faceImages}
                settings={cubeSettings}
              />
            </div>

            <ImageUploadPanel 
              faceImages={faceImages}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
