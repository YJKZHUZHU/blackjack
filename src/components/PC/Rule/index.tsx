import Image from "next/image"
import Mask from '@/components/Mask'
import style from './index.module.scss'
import { useState } from "react"
import classNames from "classnames"
import ClickableImage from "@/components/ClickableImage"

const Rule = () => {
  const [showMask, setShowMask] = useState(false)
  return (
    <>
      <ClickableImage
        className=" cursor-pointer"
        onClick={() => setShowMask(true)}
        width={52}
        height={40}
        src="/img/tip.png" />
      {
        showMask && (
          <Mask
            data-aos="fade-up"
            maskClosable={false}
            onClose={() => setShowMask(false)}
            contentClassName={style.ruleMaskContainer}
          >
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-60px] left-[200px]" />
            <Image src='/img/dotGroup.png' width={100} height={18} alt="" className=" absolute bottom-0 left-0" />
            <ClickableImage
              className="cursor-pointer absolute top-0 right-0"
              onClick={() => setShowMask(false)}
              width={92}
              height={87}
              src="/img/close.png" />
            {/* <Image onClick={() => setShowMask(false)} src='/img/close.png' width={92} height={87} alt="" className=" cursor-pointer absolute top-0 right-0" /> */}
            <div className={style.ruleMaskContent}>
              <Image className=" self-center mt-[10px] mb-[20px]" src='/img/ruleTitle.png' width={533} height={62} alt="" />
              <div className={style.ruleMaskContentDesc}>
                <span className={style.ruleMaskContentTitle}>Goal:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>Beat the dealer by getting closer to 21 without going over. A Blackjack is an Ace + 10-point card on your first hand.</span>

                <span className={style.ruleMaskContentTitle}>Gameplay:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>You and the dealer each get 2 cards. One of the dealer’s cards is face down. Choose to hit (get another card) or stand (keep your hand). Keep hitting until you stand or go over 21.</span>

                <span className={style.ruleMaskContentTitle}>Card Values:</span>
                <span className={style.ruleMaskContentSubTitle}>2–10 = face value</span>
                <span className={style.ruleMaskContentSubTitle}>J, Q, K = 10</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>Ace = 1 or 11, whichever works best for your hand</span>

                <span className={style.ruleMaskContentTitle}>Splitting:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>If you get two cards of the same value, you can split once and play each hand separately. After splitting, one card is dealt to each hand. You can hit or stand on both.</span>

                <span className={style.ruleMaskContentTitle}>Double Down:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>After your first 2 cards, you can double your bet. You’ll get one more card, then automatically stand.</span>

                <span className={style.ruleMaskContentTitle}>Payouts:</span>
                <span className={style.ruleMaskContentSubTitle}>Win = 1:1</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>Blackjack = 3:2</span>

                <span className={style.ruleMaskContentTitle}>Daily Bonus:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>You receive 100 chips every day to place your bets. Use them wisely — or boldly.</span>

                <span className={style.ruleMaskContentTitle}>Note:</span>
                <span className={classNames(style.ruleMaskContentSubTitle, style.margin)}>Chips you win don’t just vanish. They might hold more value down the line.</span>
              </div>

            </div>
          </Mask>
        )
      }

    </>
  )
}

export default Rule