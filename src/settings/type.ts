import type Sounds from '@/components/sounds';
import { Dispatch, ReactNode } from 'react';
import { PAGE } from './config';

export enum ActionType {
  Page = 'page',
  LoadingProcess = 'loadingProcess',
  Sounds = 'sounds',
  Modal = 'modal',
}

export enum LoadingProcessType {
  Ball = 'balls',
  Bars = 'bars',
  Bubbles = 'bubbles',
  Cubes = 'cubes',
  Cylon = 'cylon',
  Spin = 'spin',
  SpinningBubbles = 'spinningBubbles',
  Spokes = 'spokes',
}

export enum TransitionType {
  Unset = 0,
  FadeIn = 1,
  FadeOut = 2,
  DidFadeIn = 3,
  DidFadeOut = 4,
  Loop = 5,
  Stop = 6,
}

export type TLoadingProcessState = {
  enabled?: boolean;
  type?: LoadingProcessType;
  body?: ReactNode;
};

export type TSoundsState = {
  // 使用者第一次點擊畫面時才建立（瀏覽器要求有手勢才能播放聲音），在那之前是 null
  track?: Sounds | null;
  // 全部音檔讀取完成
  loaded?: boolean;
};

export type TModalState = {
  enabled?: boolean;
  title?: ReactNode;
  body?: ReactNode;
  // 底部按鈕文字：字串顯示一顆、陣列顯示多顆（文字不可重複）
  label?: string | string[];
  // 按下底部按鈕時呼叫，參數是該按鈕文字；可為 async，回傳 false 則不關閉
  onClose?: (label?: string) => void | boolean | Promise<void | boolean>;
};

export interface IState {
  page?: (typeof PAGE)[keyof typeof PAGE];
  loadingProcess?: TLoadingProcessState;
  sounds?: TSoundsState;
  modal?: TModalState;
}

// 每個 ActionType 對應的 state 型別；新增 ActionType 時在這裡補一筆
export type TActionStateMap = {
  [ActionType.Page]: (typeof PAGE)[keyof typeof PAGE];
  [ActionType.LoadingProcess]: TLoadingProcessState;
  [ActionType.Sounds]: TSoundsState;
  [ActionType.Modal]: TModalState;
};

// discriminated union：選了 type，state 就只會提示該 type 的欄位
export type IAction = {
  [K in ActionType]: { type: K; state: TActionStateMap[K] };
}[ActionType];

export type TContext = [IState, Dispatch<IAction>];

export interface IReactProps {
  readonly children?: ReactNode;
}
