
import { useState, useLayoutEffect, useRef, type CSSProperties } from "react";
import "./Ranking.css";
import rankingCat from "../assets/Ranking-cat.png";
import catBody from "../assets/cat-body.png.png";

import {
  getSortedRanking,
  type RankingEntry,
} from "../utils/rankingStorage";

type Props = {
  currentEntryId: string | null;
  onBack: () => void;
};

export default function Ranking({ currentEntryId, onBack }: Props) {
  // 保存済みランキングを読み込む
  const [rankingData] = useState<RankingEntry[]>(
  () => getSortedRanking()
);

  // スクロールしないで表示するため、実際の内容の高さから倍率を計算する
  const rankingViewportRef = useRef<HTMLDivElement>(null);
  const rankingPanelRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  useLayoutEffect(() => {
    const viewport = rankingViewportRef.current;
    const panel = rankingPanelRef.current;
    if (!viewport || !panel) return;

    const updateFit = () => {
      const screenHeight = viewport.clientHeight;
      // 画面下の「スタートにもどる」ボタンの分を常に確保
      const bottomSpace = 24;
      const availableHeight = Math.max(1, screenHeight - bottomSpace);
      // CSS transform はレイアウト上の高さを変えないので縮小前の高さを測れる
      const naturalHeight = panel.scrollHeight;
      const nextScale = Math.min(1, availableHeight / Math.max(naturalHeight, 1));
      setFitScale((current) =>
        Math.abs(current - nextScale) < 0.002 ? current : nextScale
      );
    };

    const observer = new ResizeObserver(updateFit);
    observer.observe(panel);
    observer.observe(viewport);
    window.addEventListener("resize", updateFit);
    void document.fonts.ready.then(updateFit);
    updateFit();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFit);
    };
  }, []);

  // 今回の体験者のID
  const myId = currentEntryId;

  
  // 点数が同じ場合、今回の体験者を優先する
  const displayRanking = [...rankingData].sort((a, b) => {
    // 点数が違う場合は高い点数が上
    if (a.score !== b.score) {
      return b.score - a.score;
    }

    // 同点の場合は今回の体験者を上にする
    if (a.id === myId) return -1;
    if (b.id === myId) return 1;

    // それ以外の同点は元の順番を維持
    return 0;
  });

  // 上位5人を取得
  const topFive = displayRanking.slice(0, 5);

  // 今回の体験者の順位を取得
  const myIndex = displayRanking.findIndex(
    (entry) => entry.id === myId
  );

  const myRank = myIndex + 1;
  const myEntry = displayRanking[myIndex];

  
  // 今回の体験者が5位以内なら紙吹雪を表示
  const showConfetti = myEntry !== undefined && myRank <= 5;

  // 3か所に山をつくるように紙吹雪の着地点を分散させる
  const confettiPieces = Array.from({ length: 180 }, (_, i) => {
    const pileIndex = i % 3;
    const particleIndex = Math.floor(i / 3);
    const spread = (((particleIndex * 37 + pileIndex * 23) % 101) - 50) / 50;
    const centers = [18, 50, 82];
    const landingHeight = Math.round(9 + (1 - Math.abs(spread)) ** 1.45 * 85 + (particleIndex % 5) * 4);

    return {
      id: i,
      left: `${centers[pileIndex] + spread * 13}%`,
      delay: `${(i * 0.031) % 4.8}s`,
      duration: `${3.0 + (i % 6) * 0.26}s`,
      width: `${12 + (i % 4) * 3}px`,
      height: `${17 + (i % 3) * 4}px`,
      pileHeight: `${landingHeight}px`,
      turn: `${(i % 2 ? -1 : 1) * (420 + (i % 4) * 100)}deg`,
      color: ["#ff5555", "#ffcc00", "#55ccff", "#88dd66", "#cc88ff", "#ff88ae"][i % 6],
    };
  });



  const renderRanking = (entry: RankingEntry, rank: number) => {
    const isMe = entry.id === myId;

    return (
      <div
        key={entry.id}
        className={`ranking-card rank-${rank} ${
          isMe ? "my-ranking" : ""
        }`}
      >
        <span className="ranking-position">
          {rank === 1
            ? "🥇"
            : rank === 2
            ? "🥈"
            : rank === 3
            ? "🥉"
            : `${rank}位`}
        </span>

        <span className="ranking-name">
          {entry.name}
          {isMe && <span className="my-label">あなた！</span>}
        </span>

        <span className="ranking-score">
          {entry.score}てん
        </span>
      </div>
    );
  };

  return (
    <div className="ranking-page" ref={rankingViewportRef}>

      
{/* 5位以内に入ったときの紙吹雪 */}
{showConfetti && (
  <div className="confetti-container" aria-hidden="true">
    {confettiPieces.map((piece) => (
      <span
        key={piece.id}
        className="confetti-piece"
        style={
          {
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            width: piece.width,
            height: piece.height,
            "--confetti-pile-height": piece.pileHeight,
            "--confetti-turn": piece.turn,
          } as CSSProperties
        }
      />
    ))}
    <div className="confetti-pile pile-left" />
    <div className="confetti-pile pile-center" />
    <div className="confetti-pile pile-right" />
  </div>
)}

      
{/* ランキング表示時に左右に開くカーテン */}
<div className="curtain-opening" aria-hidden="true">
  <div className="curtain-left"></div>
  <div className="curtain-right"></div>
</div>

      <div className="ranking-panel" ref={rankingPanelRef} style={{ "--ranking-fit": fitScale } as CSSProperties}>
        <h1 className="ranking-heading">
          👑 ランキング 👑
        </h1>

        <p className="ranking-subtitle">
          ✨ ねこひげトップ５ ✨
        </p>

        {topFive.length === 0 && (
          <p>まだランキングのきろくがないよ！</p>
        )}

        {topFive[0] && (
          <div className="first-place">
            {renderRanking(topFive[0], 1)}
            <div className="first-place-mascot" aria-hidden="true">
              <span className="first-place-mascot-cheer">やったにゃ！</span>
              <img src={catBody} alt="" className="first-place-mascot-image" />
              <span className="first-place-mascot-star star-one">✦</span>
              <span className="first-place-mascot-star star-two">✦</span>
            </div>
          </div>
        )}

        <div className="podium-row">
          {topFive[1] && renderRanking(topFive[1], 2)}
          {topFive[2] && renderRanking(topFive[2], 3)}
        </div>

        <div className="lower-ranking">
          {topFive
            .slice(3)
            .map((entry, index) =>
              renderRanking(entry, index + 4)
            )}
        </div>

        {myEntry && myRank > 5 && (
          <div className="my-rank-area">
            <p>🐱 あなたのじゅんい</p>
            {renderRanking(myEntry, myRank)}
          </div>
        )}

        {myEntry && myRank <= 5 && (
          <div className="ranking-congrats" role="status">
            <span className="congrats-sparkle" aria-hidden="true">✦</span>
            <span className="congrats-message">🎉 ランクインおめでとう！ 🎉</span>
            <span className="congrats-sparkle" aria-hidden="true">✦</span>
          </div>
        )}

       
      </div>

      {/* 右下のネコカン君を押すとスタートに戻る */}
      <button
        type="button"
        className="ranking-cat-area"
        onClick={onBack}
        aria-label="ネコカン君を押してスタートにもどる"
        title="スタートにもどる"
      >
        <img
          src={rankingCat}
          className="ranking-cat"
          alt=""
          draggable={false}
        />
        <span className="ranking-cat-speech" aria-hidden="true">
          ぼくをおして<br />スタートがめんに<br />もどるにゃ
        </span>
      </button>

    </div>
  );
}
