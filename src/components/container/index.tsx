import Click from 'lesca-click';
import { forwardRef, useEffect, useId, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import use100vh from '@/hooks/use100vh';

let warned = false;

type TMaxWidthSize =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'none'
  | 'full'
  | 'screen'
  | 'min'
  | 'max'
  | 'fit'
  | 'prose'
  | number
  | `[${string}]`;

/** Tailwind 的 max-w-* utility，例：`max-w-3xl`、`max-w-none`、`max-w-[500px]` */
export type TMaxWidth = `max-w-${TMaxWidthSize}`;

type TProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  /** true：內容超出時可垂直捲動（同時關閉 lesca-click 的預設行為攔截）；false（預設）：不可捲動 */
  scroll?: boolean;
  /** 內容區最大寬度（Tailwind `max-w-*`），預設 `max-w-xl`；`max-w-none` 為不限寬 */
  maxWidth?: TMaxWidth;
};

/** 高度等於真實可視高度的 div，解決手機瀏覽器 100vh 被網址列蓋住的問題 */
const Container = forwardRef<HTMLDivElement, TProps>(
  ({ style, children, scroll = false, maxWidth, ...other }, ref) => {
    const id = useId();
    const height = use100vh();

    if (import.meta.env.DEV && !warned && style?.height) {
      warned = true;
      console.warn('<Container /> overrides the height property of the style prop');
    }

    useEffect(() => {
      Click.addPreventExcept(`#${id}`);
      return () => Click.removePreventExcept(`#${id}`);
    }, [scroll, id]);

    return (
      <div
        id={id}
        ref={ref}
        {...other}
        style={{
          ...style,
          height: `${height}px`,
          overflowX: 'hidden',
          overflowY: scroll ? 'auto' : 'hidden',
        }}
      >
        <div className='flex min-h-full w-full justify-center'>
          <div className={twMerge('relative w-full max-w-xl', maxWidth)}>{children}</div>
        </div>
      </div>
    );
  },
);

Container.displayName = 'Container';

export default Container;
