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
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState("blue"); // Default to blue card
  
  // Track animation state in a ref to manage across card changes
  const animationRef = useRef<{
    scene?: THREE.Scene,
    cardModel?: THREE.Group,
    autoRotate?: gsap.core.Timeline
  }>({});

  // Setup scene once
  useEffect(() => {
    if (!mountRef.current) return;

    const mountElement = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");
    animationRef.current.scene = scene;

    const width = mountElement.clientWidth;
    const height = mountElement.clientHeight;

    // Camera setup
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
          duration: 15,
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

      // Clear any animations
      if (animationRef.current.autoRotate) {
        animationRef.current.autoRotate.kill();
      }
    };
  }, []);

  // Load and display the selected card model
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
    <div className="w-full py-16 px-8 lg:px-16">
      <div className="flex flex-col lg:flex-row items-center max-w-7xl mx-auto">
        {/* Hero text on the left */}
        <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Sua chave para o mundo financeiro
          </h1>
          <p className="text-base text-gray-500 mx-auto mt-3 mb-3">
            Com os nossos cartões <span className="text-black/30">Black</span>, <span className="text-cyan-500">Blue</span>, <span className="text-yellow-500">Gold</span> tenha acesso a transferências globais, compras de crypto moedas,
            compras internacionais e gestão financeira completa em um único
            lugar. Simples, poderoso e sempre ao seu lado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <motion.button
                className="px-6 py-1 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium text-sm shadow-md shadow-cyan-200/30 hover:shadow-cyan-300/40 transition-all cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Abra sua conta <IoMdArrowDropright className="inline-flex" />
              </motion.button>
            </Link>
            <Link href="/learn-more">
              <motion.button 
                className="px-6 py-1 rounded-lg bg-white border border-gray-200 shadow-md shadow-cyan-200/30 text-gray-700 font-medium text-sm hover:border-cyan-200 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Suporte <MdOutlineSupportAgent className="inline-flex" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* 3D Card on the right */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] relative">
          {/* Card type selector circles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            {CARDS.map((card) => (
              <button
                key={card.id}
                className={`w-10 h-10 rounded-full ${card.color} shadow-lg transition-all 
                  ${selectedCard === card.id 
                    ? 'ring-4 ring-gray-200 scale-110' 
                    : 'hover:scale-105'}`}
                onClick={() => setSelectedCard(card.id)}
                title={card.name}
                aria-label={`Select ${card.name}`}
              />
            ))}
          </div>
          
          {/* 3D card display area */}
          <div
            ref={mountRef}
            className="w-full h-full rounded-xl overflow-hidden cursor-grab"
          />
          
          {/* Card type label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md text-black">
            {CARDS.find(card => card.id === selectedCard)?.name || "Card"}
          </div>
        </div>
      </div>
    </div>
  );
}
