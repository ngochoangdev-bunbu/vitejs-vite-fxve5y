# レンタルスペース環境構築

2024/09/18 バージョン

## 概要

コワーキングスペースのレンタルシステム

## 使われている外部API・システム

- MISOCA API  
  見積書・請求書作成・送信  
  https://doc.misoca.jp/
- Googleカレンダー  
  予約状況の管理
- Googleスプレッドシート  
  ログの記載
- GoogleReCaptcha  
  Bot対策
- AWS Cognito  
  ユーザー管理
- AWS Amplify  
  CI/CD

## フォルダ構成

```
amplify
┣ auth - 認証情報
┣ data - schema定義
┗ functions - ユーザーCRUD

src
┣ app
┃  ┣ admin/~ 管理画面
┃  ┣ api [next api router]
┃  ┣ components コンポーネント
┃  ┣ form 会議室　レンタルフォーム
┃  ┣ form-coworking コワーキングスペース　レンタルフォーム
┃  ┣ form-hall ホール　レンタルフォーム
┃  ┣ helper 汎用関数
┃  ┣ login ログインフォーム
┃  ┗ mypage マイページ
┣ interface 型定義
┗ utils ミドルウェア
```

nextの構成はnext app routerを採用しています。  
フォルダはルートを定義するために使用されます。  
`app/~`に配置されたフォルダはクライアントルート  
`app/api/~`に配置されたフォルダはAPIルート  
としてルート定義されます。  
参考：[Next.js Docs](https://nextjs.org/docs)

# 開発環境の起動

1. パッケージのインストール

   ```
   npm install
   ```

2. .env.local.exampleから.env.localを作成
3. rental-space-managerを選択し、developを選択、右側のダウンロードボタンからビルドアーティファクトをダウンロードをクリック  
   zipを解凍し`/compute/default`にある`amplify_outputs.json`をプロジェクトのルートに置く
4. amplify_output.jsonのuser_pool_client_idをCOGNITO_USER_POOL_CLIENT_IDに記載
5. 起動

   ```
   npm run dev
   ```

※バックエンドが更新されるたびにamplify_output.jsonをダウンロードする必要があります。

# Misoca APIの利用

※SlackのレンタルスペースCanvasにある環境変数を使用すれば以下の手順をスキップできます  
　MISOCAのコンソールにログインしているアカウントに見積書が作成されるためAmplifyのdev環境と異なるアカウントを使用する場合注意が必要

1. 弥生アカウントを作る  
   [弥生マイポータルの契約管理＞クラウドアプリ管理＞サービスの契約](https://store.yayoi-kk.co.jp/service_contract)より  
   MISOCAを無料契約(サービスのお申込み)
2. https://app.misoca.jp/oauth2/applications に弥生IDでログイン
3. 新しいアプリケーションから新規で作成
4. 名称は適当に記載し、  
   コールバックURLはhttp://localhost:3000/api/misoca-auth-callback を指定する。
5. 登録後にコールバックURLは認証ボタンを押す。  
   この時にローカルホストを起動させておく必要がある。  
   アプリケーションID・シークレット・コールバックURLを.envに記載
   ```
   NEXT_PUBLIC_MISOCA_APPLICATION_ID=アプリケーションID
   MISOCA_SECRET=シークレット
   NEXT_PUBLIC_MISOCA_REDIRECT_URL=コールバックURL
   ```

# Google APIの利用

※SlackのレンタルスペースCanvasにある環境変数を使用すれば以下の手順をスキップできます

1. GCP Google Cloud Platformアカウントの作成
2. プロジェクトの作成。プロジェクト名は適当に記載
3. クイックアクセスや、左上のサイドバーボタンからAPIとサービスを選択  
   ライブラリから　Google Calendar API と Google Sheets API を選択し有効化する
4. 「IAMと管理」のサービスアカウントからサービスアカウントの作成  
   サービスアカウント名を記載。サービスアカウントIDは自動で生成される。  
   省略可能箇所は省略して完了。
5. 作成したアカウントを選択し、キータブから鍵を追加する(キータイプはjson)
6. ダウンロードされたjsonを開き、内容の一部を.envに記載
   ```
   GOOGLE_CLIENT_EMAIL=client_email
   GOOGLE_PRIVATE_KEY=private_key
   ```
7. Google CalendarとGoogle Spread Sheet

   ```
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID_COWORKING=カレンダーID
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_MD=カレンダーID
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID_MEETING_SM=カレンダーID
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID_HALL=カレンダーID
   GOOGLE_SPREADSHEET_ID=https://docs.google.com/spreadsheets/d/*****/edit ******の部分を記載
   ```

   - カレンダーIDは Google Calenderのメニューからほかのカレンダーでカレンダーを追加し、  
     GCPのアカウントを編集権限をつけて追加  
     追加したカレンダーの設定からカレンダーIDを記載する

   - Google Spread Sheetに右上の共有からGCPのアカウントを編集権限をつけて追加

   - Google Calendarは今後コワーキング・会議室・ホールの３つに分かれます。
     （本番環境ではカレンダーIDは使い分けるが開発環境では1つでも良い）

   - 共有からGCPのアカウントを編集権限をつけて追加

   ※GCPアカウントはGCPのAPIとサービス>認証情報>サービスアカウントのユーザーです。

8. GoogleReCaptchaの利用

   1. https://www.google.com/recaptcha/admin/create にアクセスし、新しいサイトを登録する

      ```
      reCAPTCHAタイプは「チャレンジ（v2）」の、「「私はロボットではありません」チェックボックス」を選択

      使用するドメインを入力(ローカルの場合はlocalhost)

      Google Cloud Platformのプロジェクトを選択
      ```

   2. 発行されたサイトキーとシークレットキーを環境変数に設定する

      ```
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY=サイトキー
          RECAPTCHA_SECRET_KEY=シークレットキー
      ```

# AWS Cognitoの利用

rental-space-managerのamplify、デプロイ>デプロイされたバックエンドリソースからダウンロード  
その中にあるuser_pool_client_idを.envに記載する

```
COGNITO_USER_POOL_CLIENT_ID=user_pool_client_id
```

# Stripeの利用

※SlackのレンタルスペースCanvasにある環境変数を使用すれば以下の手順をスキップできます

1.  テストの場合、https://dashboard.stripe.com/test/developers にアクセスし、
    右上のテスト環境がオンになっていることを確認する

    - 本番の場合は https://dashboard.stripe.com/developers にアクセスするか、右上のテスト環境をオフにする

2.  開発者の下側のバーのAPIキーを選択

3.  標準キーの欄にある、公開可能キー、シークレットキーを環境設定に設定する

    ```
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=公開可能キー
    STRIPE_SECRET_KEY=シークレットキー
    ```

- テストの場合、キーは`pk_test_`や、`sk_test_`で始まります
