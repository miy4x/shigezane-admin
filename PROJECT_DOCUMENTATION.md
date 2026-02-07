# 重実不動産 管理システム - フロントエンド詳細説明

## 📋 概要

### プロジェクトの目的・役割
このプロジェクトは、重実不動産の物件管理を行う管理者向けWebアプリケーションです。賃貸物件、ウィークリー物件、土地、住宅、駐車場の5つのカテゴリーの物件情報をCRUD操作し、画像アップロードや検索・一覧表示を行います。

### 想定ユーザー
- **管理者向け**: 不動産会社の管理者・スタッフが物件情報の登録・更新・削除を行う
- **顧客向けではない**: 顧客向けのフロントエンドは別途存在する想定

### 関連するバックエンドシステム
- **Azure Functions**: 物件CRUD操作のAPIエンドポイント
- **PostgreSQL**: 物件データベース（Azure Database for PostgreSQL）
- **Azure Blob Storage**: 画像ストレージ（予定）
- デプロイ先: `https://shigezane-functions.azurewebsites.net/api`

---

## 🛠️ 技術スタック

### フレームワーク・ライブラリ
| 技術 | バージョン | 用途 |
|------|----------|------|
| **React** | ^19.2.0 | UIフレームワーク |
| **TypeScript** | ~5.9.3 | 型安全性 |
| **Vite** | 7.2.5 (rolldown-vite) | ビルドツール |
| **React Router DOM** | ^7.13.0 | ルーティング |
| **Zustand** | ^5.0.11 | 状態管理 |
| **TanStack Query** | ^5.90.20 | データフェッチング・キャッシュ |
| **Axios** | ^1.13.4 | HTTP通信 |
| **Zod** | ^4.3.6 | バリデーション |
| **React Hook Form** | ^7.71.1 | フォーム管理 |

### スタイリング
- **Tailwind CSS** | ^4.1.18 | ユーティリティファーストCSS
- **Radix UI**: ヘッドレスUIコンポーネント（Dialog, Select, Checkbox等）
- **Lucide React**: アイコンライブラリ
- **Sonner**: トースト通知

### その他主要な依存関係
- **@azure/storage-blob**: Azure Blob Storage連携（画像アップロード用）
- **browser-image-compression**: 画像圧縮
- **class-variance-authority**: CVA（条件付きスタイリング）
- **next-themes**: テーマ管理（ダークモード対応準備）

---

## 📁 ディレクトリ構造

```
shigezane-admin/
├── public/                       # 静的アセット
├── src/
│   ├── assets/                   # 画像・フォント等
│   ├── components/               # Reactコンポーネント
│   │   ├── common/               # 共通コンポーネント
│   │   │   └── ImageUploadField.tsx  # 画像アップロードUI
│   │   ├── property/             # 物件関連コンポーネント
│   │   │   ├── BuildingSelector.tsx  # 建物選択UI
│   │   │   └── ParkingLotSelector.tsx # 駐車場選択UI
│   │   ├── ui/                   # Radix UI + shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   └── MainLayout.tsx        # レイアウトコンポーネント
│   ├── lib/                      # ユーティリティ・設定
│   │   ├── api-client.ts         # Axiosインスタンス設定
│   │   ├── api.ts                # API関数群
│   │   ├── queryClient.ts        # React Query設定
│   │   ├── utils.ts              # ヘルパー関数
│   │   └── validations.ts        # Zodスキーマ定義
│   ├── pages/                    # ページコンポーネント
│   │   ├── Dashboard.tsx         # ダッシュボード
│   │   ├── LoginPage.tsx         # ログイン画面
│   │   ├── RentalList.tsx        # 賃貸一覧
│   │   ├── RentalForm.tsx        # 賃貸登録・編集
│   │   ├── WeeklyList.tsx        # ウィークリー一覧
│   │   ├── WeeklyForm.tsx        # ウィークリー登録・編集
│   │   ├── LandList.tsx          # 土地一覧
│   │   ├── LandForm.tsx          # 土地登録・編集
│   │   ├── HouseList.tsx         # 住宅一覧
│   │   ├── HouseForm.tsx         # 住宅登録・編集
│   │   ├── ParkingList.tsx       # 駐車場一覧
│   │   └── ParkingForm.tsx       # 駐車場登録・編集
│   ├── store/                    # Zustand状態管理
│   │   ├── auth.ts               # 認証状態
│   │   └── ui.ts                 # UI状態
│   ├── types/                    # TypeScript型定義
│   │   └── property.ts           # 物件型定義
│   ├── App.tsx                   # ルートコンポーネント
│   ├── main.tsx                  # エントリーポイント
│   └── index.css                 # グローバルスタイル
├── index.html                    # HTMLテンプレート
├── vite.config.ts                # Vite設定
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
└── package.json                  # 依存関係
```

