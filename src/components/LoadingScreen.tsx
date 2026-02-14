'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  animationPath?: string;
}

export default function LoadingScreen({ 
  isLoading, 
  message = 'Loading...',
  animationPath = '/animation/Train Animation.lottie/a/Main Scene.json'
}: LoadingScreenProps) {
  const [animationData, setAnimationData] = useState(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    // Load animation immediately when component mounts
    const loadAnimation = async () => {
      try {
        // Use preloaded resource (will be in cache if preload worked)
        const response = await fetch(animationPath, {
          cache: 'force-cache'
        });
        const data = await response.json();
        setAnimationData(data);
        setAnimationLoaded(true);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setAnimationLoaded(true); // Still mark as loaded even if failed
      }
    };

    loadAnimation();
  }, [animationPath]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="w-80 h-80 sm:w-96 sm:h-96">
        {animationLoaded && animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-stone-600 text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
