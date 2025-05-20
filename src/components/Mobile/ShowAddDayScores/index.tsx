
import Image from 'next/image'
import Mask from '@/components/Mask'
import ClickableImage from '@/components/ClickableImage';
import { useNeedShowAddDayScores, userStore } from '@/store/user';
import style from './index.module.scss'



const Claim = () => {
  const needShowAddDayScores = useNeedShowAddDayScores()
  const updateNeedShowAddDayScores = userStore(state => state.updateNeedShowAddDayScores)
  return (
    <>
      {
        needShowAddDayScores && (
          <Mask
            data-aos="fade-up"
            maskClosable={true}
            onClose={() => updateNeedShowAddDayScores(false)}
            contentClassName={style.claimMaskContainer}
          >
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-51px] left-[-15px]" />
            <Image src='/img/dotGroup.png' width={86} height={16} alt="" className=" absolute bottom-[10px] left-0" />
            <div className={style.claimMaskContent}>
              <Image className="self-center mt-[10px]" src='/img/dailyTitle.png' width={150} height={35} alt="" />
              <span className={style.claimMaskContentDesc}>{`You've got 100 fresh chips to play with today. Use them wisely — or go all in.`}</span>
              <ClickableImage
                className=" cursor-pointer"
                onClick={() => updateNeedShowAddDayScores(false)}
                width={214}
                height={91}
                src="/img/letPlay.png" />
            </div>
          </Mask>
        )
      }

    </>

  )
}

export default Claim