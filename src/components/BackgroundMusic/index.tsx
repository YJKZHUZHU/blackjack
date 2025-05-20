'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { userStore } from '@/store/user';
import useThrottle from '@/hooks/useThrottle';
import style from './index.module.scss';


type AudioContextType = {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  volume: number;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const isMobile = userStore(state => state.isMobile);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/audio/bg.m4a');
    audioRef.current.loop = true;
    // audioRef.current.muted = true
    audioRef.current.volume = volume;

    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.muted = false;
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    };

    const events = ['click', 'touchstart', 'keydown'];

    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
      audioRef.current?.pause();
      setIsPlaying(false);
      audioRef.current = null;
    };
  }, []);

  const play = () => {
    audioRef.current?.play()
      .then(() => setIsPlaying(true))
      .catch(error => console.log('播放失败:', error));
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleVolume = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const onAudioPlay = useThrottle(() => {
    isPlaying ? pause() : play();
  }, 500)

  return (
    <AudioContext.Provider
      value={{ play, pause, setVolume: handleVolume, isPlaying, volume }}
    >
      <div className={classNames(style.audioControl, { [style.mobile]: isMobile })} onClick={onAudioPlay}>
        <Image className={classNames({ [style.rotatingImage]: isPlaying })} src={isPlaying ? '/img/audioStart.png' : '/img/audioStop.png'} width={32} height={32} alt='' />
      </div>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

