# デプロイガイド

## 1. Vercel + Neon（推奨）

### Neon PostgreSQL セットアップ
1. [Neon](https://neon.tech)でアカウント作成
2. 新しいプロジェクト作成
3. 接続文字列をコピー

### Vercelデプロイ
1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubリポジトリと連携
3. 環境変数設定：
   ```
   DATABASE_URL=neon-connection-string
   NEXTAUTH_SECRET=random-secret-key
   ```

### 本番用 Prisma設定
```bash
# 本番DBにマイグレーション適用
npx prisma migrate deploy

# 本番DBにシードデータ投入
npx prisma db seed
```

## 2. Railway（オールインワン）

### セットアップ
1. [Railway](https://railway.app)でアカウント作成
2. GitHubリポジトリ接続
3. PostgreSQLサービス追加
4. 自動的に環境変数設定

### 設定ファイル
`railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/"
```

## 3. 環境変数一覧

### 必須
- `DATABASE_URL`: PostgreSQL接続文字列
- `NEXTAUTH_SECRET`: 認証用秘密鍵

### オプション
- `NODE_ENV=production`
- `NEXTAUTH_URL`: 本番URL

## 4. 本番用最適化

### package.json 更新
```json
{
  "scripts": {
    "postbuild": "prisma generate",
    "start": "next start"
  }
}
```

### Prisma最適化
```javascript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## 5. セキュリティ考慮事項

- 本番用の強力なパスワード設定
- HTTPS強制
- 環境変数の適切な管理
- データベースの定期バックアップ

## 6. モニタリング

- Vercel Analytics
- データベースメトリクス監視
- エラーログ確認