### 各ディレクトリの役割

- **`components/common`**: 画像アップロードなど複数ページで利用する共通コンポーネント
- **`components/property`**: 建物・駐車場などの選択UIコンポーネント
- **`components/ui`**: Radix UI + shadcn/uiベースの汎用UIコンポーネント
- **`lib`**: API通信、バリデーション、ユーティリティ関数
- **`pages`**: ルーティング対象となるページコンポーネント（一覧・フォーム）
- **`store`**: Zustandによるグローバル状態管理（認証、UI状態）
- **`types`**: 物件・ユーザー等の型定義

---

## ✅ 実装済み機能

### 1. ダッシュボード
**ファイル**: [Dashboard.tsx](src/pages/Dashboard.tsx)
- **説明**: 物件の統計情報を表示
- **表示内容**:
  - 総物件数、募集中物件数、空室率、月間成約数（準備中）
  - カテゴリー別の物件数と募集状況
  - 各カテゴリーへのクイックアクセスボタン
- **使用API**: 
  - `GET /getrentalunits`
  - `GET /getweeklyunits`
  - `GET /getlandproperties`
  - `GET /gethouseproperties`
  - `GET /getparkingspaces`

### 2. 賃貸物件管理
**ファイル**: [RentalList.tsx](src/pages/RentalList.tsx), [RentalForm.tsx](src/pages/RentalForm.tsx)
- **説明**: 賃貸マンション・アパートの部屋を管理
- **機能**:
  - 一覧表示（建物名、部屋番号、間取り、家賃、ステータス）
  - 新規登録・編集・削除
  - 建物マスタから建物を選択
  - 画像アップロード（サムネイル、間取り図、ギャラリー）
  - バリデーション（Zod）
- **使用API**: 
  - `GET /getrentalunits`
  - `POST /api/admin/rental` ⚠️ 未実装
  - `PUT /api/admin/rental/:id` ⚠️ 未実装
  - `DELETE /api/admin/rental/:id` ⚠️ 未実装

### 3. ウィークリー物件管理
**ファイル**: [WeeklyList.tsx](src/pages/WeeklyList.tsx), [WeeklyForm.tsx](src/pages/WeeklyForm.tsx)
- **説明**: ウィークリーマンション・短期賃貸の部屋を管理
- **機能**:
  - 一覧表示（建物名、部屋番号、間取り、日額/週額/月額、ステータス）
  - 新規登録・編集・削除
  - 日額・週額・月額の料金設定
  - 画像アップロード
- **使用API**:
  - `GET /getweeklyunits`
  - `POST /api/admin/weekly` ⚠️ 未実装
  - `PUT /api/admin/weekly/:id` ⚠️ 未実装
  - `DELETE /api/admin/weekly/:id` ⚠️ 未実装

### 4. 土地物件管理
**ファイル**: [LandList.tsx](src/pages/LandList.tsx), [LandForm.tsx](src/pages/LandForm.tsx)
- **説明**: 売買用の土地を管理
- **機能**:
  - 一覧表示（住所、販売価格、面積、用途地域、ステータス）
  - 新規登録・編集・削除
  - 建ぺい率・容積率・接道・地目などの詳細情報
  - 測量図・区画図のアップロード
- **使用API**:
  - `GET /getlandproperties`
  - `POST /api/admin/land` ⚠️ 未実装
  - `PUT /api/admin/land/:id` ⚠️ 未実装
  - `DELETE /api/admin/land/:id` ⚠️ 未実装

