
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

// 先行する葉は散発的。後半は葉そのものが重なって画面を埋める突風。
const leaves = Array.from({ length: 14 + 12 * 8 * 2 }, (_, i) => {
  const early = i < 14
  const n = i - 14
  const col = n % 12
  const row = Math.floor(n / 12) % 8
  const layer = Math.floor(n / 96)
  return {
    id: i,
    image: leafImages[i % leafImages.length],
    x: early ? 0 : (col + .5 + (scatter(i + 7) - .5) * .35) * (100 / 12),
    y: early ? 5 + scatter(i + 17) * 90 : (row + .5 + (scatter(i + 19) - .5) * .3) * (100 / 8),
    rotation: Math.round(scatter(i + 39) * 360 - 180),
    spin: Math.round((scatter(i + 51) > .5 ? 1 : -1) * (180 + scatter(i + 71) * 300)),
    delay: early ? (i < 2 ? i * .18 : .3 + (i - 2) * .065) : .55 + 1.12 * Math.pow(n / 191, .58) + (scatter(i + 91) - .5) * .09,
    duration: early ? 1.15 + scatter(i + 113) * .4 : 1.38,
    size: early ? 11 + scatter(i + 157) * 3 : 12 + scatter(i + 179) * 4,
    drift: Math.round((scatter(i + 197) - .5) * 3),
    early,
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

    // 葉っぱの流れに合わせて次画面を左から徐々に表示し、全面表示後に確定する
    windTimers.current.push(setTimeout(() => {
      setAnswer(null)
      setPlayerName('')
      setScreen('name')
    }, 3150))

    // 葉っぱが飛び去ったら演出を終了
    windTimers.current.push(setTimeout(() => {
      setIsWindPlaying(false)
      windTimers.current = []
    }, 3850))
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

      {isWindPlaying && screen === 'start' && (
        <div className="wind-next-screen" aria-hidden="true">
          <NameScreen name="" onChange={() => {}} onBack={() => {}} onConfirm={() => {}} />
        </div>
      )}

      {isWindPlaying && (
        <div className="wind-transition" aria-hidden="true">

          {leaves.map((leaf) => (
            <img
              key={leaf.id}
              src={leaf.image}
              className={`wind-leaf${leaf.early ? " wind-leaf-early" : " wind-leaf-gust"}`}
              alt=""
              draggable={false}
              style={{
                '--leaf-x': `${leaf.x}%`,
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
