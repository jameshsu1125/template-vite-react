import LoadingProcess from '@/components/loadingProcess';
import { Context, InitialState, Reducer } from '@/settings/constant';
import '@/settings/global.less';
import { ActionType, TContext } from '@/settings/type';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import Click from 'lesca-click';
import Fetcher, { contentType, formatType } from 'lesca-fetcher';
import { memo, useMemo, useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './home';
import { RequiredAuth } from './home/sc';

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

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-30544958.okta.com/oauth2/default',
  clientId: '0oalkdinjqOPuXgwn5d7',
  redirectUri: window.location.origin + '/login/',
});

const RoutePages = memo(() => {
  const history = useNavigate();
  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: any) => {
    history(toRelativeUrl(originalUri || '/', window.location.origin));
  };
  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route path='/' element={<Home>Route Pages</Home>} />
        <Route path='/login' element={<RequiredAuth />} />
      </Routes>
    </Security>
  );
});

const App = () => {
  const [state, setState] = useReducer(Reducer, InitialState);
  const value: TContext = useMemo(() => [state, setState], [state]);
  return (
    <div className='App'>
      <Context.Provider {...{ value }}>
        <BrowserRouter basename=''>
          <RoutePages />
        </BrowserRouter>
        {state[ActionType.LoadingProcess]?.enabled && <LoadingProcess />}
      </Context.Provider>
    </div>
  );
};

if (document.getElementById('app')?.children.length === 0) {
  ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
}
