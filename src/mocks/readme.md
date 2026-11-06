# MOCKS - [Mock Service Worker](https://mswjs.io/)

Mock by intercepting requests on the network level. Seamlessly reuse the same mock definition for testing, development, and debugging.

透過攔截網路層級的請求來進行模擬。無縫重複使用相同的模擬定義進行測試、開發和調試。

本專案使用 **msw v3**（`http` + `HttpResponse`），不是舊版的 `rest` / `res(ctx...)`。

## Table of contents

- [MOCKS - Mock Service Worker](#mocks---mock-service-worker)
  - [Table of contents](#table-of-contents)
  - [檔案](#檔案)
  - [browser](#browser)
  - [handler](#handler)
  - [Development](#development)
    - [Fetcher](#fetcher)
    - [REST_PATH](#rest_path)
    - [Hook](#hook)
  - [注意](#注意)

## 檔案

| 檔案                          | 說明                                                                                             |
| :---------------------------- | :----------------------------------------------------------------------------------------------- |
| `src/mocks/browser.ts`        | `setupWorker(...handlers)`，匯出 `worker`                                                        |
| `src/mocks/handlers.ts`       | 所有 handler                                                                                     |
| `public/mockServiceWorker.js` | msw 產生的 Service Worker，**不要手改**（`package.json` 的 `msw.workerDirectory` 指向 `public`） |

## browser

由 `.env` 的 `VITE_MOCKING` 決定是否在瀏覽器端攔截 API 請求（`src/pages/index.tsx`）：

```js
if (import.meta.env.VITE_MOCKING === 'true') {
  import('@/mocks/browser').then((e) => {
    e.worker.start({ serviceWorker: { url: './mockServiceWorker.js' } });
  });
}
```

啟用：`src/pages/.env` 設 `VITE_MOCKING=true`，重新啟動 `npm run dev`。

## handler

決定 API 在開發階段回傳什麼假資料（`src/mocks/handlers.ts`）：

```ts
import { REST_PATH } from '@/settings/config';
import { faker } from '@faker-js/faker';
import { mergePath } from 'lesca-fetcher';
import { HttpResponse, http } from 'msw';

export const handlers = [
  http.get(mergePath(REST_PATH.test), () => {
    return HttpResponse.json({
      userId: faker.string.uuid(),
      id: faker.number.int(10),
      title: faker.lorem.lines(1),
      completed: faker.datatype.boolean(),
    });
  }),
  http.get('/api', () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Out Of Service',
    });
  }),
];
```

## Development

新增一支 API 的流程：`REST_PATH` 加路徑 → 寫 Hook → `handlers.ts` 加 mock。

### Fetcher

在 `src/pages/index.tsx` 初始化一次（JSON in / JSON out），`hostUrl` 來自 `VITE_API_PATH`：

```ts
import Fetcher, { contentType, formatType } from 'lesca-fetcher';

Fetcher.install({
  hostUrl: import.meta.env.VITE_API_PATH || './api',
  contentType: contentType.JSON,
  formatType: formatType.JSON,
});
```

### REST_PATH

`src/settings/config.ts`：

```ts
export const REST_PATH = {
  test: 'todos?_limit=10',
};
```

### Hook

`src/hooks/useTodos.ts`（簡化）：

```ts
import Fetcher from 'lesca-fetcher';
import { useState } from 'react';
import { REST_PATH } from '@/settings/config';

const useTodos = () => {
  const [state, setState] = useState<TResult>();
  const fetch = async () => {
    const respond = (await Fetcher.get(REST_PATH.test)) as TResult;
    setState(respond);
  };
  return [state, fetch] as const;
};
export default useTodos;
```

完整版會在請求前後開關 `LoadingProcess`，見 [hooks/readme.md](../hooks/readme.md)。

## 注意

todos handler 回傳 10 筆陣列（欄位 `userId`、`id`、`title`、`completed`），與 `useTodos` 的 `TResult` 一致；修改任一邊時請兩邊一起改。