### 5. 住宅物件管理
**ファイル**: [HouseList.tsx](src/pages/HouseList.tsx), [HouseForm.tsx](src/pages/HouseForm.tsx)
- **説明**: 戸建・中古マンションを管理
- **機能**:
  - 一覧表示（住所、販売価格、間取り、築年数、ステータス）
  - 新規登録・編集・削除
  - 物件タイプ（戸建/中古マンション）選択
  - 土地面積・建物面積・構造・階数などの詳細情報
- **使用API**:
  - `GET /gethouseproperties`
  - `POST /api/admin/house` ⚠️ 未実装
  - `PUT /api/admin/house/:id` ⚠️ 未実装
  - `DELETE /api/admin/house/:id` ⚠️ 未実装

### 6. 駐車場管理
**ファイル**: [ParkingList.tsx](src/pages/ParkingList.tsx), [ParkingForm.tsx](src/pages/ParkingForm.tsx)
- **説明**: 月極駐車場の区画を管理
- **機能**:
  - 一覧表示（駐車場名、区画番号、月額料金、車両サイズ、ステータス）
  - 新規登録・編集・削除
  - 駐車場マスタから駐車場を選択
- **使用API**:
  - `GET /getparkingspaces`
  - `POST /api/admin/parking` ⚠️ 未実装
  - `PUT /api/admin/parking/:id` ⚠️ 未実装
  - `DELETE /api/admin/parking/:id` ⚠️ 未実装

### 7. ログイン機能（仮実装）
**ファイル**: [LoginPage.tsx](src/pages/LoginPage.tsx), [auth.ts](src/store/auth.ts)
- **説明**: 認証機能（現状はモック）
- **機能**:
  - メールアドレス・パスワードでログイン（現在は仮実装）
  - ログイン状態をZustandで管理
  - 認証ガード（RequireAuth）による保護ルート
- **実装状況**: ⚠️ バックエンドAPI未実装（モック認証）

### 8. 画像アップロード
**ファイル**: [ImageUploadField.tsx](src/components/common/ImageUploadField.tsx)
- **説明**: 画像のアップロード・プレビュー・削除
- **機能**:
  - ドラッグ&ドロップ対応
  - 画像圧縮（browser-image-compression）
  - プレビュー表示
  - 複数画像アップロード対応
- **実装状況**: ⚠️ Azure Blob Storage連携未実装（ダミーURLを返す）

---

## 🔄 データフロー

### API通信フロー

```
[React Component]
      ↓ useQuery / useMutation (TanStack Query)
[api.ts] (rentalApi.getAll() など)
      ↓ axios (apiClient)
[api-client.ts] (Interceptors)
      ↓ HTTP Request
[Azure Functions]
      ↓ SQL Query
[PostgreSQL Database]
```

### 認証フロー（予定）

```
[LoginPage]
      ↓ login(email, password)
[auth.ts Zustand Store]
      ↓ POST /api/auth/login (未実装)
[Azure Functions]
      ↓ JWT生成・検証
[PostgreSQL / Azure AD]
      ↓ トークン返却
[apiClient Interceptor]
      ↓ Authorization Header追加
[保護されたAPI]
```

### 画像アップロードフロー（予定）

```
[ImageUploadField]
      ↓ 画像選択
[browser-image-compression] 圧縮
      ↓
[uploadApi.getSasToken()] SASトークン取得
      ↓
[Azure Blob Storage SDK] 直接アップロード
      ↓
[フォーム送信時] Blob URL保存
      ↓
[PostgreSQL] 画像URLをJSONとして保存
```

---

## 🌐 API連携

### バックエンドAPI一覧

