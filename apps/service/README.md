## ローカル開発環境のセットアップ手順

### VSCodeの場合、以下の拡張機能を入れると便利

`esbenp.prettier-vscode`

### Amplifyでの操作

rental-space-managerを選択し、developを選択、右側のダウンロードボタンからビルドアーティファクトをダウンロードをクリック  
zipを解凍し`/compute/default`にある`amplify_outputs.json`をプロジェクトのルートに置く

### 以下のコマンドを実行

```bash
//voltaをインストールしてない場合のみ実行
curl https://get.volta.sh | bash

//環境変数ファイルの複製
cp .\.env.local.example .\.env.local

//必要なパッケージをインストール
npm i

//起動
npm run dev
```

## PRを出す前に実行しよう

### ビルドでエラーが出ないか、以下のコマンドを実行

```bash
npm run build
```
PRマージをトリガーにdevelop環境へデプロイされる  
その環境にてデプロイ前のビルド失敗を回避するために、ローカル環境で確認すること

## ローカル環境URL
### 貸し会議室
```url
http://localhost:3000/reservations/meeting
```

### 貸しホール
```url
http://localhost:3000/reservations/hall
```

### 管理画面
```url
http://localhost:3000/admin
```

# 詳細ドキュメント

rentalSpace.md を参照

## Global Msg Modal使い方

```tsx
import { useMsg } from "@/contexts/MsgContext";

const { showMsg } = useMsg();

// errorを表示
showMsg("Error", "Please fill in this field.", "ok", "error");

// infoを表示
showMsg("Information", "Successful." "ok", "info");

try {
  await fetchApi();
} catch {
  // e.g
  showMsg("api error", "ok", "error");
}
```

### 新しいタイプ追加手順

1. MsgContext.tsx
2. MsgModal.tsx
