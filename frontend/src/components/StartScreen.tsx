
import { useState } from 'react'

type Props = {
  onStart: () => void
}

export default function StartScreen({ onStart }: Props) {
  const [eyes, setEyes] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // 猫の両目の中間地点（画像に対する割合）
    const centerX = rect.width * 0.495
    const centerY = rect.height * 0.517

    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.hypot(dx, dy)

    // 黒目が動く最大距離（画像幅に比例）
    const maxMove = rect.width * 0.003

    if (distance === 0) {
      setEyes({ x: 0, y: 0 })
      return
    }

    setEyes({
      x: (dx / distance) * maxMove,
      y: (dy / distance) * maxMove,
    })
  }

  return (
    <section
      className="start-artwork eyes-background"
      aria-label="ネコカン スタート画面"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setEyes({ x: 0, y: 0 })}
    >
      <h1 className="visually-hidden">ネコカン</h1>

      <div
        className="cat-pupil left-pupil"
        style={{
          transform: `translate(-50%, -50%) translate(${eyes.x}px, ${eyes.y}px)`,
        }}
      />

      <div
        className="cat-pupil right-pupil"
        style={{
          transform: `translate(-50%, -50%) translate(${eyes.x}px, ${eyes.y}px)`,
        }}
      />
      
{/* まばたき用のまぶた */}
<div className="cat-eyelid left-eyelid" />
<div className="cat-eyelid right-eyelid" />
{/* ネコカン君の動くしっぽ */}
<img
  src="/nekokan-tail.png"
  className="cat-tail"
  alt=""
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

