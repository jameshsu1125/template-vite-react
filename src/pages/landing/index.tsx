import { IProps } from '@/settings/type';
import { memo, useEffect } from 'react';
import './index.less';

const Landing = memo(({ children }: IProps) => {
	useEffect(() => {}, []);
	return <div className='Landing'>{children}</div>;
});
export default Landing;
