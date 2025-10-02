# Vercel デプロイ後のセットアップ

## デプロイ完了後の手順

### 1. デプロイ URL の確認
デプロイ完了後、Vercel から提供される URL をメモしてください。
例: `https://money-system-xxxx.vercel.app`

### 2. 環境変数の追加設定
Vercel Dashboard → Project → Settings → Environment Variables で以下を追加：

```
NEXTAUTH_URL=https://your-deployed-url.vercel.app
```

### 3. データベースマイグレーション

Vercel CLI を使用してマイグレーションを実行：

```bash
# Vercel CLI のインストール（未インストールの場合）
npm i -g vercel

# Vercel にログイン
vercel login

# プロジェクトにリンク
vercel link

# 本番環境でマイグレーション実行
vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma migrate deploy

# シードデータ投入
npx dotenv -e .env.production -- npx prisma db seed
```

### 4. アプリケーションテスト

デプロイされたアプリで以下を確認：

- [ ] トップページが正常に表示される
- [ ] 取引一覧が表示される（シードデータ）
- [ ] 新しい取引を追加できる
- [ ] ダッシュボードが正常に動作する

### 5. ドメイン設定（オプション）

独自ドメインを使用する場合：

1. Vercel Dashboard → Project → Settings → Domains
2. カスタムドメインを追加
3. DNS設定でCNAMEレコードを設定

## トラブルシューティング

### ビルドエラーの場合
- Vercel Dashboard の Function Logs を確認
- 環境変数が正しく設定されているか確認

### データベース接続エラーの場合
- DATABASE_URL が正しく設定されているか確認
- Neon のデータベースが起動しているか確認

### マイグレーションエラーの場合
- Prisma スキーマとマイグレーションファイルを確認
- データベースの権限を確認