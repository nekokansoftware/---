import { useState, type ComponentType } from 'react'
import StartScreen from './StartScreen'
import AnswerScreen  from './AnswerScreen'
import  ConfirmScreen  from './ConfirmScreen'
import './App.css'

type Screen = 'start' | 'answer' | 'confirm'
type ConfirmScreenProps = {
  answer: number
  onEdit: () => void
  onBack: () => void
}

const ConfirmationScreen = ConfirmScreen as unknown as ComponentType<ConfirmScreenProps>

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [answer, setAnswer] = useState<number | null>(null)

  function startGame() {
    setAnswer(null)
    setScreen('answer')
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
    </main>
  )
}