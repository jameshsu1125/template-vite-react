import { IReactProps } from '@/settings/type';
import { memo } from 'react';

const Regular = memo(({ children }: IReactProps) => (
  <div className='w-full rounded-xl bg-secondary p-3 text-primary hover:bg-primary hover:text-secondary'>
    {children}
  </div>
));
export default Regular;
