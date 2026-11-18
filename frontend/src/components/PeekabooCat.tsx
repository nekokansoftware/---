import { useEffect, useState } from 'react'
import './PeekabooCat.css'

type Edge = 'bottom' | 'left' | 'right' | 'top'
const EDGES: Edge[] = ['bottom', 'left', 'right', 'top']
const INTERVAL_MS = 3100

/**
 * Decorative mascot only: ignores pointer events and never handles input.
 * Begins at the bottom, then chooses a different random edge each cycle.
 */
export default function PeekabooCat() {
  const [appearance, setAppearance] = useState<{ id: number; edge: Edge }>({
    id: 0,
    edge: 'bottom',
  })

  useEffect(() => {
    let previous: Edge = 'bottom'
    let count = 0
    const timer = window.setInterval(() => {
      const choices = EDGES.filter(edge => edge !== previous)
      const edge = choices[Math.floor(Math.random() * choices.length)]
      previous = edge
      count += 1
      setAppearance({ id: count, edge })
    }, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="peekaboo-layer" aria-hidden="true">
      <div
        key={appearance.id}
        className={`peekaboo-cat peekaboo-cat--${appearance.edge}`}
      >
        <div className="peekaboo-cat-art">
          <img className="peekaboo-cat-tail" src="/nekokan-tail.png" alt="" draggable={false} />
          <img className="peekaboo-cat-body" src="/sipponasi.png" alt="" draggable={false} />
          <span className="peekaboo-pupil peekaboo-pupil-left" />
          <span className="peekaboo-pupil peekaboo-pupil-right" />
        </div>
      </div>
    </div>
  )
}
