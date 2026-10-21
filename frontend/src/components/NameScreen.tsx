
import { useState } from 'react'
import './NameScreen.css'

type Props = {
  name: string
  onChange: (value: string) => void
  onConfirm: () => void
  onBack: () => void
}

const kanaRows = [
  ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
  ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'ゆ', 'り', 'を'],
  ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'よ', 'る', 'ん'],
  ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'っ', 'ー', 'れ'],
  ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'ゃ', 'ゅ', 'ょ', '゛゜'],
]

const rowY = [36.2, 45.4, 54.6, 63.8, 73.0]
const columnX = [7.6, 16.8, 25.9, 35.0, 44.2, 53.3, 62.5, 71.6, 80.8, 90.0, 96.0]

const first = ['もふもふ', 'きらきら', 'にこにこ', 'ふわふわ', 'わくわく']
const second = ['ねこ', 'とら', 'うさぎ', 'ぱんだ', 'きつね']

function randomName() {
  return first[Math.floor(Math.random() * first.length)] +
    second[Math.floor(Math.random() * second.length)]
}

export default function NameScreen({
  name,
  onChange,
  onConfirm,
  onBack,
}: Props) {
  const [showMarks, setShowMarks] = useState(false)

  function addKana(kana: string) {
    if (name.length >= 8) return
    onChange(name + kana)
  }

  function deleteLast() {
    onChange(name.slice(0, -1))
  }

  function clearAll() {
    onChange('')
  }

  function addMark(mark: 'dakuten' | 'handakuten') {
    const last = name.slice(-1)
    const marks: Record<string, string> = mark === 'dakuten'
      ? { か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ',う:'ゔ' }
      : { は:'ぱ',ひ:'ぴ',ふ:'ぷ',へ:'ぺ',ほ:'ぽ' }
    if (marks[last]) onChange(name.slice(0, -1) + marks[last])
    setShowMarks(false)
  }

  return (
    <section className="name-artwork">
      <img
        src="/nekokan-nickname.png"
        alt=""
        className="name-background"
        draggable={false}
      />

      <output className="name-value">
        {name}
      </output>

      <button
        type="button"
        className="name-hotspot name-back"
        aria-label="前の画面にもどる"
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
            aria-label={`${kana}を入力`}
            onClick={() => {
              if (kana === '゛゜') {
                setShowMarks(true)
              } else {
                addKana(kana)
              }
            }}
          />
        ))
      )}

      {showMarks && (
        <div className="name-mark-choices" role="group" aria-label="てんてんかまるをえらぶ">
          <button type="button" onClick={() => addMark('dakuten')}>゛ てんてん</button>
          <button type="button" onClick={() => addMark('handakuten')}>゜ まる</button>
          <button type="button" onClick={() => setShowMarks(false)}>とじる</button>
        </div>
      )}

      <button
        type="button"
        className="name-hotspot name-clear"
        aria-label="ぜんぶけす"
        onClick={clearAll}
      />

      <button
        type="button"
        className="name-hotspot name-delete"
        aria-label="ひとつけす"
        onClick={deleteLast}
      />

      <button
        type="button"
        className="name-hotspot name-random"
        aria-label="おまかせで名前をつくる"
        onClick={() => onChange(randomName())}
      />

      <button
        type="button"
        className="name-hotspot name-confirm"
        aria-label="けってい"
        disabled={!name.trim()}
        onClick={onConfirm}
      />
    </section>
  )
}
