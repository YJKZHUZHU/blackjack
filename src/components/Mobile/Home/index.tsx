import Image from 'next/image'
import Rule from '@/components/Mobile/Rule'
import { FC } from 'react';
import ClickableImage from '@/components/ClickableImage';
import style from './index.module.scss'

const Home: FC<{ onConnectWallet: () => void }> = (props) => {
  const { onConnectWallet } = props


  return (
    <div className={style.pageHomeContainer}>
      <div className={style.pageHomeContainerBg}>
        <Image 
          src='/img/mobile/homeBg.png' 
          fill
          alt=''
          priority
          sizes="100vw"
        />
      </div>
      <div className={style.pageHomeContainerHeader}>
        <Image src='/img/mobile/title.png' width={100} height={12} alt='' />
        <Rule />
      </div>
      <div data-aos="fade-up" className={style.pageHomeContainerContent}>
        <div className=' flex-1 flex flex-col items-center'>
          <Image src='/img/mobile/LMBlackjack.png' alt='' width={231} height={107} />
          <span className={style.pageHomeContainerContentDesc}>Choose your bet and drift into the world of VapeVibes Blackjack.</span>
        </div>

        <ClickableImage
          className=" cursor-pointer"
          onClick={() => onConnectWallet()}
          width={214}
          height={91}
          src="/img/play.png" />
      </div>

    </div>
  )
}

export default Home