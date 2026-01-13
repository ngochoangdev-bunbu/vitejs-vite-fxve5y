# Turborepo TypeScript Next.js Monorepo

このプロジェクトは、TurborepoとTypeScriptを使用したNext.jsモノレポのサンプルです。

## プロジェクト構造

```bash
monorepo-test/
├── apps/
│   ├── admin/          # 管理画面アプリ (port: 3002)
│   └── service/        # サービスアプリ (port: 3001)
├── packages/
│   ├── ui/             # 共有UIコンポーネント
│   └── typescript-config/  # TypeScript設定
├── turbo.json          # Turborepo設定
└── package.json        # ルートpackage.json
```

## 開始方法

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

全てのアプリを同時に起動:

```bash
npm run dev
```

個別のアプリを起動:

```bash
# サービスアプリ (http://localhost:3001)
cd apps/service && npm run dev

# 管理画面アプリ (http://localhost:3002)
cd apps/admin && npm run dev
```

### ビルド

全てのアプリをビルド:

```bash
npm run build
```

### リント

```bash
npm run lint
```

### 型チェック

```bash
npm run type-check
```

## アプリケーション

### Service App (http://localhost:3001)

- サービス向けのアプリケーション
- `/api` エンドポイントが利用可能

### Admin App (http://localhost:3002)

- 管理画面アプリケーション
- `/dashboard` でダッシュボード表示

## パッケージ

### UI Package

- `Button`: プライマリ・セカンダリボタンコンポーネント
- `Card`: カードコンポーネント

### TypeScript Config

- `base.json`: ベースTypeScript設定
- `nextjs.json`: Next.js用設定
- `react-library.json`: Reactライブラリ用設定

## スクリプト

- `npm run dev`: 全アプリの開発サーバー起動
- `npm run build`: 全アプリのビルド
- `npm run lint`: 全アプリのリント
- `npm run type-check`: 全アプリの型チェック
- `npm run clean`: キャッシュクリア
