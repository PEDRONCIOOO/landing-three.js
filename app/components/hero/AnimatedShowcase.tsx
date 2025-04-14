'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { motion } from 'framer-motion'

interface Phone3DProps {
  onLoad?: () => void;
}

export default function Phone3D({ onLoad }: Phone3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sceneRef = useRef<{
    scene?: THREE.Scene,
    camera?: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer,
    controls?: OrbitControls,
    phone?: THREE.Group,
    idleTimeline?: gsap.core.Timeline,
  }>({})

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    const scene = new THREE.Scene()
    scene.background = null
    sceneRef.current.scene = scene

    const width = mountElement.clientWidth
    const height = mountElement.clientHeight

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    sceneRef.current.camera = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountElement.appendChild(renderer.domElement)
    sceneRef.current.renderer = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.6
    controls.enableZoom = false
    controls.enablePan = false

    // Add these lines to restrict rotation to horizontal only
    controls.minPolarAngle = Math.PI / 2; // 90 degrees
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees

    // Optional: If you want to limit horizontal rotation range as well
    controls.minAzimuthAngle = -Math.PI / 4; // -45 degrees
    controls.maxAzimuthAngle = Math.PI / 4;  // 45 degrees

    sceneRef.current.controls = controls

    const addLights = () => {
      const ambient = new THREE.AmbientLight(0xfbfbfb, 0.8)
      const front = new THREE.DirectionalLight(0xffffff, 1.0)
      const right = new THREE.DirectionalLight(0xffffff, 0.6)
      const left = new THREE.DirectionalLight(0xffffff, 0.6)
      const top = new THREE.DirectionalLight(0xffffff, 0.7)
      const bottom = new THREE.DirectionalLight(0xffffff, 0.5)

      front.position.set(0, 0, 10)
      right.position.set(10, 0, 0)
      left.position.set(-10, 0, 0)
      top.position.set(0, 5, 5)
      bottom.position.set(0, -10, 3)

      scene.add(ambient, front, right, left, top, bottom)
    }

    addLights()

    const loader = new GLTFLoader()
    const originalState = {
      rotationX: 0,
      rotationY: Math.PI,
      rotationZ: 0,
      positionY: -3.5,
      positionX: 0,
    }

    let resetTimeout: NodeJS.Timeout | null = null

    loader.load(
      '/mockup-celphone2.glb',
      (gltf) => {
        const phone = gltf.scene
        sceneRef.current.phone = phone

        const box = new THREE.Box3().setFromObject(phone)
        const center = box.getCenter(new THREE.Vector3())
        phone.position.sub(center)

        const size = box.getSize(new THREE.Vector3())
        const scale = 5 / Math.max(size.x, size.y, size.z)
        phone.scale.setScalar(scale)

        phone.position.y = originalState.positionY
        phone.position.x = originalState.positionX
        phone.rotation.y = originalState.rotationY
        scene.add(phone)

        // Set loading to false and call the onLoad callback
        setIsLoading(false)
        if (onLoad) onLoad()

        startIdleAnimation(phone)

        animate()
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    )

    const startIdleAnimation = (phone: THREE.Group) => {
      if (sceneRef.current.idleTimeline) {
        sceneRef.current.idleTimeline.kill()
      }

      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { duration: 3.2, ease: 'power1.inOut' }
      })

      tl.to(phone.rotation, {
        y: originalState.rotationY + THREE.MathUtils.degToRad(10),
        x: THREE.MathUtils.degToRad(-3)
      }).to(phone.rotation, {
        y: originalState.rotationY - THREE.MathUtils.degToRad(10),
        x: THREE.MathUtils.degToRad(3)
      })

      sceneRef.current.idleTimeline = tl
    }

    // Also capture animationFrameId for proper cleanup
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      sceneRef.current.controls?.update()
      renderer.render(scene, camera)
    }

    const onStartInteraction = () => {
      if (resetTimeout) clearTimeout(resetTimeout)
      sceneRef.current.idleTimeline?.pause()
    }

    const onEndInteraction = () => {
      if (resetTimeout) clearTimeout(resetTimeout)

      resetTimeout = setTimeout(() => {
        const phone = sceneRef.current.phone
        if (!phone) return

        gsap.timeline()
          .to(phone.position, {
            x: originalState.positionX,
            y: originalState.positionY,
            duration: 0.6,
            ease: 'power2.out'
          })
          .to(phone.rotation, {
            x: originalState.rotationX,
            y: originalState.rotationY,
            z: originalState.rotationZ,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              phone.position.set(originalState.positionX, originalState.positionY, phone.position.z)
              phone.rotation.set(originalState.rotationX, originalState.rotationY, originalState.rotationZ)
              startIdleAnimation(phone)
            }
          }, '-=0.5')
      }, 500)
    }

    controls.addEventListener('start', onStartInteraction)
    controls.addEventListener('end', onEndInteraction)

    const resize = () => {
      const w = mountElement?.clientWidth || window.innerWidth
      const h = mountElement?.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', resize)
    resize()

    return () => {
      window.removeEventListener('resize', resize)
      controls.removeEventListener('start', onStartInteraction)
      controls.removeEventListener('end', onEndInteraction)
      
      // Cancel the animation frame
      cancelAnimationFrame(animationFrameId)

      // Store a reference to the phone and timeline for cleanup
      const phone = sceneRef.current.phone
      const idleTimeline = sceneRef.current.idleTimeline

      if (phone) {
        gsap.killTweensOf(phone.rotation)
        gsap.killTweensOf(phone.position)
      }

      if (idleTimeline) {
        idleTimeline.kill()
      }

      controls.dispose()
      renderer.dispose()
      
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement)
      }

      // Clear the scene ref to prevent memory leaks
      sceneRef.current = {}
    }
  }, [onLoad])

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-16 h-16 relative"
          >
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-3 rounded-full border-2 border-cyan-500 border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-6 rounded-full bg-cyan-500"
              animate={{ 
                scale: [0.8, 1, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
      <div
        ref={mountRef}
        className="w-full h-full absolute inset-0 flex items-center justify-center"
        style={{ cursor: isLoading ? 'default' : 'grab' }}
      />
    </div>
  )
}
