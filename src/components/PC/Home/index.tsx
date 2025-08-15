
import Image from 'next/image'
import Rule from '@/components/PC/Rule'
import { FC } from 'react';
import ClickableImage from '@/components/ClickableImage';
import style from './index.module.scss'

const Home: FC<{ onConnectWallet: () => void }> = (props) => {
  const { onConnectWallet } = props


  return (
    <div className={style.pageHomeContainer}>
      <div className={style.pageHomeContainerHeader}>
        <Image className={style.logo} src='/img/title.png' width={200} height={24} alt='' />
        <Rule />
      </div>
      <div data-aos="fade-up" className={style.pageHomeContainerContent}>
        <Image src='/img/LMBlackjack.png' alt='' width={549} height={125} />
        <span className={style.pageHomeContainerContentDesc}>Choose your bet and drift into the world of VapeVibes Blackjack.</span>
        <ClickableImage
          className=" cursor-pointer"
          onClick={() => onConnectWallet()}
          width={328}
          height={138}
          src="/img/play.png" />
      </div>

    </div>
  )
}

export default Home