type Props = {
  onStart: () => void
}

export default function StartScreen({ onStart }: Props) {
  return (
    <section className="start-artwork" aria-label="ネコカン スタート画面">
      <h1 className="visually-hidden">ネコカン</h1>

      {/* 背景とは別の、全画面共通のネコカン君 */}
      <img
        src="/nekokankun.png"
        className="start-nekokankun"
        alt="ネコカン君"
        draggable={false}
      />

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
