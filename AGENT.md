# AGENT.md

給 AI 代理（Claude Code、Codex、Cursor 等）閱讀的專案規則與規格。動手前先讀完「必守規則」，再依任務查閱對應章節。

- 回覆與註解使用繁體中文（台灣用語）；程式碼、指令、檔名維持原文。
- 本檔是規格的單一來源（single source of truth）。程式與本檔不一致時，先確認哪邊正確，再**同一次修改**兩邊都更新，並同步對應的 `readme.md`。

## 目錄

1. [專案概覽](#1-專案概覽)
2. [必守規則](#2-必守規則)
3. [指令](#3-指令)
4. [目錄結構](#4-目錄結構)
5. [環境變數](#5-環境變數)
6. [全域狀態（Context / Reducer）](#6-全域狀態context--reducer)
7. [頁面與路由](#7-頁面與路由)
8. [元件規格](#8-元件規格)
9. [Hooks 規格](#9-hooks-規格)
10. [API、Fetcher 與 Mock](#10-apifetcher-與-mock)
11. [樣式（Tailwind v4 + Less）](#11-樣式tailwind-v4--less)
12. [靜態資源與 Bunny CDN](#12-靜態資源與-bunny-cdn)
13. [部署](#13-部署)
14. [常見任務步驟](#14-常見任務步驟)
15. [已知問題](#15-已知問題)
16. [完成前檢查清單](#16-完成前檢查清單)

---

## 1. 專案概覽

Vite + React 19 + TypeScript 的前端專案模板（template-vite-react），用於活動頁、單頁網站。

| 領域    | 技術                                                                        |
| :------ | :-------------------------------------------------------------------------- |
| Bundler | Vite 8（`root` 是 `src/pages`，不是專案根目錄）                             |
| UI      | React 19、`react-router-dom` 7、`react-icons`                               |
| 語言    | TypeScript 5.9（`strict`、`noUnusedLocals`、`noUnusedParameters`）          |
| 樣式    | Tailwind CSS 4（`@tailwindcss/postcss`）+ Less，`tailwind-merge` 合併 class |
| 音效    | `howler`                                                                    |
| API     | `lesca-fetcher`；Mock 用 `msw` 3 + `@faker-js/faker`                        |
| 點擊    | `lesca-click`（`Click.install()` 於 `src/pages/index.tsx`）                 |
| 部署    | `gh-pages`、Netlify CLI、Bunny CDN（SFTP）                                  |

模組為 ESM（`package.json` 的 `"type": "module"`）。`scripts/` 內的 `.js` 是 Node ESM，用 `import`，不用 `require`。

## 2. 必守規則

### 2.1 命名

| 對象                          | 規則                                                                                     | 範例                                   |
| :---------------------------- | :--------------------------------------------------------------------------------------- | :------------------------------------- |
| 一般變數、函式、屬性          | camelCase                                                                                | `currentTarget`、`getTodos`            |
| React 元件、class             | PascalCase                                                                               | `LoadingProcess`、`Sounds`             |
| 全域變數、全域 state、Context | PascalCase                                                                               | `Context`、`InitialState`、`HomeState` |
| 常數、環境變數                | SCREAMING_SNAKE_CASE                                                                     | `PAGE`、`REST_PATH`、`VITE_TITLE`      |
| interface                     | `I` 開頭                                                                                 | `IState`、`IAction`、`IReactProps`     |
| type                          | `T` 開頭                                                                                 | `TContext`、`TSoundsState`             |
| enum                          | PascalCase，名稱以 `Type` 結尾                                                           | `ActionType`、`LoadingProcessType`     |
| CSS class（自訂）             | 元件根節點用 PascalCase（`.Home`、`.Primary`、`.LoadingProcess`）；其餘 Tailwind utility |                                        |
| 元件資料夾                    | camelCase 資料夾 + `index.tsx`                                                           | `components/loadingProcess/index.tsx`  |
| 非 `index` 的子檔案           | 小寫                                                                                     | `primary.tsx`、`primary.less`          |

> README 的命名規則列「class name = Snake Case（`.button-group`）」，但現有程式的自訂 class 都是 PascalCase 根節點。新增程式沿用程式現況（PascalCase 根節點 + Tailwind utility）。

### 2.2 TypeScript

- 一律以 alias `@/` 匯入 `src` 內的檔案（`@/settings/type`），跨資料夾不寫 `../../`。同資料夾內用 `./`。
- 元件 props 型別沿用 `IReactProps`（`{ readonly children?: ReactNode }`），擴充用 intersection：`type TProps = IReactProps & { ... }`。
- 新增 enum / type / interface 依 2.1 命名；共用型別放 `src/settings/type.ts`，只屬於單一頁面的放該頁的 `config.ts`。
- `any` 在 ESLint 為 `off`，但新程式碼優先寫明確型別。
- 提交前 `npm run build`（先跑 `tsc`）必須零錯誤；未使用的 import、變數、參數會直接報錯，要刪掉。

### 2.3 格式（Prettier）

- 單引號、`jsxSingleQuote: true`（JSX 屬性也用單引號：`className='Home'`）、`printWidth: 100`、2 空格、`trailingComma: all`。
- Tailwind class 排序由 `prettier-plugin-tailwindcss` 處理，不手動排。
- Markdown 用空格縮排，不用 tab。

### 2.4 React 慣例

- 元件用 `const X = memo(() => ...)` 或一般函式；頁面與全域元件以 `export default` 輸出。
- 需要全域狀態用 `useContext(Context)`；只屬於某個頁面的狀態用該頁的 `HomeContext` 這類**頁面專屬 Context**（見 7.3），不要塞進全域 `IState`。
- Hook 檔名 `useXxx.ts`，放 `src/hooks/`，回傳 tuple（`[state, fn] as const`），與 `useTodos`、`useMedia` 一致。
- 音效一律透過 `Context` 的 `sounds.track` 取用（見 8.3），不要在元件內自行 `new Howl`。

### 2.5 檔案與文件同步

- 新增或修改元件、hook、設定時，**同一次修改**更新對應文件（見 14.6 的對照表）。
- 不手動編輯 `public/mockServiceWorker.js`（由 `msw` 產生，`package.json` 的 `msw.workerDirectory` 指向 `public`）。
- 不提交 `.env`、`*.local`、`scripts/.cdn-manifest.json`（已在 `.gitignore`）。密碼與 API key 只能放 `src/pages/.env.local`。
- `package-lock.json` 在 `.gitignore`，不提交。
- `typescript` 在 `.ncurc.json` 的 `reject` 清單內，升級依賴時不升 TypeScript。

## 3. 指令

| 指令                 | 作用                                                                                                         |
| :------------------- | :----------------------------------------------------------------------------------------------------------- |
| `npm i`              | 安裝依賴                                                                                                     |
| `npm run dev`        | `vite --host`，port 5173，HTTPS（`vite-plugin-mkcert`），自動開瀏覽器，`/api` 代理到 `http://localhost:3000` |
| `npm run build`      | `tsc && vite build`，輸出到 `dist/`                                                                          |
| `npm run preview`    | 預覽 `dist/`                                                                                                 |
| `npm run lint`       | `eslint . --report-unused-disable-directives --max-warnings 0`（flat config：`eslint.config.js`）            |
| `npm run deploy`     | 互動式選單：`gh-pages` / `netlify-draft` / `netlify-prod`（需先 build）                                      |
| `npm run cdn:upload` | 上傳圖片、字型、音檔到 Bunny Storage；`-- --force` 全部重傳                                                  |
| `npm run cdn:purge`  | 清 Bunny 快取；`-- <path>...` 只清指定檔案                                                                   |
| `npm run rm`         | 刪 `node_modules/`、`dist/`、`package-lock.json`                                                             |

專案沒有測試框架。驗證靠 `npm run build` + `npm run lint` + 手動在瀏覽器確認。

## 4. 目錄結構

```text
.
├── AGENT.md                      # 本檔
├── README.md                     # 人類入口文件
├── fonts/
│   ├── extract.md / extract.tsx  # 字型子集（subset）用的字元清單，不參與建置
├── public/                       # 原樣複製到 dist/
│   ├── img/                      # meta-img.jpg(1280x720)、apple-touch-icon.jpg、favicon.ico
│   ├── mockServiceWorker.js      # msw 產生，勿手改
│   └── .htaccess
├── scripts/                      # Node ESM 腳本（部署、CDN）
│   ├── deploy.js                 # npm run deploy
│   ├── misc.js                   # openUrl、deployToNetlify
│   ├── cdn-upload.js / cdn-purge.js
│   ├── postcss-cdn-url.js        # PostCSS 外掛：CSS url() → CDN
│   ├── vite-cdn-assets.js        # Vite 外掛：TS import 的資源 → CDN
│   └── lib/{assets.js,bunny-purge.js}
├── src/
│   ├── components/               # 可重用元件（見 8）
│   │   ├── button/               # Button、Button.Primary
│   │   ├── loadingProcess/       # 全螢幕讀取畫面（含 svg/）
│   │   ├── sounds/               # Howler 封裝（含 mp3/、readme.md）
│   │   └── readme.md
│   ├── hooks/                    # useMedia、useSoundsOnFirstTouch、useTodos、readme.md
│   ├── mocks/                    # msw：browser.ts、handlers.ts、readme.md
│   ├── pages/                    # Vite root
│   │   ├── .env.defaults         # 環境變數範本（Vite 不會自動讀它）
│   │   ├── index.html            # 模板：<%= title %> 由 vite-plugin-html 注入
│   │   ├── index.tsx             # 進入點：App、Provider、路由
│   │   └── home/                 # 頁面：index.tsx、index.less、config.ts
│   ├── settings/
│   │   ├── config.ts             # PAGE、REST_PATH
│   │   ├── constant.ts           # InitialState、Context、Reducer
│   │   ├── type.ts               # ActionType、各 state 型別、IState、IAction、TContext、IReactProps
│   │   ├── type-unity.ts         # 工具型別（Equal、Merge、Union…）
│   │   ├── config.less           # 斷點變數 @XS/@SM/@MD/@LG
│   │   └── global.css            # 引入 tailwind、body、.App 樣式
│   └── vite-env.d.ts             # ImportMetaEnv 型別
├── eslint.config.js              # ESLint flat config
├── tailwind.config.css           # Tailwind v4 @theme 色票
├── tsconfig.json                 # alias @/* → src/*
└── vite.config.ts
```

## 5. 環境變數

Vite 的 env 目錄是 `src/pages`（`loadEnv(mode, './src/pages')`），不是專案根目錄。

- 範本：`src/pages/.env.defaults`（會提交，**Vite 不會載入它**）。開發前複製成 `src/pages/.env`（或 `.env.local`）再改值。
- 機密（`BUNNY_*`）只放 `src/pages/.env.local`（被 `*.local` 忽略）。
- 只有 `VITE_` 前綴的變數會進前端 bundle。`BUNNY_*` 只給 `scripts/` 讀，不得在 `src/` 內使用。
- 在程式中以 `import.meta.env.VITE_XXX` 讀取。新增 `VITE_` 變數時同步 `src/vite-env.d.ts` 的 `ImportMetaEnv`、`.env.defaults`、README。

| 變數                         | 用途                                                            | 預設／範例                              |
| :--------------------------- | :-------------------------------------------------------------- | :-------------------------------------- |
| `VITE_MOCKING`               | `'true'` 時啟動 msw browser worker                              | `false`                                 |
| `VITE_API_PATH`              | `Fetcher` 的 `hostUrl`；未設定時退回 `./api`                    | `https://jsonplaceholder.typicode.com/` |
| `VITE_TITLE`                 | `<title>`、og:title、og:site_name                               |                                         |
| `VITE_SUBSCRIPTION`          | og:description                                                  |                                         |
| `VITE_URL`                   | og:url；`gh-pages` 部署後開啟的網址                             |                                         |
| `VITE_FACEBOOK_ID`           | `fb:app_id`                                                     |                                         |
| `VITE_GOOGLE_ANALYTICS_ID`   | gtag ID（空值也會輸出 gtag 片段）                               | 空                                      |
| `VITE_FACEBOOK_ANALYTICS_ID` | 注入 html 的 `facebookAnalyticsID`（目前模板未使用）            | 空                                      |
| `VITE_IMAGE_SOURCE`          | `local` 或 `cdn`（見 12）                                       | `local`                                 |
| `VITE_CDN_URL`               | Bunny Pull Zone 網址；`cdn` 模式必填                            |                                         |
| `VITE_CDN_FOLDER`            | CDN 子資料夾；`cdn` 模式必填，不得為空或根目錄                  |                                         |
| `BUNNY_STORAGE_ZONE`         | Storage Zone 名稱                                               |                                         |
| `BUNNY_STORAGE_PASSWORD`     | Storage Zone 密碼                                               |                                         |
| `BUNNY_SFTP_HOST`            | 預設 `storage.bunnycdn.com`，依區域如 `sg.storage.bunnycdn.com` |                                         |
| `BUNNY_API_KEY`              | 清快取用的帳號 API key（非 Storage 密碼）                       |                                         |

## 6. 全域狀態（Context / Reducer）

檔案：`src/settings/type.ts`、`src/settings/constant.ts`。`App`（`src/pages/index.tsx`）以 `useReducer(Reducer, InitialState)` 建立，經 `Context.Provider` 提供 `[state, dispatch]`。

### 6.1 型別

```ts
enum ActionType {
  Page = 'page',
  LoadingProcess = 'loadingProcess',
  Sounds = 'sounds',
}

interface IState {
  page?: string; // 目前靜態頁面（PAGE 的值）
  loadingProcess?: TLoadingProcessState;
  sounds?: TSoundsState;
}
interface IAction {
  state: IState | TLoadingProcessState | TSoundsState;
  type: ActionType;
}
type TContext = [IState, Dispatch<IAction>];
```

| state 欄位       | 型別                                                                 | 初始值                                       |
| :--------------- | :------------------------------------------------------------------- | :------------------------------------------- |
| `page`           | `string`                                                             | `PAGE.home`（`'home'`）                      |
| `loadingProcess` | `{ enabled?: boolean; type?: LoadingProcessType; body?: ReactNode }` | `{ enabled: false, type: Spokes, body: '' }` |
| `sounds`         | `{ track?: Sounds \| null; loaded?: boolean }`                       | `{ track: null, loaded: false }`             |

### 6.2 使用

讀取：

```tsx
const [context, setContext] = useContext(Context);
const loading = context[ActionType.LoadingProcess]; // 或 context.loadingProcess
```

更新（**淺層合併**到 `state[action.type]`，沒列出的欄位保持原值）：

```tsx
setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
setContext({
  type: ActionType.LoadingProcess,
  state: { enabled: true, type: LoadingProcessType.Bars },
});
```

Reducer 行為（`constant.ts`）：`action.state` 是物件時，把它的欄位合併進 `state[action.type]`；`action.state` 不是物件（例如字串）時，整個取代 `state[action.type]`（切換頁面用 `{ type: ActionType.Page, state: PAGE.home }`，型別上需轉型）。

### 6.3 新增一個全域 state

1. `type.ts`：`ActionType` 加成員（值為小寫 camelCase 字串）；新增 `TXxxState`；`IState` 加欄位；`IAction['state']` 的 union 加上 `TXxxState`。
2. `constant.ts`：建立 `XxxState` 初始值，加進 `InitialState`（key 用 `[ActionType.Xxx]`）。
3. 使用端用 `Context` 讀寫。
4. 更新本章 6.1 表格與相關 readme。

## 7. 頁面與路由

### 7.1 進入點 `src/pages/index.tsx`

載入順序：`Click.install()` → `Fetcher.install({ hostUrl: VITE_API_PATH || './api', contentType: JSON, formatType: JSON })` → 若 `VITE_MOCKING === 'true'` 動態載入 `@/mocks/browser` 並 `worker.start({ serviceWorker: { url: './mockServiceWorker.js' } })` → 掛載 `<App />` 到 `#app`。

`App` 內有這幾塊：

| 區塊                                    | 說明                                                                                                                                     |
| :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `useSoundsOnFirstTouch(setState)`       | 第一次點擊時建立 `Sounds`（見 9.2）                                                                                                      |
| `PAGE_MODE`（`src/settings/config.ts`） | `'route'`（預設）渲染 `<BrowserRouter><RoutePages /></BrowserRouter>`；`'static'` 渲染 `<StaticPages />`。**二選一，改這個常數即可切換** |
| `<RoutePages />`                        | `Routes`，目前 `<Route path='/' element={<Home>Route Pages</Home>} />`；新增頁面在此加 `<Route>`                                         |
| `<StaticPages />`                       | 依 `context.page` 從 `PAGE` 對應的 `./<page>/index.tsx` 渲染（元件在模組層級用 `import.meta.glob` + `lazy` 建好，不可移進 render）       |
| `<LoadingProcess />`                    | `context.loadingProcess.enabled` 為 `true` 才掛載                                                                                        |

> 切換方式：改 `PAGE_MODE`。`'static'` 模式用 `setContext({ type: ActionType.Page, state: PAGE.<name> })` 換頁（型別上需轉型）。不用的那一組不必刪，兩者皆保留以便隨時切換；build 可能出現 `INEFFECTIVE_DYNAMIC_IMPORT` 警告（`Home` 同時被靜態與動態引入），可忽略。

### 7.2 新增頁面

1. 建立 `src/pages/<name>/index.tsx`（`export default`）、`index.less`、必要時 `config.ts`。頁面根節點 class 用 PascalCase（`.<Name>`）。
2. `src/settings/config.ts` 的 `PAGE` 加一筆：`{ home: 'home', <name>: '<name>' }`（**值必須等於資料夾名稱**，靜態頁依此動態 import）。
3. Route 模式：在 `RoutePages` 加 `<Route path='/<path>' element={<Name />} />`。靜態模式：`setContext({ type: ActionType.Page, state: PAGE.<name> })` 切換。
4. 樣式檔開頭 `@import url('@/settings/global.css');`（才能用 `@apply`，見 11）。

### 7.3 頁面專屬 Context（`src/pages/home/config.ts`）

每個頁面可自帶 state，樣板：

```ts
export enum HomeStepType {
  unset = 0,
  fadeIn = 1,
}
export type THomeState = { step: HomeStepType };
export type THomeContext = [THomeState, Dispatch<SetStateAction<THomeState>>];
export const HomeState = { step: HomeStepType.unset };
export const HomeContext = createContext<THomeContext>([HomeState, () => {}]);
```

頁面內 `const [state, setState] = useState<THomeState>(HomeState)`，再以 `<HomeContext.Provider value={[state, setState]}>` 包住子元件。

### 7.4 `Home`（`src/pages/home/index.tsx`）

`memo` 元件，props 為 `IReactProps`；`children` 顯示在 `<h1>`。內含「fetch todos」按鈕（`useTodos`，已取得資料後 `disabled`）與 todos 表格（ID / Title / Status）。是 `Button`、`Button.Primary`、`useTodos`、react-icons 的使用範例。

## 8. 元件規格

### 8.1 `Button`（`@/components/button`）

```tsx
import Button from '@/components/button';
```

Props（`TRegularProps = IReactProps & {...}`）：

| prop        | 型別            | 預設 | 說明                                                                                         |
| :---------- | :-------------- | :--- | :------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`     |      | 按鈕內容                                                                                     |
| `id`        | `string`        |      | 傳給 `<button id>`                                                                           |
| `className` | `string`        |      | 以 `twMerge` 合併到 `pointer-events-auto cursor-pointer bg-transparent` 之後（後者可被覆蓋） |
| `style`     | `CSSProperties` |      | 傳給 `<button style>`                                                                        |
| `disabled`  | `boolean`       |      | 傳給 `<button disabled>`                                                                     |
| `dataset`   | `string`        |      | 寫成 `data-dataset="..."`                                                                    |
| `onClick`   | `() => void`    |      | 先執行 `onClick`，再播放 `click` 音效（`sounds.track?.play('click')`）                       |

行為：點擊 → `onClick?.()` → `sounds?.track?.play('click')`（音效尚未建立時為 no-op）。沒有 `type` prop，預設為瀏覽器 `<button>` 預設（在 `<form>` 內會 submit）。

子元件 `Button.Primary`（`primary.tsx`，`memo`）：只接 `children`，渲染 `<div className='Primary'>`；樣式在 `primary.less`，以 CSS 選擇器 `button .Primary`、`button:hover .Primary`、`button:disabled .Primary`、`button:active .Primary` 控制狀態，所以**必須放在 `<Button>` 內**才會有 hover / disabled / active 樣式。

```tsx
<Button onClick={() => doSomething()} disabled={isBusy}>
  <Button.Primary>
    fetch todos <TbCloudDownload />
  </Button.Primary>
</Button>
```

要自訂外觀：不使用 `Button.Primary`，直接在 `<Button className='...'>` 內放自己的內容。

### 8.2 `LoadingProcess`（`@/components/loadingProcess`）

全螢幕（`absolute top-0 z-50 h-full w-full`）讀取遮罩，`memo`，**無 props**，資料全部來自 `context.loadingProcess`。由 `App` 在 `enabled === true` 時掛載，頁面中不要自行 import 渲染。

開啟 / 關閉：

```tsx
const [, setContext] = useContext(Context);
setContext({ type: ActionType.LoadingProcess, state: { enabled: true } });
setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });
```

`TLoadingProcessState`：

| 欄位      | 型別                 | 預設                   | 說明                                      |
| :-------- | :------------------- | :--------------------- | :---------------------------------------- |
| `enabled` | `boolean`            | `false`                | 是否掛載                                  |
| `type`    | `LoadingProcessType` | `Spokes`（`'spokes'`） | 圖示樣式；元件內 `type` 缺值時退回 `Spin` |
| `body`    | `ReactNode`          | `''`                   | 圖示下方文字（真值才渲染）                |

`LoadingProcessType`：`Ball='balls'`、`Bars='bars'`、`Bubbles='bubbles'`、`Cubes='cubes'`、`Cylon='cylon'`、`Spin='spin'`、`SpinningBubbles='spinningBubbles'`、`Spokes='spokes'`。每個值對應 `index.less` 中同名 class 與 `svg/loading-<name>.svg` 的 `mask-image`。新增圖示：加 svg → `index.less` 加 class → enum 加成員。

### 8.3 `Sounds`（`@/components/sounds`）

Howler.js 封裝。完整行為與防呆說明在 `src/components/sounds/readme.md`，下面是規格摘要。

取用（元件內）：

```tsx
const [{ sounds }] = useContext(Context);
sounds?.track?.play('click');
```

- `context.sounds.track`：`Sounds | null`，使用者**第一次點擊**（`pointerdown` / `keydown`）才建立；之前是 `null`，所以一律用 `?.`。
- `context.sounds.loaded`：全部音檔讀取完成後為 `true`。
- 載入前呼叫 `play()` 會排隊，載入完成後自動補播（同名只保留最後一次參數）。

音效清單 `config.ts`：

```ts
export const SoundList = {
  bgm: { src: bgm, loop: true },
  click: { src: click, loop: false },
  correct: { src: correct, loop: false },
  wrong: { src: wrong, loop: false },
} satisfies Record<string, { src: string; loop: boolean }>;
```

`SoundName = keyof typeof SoundList`（`type.ts`，自動推導，不要手寫）。

`Sounds` class 公開方法：

| 方法                                          | 說明                                                                                 |
| :-------------------------------------------- | :----------------------------------------------------------------------------------- |
| `constructor({ onLoad?, onError? })`          | 建立後立刻讀取全部音檔；`onLoad` 在全部讀完時呼叫                                    |
| `play(name, volume = 1, canPlayTwice = true)` | 播放；`canPlayTwice=false` 且正在播放時不重播；`loop: true` 的音軌會記為目前循環音軌 |
| `stop(name)` / `stopAll()`                    | 停止並取消排隊                                                                       |
| `fadeOut(name, duration = 1000)`              | 淡出後停止並還原音量                                                                 |
| `mute()` / `unmute()` / `checkIsMuted()`      | 全域靜音（之後才載入的音軌也套用）                                                   |
| `isLoaded()`                                  | 全部讀取完成                                                                         |
| `resume()`                                    | 喚醒 AudioContext 並接回循環音軌（切回前景自動呼叫，一般不需手動）                   |
| `checkAudioStatus()`                          | 除錯用狀態快照                                                                       |
| `destroy()`                                   | 卸載全部音軌、移除監聽（由 hook 在 unmount 時呼叫）                                  |

新增音效：mp3 放 `src/components/sounds/mp3/` → `config.ts` import 並加進 `SoundList` → 完成（型別自動帶出）。不要修改 `type.ts`。

## 9. Hooks 規格

### 9.1 `useMedia`（`@/hooks/useMedia`）

```ts
const [media] = useMedia(); // MediaType
```

監聽 `window.resize`，依 `innerWidth` 回傳 `MediaType`：

| `MediaType` | 值  | 條件（px） |
| :---------- | :-- | :--------- |
| `Unset`     | 0   | 初始       |
| `XXS`       | 1   | ≤ 430      |
| `XS`        | 2   | ≤ 768      |
| `SM`        | 3   | ≤ 1024     |
| `MD`        | 4   | ≤ 1280     |
| `LG`        | 5   | > 1280     |

> Less 斷點 `config.less` 的 `@XS/@SM/@MD/@LG`（430/768/1024/1280）與此對應，但名稱錯一格（Less 的 `@XS` = 430 = hook 的 `XXS`）。兩邊改斷點時要同步。

### 9.2 `useSoundsOnFirstTouch`（`@/hooks/useSoundsOnFirstTouch`）

```ts
useSoundsOnFirstTouch(dispatch: Dispatch<IAction>): void
```

只在 `src/pages/index.tsx` 的 `App` 呼叫一次，其他地方不需再用。在 document 的捕獲階段監聽 `pointerdown`、`keydown`；第一次觸發時移除監聽 → `new Sounds({ onLoad, onError })` → `onLoad` 時 `dispatch({ type: Sounds, state: { loaded: true } })`；以 `flushSync` 同步 `dispatch({ type: Sounds, state: { track: sounds } })`，讓同一次點擊的 handler 已能拿到 `track`。`onError` 以 `console.warn('[Sounds] ...')` 輸出。cleanup 時移除監聽並 `sounds.destroy()`。

### 9.3 `useTodos`（`@/hooks/useTodos`）

```ts
const [todos, getTodos] = useTodos(); // readonly [TResult, () => Promise<void>]
```

`getTodos()`：開啟 `LoadingProcess` → `Fetcher.get(REST_PATH.test)` → 寫入內部 state → 關閉 `LoadingProcess`。以 `try/finally` 保證請求失敗時也會關閉 `LoadingProcess`，但錯誤仍會往外拋，呼叫端自行處理。

`TResult = { userId: number; id: number; title: string; completed: boolean }[] | undefined`。

這是「呼叫 API 的 Hook」樣板：新增 API hook 時複製此結構（`Fetcher` + `REST_PATH` + 載入遮罩）。

## 10. API、Fetcher 與 Mock

### 10.1 路徑

`src/settings/config.ts`：

```ts
export const REST_PATH = { test: 'todos?_limit=10' };
```

新增 API 路徑加進 `REST_PATH`，不要在元件內寫死字串。`Fetcher` 的 `hostUrl` 來自 `VITE_API_PATH`，呼叫時只傳相對路徑。

### 10.2 呼叫

```ts
import Fetcher from 'lesca-fetcher';
const data = await Fetcher.get(REST_PATH.test);
```

`Fetcher.install` 只在 `src/pages/index.tsx` 執行一次（JSON in / JSON out）。

### 10.3 Mock（msw 3）

- `VITE_MOCKING=true` 時才啟動；worker 檔為 `public/mockServiceWorker.js`，由 `index.tsx` 以 `./mockServiceWorker.js` 載入。
- `src/mocks/browser.ts`：`setupWorker(...handlers)`。
- `src/mocks/handlers.ts` 使用 **msw v3 API**：`http.get(...)` + `HttpResponse.json(...)`（不是舊版的 `rest` / `res(ctx...)`）。

新增 mock：

```ts
import { REST_PATH } from '@/settings/config';
import { faker } from '@faker-js/faker';
import { mergePath } from 'lesca-fetcher';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get(mergePath(REST_PATH.test), () => HttpResponse.json({/* faker 假資料 */})),
];
```

> `todos` handler 回傳 10 筆陣列（欄位 `userId`、`id`、`title`、`completed`），與 `useTodos` 的 `TResult` 一致；修改任一邊時兩邊一起改。

## 11. 樣式（Tailwind v4 + Less）

- 色票定義在 `tailwind.config.css` 的 `@theme`：`primary`、`secondary`、`accent`、`neutral`、`info`、`success`、`warning`、`error`（各有 `-content`），以及 `base-100/200/300`、`base-content`。使用 `bg-primary`、`text-primary-content`、`bg-base-300`、`text-base-content` 等 utility；`/75` 之類透明度可用。**不要**寫死 hex，要新色就加進 `@theme`。
- `src/settings/global.css` 引入 `tailwind.config.css`，並定義 `body`（`bg-base-100 text-base-content`、字型 stack）與 `.App`。`src/pages/index.tsx` 已 import 它。
- 元件與頁面優先用 Tailwind utility 寫在 JSX；需要 `:hover`/`:disabled` 巢狀、`mask-image`、`image-width()` 等才寫 `.less`。
- 在 `.less` 內使用 `@apply` 時，檔案開頭要 `@import url('@/settings/global.css');`（`button/primary.less`、`home/index.less` 是範例）。
- 根節點 class 用元件 / 頁面名稱（PascalCase），子樣式巢狀在其下，避免全域污染。
- Less 設定：`math: 'always'`。斷點變數在 `src/settings/config.less`（`@XS: 430px; @SM: 768px; @MD: 1024px; @LG: 1280px`）。
- 合併動態 class 用 `twMerge`（`tailwind-merge`）。

## 12. 靜態資源與 Bunny CDN

- 圖片放元件旁的 `img/`、`svg/`；全站共用放 `public/img/`；字型放 `src/` 下任一處；音檔放元件旁（如 `sounds/mp3/`）。
- 原始碼一律用本機相對路徑或 `@/` 引用，**不手寫 CDN 網址**。切換由 `VITE_IMAGE_SOURCE` 決定：
  - `local`：Vite 原本的處理。
  - `cdn`：建置時 `postcss-cdn-url.js` 把 CSS `url()` 換成 `<VITE_CDN_URL>/<VITE_CDN_FOLDER>/<相對路徑>?v=<sha1 前 8 碼>`；`vite-cdn-assets.js` 處理 TS/TSX `import` 進來的資源；`index.html` 的 og:image、apple-touch-icon、favicon 透過 `imageBase` 改用 CDN。
- 支援副檔名：圖片 `svg png jpg jpeg gif webp avif ico`；字型 `woff2 woff ttf otf`；音檔 `mp3 wav ogg m4a aac`。
- CDN 路徑規則：`src/<path>` 與 `public/<path>` 去掉前綴後接在 `<CDN>/<folder>/` 後（`public/img/a.jpg` → `<CDN>/<folder>/img/a.jpg`）。
- `cdn` 模式需 `VITE_CDN_URL` 與 `VITE_CDN_FOLDER`，缺少時 `vite.config.ts` / 腳本會丟錯並結束。
- `cdn:upload` 比對 `scripts/.cdn-manifest.json` 的 hash，只傳有變動的檔案，之後自動清快取（需 `BUNNY_API_KEY`）。
- 上線順序：`npm run cdn:upload` → `VITE_IMAGE_SOURCE=cdn npm run build` → `npm run deploy`。

## 13. 部署

`npm run deploy`（`scripts/deploy.js`）以 `NODE_ENV=production` 讀 env，互動選擇：

| 選項            | 動作                                               |
| :-------------- | :------------------------------------------------- |
| `gh-pages`      | `npx gh-pages -d dist`，完成後開啟 `VITE_URL`      |
| `netlify-draft` | `netlify deploy --dir=dist`，解析 Draft URL 並開啟 |
| `netlify-prod`  | `netlify deploy --prod --dir=dist`                 |

先 `npm run build`。Netlify 需先 `netlify sites:create` 或 `netlify link`。`vite.config.ts` 的 `base: './'`，產物可放在子路徑。

## 14. 常見任務步驟

### 14.1 新增元件

1. 建 `src/components/<name>/index.tsx`（`export default`）；需要樣式再加 `index.less`。
2. props 用 `IReactProps` 擴充；樣式見 11。
3. 在 `src/components/readme.md` 加一節（Usage + Props 表）；本檔第 8 章加規格。

### 14.2 新增 Hook

建 `src/hooks/use<Name>.ts`，回傳 tuple；`src/hooks/readme.md` 與本檔第 9 章各加一節。

### 14.3 新增 API

1. `REST_PATH` 加路徑。
2. 新增 `use<Name>.ts`（仿 `useTodos`）。
3. `src/mocks/handlers.ts` 加對應 `http.*` handler（欄位與型別要和 hook 的 `TResult` 一致）。
4. 更新 `src/mocks/readme.md`。

### 14.4 新增音效

見 8.3「新增音效」。

### 14.5 新增環境變數

見第 5 章：`.env.defaults`、`vite-env.d.ts`、README、本檔表格四處同步。

### 14.6 文件對照表

| 修改了…                                | 同步更新…                                                              |
| :------------------------------------- | :--------------------------------------------------------------------- |
| `src/components/*`                     | `src/components/readme.md`、本檔第 8 章（音效另有 `sounds/readme.md`） |
| `src/hooks/*`                          | `src/hooks/readme.md`、本檔第 9 章                                     |
| `src/mocks/*`、`REST_PATH`             | `src/mocks/readme.md`、本檔第 10 章                                    |
| `src/settings/type.ts` / `constant.ts` | 本檔第 6 章                                                            |
| env、scripts、部署、CDN                | `README.md`、本檔第 5、12、13 章                                       |
| 目錄結構、新頁面                       | `README.md`、本檔第 4、7 章                                            |

## 15. 已知問題

下列是目前已知、尚未處理的問題。**修改相關檔案時順手修正並更新本節**；沒被要求時不要擅自大改。

1. `Reducer`（`constant.ts`）的過濾 / 合併寫法繞且使用 `any`；除非要重構，不要改動其對外行為（見 6.2）。
2. `eslint.config.js` 未引入 `@eslint/js` 的 `recommended`（專案未安裝該套件），只套用 typescript-eslint 與 react-hooks 規則。
3. `useTodos` 的 `Fetcher.get` 失敗時錯誤會往外拋，`Home` 沒有接住，會變成 unhandled rejection。

## 16. 完成前檢查清單

- [ ] `npm run build` 零錯誤（包含 `tsc`）。
- [ ] 沒有未使用的 import / 變數 / 參數。
- [ ] 命名符合 2.1；匯入使用 `@/`。
- [ ] 沒有寫死的色碼、CDN 網址、API 網址、密碼。
- [ ] 對應文件已依 14.6 同步更新（含本檔）。
- [ ] 沒有提交 `.env*.local`、`scripts/.cdn-manifest.json`、`dist/`。
