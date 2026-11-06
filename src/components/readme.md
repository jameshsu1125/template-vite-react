# Components

可重用元件。完整規格（含行為細節）見專案根目錄 [AGENT.md](../../AGENT.md) 第 8 章。

## Table of components

- [Components](#components)
  - [Table of components](#table-of-components)
  - [Button](#button)
    - [Usage](#usage)
    - [Props](#props)
    - [Button.Primary](#buttonprimary)
  - [LoadingProcess](#loadingprocess)
    - [Usage](#usage-1)
    - [State](#state)
  - [Sounds](#sounds)
  - [新增元件](#新增元件)

## Button

按鈕外殼：合併 `className`、支援 `disabled` / `dataset`，點擊時先執行 `onClick`，再播放 `click` 音效（音效尚未建立時不會有動作）。

### Usage

```tsx
import Button from '@/components/button';

<Button onClick={() => console.log('click')} disabled={false}>
  <Button.Primary>Submit</Button.Primary>
</Button>;
```

### Props

| Properties                |                                 description                                 | default |
| :------------------------ | :-------------------------------------------------------------------------: | ------: |
| **children**:_ReactNode_  |                                  按鈕內容                                   |       - |
| **id**:_string_           |                             傳給 `<button id>`                              |       - |
| **className**:_string_    | 以 `twMerge` 合併到預設 `pointer-events-auto cursor-pointer bg-transparent` |       - |
| **style**:_CSSProperties_ |                            傳給 `<button style>`                            |       - |
| **disabled**:_boolean_    |                                  是否停用                                   |       - |
| **dataset**:_string_      |                          寫成 `data-dataset="..."`                          |       - |
| **onClick**:_() => void_  |                       點擊 callback（之後才播放音效）                       |       - |

> 沒有 `type` prop；在 `<form>` 內使用時，預設行為是瀏覽器的 submit。

### Button.Primary

預設外觀（圓角、主色底、hover 變淡、disabled 變灰、active 反色）。只接 `children`，**必須放在 `<Button>` 內**，狀態樣式才會作用（樣式依 `button:hover .Primary` 這類選擇器）。

```tsx
<Button disabled={isBusy}>
  <Button.Primary>
    fetch todos <TbCloudDownload />
  </Button.Primary>
</Button>
```

想要自訂外觀時，不使用 `Button.Primary`，直接在 `<Button className='...'>` 內放自己的內容。

## LoadingProcess

全螢幕讀取／處理中畫面。**不需要自己 import 渲染**：`App`（`src/pages/index.tsx`）在 `context.loadingProcess.enabled` 為 `true` 時自動掛載，元件本身沒有 props，全部由 Context 控制。

### Usage

```tsx
import { Context } from '@/settings/constant';
import { ActionType, LoadingProcessType } from '@/settings/type';
import { useContext } from 'react';

const Page = () => {
  const [, setContext] = useContext(Context);

  return (
    <button
      onClick={() => {
        setContext({
          type: ActionType.LoadingProcess,
          state: { enabled: true, type: LoadingProcessType.Bars },
        });
      }}
    >
      Submit
    </button>
  );
};
```

關閉：`setContext({ type: ActionType.LoadingProcess, state: { enabled: false } });`

### State

`context.loadingProcess`（欄位以淺層合併更新，沒列出的欄位保持原值）

| Properties                    |  description   |  default |
| :---------------------------- | :------------: | -------: |
| **enabled**:_boolean_         | 是否掛載到 DOM |    false |
| **type**:_LoadingProcessType_ |    圖示樣式    | 'spokes' |
| **body**:_ReactNode_          |  圖示下方文字  |       '' |

`LoadingProcessType`：`Ball`(`balls`)、`Bars`、`Bubbles`、`Cubes`、`Cylon`、`Spin`、`SpinningBubbles`(`spinningBubbles`)、`Spokes`。

新增圖示：把 svg 放進 `loadingProcess/svg/` → 在 `index.less` 加同名 class 的 `mask-image` → `LoadingProcessType` 加成員。

## Sounds

音效管理（Howler.js）：第一次點擊時讀取音檔、載入前的播放自動排隊、App 切回前景時接續背景音樂。

```tsx
const [{ sounds }] = useContext(Context);
sounds?.track?.play('click');
```

完整說明與新增音效方式見 [sounds/readme.md](./sounds/readme.md)。

## 新增元件

1. 建立 `src/components/<name>/index.tsx`（`export default`），需要樣式再加 `index.less`（開頭 `@import url('@/settings/global.css');` 才能使用 `@apply`）。
2. props 型別以 `IReactProps` 擴充：`type TProps = IReactProps & { ... }`。
3. 在本檔加一節（Usage + Props 表），並更新 [AGENT.md](../../AGENT.md) 第 8 章。

文件範本：

````md
## ComponentName

一句話說明。

### Usage

```tsx
import ComponentName from '@/components/componentName';

<ComponentName title='xxx' />;
```

### Props

| Properties         | description | default |
| :----------------- | :---------: | ------: |
| **title**:_string_ |     xxx     |      '' |
````
