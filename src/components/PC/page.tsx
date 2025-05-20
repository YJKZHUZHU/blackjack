'use client';
import { Game, Rule, UserForm, LeaderBoard, Claim, ShowAddDayScores, Home as HomeComp } from '@/components/PC'
import ClickableImage from '@/components/ClickableImage';
import Image from 'next/image';
import classNames from 'classnames';
import { userStore, useAddress } from '@/store/user'
import { formatAddress } from '@/utils/formatAddress'
import usePersistentWallet from '@/hooks/usePersistentWallet';
import { formatScores } from '@/utils/formatScores';
import style from './index.module.scss'


export default function Home() {

  const address = useAddress();
  const balance = userStore((state) => state.balance);

  const {
    isConnected,
    connectWallet,
    disconnectWallet
  } = usePersistentWallet();

  if (!isConnected && localStorage.getItem('lastConnectedWallet') !== 'phantom') {
    return <HomeComp onConnectWallet={connectWallet} />
  }
  return (
    <div className={classNames(style['page-container'])}>
      <div className={classNames(style['page-container-header'])}>
        <div className={classNames(style['page-container-header-address'])}>
          <span className={classNames(style['page-container-header-address-text'])}>WALLET ADDRESS : {formatAddress(address)}</span>
          <ClickableImage
            className=" cursor-pointer"
            onClick={disconnectWallet}
            width={18}
            height={20}
            src="/img/exit.png" />
        </div>
        <div className={classNames(style['page-container-header-title'])}>
          <Image src='/img/title.png' width={200} height={24} alt='' />
        </div>
        <div className={style['page-container-header-right']}>
          <div className={style['page-container-header-right-balance']}>{formatScores(balance)}</div>
          <Rule />
        </div>
      </div>
      <div className={classNames(style['page-container-content'])}>
        <div className={classNames(style['page-container-content-left'])}>
          <LeaderBoard />
          <Claim />
        </div>
        <UserForm />
        <ShowAddDayScores />
        <Game />
      </div>

    </div>
  );
}
