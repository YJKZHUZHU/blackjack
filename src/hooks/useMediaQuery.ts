'use client';
import { userStore } from '@/store/user';
import { useEffect } from 'react';

export function useMediaQuery(query: string) {
  const updateIsMobile = userStore(state => state.updateIsMobile);
  const isMobile = userStore(state => state.isMobile)

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => updateIsMobile(media.matches);
    updateIsMobile(media.matches)
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile

}