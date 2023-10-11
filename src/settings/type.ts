import { Dispatch, ReactNode } from 'react';

export enum ActionType {
  page = 'page',
  loadingProcess = 'loadingProcess',
}

export enum LoadingProcessType {
  balls = 'balls',
  bars = 'bars',
  bubbles = 'bubbles',
  cubes = 'cubes',
  cylon = 'cylon',
  spin = 'spin',
  spinningBubbles = 'spinningBubbles',
  spokes = 'spokes',
}

export enum TransitionType {
  unset = 0,
  fadeIn = 1,
  fadeOut = 2,
  didFadeIn = 3,
  didFadeOut = 4,
  loop = 5,
  stop = 6,
}

export type TLoadingProcessState = {
  enabled?: boolean;
  type?: LoadingProcessType;
  body?: '';
};

export interface IState {
  page: string;
  loadingProcess?: TLoadingProcessState;
}

export interface IAction {
  state: IState | TLoadingProcessState;
  type: ActionType;
}

export type TContext = [IState, Dispatch<IAction>];

export interface IReactProps {
  children?: ReactNode;
}
