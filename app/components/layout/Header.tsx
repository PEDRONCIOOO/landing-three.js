'use client'

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    // Reset visibility when path changes to ensure entrance animation plays
    setVisible(true);
    
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollingUp = prevScrollPos > currentScrollPos;
      const beyondThreshold = currentScrollPos > window.innerHeight * 0.6; // 80vh threshold

      setVisible(scrollingUp || !beyondThreshold);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, pathname]);

  // Simplified variants
  const headerVariants = {
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    hidden: { 
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hidden: { 
      y: -20, 
      opacity: 0 
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.header
        key={pathname}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        exit="exit"
        variants={headerVariants}
        className="w-full fixed z-50"
      >
        <motion.nav 
          className="flex mx-auto items-center justify-evenly p-2 bg-white/50 backdrop-blur-sm text-white w-full border-bottom border-gray-200 shadow-sm"
        >
          <motion.div variants={itemVariants}>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/globoo.svg"
                alt="Globoo.io logo"
                draggable="false"
                width={140}
                height={140}
                priority
              />
            </Link>
          </motion.div>

          <ul className="flex items-center gap-4 text-gray-600 text-sm">
            {["Home", "Carteira", "Bank", "Exchange", "Escrow", "Contato"].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                <Link href={index === 0 ? "/" : `/${item.toLowerCase()}`}>
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-sm">
            <motion.div variants={itemVariants}>
              <Link href="/login" className="bg-black text-white px-4 py-1 rounded-lg">
                Entrar
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/register" className="bg-gray-200 text-black px-4 py-1 rounded-lg">
                Registrar
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      </motion.header>
    </AnimatePresence>
  );
}
