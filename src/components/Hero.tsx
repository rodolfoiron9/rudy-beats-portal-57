import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
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

      {/* Upload Controls */}
      <div className="glass-card p-4 mb-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full mx-auto">
        {Object.entries(faceImages).map(([face, url]) => (
          <div key={face} className="flex flex-col items-center">
            <label className="text-sm mb-2 capitalize">{face} Face</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload(face as keyof typeof faceImages)}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-black/10 file:text-black hover:file:bg-black/20"
            />
          </div>
        ))}
      </div>

      {/* 3D Cube */}
      <motion.div
        className="relative w-64 h-64 preserve-3d"
        animate={{
          rotateX: 360,
          rotateY: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full" style={{ transform: "translateZ(32px)" }}>
          <img
            src={faceImages.front}
            alt="Front"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Back Face */}
        <div className="absolute w-full h-full" style={{ transform: "translateZ(-32px) rotateY(180deg)" }}>
          <img
            src={faceImages.back}
            alt="Back"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Right Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateY(90deg) translateZ(32px)" }}>
          <img
            src={faceImages.right}
            alt="Right"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Left Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateY(-90deg) translateZ(32px)" }}>
          <img
            src={faceImages.left}
            alt="Left"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Top Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateX(90deg) translateZ(32px)" }}>
          <img
            src={faceImages.top}
            alt="Top"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Bottom Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateX(-90deg) translateZ(32px)" }}>
          <img
            src={faceImages.bottom}
            alt="Bottom"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </motion.div>

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