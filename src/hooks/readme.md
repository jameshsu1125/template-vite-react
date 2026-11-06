# Hooks

自訂 Hook。規格細節見專案根目錄 [AGENT.md](../../AGENT.md) 第 9 章。

## Table of hooks

- [Hooks](#hooks)
  - [Table of hooks](#table-of-hooks)
  - [useMedia](#usemedia)
  - [useSoundsOnFirstTouch](#usesoundsonfirsttouch)
  - [useTodos](#usetodos)
  - [新增 Hook](#新增-hook)

## useMedia

依視窗寬度回傳目前的 `MediaType`，並監聽 `resize`。

```tsx
import useMedia, { MediaType } from '@/hooks/useMedia';

const [media] = useMedia();
const isMobile = media <= MediaType.XS;
```

| MediaType | 值  | `window.innerWidth` |
| :-------- | :-: | ------------------: |
| Unset     |  0  |                初始 |
| XXS       |  1  |            ≤ 430 px |
| XS        |  2  |            ≤ 768 px |
| SM        |  3  |           ≤ 1024 px |
| MD        |  4  |           ≤ 1280 px |
| LG        |  5  |           > 1280 px |

> `src/settings/config.less` 的 `@XS/@SM/@MD/@LG`（430/768/1024/1280）是同一組斷點，但名稱比這裡少一級（Less 的 `@XS` 對應這裡的 `XXS`）。修改斷點時兩邊一起改。

## useSoundsOnFirstTouch

使用者第一次點擊畫面（`pointerdown` / `keydown`）時建立 `Sounds`、讀取全部音檔，並寫入 `context.sounds`（`track`、`loaded`）。已在 `src/pages/index.tsx` 呼叫，一般不需再使用。

```tsx
const [state, setState] = useReducer(Reducer, InitialState);
useSoundsOnFirstTouch(setState);
```

詳見 [components/sounds/readme.md](../components/sounds/readme.md)。

## useTodos

範例用的 API Hook：開啟讀取畫面 → `Fetcher.get(REST_PATH.test)` → 寫入結果 → 關閉讀取畫面。

```tsx
import useTodos from '@/hooks/useTodos';

const [todos, getTodos] = useTodos();

<button onClick={() => getTodos()}>fetch</button>;
// todos: { userId: number; id: number; title: string; completed: boolean }[] | undefined
```

| 回傳         | 型別                  | 說明                            |
| :----------- | :-------------------- | :------------------------------ |
| **todos**    | `TResult`             | 尚未取得資料時為 `undefined`    |
| **getTodos** | `() => Promise<void>` | 呼叫 API；需在 `Context` 內使用 |

> 請求失敗時讀取畫面也會關閉（`try/finally`），錯誤會往外拋，呼叫端自行處理。路徑與 mock 見 [mocks/readme.md](../mocks/readme.md)。

## 新增 Hook

1. 建立 `src/hooks/use<Name>.ts`，`export default`，回傳 tuple（`[state, fn] as const`）。
2. 在本檔加一節，並更新 [AGENT.md](../../AGENT.md) 第 9 章。

文件範本：

````md
## useName

一句話說明。

```tsx
const [value, action] = useName(arg);
```

| 回傳      | 型別 | 說明 |
| :-------- | :--- | :--- |
| **value** | xxx  | xxx  |
````
