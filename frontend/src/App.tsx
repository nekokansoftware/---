
import { useState, useEffect, useRef, type ComponentType, type CSSProperties } from 'react'
import StartScreen from './components/StartScreen'
import AnswerScreen  from './components/AnswerScreen'
import  ConfirmScreen  from './components/ConfirmScreen'
import './App.css'
import './components/StartScreen.css'
import './styles/WindTransition.css'
import './components/AnswerScreen.css'
import './components/ConfirmScreen.css'

type Screen = 'start' | 'answer' | 'confirm'
type ConfirmScreenProps = {
  answer: number
  onEdit: () => void
  onBack: () => void
}

const ConfirmationScreen = ConfirmScreen as unknown as ComponentType<ConfirmScreenProps>

const leafImages = [
  '/leaf-green.png',
  '/leaf-lightgreen.png',
  '/leaf-yellow.png',
]

// 葉っぱの位置・大きさ・速度を最初に固定しておく
const leaves = Array.from({ length: 110 }, (_, i) => {
  const random = (seed: number) => {
    const x = Math.sin(seed * 127.1 + 78.233) * 43758.5453
    return x - Math.floor(x)
  }

  return {
    id: i,
    image: leafImages[i % leafImages.length],
    y: random(i + 1) * 110 - 5,
    size: 35 + random(i + 200) * 125,
    delay: random(i + 400) * 0.85,
    duration: 1.1 + random(i + 600) * 0.65,
    rotation: 360 + random(i + 800) * 720,
  }
})

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const windTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      windTimers.current.forEach(clearTimeout)
    }
  }, [])

  function startGame() {
    if (isWindPlaying) return

    setIsWindPlaying(true)

    // 葉っぱが画面を覆ったタイミングで切り替える
    windTimers.current.push(setTimeout(() => {
      setAnswer(null)
      setScreen('answer')
    }, 1450))

    // 葉っぱが飛び去ったら演出を終了
    windTimers.current.push(setTimeout(() => {
      setIsWindPlaying(false)
      windTimers.current = []
    }, 2900))
  }

  function returnToStart() {
    setAnswer(null)
    setScreen('start')
  }

  return (
    <main className="nekohan" lang="ja">
      <div className="page">
        {screen === 'start' && (
          <StartScreen onStart={startGame} />
        )}

        {screen === 'answer' && (
          <AnswerScreen
            answer={answer}
            onChange={setAnswer}
            onConfirm={() => {
              if (answer !== null) {
                setScreen('confirm')
              }
            }}
            onBack={returnToStart}
          />
        )}

        {screen === 'confirm' && answer !== null && (
          <ConfirmationScreen
            answer={answer}
            onEdit={() => setScreen('answer')}
            onBack={returnToStart}
          />
        )}
      </div>

      {isWindPlaying && (
        <div className="wind-transition" aria-hidden="true">
          <div className="wind-leaf-cover" />

          {leaves.map((leaf) => (
            <img
              key={leaf.id}
              src={leaf.image}
              className="wind-leaf"
              alt=""
              draggable={false}
              style={{
                '--leaf-y': `${leaf.y}%`,
                '--leaf-size': `${leaf.size}px`,
                '--leaf-delay': `${leaf.delay}s`,
                '--leaf-duration': `${leaf.duration}s`,
                '--leaf-rotation': `${leaf.rotation}deg`,
              } as CSSProperties}
            />
          ))}
        </div>
      )}
    </main>
  )
}
