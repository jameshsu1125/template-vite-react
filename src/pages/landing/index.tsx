import useTodos from '@/hooks/useTodos';
import { IReactProps, TransitionType } from '@/settings/type';
import OnloadProvider from 'lesca-react-onload';
import useTween from 'lesca-use-tween';
import { memo, useEffect, useState } from 'react';
import { LandingContext, LandingState, TLandingState } from './config';
import './index.less';

interface ButtonProps extends IReactProps {
  transition: TransitionType;
  onClick: () => unknown;
}

const Button = ({ children, transition, onClick }: ButtonProps) => {
  const [style, setStyle] = useTween({ opacity: 0 });
  useEffect(() => {
    if (transition === TransitionType.fadeIn) {
      setStyle({ opacity: 1 });
    }
  }, [transition]);
  return (
    <button style={style} className='p-5 bg-red-500' onClick={onClick}>
      {children}
    </button>
  );
};

const Landing = memo(({ children }: IReactProps) => {
  const [state, setState] = useState<TLandingState>(LandingState);
  const [todos, getTodos] = useTodos();
  const [transition, setTransition] = useState(TransitionType.unset);

  return (
    <OnloadProvider onload={() => setTransition(TransitionType.fadeIn)}>
      <div className='Landing'>
        <LandingContext.Provider value={[state, setState]}>
          {children}
          {JSON.stringify(todos)}
          <Button transition={transition} onClick={getTodos}>
            Fetch
          </Button>
        </LandingContext.Provider>
      </div>
    </OnloadProvider>
  );
});

export default Landing;
