import Button from '@/components/button';
import useTodos from '@/hooks/useTodos';
import { IReactProps } from '@/settings/type';
import { memo, useState } from 'react';
import { HomeContext, HomeState, THomeState } from './config';
import './index.less';

const Home = memo(({ children }: IReactProps) => {
  const [state, setState] = useState<THomeState>(HomeState);
  const [todos, getTodos] = useTodos();

  return (
    <div className='Home'>
      <HomeContext.Provider value={[state, setState]}>
        <div className='bg-base-300 rounded-2xl drop-shadow-2xl'>
          <div className='flex flex-col gap-5 p-5'>
            <h1 className='text-base-content font-black'>{children}</h1>
            <Button
              onClick={() => {
                getTodos();
              }}
            >
              <Button.Primary>fetch todos</Button.Primary>
            </Button>
            {todos && (
              <div className='overflow-hidden rounded-2xl border border-neutral bg-base-100 shadow-lg shadow-black/30'>
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse text-left text-sm'>
                    <thead className='bg-primary text-primary-content'>
                      <tr>
                        <th className='px-6 py-4 font-semibold'>ID</th>
                        <th className='px-6 py-4 font-semibold'>Title</th>
                        <th className='px-6 py-4 text-center font-semibold'>Status</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-neutral'>
                      {todos.map((todo) => (
                        <tr key={todo.id} className='transition-colors hover:bg-secondary/15'>
                          <td className='px-6 py-4 font-medium text-neutral-content'>#{todo.id}</td>
                          <td className='px-6 py-4 font-medium text-base-content'>{todo.title}</td>
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
