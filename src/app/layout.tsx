import type { Metadata, Viewport } from "next";
import { AudioProvider } from '@/components/BackgroundMusic'
import '../style/global.css';


export const metadata: Metadata = {
  title: "Blackjack",
  description: "Blackjack",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" style={{ fontSize: 37.5 }}>

      {/* 音频预加载 */}

      <link rel="preload" href="/audio/bg.m4a" as="audio" />
      <link rel="preload" href="/audio/click.m4a" as="audio" />
      <link rel="preload" href="/audio/bet.m4a" as="audio" />
      <link rel="preload" href="/audio/hand.m4a" as="audio" />
      <link rel="preload" href="/audio/win.m4a" as="audio" />

      {/* 图片资源 */}

      <link
        rel="preload"
        href="/img/LMBlackjack.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/play.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/title.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/tip.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/placeBet.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/gameTitle.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/hit.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/stand.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/double.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/split.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/dealerWon.png"
        as="image"
      />

      {/*  */}
      <link
        rel="preload"
        href="/img/yourWon.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/push.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/dealerWonToast.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/playerWonToast.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/pushToast.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/toast.png"
        as="image"
      />



      <link
        rel="preload"
        href="/img/game.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/homeBg.png"
        as="image"
      />


      <link
        rel="preload"
        href="/img/userBg.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/ruleMask.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/claimMask.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/highlight.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/close.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/dotGroup.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/leaderboard.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/claim.png"
        as="image"
      />


      <link
        rel="preload"
        href="/img/10-chip.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/20-chip.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/50-chip.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/100-chip.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/total.png"
        as="image"
      />

      <link
        rel="preload"
        href="/img/address.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/gameTitle.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/dailyTitle.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/letPlay.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/audioStart.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/audioStop.png"
        as="image"
      />










      {/* 扑克牌 */}

      {/* 方片 */}
      <link
        rel="preload"
        href="/img/Diamond-2.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-3.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-4.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-5.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-6.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-7.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-8.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-9.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-Ace.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-Jack.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-King.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Diamond-Queen.png"
        as="image"
      />

      {/* 梅花 */}

      <link
        rel="preload"
        href="/img/Clubs-2.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-3.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-4.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-5.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-6.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-7.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-8.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-9.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-Ace.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-Jack.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-King.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Clubs-Queen.png"
        as="image"
      />


      {/* 红心 */}
      <link
        rel="preload"
        href="/img/Hearts-2.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-3.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-4.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-5.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-6.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-7.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-8.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-9.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-Ace.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-Jack.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-King.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Hearts-Queen.png"
        as="image"
      />

      {/* 黑桃 */}
      <link
        rel="preload"
        href="/img/Spades-2.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-3.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-4.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-5.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-6.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-7.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-8.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-9.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-Ace.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-Jack.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-King.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/Spades-Queen.png"
        as="image"
      />

      {/* 移动端资源 */}
      <link
        rel="preload"
        href="/img/mobile/bigContentBg.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/confirm.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/bigMask.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/claim.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/close.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/explain.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/game.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/homeBg.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/leaderboard.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/LMBlackjack.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/masonry.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/smallContentBg.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/smallMask.png"
        as="image"
      />
      <link
        rel="preload"
        href="/img/mobile/title.png"
        as="image"
      />

      <body
        cz-shortcut-listen="true"
      >
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
