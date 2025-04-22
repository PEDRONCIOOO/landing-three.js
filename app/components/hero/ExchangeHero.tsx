"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lottie from "lottie-react";
import globooAnimation from "../../../public/globoo-animated.json";

const options = [
  { name: "Solana", image: "/solana.png", x: -300, y: -150, color: "#9945FF" },
  { name: "Avalanche", image: "/avax.png", x: -300, y: 0, color: "#E84142" },
  { name: "BNB", image: "/bnb.png", x: -300, y: 150, color: "#F0B90B" },
  { name: "Polygon", image: "/polygon.png", x: 300, y: -150, color: "#8247E5" },
  { name: "Ethereum", image: "/ethereum.png", x: 300, y: 0, color: "#627EEA" },
  { name: "Bitcoin", image: "/bitcoin.png", x: 300, y: 150, color: "#F7931A" },
];

export default function AnimatedHero() {
  const [active, setActive] = useState(0);
  const lottieRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % options.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-start pt-20">
      {/* Hero Text Section */}
      <div className="relative z-20 text-center max-w-4xl px-6">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Negocie com confiança na exchange de cripto mais rápida e segura no mundo todo.
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Compre e venda mais de 200 criptomoedas usando mais de 20 moedas fiat por transferência bancária, cartão de crédito ou débito.
        </motion.p>
      </div>
      
      {/* Animation Container */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* Animated rotating border */}
        <motion.div
          className="absolute w-96 h-96 rounded-full border-4 border-cyan-400/50"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
        
        {/* Inner rotating border with opposite direction */}
        <motion.div
          className="absolute w-80 h-80 rounded-full border-2 border-dashed border-cyan-500/30"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        />

        {/* Center element with Lottie animation - BIGGER NOW */}
        <div className="relative z-10 w-64 h-64 rounded-full bg-gray-900 flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-cyan-500/10 to-transparent"></div>
          <motion.div 
            className="absolute inset-0 rounded-full"
            animate={{ 
              boxShadow: [
                "0 0 15px 3px rgba(6, 182, 212, 0.3)",
                "0 0 30px 8px rgba(6, 182, 212, 0.5)",
                "0 0 15px 3px rgba(6, 182, 212, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Lottie 
            lottieRef={lottieRef}
            animationData={globooAnimation} 
            loop={true}
            autoplay={true}
            style={{ width: 180, height: 180 }} // Increased size
            className="rounded-full"
          />
        </div>

        {/* Connecting lines and options */}
        {options.map((item, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: `calc(50% + ${item.x}px)`, top: `calc(50% + ${item.y}px)` }}
          >
            {/* Animated glowing line with sparkle effect */}
            <motion.div
              className="absolute"
              style={{
                width: `${Math.abs(item.x)}px`,
                height: "2px",
                top: "50%",
                left: item.x > 0 ? `-${Math.abs(item.x)}px` : "100%",
                transform: "translateY(-50%)",
                background: `linear-gradient(to ${item.x > 0 ? 'left' : 'right'}, ${item.color}, transparent)`,
                opacity: active === index ? 1 : 0.3,
                overflow: "hidden"
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.1 }}
            >
              {/* Particle effect for active line */}
              {active === index && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-10 h-4 rounded-full"
                  style={{ 
                    background: `radial-gradient(circle, ${item.color}, transparent)`,
                    filter: "blur(3px)",
                    left: item.x > 0 ? "0" : "auto",
                    right: item.x <= 0 ? "0" : "auto"
                  }}
                  animate={{
                    left: item.x > 0 ? "100%" : undefined,
                    right: item.x <= 0 ? "100%" : undefined,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: 1,
                    repeatDelay: 0.1
                  }}
                />
              )}
            </motion.div>

            {/* Option icon with more dynamic effects */}
            <motion.div
              className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gray-800 border"
              style={{
                borderColor: item.color
              }}
              animate={{ 
                opacity: active === index ? 1 : 0.4,
                scale: active === index ? [1, 1.1, 1] : 1,
                boxShadow: active === index ? `0 0 15px 3px ${item.color}40` : "none"
              }}
              transition={{ 
                duration: 1.5, 
                repeat: active === index ? Infinity : 0,
                repeatType: "mirror"
              }}
            >
              <Image src={item.image} alt={item.name} width={32} height={32} />
            </motion.div>
            
            {/* Currency label */}
            <motion.div
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-medium"
              style={{ color: active === index ? item.color : "#6B7280" }}
            >
              {item.name}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
