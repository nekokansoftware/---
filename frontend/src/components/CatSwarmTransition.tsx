import type { CSSProperties } from 'react'
import './CatSwarmTransition.css'

// 位置・大きさを固定乱数で決めて、再描画時に猫が飛び跳ねないようにする
const random = (seed: number) => {
  const n = Math.sin(seed * 127.1 + 78.233) * 43758.5453
  return n - Math.floor(n)
}

const crowd = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: 4 + random(i + 4) * 92,
  y: 7 + random(i + 54) * 83,
  size: 115 + random(i + 89) * 155,
  delay: .08 + Math.floor(i / 6) * .11 + random(i + 121) * .09,
  side: i % 2 === 0 ? -1 : 1,
  angle: -13 + random(i + 188) * 26,
}))

/** 名前入力から回答入力へ。左右からネコカンくんの大群が押し寄せる装飾演出。 */
export default function CatSwarmTransition() {
  return (
    <div className="cat-swarm-transition" aria-hidden="true">
      <div className="cat-swarm-crowd">
        {crowd.map(cat => (
          <div
            key={cat.id}
            className="cat-swarm-member"
            style={{
              '--swarm-x': `${cat.x}%`,
              '--swarm-y': `${cat.y}%`,
              '--swarm-size': `${cat.size}px`,
              '--swarm-delay': `${cat.delay}s`,
              '--swarm-start-x': `${cat.side * 115}vw`,
              '--swarm-rotate': `${cat.angle}deg`,
            } as CSSProperties}
          >
            <img src="/nekokan-tail.png" className="cat-swarm-tail" alt="" draggable={false} />
            <img src="/sipponasi.png" className="cat-swarm-body" alt="" draggable={false} />
            <span className="cat-swarm-pupil cat-swarm-pupil-left" />
            <span className="cat-swarm-pupil cat-swarm-pupil-right" />
          </div>
        ))}
      </div>

      {/* 最後に巨大なネコカンくんが近づいて画面を覆う */}
      <div className="cat-swarm-giant">
        <img src="/nekokan-tail.png" className="cat-swarm-tail" alt="" draggable={false} />
        <img src="/sipponasi.png" className="cat-swarm-body" alt="" draggable={false} />
        <span className="cat-swarm-pupil cat-swarm-pupil-left" />
        <span className="cat-swarm-pupil cat-swarm-pupil-right" />
      </div>
      <div className="cat-swarm-wipe" />
    </div>
  )
}
