'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function Phone3D() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene,
    camera?: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer,
    controls?: OrbitControls,
    phone?: THREE.Group,
  }>({})

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene()
    scene.background = null
    sceneRef.current.scene = scene

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Camera with better position for dragging
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, -3, 5) // Position directly in front
    sceneRef.current.camera = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true // Better for screenshots
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)
    sceneRef.current.renderer = renderer

    // Orbit Controls for dragging
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // Add inertia for smoother dragging
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 1 // Adjust rotation speed
    controls.enableZoom = false // Disable zoom
    controls.enablePan = false // Disable panning
    sceneRef.current.controls = controls

    // Lights for better visibility
    const ambient = new THREE.AmbientLight(0xf3f3f3, 0.8)
    scene.add(ambient)
    
    // Front light to illuminate the screen
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0)
    frontLight.position.set(0, 0, 10)
    scene.add(frontLight)
    
    // Side lights for better edge definition
    const rightLight = new THREE.DirectionalLight(0xffffff, 0.6)
    rightLight.position.set(10, 0, 0)
    scene.add(rightLight)
    
    const leftLight = new THREE.DirectionalLight(0xffffff, 0.6)
    leftLight.position.set(-10, 0, 0)
    scene.add(leftLight)
    
    // Top light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.7)
    topLight.position.set(0, 0, 5)
    scene.add(topLight)
    
    // Bottom light
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.5)
    bottomLight.position.set(0, -10, 3)
    scene.add(bottomLight)

    // Load Model
    const loader = new GLTFLoader()
    loader.load(
      '/iphone.glb',
      (gltf) => {
        const phone = gltf.scene
        sceneRef.current.phone = phone

        // Center the model
        const box = new THREE.Box3().setFromObject(phone)
        const center = box.getCenter(new THREE.Vector3())
        phone.position.sub(center)
        
        // Scale appropriately
        const size = box.getSize(new THREE.Vector3())
        const scale = 3 / Math.max(size.x, size.y, size.z)
        phone.scale.setScalar(scale)

        scene.add(phone)
        
        // Auto-rotate slightly at the beginning to show it's interactive
        if (controls) {
          controls.autoRotate = true
          controls.autoRotateSpeed = 2
        }
      },
      undefined,
    )

    // Animation loop - just for controls update and rendering
    const animate = () => {
      requestAnimationFrame(animate)
      
      if (sceneRef.current.controls) {
        sceneRef.current.controls.update() // Required for damping to work
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const resize = () => {
      if (!sceneRef.current.camera || !sceneRef.current.renderer || !mountRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      sceneRef.current.camera.aspect = w / h
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(w, h)
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (sceneRef.current.controls) {
        sceneRef.current.controls.dispose()
      }
      if (renderer) renderer.dispose()
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'grab' }}
      />
    </div>
  )
}
