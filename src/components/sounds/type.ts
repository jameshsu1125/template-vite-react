import { SoundList } from './config';

/** 音效名稱，由 config.ts 的 SoundList 自動產生 */
export type SoundName = keyof typeof SoundList;
