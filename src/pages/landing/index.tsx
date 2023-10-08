import useTodos from '@/hooks/useTodos';
import { IProps } from '@/settings/type';
import { memo } from 'react';
import './index.less';

const Landing = memo(({ children }: IProps) => {
  const [todos, getTodos] = useTodos();
  return (
    <div className='Landing'>
      {children}
      {JSON.stringify(todos)}
      <button className='p-5 bg-red-500' onClick={getTodos}>
        Fetch
      </button>
    </div>
  );
});

export default Landing;
