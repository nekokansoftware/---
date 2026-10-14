type Props = {
  selected: number | null
  onSelect: (value: number) => void
  onConfirm: () => void
  onBack: () => void
}

export default function AnswerScreen({ selected, onSelect, onConfirm, onBack }: Props) {
  return (
    <>
      <h2 className="question">ひげはいくつ<br />あたったかな？</h2>
      <section className="answer-card" aria-label="ひげの数を入力">
        <p className="instruction">すうじを えらんでね！</p>
        <div className="numbers" role="group" aria-label="あたったひげの数">
          {[0, 1, 2, 3, 4, 5].map(value => (
            <button key={value} type="button" className="number"
              aria-pressed={selected === value} onClick={() => onSelect(value)}>
              {value}
            </button>
          ))}
        </div>
        <p className="selection" aria-live="polite">
          {selected === null ? 'いくつだったかな？' : `${selected} ほんを えらんだよ！`}
        </p>
        <button type="button" className="confirm" disabled={selected === null} onClick={onConfirm}>
          これにする！ ▶
        </button>
      </section>
      <button type="button" className="back" onClick={onBack}>← もどる</button>
    </>
  )
}
