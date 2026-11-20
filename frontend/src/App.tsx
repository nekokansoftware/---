
import { useState, useEffect, useRef } from 'react'
import WindTransitionCanvas from './components/WindTransitionCanvas'
import { getSensorStatus, resetSensorCount } from './utils/sensorApi'
import StartScreen from './components/StartScreen'
import AnswerScreen  from './components/AnswerScreen'
import NameScreen from './components/NameScreen'
import Result from './pages/Result'
import Ranking from './pages/Ranking'
import './App.css'
import './components/StartScreen.css'
import './styles/WindTransition.css'
import './components/AnswerScreen.css'
import './styles/Responsive.css'
import './styles/PageTurnTransition.css'

type Screen = 'start' | 'answer' | 'name' | 'result' | 'ranking'

const leafImages = ['/leaf-green.png', '/leaf-lightgreen.png', '/leaf-yellow.png']

export default function App() {
  // オフライン時は従来のデモ値（1回）を使う。
  const [actual, setActual] = useState(1)
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const pageTurnTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const windTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // 次の画面で使う画像を先に読み込み、切り替え時の一瞬の空白を抑える
  useEffect(() => {
    const images = ['/nekokan-nickname.png', '/nekokan-nyuryoku-no-cat.png', '/sipponasi.png', '/nekokan-tail.png', '/nekokan-back.png', ...leafImages]
    images.forEach(src => {
      const img = new Image()
      img.src = src
      if (typeof img.decode === 'function') void img.decode().catch(() => {})
    })
  }, [])

  useEffect(() => {
    return () => {
      windTimers.current.forEach(clearTimeout)
      pageTurnTimers.current.forEach(clearTimeout)
    }
  }, [])

  function startGame() {
    if (isWindPlaying) return

    setIsWindPlaying(true)
    setActual(1)
    // Java側のゲーム用カウンターをリセット。サーバー未起動でもデモは続行。
    void resetSensorCount().catch(error => console.warn('Sensor reset unavailable (demo mode):', error))

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

  // 名前画面の猫が後ろを向き、名前入力のシートを下へ引っぱる。
  // 下にある回答画面の猫は演出終了まで表示しない。
  function confirmNameWithPageTurn() {
    if (isPageTurning || !playerName.trim()) return

    setAnswer(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScreen('answer')
      return
    }

    setIsPageTurning(true)
    pageTurnTimers.current.push(setTimeout(() => {
      setScreen('answer')
      setIsPageTurning(false)
      pageTurnTimers.current = []
    }, 2800))
  }

  function returnToStart() {
    setAnswer(null)
    setPlayerName('')
    setScreen('start')
  }

  if (screen === 'result' && answer !== null) {
    return (
      
        <Result
          answer={answer}
          actual={actual}
          nickname={playerName}
          onRanking={(id) => {
            setCurrentEntryId(id)
            setScreen('ranking')
          }}
        />
      
    )
  }

  if (screen === 'ranking') {
    return (
      
        <Ranking currentEntryId={currentEntryId} onBack={returnToStart} />
      
    )
  }

  return (
    
    <main className="nekohan" lang="ja">
      <div className="page">
        {screen === 'start' && (
          <StartScreen onStart={startGame} />
        )}

        {(screen === 'answer' || (screen === 'name' && isPageTurning)) && (
          <div className={isPageTurning ? 'page-turn-answer-underlay' : 'page-turn-answer-normal'}>
          <AnswerScreen
            answer={answer}
            onChange={setAnswer}
            onConfirm={async () => {
              if (answer === null) return
              try {
                const status = await getSensorStatus()
                // 最新の実測値を使う。通信できないときは従来のデモ値にフォールバック。
               setActual(status.recording ? status.count : 1)
              } catch (error) {
                console.warn('Sensor unavailable (demo mode):', error)
                setActual(1)
              }
              setScreen('result')
            }}
            onBack={() => setScreen('name')}
            showCat={!isPageTurning}
          />
          </div>
        )}

        {screen === 'name' && (
          <NameScreen
            name={playerName}
            onChange={setPlayerName}
            onBack={returnToStart}
            onConfirm={confirmNameWithPageTurn}
            isPageTurning={isPageTurning}
          />
        )}
        {isPageTurning && (
          <img
            src="/nekokan-back.png"
            className="name-pull-cat"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        )}
      </div>

      {isPageTurning && <div className="page-turn-input-blocker" aria-hidden="true" />}

      {isWindPlaying && <WindTransitionCanvas />}

    </main>
    
  )
}
