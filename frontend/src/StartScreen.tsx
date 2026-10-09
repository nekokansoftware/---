type Props = { onStart: () => void }

export default function StartScreen({ onStart }: Props) {
  return (
    <section className="start-artwork" aria-label="ネコカン スタート画面">
      <h1 className="visually-hidden">ネコカン</h1>
      <button
        className="artwork-start-button"
        type="button"
        onClick={onStart}
        aria-label="スタート！"
        title="スタート！"
      />
    </section>
  )
}
