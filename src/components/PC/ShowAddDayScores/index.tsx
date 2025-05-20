
import Image from 'next/image'
import Mask from '@/components/Mask'
import { userStore, useNeedShowAddDayScores } from '@/store/user'
import ClickableImage from '@/components/ClickableImage';
import style from './index.module.scss'


const ShowAddDayScores = () => {
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
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-60px] left-[200px]" />
            <Image src='/img/dotGroup.png' width={100} height={18} alt="" className=" absolute bottom-0 left-0" />
            <div className={style.claimMaskContent}>
              <Image className="self-center mt-[10px]" src='/img/dailyTitle.png' width={394} height={60} alt="" />
              <span className={style.claimMaskContentDesc}>{`You've got 100 fresh chips to play with today. Use them wisely — or go all in.`}</span>
              <ClickableImage
                className=" cursor-pointer"
                onClick={() => updateNeedShowAddDayScores(false)}
                width={252}
                height={108}
                src="/img/letPlay.png" />
            </div>
          </Mask>
        )
      }

    </>

  )
}

export default ShowAddDayScores