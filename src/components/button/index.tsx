import { IReactProps } from '@/settings/type';
import { Debug } from '@/settings/type-unity';
import Regular from './regular';

type TRegularProps = Debug<
  IReactProps & {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  }
>;

const Button = ({ children, className, style, onClick }: TRegularProps) => {
  return (
    <button className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
};

Button.regular = Regular;

export default Button;
