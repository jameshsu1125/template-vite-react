import { IReactProps } from '@/settings/type';
import { memo } from 'react';
import './primary.less';

const Primary = memo(({ children }: IReactProps) => <div className='Primary'>{children}</div>);
export default Primary;
