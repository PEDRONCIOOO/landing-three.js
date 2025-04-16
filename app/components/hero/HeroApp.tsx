"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Link from "next/link";

export default function HeroApp() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const controls = {
    phone: useAnimation(),
    text: useAnimation(),
    features: useAnimation(),
  };

  // Changed once to true so animation only plays once
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Use useCallback to memoize the function
  const startFloatingAnimation = useCallback(() => {
    controls.phone.start({
      y: [0, -15, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    });
  }, [controls.phone]);

  useEffect(() => {
    if (isInView) {
      controls.phone.start("visible");
      controls.text.start("visible");
      controls.features.start("visible");
      startFloatingAnimation();
    }
  }, [
    isInView,
    controls.phone,
    controls.text,
    controls.features,
    startFloatingAnimation,
  ]);

  // Text animation variants
  const textVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 1.2,
        delay: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // Phone animation variants
  const phoneVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Circle animation variants
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  // Feature item variants with staggered animations
  const featureVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6 + i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Notification variants with staggered animations
  const notificationVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8 + i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  // Screen highlight variants
  const highlightVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: [0, 0.5, 0],
      transition: {
        delay: 1 + i * 2,
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background decoration elements */}
      <motion.div
        ref={circleRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={circleVariants}
        className="absolute -left-32 top-1/2 transform -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500"
      />

      <div className="max-w-8xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Phone Section - Left */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-left">
            <motion.div
              ref={phoneRef}
              initial="hidden"
              animate={controls.phone}
              variants={phoneVariants}
              className="relative"
            >
              {/* Phone Image */}
              <div className="relative">
                <div className="absolute inset-0 rounded-[40px] blur-xl transform translate-y-2 scale-[0.95] z-0"></div>
                <Image
                  src="/phone-hero4.png"
                  alt="Globoo App Interface"
                  width={380}
                  height={560}
                  className="relative z-10 rounded-[32px] shadow-2xl"
                  priority
                  draggable="false"
                />

                {/* Screen highlights that animate */}
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={highlightVariants}
                  className="absolute top-[25%] left-[25%] w-[50%] h-16 bg-white rounded-lg blur-md z-0"
                />

                <motion.div
                  custom={1}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={highlightVariants}
                  className="absolute top-[45%] left-[20%] w-[60%] h-12 bg-white rounded-lg blur-md z-0"
                />

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={highlightVariants}
                  className="absolute top-[65%] left-[30%] w-[40%] h-10 bg-white rounded-lg blur-md z-0"
                />
              </div>

              {/* Notification elements */}
              <motion.div
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={notificationVariants}
                className="absolute top-[20%] -right-36 bg-white p-3 rounded-lg shadow-xl border border-gray-100 w-48"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs">
                    💰
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-black font-semibold">
                      Pagamento recebido
                    </div>
                    <div className="text-xs text-gray-500">
                      R$ 1.500,00 de Cliente
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={notificationVariants}
                className="absolute top-[40%] -right-40 bg-white p-3 rounded-lg shadow-xl border border-gray-100 w-52"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-white text-xs">
                    📈
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-black font-semibold">
                      Crypto valorizada
                    </div>
                    <div className="text-xs text-gray-500">
                      Bitcoin +3.7% hoje
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={notificationVariants}
                className="absolute top-[60%] -right-32 bg-white p-3 rounded-lg shadow-xl border border-gray-100 w-44"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs">
                    🔒
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-black font-semibold">
                      Segurança
                    </div>
                    <div className="text-xs text-gray-500">
                      Face ID Complete
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Content Section - Right */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Sua vida financeira
              <span className="block h-16 mt-1">
                <motion.span
                  initial="hidden"
                  animate={controls.text}
                  variants={textVariants}
                  className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-cyan-500 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  na palma da sua mão
                </motion.span>
              </span>
            </h1>

            <p className="text-gray-600 text-lg mb-10 max-w-xl">
              Visual moderno e serviços mais fáceis de encontrar. Para clientes
              que têm conta corrente: faça transferências (TED e DOC), Pix,
              pagamentos, controle seus gastos diários, renegocie dívidas e
              muito mais.
            </p>

            <div className="space-y-5 mb-10">
              <motion.div
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={featureVariants}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-black">
                    Transferências instantâneas
                  </h3>
                  <p className="text-sm text-gray-500">
                    Envie dinheiro para qualquer lugar do mundo em segundos
                  </p>
                </div>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={featureVariants}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-black">
                    Segurança de nível bancário
                  </h3>
                  <p className="text-sm text-gray-500">
                    Proteção total com criptografia avançada em cada transação
                  </p>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={featureVariants}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-black">
                    Baixas taxas, alta transparência
                  </h3>
                  <p className="text-sm text-gray-500">
                    Até 5x mais barato que bancos tradicionais
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Download buttons section with updated styling */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              id="download-buttons"
            >
              <Link href="#download-ios">
                <motion.button
                  className="px-8 py-1 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium shadow-lg shadow-cyan-200/30 hover:shadow-cyan-300/40 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaApple className="inline-flex mr-2 mb-1" /> App Store
                </motion.button>
              </Link>

              <Link href="#download-android">
                <motion.button
                  className="px-8 py-1 rounded-lg bg-white border border-gray-200 shadow-md shadow-cyan-200/30 text-gray-700 font-medium hover:border-cyan-200 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGooglePlay className="inline-flex mr-2" /> Google Play
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
