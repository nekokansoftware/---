# ネコカンくん センサー連携（試験実装）

このフォルダの Java サーバーは、M5Stack からの `POST /contact` を受信し、接触回数を React に渡します。**本番用の認証・運用設定は未実装です。信頼できるローカルネットワークでのみ使用してください。**

## 起動

Java 11以上が入ったPC（Ubuntu / Windowsなど）でリポジトリのルートから：

```bash
javac backend/SensorReceiver.java
java -cp backend SensorReceiver
```

別のターミナルで：

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

タブレットとPCを同じWi-Fiに接続し、タブレットのブラウザで `http://<PCのIPv4アドレス>:5173` を開きます。M5Stackの `SERVER_URL` は `http://<PCのIPv4アドレス>:8000/contact` に変更してください。PCのファイアウォールで必要な通信を許可し、Wi-Fiの端末間通信制限がないか確認してください。

Viteは `/api` を同じPCの `127.0.0.1:8000` に転送します。Javaが別PCの場合は `SENSOR_SERVER_TARGET=http://<JavaサーバーのIP>:8000 npm run dev` で指定できます。**これはVite開発サーバー用の設定です。ビルド成果物を配信するときは、Webサーバー側にも `/api` のリバースプロキシが必要です。**

## API

- `POST /contact`：M5Stackから `{"contact":true,"button_b":false,"uptime_ms":12345}` を送信
- `GET /api/status`：現在値と前回のリセット後の累計接触回数 `count` を返す
- `POST /api/reset`：ランキング画面の「スタートにもどる」で `count` を0にする

Reactでは、ランキング画面の「スタートにもどる」を押すと `/api/reset` を呼び、次の体験のカウントを0にします。スタートボタンではリセットしません。Javaサーバーの起動直後も、接触回数0・計測中の状態で始まります。回答画面の「けってい」で `/api/status` から接触回数を取得して結果に使います。Javaへの通信ができない場合は従来のデモ値 **1回** を使います（`connected:false` だけではデモ値に戻しません）。現段階では画面内にデモモード表示はありません。Javaコードを変更した後は、古いプロセスを止めて再コンパイル・再起動してください。

```bash
curl -X POST http://localhost:8000/api/reset
curl -X POST http://localhost:8000/contact -H 'Content-Type: application/json' -d '{"contact":false,"button_b":false,"uptime_ms":1000}'
curl -X POST http://localhost:8000/contact -H 'Content-Type: application/json' -d '{"contact":true,"button_b":false,"uptime_ms":1100}'
curl http://localhost:8000/api/status
```

上の例では `count` は1になります。連続する `contact:true` の再送や10秒ごとのハートビートは追加カウントされません。

## 注意点

- M5Stackの送信コードは最低100msの送信間隔があるため、その間の短い接触は失われる可能性があります。厳密な採点にはM5Stack側での累計回数の送信を推奨します。
- センサー状態はJavaプロセスのメモリ上のみで保持され、再起動するとリセットされます。
- これは1台のM5Stack・1ゲーム進行を前提とする試験実装です。同時接続の複数タブレットによるリセットは想定していません。
- `button_b` は表示用の状態として保存するだけで、ゲーム制御には利用しません。
- `connected` は15秒以内のM5Stack受信を目安にした簡易判定です。
