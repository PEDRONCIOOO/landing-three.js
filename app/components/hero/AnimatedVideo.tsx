'use client';

import { useRef, useEffect, useState } from 'react';

interface AnimatedVideoProps {
  videoSrc?: string;
  className?: string;
  priority?: boolean;
}

export default function AnimatedVideo({
  videoSrc = "/animated.mp4",
  className = "",
  priority = true,
}: AnimatedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoaded);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
    };
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center overflow-hidden relative ${className}`}>
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        loop 
        playsInline
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        {...(priority ? { fetchpriority: "high" } as React.HTMLAttributes<HTMLVideoElement> : {})}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-gray-300"></div>
        </div>
      )}
    </div>
  );
}