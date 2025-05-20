import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { userStore } from '@/store/user';
import { useAudio } from '@/components/BackgroundMusic';


const usePersistentWallet = () => {
  const { play } = useAudio();
  const init = userStore((state) => state.init);
  const updateWallet = userStore((state) => state.updateWallet);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [isAutoConnecting, setIsAutoConnecting] = useState(true);

  // 自动连接逻辑
  useEffect(() => {
    if (typeof window === 'undefined' || !window.solana?.isPhantom) {
      setIsAutoConnecting(false);
      return;
    }

    const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');

    // 只有当上次连接的是Phantom时才自动连接
    if (lastConnectedWallet === 'phantom') {
      const autoConnect = async () => {
        try {
          // onlyIfTrusted: true 表示只在用户之前授权过的情况下静默连接
          const response = await window.solana?.connect({ onlyIfTrusted: true });
          setPublicKey(response?.publicKey);
          init(response?.publicKey.toString())
        } catch (error) {
          console.log('自动连接失败，需要用户手动授权', error);
          localStorage.removeItem('lastConnectedWallet');
        } finally {
          setIsAutoConnecting(false);
        }
      };

      autoConnect();
    } else {
      setIsAutoConnecting(false);
    }

    // 监听账户变化
    const handleAccountChanged = (newPublicKey: PublicKey | null) => {
      setPublicKey(newPublicKey);
      if (newPublicKey) {
        init(newPublicKey.toString())
        localStorage.setItem('lastConnectedWallet', 'phantom');
      } else {
        localStorage.removeItem('lastConnectedWallet');
      }
    };

    window.solana.on('accountChanged', handleAccountChanged);

    return () => {
      window.solana?.off('accountChanged', handleAccountChanged);
    };
  }, []);

  // 手动连接函数
  const connectWallet = async () => {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/download', '_blank');
      return;
    }
    try {
      const response = await window.solana.connect();
      setPublicKey(response.publicKey);
      play()
      init(response.publicKey.toString())
      localStorage.setItem('lastConnectedWallet', 'phantom');
    } catch (error) {
      window.open('https://phantom.app/download', '_blank');
      console.error('连接钱包失败:', error);
    }
  };

  // 断开连接函数
  const disconnectWallet = async () => {
    if (window.solana) {
      try {
        await window.solana.disconnect();
      } catch (error) {
        console.error('断开连接失败:', error);
      } finally {
        // pause()
        updateWallet('')
        setPublicKey(null);
        localStorage.removeItem('lastConnectedWallet');
      }
    }
  };

  return {
    publicKey,
    isConnected: !!publicKey,
    isAutoConnecting,
    connectWallet,
    disconnectWallet
  };
};

export default usePersistentWallet;