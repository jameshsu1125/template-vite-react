# MOCKS - [Mock Service Worker](https://mswjs.io/)

Mock by intercepting requests on the network level. Seamlessly reuse the same mock definition for testing, development, and debugging.

透過攔截網路層級的請求來進行模擬。無縫重複使用相同的模擬定義進行測試、開發和調試。

## Table of components

- [MOCKS - Mock Service Worker](#mocks---mock-service-worker)
	- [Table of components](#table-of-components)
	- [browse](#browse)
		- [Usage](#usage)
	- [handler](#handler)
		- [Usage](#usage-1)
		- [Development](#development)
			- [initialize](#initialize)
			- [config](#config)
			- [Hooks](#hooks)

## browse

Set `.env` to determine whether to perform API require interception on the browser side.

設定`.env`來決定是否對browser端進行執行API require攔截。

### Usage

```js
if (import.meta.env.VITE_MOCKING === 'true') {
  import('@/mocks/browser').then((e) => {
    e.worker.start({ serviceWorker: { url: './mockServiceWorker.js' } });
  });
}
```

## handler

Decide what fake data the API will return when development.

決定API在開發階段時會回傳什麼假資料

### Usage

```js
import { REST_PATH } from '@/settings/config';
import { faker } from '@faker-js/faker';
import { mergePath } from 'lesca-fetcher';
import { rest } from 'msw';

export const handlers = [
	rest.get(mergePath(REST_PATH.test), (_, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				userId: faker.string.uuid(),
				id: faker.number.int(0, 10),
				title: faker.lorem.lines(1),
				completed: faker.datatype.boolean(),
			}),
		);
	}),
];
```

### Development


#### initialize

```js
import Fetcher, { contentType, formatType } from 'lesca-fetcher';

Fetcher.install({
	hostUrl: process.env.API_PATH,
	contentType: contentType.JSON,
	formatType: formatType.JSON,
});
```

#### config

```js
export const REST_PATH = {
	test: 'todos/1',
};
```

#### Hooks

```js
import Fetcher from 'lesca-fetcher';
import { useState } from 'react';
import { REST_PATH } from '@/settings/config';

const useTodos = () => {
  const [state, setState] = useState();
	const fetch = async () => {
    const respond = await Fetcher.get(REST_PATH.test);
    setState(respond);
  };
  return [state, fetch];
};
export default useTodos;
```


