import Button from '@/components/button';
import useTodos from '@/hooks/useTodos';
import { Context } from '@/settings/constant';
import { ActionType, IReactProps } from '@/settings/type';
import { memo, useContext, useState } from 'react';
import { TbCloudDownload } from 'react-icons/tb';
import { HomeContext, HomeState, THomeState } from './config';
import './index.less';

const Home = memo(({ children }: IReactProps) => {
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
                disabled={(todos?.length ?? 0) > 0}
              >
                <Button.Primary>
                  OPEN MODAL <TbCloudDownload />
                </Button.Primary>
              </Button>
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
          </div>
        </div>
      </HomeContext.Provider>
    </div>
  );
});

export default Home;
