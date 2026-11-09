import { createContext } from 'react';
import { PAGE } from './config';
import {
  ActionType,
  IAction,
  IState,
  LoadingProcessType,
  TContext,
  TLoadingProcessState,
  TModalState,
  TSoundsState,
} from './type';

export const SoundsState: TSoundsState = { track: null, loaded: false };

export const ModalState: TModalState = {
  enabled: false,
  title: '刪除確認',
  body: '確定要刪除這筆資料嗎？刪除後將無法復原。',
  label: 'close',
};

export const LoadingProcessState: TLoadingProcessState = {
  enabled: false,
  type: LoadingProcessType.Spokes,
  body: '',
};

export const InitialState: IState = {
  [ActionType.Page]: PAGE.home,
  [ActionType.LoadingProcess]: LoadingProcessState,
  [ActionType.Sounds]: SoundsState,
  [ActionType.Modal]: ModalState,
};

export const Context = createContext<TContext>([InitialState, () => {}]);
export const Reducer = (state: IState, action: IAction): IState => {
  const { type, state: payload } = action;
  // 物件：淺層合併進 state[type]；其他（如頁面字串）：整個取代
  if (payload instanceof Object)
    return { ...state, [type]: { ...(state[type] as object), ...payload } };
  return { ...state, [type]: payload };
};
