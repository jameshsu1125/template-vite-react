[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![NODE](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://zh-hant.reactjs.org/)
[![TS](https://img.shields.io/badge/Typescript-4277c0?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LESS](https://img.shields.io/badge/Less-1d365d?style=for-the-badge&logo=less&logoColor=white)](https://lesscss.org/)
[![TW](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=npm&logoColor=white)](https://lesscss.org/)
[![ROUTER](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=npm&logoColor=white)](https://lesscss.org/)

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

- create `.env` file

```sh
touch src/pages/.env
```

- copy variables to `.env` file.

```text
VITE_MOCKING=false
VITE_API_PATH='./api'

VITE_TITLE=title
VITE_SUBSCRIPTION=description
VITE_URL=https://jameshsu1125.github.io
VITE_FACEBOOK_ID=your-facebook-id
```

- start project

```sh
$ npm run dev
```

- build static file to `/dist`

```sh
$ npm run build
```

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
支援的檔案類型：圖片 svg、png、jpg、jpeg、gif、webp、avif、ico；字型 woff2、woff、ttf、otf。

- **設定**（`src/pages/.env.local`）

  ```sh
  VITE_IMAGE_SOURCE=local                  # local（本機）或 cdn（Bunny）
  VITE_CDN_URL=https://<zone>.b-cdn.net    # 拉取區域（Pull Zone）網址
  VITE_CDN_FOLDER=default                  # 存放資料夾，必填，不能是根目錄

  BUNNY_STORAGE_ZONE=                      # 儲存區域（Storage Zone）名稱
  BUNNY_STORAGE_PASSWORD=                  # 儲存區域密碼（FTP & API Access）
  BUNNY_SFTP_HOST=storage.bunnycdn.com     # 依儲存區域的主要區域，例如 sg.storage.bunnycdn.com
  ```

- **一鍵上傳**：只上傳新增或有變動的檔案，加 `-- --force` 全部重傳

  ```sh
  $ npm run cdn:upload
  ```

- **上線順序**：先上傳，再用 CDN 模式建置，最後部署

  ```sh
  $ npm run cdn:upload
  $ VITE_IMAGE_SOURCE=cdn npm run build
  $ npm run deploy
  ```

- **運作方式**：`cdn` 模式下，建置時 `scripts/postcss-cdn-url.js` 會把 CSS 內所有圖片與字型的 `url()` 改成 CDN 網址（附 `?v=<hash>` 避免舊快取），`index.html` 的 og:image、apple-touch-icon、favicon 也一併改用 CDN。Less 的 `image-width()`／`image-height()` 照樣讀本機檔案。
- **CDN 路徑**：`src/components/button/img/x.svg` → `<CDN>/<VITE_CDN_FOLDER>/components/button/img/x.svg`；`public/img/a.jpg` → `<CDN>/<VITE_CDN_FOLDER>/img/a.jpg`。
- **注意**：只有 CSS 的 `url()` 與 `index.html` 會轉換；在 TSX 裡 `import` 的圖片仍由 Vite 打包在本機。

## Status

- Development since January 2023
- use [vite](https://vitejs.dev/) for development environment and bundler.
- use [React](https://react.dev/) for main javascript library.
- use [Typescript](https://www.typescriptlang.org/) for syntax.
- use [LessCSS](https://lesscss.org/) and [TailwindCSS](https://tailwindcss.com/) for css library.
- use [ESLint](https://eslint.org/) rules for coding style.
- use [Mocks](https://mswjs.io/) and [faker](https://fakerjs.dev/) for testing API

## What's included

- `public` folder will copy to `/dist`
- `src` folder is reactJs entry point. default file is named as `pages/index.tsx`

## Bugs and feature requests

- [Node](https://nodejs.org/en/) version must be above v18
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
7. class name = `Snake Case`.
   > ex: _.button-group_、_.button-label_

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
