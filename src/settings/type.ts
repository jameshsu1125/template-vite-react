import type Sounds from '@/components/sounds';
import { Dispatch, ReactNode } from 'react';

export enum ActionType {
  Page = 'page',
  LoadingProcess = 'loadingProcess',
  Sounds = 'sounds',
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

export interface IState {
  page?: string;
  loadingProcess?: TLoadingProcessState;
  sounds?: TSoundsState;
}

export interface IAction {
  state: IState | TLoadingProcessState | TSoundsState;
  type: ActionType;
}

export type TContext = [IState, Dispatch<IAction>];

export interface IReactProps {
  readonly children?: ReactNode;
}
