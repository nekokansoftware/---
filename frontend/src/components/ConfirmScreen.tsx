type Props = {
  selected: number
  saved: boolean
  error: string
  onSave: () => void
  onBack: () => void
  onNext: () => void
}

export default function ConfirmScreen({ selected, saved, error, onSave, onBack, onNext }: Props) {
  return (
    <>
      <h2 className="question">{selected} ほんで<br />いいかな？</h2>
      <section className="answer-card" aria-label="入力内容の確認">
        <p className="instruction">えらんだ数は {selected} ほんだよ！</p>
        <button type="button" className="confirm" disabled={saved} onClick={onSave}>
          {saved ? 'ほぞんしたよ！ ✓' : 'ほぞんする！ ▶'}
        </button>
        {saved && <p className="saved" role="status">このパソコンのブラウザーに保存しました。</p>}
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      <button type="button" className="back" onClick={saved ? onNext : onBack}>
        {saved ? 'つぎの人へ →' : '← えらびなおす'}
      </button>
    </>
  )
}
