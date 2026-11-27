
import { useState, useEffect, useRef } from 'react'
import WindTransitionCanvas from './components/WindTransitionCanvas'
import { getSensorStatus, resetSensorCount } from './utils/sensorApi'
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
import rankingBackground from './assets/Ranking-background.png'
import './App.css'
import './components/StartScreen.css'
import './styles/WindTransition.css'
import './components/AnswerScreen.css'
import './styles/Responsive.css'
import './styles/PageTurnTransition.css'

type Screen = 'start' | 'answer' | 'name' | 'result' | 'ranking'

// 名前入力への遷移が終わった後に、後続画面の素材だけを先読みする。
const preloadImages = [
  '/sipponasi.png', '/nekokan-tail.png',
  '/nekokan-nyuryoku-no-cat.png', '/nekokan-back.png',
  resultBackground, resultCatBody, resultCatTail,
  resultButterflyLeft, resultButterflyRight, '/nekokan-hukidasi.png',
  resultCurtain, rankingBackground, rankingCat,
]

export default function App() {
  // 実測値の取得に成功した場合のみ結果画面へ進む。
  const [actual, setActual] = useState(0)
  const [sensorBusy, setSensorBusy] = useState(false)
  const [sensorError, setSensorError] = useState('')
  const sensorLock = useRef(false)
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [isWindPlaying, setIsWindPlaying] = useState(false)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const pageTurnTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const windTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // ホーム画面と葉っぱの遷移中は先読みしない。
  // 同じURLは一度だけ読み込み、失敗しても次の素材へ進む。
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map())

  useEffect(() => {
    if (screen === 'start' || isWindPlaying) return
    let cancelled = false

    async function preloadAllScreens() {
      for (const src of new Set(preloadImages)) {
        if (cancelled) return
        if (imageCache.current.has(src)) continue

        const img = new Image()
        img.decoding = 'async'
        imageCache.current.set(src, img)

        try {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error('Image preload failed'))
            img.src = src
            if (img.complete && img.naturalWidth > 0) resolve()
          })
          if (!cancelled && typeof img.decode === 'function') {
            await img.decode().catch(() => {})
          }
        } catch {
          imageCache.current.delete(src)
        } finally {
          img.onload = null
          img.onerror = null
        }
      }
    }

    // 名前入力への遷移完了後に開始。読み込み完了まで操作を止めない。
    const timer = window.setTimeout(() => { void preloadAllScreens() }, 150)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [screen, isWindPlaying])

  useEffect(() => {
    return () => {
      windTimers.current.forEach(clearTimeout)
      pageTurnTimers.current.forEach(clearTimeout)
    }
  }, [])

  function startGame() {
    if (isWindPlaying) return

    setIsWindPlaying(true)
    setActual(0)
    setSensorError('')

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
    setSensorError('')
    setAnswer(null)
    setPlayerName('')
    setScreen('start')
  }

  async function confirmAnswer() {
    if (answer === null || sensorLock.current || isPageTurning || screen !== 'answer') return
    sensorLock.current = true
    setSensorBusy(true)
    setSensorError('')
    try {
      const status = await getSensorStatus()
      if (!status.connected || !status.recording) throw new Error('Sensor not ready')
      setActual(status.count)
      setScreen('result')
    } catch (error) {
      console.warn('Sensor read failed:', error)
      setSensorError('センサーに接続できません。係の人に知らせて、もう一度けっていを押してください。')
    } finally {
      sensorLock.current = false
      setSensorBusy(false)
    }
  }

  // 次の体験はリセット成功後に開始する。失敗時はランキング画面で再試行。
  async function finishGameAndReturnToStart() {
    if (sensorLock.current) return
    sensorLock.current = true
    setSensorBusy(true)
    setSensorError('')
    try {
      const status = await resetSensorCount()
      if (status.count !== 0 || !status.recording) throw new Error('Reset not confirmed')
      setActual(0)
      setCurrentEntryId(null)
      returnToStart()
    } catch (error) {
      console.warn('Sensor reset failed:', error)
      setSensorError('リセットできません。係の人に知らせて、もう一度ネコカン君を押してください。')
    } finally {
      sensorLock.current = false
      setSensorBusy(false)
    }
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
      
        <Ranking currentEntryId={currentEntryId} onBack={() => { void finishGameAndReturnToStart() }} busy={sensorBusy} error={sensorError} />
      
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
            onChange={(value) => { if (!sensorLock.current) setAnswer(value) }}
            onConfirm={() => { void confirmAnswer() }}
            onBack={() => { if (!sensorLock.current) { setSensorError(''); setScreen('name') } }}
            busy={sensorBusy}
            error={sensorError}
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
