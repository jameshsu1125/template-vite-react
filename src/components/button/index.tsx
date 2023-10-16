import { IReactProps } from '@/settings/type';
import { memo, useEffect } from 'react';
import './index.less';
import Regular from './regular';

const Button = ({ children }: IReactProps) => {
  useEffect(() => {}, []);
  return <button>{children}</button>;
};

Button.regular = Regular;

export default memo(Button);
