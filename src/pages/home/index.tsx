import Button from '@/components/button';
import useTodos from '@/hooks/useTodos';
import { Context } from '@/settings/constant';
import { IReactProps } from '@/settings/type';
import { memo, useContext, useState } from 'react';
import { HomeContext, HomeState, THomeState } from './config';
import './index.less';

const Home = memo(({ children }: IReactProps) => {
  const [state, setState] = useState<THomeState>(HomeState);
  const [todos, getTodos] = useTodos();
  const [{ sounds }] = useContext(Context);

  return (
    <div className='Home'>
      <HomeContext.Provider value={[state, setState]}>
        <h1 className='text-2xl'>{children}</h1>
        <Button
          onClick={() => {
            getTodos();
            sounds?.track?.play('click');
          }}
        >
          <Button.Primary>Fetch</Button.Primary>
        </Button>
        <p className='text-center'>{JSON.stringify(todos)}</p>
      </HomeContext.Provider>
    </div>
  );
});

export default Home;
