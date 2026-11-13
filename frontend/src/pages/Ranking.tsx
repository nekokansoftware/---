
import { useState, type CSSProperties } from "react";
import "./Ranking.css";
import rankingCat from "../assets/Ranking-cat.png";

import {
  getSortedRanking,
  type RankingEntry,
} from "../utils/rankingStorage";

type Props = {
  currentEntryId: string | null;
};

export default function Ranking({ currentEntryId }: Props) {
  // 保存済みランキングを読み込む
  const [rankingData] = useState<RankingEntry[]>(
  () => getSortedRanking()
);

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

  // 紙吹雪を50枚生成
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    delay: `${(i * 0.17) % 2}s`,
    duration: `${3 + (i % 4) * 0.5}s`,
    color: ["#ff5555", "#ffcc00", "#55ccff", "#88dd66", "#cc88ff"][i % 5],
  }));



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
    <div className="ranking-page">

      
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
          } as CSSProperties
        }
      />
    ))}
  </div>
)}

      
{/* ランキング表示時に左右に開くカーテン */}
<div className="curtain-opening" aria-hidden="true">
  <div className="curtain-left"></div>
  <div className="curtain-right"></div>
</div>

      <div className="ranking-panel">
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
          <p className="ranking-congrats">
            ✨ ランクインおめでとう！ ✨
          </p>
        )}

       
      </div>

      
       <div className="ranking-cat-area">
  <div className="ranking-speech">
    ぼくをタッチして
    <br />
    スタートがめんにもどるにゃ
  </div>

  <img
    src={rankingCat}
    className="ranking-cat"
    alt="下からのぞくネコ"
  />
</div>

    </div>
  );
}
