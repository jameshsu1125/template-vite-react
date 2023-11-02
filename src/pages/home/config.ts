import { createContext, Dispatch, SetStateAction } from 'react';

export enum LandingStepType {
  unset = 0,
  fadeIn = 1,
}
export type TLandingState = { step: LandingStepType };
export type TLandingContext = [TLandingState, Dispatch<SetStateAction<TLandingState>>];

export const LandingState = { step: LandingStepType.unset };
export const LandingContext = createContext<TLandingContext>([LandingState, () => {}]);
