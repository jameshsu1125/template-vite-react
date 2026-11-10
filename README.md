[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![NODE](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![TS](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LESS](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![TW](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ROUTER](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

<p align="center">
  <a href="https://github.com/jameshsu1125">
    <img src="https://user-images.githubusercontent.com/70932507/188534539-a68734ac-9330-4fe0-bc49-5fa85116493e.png" alt="Logo" width=72 height=72>
  </a>
  <h3 align="center">Logo</h3>
  <p align="center">
    Short description   
  </p>
</p>

## Table of contents

- [Table of contents](#table-of-contents)
- [Quick start](#quick-start)
- [指令](#指令)
- [專案結構](#專案結構)
- [環境變數](#環境變數)
- [文件索引](#文件索引)
- [before deploy](#before-deploy)
- [圖片與字型 CDN（Bunny）](#圖片與字型-cdnbunny)
- [Status](#status)
- [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [naming conventions rules](#naming-conventions-rules)
- [Contributing](#contributing)
- [Creators](#creators)
- [Thanks](#thanks)
- [Copyright and license](#copyright-and-license)

## Quick start

- install module

```sh
$ npm i
```

- create `.env` file（範本是 `src/pages/.env.defaults`，Vite 不會自動讀它，要複製一份）

```sh
cp src/pages/.env.defaults src/pages/.env
```

- 依需求修改變數，完整說明見[環境變數](#環境變數)。

- start project

```sh
$ npm run dev
```

- build static file to `/dist`

```sh
$ npm run build
```

## 指令

| 指令                               | 說明                                                                  |
| :--------------------------------- | :-------------------------------------------------------------------- |
| `npm run dev`                      | 開發伺服器（HTTPS，port 5173；`/api` 代理到 `http://localhost:3000`） |
| `npm run build`                    | `tsc` 型別檢查後建置到 `/dist`                                        |
| `npm run preview`                  | 預覽 `/dist`                                                          |
| `npm run lint`                     | ESLint（flat config：`eslint.config.js`）                             |
| `npm run deploy`                   | 互動選單：`gh-pages`、`netlify-draft`、`netlify-prod`（先 build）     |
| `npm run cdn:upload` / `cdn:purge` | Bunny CDN 上傳／清快取，見下方 CDN 章節                               |
| `npm run rm`                       | 刪除 `node_modules/`、`dist/`、`package-lock.json`                    |

## 專案結構

```text
public/                 原樣複製到 /dist（img/ 放 og 圖、favicon；mockServiceWorker.js 為 msw 產生）
scripts/                部署與 CDN 腳本
src/
├── components/         可重用元件：button、loadingProcess、sounds
├── hooks/              useMedia、useSoundsOnFirstTouch、useTodos
├── mocks/              msw 設定與假資料
├── pages/              Vite root：index.html、index.tsx（進入點）、home/、.env.defaults
└── settings/           config.ts（PAGE、REST_PATH）、constant.ts、type.ts、global.css
fonts/                  字型子集用字元清單
tailwind.config.css     Tailwind v4 色票（@theme）
```

路徑 alias：`@/` → `src/`。

## 環境變數

env 目錄是 `src/pages`。只有 `VITE_` 開頭的變數會進前端；`BUNNY_*` 只給 `scripts/` 使用，且只能放在 `src/pages/.env.local`（已被 git 忽略）。

| 變數                                                                               | 說明                                                   |
| :--------------------------------------------------------------------------------- | :----------------------------------------------------- |
| `VITE_MOCKING`                                                                     | `true` 時啟用 msw 攔截 API                             |
| `VITE_API_PATH`                                                                    | API 網址（`Fetcher` 的 `hostUrl`，未設定時為 `./api`） |
| `VITE_TITLE`、`VITE_SUBSCRIPTION`、`VITE_URL`、`VITE_FACEBOOK_ID`                  | `index.html` 的 title 與 og meta                       |
| `VITE_GOOGLE_ANALYTICS_ID`、`VITE_FACEBOOK_ANALYTICS_ID`                           | 分析追蹤 ID（可留空）                                  |
| `VITE_IMAGE_SOURCE`、`VITE_CDN_URL`、`VITE_CDN_FOLDER`                             | 圖片／字型／音檔來源，見 CDN 章節                      |
| `BUNNY_STORAGE_ZONE`、`BUNNY_STORAGE_PASSWORD`、`BUNNY_SFTP_HOST`、`BUNNY_API_KEY` | Bunny 上傳與清快取                                     |

## 文件索引

- [AGENTS.md](./AGENTS.md)：給 AI 代理閱讀的完整規則與規格（也適合人類查閱）
- [src/components/readme.md](./src/components/readme.md)：元件用法（Button、LoadingProcess、Sounds）
- [src/components/sounds/readme.md](./src/components/sounds/readme.md)：音效管理
- [src/hooks/readme.md](./src/hooks/readme.md)：Hooks
- [src/mocks/readme.md](./src/mocks/readme.md)：Mock Service Worker
- [fonts/extract.md](./fonts/extract.md)：字型子集字元清單

## before deploy

- deploy on `netlify`
  - create `Netlify` site

    ```sh
    netlify sites:create
    ```

  - or link `Netlify` site id

    ```sh
    netlify link
    ```

## 圖片與字型 CDN（Bunny）

圖片放在各元件旁的 `img/`、`svg/` 資料夾與 `public/img/`，字型放在 `src/` 底下任何地方，Less／CSS 原始碼照常用相對路徑或 `@/` 引用，不用改。
支援的檔案類型：圖片 svg、png、jpg、jpeg、gif、webp、avif、ico；字型 woff2、woff、ttf、otf；音檔 mp3、wav、ogg、m4a、aac。

- **設定**（`src/pages/.env.local`）

  ```sh
  VITE_IMAGE_SOURCE=local                  # local（本機）或 cdn（Bunny）
  VITE_CDN_URL=https://<zone>.b-cdn.net    # 拉取區域（Pull Zone）網址
  VITE_CDN_FOLDER=default                  # 存放資料夾，必填，不能是根目錄

  BUNNY_STORAGE_ZONE=                      # 儲存區域（Storage Zone）名稱
  BUNNY_STORAGE_PASSWORD=                  # 儲存區域密碼（FTP & API Access）
  BUNNY_SFTP_HOST=storage.bunnycdn.com     # 依儲存區域的主要區域，例如 sg.storage.bunnycdn.com
  BUNNY_API_KEY=                           # 清除快取用：帳號的 API key（Account settings → API key）
  ```

- **一鍵上傳**：只上傳新增或有變動的檔案，加 `-- --force` 全部重傳。上傳後會自動清除這些檔案的 CDN 快取（需設定 `BUNNY_API_KEY`，沒設定時只上傳、不清快取）

  ```sh
  $ npm run cdn:upload
  ```

- **清除快取**：清除整個 `VITE_CDN_FOLDER` 資料夾，或在 `--` 後面加檔案路徑只清指定檔案

  ```sh
  $ npm run cdn:purge
  $ npm run cdn:purge -- components/button/img/x.svg
  ```

- **上線順序**：先上傳，再用 CDN 模式建置，最後部署

  ```sh
  $ npm run cdn:upload
  $ VITE_IMAGE_SOURCE=cdn npm run build
  $ npm run deploy
  ```

- **運作方式**：`cdn` 模式下，建置時 `scripts/postcss-cdn-url.js` 會把 CSS 內所有圖片與字型的 `url()` 改成 CDN 網址（附 `?v=<hash>` 避免舊快取），`index.html` 的 og:image、apple-touch-icon、favicon 也一併改用 CDN。Less 的 `image-width()`／`image-height()` 照樣讀本機檔案。
- **CDN 路徑**：`src/components/button/img/x.svg` → `<CDN>/<VITE_CDN_FOLDER>/components/button/img/x.svg`；`public/img/a.jpg` → `<CDN>/<VITE_CDN_FOLDER>/img/a.jpg`。
- **TS／TSX 匯入的檔案**（例如 `import bgm from './mp3/bgm.mp3'`）：`cdn` 模式由 `scripts/vite-cdn-assets.js` 換成 CDN 網址，`local` 模式照 Vite 原本打包。

## Status

- Development since January 2023
- use [vite](https://vitejs.dev/) for development environment and bundler.
- use [React](https://react.dev/) for main javascript library.
- use [Typescript](https://www.typescriptlang.org/) for syntax.
- use [LessCSS](https://lesscss.org/) and [TailwindCSS](https://tailwindcss.com/) for css library.
- use [ESLint](https://eslint.org/) rules for coding style.
- use [Mocks](https://mswjs.io/) and [faker](https://fakerjs.dev/) for testing API
- use [Howler.js](https://howlerjs.com/) for sounds, [lesca-fetcher](https://www.npmjs.com/package/lesca-fetcher) for API requests; [lesca-use-tween](https://www.npmjs.com/package/lesca-use-tween) for all JS animations (see AGENTS.md 11.1)

## What's included

- `public` folder will copy to `/dist`
- `src` folder is reactJs entry point. default file is named as `pages/index.tsx`
- 頁面切換二選一：`src/settings/config.ts` 的 `PAGE_MODE` 設為 `'static'`（依 Context 的 `page` 切換，預設）或 `'route'`（網址路由）
- Vite 的 `root` 是 `src/pages`，建置輸出到專案根目錄的 `/dist`

## Bugs and feature requests

- [Node](https://nodejs.org/en/) 版本需符合 Vite 8 的要求（20.19+ 或 22.12+）
- I will not maintain when this project is closed

## naming conventions rules

1. general variable - `Camel Case`
   > ex: _setState_、_currentTarget_、_pinkBackground_、_innerText_
2. react components and class name - `Pascal Case`.
   > ex: _RegularButton_、_NavigationBar_
3. global variable or state - `Pascal Case`.
   > ex: _Context_、_LandingState_
4. Immutable variable or environment variable - `Screaming Snake Case`.
   > ex: _PAGE_、<em>VITE_TITLE</em>
5. type - `I` = interface, `T` = type.
   > ex: _IProps_、_TResult_
6. enum options - `Pascal Case` + `"Type"`.
   > ex: _ActionType_、_AlertType_、_ModalType_
7. 元件根節點 class - `Pascal Case`，其餘樣式用 Tailwind utility。
   > ex: _.Home_、_.Primary_、_.LoadingProcess_

[naming-conventions](https://medium.com/@code.ceeker/naming-conventions-camel-case-pascal-case-kebab-case-and-more-dc4e515b9652)

## Contributing

Please read through our [contributing guidelines](https://github.com/github/docs/blob/main/contributing/README.md). Included are directions for opening issues, coding standards, and notes on development.

Moreover, all HTML and CSS should conform to the [Code Guide](https://github.com/airbnb/javascript), maintained by [Main author](https://github.com/jameshsu1125).

## Creators

**maintainer, developer**

- [James Hsu](https://github.com/jameshsu1125)

## Thanks

Thank customers and some manufacturers for their support.

## Copyright and license

Code and documentation copyright 2011-2022 the authors. Code released under the [MIT License](https://github.com/jameshsu1125/template-vite-react/blob/main/LICENSE).

<!-- open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security -->
