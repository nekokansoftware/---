
import "./Ranking.css";

type RankingEntry = {
  id: number;
  name: string;
  score: number;
};

// 動作確認用の仮データ
const rankingData: RankingEntry[] = [
  { id: 1, name: "ねこマスター", score: 100 },
  { id: 2, name: "みけねこ", score: 95 },
  { id: 3, name: "しろねこ", score: 90 },
  { id: 4, name: "くろねこ", score: 85 },
  { id: 5, name: "ねこすき", score: 80 },
  { id: 6, name: "ねこたろう", score: 75 },
  { id: 7, name: "にゃんこ", score: 70 },
];

export default function Ranking() {
  // 自分のID（仮）
  const myId = 6;

  // 点数が高い順に並べる
  const sortedRanking = [...rankingData].sort(
    (a, b) => b.score - a.score
  );

  // 上位5人
  const topFive = sortedRanking.slice(0, 5);

  // 自分の順位
  const myIndex = sortedRanking.findIndex(
    (entry) => entry.id === myId
  );

  const myRank = myIndex + 1;
  const myEntry = sortedRanking[myIndex];

  // 順位カードを表示する関数
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
            : `${rank}い`}
        </span>

        <span className="ranking-name">
          {entry.name}
          {isMe && (
            <span className="my-label">あなた！</span>
          )}
        </span>

        <span className="ranking-score">
          {entry.score}てん
        </span>
      </div>
    );
  };

  return (
    <div className="ranking-page">

      {/* ランキング全体のパネル */}
      <div className="ranking-panel">

        {/* タイトル */}
        <h1 className="ranking-heading">
          👑 ランキング 👑
        </h1>

        <p className="ranking-subtitle">
          ✨ ねこひげトップ５ ✨
        </p>

        {/* 1位 */}
        {topFive[0] && (
          <div className="first-place">
            {renderRanking(topFive[0], 1)}
          </div>
        )}

        {/* 2位・3位 */}
        <div className="podium-row">
          {topFive[1] && renderRanking(topFive[1], 2)}
          {topFive[2] && renderRanking(topFive[2], 3)}
        </div>

        {/* 4位・5位 */}
        <div className="lower-ranking">
          {topFive.slice(3).map((entry, index) =>
            renderRanking(entry, index + 4)
          )}
        </div>

        {/* 自分が6位以下の場合 */}
        {myEntry && myRank > 5 && (
          <div className="my-rank-area">
            <p>🐱 あなたのじゅんい</p>
            {renderRanking(myEntry, myRank)}
          </div>
        )}

        {/* 自分が5位以内の場合 */}
        {myEntry && myRank <= 5 && (
          <p className="ranking-congrats">
            ✨ ランクインおめでとう！ ✨
          </p>
        )}

      </div>
    </div>
  );
}
