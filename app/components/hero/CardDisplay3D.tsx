"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { motion } from "framer-motion";
import { IoMdArrowDropright } from "react-icons/io";
import Link from "next/link";
import { MdOutlineSupportAgent } from "react-icons/md";

// Define card models and their properties
const CARDS = [
  { id: "black", name: "Black Card", path: "/models/black-card.glb", color: "bg-gradient-to-r from-gray-900 to-black" },
  { id: "blue", name: "Blue Card", path: "/models/card-luz.glb", color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
  { id: "gold", name: "Gold Card", path: "/models/gold-card.glb", color: "bg-gradient-to-r from-amber-500 to-yellow-400" }
];

export default function CardDisplay3D() {
  // All your existing state and refs remain the same
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState("blue");
  const animationRef = useRef<{
    scene?: THREE.Scene,
    cardModel?: THREE.Group,
    autoRotate?: gsap.core.Timeline
  }>({});

  // Keep all your existing useEffects for the 3D functionality
  useEffect(() => {
    if (!mountRef.current) return;
    const mountElement = mountRef.current;
    const currentAnimationRef = animationRef.current;
    // ... rest of your existing 3D setup code

    // Scene setup
    const scene = new THREE.Scene();
    currentAnimationRef.scene = scene;

    // Camera setup
    const width = mountElement.clientWidth;
    const height = mountElement.clientHeight;
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(3, 0, 7);

    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8; // Increased from 1.25 for global brightness
    mountElement.appendChild(renderer.domElement);

    // Controls setup - enable interaction but limit to horizontal only
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Add these constraints to limit rotation to horizontal only
    controls.minPolarAngle = Math.PI / 2; // 90 degrees
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees

    // Improved lighting setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.9); // Increased ambient intensity
    scene.add(ambient);

    // Main key light - brighter and repositioned
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
    keyLight.position.set(1, 2, 5); // Moved slightly forward
    scene.add(keyLight);

    // Fill light from left - increased intensity
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.5
    fillLight.position.set(-3, 0, 3);
    scene.add(fillLight);

    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(2, 0, -6);
    scene.add(rimLight);

    // Front face light - NEW light specifically to illuminate the front face
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.9);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    // Bottom light - NEW to reduce shadows underneath
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // Blue accent lights with increased intensity
    const blueAccent1 = new THREE.PointLight(0x4c72ff, 0.6, 15); // Increased intensity and range
    blueAccent1.position.set(-3, -1, 2);
    scene.add(blueAccent1);

    // Additional blue accent from opposite side
    const blueAccent2 = new THREE.PointLight(0x4c72ff, 0.5, 12);
    blueAccent2.position.set(3, 1, 3);
    scene.add(blueAccent2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const w = mountElement.clientWidth;
      const h = mountElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Add interaction handlers for rotation control
    // These will be used by all cards
    const handleStartInteraction = () => {
      if (animationRef.current.autoRotate) {
        animationRef.current.autoRotate.pause();
      }
    };

    const handleEndInteraction = () => {
      setTimeout(() => {
        if (!animationRef.current.cardModel) return;
        
        // Kill existing animation
        if (animationRef.current.autoRotate) {
          animationRef.current.autoRotate.pause();
          animationRef.current.autoRotate.kill();
        }

        // Create new rotation timeline
        const newRotate = gsap.timeline({ repeat: -1 });
        newRotate.to(animationRef.current.cardModel.rotation, {
          y: animationRef.current.cardModel.rotation.y + Math.PI * 2,
          duration: 20,
          ease: "none"
        });

        animationRef.current.autoRotate = newRotate;
      }, 500);
    };

    // Add event listeners to controls
    controls.addEventListener("start", handleStartInteraction);
    controls.addEventListener("end", handleEndInteraction);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", handleStartInteraction);
      controls.removeEventListener("end", handleEndInteraction);

      if (controls) {
        controls.dispose();
      }

      if (renderer) {
        renderer.dispose();
      }

      // Safe DOM cleanup
      if (mountElement && mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }

      // Clear any animations - using the captured ref value
      if (currentAnimationRef.autoRotate) {
        currentAnimationRef.autoRotate.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (!animationRef.current.scene) return;

    const scene = animationRef.current.scene;
    const cardToLoad = CARDS.find(card => card.id === selectedCard);
    if (!cardToLoad) return;

    // Load the selected card
    const loader = new GLTFLoader();
    loader.load(
      cardToLoad.path,
      (gltf) => {
        // Remove previous card model if exists
        if (animationRef.current.cardModel) {
          const oldCard = animationRef.current.cardModel;
          
          // Animate old card out
          gsap.to(oldCard.position, {
            x: -5,
            duration: 0.7,
            ease: "power1.in",
            onComplete: () => {
              if (scene.children.includes(oldCard)) {
                scene.remove(oldCard);
              }
              
              // Kill any animations on the old card
              if (animationRef.current.autoRotate) {
                animationRef.current.autoRotate.kill();
              }
            }
          });
        }

        // Setup new card
        const cardModel = gltf.scene;
        
        // Enhance card materials with emissive properties
        cardModel.traverse((object) => {
          if (object instanceof THREE.Mesh && object.material) {
            // Make materials brighter
            object.material.roughness = 0.2;
            object.material.metalness = 0.85;

            // Add emissive properties to make the card glow slightly
            if (selectedCard === "gold") {
              // Gold card has warm glow
              if (!object.material.emissive) {
                object.material.emissive = new THREE.Color(0xffcc66);
              } else {
                object.material.emissive.set(0xffcc66);
              }
            } else if (selectedCard === "black") {
              // Black card has white/silver edge glow
              if (!object.material.emissive) {
                object.material.emissive = new THREE.Color(0x777777);
              } else {
                object.material.emissive.set(0x777777);
              }
            } else {
              // Blue card has blue glow
              if (!object.material.emissive) {
                object.material.emissive = new THREE.Color(0x3377ff);
              } else {
                object.material.emissive.set(0x3377ff);
              }
            }
            
            object.material.emissiveIntensity = 0.02; // Subtle glow

            // Make the material receive more light
            if (object.material.lightMapIntensity) {
              object.material.lightMapIntensity = 1.5;
            }
          }
        });

        // Position the new card off-screen to the right for entrance animation
        cardModel.scale.setScalar(1.8);
        cardModel.position.set(5, -0.5, 0); // Start off-screen to the right
        cardModel.rotation.y = Math.PI - 0.3;
        cardModel.rotation.x = -0.15;

        scene.add(cardModel);
        animationRef.current.cardModel = cardModel;

        // Create attached lights that move with the card
        // 1. Create a spotlight that follows the front of the card
        const cardSpotlight = new THREE.SpotLight(
          0xffffff,
          2.5,
          10,
          Math.PI / 6,
          0.5,
          1
        );
        cardSpotlight.position.set(0, 0, 3); // Position in front of card
        cardSpotlight.target = cardModel; // Point at the card
        cardModel.add(cardSpotlight); // Attach to card so it moves with it

        // 2. Add a point light inside the card to make it glow from within
        const innerLightColor = selectedCard === "gold" ? 0xffcc44 : 
                               selectedCard === "black" ? 0xcccccc : 0x4c72ff;
                               
        const innerLight = new THREE.PointLight(innerLightColor, 0.8, 2);
        innerLight.position.set(0, 0, 0); // Center of card
        cardModel.add(innerLight);

        // 3. Add two small point lights at the corners of the card for edge highlighting
        const cornerLight1 = new THREE.PointLight(0xffffff, 0.4, 1);
        cornerLight1.position.set(1, 0.5, 0.1); // Top right corner
        cardModel.add(cornerLight1);

        const cornerLight2 = new THREE.PointLight(0xffffff, 0.4, 1);
        cornerLight2.position.set(-1, -0.5, 0.1); // Bottom left corner
        cardModel.add(cornerLight2);

        // Animate card entering from the right
        gsap.to(cardModel.position, {
          x: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => {
            // Add continuous slow rotation animation after card enters
            const autoRotate = gsap.timeline({
              repeat: -1,
              paused: false,
            });

            autoRotate.to(cardModel.rotation, {
              y: Math.PI * 2 - 0.3,
              duration: 15,
              ease: "none",
            });

            animationRef.current.autoRotate = autoRotate;
          }
        });
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );
  }, [selectedCard]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-20 right-[20%] w-96 h-96 rounded-full bg-cyan-50 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.1, 0.15]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-[15%] w-[30rem] h-[30rem] rounded-full bg-cyan-50 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.12, 0.08, 0.12]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        
        {/* Light grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col h-screen">
        {/* Hero content container */}
        <div className="flex flex-col lg:flex-row items-center justify-center h-full py-10 lg:py-0">
          {/* Hero text section - left side */}
          <motion.div 
            className="w-full lg:w-1/2 lg:pr-16 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-xl">
              <motion.span 
                className="text-sm font-semibold text-cyan-600 block mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                GLOBOO FINANCE
              </motion.span>
              
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Sua chave para o
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent block">
                  mundo financeiro
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Com os nossos cartões <span className="font-semibold text-gray-800">Black</span>, <span className="font-semibold text-cyan-600">Blue</span>, <span className="font-semibold text-amber-500">Gold</span>,
                tenha acesso a transferências globais, compras de criptomoedas,
                compras internacionais e gestão financeira completa.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link href="/signup">
                  <motion.button
                    className="px-8 py-1 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium shadow-lg shadow-cyan-200/30 hover:shadow-cyan-300/40 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Abra sua conta <IoMdArrowDropright className="inline-flex ml-1" />
                  </motion.button>
                </Link>
                <Link href="/support">
                  <motion.button 
                    className="px-8 py-1 rounded-lg bg-white border border-gray-200 shadow-md shadow-cyan-200/30 text-gray-700 font-medium hover:border-cyan-200 transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Suporte <MdOutlineSupportAgent className="inline-flex ml-1" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Card display - right side */}
          <motion.div 
            className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Card type selector */}
            <motion.div 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-6 z-10"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {CARDS.map((card) => (
                <motion.button
                  key={card.id}
                  className={`w-14 h-14 rounded-full ${card.color} shadow-lg transition-all 
                    ${selectedCard === card.id 
                      ? 'ring-4 ring-gray-200 scale-110' 
                      : 'opacity-80 hover:opacity-100'}`}
                  onClick={() => setSelectedCard(card.id)}
                  title={card.name}
                  aria-label={`Select ${card.name}`}
                  whileHover={{ scale: selectedCard === card.id ? 1.1 : 1.15 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </motion.div>
            
            {/* Floating elements around card */}
            <motion.div 
              className="absolute -right-4 top-1/4 w-16 h-16 rounded-xl bg-white shadow-lg p-3 flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 0.9, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-500">
                <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </motion.div>
            
            <motion.div 
              className="absolute left-4 bottom-1/4 w-16 h-16 rounded-xl bg-white shadow-lg p-3 flex items-center justify-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 0.9, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-500">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
              </svg>
            </motion.div>
            
            {/* 3D card display area */}
            <div
              ref={mountRef}
              className="w-full h-full rounded-xl overflow-hidden cursor-grab"
            />
            
            {/* Card type label */}
            <motion.div 
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-8 py-2 rounded-full shadow-lg text-gray-800 font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {CARDS.find(card => card.id === selectedCard)?.name || "Card"}
            </motion.div>
          </motion.div>
        </div>
      </div>
      

    </div>
  );
}
