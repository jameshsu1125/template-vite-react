import { Dispatch, ReactNode } from 'react';

export enum ActionType {
	page = 'page',
	modal = 'modal',
	alert = 'alert',
	loadingProcess = 'loadingProcess',
}

export type ModalState = {
	enabled: boolean;
	title: ReactNode;
	body: ReactNode;
	button: string;
};

export enum AlertType {
	INFO = 'info',
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
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

export type LoadingProcessState = {
	enabled: boolean;
	type: LoadingProcessType;
	body: '';
};

export type AlertState = {
	enabled: boolean;
	type: AlertType;
	body: ReactNode;
	duration: number;
};

export interface State {
	page: string;
	modal?: ModalState;
	alert?: AlertState;
	loadingProcess?: LoadingProcessState;
}

export interface Action {
	state: State | ModalState | AlertState | LoadingProcessState;
	type: ActionType;
}

export type TContext = [State, Dispatch<Action>];

export interface IProps {
	children?: ReactNode;
}
