import Fetcher from 'lesca-fetcher';
import { useContext, useState } from 'react';
import { RestPath } from '../settings/config';
import { Context } from '../settings/constant';
import { ActionType } from '@/settings/type';

export type TResult = {
  userID: string;
  id: number;
  title: string;
  completed: boolean;
};

const useTodos = () => {
  const [, setContext] = useContext(Context);
  const [state, setState] = useState<TResult>({ id: 0, userID: '', title: '', completed: false });
  const fetch = async () => {
    setContext({ type: ActionType.loadingProcess, state: { enabled: true } });
    const respond = (await Fetcher.get(RestPath.test)) as TResult;
    setState(respond);
    setContext({ type: ActionType.loadingProcess, state: { enabled: false } });
  };
  return [state, fetch] as const;
};
export default useTodos;
