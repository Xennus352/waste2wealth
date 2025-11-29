"use client";
import { Card } from "@/components/ui/card";
import { BookMarked, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const GuideCard = () => {
  return (
    <div className="flex justify-center items-start px-3 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full max-w-[260px]"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-eco-primary via-eco-secondary to-eco-accent blur-lg opacity-25" />

        <Card className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-[#0f172a]/80 shadow-lg border border-white/30 dark:border-white/10">
          {/* HERO */}
          <div className="relative h-20 bg-gradient-to-br from-eco-primary/90 via-eco-secondary/90 to-eco-accent/90">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-2 left-2 px-2 py-0.5 text-[9px] rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-md text-eco-primary dark:text-eco-accent flex items-center gap-1"
            >
              <Sparkles size={10} /> Premium UI
            </motion.div>

            {/* Icons */}
            <div className="absolute top-2 right-2 flex gap-1.5 text-white">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Heart size={12} className="cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <BookMarked size={12} className="cursor-pointer" />
              </motion.div>
            </div>

            {/* Smooth Curve */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 120"
            >
              <path
                fill="white"
                className="dark:fill-[#0f172a]"
                d="M0,80 C240,120 480,0 720,30 960,60 1200,100 1440,40 L1440,120 L0,120 Z"
              />
            </svg>
          </div>

          {/* CONTENT */}
          <div className="px-3 pt-4 pb-4 text-center">
            <h2 className="text-sm font-bold tracking-wide text-eco-textDark dark:text-white">
              UNIVERSE OF UI
            </h2>
            <p className="text-[11px] mt-1 text-eco-textDark/60 dark:text-white/60">
              Future-focused design ecosystem
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-2 rounded-lg bg-eco-primarySoft/30 dark:bg-white/5">
                <p className="text-sm font-bold text-eco-primary">2026</p>
                <p className="text-[10px] text-eco-textDark/70 dark:text-white/70">
                  UI Advance
                </p>
              </div>

              <div className="p-2 rounded-lg bg-eco-accent/20 dark:bg-white/5">
                <p className="text-sm font-bold text-eco-accent">100%</p>
                <p className="text-[10px] text-eco-textDark/70 dark:text-white/70">
                  Free Inspire
                </p>
              </div>

              <div className="p-2 rounded-lg bg-eco-secondary/20 dark:bg-white/5">
                <p className="text-sm font-bold text-eco-secondary">38,631</p>
                <p className="text-[10px] text-eco-textDark/70 dark:text-white/70">
                  Contributors
                </p>
              </div>
            </div>

            {/* CTA BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-eco-primary to-eco-secondary text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Explore 
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default GuideCard;
