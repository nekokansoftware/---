
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

// 左から右へ風が通り抜けるよう、列ごとに到着をずらす
const leaves = Array.from({ length: 12 * 7 }, (_, i) => {
  const col = i % 12
  const row = Math.floor(i / 12)
  return {
    id: i,
    image: leafImages[i % leafImages.length],
    x: (col + .5) * (100 / 12),
    y: (row + .5) * (100 / 7),
    rotation: ((i * 73) % 90) - 45,
    delay: col * .023 + ((row * 7 + col * 3) % 4) * .009,
  }
})

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const [isLeavesExiting, setIsLeavesExiting] = useState(false)
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

    setIsLeavesExiting(false)
    setIsWindPlaying(true)

    // 葉っぱが画面を覆ったタイミングで切り替える
    windTimers.current.push(setTimeout(() => {
      setAnswer(null)
      setPlayerName('')
      setScreen('name')
    }, 950))

    // 葉っぱが一瞬画面を覆った後、同じ風で右へ飛ばす
    windTimers.current.push(setTimeout(() => setIsLeavesExiting(true), 1080))

    // 葉っぱが飛び去ったら演出を終了
    windTimers.current.push(setTimeout(() => {
      setIsWindPlaying(false)
      windTimers.current = []
    }, 1950))
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
        <div className={`wind-transition${isLeavesExiting ? ' leaves-exiting' : ''}`} aria-hidden="true">
          <div className="wind-leaf-cover" />

          {leaves.map((leaf) => (
            <img
              key={leaf.id}
              src={leaf.image}
              className="wind-leaf"
              alt=""
              draggable={false}
              style={{
                '--leaf-x': `${leaf.x}%`,
                '--leaf-y': `${leaf.y}%`,
                '--leaf-delay': `${leaf.delay}s`,
                '--leaf-rotation': `${leaf.rotation}deg`,
              } as CSSProperties}
            />
          ))}
        </div>
      )}
    </main>
  )
}
