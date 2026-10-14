type Props = { onStart: () => void }

export default function StartScreen({ onStart }: Props) {
  return (
    <>
      <h2 className="question">ひげはいくつ<br />あたったかな？</h2>
      <section className="answer-card">
        <p className="instruction">あたったひげの数を おしえてね！</p>
        <button type="button" className="confirm" onClick={onStart}>スタート ▶</button>
      </section>
    </>
  )
}
