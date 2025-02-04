import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8 px-4 mt-auto"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-600">
          © {currentYear} Rudy Btz. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};