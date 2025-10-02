# 🚀 Vercel デプロイ手順

## 手順1: Vercelアカウント作成
1. [https://vercel.com](https://vercel.com) にアクセス
2. "Continue with GitHub" でログイン

## 手順2: プロジェクトインポート
1. "Add New..." → "Project" をクリック
2. "money_system" リポジトリを "Import"

## 手順3: 環境変数設定（重要）
以下の環境変数を **正確に** 設定してください：

### DATABASE_URL
```
postgresql://neondb_owner:npg_3UivaESKj5Ak@ep-nameless-dream-a1ke3abb-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### NEXTAUTH_SECRET
```
JfZl6cFm9h2hj6J871eV9JskiGWAD/JFDHqEw0WV6zY=
```

### NODE_ENV
```
production
```

## 手順4: デプロイ実行
"Deploy" ボタンをクリック

## 手順5: デプロイ完了後の設定
デプロイが完了したら、デプロイURLを使って以下の環境変数を追加：

### NEXTAUTH_URL
```
https://your-app-name.vercel.app
```

## ✅ 確認事項
- [ ] ビルドが成功している
- [ ] アプリが正常に表示される
- [ ] 取引一覧にデータが表示される（3件）
- [ ] 新しい取引を追加できる
- [ ] ダッシュボードが正常に動作する

## 🛠️ トラブルシューティング
### ビルドエラーの場合
- Function Logs を確認
- 環境変数が正しく設定されているか確認

### データベース接続エラーの場合
- DATABASE_URL が正確にコピーされているか確認
- Neonデータベースが稼働中か確認

## 📱 デプロイ後のURL例
```
https://money-system-xxx.vercel.app
```