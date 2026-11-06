import bgm from './mp3/mp3-bgm.mp3';
import click from './mp3/mp3-click.mp3';
import correct from './mp3/mp3-correct.mp3';
import wrong from './mp3/mp3-wrong.mp3';

/**
 * 所有音效設定。
 * src 由 Vite 依 VITE_IMAGE_SOURCE 決定：local 為打包後的本機路徑，cdn 為 Bunny CDN 網址。
 * 新增音效時：把 mp3 放進 ./mp3，在這裡 import 並加一筆即可，SoundName 會自動帶出。
 * loop: true 的音軌（背景音樂）在 App 切到背景再回來時會自動接續播放。
 */
export const SoundList = {
  bgm: { src: bgm, loop: true },
  click: { src: click, loop: false },
  correct: { src: correct, loop: false },
  wrong: { src: wrong, loop: false },
} satisfies Record<string, { src: string; loop: boolean }>;
