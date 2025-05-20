
import Image from 'next/image'
import Mask from '@/components/Mask'
import { useState } from 'react';
import { getUserRank, IGetUserRankRes, getCurrentUserRank } from '@/api'
import { useAddress } from '@/store/user'
import { formatAddress } from '@/utils/formatAddress'
import { formatScores } from '@/utils/formatScores'
import style from './index.module.scss'
import classNames from 'classnames';
import ClickableImage from '@/components/ClickableImage';



const Leaderboard = () => {
  const address = useAddress()
  const [showMask, setShowMask] = useState(false);
  const [list, setList] = useState<IGetUserRankRes[]>([])
  const [userInfo, setUserInfo] = useState({
    ranking: 0,
    walletPublicKey: '',
    scores: 0
  })
  const [loading, setLoading] = useState(false)

  const getList = async () => {
    try {
      setLoading(true)
      const [res, res1] = await Promise.all([getUserRank({ wallet: address, page: 1, size: 5 }), getCurrentUserRank({ wallet: address })])
      setLoading(false)
      setList(res.data.data.userList)
      setUserInfo({
        ranking: res1.data.data.ranking,
        walletPublicKey: res1.data.data.userInfo.walletPublicKey,
        scores: res1.data.data.userInfo.scores
      })
    } catch (error) {
      console.log('error', error)
    }

  }
  const onOpen = async () => {
    setShowMask(true);
    getList()
  }

  return (
    <>
      <ClickableImage
        className=" cursor-pointer"
        onClick={onOpen}
        width={108}
        height={108}
        src="/img/leaderboard.png" />
      {
        showMask && (
          <Mask
            data-aos="fade-up"
            maskClosable={false}
            onClose={() => setShowMask(false)}
            contentClassName={style.leaderBoardMaskContainer}
          >
            <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-60px] left-[200px]" />
            <Image src='/img/dotGroup.png' width={100} height={18} alt="" className=" absolute bottom-0 left-0" />
            <ClickableImage
              className="cursor-pointer absolute top-0 right-0"
              onClick={() => setShowMask(false)}
              width={92}
              height={87}
              src="/img/close.png" />
            <div className={style.leaderBoardMaskContent}>
              <Image className=" self-center mt-[10px] mb-[20px]" src='/img/leaderBoardTitle.png' width={253} height={60} alt="" />
              {
                !loading && (<div className={style.leaderBoardMaskContentList}>
                  {
                    list?.map((item, index) => {
                      return <div className={classNames(style.leaderBoardMaskContentListItem, { [style.leaderBoardMaskContentListItemActive]: [0, 1, 2].includes(index) })} key={item.walletPublicKey}>
                        <span className={style.leaderBoardMaskContentListItemIndex}>{index + 1}</span>
                        <div className={style.leaderBoardMaskContentListItemAddress}>{formatAddress(item.walletPublicKey)}</div>
                        <div className={style.leaderBoardMaskContentListItemAvatar}>
                          <Image src="/img/balance.png" width={44} height={33} alt='' />
                          <span className={style.leaderBoardMaskContentListItemScores}>{formatScores(item.scores)}</span>
                        </div>
                      </div>
                    })
                  }
                  <div className={classNames(style.leaderBoardMaskContentListItem)}>
                    <span className={style.leaderBoardMaskContentListItemIndex}>...</span>
                  </div>

                  <div className={classNames(style.leaderBoardMaskContentListItem)}>
                    <span className={style.leaderBoardMaskContentListItemIndex}>{userInfo.ranking}</span>
                    <div className={style.leaderBoardMaskContentListItemAddress}>{formatAddress(userInfo.walletPublicKey)}</div>
                    <div className={style.leaderBoardMaskContentListItemAvatar}>
                      <Image src="/img/balance.png" width={44} height={33} alt='' />
                      <span className={style.leaderBoardMaskContentListItemScores}>{formatScores(userInfo.scores!)}</span>
                    </div>
                  </div>
                </div>)
              }

            </div>
          </Mask>
        )
      }
    </>

  )
}

export default Leaderboard