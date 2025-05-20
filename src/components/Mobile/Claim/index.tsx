
import Image from 'next/image'
import Mask from '@/components/Mask'
import { useState } from 'react';
import style from './index.module.scss'
import ClickableImage from '@/components/ClickableImage';


const Claim = () => {
  const [showMask, setShowMask] = useState(false);
  return (
    <>
      <div className=" flex flex-col w-[80px] h-[80px] justify-between items-center">
        <ClickableImage
          className=" cursor-pointer"
          onClick={() => setShowMask(true)}
          width={52}
          height={52}
          src='/img/mobile/claim.png' />
        <span className={style.text}>Claim</span>
      </div>
      {
        showMask && (
          <Mask
            data-aos="fade-up"
            maskClosable={true}
            onClose={() => setShowMask(false)}
            contentClassName={style.claimMaskContainer}
          >
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-51px] left-[-15px]" />
            <Image src='/img/dotGroup.png' width={86} height={16} alt="" className=" absolute bottom-[10px] left-0" />
            <div className={style.claimMaskContent}>
              <Image className="self-center mt-[10px]" src='/img/claimTitle.png' width={63} height={35} alt="" />
              <span className={style.claimMaskContentDesc}>Chips will soon be redeemable for $MARY — the Lost Mary token.Play now. Stack up. Stay tuned.</span>
              <ClickableImage
                className=" cursor-pointer"
                onClick={() => setShowMask(false)}
                width={214}
                height={91}
                src="/img/OK.png" />
            </div>
          </Mask>
        )
      }

    </>

  )
}

export default Claim