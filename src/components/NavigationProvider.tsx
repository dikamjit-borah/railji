'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { preloadAnimation } from '@/lib/animationCache';

// Dynamically import LoadingScreen so lottie-react is NOT included in the
// initial JS bundle — it is only fetched the first time a navigation starts.
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

interface NavigationContextType {
  isNavigating: boolean;
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  navigate: () => {},
});

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const prevPathRef = useRef(pathname);

  // Preload animations only on the first user interaction (pointer, touch, or key).
  // This ensures animation JSON is never downloaded on pages where the user
  // doesn't navigate, while still being warm in the cache before the loading
  // screen appears.
  useEffect(() => {
    const preload = () => {
      preloadAnimation('/animation/Train Animation.lottie/a/Main Scene.json');
      preloadAnimation('/animation/Trainbasic.lottie/a/Scene.json');
      // Remove listeners after first trigger — we only need to preload once.
      window.removeEventListener('pointerdown', preload);
      window.removeEventListener('touchstart', preload);
      window.removeEventListener('keydown', preload);
    };

    window.addEventListener('pointerdown', preload, { once: true, passive: true });
    window.addEventListener('touchstart', preload, { once: true, passive: true });
    window.addEventListener('keydown', preload, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', preload);
      window.removeEventListener('touchstart', preload);
      window.removeEventListener('keydown', preload);
    };
  }, []);

  // When pathname changes, navigation is complete — hide loader after new page paints
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      // Wait two animation frames so the new page's own LoadingScreen paints
      // before the nav overlay disappears — eliminates the blank flash between them
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsNavigating(false);
        });
      });
    } else if (isNavigating) {
      // Pathname didn't change (e.g. middleware redirect back to same page);
      // reset the loader so it doesn't get stuck.
      setIsNavigating(false);
    }
  }, [pathname, searchParams]);

  // Safety timeout: if pathname hasn't changed within 5 s of starting navigation
  // (e.g. middleware redirected back to the same page), dismiss the loader.
  useEffect(() => {
    if (!isNavigating) return;
    const timeout = setTimeout(() => setIsNavigating(false), 5000);
    return () => clearTimeout(timeout);
  }, [isNavigating]);

  // Intercept all anchor clicks (covers <Link> components)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor || !anchor.href) return;

      try {
        const url = new URL(anchor.href);
        const isSameOrigin = url.origin === window.location.origin;
        const isDifferentPath = url.pathname !== window.location.pathname;
        const isHashOnly = anchor.href.startsWith('#') || (url.pathname === window.location.pathname && url.hash);
        const hasTarget = anchor.target && anchor.target !== '_self';

        if (isSameOrigin && isDifferentPath && !isHashOnly && !hasTarget) {
          setIsNavigating(true);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  const navigate = useCallback((href: string) => {
    setIsNavigating(true);
    router.push(href);
  }, [router]);

  return (
    <NavigationContext.Provider value={{ isNavigating, navigate }}>
      {children}
      <LoadingScreen isLoading={isNavigating} />
    </NavigationContext.Provider>
  );
}
