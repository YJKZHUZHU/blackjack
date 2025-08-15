'use client';
import MobileLayout from '@/components/Mobile/page';
import PCLayout from '@/components/PC/page'
import { useMediaQuery } from '@/hooks/useMediaQuery';


export default function Home() {
  const isMobile = useMediaQuery('(max-width: 539px)')

  return isMobile ? <MobileLayout /> : <PCLayout />
}
