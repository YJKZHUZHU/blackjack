
import Image from 'next/image'
import Mask from '@/components/Mask'
import { useState } from 'react';
import style from './index.module.scss'
import ClickableImage from '@/components/ClickableImage';


const Claim = () => {
  const [showMask, setShowMask] = useState(false);
  return (
    <>
      <ClickableImage
        className=" cursor-pointer"
        onClick={() => setShowMask(true)}
        width={108}
        height={108}
        src="/img/claim.png" />
      {
        showMask && (
          <Mask
            data-aos="fade-up"
            maskClosable={true}
            onClose={() => setShowMask(false)}
            contentClassName={style.claimMaskContainer}
          >
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-60px] left-[200px]" />
            <Image src='/img/dotGroup.png' width={100} height={18} alt="" className=" absolute bottom-0 left-0" />
            <div className={style.claimMaskContent}>
              <Image className="self-center mt-[10px]" src='/img/claimTitle.png' width={109} height={60} alt="" />
              <span className={style.claimMaskContentDesc}>Chips will soon be redeemable for $MARY — the Lost Mary token.Play now. Stack up. Stay tuned.</span>
              <ClickableImage
                className=" cursor-pointer"
                onClick={() => setShowMask(false)}
                width={252}
                height={108}
                src="/img/OK.png" />
            </div>
          </Mask>
        )
      }

    </>

  )
}

export default Claim