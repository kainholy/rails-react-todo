# ToDo アプリケーション 設計書

## 1. 概要

本ドキュメントは、React/Rails で構築する ToDo アプリケーションの設計を定義するものである。
ユーザーはアカウント登録・ログインを行うことで、自分専用の ToDo リストを管理できる。

---

## 2. 使用技術

| 領域           | 技術       | ライブラリ / フレームワーク |
| :------------- | :--------- | :-------------------------- |
| フロントエンド | TypeScript | React, SmartHR UI, vite     |
| バックエンド   | Ruby       | Ruby on Rails (API モード)  |
| データベース   | SQL        | PostgreSQL                  |
| 状態管理       | (任意)     | Zustand                     |
| ルーティング   | (任意)     | React Router                |

---

## 3. 機能要件

- **ユーザー認証機能**
  - [x] ユーザー新規登録ができる
  - [x] ログインができる
  - [x] ログアウトができる
- **ToDo 管理機能**
  - [x] ToDo を新規作成できる
  - [x] ToDo の一覧を閲覧できる
  - [x] ToDo の完了・未完了状態を切り替えることができる
  - [x] ToDo を削除できる
- **その他**
  - [x] ログインしていないユーザーは ToDo 管理機能を利用できない
  - [x] 他のユーザーの ToDo は見ることができない

---

## 4. データベース設計 (ER 図)

```
+-------------+      +-------------+
|    users    |      |    todos    |
+-------------+      +-------------+
| id (PK)     |      | id (PK)     |
| name        |---<--| user_id (FK)|
| email       |      | title       |
| password_digest |  | completed   |
| created_at  |      | created_at  |
| updated_at  |      | updated_at  |
+-------------+      +-------------+
```

### `users` テーブル

| カラム名          | データ型   | 説明・制約                                               |
| :---------------- | :--------- | :------------------------------------------------------- |
| `id`              | `bigint`   | 主キー (PK)                                              |
| `name`            | `string`   | ユーザー名                                               |
| `email`           | `string`   | メールアドレス (ユニーク制約)                            |
| `password_digest` | `string`   | ハッシュ化されたパスワード (`has_secure_password`を使用) |
| `created_at`      | `datetime` | 作成日時                                                 |
| `updated_at`      | `datetime` | 更新日時                                                 |

### `todos` テーブル

| カラム名     | データ型   | 説明・制約                                          |
| :----------- | :--------- | :-------------------------------------------------- |
| `id`         | `bigint`   | 主キー (PK)                                         |
| `title`      | `string`   | タスクの内容 (NULL は許可しない)                    |
| `completed`  | `boolean`  | 完了状態 (デフォルトは`false`)                      |
| `user_id`    | `bigint`   | `users`テーブルへの外部キー (FK)。NULL は許可しない |
| `created_at` | `datetime` | 作成日時                                            |
| `updated_at` | `datetime` | 更新日時                                            |

---

## 5. API エンドポイント設計

ベース URL: `/api/v1`

### 認証系

| HTTP メソッド | URL       | 役割                        |
| :------------ | :-------- | :-------------------------- |
| `POST`        | `/signup` | 新規ユーザー登録            |
| `POST`        | `/login`  | ログイン (セッション作成)   |
| `DELETE`      | `/logout` | ログアウト (セッション破棄) |

### ToDo 系 (要認証)

| HTTP メソッド | URL          | 役割                                    |
| :------------ | :----------- | :-------------------------------------- |
| `GET`         | `/todos`     | ログイン中ユーザーの ToDo 一覧を取得    |
| `POST`        | `/todos`     | 新規 ToDo を作成                        |
| `PATCH`       | `/todos/:id` | ToDo を更新 (主に`completed`の切り替え) |
| `DELETE`      | `/todos/:id` | ToDo を削除                             |

---

## 6. フロントエンド コンポーネント設計

コンポーネントは Atmic Design を参考にしつつ、以下の粒度で分割する。
UI パーツには **SmartHR UI** を積極的に活用する。

- **`pages/`** (ページ単位のコンポーネント)
  - `LoginPage.tsx`: ログイン・新規登録ページ
  - `TodoPage.tsx`: ログイン後のメインページ
- **`components/`** (再利用可能なコンポーネント)
  - `Header.tsx`: アプリケーションヘッダー (ユーザー名、ログアウトボタン表示)
  - `TodoList.tsx`: ToDo のリスト全体を管理・表示する
  - `TodoItem.tsx`: 個々の ToDo アイテムを表示・操作する
  - `AddTodoForm.tsx`: 新しい ToDo を追加するフォーム

### UI 要素のマッピング

- **テキスト入力**: `<Input />`
- **ボタン**: `<Button />`
- **チェックボックス**: `<Checkbox />`
- **レイアウト**: `<Stack />`, `<Cluster />`
