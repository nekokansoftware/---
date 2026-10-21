type ConfirmScreenProps = {
  answer: number
  onEdit: () => void
  onBack: () => void
  onNext: () => void
}

export default function ConfirmScreen({
  answer,
  onEdit,
  onBack,
  onNext,
}: ConfirmScreenProps) {
  return (
    <section aria-labelledby="confirm-title">
      <h1 id="confirm-title">こたえの確認</h1>
      <p>ひげが当たったと思う数は</p>
      <p><strong>{answer}個</strong></p>
      <p>この数でいいかな？</p>
      <button type="button" onClick={onEdit}>
        数を選びなおす
      </button>
      <button type="button" onClick={onNext}>
        つぎへ（なまえ入力）
      </button>
      <button type="button" onClick={onBack}>
        最初にもどる
      </button>
    </section>
  )
}
