import { useEffect, useRef, useState } from 'react';
import { userStore, useAddress, useLoading, useSignature } from '@/store/user'
import { getChipList, Card, SocketGameState, GameActions, GameResultType, updateHandWithoutDuplicates, sleep, processCardsSequentially } from './help'
import useWebSocket from 'react-use-websocket';
import { debounce } from 'lodash-es'


export const useGame = () => {
  // ==================== 状态管理 ====================
  // 用户相关状态
  const address = useAddress();
  const signature = useSignature();
  const balance = userStore(state => state.balance);
  const updateBalance = userStore(state => state.updateBalance);
  const globalLoading = useLoading();

  // 音频引用
  const winAudioRef = useRef<HTMLAudioElement>(null);
  const handAudioRef = useRef<HTMLAudioElement>(null);

  // 游戏状态
  const [playerHands, setPlayerHands] = useState<Card[][]>([[]]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerPoints, setDealerPoints] = useState(0);
  const [playerPoints, setPlayerPoints] = useState([0, 0]);
  const [gameOver, setGameOver] = useState<boolean | null>(null);
  const [gameResult, setGameResult] = useState<GameResultType>('');
  const [currentHand, setCurrentHand] = useState(0);
  const [canDouble, setCanDouble] = useState(false);
  const [canSplit, setCanSplit] = useState(false);
  const [bet, setBet] = useState(0);
  const [playBet, setPlayBet] = useState(0)

  // UI 相关状态
  const [visible, setVisible] = useState(false);
  const [toastInfo, setToastInfo] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [sourceBet, setSourceBet] = useState('');
  const [isPlayAgain, setIsPlayAgain] = useState(false);
  const [gameOverUI, setGameOverUI] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef<NodeJS.Timeout>(null);
  const debounceTime = 1000


  const chipList = getChipList();

  // ==================== WebSocket 处理 ====================
  const { sendMessage: handleSendMessage, lastMessage } = useWebSocket('wss://bj-api.luckeyboard.com/socket', {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
    onOpen: () => console.log('连接成功'),
    onClose: () => console.log('连接关闭'),
    onError: (event) => console.error('发生错误:', event),
    onMessage: (event) => {
      console.log('原始消息:', event.data);
    },
    retryOnError: true,
  });



  // const send = useCallback(
  //   debounce(handleSendMessage, 500),
  //   []
  // );

  const handleMessage = async (event: any) => {
    try {
      // if (loading) return
      setLoading(true)
      const newMessage: SocketGameState = JSON.parse(event.data);

      // 更新全局状态
      updateBalance(newMessage.d.balance);
      setCanDouble(newMessage.d.canDouble);
      setCanSplit(newMessage.d.canSplit);
      setCurrentHand(newMessage.d.currentHand);
      setGameOverUI(newMessage.d.gameOver)
      setPlayBet(newMessage.d.bet)
      setGameResult('')
      setGameOver(false)

      // 处理不同游戏阶段
      switch (newMessage.d.action) {
        case 'start':
          await handleGameStart(newMessage);
          break;
        case 'hit':
        case 'stand':
          await handlePlayerAction(newMessage);
          break;
        default:
          handleDefaultAction(newMessage);
      }
      setLoading(false)
      // 最终状态更新
      await sleep(1500);
      setDealerPoints(newMessage.d.dealerPoints);
      setPlayerPoints(newMessage.d.playerPoints);
      setGameOver(newMessage.d.gameOver);
      setGameResult(newMessage.d.gameResult);
      
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }



  // ==================== 游戏逻辑处理 ====================
  /** 处理游戏开始 */
  const handleGameStart = async (message: SocketGameState) => {
    handAudioRef.current?.play();

    // 初始化玩家和庄家手牌
    setPlayerHands([[message.d.playerHands[0][0]]]);
    setDealerHand([message.d.dealerHand[0]]);

    // 延迟显示完整手牌
    await sleep();
    handAudioRef.current?.play();
    setPlayerHands(message.d.playerHands);
    setDealerHand(message.d.dealerHand.slice(0, 2));

    if (!isPlayAgain) setIsPlayAgain(true);
    // 处理庄家剩余手牌
    const remainingCards = message.d.dealerHand.slice(2);
    await processCardsSequentially(remainingCards, (card) => {
      handAudioRef.current?.play();
      setDealerHand(prev => updateHandWithoutDuplicates(prev, card));
    });


  };

  /** 处理玩家操作（要牌/停牌） */
  const handlePlayerAction = async (message: SocketGameState) => {
    handAudioRef.current?.play();
    setPlayerHands(message.d.playerHands);
    setDealerHand(message.d.dealerHand.slice(0, 2));

    const remainingCards = message.d.dealerHand.slice(2);
    await processCardsSequentially(remainingCards, (card) => {
      handAudioRef.current?.play();
      setDealerHand(prev => updateHandWithoutDuplicates(prev, card));
    });
  };

  /** 处理默认动作 */
  const handleDefaultAction = (message: SocketGameState) => {
    setPlayerHands(message.d.playerHands);
    setDealerHand(message.d.dealerHand);
  };

  // ==================== 用户操作 ====================
  /** 开始游戏 */
  const startGame = debounce(() => {
    if (globalLoading) return;

    // 验证下注金额
    if (bet <= 0) return showToast('Please place a bet');
    if (balance < bet) return showToast('not sufficient funds');

    sendMessage('start', bet);
  }, debounceTime);

  /** 玩家操作：要牌 */
  const hit = debounce(() => {
    if (gameOverUI || loading) return;
    sendMessage('hit')
  }, debounceTime)

  /** 玩家操作：停牌 */
  const stand = debounce(() => {
    if (gameOverUI || loading) return
    sendMessage('stand')
  }, debounceTime);

  /** 玩家操作：双倍下注 */
  const double = debounce(() => {
    if (!canDouble || gameOverUI || loading) return

    if (balance < bet) {
      setVisible(true)
      setToastInfo('not sufficient funds')
      timer.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
      return
    }

    sendMessage('double')

  }, debounceTime);

  /** 玩家操作：分牌 */
  const split = debounce(() => {
    if (!canSplit || gameOverUI || loading) return
    sendMessage('split')
  }, debounceTime);

  const onBet = (item: { id: number, value: number, src: string }) => {
    setBet(item.value)
    setSourceBet(item.src)
  }

  /** 显示提示信息 */
  const showToast = (message: string) => {
    setVisible(true);
    setToastInfo(message);
    timer.current = setTimeout(() => setVisible(false), 1000);
  };


  // 发送消息
  const sendMessage = (action: GameActions, bet: number = 0) => {
    try {
      const message: any = {
        type: 'game',
        action: action,
        address: address,
        sign: signature,

      };
      if (bet !== null) {
        message.bet = bet;
      }
      handleSendMessage(JSON.stringify(message));
    } catch (error) {
      console.log('error', error)
    }

  }


  useEffect(() => {
    if (lastMessage) {
      try {
        handleMessage(lastMessage)
      } catch (error) {
        console.error('消息解析失败:', error);
      }
    }
  }, [lastMessage])

  useEffect(() => {
    const audioWin = new Audio('/audio/win.m4a');
    const audioHand = new Audio('/audio/handOne.mp3');
    audioWin.preload = 'auto';
    audioHand.preload = 'auto'
    audioHand.playbackRate = 2
    winAudioRef.current = audioWin;
    handAudioRef.current = audioHand

    return () => {
      audioWin.pause();
      audioHand.pause();
      audioWin.src = '';
      audioHand.src = '';
      // send.cancel()
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (gameOver && gameResult) {
      setShowMessage(true)
      if (gameResult === 'win') {
        winAudioRef.current?.play()
      }
      sleep().then(() => {
        setShowMessage(false)
      })
    }
  }, [gameOver, gameResult])

  return {
    playerHands,
    dealerHand,
    dealerPoints,
    playerPoints,
    currentHand,
    visible,
    toastInfo,
    showMessage,
    sourceBet,
    chipList,
    isPlayAgain,
    gameResult,
    bet,
    playBet,
    gameOver,
    gameOverUI,
    canDouble,
    canSplit,
    startGame,
    hit,
    stand,
    double,
    split,
    loading,
    onBet
  }

};

export default useGame;

