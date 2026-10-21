import './NameScreen.css'

type Props = {
  name: string
  onChange: (value: string) => void
  onConfirm: () => void
  onBack: () => void
}

// 画像の各行と同じ並び。最下段は小文字・濁点・半濁点を含む12キー。
const kanaRows = [
  ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
  ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'ゆ', 'り', 'を'],
  ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'よ', 'る', 'ん'],
  ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'っ', 'ー', 'れ'],
  ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'ゃ', 'ゅ', 'ょ', '゛', '゜'],
]

const rowY = [36.3, 46.2, 56.3, 66.4, 76.5]
const regularX = [7.6, 16.8, 25.9, 35.0, 44.0, 53.1, 62.2, 71.3, 80.4, 89.5]
const lastRowX = [7.6, 16.8, 25.9, 35.0, 44.0, 53.1, 62.2, 69.5, 76.3, 82.8, 89.3, 95.8]

const dakuten: Record<string, string> = {
  か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',
  さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',
  た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',
  は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ',う:'ゔ',
}
const handakuten: Record<string, string> = {
  は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ',
}
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
            className={`name-hotspot name-kana ${rowIndex === 4 && columnIndex >= 7 ? 'name-kana-small' : ''}`}
            style={{
              left: `${rowIndex === 4 ? lastRowX[columnIndex] : regularX[columnIndex]}%`,
              top: `${rowY[rowIndex]}%`,
            }}
            aria-label={kana === '゛' ? 'てんてんをつける' : kana === '゜' ? 'まるをつける' : `${kana}を入力`}
            onClick={() => kana === '゛' || kana === '゜' ? applyMark(kana) : addKana(kana)}
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
