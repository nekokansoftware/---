
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

// 葉の累計枚数を滑らかな指数イージングで増やす。終盤に向けて自然に加速。
const LEAF_COUNT = 384
const COVER_START = 64
const leaves = Array.from({ length: LEAF_COUNT }, (_, i) => {
  const covering = i >= COVER_START
  const index = i - COVER_START
  const col = index % 16
  const row = Math.floor(index / 16) % 10
  const layer = Math.floor(index / 160)
  const progress = (i + 1) / LEAF_COUNT
  // 累計出現率 (exp(k*t)-1)/(exp(k)-1) の逆関数。段差のない「ぐいーん」曲線。
  const curveStrength = 5
  const arrival = .03 + 2.05 * Math.log1p(progress * Math.expm1(curveStrength)) / curveStrength
  return {
    id: i,
    image: leafImages[i % leafImages.length],
    // 密集部分は画面全体に分散。規則的な格子を避けるため小さく揺らす
    x: covering ? (col + .5 + (scatter(i + 211) - .5) * .48 + (layer === 1 ? .3 : 0)) * 6.25 : 0,
    y: covering ? (row + .5 + (scatter(i + 223) - .5) * .4 + (layer === 1 ? .25 : 0)) * 10 : 6 + scatter(i + 17) * 88,
    rotation: Math.round(scatter(i + 39) * 360 - 180),
    spin: Math.round((scatter(i + 51) > .5 ? 1 : -1) * (120 + scatter(i + 71) * 250)),
    delay: arrival,
    // 後から現れた葉も切り替え時に中央へ集まるよう終了時刻を揃える
    duration: covering ? 3.8 - arrival : 1.25 + scatter(i + 113) * .4,
    size: covering ? 19 + scatter(i + 179) * 4 : 11 + scatter(i + 157) * 4,
    drift: covering ? 0 : Math.round((scatter(i + 197) - .5) * 3),
    covering,
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

    // 密度が最大になるタイミングで背後の画面を切り替える
    windTimers.current.push(setTimeout(() => {
      setAnswer(null)
      setPlayerName('')
      setScreen('name')
    }, 2760))

    // 葉っぱが飛び去ったら演出を終了
    windTimers.current.push(setTimeout(() => {
      setIsWindPlaying(false)
      windTimers.current = []
    }, 3900))
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

          {leaves.map((leaf) => (
            <img
              key={leaf.id}
              src={leaf.image}
              className={`wind-leaf${leaf.covering ? " wind-leaf-covering" : " wind-leaf-scattered"}`}
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
