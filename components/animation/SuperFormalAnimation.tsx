"use client";

import { motion, AnimatePresence } from "framer-motion";

const SuperFormalAnimation = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-999">
      {/* 白フラッシュ */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.4 }}
      />

      {/* 波紋 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 rounded-full border-4 border-yellow-300"
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 4 + i * 1.2, opacity: 0 }}
          transition={{ duration: 1.6 + i * 0.3, ease: "easeOut" }}
        />
      ))}

      {/* 光線 */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-32 bg-yellow-200 rounded-full origin-bottom"
            style={{ rotate: `${(angle * 180) / Math.PI}deg` }}
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{ scaleY: 1.5, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        );
      })}

      {/* 粒子 */}
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 250;

        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-yellow-300 rounded-full shadow-xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
};

export default SuperFormalAnimation;
