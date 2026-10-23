import './NameScreen.css'

type Props = {
  name: string
  onChange: (value: string) => void
  onConfirm: () => void
  onBack: () => void
}

// 画像の10列×5行に正確に合わせる（右端は濁点・半濁点）
const kanaRows = [
  ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
  ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'ゆ', 'り', 'を'],
  ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'よ', 'る', 'ん'],
  ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', '小', 'れ', '゛'],
  ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'ー', 'ろ', '゜'],
]

const rowY = [36.3, 46.3, 56.4, 66.5, 76.5]
const columnX = [7.6, 16.8, 25.9, 34.9, 44.0, 53.0, 61.8, 70.9, 80.0, 89.1]

const dakuten: Record<string, string> = {
  か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',
  さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',
  た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',
  は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ',う:'ゔ',
}
const handakuten: Record<string, string> = {
  は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ',
}
const smallKana: Record<string, string> = {
  あ:'ぁ', い:'ぃ', う:'ぅ', え:'ぇ', お:'ぉ',
  つ:'っ', や:'ゃ', ゆ:'ゅ', よ:'ょ', わ:'ゎ',
}
const largeKana = Object.fromEntries(
  Object.entries(smallKana).map(([large, small]) => [small, large])
) as Record<string, string>

const randomFirst = ['もふもふ', 'きらきら', 'にこにこ', 'ふわふわ', 'わくわく']
const randomSecond = ['ねこ', 'とら', 'うさぎ', 'ぱんだ', 'きつね']

function randomName() {
  return randomFirst[Math.floor(Math.random() * randomFirst.length)] +
    randomSecond[Math.floor(Math.random() * randomSecond.length)]
}

export default function NameScreen({ name, onChange, onConfirm, onBack }: Props) {
  function addKana(kana: string) {
    if (Array.from(name).length >= 8) return
    onChange(name + kana)
  }

  function applyMark(mark: '゛' | '゜') {
    if (!name) return
    const chars = Array.from(name)
    const last = chars[chars.length - 1]
    const converted = (mark === '゛' ? dakuten : handakuten)[last]
    if (!converted) return
    chars[chars.length - 1] = converted
    onChange(chars.join(''))
  }

  function toggleSmall() {
    if (!name) return
    const chars = Array.from(name)
    const last = chars[chars.length - 1]
    const converted = smallKana[last] ?? largeKana[last]
    if (!converted) return
    chars[chars.length - 1] = converted
    onChange(chars.join(''))
  }

  function deleteLast() {
    onChange(Array.from(name).slice(0, -1).join(''))
  }

  return (
    <section className="name-artwork">
      <img
        src="/nekokan-nickname.png"
        alt=""
        className="name-background"
        draggable={false}
      />

      {/* 画像のネコカン君の目を独立レイヤーで動かす */}
      <div className="nickname-cat-eyes" aria-hidden="true">
        <span className="nickname-eye nickname-eye-left"><span className="nickname-pupil" /></span>
        <span className="nickname-eye nickname-eye-right"><span className="nickname-pupil" /></span>
      </div>

      <output className="name-value" aria-live="polite">{name}</output>

      <button
        type="button"
        className="name-hotspot name-back"
        aria-label="ホームにもどる"
        onClick={onBack}
      />

      {kanaRows.flatMap((row, rowIndex) =>
        row.map((kana, columnIndex) => (
          <button
            key={`${rowIndex}-${columnIndex}`}
            type="button"
            className="name-hotspot name-kana"
            style={{
              left: `${columnX[columnIndex]}%`,
              top: `${rowY[rowIndex]}%`,
            }}
            aria-label={kana === '゛' ? 'てんてんをつける' : kana === '゜' ? 'まるをつける' : kana === '小' ? '最後の文字を小さくする' : `${kana}を入力`}
            onClick={() => kana === '゛' || kana === '゜' ? applyMark(kana) : kana === '小' ? toggleSmall() : addKana(kana)}
          />
        ))
      )}

      <button type="button" className="name-hotspot name-clear"
        aria-label="ぜんぶけす" onClick={() => onChange('')} />
      <button type="button" className="name-hotspot name-delete"
        aria-label="ひとつけす" onClick={deleteLast} />
      <button type="button" className="name-hotspot name-random"
        aria-label="おまかせでなまえをつくる" onClick={() => onChange(randomName())} />
      <button type="button" className="name-hotspot name-confirm"
        aria-label="けってい" disabled={!name.trim()} onClick={onConfirm} />
    </section>
  )
}