| エンドポイント | メソッド | 用途 | 実装状況 |
|--------------|---------|------|---------|
| `/getrentalunits` | GET | 賃貸物件一覧取得 | ✅ 実装済み |
| `/getweeklyunits` | GET | ウィークリー物件一覧取得 | ✅ 実装済み |
| `/getlandproperties` | GET | 土地物件一覧取得 | ✅ 実装済み |
| `/gethouseproperties` | GET | 住宅物件一覧取得 | ✅ 実装済み |
| `/getparkingspaces` | GET | 駐車場一覧取得 | ✅ 実装済み |
| `/api/admin/buildings` | GET | 建物マスタ一覧取得 | ⚠️ 未実装 |
| `/api/admin/parking-lots` | GET | 駐車場マスタ一覧取得 | ⚠️ 未実装 |
| `/createRental` | POST | 賃貸物件登録 | ✅ 実装済み |
| `/updateRental` | PUT | 賃貸物件更新 | ✅ 実装済み |
| `/deleteRental` | DELETE | 賃貸物件削除 | ✅ 実装済み |
| `/createWeekly` | POST | ウィークリー物件登録 | ✅ 実装済み |
| `/updateWeekly` | PUT | ウィークリー物件更新 | ✅ 実装済み |
| `/deleteWeekly` | DELETE | ウィークリー物件削除 | ✅ 実装済み |
| `/createLand` | POST | 土地物件登録 | ✅ 実装済み |
| `/updateLand` | PUT | 土地物件更新 | ✅ 実装済み |
| `/deleteLand` | DELETE | 土地物件削除 | ✅ 実装済み |
| `/createHouse` | POST | 住宅物件登録 | ✅ 実装済み |
| `/updateHouse` | PUT | 住宅物件更新 | ✅ 実装済み |
| `/deleteHouse` | DELETE | 住宅物件削除 | ✅ 実装済み |
| `/createParking` | POST | 駐車場登録 | ✅ 実装済み |
| `/updateParking` | PUT | 駐車場更新 | ✅ 実装済み |
| `/deleteParking` | DELETE | 駐車場削除 | ✅ 実装済み |
| `/createBuilding` | POST | 建物マスタ登録 | ✅ 実装済み |
| `/createParkingLot` | POST | 駐車場マスタ登録 | ✅ 実装済み |
| `/uploadImage` | POST | 画像アップロード | ✅ 実装済み |
| `/deleteImage` | DELETE | 画像削除 | ✅ 実装済み |
| `/api/auth/login` | POST | ログイン | ❌ 未実装 |
| `/api/admin/upload/sas-token` | POST | SASトークン取得 | ❌ 未実装 |

### エラーハンドリング

**実装箇所**: [api-client.ts](src/lib/api-client.ts)

```typescript
// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

**TODO**:
- 401エラー時のログアウト処理
- 500エラー時のトースト表示
- リトライ処理
- ネットワークエラー対応

---

## ⚙️ 環境設定

### 環境変数

**ファイル**: `.env` (未作成)

```bash
# Azure Functions APIベースURL
VITE_API_BASE_URL=https://shigezane-functions.azurewebsites.net/api

# Azure Blob Storage（画像アップロード用）
VITE_AZURE_STORAGE_ACCOUNT=<storage-account-name>
VITE_AZURE_STORAGE_CONTAINER=property-images

# 認証（予定）
VITE_AUTH_ENDPOINT=https://shigezane-functions.azurewebsites.net/api/auth
```

⚠️ **注意**: 現在は環境変数を使用せず、`api-client.ts`内でハードコードされています。

### セットアップ手順

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd shigezane-admin

# 2. 依存関係インストール
npm install

# 3. 環境変数設定（必要に応じて）
cp .env.example .env
# .envファイルを編集

# 4. 開発サーバー起動
npm run dev
# http://localhost:5173 で起動

# 5. ビルド
npm run build

# 6. プレビュー（本番ビルドを確認）
npm run preview
```

### デプロイ設定

**予定デプロイ先**: Azure Static Web Apps

**GitHub Actionsワークフロー**（未作成）:
```yaml
name: Deploy to Azure SWA

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"
```

---

## 🔒 セキュリティ考慮事項

### 1. 認証・認可（計画中）

**現状**: モック実装（誰でもログイン可能）

**予定実装**:
- Azure AD B2C / Azure Entra IDによる認証
- JWTトークンベースの認証
- リフレッシュトークン対応
- ロールベースアクセス制御（RBAC）

