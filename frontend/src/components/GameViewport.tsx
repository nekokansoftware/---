import { useEffect, useState, type ReactNode } from 'react'
import './GameViewport.css'

const DESIGN_WIDTH = 1280
const DESIGN_HEIGHT = 720

function viewportScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT)
}

/**
 * All screens share the same 16:9 coordinates.
 * Scale the entire stage uniformly rather than stretching each element.
 */
export default function GameViewport({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(viewportScale)

  useEffect(() => {
    const update = () => setScale(viewportScale())
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return (
    <div className="game-viewport">
      <div
        className="game-stage"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
