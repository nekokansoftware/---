export default function StartScreen({
  onStart,
}: {
  onStart: () => void
}) {
  return (
    <button onClick={onStart}>
      スタート！
    </button>
  )
}