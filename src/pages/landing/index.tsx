import useTodos from '@/hooks/useTodos';
import { IReactProps } from '@/settings/type';
import { memo, useState } from 'react';
import { LandingContext, LandingState, TLandingState } from './config';
import './index.less';

const Landing = memo(({ children }: IReactProps) => {
  const [state, setState] = useState<TLandingState>(LandingState);
  const [todos, getTodos] = useTodos();

  return (
    <div className='Landing'>
      <LandingContext.Provider value={[state, setState]}>
        {children}
        {JSON.stringify(todos)}
        <button className='p-5 bg-red-500' onClick={getTodos}>
          Fetch
        </button>
      </LandingContext.Provider>
    </div>
  );
});

export default Landing;
