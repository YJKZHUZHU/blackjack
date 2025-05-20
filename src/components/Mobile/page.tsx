'use client'
import usePersistentWallet from "@/hooks/usePersistentWallet";
import { useAddress, userStore } from "@/store/user";
import { Home as MobileHome, ShowAddDayScores, Rule, LeaderBoard, Claim, UserForm, Game } from '@/components/Mobile'
import classNames from "classnames";
import Image from "next/image";
import ClickableImage from "@/components/ClickableImage";
import { formatAddress } from "@/utils/formatAddress";
import { formatScores } from "@/utils/formatScores";
import style from './index.module.scss';


export default function MobileLayout() {
  const address = useAddress();
  const balance = userStore((state) => state.balance);

  const {
    isConnected,
    connectWallet,
    disconnectWallet
  } = usePersistentWallet();



  if (!isConnected && localStorage.getItem('lastConnectedWallet') !== 'phantom') {
    return <MobileHome onConnectWallet={connectWallet} />
  }
  return (
    <div className={classNames(style['page-container'])}>
      <div className={classNames(style['page-container-header'])}>
        <Image src='/img/mobile/title.png' width={100} height={12} alt='' />
        <div className={classNames(style['page-container-header-address'])}>
          <span className={classNames(style['page-container-header-address-text'])}>WALLET ADDRESS : {formatAddress(address)}</span>
          <ClickableImage
            className=" cursor-pointer"
            onClick={disconnectWallet}
            width={12}
            height={12}
            src="/img/exit.png" />
        </div>
      </div>
      <div className={classNames(style['page-container-content'])}>
        <div className=" flex justify-end mt-[10px]">
          <div className={style['page-container-header-right-balance']}>{formatScores(balance)}</div>
        </div>
        <Game />
      </div>
      <div className=" pb-[10px] w-full fixed bottom-0 flex items-center justify-between pl-[12px] pr-[32px]">
        <Rule type="bottom" />
        <LeaderBoard />
        <Claim />
      </div>
      <ShowAddDayScores />
      <UserForm />
    </div>
  );
}