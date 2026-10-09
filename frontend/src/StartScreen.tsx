type StartScreenProps = {
  onStart: () => void
}

// 肉球
function Paw() {
  return (
    <svg
      className="paw"
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse
        cx="12"
        cy="26"
        rx="7"
        ry="10"
        transform="rotate(-25 12 26)"
      />
      <ellipse cx="25" cy="15" rx="7" ry="10" />
      <ellipse cx="41" cy="15" rx="7" ry="10" />
      <ellipse
        cx="54"
        cy="26"
        rx="7"
        ry="10"
        transform="rotate(25 54 26)"
      />
      <path d="M32 31C23 31 11 44 13 52C15 61 25 54 32 54C39 54 49 61 51 52C53 44 41 31 32 31Z" />
    </svg>
  )
}

// 猫
function Cat() {
  return (
    <svg
      className="cat"
      viewBox="0 0 180 140"
      aria-hidden="true"
    >
      <path
        d="M37 57L33 15L67 38Q90 29 113 38L147 15L143 57Q158 74 149 99Q137 124 90 124Q43 124 31 99Q22 74 37 57Z"
        fill="#ffe4b9"
        stroke="#815331"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      <path
        d="M43 33L47 53L60 44M137 33L133 53L120 44"
        fill="#f1afa0"
      />

      <path
        d="M79 37L83 50M91 35L91 49M103 37L99 50"
        fill="none"
        stroke="#e99c45"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M56 73Q63 64 70 73M110 73Q117 64 124 73"
        fill="none"
        stroke="#543b2b"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <ellipse
        cx="54"
        cy="86"
        rx="9"
        ry="5"
        fill="#f2b1a0"
      />

      <ellipse
        cx="126"
        cy="86"
        rx="9"
        ry="5"
        fill="#f2b1a0"
      />

      <path
        d="M84 82L96 82L90 89Z"
        fill="#815331"
      />

      <path
        d="M79 94Q85 101 90 92Q95 101 101 94"
        fill="none"
        stroke="#543b2b"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M45 85L9 78M44 94L7 99M135 85L171 78M136 94L173 99"
        fill="none"
        stroke="#815331"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// スタート画面
export default function StartScreen({
  onStart,
}: StartScreenProps) {
  return (
    <>
      <p className="subtitle">
        ネコのひげ感覚を体験しよう
      </p>

      <header className="title">
        <Paw />

        <h1 tabIndex={-1}>
          ネコカン
        </h1>

        <Paw />
      </header>

      <section
        className="intro"
        aria-label="ゲームの紹介"
      >
        <div className="cat-badge">
          <Cat />
        </div>

        <p>
          ひげが当たった数を、当ててみよう！
        </p>
      </section>

      <ol
        className="steps"
        aria-label="あそびかた"
      >
        <li className="step">
          <span
            className="step-number"
            aria-hidden="true"
          >
            1
          </span>

          <strong>数を入力</strong>

          <p>
            当たったと思う数を入力してね
          </p>
        </li>

        <li className="step">
          <span
            className="step-number"
            aria-hidden="true"
          >
            2
          </span>

          <strong>結果を見る</strong>

          <p>
            どのくらいあってるかな？
          </p>
        </li>

        <li className="step">
          <span
            className="step-number"
            aria-hidden="true"
          >
            3
          </span>

          <strong>ランキングを確認</strong>

          <p>
            きみは何位になったかな？
          </p>
        </li>
      </ol>

      <button
        className="start-button"
        type="button"
        onClick={onStart}
      >
        スタート！

        <span
          className="button-arrow"
          aria-hidden="true"
        >
          ▶
        </span>
      </button>

      <p className="note">
        じゅんびができたら、ボタンをおしてね
      </p>
    </>
  )
}