/**
 * 頁面切換方式，二選一：
 * - 'route'：用網址切換（react-router，BrowserRouter）。頁面在 src/pages/index.tsx 的 RoutePages 註冊。
 * - 'static'：不走網址，依 context.page 切換（setContext({ type: ActionType.Page, state: PAGE.xxx })）。
 *   頁面資料夾名稱必須等於 PAGE 的值。
 */
export type TPageMode = 'route' | 'static';
export const PAGE_MODE: TPageMode = 'static';

export const PAGE = {
  home: 'home',
};

export const REST_PATH = {
  test: 'todos?_limit=10',
};
