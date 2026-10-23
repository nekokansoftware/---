import { useState } from "react";
import "./Result.css";
import catBody from "../assets/cat-body.png.png";
import catTail from "../assets/cat-siri.png";
import butterflyLeft from "../assets/left.png";
import butterflyRight from "../assets/right.png";
import curtainImage from "../assets/curtain.png";

type Props = {
  answer: number;
  onRanking: () => void;
};

export default function ResultScreen({ answer, onRanking }: Props) {
  const [curtainClosing, setCurtainClosing] = useState(false);

  const handleRankingClick = () => {
    setCurtainClosing(true);

    setTimeout(() => {
    onRanking();
  }, 1500);
  };
  
  // ハードウェアから受け取る予定。今は仮データ
  const actual = 3;
  const matchRate = 80;

  // こたえと実際の個数の差
  const difference = Math.abs(answer - actual);

  let title = "";
  let titleIcon = "";

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

    <div className="cat">
     <img src={catTail} className="cat-tail" alt="" />
     <img src={catBody} className="cat-body" alt="" />
    </div>

    <h1 className="result-heading"></h1>

      <h1 className="result-heading">
        <span className="party-icon">🎉</span>
        <span>けっかはっぴょう</span>
        <span className="party-icon">🎉</span>
      </h1>

      <div className="result-card">

        <p className="whisker-text">
          🐱 きみのねこひげかんかくは…？
        </p>

        

        <div className="match-rate">
          {matchRate}<span>てん！</span>
        </div>

        <div className="result-area">
          <span className="title-icon">{titleIcon}</span>
          <span className="result-title">{title}</span>
        </div>

      </div>

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

      <div className="result-buttons">

        <button 
         className="ranking-button"
         onClick={handleRankingClick}
        >
          🏆 ランキングをみる
        </button>

      </div>
      
      <img
  src={curtainImage}
  className={`stage-curtain ${curtainClosing ? "curtain-drop" : ""}`}
  alt=""
/>

    </div>
  );
}

