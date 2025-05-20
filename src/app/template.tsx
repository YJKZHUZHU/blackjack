'use client'
import dynamic from 'next/dynamic';

const AOSWrapper = dynamic(
  () => import('@/components/AOSWrapper'),
  { ssr: false } // 禁用服务端渲染
);



export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <AOSWrapper>
      {children}
    </AOSWrapper>
  )
}