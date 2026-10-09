type Props = { onStart: () => void }

export default function StartScreen({ onStart }: Props) {
  return (
    <section className="game-screen start-screen" aria-label="ネコカン スタート画面">
      <div className="wood-sign small-sign">富士サファリパークで あそぼう！</div>
      <h1 className="game-title">ネコカン</h1>
      <p className="game-message">ネコのひげの すごさを<br />たいけんしよう！</p>
      <div className="mascot-frame" aria-label="ネコカン君">
        <img className="mascot-image" src="/safari-background.png" alt="" aria-hidden="true" />
        <span className="mascot-label">ネコカン君と いっしょに！</span>
      </div>
      <button type="button" className="wood-button primary-button" onClick={onStart}>
        スタート！ <span aria-hidden="true">▶</span>
      </button>
      <p className="screen-note">ボタンを おしてね！</p>
    </section>
  )
}
