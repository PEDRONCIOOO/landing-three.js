"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cardPaths = [
  { id: "black", path: "/models/black-card.glb" },
  { id: "gold", path: "/models/gold-card.glb" },
  { id: "blue", path: "/models/blue-card.glb" }
];

export default function CardDisplay3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene,
    camera?: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer,
    controls?: OrbitControls,
    model?: THREE.Group,
  }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Setup scene once
  useEffect(() => {
    if (!mountRef.current) return;

    const mountElement = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    // Use a gradient background instead of plain white
    const bgColor = new THREE.Color("#f8fafc");
    scene.background = bgColor;
    sceneRef.current.scene = scene;

    const width = mountElement.clientWidth;
    const height = mountElement.clientHeight;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6);
    sceneRef.current.camera = camera;

    // Renderer setup with improved settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Proper color space
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better contrast
    renderer.toneMappingExposure = 1.25; // Slightly brighter
    mountElement.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enabled = false;
    sceneRef.current.controls = controls;

    // ---- IMPROVED LIGHTING SETUP ----
    
    // Ambient light - softer and lower intensity
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    
    // Main key light - positioned to highlight the front of the card
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(1, 2, 4);
    scene.add(keyLight);
    
    // Fill light - softer light from the opposite side
    const fillLight = new THREE.DirectionalLight(0xf5f5f5, 0.5);
    fillLight.position.set(-3, 0, 3);
    scene.add(fillLight);
    
    // Rim/edge light - to highlight card edges
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(2, 0, -6);
    scene.add(rimLight);
    
    // Top light - to illuminate the top of the card
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);
    
    // Additional subtle colored lights for visual interest
    const blueAccent = new THREE.PointLight(0x4c72ff, 0.3, 10);
    blueAccent.position.set(-3, -1, 2);
    scene.add(blueAccent);
    
    const goldAccent = new THREE.PointLight(0xffce87, 0.3, 10);
    goldAccent.position.set(3, -1, 2);
    scene.add(goldAccent)

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
    
    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      
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
    };
  }, []); // This effect runs only once for scene setup

  // Load card model when currentIndex changes
  useEffect(() => {
    if (!sceneRef.current.scene) return;
    
    const loader = new GLTFLoader();
    const { path } = cardPaths[currentIndex];
    
    loader.load(
      path,
      (gltf) => {
        const scene = sceneRef.current.scene;
        if (!scene) return;
        
        // If there's an existing model, animate it out
        if (sceneRef.current.model) {
          const currentModel = sceneRef.current.model;
          
          gsap.to(currentModel.position, {
            x: -3,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
              if (scene.children.includes(currentModel)) {
                scene.remove(currentModel);
              }
            }
          });
        }
        
        // Setup the new model
        const model = gltf.scene;
        
        // Enhance card materials if applicable
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            // Enhance metallic and reflective properties for card
            if (object.material) {
              object.material.roughness = 0.2; // More reflective
              object.material.metalness = 0.85; // More metallic
              object.material.envMapIntensity = 1.2; // Stronger reflections
              
              // If the card has emission/glowing parts
              if (object.material.emissive) {
                object.material.emissiveIntensity = 0.6;
              }
            }
          }
        });
        
        model.scale.setScalar(1.6);
        model.position.set(3, -0.6, 0); // Start from right
        model.rotation.y = Math.PI - 0.3;
        model.rotation.x = -0.15;
        
        // Add to scene
        scene.add(model);
        sceneRef.current.model = model;
        
        // Animate in from right
        gsap.to(model.position, {
          x: 0,
          duration: 0.7,
          ease: "power2.out"
        });
        
        // Add floating animation for visual interest
        gsap.timeline({repeat: -1, yoyo: true})
          .to(model.rotation, {
            x: model.rotation.x - 0.05,
            y: model.rotation.y + 0.05,
            duration: 3.5,
            ease: "sine.inOut"
          });
      },
      undefined,
      (err) => console.error("Error loading model:", err)
    );
  }, [currentIndex]); // Re-run when card index changes

  const changeCard = (dir: "prev" | "next") => {
    setCurrentIndex((prev) => {
      const total = cardPaths.length;
      return dir === "next"
        ? (prev + 1) % total
        : (prev - 1 + total) % total;
    });
  };

  return (
    <div className="w-full flex flex-col items-center text-center pt-16 pb-24">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
        Sua chave para o mundo.
      </h1>
      <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
        All seamlessly brought to you inside a card and app thats as intuitive, as it is powerful.
      </p>

      <div className="relative w-full max-w-3xl h-[400px] mb-8">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          <button 
            onClick={() => changeCard("prev")} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            aria-label="Previous card"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            {cardPaths.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-gray-800 scale-125' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={() => changeCard("next")} 
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            aria-label="Next card"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <div className="bg-gradient-to-r from-gray-900 to-black text-white py-2 px-6 rounded-full font-semibold">
          Black Card
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white py-2 px-6 rounded-full font-semibold">
          Gold Card
        </div>
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 rounded-full font-semibold">
          Blue Card
        </div>
      </div>
    </div>
  );
}
