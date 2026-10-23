
import { useState, useEffect, useRef, type ComponentType, type CSSProperties } from 'react'
import StartScreen from './components/StartScreen'
import AnswerScreen  from './components/AnswerScreen'
import ConfirmScreen from './components/ConfirmScreen'
import NameScreen from './components/NameScreen'
import './App.css'
import './components/StartScreen.css'
import './styles/WindTransition.css'
import './components/AnswerScreen.css'
import './components/ConfirmScreen.css'

type Screen = 'start' | 'answer' | 'confirm' | 'name'
type ConfirmScreenProps = {
  answer: number
  onEdit: () => void
  onBack: () => void
  onNext: () => void
}

const ConfirmationScreen = ConfirmScreen as unknown as ComponentType<ConfirmScreenProps>

const leafImages = [
  '/leaf-green.png',
  '/leaf-lightgreen.png',
  '/leaf-yellow.png',
]

// 決まった乱数で毎回同じ自然な配置にする
const scatter = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

// 最初は小さな葉が一枚ずつ、後半は上下に散った葉が増える
const leaves = Array.from({ length: 76 }, (_, i) => {
  const early = i < 14
  return {
    id: i,
    image: leafImages[i % leafImages.length],
    y: 5 + scatter(i + 17) * 90,
    rotation: Math.round(scatter(i + 39) * 360 - 180),
    spin: Math.round((scatter(i + 51) > .5 ? 1 : -1) * (180 + scatter(i + 71) * 300)),
    delay: i < 2 ? i * .18 : early ? .30 + (i - 2) * .065 : .98 + scatter(i + 91) * .45,
    duration: early ? 1.15 + scatter(i + 113) * .4 : 1.05 + scatter(i + 137) * .45,
    size: early ? 7 + scatter(i + 157) * 4 : 9 + scatter(i + 179) * 8,
    drift: Math.round((scatter(i + 197) - .5) * 28),
  }
})

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const windTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // 次の画面で使う画像を先に読み込み、切り替え時の一瞬の空白を抑える
  useEffect(() => {
    const images = ['/nekokan-nickname.png', '/nekokan-nyuryoku.png', ...leafImages]
    images.forEach(src => {
      const img = new Image()
      img.src = src
      if (typeof img.decode === 'function') void img.decode().catch(() => {})
    })
  }, [])

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
      setPlayerName('')
      setScreen('name')
    }, 1550))

    // 葉っぱが飛び去ったら演出を終了
    windTimers.current.push(setTimeout(() => {
      setIsWindPlaying(false)
      windTimers.current = []
    }, 2900))
  }

  function returnToStart() {
    setAnswer(null)
    setPlayerName('')
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
            onBack={() => setScreen('name')}
          />
        )}

        {screen === 'confirm' && answer !== null && (
          <ConfirmationScreen
            answer={answer}
            onEdit={() => setScreen('answer')}
            onBack={returnToStart}
            onNext={() => {
              console.log('名前:', playerName, '回答:', answer)
              // 結果画面完成後にここから遷移する
            }}
          />
        )}

        {screen === 'name' && (
          <NameScreen
            name={playerName}
            onChange={setPlayerName}
            onBack={returnToStart}
            onConfirm={() => setScreen('answer')}
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
                '--leaf-delay': `${leaf.delay}s`,
                '--leaf-rotation': `${leaf.rotation}deg`,
                '--leaf-spin': `${leaf.spin}deg`,
                '--leaf-duration': `${leaf.duration}s`,
                '--leaf-size': `${leaf.size}vw`,
                '--leaf-drift': `${leaf.drift}vh`,
              } as CSSProperties}
            />
          ))}
        </div>
      )}
    </main>
  )
}
