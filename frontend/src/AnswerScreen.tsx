type Props = {
  answer: number | null
  onChange: (value: number) => void
  onConfirm: () => void
  onBack: () => void
}

export default function AnswerScreen({
  answer,
  onChange,
  onConfirm,
  onBack,
}: Props) {
  return (
    <>
      <h1>数を入力</h1>

      {[0, 1, 2, 3, 4, 5].map((number) => (
        <button
          key={number}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}

      <p>
        選んだ数：
        {answer === null ? '未選択' : `${answer}個`}
      </p>

      <button
        onClick={onConfirm}
        disabled={answer === null}
      >
        けってい
      </button>

      <button onClick={onBack}>
        戻る
      </button>
    </>
  )
}