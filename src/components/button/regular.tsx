import { IReactProps } from '@/settings/type';
import { memo, useEffect } from 'react';
import './index.less';

type TRegularProps = {
  onClick?: () => void;
};

const Regular = memo(({ children, onClick }: IReactProps & TRegularProps) => {
  useEffect(() => {}, []);
  return (
    <button className='button-regular' onClick={onClick}>
      {children}
    </button>
  );
});
export default Regular;
