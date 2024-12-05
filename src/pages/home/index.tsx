import { IReactProps } from '@/settings/type';
import { useAuth0 } from '@auth0/auth0-react';
import { memo, useState } from 'react';
import { HomeState, THomeState } from './config';
import './index.less';

const Home = memo(({ children }: IReactProps) => {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } = useAuth0();
  const [state, setState] = useState<THomeState>(HomeState);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        Hello {user?.name}{' '}
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log out
        </button>
      </div>
    );
  }
  return <button onClick={() => loginWithRedirect()}>Log in</button>;
});

export default Home;
