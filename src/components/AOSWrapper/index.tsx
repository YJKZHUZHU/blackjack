// components/AOSWrapper.tsx
'use client'; // 必须标记为客户端组件

import { useEffect } from 'react';
import AOS, { easingOptions } from 'aos';
import 'aos/dist/aos.css';

export default function AOSWrapper({
  children,
  offset = 120, // 触发动画的滚动偏移量
  delay = 0,     // 全局动画延迟
  duration = 400,// 动画持续时间
  easing = 'ease'// 动画曲线
}: {
  children: React.ReactNode;
  offset?: number;
  delay?: number;
  duration?: number;
  easing?: easingOptions;
}) {
  useEffect(() => {
    AOS.init({
      once: true,         // 动画只执行一次
      offset,
      delay,
      duration,
      easing
    });

    return () => {
      AOS.refresh(); // 组件卸载时刷新检测
    };
  }, []);

  return <>{children}</>;
}