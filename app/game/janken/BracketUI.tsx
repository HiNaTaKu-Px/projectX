"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  show: boolean;
  currentStage: number;
};

const stages = ["初戦", "準決", "決勝", "優勝"];

export default function BracketUI({ show, currentStage }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start pt-20 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-10 rounded-xl shadow-2xl flex flex-row gap-16 items-start"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col justify-end gap-6 h-full text-3xl font-bold text-white">
              {stages
                .slice()
                .reverse()
                .map((label, i) => {
                  const index = stages.length - 1 - i;
                  const isActive = currentStage === index;

                  return (
                    <div
                      key={label}
                      className="flex flex-row items-center gap-8 min-h-[70px]"
                    >
                      <div className="w-auto flex justify-center">
                        {isActive && (
                          <motion.div
                            layoutId="player-badge"
                            initial={{ y: 120, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 1.2,
                              ease: "easeOut",
                            }}
                            onAnimationStart={() => {
                              if (index === 3) {
                                const audio = new Audio("/sounds/clear.mp3");
                                audio.volume = 0.8;
                                audio.play();
                              }
                            }}
                            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold"
                          >
                            あなた
                          </motion.div>
                        )}
                      </div>

                      <p
                        className={`text-3xl font-bold pl-2 ${
                          isActive ? "text-yellow-300" : "text-white/80"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
