import { Context } from '@/settings/constant';
import { IReactProps } from '@/settings/type';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import Primary from './primary';

type TRegularProps = IReactProps & {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  dataset?: string;

  onClick?: () => void;
};

const Button = ({ id, children, className, style, onClick, dataset, disabled }: TRegularProps) => {
  const [{ sounds }] = useContext(Context);

  return (
    <button
      id={id}
      className={twMerge('pointer-events-auto cursor-pointer bg-transparent', className)}
      disabled={disabled}
      style={style}
      onClick={() => {
        onClick?.();
        sounds?.track?.play('click');
      }}
      data-dataset={dataset}
    >
      {children}
    </button>
  );
};

Button.Primary = Primary;

export default Button;
