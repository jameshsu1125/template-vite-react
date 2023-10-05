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

export type LoadingProcessState = {
	enabled?: boolean;
	type?: LoadingProcessType;
	body?: '';
};

export interface State {
	page: string;
	loadingProcess?: LoadingProcessState;
}

export interface Action {
	state: State | LoadingProcessState;
	type: ActionType;
}

export type TContext = [State, Dispatch<Action>];

export interface IProps {
	children?: ReactNode;
}
