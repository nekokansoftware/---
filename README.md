# ネコカン君（ねこかんくん）

猫のヒゲによる空間認知を題材とした体験型Webアプリです。体験者が推測した接触回数と実際の接触回数を比較し、一致度をスコアとして表示します。

このブランチ（`nekoka_tablet`）は、展示での横向きiPadによる操作・表示に対応するための開発ブランチです。

## 主な機能

- スタート画面（キャラクターの瞬き・しっぽのアニメーション）
- ニックネーム入力
- 接触回数の回答入力
- 一致度・結果表示
- ランキング表示（ブラウザのLocalStorageに保存）
- タッチ操作・横向きタブレット向け表示

## 技術スタック

| 分類 | 技術 |
| --- | --- |
| フロントエンド | React 19、TypeScript 6 |
| スタイリング | CSS |
| 開発・ビルド | Vite 8、Node.js、npm |
| 静的解析 | ESLint |
| ランキング保存 | LocalStorage |
| バージョン管理 | Git、GitHub |

## システム構成

```text
Windows PC（Viteサーバー）
       │ HTTP / 同一Wi-Fi
       ▼
iPad（Safari）
  ├─ 回答入力・スコア計算
  └─ ランキング保存（LocalStorage）
```

ハードウェア連携の構想では、M5Stackから接触情報をJavaサーバーへ送信し、Webアプリで利用します。ただし、現在のタブレットブランチでは `App.tsx` の実際の接触回数が仮の値（`actual = 1`）に設定されており、ハードウェアとの接続は未統合です。

## 初回セットアップ（Windows PowerShell）

Git、Node.js、npmを事前にインストールしてください。Node.jsはVite 8に対応するバージョンを使用してください。

```powershell
cd $HOME
git clone -b nekoka_tablet --single-branch https://github.com/nekokansoftware/--- nekokan-tablet
cd nekokan-tablet/frontend
npm.cmd ci
```

すでにクローン済みの場合は再度クローンする必要はありません。

## 起動方法

```powershell
cd $HOME\nekokan-tablet\frontend
npm.cmd run dev -- --host 0.0.0.0
```

PCからはターミナルに表示される `Local` のURLで確認できます。

### iPadで表示する

1. PCとiPadを同じ信頼できるWi-Fi（スマートフォンのテザリング、展示用ルーターなど）に接続します。
2. PCで上記の起動コマンドを実行します。
3. ターミナルの `Network` に表示されたURLをiPadのSafariで開きます。
4. 必要に応じてSafariの共有メニューから「ホーム画面に追加」を選択します。

PCのViteサーバーは起動したままにしてください。IPアドレスはネットワークによって変わるため、接続先を切り替えた場合はURLを確認してください。ホーム画面への追加だけではオフラインでの単独起動はできません。

大学などの共有Wi-Fiでは端末間通信が制限される場合があります。接続できない場合は、テザリングなど別のネットワークを使用してください。開発サーバーをインターネットへ公開したり、ファイアウォール全体を無効にしたりする必要はありません。

## 最新の修正を取り込む

Viteを起動中の場合は、先に `Ctrl + C` で停止します。

```powershell
cd $HOME\nekokan-tablet
git pull --ff-only origin nekoka_tablet
cd frontend
npm.cmd ci
npm.cmd run dev -- --host 0.0.0.0
```

iPadでページを再読み込みしてください。依存関係に変更がない場合は `npm.cmd ci` を省略できます。

## ディレクトリ構成（主要ファイル）

```text
frontend/
├── public/                  # 画像素材
├── src/
│   ├── components/          # スタート・名前入力・回答画面など
│   ├── pages/               # 結果・ランキング画面
│   ├── styles/              # レスポンシブ表示・遷移演出
│   ├── utils/
│   │   └── rankingStorage.ts
│   ├── assets/              # 画像素材
│   └── App.tsx              # 画面遷移・状態管理
└── package.json
```

## スコア計算

回答回数と実際の接触回数の小さい方を大きい方で割り、100を掛けた一致度を使用します。両方が0の場合は100%です。

ランキングはスコアの降順で表示され、同点の場合は登録時刻の早い順になります。記録はアクセスしたブラウザの保存領域に保持されるため、別端末や別URLとは自動同期されません。

## 開発時の確認

```powershell
npm.cmd run build
npm.cmd run lint
```

展示前には、スタートボタン、名前入力、回答入力、画面遷移、結果表示、ランキング、タッチ判定を実機で確認してください。ハードウェア連携後は接触回数の取得とリセットも確認してください。

タブレット向けの変更は `nekoka_tablet` ブランチで管理し、mainへの反映はチームで確認したうえで行います。