**実装例**:
```typescript
// api-client.ts
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 2. CORS設定

**現状**: Azure Functionsで`Access-Control-Allow-Origin: *`を設定（開発用）

**本番環境での推奨設定**:
```typescript
// Azure Functions側
'Access-Control-Allow-Origin': 'https://shigezane-admin.azurestaticapps.net',
'Access-Control-Allow-Credentials': 'true'
```

### 3. 入力バリデーション

**実装済み**: [validations.ts](src/lib/validations.ts)

- Zodスキーマによる型安全なバリデーション
- フロントエンド・バックエンド両方でバリデーション実施
- XSS対策（React標準のエスケープ機能）
- SQL Injection対策（PostgreSQLのパラメータ化クエリ）

### 4. 画像アップロードセキュリティ

**予定実装**:
- SASトークンによる一時的なアップロード権限
- ファイルサイズ制限（最大10MB）
- MIME型チェック（JPEG, PNG, WebPのみ）
- ファイル名のサニタイズ

### 5. API Keyの管理

**現状**: `authLevel: 'anonymous'`（認証なし）

**本番環境での推奨**:
- Azure Functions: `authLevel: 'function'` または `'admin'`
- APIキーをAzure Key Vaultで管理
- 環境変数経由での注入

---

## 📦 デプロイ情報

### デプロイ先

| 環境 | サービス | URL | 状態 |
|------|---------|-----|------|
| **フロントエンド** | Azure Static Web Apps | 未設定 | ❌ 未デプロイ |
| **バックエンド** | Azure Functions | `https://shigezane-functions.azurewebsites.net` | ✅ デプロイ済み |
| **データベース** | Azure Database for PostgreSQL | 非公開 | ✅ 稼働中 |
| **画像ストレージ** | Azure Blob Storage | 未設定 | ❌ 未設定 |

### CI/CDパイプライン

**現状**: 未設定

**推奨構成**:
1. **GitHub Actions**による自動デプロイ
2. **プルリクエスト**時のプレビュー環境自動作成
3. **main**ブランチへのマージで本番デプロイ
4. **ESLint**・**TypeScript**型チェックの自動実行
5. **Lighthouse**によるパフォーマンス計測

---

## 🎨 コードの特徴・設計思想

### 1. コンポーネント設計

**原則**:
- **Atomic Design**を意識したコンポーネント分割
- **Presentational / Container**パターン
- **Single Responsibility Principle**（単一責任原則）

**構造**:
```
ui/              → Atoms (Button, Input等)
common/          → Molecules (ImageUploadField等)
property/        → Organisms (BuildingSelector等)
pages/           → Templates/Pages
```

### 2. 状態管理

**Zustand**を使用:
```typescript
// store/auth.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => { /* ... */ },
  logout: () => { /* ... */ }
}));
```

**TanStack Query**を使用:
- サーバー状態管理
- 自動キャッシュ・リフェッチ
- 楽観的更新（Optimistic Updates）

### 3. 型定義（TypeScript）

**ファイル**: [types/property.ts](src/types/property.ts)

**特徴**:
- データベーススキーマと一致した型定義
- `Input`型（フォーム入力用）と`Response`型（API取得用）を分離
- `Omit<>`による型の再利用

```typescript
export interface RentalUnit {
  unit_id: number;
  building_id: number;
  // ...
}

export type RentalUnitInput = Omit<RentalUnit, 'unit_id' | 'created_at' | 'updated_at'>;
```

### 4. カスタムフック

**例**: [pages/RentalList.tsx](src/pages/RentalList.tsx)

```typescript
const { data: rentalUnits = [], isLoading } = useQuery({
  queryKey: ['rental-units'],
  queryFn: rentalApi.getAll
});

const deleteMutation = useMutation({
  mutationFn: rentalApi.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rental-units'] });
    toast.success('削除しました');
  }
});
```

### 5. フォーム管理

**React Hook Form + Zod**:
```typescript
const form = useForm<RentalUnitInput>({
  resolver: zodResolver(rentalSchema),
  defaultValues: { /* ... */ }
});

const onSubmit = form.handleSubmit(async (data) => {
  await createMutation.mutateAsync(data);
});
```

### 6. 再利用可能なユーティリティ

**ファイル**: [lib/utils.ts](src/lib/utils.ts)

