import { motion, useAnimation } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const Hero = () => {
  const [faceImages, setFaceImages] = useState({
    front: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    back: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    right: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    left: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    top: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    bottom: "/placeholder.svg"
  });

  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const controls = useAnimation();

  // Handle mouse controls
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setRotation(prev => ({
        x: prev.x + e.movementY * 0.5,
        y: prev.y + e.movementX * 0.5
      }));
    }
  };

  // Handle zoom
  const handleWheel = (e: React.WheelEvent) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  // Bass bump animation
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [controls]);

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            move: {
              direction: "bottom",
              enable: true,
              random: false,
              straight: false,
              speed: 2,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 100,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        }}
        className="absolute inset-0"
      />

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

      {/* 3D Cube Container */}
      <div 
        className="preserve-3d cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        <motion.div
          animate={controls}
          className="relative w-64 h-64"
          style={{
            transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cube Faces */}
          <div className="absolute w-full h-full" style={{ transform: "translateZ(32px)" }}>
            <img src={faceImages.front} alt="Front" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
          <div className="absolute w-full h-full" style={{ transform: "translateZ(-32px) rotateY(180deg)" }}>
            <img src={faceImages.back} alt="Back" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
          <div className="absolute w-full h-full" style={{ transform: "rotateY(90deg) translateZ(32px)" }}>
            <img src={faceImages.right} alt="Right" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
          <div className="absolute w-full h-full" style={{ transform: "rotateY(-90deg) translateZ(32px)" }}>
            <img src={faceImages.left} alt="Left" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
          <div className="absolute w-full h-full" style={{ transform: "rotateX(90deg) translateZ(32px)" }}>
            <img src={faceImages.top} alt="Top" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
          <div className="absolute w-full h-full" style={{ transform: "rotateX(-90deg) translateZ(32px)" }}>
            <img src={faceImages.bottom} alt="Bottom" className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform" />
          </div>
        </motion.div>
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