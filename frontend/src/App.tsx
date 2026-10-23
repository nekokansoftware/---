import { useState } from 'react'
import Result from './pages/Result'
import Ranking from './pages/Ranking'

function App() {
  const [screen, setScreen] = useState<'result' | 'ranking'>('result')

  // 仮データ
  const answer = 4

  const handleRanking = () => {
    setScreen('ranking')
  }

  return (
    <>
      {screen === 'result' && (
        <Result
          answer={answer}
          onRanking={handleRanking}
        />
      )}

      {screen === 'ranking' && <Ranking />}
    </>
  )
}

export default App