import Button from '@/components/button';
import useTodos from '@/hooks/useTodos';
import { Context } from '@/settings/constant';
import { ActionType, IReactProps } from '@/settings/type';
import { Easing, TweenerDivProvider } from 'lesca-use-tween';
import { forwardRef, memo, useContext, useImperativeHandle, useRef, useState } from 'react';
import { MdOutlineSlowMotionVideo } from 'react-icons/md';
import { TbCloudDownload } from 'react-icons/tb';
import { HomeContext, HomeState, THomeState } from './config';
import './index.less';

const AnimatedDemo = forwardRef((_, ref) => {
  const [shouldFadeIn, setShouldFadeIn] = useState(false);
  const [shouldTextFadeIn, setShouldTextFadeIn] = useState(false);

  useImperativeHandle(ref, () => ({
    animate: () => {
      setShouldFadeIn(true);
    },
  }));

  return (
    <div className='bg-base-content flex h-80 w-full flex-col items-center justify-center gap-1 rounded-2xl'>
      <TweenerDivProvider
        initialStyle={{ opacity: 0, y: -100 }}
        tweenTo={{ opacity: 1, y: 0 }}
        shouldFadeIn={shouldFadeIn}
        options={{
          duration: 500,
          onEnd: () => setShouldTextFadeIn(true),
          easing: Easing.outElastic,
        }}
      >
        <div className='bg-primary text-primary-content px-2 py-1 text-3xl font-black'>
          <TweenerDivProvider
            initialStyle={{ width: '0%' }}
            tweenTo={{ width: '100%' }}
            className='overflow-x-clip whitespace-nowrap'
            shouldFadeIn={shouldTextFadeIn}
            options={{ duration: 800, easing: Easing.inOutQuart }}
          >
            Animated Content
          </TweenerDivProvider>
        </div>
        {[
          '・Lightweight design, easy to carry every day',
          '・Powerful performance for smooth, effortless tasks',
          '・Intuitive controls, easy to use from the start',
          '・Carefully selected materials for quality and durability',
        ].map((text, index) => (
          <div key={text} className='text-primary-content/80 px-0 py-1 text-xs font-normal'>
            <TweenerDivProvider
              initialStyle={{ width: '0%' }}
              tweenTo={{ width: '100%' }}
              className='overflow-x-clip whitespace-nowrap'
              shouldFadeIn={shouldTextFadeIn}
              options={{ duration: 800, easing: Easing.inOutQuart, delay: 800 + index * 200 }}
            >
              {text}
            </TweenerDivProvider>
          </div>
        ))}
      </TweenerDivProvider>
    </div>
  );
});

const Home = memo(({ children }: IReactProps) => {
  const ref = useRef<{ animate: () => void } | null>(null);
  const [, setContext] = useContext(Context);

  const [state, setState] = useState<THomeState>(HomeState);
  const [todos, getTodos] = useTodos();

  return (
    <div className='Home'>
      <HomeContext.Provider value={[state, setState]}>
        <div className='bg-base-300 rounded-2xl drop-shadow-2xl'>
          <div className='flex flex-col gap-5 p-5'>
            <h1 className='text-base-content font-black'>{children}</h1>
            <div className='flex w-full flex-row items-center justify-center'>
              <Button
                onClick={() => {
                  getTodos();
                }}
                disabled={(todos?.length ?? 0) > 0}
              >
                <Button.Primary>
                  FETCH TODOS <TbCloudDownload />
                </Button.Primary>
              </Button>
              <Button
                onClick={() => {
                  setContext({
                    type: ActionType.Modal,
                    state: {
                      enabled: true,
                    },
                  });
                }}
              >
                <Button.Primary>
                  OPEN MODAL <TbCloudDownload />
                </Button.Primary>
              </Button>
              <Button
                onClick={() => {
                  ref.current?.animate();
                }}
              >
                <Button.Primary>
                  ANIMATED DEMO <MdOutlineSlowMotionVideo />
                </Button.Primary>
              </Button>
            </div>
          </div>
        </div>
        {todos && (
          <div className='border-neutral bg-base-100 overflow-hidden rounded-2xl border shadow-lg shadow-black/30'>
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse text-left text-sm'>
                <thead className='bg-secondary text-secondary-content'>
                  <tr>
                    <th className='px-6 py-4 font-semibold'>ID</th>
                    <th className='px-6 py-4 font-semibold'>Title</th>
                    <th className='px-6 py-4 text-center font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-neutral divide-y'>
                  {todos.map((todo) => (
                    <tr key={todo.id} className='hover:bg-secondary/15 transition-colors'>
                      <td className='text-neutral-content px-6 py-4 font-medium'>#{todo.id}</td>
                      <td className='text-base-content px-6 py-4 font-medium'>{todo.title}</td>
                      <td className='px-6 py-4 text-center'>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            todo.completed
                              ? 'bg-success text-success-content'
                              : 'bg-warning text-warning-content'
                          }`}
                        >
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <AnimatedDemo ref={ref} />
      </HomeContext.Provider>
    </div>
  );
});

export default Home;
