import LoadingProcess from '@/components/loadingProcess';
import useSoundsOnFirstTouch from '@/hooks/useSoundsOnFirstTouch';
import { PAGE, PAGE_MODE } from '@/settings/config';
import { Context, InitialState, Reducer } from '@/settings/constant';
import '@/settings/global.css';
import { ActionType, IReactProps, TContext } from '@/settings/type';
import Click from 'lesca-click';
import Fetcher, { contentType, formatType } from 'lesca-fetcher';
import { ComponentType, Suspense, lazy, memo, useContext, useMemo, useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home';

Click.install();

Fetcher.install({
  hostUrl: import.meta.env.VITE_API_PATH || './api',
  contentType: contentType.JSON,
  formatType: formatType.JSON,
});

if (import.meta.env.VITE_MOCKING === 'true') {
  import('@/mocks/browser').then((e) => {
    e.worker.start({ serviceWorker: { url: './mockServiceWorker.js' } });
  });
}

// Static Pages：頁面元件在模組載入時就建好（不可在 render 內 lazy），依 PAGE 的值對應 ./<page>/index.tsx
const pageModules = import.meta.glob('./*/index.tsx');
const StaticPageList = Object.fromEntries(
  Object.values(PAGE).map((name) => [
    name,
    lazy(
      pageModules[`./${name}/index.tsx`] as () => Promise<{ default: ComponentType<IReactProps> }>,
    ),
  ]),
);

const StaticPages = memo(() => {
  const [context] = useContext(Context);
  const Page = StaticPageList[context[ActionType.Page] ?? ''];
  if (!Page) return null;
  return (
    <Suspense fallback=''>
      <Page>Static Pages</Page>
    </Suspense>
  );
});

// Route Pages：用網址切換，新增頁面時在這裡加 <Route>
const RoutePages = memo(() => (
  <Routes>
    <Route path='/' element={<Home>Route Pages</Home>} />
  </Routes>
));

const App = () => {
  const [state, setState] = useReducer(Reducer, InitialState);
  const value: TContext = useMemo(() => [state, setState], [state]);
  useSoundsOnFirstTouch(setState);
  return (
    <div className='App'>
      <Context.Provider {...{ value }}>
        {/* 2 選 1：由 src/settings/config.ts 的 PAGE_MODE 決定 */}
        {PAGE_MODE === 'route' ? (
          <BrowserRouter basename=''>
            <RoutePages />
          </BrowserRouter>
        ) : (
          <StaticPages />
        )}
        {state[ActionType.LoadingProcess]?.enabled && <LoadingProcess />}
      </Context.Provider>
    </div>
  );
};

if (document.getElementById('app')?.children.length === 0) {
  ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
}
