# Money System - 個人経理管理アプリ

Next.js、TypeScript、Prisma、PostgreSQLを使用した家計簿管理アプリケーションです。

## 技術スタック

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI**: Material-UI (MUI)
- **Database**: PostgreSQL + Prisma ORM
- **Deployment**: Vercel + Neon

## 機能

- 📊 取引の追加・表示・管理
- 📈 ダッシュボードによる収支の可視化
- 🏷️ カテゴリ別の取引分類
- 🏷️ タグ機能
- 📱 レスポンシブデザイン

## ローカル開発

### 前提条件
- Node.js 18+
- Docker & Docker Compose

### セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/Shiro9029/money_system.git
cd money_system
```

2. 依存関係のインストール:
```bash
npm install
```

3. 環境変数の設定:
```bash
cp .env.example .env.local
# .env.localを編集して適切な値を設定
```

4. データベースの起動:
```bash
docker compose up -d
```

5. データベースのマイグレーション:
```bash
npx prisma migrate dev
npx prisma db seed
```

6. 開発サーバーの起動:
```bash
npm run dev
```

## デプロイ

### Vercel + Neon

1. **Neonでデータベース作成**
   - [Neon](https://neon.tech)でアカウント作成
   - 新しいプロジェクト作成
   - 接続文字列を取得

2. **Vercelでデプロイ**
   - [Vercel](https://vercel.com)でアカウント作成
   - GitHubリポジトリと連携
   - 環境変数を設定:
     - `DATABASE_URL`: Neonの接続文字列
     - `NEXTAUTH_SECRET`: ランダムな秘密鍵

3. **データベースセットアップ**
```bash
# 本番環境にマイグレーション適用
npx prisma migrate deploy

# シードデータ投入
npx prisma db seed
```

## コマンド

### 開発
- `npm run dev`: 開発サーバー起動
- `npm run build`: 本番ビルド
- `npm run typecheck`: TypeScript型チェック
- `npm run lint`: ESLint実行

### データベース
- `docker compose up -d`: PostgreSQLコンテナ起動
- `npx prisma studio`: データベースGUI起動
- `npx prisma migrate dev`: マイグレーション作成・適用
- `npx prisma db seed`: シードデータ投入

## ライセンス

ISC