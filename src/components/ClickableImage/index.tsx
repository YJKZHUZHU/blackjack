'use client'
import { useState, useRef, useEffect, CSSProperties, MouseEventHandler, MouseEvent } from 'react';
import Image from 'next/image';
import useThrottle from '@/hooks/useThrottle';
import classNames from 'classnames';
import { useAudio } from '@/components/BackgroundMusic'
import styles from './index.module.scss';


interface ClickableImageProps {
  className?: string
  src: string;
  width: number
  height: number
  playbackRate?: number;
  soundSrc?: string;
  scale?: number;
  animationDuration?: number;
  onClick?: MouseEventHandler<HTMLImageElement> | undefined
}

const ClickableImage = ({
  className,
  src,
  soundSrc = '/audio/click.m4a',
  scale = 0.95,
  animationDuration = 0.2,
  playbackRate = 2,
  width,
  height,
  onClick
}: ClickableImageProps) => {
  const { isPlaying } = useAudio()
  // 动画状态控制
  const [isActive, setIsActive] = useState(false);

  // 音频相关引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canPlayRef = useRef(false);
  const timer = useRef<NodeJS.Timeout>(null)


  // 初始化音频
  useEffect(() => {
    const audio = new Audio(soundSrc);
    audio.preload = 'auto';
    audio.playbackRate = playbackRate
    audioRef.current = audio;

    // 处理移动端触摸反馈
    const handleFirstInteraction = () => {
      canPlayRef.current = true;
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      audio.remove();
      timer.current && clearTimeout(timer.current)
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [soundSrc]);

  // 处理点击事件
  const handleClick = useThrottle(async (e: MouseEvent<HTMLImageElement>) => {
    // 播放音效
    if (audioRef.current && isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current?.play().catch(console.error);
    }
    // 触发动画
    setIsActive(true);

    // 重置动画状态
    await new Promise((resolve) => timer.current = setTimeout(() => {
      setIsActive(false)
      resolve(null)
    }, animationDuration * 800)); // 模拟发牌延迟
    onClick?.(e)
  }, 200);

  // 动态样式
  const imageStyle: CSSProperties = {
    transform: isActive ? `scale(${scale})` : 'scale(1)',
    transition: `transform ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  };

  return (
    <Image
      width={width}
      height={height}
      src={src}
      className={classNames(styles.clickableImage, className)}
      style={imageStyle}
      onClick={handleClick}
      draggable="false"
      alt="clickable element"
    />
  );
};

export default ClickableImage;