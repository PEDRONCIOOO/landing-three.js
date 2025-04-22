"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const coins = [
  { name: "Solana", image: "/solana.png", x: -300, y: -150, color: "from-purple-500 to-fuchsia-500", glowColor: "rgba(168, 85, 247, 0.5)" },
  { name: "Avalanche", image: "/avax.png", x: -300, y: 0, color: "from-red-500 to-orange-500", glowColor: "rgba(239, 68, 68, 0.5)" },
  { name: "BNB", image: "/bnb.png", x: -300, y: 150, color: "from-yellow-400 to-amber-500", glowColor: "rgba(251, 191, 36, 0.5)" },
  { name: "Polygon", image: "/polygon.png", x: 300, y: -150, color: "from-purple-600 to-indigo-500", glowColor: "rgba(99, 102, 241, 0.5)" },
  { name: "Ethereum", image: "/ethereum.png", x: 300, y: 0, color: "from-blue-500 to-cyan-400", glowColor: "rgba(6, 182, 212, 0.5)" },
  { name: "Bitcoin", image: "/bitcoin.png", x: 300, y: 150, color: "from-amber-500 to-yellow-300", glowColor: "rgba(245, 158, 11, 0.5)" },
];

export default function CryptoMindMap() {
  const [walletPulse, setWalletPulse] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [transactionCount, setTransactionCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    const lineInterval = setInterval(() => {
      const nextLine = (activeLine + 1) % coins.length;
      setActiveLine(nextLine);
      setWalletPulse(true);
      setTimeout(() => setWalletPulse(false), 300);
      countRef.current += Math.floor(Math.random() * 50) + 10;
      setTransactionCount(countRef.current);
    }, 2000);
    return () => clearInterval(lineInterval);
  }, [activeLine]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-900/20 to-purple-800/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence>
        {walletPulse && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute z-10 w-72 h-72 rounded-full bg-gradient-radial from-white/30 to-transparent"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`z-10 w-80 h-[500px] flex items-center justify-center ${walletPulse ? 'scale-[1.03]' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="absolute w-80 h-[500px] rounded-3xl"
          animate={{
            boxShadow: walletPulse 
              ? `0 0 50px 15px ${coins[activeLine]?.glowColor || "rgba(6, 182, 212, 0.3)"}`
              : "0 0 25px 8px rgba(6, 182, 212, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative">
          <Image 
            src="/phonecrypto.webp" 
            alt="Crypto Wallet App" 
            width={340} 
            height={480} 
            className="rounded-xl drop-shadow-2xl" 
            draggable="false" 
          />
          <motion.div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-2xl font-bold text-white"
            key={transactionCount}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {transactionCount} USD
          </motion.div>
        </div>
      </motion.div>

      {coins.map((coin, index) => (
        <div key={index} className="absolute" style={{ left: `calc(50% + ${coin.x}px)`, top: `calc(50% + ${coin.y}px)` }}>
          <div className="absolute" style={{ width: `${Math.abs(coin.x)}px`, height: "2px", top: "50%", left: coin.x > 0 ? `-${Math.abs(coin.x)}px` : "100%", transform: "translateY(-50%)", background: "rgba(31, 41, 55, 0.4)", overflow: "hidden" }}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: activeLine === index ? [0, 1, 0.7] : 0,
                boxShadow: activeLine === index 
                  ? [`0 0 3px 1px ${coin.glowColor}`, `0 0 12px 3px ${coin.glowColor}`, `0 0 8px 2px ${coin.glowColor}`] 
                  : "none"
              }}
              style={{ 
                background: `linear-gradient(to ${coin.x > 0 ? 'left' : 'right'}, ${coin.glowColor}, transparent)`,
                borderRadius: "4px"
              }}
              transition={{ duration: 1.8 }}
            />
          </div>
          <motion.div
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 shadow-lg border border-gray-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: activeLine === index ? [1, 1.15, 1.1] : 1,
              boxShadow: activeLine === index 
                ? [`0 0 10px 2px ${coin.glowColor}`, `0 0 25px 7px ${coin.glowColor}`, `0 0 20px 5px ${coin.glowColor}`] 
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: activeLine === index ? 1.8 : 0.5, delay: index * 0.1 }}
          >
            <Image src={coin.image} alt={coin.name} width={40} height={40} />
            <motion.div 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${coin.color}`}
              animate={{ 
                opacity: activeLine === index ? [0.2, 0.5, 0.4] : 0.2,
                filter: activeLine === index ? ["blur(2px)", "blur(6px)", "blur(4px)"] : "blur(2px)"
              }}
              transition={{ duration: 1.8 }}
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400"
            animate={{ opacity: activeLine === index ? 1 : 0.6 }}
          >
            {coin.name}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
