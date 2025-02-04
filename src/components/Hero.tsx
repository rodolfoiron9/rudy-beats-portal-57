import { motion } from "framer-motion";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

export const Hero = () => {
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

      {/* 3D Cube */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
            alt="Front"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Back Face */}
        <div className="absolute w-full h-full" style={{ transform: "translateZ(-32px) rotateY(180deg)" }}>
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Back"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Right Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateY(90deg) translateZ(32px)" }}>
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
            alt="Right"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Left Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateY(-90deg) translateZ(32px)" }}>
          <img
            src="https://images.unsplash.com/photo-1500673922987-e212871fec22"
            alt="Left"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Top Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateX(90deg) translateZ(32px)" }}>
          <img
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
            alt="Top"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Bottom Face */}
        <div className="absolute w-full h-full" style={{ transform: "rotateX(-90deg) translateZ(32px)" }}>
          <img
            src="/placeholder.svg"
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