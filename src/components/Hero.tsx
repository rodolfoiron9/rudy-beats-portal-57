import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-48 h-48 mb-8"
      >
        <img 
          src="/placeholder.svg" 
          alt="Rudy Btz Logo" 
          className="w-full h-full object-contain"
        />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold text-center mb-4"
      >
        Rudy Btz
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-gray-600 text-center max-w-2xl"
      >
        Premium Beats & Instrumentals
      </motion.p>
    </motion.div>
  );
};