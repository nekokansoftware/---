
import { useState } from "react";
import "./Ranking.css";

import {
  getSortedRanking,
  saveRanking,
  type RankingEntry,
} from "../utils/rankingStorage";

type Props = {
  currentEntryId: string | null;
};

export default function Ranking({ currentEntryId }: Props) {
  // 保存済みランキングを読み込む
  const [rankingData, setRankingData] = useState<RankingEntry[]>(
    () => getSortedRanking()
  );

  // 今回の体験者のID
  const [myId, setMyId] = useState<string | null>(
  currentEntryId
);

  // テスト用の記録を追加する
  const addTestData = () => {
    const names = [
      "ねこマスター",
      "みけねこ",
      "しろねこ",
      "くろねこ",
      "ねこすき",
      "ねこたろう",
    ];

    const name = names[Math.floor(Math.random() * names.length)];
    const score = Math.floor(Math.random() * 11) * 10;

    const newEntry = saveRanking(name, score);

    setMyId(newEntry.id);
    setRankingData(getSortedRanking());
  };

  
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

        {/* 動作確認用。完成時には削除する */}
        <button
          type="button"
          onClick={addTestData}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          テストデータを追加
        </button>
      </div>
    </div>
  );
}
