type Props = {
  answer: number | null
  onChange: (value: number) => void
  onConfirm: () => void
  onBack: () => void
}

export default function AnswerScreen({ answer, onChange, onConfirm, onBack }: Props) {
  return (
    <section className="game-screen answer-screen" aria-label="ネコカン 回答画面">
      <div className="wood-sign">ネコカン</div>
      <h1 className="question-bubble">ひげは いくつ<br />あたったかな？</h1>
      <div className="answer-panel">
        <p className="answer-hint">すうじを えらんでね！</p>
        <div className="number-grid" role="group" aria-label="あたった数">
          {[0, 1, 2, 3, 4, 5].map(number => (
            <button
              type="button"
              className={`number-button ${answer === number ? 'selected' : ''}`}
              aria-pressed={answer === number}
              key={number}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
        <p className="selection-message" aria-live="polite">
          {answer === null ? 'いくつだったかな？' : `${answer}こ えらんだよ！`}
        </p>
        <button className="wood-button confirm-button" type="button" disabled={answer === null} onClick={onConfirm}>
          これにする！ <span aria-hidden="true">▶</span>
        </button>
      </div>
      <button type="button" className="back-button" onClick={onBack}>← もどる</button>
    </section>
  )
}
