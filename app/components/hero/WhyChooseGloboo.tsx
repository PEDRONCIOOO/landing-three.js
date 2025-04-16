'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { LottieRefCurrentProps } from 'lottie-react';

// Import your Lottie JSON files
import cloudAnimation from '@/public/cloud2.json' 
import globalAnimation from '@/public/global.json'
import incomeAnimation from '@/public/money.json'
import staffAnimation from '@/public/Iq.json'
import supportAnimation from '@/public/support.json'
import securityAnimation from '@/public/security.json'
import highEarnAnimation from '@/public/downmoney.json'
import timeAnimation from '@/public/time.json'

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function WhyChooseGloboo() {
  const sectionRef = useRef(null); // Add ref for the section if needed for animations
  const [isMounted, setIsMounted] = useState(false)
  
  // Array of refs for each animation
  const lottieRefs = [
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
    useRef<LottieRefCurrentProps>(null),
  ]
  
  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const features = [
    {
      lottie: cloudAnimation,
      title: 'Transferências Rápidas e Seguras',
      description: 'Transferências de pagamento instantâneas e criptografadas globalmente com segurança de nível bancário.',
    },
    {
      lottie: globalAnimation,
      title: 'Suporte a Múltiplas Moedas',
      description: 'Envie e receba em várias moedas com taxas de câmbio competitivas.',
    },
    {
      lottie: incomeAnimation,
      title: 'Taxas Baixas, Valores Transparentes',
      description: 'Preços transparentes sem custos ocultos. Veja exatamente o que você paga.',
    },
    {
      lottie: staffAnimation,
      title: 'Para Investidores e Cryptohunters',
      description: 'Compre cryptomoedas com o seu cartão Globoo ou via PIX, Boleto, Débito, é você que manda!',
    },
    {
      lottie: supportAnimation,
      title: 'Suporte Personalizado e Humanizado',
      description: 'A única exchange com atendimento especializado e rápido via chat em tempo real.',
    },
    {
      lottie: securityAnimation,
      title: 'Segurança de Nível Bancário',
      description: 'Proteção de dados e transações com criptografia de ponta a ponta, aumentando a confiabilidade do seu dinheiro.',
    },
    {
      lottie: highEarnAnimation,
      title: 'Alta Liquidez e Independência',
      description: 'Acesse o mercado de criptomoedas com alta liquidez e sem intermediários, garantindo maior controle sobre seus investimentos.',
    },
    {
      lottie: timeAnimation,
      title: 'Sem tempo de espera ou burocracia',
      description: 'Depósitos e saques instantâneos sem aprovação prévia. Acesse seu dinheiro quando precisar.',
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white/50 to-white/10 py-24"
    >
      {/* Top wave decoration */}
      <div className="absolute top-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl text-black font-bold leading-tight"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Por que escolher a{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">
              Globoo
            </span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Tudo o que você precisa para gerenciar seus pagamentos com simplicidade e segurança.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg shadow-cyan-100/50 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-cyan-200 transition-all"
            >
              <motion.div 
                className="mb-5 p-2 rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 w-20 h-20 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5, 
                  background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)" 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 5 }}
                onMouseEnter={() => {
                  if (isMounted && lottieRefs[index].current) {
                    lottieRefs[index].current?.goToAndPlay(0);
                  }
                }}
              >
                {/* Only render Lottie when client-side */}
                {isMounted && (
                  <Lottie 
                    lottieRef={lottieRefs[index]}
                    animationData={feature.lottie} 
                    loop={true}
                    autoplay={true}
                    style={{ width: 60, height: 60 }}
                    className="pointer-events-auto"
                  />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative elements - only animate when in view */}
        <motion.div 
          className="absolute top-40 right-10 w-64 h-64 rounded-full bg-cyan-50 opacity-0 blur-3xl -z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ 
            opacity: 0.2,
            scale: 1,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }}
          viewport={{ once: true, amount: 0.1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.8
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-cyan-50 opacity-0 blur-3xl -z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ 
            opacity: 0.2,
            scale: 1,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }}
          viewport={{ once: true, amount: 0.1 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.2
          }}
        />
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white rotate-180">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  )
}
