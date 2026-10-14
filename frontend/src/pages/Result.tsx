import "./Result.css";

function Result() {
  // 今はデザイン確認用の仮データ
  const answer = 4;
  const actual = 3;
  const matchRate = 90;

  return (
    <div className="result-page">

      <h1 className="result-heading">
        🎉 けっかはっぴょう！ 🎉
      </h1>

      <div className="result-card">

        <p className="whisker-text">
          🐱 きみのネコひげかんかくは…？
        </p>

        <div className="match-rate">
          {matchRate}<span>%</span>
        </div>

        <div className="result-title">
          ✨ ネコひげマスター！ ✨
        </div>

      </div>

      <div className="answer-card">

        <div className="answer-item">
          <span>🐾 きみのこたえ</span>
          <strong>{answer}こ</strong>
        </div>

        <div className="answer-item">
          <span>🐾 ほんとうは</span>
          <strong>{actual}こ</strong>
        </div>

        <p className="difference">
          1こちがい！
        </p>

      </div>

      <div className="result-buttons">

        <button className="ranking-button">
          🏆 ランキングをみる
        </button>

        <button className="finish-button">
          🏠 おわる
        </button>

      </div>

    </div>
  );
}

export default Result;