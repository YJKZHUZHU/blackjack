import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { userStore, useAddress, useLoading } from '@/store/user'
import { addUserGameData } from '@/api'
import Mask from '@/components/Mask';
import { getCards, getChipList, calculateHandValue, Card, GameState, MessageEnum, MAP_MESSAGE_IMG, MAP_MESSAGE_IMG_TOAST } from './help'
import ClickableImage from '@/components/ClickableImage';
import style from './index.module.scss'




const BlackjackGame: React.FC = () => {
  const address = useAddress()
  const chipList = getChipList();
  const balance = userStore(state => state.balance)
  const globalLoading = useLoading()
  const updateBalance = userStore(state => state.updateBalance)
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const handAudioRef = useRef<HTMLAudioElement | null>(null);

  const timer = useRef<NodeJS.Timeout>(null)

  const timer1 = useRef<NodeJS.Timeout>(null)

  const [visible, setVisible] = useState(false)

  const [toastInfo, setToastInfo] = useState('')

  const [message, setMessage] = useState(MessageEnum.NULL)

  const [showMessage, setShowMessage] = useState(false)

  const [sourceBet, setSourceBet] = useState('')

  const [isPlayAgain, setIsPlayAgain] = useState(false)

  const [loading, setLoading] = useState(false)

  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [[]],
    dealerHand: [],
    currentHand: 0,
    bet: 0,
    gameOver: true,
    canDouble: false,
    canSplit: false,
  });

  useEffect(() => {
    const audioWin = new Audio('/audio/win.m4a');
    const audioHand = new Audio('/audio/handOne.mp3');
    audioWin.preload = 'auto';
    audioHand.preload = 'auto'
    audioHand.playbackRate = 2
    winAudioRef.current = audioWin;
    handAudioRef.current = audioHand
    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  const pending = async (timing: number = 1000) => {
    // handAudioRef.current?.play()
    setLoading(true)
    await new Promise(resolve => timer1.current = setTimeout(resolve, timing)); // 模拟发牌延迟
    timer1.current && clearTimeout(timer1.current)
    setLoading(false)
    // handAudioRef.current?.pause()
  }


  // 初始化新游戏
  const startGame = async () => {
    if (globalLoading || loading) return
    if (state.bet <= 0) {
      setVisible(true)
      setToastInfo('Please place a bet')
      timer.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
      return
    }
    if (balance < state.bet) {
      setVisible(true)
      setToastInfo('not sufficient funds')
      timer.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
      return
    }
    setLoading(true)
    // 直接扣除
    const res = await addUserGameData({
      wallet: address,
      baseScores: state.bet,
      totalScores: state.bet,
      isDouble: 0,
      is21: 0,
      userCards: '',
      dealerCards: '',
      action: 1
    })

    updateBalance(res.data.data.userInfo.scores)

    setLoading(false)
    handAudioRef.current?.play()

    const deck = getCards().sort(() => Math.random() - 0.5); // 洗牌

    setMessage(MessageEnum.NULL)
    setShowMessage(false)
    setState(prev => ({
      ...prev,
      deck,
      playerHand: [deck.splice(0, 1)],
      dealerHand: deck.splice(0, 1),  // 隐藏庄家明牌
      gameOver: false,
      canDouble: true
    }));
    await pending()
    handAudioRef.current?.play()
    setState(prev => {
      const playerHand = [[...deck.splice(0, 1), ...prev.playerHand[0]]]
      const dealerHand = [...prev.dealerHand, ...deck.splice(0, 1).map(item => ({ ...item, hidden: true })),]
      return {
        ...prev,
        deck,
        playerHand,
        dealerHand,
        gameOver: false,
        canDouble: true,
        canSplit: playerHand[0].length === 2 &&
          playerHand[0][0].name === playerHand[0][1].name,
      }
    });

    if (!isPlayAgain) {
      setIsPlayAgain(true)
    }
  };

  // 玩家操作：要牌
  const hit = async () => {
    if (state.gameOver || loading) return;

    handAudioRef.current?.play()

    const newPlayerHand = [...state.playerHand];
    newPlayerHand[state.currentHand].push(state.deck[0]);

    const newDeck = [...state.deck.slice(1)];
    const handValue = calculateHandValue(newPlayerHand[state.currentHand]);


    setState(prev => ({
      ...prev,
      deck: newDeck,
      playerHand: newPlayerHand,
      canDouble: false,
      canSplit: false,
    }));

    await pending()


    let newMessage = MessageEnum.NULL;
    let gameOver = false;
    let bet = state.bet;

    if (handValue > 21) {
      // newMessage = 'Bust! Player loses!';
      // 玩家爆牌直接输掉,庄家赢
      newMessage = MessageEnum.DEALER_WON
      gameOver = true;
      bet = 0
      setState(prev => ({
        ...prev,
        dealerHand: prev.dealerHand.map(item => ({ ...item, hidden: false })),
      }));

      // await pending(1000)
      // 庄家赢
      setLoading(true)
      const res = await addUserGameData({
        wallet: address,
        baseScores: 0,
        totalScores: 0,
        isDouble: 0,
        is21: 0,
        ...formatCards(),
        action: 1
      })
      updateBalance(res.data.data.userInfo.scores)
      setLoading(false)
    }

    setMessage(newMessage)
    setShowMessage(newMessage !== MessageEnum.NULL)

    setState(prev => ({
      ...prev,
      bet,
      gameOver,
      canDouble: false,
      canSplit: false,
    }));

    if (newMessage !== MessageEnum.NULL) {
      timer.current = setTimeout(() => {
        setShowMessage(false)
      }, 1000)
    }
  };

  // 玩家操作：停牌
  const stand = async () => {
    if (state.gameOver || loading) return
    const dealerHand: Card[] = [...state.dealerHand].map(item => ({ ...item, hidden: false }));
    handAudioRef.current?.play()
    setState((prev) => {
      return {
        ...prev,
        dealerHand: dealerHand, // 显示庄家明牌
      }
    })

    // 庄家拿牌直到点数≥17
    while (calculateHandValue(dealerHand) < 17) {
      await pending()
      handAudioRef.current?.play()
      // dealerHand.push(state.deck[0]);
      // const newDeck = [...state.deck.slice(1)];
      dealerHand.push(state.deck[0]);
      state.deck.shift();

      setState(prev => ({
        ...prev,
        dealerHand,
      }));

    }

    const dealerValue = calculateHandValue(dealerHand);
    const playerValues = state.playerHand.map(hand => calculateHandValue(hand));

    // 是否21点 是21点 1.5倍赔率
    const is21 = playerValues.reduce((memo, item) => memo += item, 0) === 21
    let newMessage = MessageEnum.NULL;
    let baseScores = 0
    let action: 0 | 1 | 2 = 2 // 0 加积分 1 减积分 平局 2


    // let balanceChange = 0;

    playerValues.forEach((value) => {
      if (value > 21) {
        //  庄家爆牌，玩家直接赢
        newMessage = MessageEnum.PLAYER_WON
        baseScores = is21 ? state.bet * 2 * 1.5 : state.bet * 2
        action = 0
        // balanceChange -= state.bet;
      } else if (dealerValue > 21 || value > dealerValue) {
        newMessage = MessageEnum.PLAYER_WON
        baseScores = is21 ? state.bet * 2 * 1.5 : state.bet * 2
        action = 0
        // balanceChange += state.bet;
      } else if (value < dealerValue) {
        newMessage = MessageEnum.DEALER_WON
        baseScores = 0
        action = 2
        // balanceChange -= state.bet;
      } else {
        // 平局
        newMessage = MessageEnum.PUSH
        baseScores = state.bet
        action = 0
      }
    });

    await pending(1000)

    setLoading(true)

    const res = await addUserGameData({
      wallet: address,
      baseScores,
      totalScores: baseScores,
      isDouble: 0,
      is21: is21 ? 1 : 0,
      ...formatCards(),
      action
    })

    setMessage(newMessage)
    // @ts-ignore
    if (newMessage === MessageEnum.PLAYER_WON) {
      winAudioRef.current?.play()
    }

    setShowMessage(newMessage !== MessageEnum.NULL)
    setState(prev => ({
      ...prev,
      bet: 0,
      gameOver: true,
    }));
    setLoading(false)
    updateBalance(res.data.data.userInfo.scores)

    if (newMessage !== MessageEnum.NULL) {
      timer.current = setTimeout(() => {
        setShowMessage(false)
        winAudioRef.current?.pause()
      }, 1000)
    }
  };

  const formatCards = () => {
    return {
      userCards: state.playerHand.flat().map(item => `${item.suit}-${item.name}`).join(),
      dealerCards: state.dealerHand.map(item => `${item.suit}-${item.name}`).join()
    }
  }

  // 玩家操作：双倍下注
  const double = async () => {
    if (!state.canDouble || loading) return

    if (balance < state.bet) {
      setVisible(true)
      setToastInfo('not sufficient funds')
      timer.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
      return
    }

    setLoading(true)
    // 直接扣除
    const res = await addUserGameData({
      wallet: address,
      baseScores: state.bet,
      totalScores: state.bet,
      isDouble: 1,
      is21: 0,
      ...formatCards(),
      action: 1
    })

    setState(prev => ({
      ...prev,
      bet: prev.bet * 2,
      canDouble: false,
    }));
    updateBalance(res.data.data.userInfo.scores)
    setLoading(false)
    // updateBalance(balance - state.bet)
  };

  // 玩家操作：分牌
  const split = () => {
    if (!state.canSplit || state.gameOver) return
    const newPlayerHand = [...state.playerHand];
    const splitCards = newPlayerHand.splice(state.currentHand, 1)[0];

    newPlayerHand.unshift([splitCards[0], state.deck[0]]);
    newPlayerHand.unshift([splitCards[1], state.deck[1]]);

    updateBalance(balance - state.bet)

    setState(prev => ({
      ...prev,
      playerHand: newPlayerHand,
      deck: prev.deck.slice(2),
      bet: prev.bet * 2,
      canSplit: false,
      canDouble: true,
    }));
  };

  const onBet = (item: { id: number, value: number, src: string }) => {
    setState({ ...state, bet: item.value })
    setSourceBet(item.src)
  }



  const renderChipList = () => {
    const dealerValue = calculateHandValue(state.dealerHand);
    // 先计算第一幅
    const playerValue = calculateHandValue(state.playerHand[0]);
    return (
      <div className={classNames(style.gameOver, 'flex flex-col justify-center items-center')}>
        {
          isPlayAgain ? (
            <div className={style.gameStatusContainer}>
              {
                message !== MessageEnum.NULL && <Image className=' mt-[-20px]' src={MAP_MESSAGE_IMG[message]} alt='' width={158} height={42} />
              }

              <div className={style.gameStatusContainerCard}>
                <div className=' flex items-center gap-[10px]'>
                  <Image src="/img/dealer.png" alt='' width={76} height={34} />
                  <div className={style.score}>{dealerValue}</div>
                </div>
                <div className=' flex items-center gap-[10px]'>
                  <Image src="/img/player.png" alt='' width={76} height={34} />
                  <div className={style.score}>{playerValue}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Image src='/img/gameTitle.png' width={286} height={42} alt='' />
              <div className={style.desc}>No risk, no thrill. Stack your chips and make it count.</div>
            </>
          )
        }

        <div className='flex items-center justify-between w-full my-[30px]'>
          {
            chipList.map(item => <ClickableImage
              className="cursor-pointer"
              onClick={() => onBet(item)}
              key={item.id}
              soundSrc='/audio/bet.m4a'
              width={60}
              height={60}
              src={item.src}
            />)
          }
        </div>
        <div className={style.balanceContainer}>
          <div className={style.balance}>
            {state.bet}
          </div>
          <Image src='/img/balance.png' alt='' width={35} height={26} />
          <Image className='absolute bottom-[-19px]' src='/img/mobile/masonry.png' width={28} height={21} alt='' />
        </div>

        <ClickableImage
          className="cursor-pointer"
          onClick={startGame}
          width={214}
          height={91}
          src={isPlayAgain ? '/img/playAgain.png' : '/img/placeBet.png'} />

      </div>
    )
  }

  // 渲染手牌
  const renderHand = (hand: Card[], isDealer: boolean = false) => {
    const value = calculateHandValue(hand.filter(item => !item.hidden));
    return (
      <div className={classNames(style.cards, { [style.isPlayer]: !isDealer })}>

        {hand.map((card, index) => {
          const src = card?.hidden ? 'card_back.png' : card.src;
          const isFlipping = isDealer && hand.length === 2 && index === hand.length - 1 && !card.hidden;
          return (
            <div key={index} className={classNames(style.card, { [style.ani]: card?.hidden || index !== 1, [style.flipped]: isFlipping })}>
              <Image src={`/img/${src}`} alt="playing card" width={66} height={88} priority />
            </div>
          )
        })}

        <div className={style.cardValues}>{value}</div>

        {
          isDealer &&
          <Image priority src={'/img/card_back.png'} alt="playing card" width={66} height={88} />
        }

      </div>
    );
  };

  return (
    <div data-aos="fade-up" className={classNames(style.gameLayout)}>
      {
        state.gameOver ? renderChipList() : (
          <div className={style.gameContainer}>
            <div className={classNames(style.hands)}>
              <div className={classNames(style['dealer-hand'])}>
                <Image className=' mb-[20px]' src='/img/dealer.png' alt='' width={59} height={26} />
                {renderHand(state.dealerHand, true)}
              </div>

              <div className={classNames(style['player-hands'])}>
                <Image className=' mb-[20px]' src='/img/player.png' alt='' width={59} height={29} />
                <div className='flex gap-[20px]'>
                  {state.playerHand.map((hand, index) => (
                    <div key={index} className={classNames(style['user-handle'], { [style.inActive]: index !== state.currentHand })}>
                      {renderHand(hand)}
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className={style.operationContainer}>
              <div className={style.betContainer}>
                <Image className=' cursor-pointer' src={sourceBet} alt='' width={40} height={40} />
                <div className={style.bet}>{state.bet}</div>
              </div>
              <div className={style.buttonContainer}>
                <div className=' flex gap-[20px]'>
                  <ClickableImage
                    className="cursor-pointer"
                    onClick={hit}
                    width={100}
                    height={50}
                    src="/img/hit.png" />
                  <ClickableImage
                    className="cursor-pointer"
                    onClick={stand}
                    width={100}
                    height={50}
                    src="/img/stand.png" />
                </div>
                <div className=' flex gap-[20px]'>
                  <ClickableImage
                    className="cursor-pointer"
                    onClick={double}
                    width={100}
                    height={50}
                    src="/img/double.png" />
                  <ClickableImage
                    className="cursor-pointer"
                    onClick={split}
                    width={100}
                    height={50}
                    src="/img/split.png" />
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        visible && <Mask
          contentClassName={style.toastMaskContainer}
          style={{ background: 'transparent', alignItems: 'flex-start', marginTop: '60px' }}
        >
          <div className={style.toastMaskContent}>
            {toastInfo}
          </div>
        </Mask>
      }
      {
        showMessage && <Mask
          contentClassName={style.toastMaskContainer}
          style={{ background: 'transparent' }}
        >
          <Image src={MAP_MESSAGE_IMG_TOAST[message]} alt='' width={250} height={50} />

        </Mask>
      }
    </div>
  );
};

export default BlackjackGame;