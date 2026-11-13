
import { useState } from "react";
import "./Result.css";

import catBody from "../assets/cat-body.png.png";
import catTail from "../assets/cat-siri.png";
import butterflyLeft from "../assets/left.png";
import butterflyRight from "../assets/right.png";
import curtainImage from "../assets/curtain.png";
import { saveRanking } from "../utils/rankingStorage";

type Props = {
  answer: number;
  nickname: string;
  onRanking: (entryId: string) => void;
};

export default function ResultScreen({
  answer,
  nickname,
  onRanking,
}: Props) {
  const [curtainClosing, setCurtainClosing] = useState(false);

const handleRankingClick = () => {
  if (curtainClosing) return;

  // 名前と点数を保存
  const newEntry = saveRanking(nickname, matchRate);

  setCurtainClosing(true);

  // 幕が降りたらIDを渡して移動
  setTimeout(() => {
    onRanking(newEntry.id);
  }, 1200);
};

  // ハードウェアから受け取る予定。今は仮データ
  const actual = 3;
  const matchRate = 80;

  // こたえと実際の個数の差
  const difference = Math.abs(answer - actual);

  let title: string;
  let titleIcon: string;

  if (matchRate >= 90) {
    title = "ひげマスター！";
    titleIcon = "👑";
  } else if (matchRate >= 70) {
    title = "ひげじょうず！";
    titleIcon = "🌟";
  } else if (matchRate >= 50) {
    title = "ひげみならい！";
    titleIcon = "🐱";
  } else {
    title = "もういっかいやってみよう！";
    titleIcon = "🐾";
  }

  return (
    <div className="result-page">

      {/* 左右の蝶々 */}
      <img
        src={butterflyLeft}
        className="butterfly butterfly-left"
        alt=""
      />

      <img
        src={butterflyRight}
        className="butterfly butterfly-right"
        alt=""
      />

      {/* ネコ */}
      <div className="cat">
        <img
          src={catTail}
          className="cat-tail"
          alt=""
        />

        <img
          src={catBody}
          className="cat-body"
          alt=""
        />
      </div>

      {/* タイトル */}
      <h1 className="result-heading">
        <span className="party-icon">🎉</span>
        <span>けっかはっぴょう</span>
        <span className="party-icon">🎉</span>
      </h1>

      {/* 点数と称号 */}
      <div className="result-card">

        <p className="whisker-text">
          🐱 きみのねこひげかんかくは…？
        </p>

        <div className="match-rate">
          {matchRate}
          <span>てん！</span>
        </div>

        <div className="result-area">
          <span className="title-icon">{titleIcon}</span>
          <span className="result-title">{title}</span>
        </div>

      </div>

      {/* 回答結果 */}
      <div className="answer-card">

        <div className="answer-row">

          <div className="answer-item answer-user">
            <span>🐾 きみのこたえ</span>
            <strong>{answer}こ</strong>
          </div>

          <div className="answer-item answer-actual">
            <span>🐾 ほんとうは</span>
            <strong>{actual}こ</strong>
          </div>

        </div>

        <p className="difference">
          {difference === 0
            ? "✨ ぴったり！ ✨"
            : `✨ ${difference}こちがい！ ✨`}
        </p>

      </div>

      {/* ランキングボタン */}
      <div className="result-buttons">
        <button
          className="ranking-button"
          onClick={handleRankingClick}
          disabled={curtainClosing}
        >
          🏆 ランキングをみる
        </button>
      </div>

      {/* 赤い幕 */}
      <img
        src={curtainImage}
        className={`stage-curtain ${
          curtainClosing ? "curtain-drop" : ""
        }`}
        alt=""
      />

    </div>
  );
}
