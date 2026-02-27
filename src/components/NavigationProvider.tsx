'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import LoadingScreen, { preloadAnimation } from '@/components/LoadingScreen';

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

  // Kick off animation fetches immediately so both are cached before any navigation
  useEffect(() => {
    preloadAnimation('/animation/Train Animation.lottie/a/Main Scene.json');
    preloadAnimation('/animation/Trainbasic.lottie/a/Scene.json');
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
    }
  }, [pathname, searchParams]);

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
