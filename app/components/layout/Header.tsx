'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import type { LottieRefCurrentProps } from 'lottie-react'

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// Import your Lottie animation file
import logoAnimation from '@/public/logofinal.json'

export default function Header() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const prevScrollPosRef = useRef(0)
  const [activeLink, setActiveLink] = useState("")
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Reference for the Lottie animation
  const logoAnimationRef = useRef<LottieRefCurrentProps>(null)
  
  // Update active link after mount to avoid hydration issues
  useEffect(() => {
    setActiveLink(pathname)
  }, [pathname])

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY
    const scrollingUp = prevScrollPosRef.current > currentScrollPos
    const beyondThreshold = currentScrollPos > 100 // Threshold for header visibility
    
    // Clear any existing timeout to prevent race conditions
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current)
    }

    // Set a delay before actually changing visibility state
    visibilityTimeoutRef.current = setTimeout(() => {
      // Only hide the header if we're scrolling down AND beyond the threshold
      if (!scrollingUp && beyondThreshold) {
        setVisible(false)
      } 
      // Add a bit more delay before showing to prevent flickering
      else if (scrollingUp) {
        setTimeout(() => setVisible(true), 150)
      }
    }, 200) // 200ms delay before processing scroll direction
    
    prevScrollPosRef.current = currentScrollPos
  }, [])
  
  useEffect(() => {
    // Reset visibility when path changes
    setVisible(true)
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current)
      }
    }
  }, [handleScroll, pathname])

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
            className="flex mx-auto items-center justify-evenly p-2 bg-black backdrop-blur-sm text-white w-full border-bottom border-gray-200 shadow-sm"
          >
            <motion.div variants={itemVariants}>
              <Link 
                href="/" 
                className="flex items-center gap-0"
                onMouseEnter={() => {
                  // On hover, play animation from start
                  if (logoAnimationRef.current) {
                    logoAnimationRef.current.play();
                  }
                }}
              >
                {/* Lottie animated "G" logo */}
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <Lottie
                    lottieRef={logoAnimationRef}
                    animationData={logoAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: 60, height: 60 }}
                    className="absolute"
                  />
                </div>
                
                {/* Static "globoo" text logo */}
                <Image
                  src="/globoo-only.svg"
                  alt="Globoo.io logo"
                  draggable="false"
                  width={80} // Adjusted to fit with the animated logo
                  height={40}
                  priority
                  className="ml-2" // Small margin to adjust positioning
                />
              </Link>
            </motion.div>

            <ul className="flex items-center gap-4 text-white text-sm">
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
                <Link href="/login" className="bg-cyan-400 text-black font-medium px-4 py-1 rounded-lg">
                  Entrar
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/register" className="bg-gray-200 font-medium text-black px-4 py-1 rounded-lg">
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
