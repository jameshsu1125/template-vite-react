import { IReactProps, ReadyOnly, TransitionType } from '@/settings/type';
import useTween from 'lesca-use-tween';
import { useEffect } from 'react';
import Regular from './regular';

type TRegularProps = ReadyOnly<{
  onClick?: () => void;
  transition?: TransitionType;
}>;

const Button = ({ children, onClick, transition }: IReactProps & TRegularProps) => {
  const [style, setStyle] = useTween({ opacity: 0 });

  useEffect(() => {
    if (transition === TransitionType.FadeIn) setStyle({ opacity: 1 });
  }, [setStyle, transition]);

  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

Button.regular = Regular;

export default Button;
