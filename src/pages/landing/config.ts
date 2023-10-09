import { createContext, Dispatch, SetStateAction } from 'react';

export enum LandingSteps {
  unset = 0,
  fadeIn = 1,
}
export type TLandingState = { step: LandingSteps };
export type TLandingContext = [TLandingState, Dispatch<SetStateAction<TLandingState>>];

export const LandingState = { step: LandingSteps.unset };
export const LandingContext = createContext<TLandingContext>([LandingState, () => {}]);
