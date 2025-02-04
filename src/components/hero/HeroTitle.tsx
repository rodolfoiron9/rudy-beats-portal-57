import { motion } from "framer-motion";

export const HeroTitle = () => {
  return (
    <>
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
    </>
  );
};