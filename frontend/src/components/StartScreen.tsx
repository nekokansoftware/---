import { useEffect, useRef, useState } from 'react'

type Props = {
  onStart: () => void
}

export default function StartScreen({ onStart }: Props) {
  const count = useRef(0)
  const cooldown = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reaction, setReaction] = useState<{ id: number; angry: boolean } | null>(null)
  const serial = useRef(0)

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  function petCat() {
    if (cooldown.current) return
    count.current += 1
    const angry = count.current === 5
    if (timer.current !== null) clearTimeout(timer.current)
    setReaction({ id: ++serial.current, angry })
    if (angry) cooldown.current = true
    timer.current = setTimeout(() => {
      setReaction(null)
      if (angry) {
        count.current = 0
        cooldown.current = false
      }
      timer.current = null
    }, angry ? 1800 : 850)
  }

  return (
    <section className="start-artwork" aria-label="ネコカン スタート画面">
      <h1 className="visually-hidden">ネコカン</h1>

      {/* 本体・黒目・しっぽを別レイヤーにして動かす */}
      <div className={`start-cat${reaction?.angry ? ' start-cat-angry' : ''}`}>
        <img src="/nekokan-tail.png" className="start-cat-tail" alt="" draggable={false} aria-hidden="true" />
        <img
          src="/sipponasi.png"
          className="start-nekokankun"
          alt=""
          draggable={false}
        />
        <span className="start-cat-pupil start-cat-pupil-left" aria-hidden="true" />
        <span className="start-cat-pupil start-cat-pupil-right" aria-hidden="true" />
        <span className="start-cat-eyelid start-cat-eyelid-left" aria-hidden="true" />
        <span className="start-cat-eyelid start-cat-eyelid-right" aria-hidden="true" />
        <button type="button" className="start-cat-pet" aria-label="ネコカン君をなでる" onClick={petCat} />
        {reaction && (
          <div key={reaction.id} className={reaction.angry ? 'start-cat-hiss' : 'start-cat-hearts'} aria-hidden="true">
            {reaction.angry ? <span>シャー！</span> : <><span>♥</span><span>♥</span><span>♥</span></>}
          </div>
        )}
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
