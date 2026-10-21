
type Props = {
  answer: number | null
  onChange: (value: number | null) => void
  onConfirm: () => void
  onBack: () => void
}

const keys = [
  { digit: '1', x: 27.5, y: 52.1 },
  { digit: '2', x: 39.2, y: 52.1 },
  { digit: '3', x: 50.1, y: 52.1 },
  { digit: '4', x: 61.4, y: 52.1 },
  { digit: '5', x: 72.8, y: 52.1 },
  { digit: '6', x: 27.5, y: 64.8 },
  { digit: '7', x: 39.2, y: 64.8 },
  { digit: '8', x: 50.1, y: 64.8 },
  { digit: '9', x: 61.4, y: 64.8 },
  { digit: '0', x: 72.8, y: 64.8 },
]

export default function AnswerScreen({
  answer,
  onChange,
  onConfirm,
}: Props) {
  const input = answer === null ? '' : String(answer)

  // 数字を追加する
  function addDigit(digit: string) {
    if (input.length >= 3) return

    const next = input + digit
    onChange(Number(next))
  }

  // 最後の数字を1つ消す
  function deleteLast() {
    const next = input.slice(0, -1)
    onChange(next === '' ? null : Number(next))
  }

  // 全部消す
  function clearAll() {
    onChange(null)
  }

  return (
    <section className="answer-artwork">

      {/* 背景画像 */}
      <img
        src="/nekokan-nyuryoku.png"
        alt=""
        className="answer-background"
        draggable={false}
      />

      {/* 入力した数字 */}
      <output className="answer-value">
        {input}
      </output>

      {/* 数字ボタン */}
      {keys.map(({ digit, x, y }) => (
        <button
          key={digit}
          type="button"
          className="answer-hotspot digit-hotspot"
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
          aria-label={`${digit}を入力`}
          onClick={() => addDigit(digit)}
        />
      ))}

      {/* 全部消す */}
      <button
        type="button"
        className="answer-hotspot clear-hotspot"
        aria-label="全部消す"
        onClick={clearAll}
      />

      {/* 1つ消す */}
      <button
        type="button"
        className="answer-hotspot delete-hotspot"
        aria-label="1つ消す"
        onClick={deleteLast}
      />

      {/* 決定 */}
      <button
        type="button"
        className="answer-hotspot decide-hotspot"
        aria-label="決定"
        disabled={answer === null}
        onClick={onConfirm}
      />

    </section>
  )
}
