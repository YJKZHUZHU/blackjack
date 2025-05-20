export const preloadAudio = (url: string) => {
  const audio = new Audio(url);
  audio.preload = 'auto';
};