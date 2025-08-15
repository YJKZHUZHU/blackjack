import Image from "next/image";
import Mask from "@/components/Mask";
import { useEffect, useState } from "react";
import style from "./index.module.scss";
import ClickableImage from "@/components/ClickableImage";
import { useAddress } from "@/store/user";
import { getAirdropInfo } from "@/api";

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
function toPercentage(num: number) {
  return (num * 100).toFixed(2) + "%";
}

const Claim = () => {
  const [showMask, setShowMask] = useState(false);
  const [isAirdropTime, setIsAirdropTime] = useState(false);
  const [airdropToken, setAirdropToken] = useState(0);
  const [chipsPercent, setChipsPercent] = useState(0);
  const address = useAddress();
  useEffect(() => {
    getAirdropInfo({ solAddress: address }).then(({ data: { data, code } }) => {
      if (code.toString() !== "0") {
        return;
      }
      if (!data.is_airdrop_time) {
        setIsAirdropTime(false);
      } else {
        setIsAirdropTime(true);
        setAirdropToken((data.airdrop_amount && data.airdrop_amount / 1000000) || 0);
        setChipsPercent(data.chips_percentage || 0);
      }
    });
  }, [address]);
  const handleClaim = () => {
    setShowMask(true);
  };
  return (
    <>
      <div className={style.imgItem}>
        <ClickableImage
          className=" cursor-pointer"
          onClick={handleClaim}
          width={52}
          height={52}
          src="/img/mobile/claim.png"
        />
        <span className={style.text}>Claim</span>
      </div>
      {showMask && (
        <Mask
          data-aos="fade-up"
          maskClosable={true}
          onClose={() => setShowMask(false)}
          contentClassName={style.claimMaskContainer}>
          <Image
            src="/img/highlight.png"
            width={400}
            height={106}
            alt=""
            className=" absolute top-[-51px] left-[-15px]"
          />
          <Image src="/img/dotGroup.png" width={86} height={16} alt="" className=" absolute bottom-[10px] left-0" />
          <div className={style.claimMaskContent}>
            {!isAirdropTime && (
              <Image className="self-center mt-[10px]" src="/img/claimTitle.png" width={63} height={35} alt="" />
            )}
            {isAirdropTime && (
              <Image
                className="self-center mt-[10px]"
                src="/img/airdrop_complated.png"
                width={220}
                height={35}
                alt=""
              />
            )}
            {isAirdropTime && airdropToken === 0 ? (
              <span className={style.claimMaskContentDesc}>
                The first round of airdrop has ended.
                <br />
                <br />
                Follow{" "}
                <a
                  href="https://x.com/vvblackjack"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  @VVblackjack
                </a>{" "}
                for future airdrop events.
              </span>
            ) : isAirdropTime && airdropToken > 0 ? (
              <span className={style.claimMaskContentDesc}>
                You earned {toPercentage(chipsPercent)} of total chips in the first round.
                <br />
                You received {formatNumber(airdropToken)} $LM tokens.
                <br />
                <br />
                Follow{" "}
                <a
                  href="https://x.com/vvblackjack"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  @VVblackjack
                </a>{" "}
                for the next airdrop!
              </span>
            ) : (
              <span className={style.claimMaskContentDesc}>
                Chips will soon be redeemable for $MARY — the LM token.Play now. Stack up. Stay tuned.
              </span>
            )}
            <ClickableImage
              className=" cursor-pointer"
              onClick={() => setShowMask(false)}
              width={214}
              height={91}
              src="/img/OK.png"
            />
          </div>
        </Mask>
      )}
    </>
  );
};

export default Claim;
