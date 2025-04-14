"use client";

import Squares from "@/react-bits/Squares/Squares";
import Phone3D from "./components/hero/AnimatedShowcase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Simplified animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle gradient blobs */}
        <motion.div 
          className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-cyan-50 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-[15%] w-80 h-80 rounded-full bg-cyan-50 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />

        {/* Animated Squares component */}
        <div className="absolute inset-0" style={{ opacity: 0.5, zIndex: 1 }}>
          <Squares 
            speed={0.15}
            squareSize={50} // Increased square size for better visibility
            direction="diagonal"
            borderColor="#22d3ee"
            hoverFillColor="#22d3ee"
          />
        </div>

        {/* Gradient overlay */}
        <motion.div 
          className="absolute inset-0 from-white/100 to-white/80 bg-gradient-to-b" 
          style={{ zIndex: 2 }}
        />
      </div>

      {/* Content container with relative positioning */}
      <div className="relative flex flex-col gap-5 items-center max-w-7xl mx-auto px-6 sm:px-8 h-screen">
        {/* Centered text content section */}
        <motion.div 
          className="w-full text-center max-w-2xl mx-auto absolute top-1/2 -translate-y-2/3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="space-y-4 mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mx-auto"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-black bg-clip-text leading-none">
                Descubra a <br></br> liberdade do banco digital.
              </span>
            </motion.h1>

            <motion.div
              className="space-y-0.5 mt-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
            </motion.div>

            <motion.p 
              className="text-base text-gray-500 max-w-md mx-auto mt-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Uma carteira para todos os seus pagamentos diários. Envie dinheiro para amigos e família na Globoo de graça — sempre.
            </motion.p>

            <motion.div 
              className="pt-4 flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link href="/signup">
                <motion.button 
                  className="px-6 py-1 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium text-sm shadow-md shadow-cyan-200/30 hover:shadow-cyan-300/40 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Abra sua conta <ArrowRight className="inline-block ml-1" />
                </motion.button>
              </Link>
              <Link href="/learn-more">
                <motion.button 
                  className="px-6 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-cyan-200 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Saiba mais
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Phone showcase at bottom */}
        <motion.div 
          className="absolute bottom-0 inset-x-0 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Phone container */}
          <div className="relative w-full max-w-sm sm:max-w-md h-[400px] z-10">
            <Phone3D />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
