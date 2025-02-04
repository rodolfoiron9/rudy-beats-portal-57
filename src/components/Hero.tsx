import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ThreeCube } from "./three/ThreeCube";
import { motion } from "framer-motion";

export const Hero = () => {
  const [faceImages, setFaceImages] = useState({
    front: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    back: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    right: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    left: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    top: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    bottom: "/placeholder.svg"
  });

  const handleImageUpload = (face: keyof typeof faceImages) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Image Upload Panel */}
      <div className="glass-card p-6 mb-8 w-full max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Customize Cube Faces</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(faceImages).map(([face, url]) => (
            <div key={face} className="space-y-2">
              <Label htmlFor={`${face}-upload`} className="capitalize">{face} Face</Label>
              <Input
                id={`${face}-upload`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload(face as keyof typeof faceImages)}
                className="text-sm cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Three.js Cube */}
      <div className="w-full max-w-2xl mx-auto">
        <ThreeCube images={faceImages} />
      </div>

      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold text-center mt-8 relative z-10"
      >
        Rudy Btz
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-gray-600 text-center mt-4 relative z-10"
      >
        Premium Beats & Instrumentals
      </motion.p>
    </div>
  );
};