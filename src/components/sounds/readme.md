# Sounds

以 [Howler.js](https://howlerjs.com/) 包裝的音效管理元件。使用者第一次點擊畫面時建立並讀取全部音檔，之後從 Context 取用。

- [Sounds](#sounds)
  - [檔案結構](#檔案結構)
  - [運作流程](#運作流程)
  - [使用方式](#使用方式)
  - [新增音效](#新增音效)
  - [API](#api)
  - [防呆機制](#防呆機制)
  - [除錯](#除錯)
  - [移植到其他專案](#移植到其他專案)

## 檔案結構

```text
src/components/sounds/
├── config.ts   # SoundList：所有音效的檔案與是否循環，新增音效只改這裡
├── type.ts     # SoundName：由 SoundList 自動推導，不需手動維護
├── index.ts    # Sounds class
├── mp3/        # 音檔
└── readme.md
src/hooks/useSoundsOnFirstTouch.ts   # 第一次點擊時建立 Sounds 並寫入 Context
```

## 運作流程

1. `src/pages/index.tsx` 呼叫 `useSoundsOnFirstTouch(setState)`，在 document 上監聽 `pointerdown` / `keydown`。
2. 使用者第一次點擊：建立 `Sounds`，開始讀取 `SoundList` 內全部音檔，並把實例寫進 `context.sounds.instance`。
   瀏覽器規定要有使用者手勢才能播放聲音，所以不在頁面載入時建立。
3. 全部讀取完成後 `context.sounds.loaded` 變成 `true`。
4. 讀取完成前就呼叫 `play()` 的音效會先排隊，**載入完成後自動播放**，所以第一次點擊的按鈕音效不會漏掉。

## 使用方式

```tsx
import { Context } from '@/settings/constant';
import { useContext } from 'react';

const Page = () => {
  const [{ sounds }] = useContext(Context);

  return <button onClick={() => sounds?.instance?.play('click')}>Click</button>;
};
```

背景音樂（`loop: true`）：

```tsx
sounds?.instance?.play('bgm', 0.5); // 音量 0.5 循環播放
sounds?.instance?.fadeOut('bgm', 1000); // 1 秒淡出後停止
```

若要等音檔全部讀完才做事（例如讀完才進首頁）：

```tsx
const [{ sounds }] = useContext(Context);

useEffect(() => {
  if (sounds?.loaded) sounds.instance?.play('bgm');
}, [sounds?.loaded]);
```

## 新增音效

1. 把 mp3 放進 `src/components/sounds/mp3/`，例如 `mp3-coin.mp3`。
2. 在 `config.ts` import 並加一筆：

   ```ts
   import coin from './mp3/mp3-coin.mp3';

   export const SoundList = {
     // ...
     coin: { src: coin, loop: false },
   } satisfies Record<string, { src: string; loop: boolean }>;
   ```

3. 完成。`SoundName` 會自動多出 `'coin'`，`play('coin')` 有型別提示，打錯名稱編譯就會失敗。

音檔路徑由 Vite 處理：`VITE_IMAGE_SOURCE=local` 時是打包後的本機路徑，`cdn` 時自動換成 CDN 網址，不需另外設定。

## API

`context.sounds`

| 屬性                     | 說明                                       | 預設  |
| :----------------------- | :----------------------------------------- | ----: |
| **instance**:_Sounds_    | 第一次點擊後建立的實例，之前是 `null`      |  null |
| **loaded**:_boolean_     | 全部音檔讀取完成                           | false |

`Sounds` 方法

| 方法                                                              | 說明                                                                                 | 回傳    |
| :---------------------------------------------------------------- | :----------------------------------------------------------------------------------- | ------: |
| .**play**(name:_SoundName_, volume = 1, canPlayTwice = true)      | 播放。尚未載入時先排隊，載入完成後自動播放。`canPlayTwice=false` 時正在播就不重播    | void    |
| .**stop**(name:_SoundName_)                                       | 停止單一音效（也會取消排隊中的播放）                                                 | void    |
| .**stopAll**()                                                    | 停止全部音效並清空排隊                                                               | void    |
| .**fadeOut**(name:_SoundName_, duration = 1000)                   | 淡出後停止，並恢復原音量供下次播放                                                   | void    |
| .**mute**() / .**unmute**()                                       | 全部靜音／取消靜音（之後才載入的音軌也會套用）                                       | void    |
| .**checkIsMuted**()                                               | 目前是否靜音                                                                         | boolean |
| .**isLoaded**()                                                   | 全部音檔是否讀取完成                                                                 | boolean |
| .**resume**()                                                     | 手動喚醒 AudioContext 並接回循環音軌（一般不需要呼叫，切回前景時會自動執行）         | void    |
| .**checkAudioStatus**()                                           | 音訊狀態快照，除錯用                                                                 | object  |
| .**destroy**()                                                    | 卸載全部音軌並移除監聽（hook unmount 時自動呼叫）                                    | void    |

## 防呆機制

這些都在 `index.ts` 內處理，使用時不用管：

| 情況                                                                  | 處理方式                                                                                              |
| :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| 第一次點擊時音檔還在讀取                                              | `play()` 先排隊，載入完成後自動播放；`useSoundsOnFirstTouch` 用 `flushSync` 確保同一次點擊就拿得到實例 |
| 瀏覽器尚未解鎖音訊                                                    | 等 Howler `unlock` 事件後再播                                                                         |
| `play()` 丟出例外                                                     | 重建該音軌，載入完成後再播一次                                                                        |
| App 切到背景再回來，背景音樂沒聲音                                    | 監聽 `visibilitychange` / `pageshow` / `focus`，回前景時喚醒 `Howler.ctx` 並從原位置接續播放           |
| iOS 中斷後 `playing()` 仍是 `true` 但沒聲音（網址列有音訊 icon）      | 比對切到背景前後的播放位置，沒有前進就判定音軌已失效並重播                                            |
| `ctx.resume()` 失敗（iOS `InvalidStateError`）或沒有回應              | 等使用者下一次點擊時整組重建 AudioContext 與音軌，再接回背景音樂                                      |

| 切回 App 後按鈕音效（單次音效）全部沒聲音                            | 不論有沒有循環音軌，回前景與每次 `play()` 前都會喚醒 AudioContext；成功後補發 Howler 的 `resume` 事件，釋放卡住的音軌 |

> 為什麼單次音效也要處理：AudioContext 不在 running 時，Howler 的 `play()` 會把音軌鎖住（`_playLock`）並等 `resume` 事件，
> 但它內部的 `ctx.resume()` 在 iOS 上常失敗且沒人處理，事件永遠不會來，該音軌之後所有 `play()` 都只會排進佇列而不出聲。
>
> 切回來時「接續播放」只作用於 `loop: true` 的音軌；單次音效不會自動重播，只是恢復成可以正常播放。

## 除錯

`play()` 等方法的錯誤會透過 `onError` 印成 `console.warn('[Sounds] ...')`，例如：

```text
[Sounds] 音效 click 尚未載入，載入完成後播放
```

在 console 檢查音訊狀態：

```ts
sounds.instance.checkAudioStatus();
// { available, context: 'running' | 'suspended' | 'interrupted', loaded, currentLoop, playing, seek, seekAtHide }
```

## 移植到其他專案

1. `npm i howler` 與 `npm i -D @types/howler`
2. 複製 `src/components/sounds/` 與 `src/hooks/useSoundsOnFirstTouch.ts`
3. `src/settings/type.ts`：`ActionType` 加 `Sounds = 'sounds'`，新增 `TSoundsState`，並加進 `IState` 與 `IAction['state']`
4. `src/settings/constant.ts`：`InitialState` 加 `[ActionType.Sounds]: { instance: null, loaded: false }`
5. App 元件內 `useReducer` 之後呼叫 `useSoundsOnFirstTouch(setState)`
