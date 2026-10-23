type Props = {
  onStart: () => void
}

export default function StartScreen({ onStart }: Props) {
  return (
    <section className="start-artwork" aria-label="ネコカン スタート画面">
      <h1 className="visually-hidden">ネコカン</h1>

      {/* 本体・黒目・しっぽを別レイヤーにして動かす */}
      <div className="start-cat" role="img" aria-label="ネコカン君">
        <div className="start-cat-tail" aria-hidden="true" />
        <img
          src="/sipponasi.png"
          className="start-nekokankun"
          alt=""
          draggable={false}
        />
        <span className="start-cat-pupil start-cat-pupil-left" aria-hidden="true" />
        <span className="start-cat-pupil start-cat-pupil-right" aria-hidden="true" />
      </div>

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
