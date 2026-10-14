import { useState } from 'react'
import StartScreen from './components/StartScreen'
import AnswerScreen from './components/AnswerScreen'
import ConfirmScreen from './components/ConfirmScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState<'start' | 'answer' | 'confirm'>('start')
  const [selected, setSelected] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function reset() {
    setScreen('start')
    setSelected(null)
    setSaved(false)
    setError('')
  }

  function save() {
    if (selected === null || saved) return
    try {
      const raw = localStorage.getItem('nekokan-answers')
      const records: unknown = raw ? JSON.parse(raw) : []
      if (!Array.isArray(records)) throw new Error('Invalid saved records')
      localStorage.setItem('nekokan-answers', JSON.stringify([
        ...records,
        { id: crypto.randomUUID(), value: selected, createdAt: new Date().toISOString() },
      ]))
      setSaved(true)
      setError('')
    } catch {
      setError('保存できませんでした。ブラウザーの保存設定や空き容量を確認してください。')
    }
  }

  return (
    <main className="frame">
      <h1 className="brand">ネコカン</h1>
      {screen === 'start' && <StartScreen onStart={() => setScreen('answer')} />}
      {screen === 'answer' && (
        <AnswerScreen selected={selected} onSelect={setSelected}
          onConfirm={() => { if (selected !== null) setScreen('confirm') }} onBack={reset} />
      )}
      {screen === 'confirm' && selected !== null && (
        <ConfirmScreen selected={selected} saved={saved} error={error} onSave={save}
          onBack={() => { setError(''); setScreen('answer') }} onNext={reset} />
      )}
    </main>
  )
}

export default App
