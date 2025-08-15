import Image from 'next/image';
import classNames from 'classnames';
import Mask from '@/components/Mask';
import { calculateHandValue, Card, MAP_MESSAGE_IMG, MAP_MESSAGE_IMG_TOAST } from '@/hooks/useGame/help'
import ClickableImage from '@/components/ClickableImage';
import useGame from '@/hooks/useGame';
import style from './index.module.scss'



const BlackjackGame = () => {
  const {
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
  } = useGame()


  const renderChipList = () => {
    // const dealerValue = calculateHandValue(state.dealerHand);
    // // 先计算第一幅
    // const playerValue = calculateHandValue(state.playerHand[0]);
    return (
      <div className={classNames(style.gameOver, 'flex flex-col justify-center items-center')}>
        {
          isPlayAgain ? (
            <div className={style.gameStatusContainer}>
              {
                gameResult && <Image className={style.message} src={MAP_MESSAGE_IMG[gameResult]} alt='' width={158} height={42} />
              }

              <div className={style.gameStatusContainerCard}>
                <div className={style.gameStatusContainerCardItem}>
                  <Image src="/img/dealer.png" alt='' width={76} height={34} />
                  <div className={style.score}>{dealerPoints}</div>
                </div>
                <div className={style.gameStatusContainerCardItem}>
                  <Image src="/img/player.png" alt='' width={76} height={34} />
                  <div className={style.score}>{playerPoints[0]}</div>
                  {
                    playerPoints[1] && <div className={style.score}>{playerPoints[1]}</div>
                  }
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

        <div className={style.chipsContainer}>
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
            {bet}
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
    if (!hand || hand.length === 0) return null;
    const value = calculateHandValue(hand.filter(item => !item.hidden));
    return (
      <div className={classNames(style.cards, { [style.isPlayer]: !isDealer })}>

        {hand.map((card, index) => {
          const src = card?.hidden ? 'card_back.png' : card.src;
          const isFlipping = isDealer && hand.length === 2 && index === hand.length - 1 && !card.hidden;
          return (
            <div key={index} className={classNames(style.card, { [style.ani]: card?.hidden || index !== 1, [style.flipped]: isFlipping })}>
              <Image src={`/img/${src}`} alt="playing card" fill priority />
            </div>
          )
        })}

        <div className={style.cardValues}>{value}</div>

        {
          isDealer &&
          <div className={style.playingCard}>
            <Image priority src={'/img/card_back.png'} width={66} height={88} alt="card" />
          </div>

        }

      </div>
    );
  };

  return (
    <div data-aos="fade-up" className={classNames(style.gameLayout)}>
      {
        gameOver !== false ? renderChipList() : (
          <div className={style.gameContainer}>
            <div className={classNames(style.hands)}>
              <div className={classNames(style['dealer-hand'])}>
                <Image src='/img/dealer.png' alt='' width={59} height={26} />
                {renderHand(dealerHand, true)}
              </div>

              <div className={classNames(style['player-hands'])}>
                <Image src='/img/player.png' alt='' width={59} height={29} />
                <div className='flex gap-[20px]'>
                  {playerHands.map((hand, index) => (
                    <div key={index} className={classNames(style['user-handle'], { [style.inActive]: index !== currentHand })}>
                      {renderHand(hand)}
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className={style.operationContainer}>
              <div className={style.betContainer}>
                <Image className=' cursor-pointer' src={sourceBet} alt='' width={40} height={40} />
                <div className={style.bet}>{playBet}</div>
              </div>
              <div className={style.buttonContainer}>
                <div className={style.buttonContainerItem}>
                  <ClickableImage
                    className={(!gameOverUI && !loading) ? '' : 'opacity-70'}
                    onClick={hit}
                    width={100}
                    height={50}
                    src="/img/hit.png" />
                  <ClickableImage
                    className={(!gameOverUI && !loading) ? '' : 'opacity-70'}
                    onClick={stand}
                    width={100}
                    height={50}
                    src="/img/stand.png" />
                </div>
                <div className={style.buttonContainerItem}>
                  <ClickableImage
                    className={(canDouble && !gameOverUI && !loading) ? '' : 'opacity-70'}
                    onClick={double}
                    width={100}
                    height={50}
                    src="/img/double.png" />
                  <ClickableImage
                    className={(canSplit && !gameOverUI && !loading) ? '' : 'opacity-70'}
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
          className={style.toastMaskContainerWrap}
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
          <Image src={MAP_MESSAGE_IMG_TOAST[gameResult]} alt='' width={250} height={50} />

        </Mask>
      }
    </div>
  );
};

export default BlackjackGame;