```typescript
// Tailwind CSSクラス名の結合
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 📝 TODO/課題

### 高優先度
- [ ] **認証機能の実装** (Azure AD B2C連携)
- [ ] **画像アップロード機能の完成** (Azure Blob Storage連携)
- [ ] **API CRUD操作の完全実装** (現在はGETのみ)
- [ ] **エラーハンドリングの強化** (トースト通知、リトライ処理)
- [ ] **環境変数の適切な管理** (.envファイル作成)

### 中優先度
- [ ] **建物マスタ・駐車場マスタAPIの実装**
- [ ] **検索・フィルタリング機能** (物件一覧の絞り込み)
- [ ] **ソート機能** (価格順、面積順等)
- [ ] **ページネーション** (大量データ対応)
- [ ] **レスポンシブデザインの改善** (モバイル最適化)
- [ ] **ローディング状態の統一** (Skeleton UI)
- [ ] **テストコードの追加** (Vitest + Testing Library)

### 低優先度
- [ ] **ダークモード対応** (next-themes活用)
- [ ] **PWA対応** (オフライン動作)
- [ ] **画像の遅延読み込み** (Lazy Loading)
- [ ] **アクセシビリティ向上** (ARIA属性、キーボード操作)
- [ ] **国際化対応** (i18n)
- [ ] **アナリティクス連携** (Google Analytics等)

### 既知の課題
- ⚠️ `uploadApi.uploadImage()`が現在ダミー実装（placeholderを返す）
- ⚠️ ログイン機能がモック実装（誰でもログイン可能）
- ⚠️ APIエラー時のユーザーへの通知が不十分
- ⚠️ 画像削除時のBlob Storageからの削除処理未実装
- ⚠️ フォームバリデーションエラーメッセージが日本語化不完全

---

## 🚀 開発ガイド

### コーディング規約

```typescript
// ✅ Good: 明確な型定義
interface Props {
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
}

// ✅ Good: アロー関数コンポーネント
export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // ...
};

// ✅ Good: useQueryのキー管理
const QUERY_KEYS = {
  rentalUnits: ['rental-units'],
  weeklyUnits: ['weekly-units']
};

// ❌ Bad: any型の使用
const data: any = await fetchData();
```

### ブランチ戦略

```bash
main          # 本番環境
├── develop   # 開発環境
    ├── feature/xxx  # 機能開発
    ├── fix/yyy      # バグ修正
    └── refactor/zzz # リファクタリング
```

### コミットメッセージ

```
feat: 賃貸物件の検索機能を追加
fix: ログイン時のエラーハンドリングを修正
refactor: APIクライアントを整理
docs: READMEを更新
style: Tailwindクラスを整理
test: RentalFormのテストを追加
chore: 依存関係を更新
```

### デバッグ方法

```bash
# React Query Devtoolsを有効化（開発環境）
npm run dev
# ブラウザで http://localhost:5173 を開く
# 画面右下にReact Query Devtoolsが表示される

# TypeScriptエラーチェック
npm run build

# ESLint実行
npm run lint
```

---

## 🔗 関連リンク

- **バックエンドリポジトリ**: `shigezane-admin-functions`
- **API仕様書**: 未作成（作成推奨）
- **デザインシステム**: [Radix UI](https://www.radix-ui.com/)
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **React Query ドキュメント**: [TanStack Query](https://tanstack.com/query/latest)

---

## 📞 連絡先・引き継ぎ情報

### 開発環境セットアップで困ったら
1. Node.js 20.x以上がインストールされているか確認
2. `npm install`でエラーが出る場合は`npm cache clean --force`を試す
3. Viteの起動エラーは`node_modules`と`dist`を削除して再インストール

### よくある質問
**Q: ログインできません**  
A: 現在はモック実装です。任意のメールアドレスを入力すればログインできます。

**Q: 画像がアップロードできません**  
A: Azure Blob Storage連携が未実装のため、現在はダミーURLが生成されます。

**Q: 物件の編集・削除ができません**  
A: バックエンドAPIが未実装です。まず`shigezane-admin-functions`の該当エンドポイントを実装してください。

---

## 📊 補足

### パフォーマンス最適化

- **コード分割**: React Routerの`lazy()`を活用（未実装）
- **画像最適化**: `browser-image-compression`で1920px/1MBに圧縮
- **キャッシュ戦略**: React Queryの`staleTime`/`cacheTime`設定

### アクセシビリティ

- Radix UIは標準でWAI-ARIA対応
- キーボードナビゲーション対応
- スクリーンリーダー対応（改善の余地あり）

### ブラウザ対応

- Chrome 最新版
- Firefox 最新版
- Safari 最新版
- Edge 最新版
- ⚠️ IE11非対応

---

**最終更新**: 2026年2月6日  
**ドキュメントバージョン**: 1.0.0  
**作成者**: GitHub Copilot
