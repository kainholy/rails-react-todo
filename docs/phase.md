# ToDo アプリケーション 実装方針（Phase Plan）

本ドキュメントは、Rails(API) と React( Vite + TS )で構築する ToDo アプリの段階的な実装計画を示す。

## 方針の前提

- バックエンド: Rails API モード + PostgreSQL
- フロントエンド: React + Vite + TypeScript + SmartHR UI
- 認証方式: JWT（HTTP Header Authorization: Bearer <token>）
- CORS: フロントのオリジン（例: http://localhost:5173）を Rails で許可

---

## Phase 0: 開発環境/品質基盤

- フロント: @smarthr/ui, axios, react-router-dom, zustand を導入
- 共有: .env 管理（frontend: VITE_API_BASE_URL, backend: 環境別設定）
- Lint/Format（任意）: ESLint/Prettier 設定
- GitHub リモート/ブランチ戦略（main + feature/\*）と PR 運用

## Phase 1: 認証 API（Rails）

- モデル: User(name, email[unique], password_digest)
  - has_secure_password, email uniqueness/index, バリデーション（email 形式, password 最小長）
- JWT 実装:
  - エンコード/デコード用サービス（秘密鍵は Rails credentials）
  - 認証フィルタ（before_action）を ApplicationController に実装
- エンドポイント:
  - POST /signup: ユーザー作成 → JWT 返却
  - POST /login: email/password 検証 → JWT 返却
  - GET /me: 現在ユーザー情報（JWT 必須）
- CORS 設定: config/initializers/cors.rb でフロントのオリジンを許可
- 返却形: { user: { id, name, email }, token }

## Phase 2: ToDo API（Rails）

- モデル: Todo(title:string, completed:boolean default:false, user:references)
- 関連: User has_many :todos, Todo belongs_to :user
- エンドポイント（すべて認証必須）:
  - GET /todos: 自ユーザーの一覧
  - POST /todos: 作成（title 必須）
  - PATCH /todos/:id: 更新（title/ completed）
  - DELETE /todos/:id: 削除
- セキュリティ: 他ユーザーのリソースにアクセス不可（current_user スコープ）
- レスポンス例: { id, title, completed, created_at, updated_at }

## Phase 3: 認証 UI（React）

- ルーティング: /login, /signup, /todos（保護ルート）
- ストア: authStore（token, user, isAuthenticated, actions）を zustand で実装（localStorage に永続化）
- API クライアント: axios インスタンス（baseURL=VITE_API_BASE_URL、Authorization ヘッダをインターセプト）
- 画面:
  - SignupPage, LoginPage: SmartHR UI でフォーム実装、成功時に token 保持 → /todos へ遷移
  - GuardedRoute: 未ログイン時は /login にリダイレクト

## Phase 4: ToDo UI（React）

- 画面/コンポーネント:
  - TodoPage: 初回マウントで /todos 取得
  - AddTodoForm: title 入力 → 作成
  - TodoList/TodoItem: 一覧表示、完了切替、削除
- 振る舞い:
  - 楽観的更新（任意）: 先に UI 反映 → 失敗時ロールバック
  - ローディング/エラー表示（SmartHR UI のコンポーネント活用）

## Phase 5: 結合/運用

- 環境変数:
  - frontend: .env.local に VITE_API_BASE_URL=http://localhost:3000
  - backend: CORS 許可、JWT 秘密鍵設定
- エラー処理/UX:
  - 共通エラーハンドラ（401 時はログアウト/ログイン誘導）
  - トースト/通知（任意）
- ログアウト: トークン破棄、/login へ遷移

## Phase 6: テスト/セキュリティ

- Rails: request spec（signup/login/me, todos CRUD）
- Frontend: コンポーネントテスト（任意、Vitest + React Testing Library）
- セキュリティ: JWT 有効期限、パスワードポリシー、CORS 精緻化

---

## API 契約（サマリ）

- 認証: Authorization: Bearer <token>
- POST /signup
  - req: { name, email, password, password_confirmation }
  - res: { user: { id, name, email }, token }
- POST /login
  - req: { email, password }
  - res: { user, token }
- GET /me → { user }
- GET /todos → { todos: Todo[] }
- POST /todos → { todo }
- PATCH /todos/:id → { todo }
- DELETE /todos/:id → { success: true }

---

## Definition of Done（抜粋）

- 未認証で /todos API は 401 を返す
- signup/login で JWT を受け取り、/me で本人情報が取得できる
- /todos で一覧・作成・更新（完了切替）・削除ができる
- フロントはログイン必須、未ログインは /login へ誘導
- 主要エラーがユーザーに分かる UI でハンドリングされる
