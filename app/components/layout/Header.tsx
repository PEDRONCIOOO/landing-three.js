'use client'

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const prevScrollPosRef = useRef(0);
  // Use dedicated state for active links to avoid hydration issues
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    // Update active link after component mounts to avoid hydration mismatch
    setActiveLink(pathname);
  }, [pathname]);
  
  useEffect(() => {
    // Reset visibility when path changes to ensure entrance animation plays
    setVisible(true);
    
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollingUp = prevScrollPosRef.current > currentScrollPos;
      const beyondThreshold = currentScrollPos > window.innerHeight * 0.6; // 60vh threshold
      
      // Show header when scrolling up, hide when scrolling down past threshold
      if (scrollingUp) {
        setVisible(true);
      } else if (beyondThreshold && !scrollingUp) {
        setVisible(false);
      }
      
      prevScrollPosRef.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Header variants with staggered animation
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
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
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
    },
    exit: {
      y: -20,
      opacity: 0
    }
  };

  // Function to determine if a navigation item is active - safe for SSR
  const isActive = (itemName: string, index: number): boolean => {
    const itemPath = index === 0 ? "/" : `/${itemName.toLowerCase()}`;
    return itemPath === activeLink;
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.header
          key="header"
          initial="hidden"
          animate="visible"
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
                  <Link 
                    href={index === 0 ? "/" : `/${item.toLowerCase()}`}
                    className={isActive(item, index) ? "font-bold" : ""}
                  >
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
      )}
    </AnimatePresence>
  );
}
