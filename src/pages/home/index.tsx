import Button from '@/components/button';
import useTodos from '@/hooks/useTodos';
import { IReactProps, TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import { memo, useState } from 'react';
import { HomeContext, HomeState, THomeState } from './config';
import './index.less';

const Home = memo(({ children }: IReactProps) => {
  const [state, setState] = useState<THomeState>(HomeState);
  const [todos, getTodos] = useTodos();
  const [transition, setTransition] = useState(TransitionType.Unset);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.FadeIn)}>
      <div className='Home'>
        <HomeContext.Provider value={[state, setState]}>
          <h1 className='text-2xl'>{children}</h1>
          <Button transition={transition} onClick={getTodos}>
            <Button.regular>Fetch</Button.regular>
          </Button>
          <p className='text-center'>{JSON.stringify(todos)}</p>
        </HomeContext.Provider>
      </div>
    </OnloadProvider>
  );
});

export default Home;
