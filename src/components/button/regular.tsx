import { IReactProps } from '@/settings/type';
import { memo } from 'react';

const Regular = memo(({ children }: IReactProps) => (
  <div className='bg-secondary text-primary pointer-events-none w-full rounded-xl p-3'>
    {children}
  </div>
));
export default Regular;
