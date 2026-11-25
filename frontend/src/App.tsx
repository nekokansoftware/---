
import { useState, useEffect, useRef } from 'react'
import WindTransitionCanvas from './components/WindTransitionCanvas'
import StartScreen from './components/StartScreen'
import AnswerScreen  from './components/AnswerScreen'
import NameScreen from './components/NameScreen'
import Result from './pages/Result'
import Ranking from './pages/Ranking'
import resultBackground from './assets/result-background-new.png.png'
import resultCatBody from './assets/cat-body.png.png'
import resultCatTail from './assets/cat-siri.png'
import resultButterflyLeft from './assets/left.png'
import resultButterflyRight from './assets/right.png'
import resultCurtain from './assets/curtain.png'
import rankingCat from './assets/Ranking-cat.png'
import './App.css'
import './components/StartScreen.css'
import './styles/WindTransition.css'
import './components/AnswerScreen.css'
import './styles/Responsive.css'
import './styles/PageTurnTransition.css'

type Screen = 'start' | 'answer' | 'name' | 'result' | 'ranking'

const leafImages = ['/leaf-green.png', '/leaf-lightgreen.png', '/leaf-yellow.png']

const resultImages = [
  resultBackground, resultCatBody, resultCatTail,
  resultButterflyLeft, resultButterflyRight, resultCurtain,
  '/nekokan-hukidasi.png', rankingCat,
]

export default function App() {
  // 実際の接触回数（ハードウェア連携までは仮の値）
  const actual = 1
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const pageTurnTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const windTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // 回答中に次の画面の画像を読み込み、遷移時の読み込み・デコード負荷を抑える。
  // 画像への参照を保持して、同じ展示セッションでの再読み込みを避ける。
  const resultImageCache = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    if (screen !== 'answer' || resultImageCache.current.length > 0) return
    resultImageCache.current = resultImages.map(src => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      if (typeof img.decode === 'function') void img.decode().catch(() => {})
      return img
    })
  }, [screen])

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
            onConfirm={() => {
              if (answer !== null) {
                setScreen('result')
              }
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
