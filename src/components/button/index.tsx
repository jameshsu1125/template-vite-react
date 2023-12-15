import { IReactProps, TransitionType } from '@/settings/type';
import useTween from 'lesca-use-tween';
import { useEffect } from 'react';
import Regular from './regular';
import { Debug } from '@/settings/type-unity';

type TRegularProps = Debug<{
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
