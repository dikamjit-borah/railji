'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

// Module-level cache — survives re-mounts, cleared only on full page reload
const animationCache = new Map<string, any>();

// Call this anywhere to start the fetch early (fire-and-forget)
export function preloadAnimation(
  animationPath = '/animation/Train Animation.lottie/a/Main Scene.json'
) {
  if (animationCache.has(animationPath)) return; // already cached
  fetch(animationPath, { cache: 'force-cache' })
    .then((r) => r.json())
    .then((data) => animationCache.set(animationPath, data))
    .catch(() => {});
}

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  animationPath?: string;
}

export default function LoadingScreen({
  isLoading,
  message = 'Loading...',
  animationPath = '/animation/Train Animation.lottie/a/Main Scene.json',
}: LoadingScreenProps) {
  // Lazy initialiser — reads from cache SYNCHRONOUSLY on first render.
  // If the animation was preloaded, this is already populated and no
  // useEffect / fetch round-trip is needed at all.
  const [animationData, setAnimationData] = useState<any>(
    () => animationCache.get(animationPath) ?? null
  );

  useEffect(() => {
    if (animationData) return; // already have it from cache

    const loadAnimation = async () => {
      try {
        const response = await fetch(animationPath, { cache: 'force-cache' });
        const data = await response.json();
        animationCache.set(animationPath, data); // save for next time
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setAnimationData({}); // prevent infinite spinner
      }
    };

    loadAnimation();
  }, [animationPath]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="w-80 h-80 sm:w-96 sm:h-96">
        {animationData && Object.keys(animationData).length > 0 ? (
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
