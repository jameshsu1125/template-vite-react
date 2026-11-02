import { Howl, Howler } from 'howler';
import { SoundList } from './config';
import { SoundName } from './type';

export type { SoundName } from './type';

/** Howler 全域物件上未列入型別定義、但恢復音訊時需要的內部成員 */
type HowlerInternal = {
  ctx?: AudioContext;
  /** Howler 內部狀態機：'suspended' | 'suspending' | 'running' */
  state?: string;
  /** 所有 Howl；ctx 不在 running 時 play() 會鎖住並等 'resume' 事件，自行 resume 後必須補發 */
  _howls?: { _emit: (event: string) => void }[];
};

const howlerInternal = (): HowlerInternal => Howler as unknown as HowlerInternal;

/** 回前景後若 AudioContext 仍未 running，改等使用者手勢的等待時間（ms） */
const RESUME_FALLBACK_DELAY = 500;

/** 可用來解鎖 AudioContext 的使用者手勢事件 */
const GESTURE_EVENTS = ['touchend', 'mousedown', 'click', 'keydown'] as const;

/**
 * 判定音軌「其實已經死了」的播放位置容差（秒）。
 * iOS 中斷後 source node 失效，但 Howler 的 _paused 仍是 false、playing() 仍回傳 true，
 * 唯一可靠的跡象是播放位置完全沒有前進。
 */
const STALLED_SEEK_TOLERANCE = 0.05;

const SOUND_NAMES = Object.keys(SoundList) as SoundName[];

type Track = {
  src: string;
  loop: boolean;
  loaded: boolean;
  howl: Howl | null;
};

type SoundsProps = {
  /** 全部音檔讀取完成 */
  onLoad?: () => void;
  onError?: (message: string) => void;
};

/**
 * Howler.js 音效管理類別。
 * 建立時立即讀取 SoundList 內全部音檔；應在使用者第一次點擊畫面時建立（見 useSoundsOnFirstTouch）。
 * 支援 play / stop / fadeOut / mute，並處理 App 切到背景再回來時循環音軌失聲的問題。
 */
export default class Sounds {
  private tracks: Record<SoundName, Track>;
  private onLoad: () => void;
  private onError: (message: string) => void;
  private isMuted = false;

  /** 目前應該持續播放的循環音軌，App 切回前景時據此恢復 */
  private currentLoop: SoundName | null = null;

  /** 是否已掛上等待使用者手勢的解鎖監聽，避免重複註冊 */
  private isGestureArmed = false;

  /** 切到背景當下循環音軌的播放位置（秒），回前景時用來判斷音軌是否已失效並接續播放 */
  private loopSeekAtHide: number | null = null;

  /** AudioContext 已確定救不回來，等使用者下一個手勢就整組重建 */
  private pendingRebuild = false;

  /** 尚未載入完成就被呼叫 play 的音效，載入完成後立即補播（同名只保留最後一次的參數） */
  private pendingPlays = new Map<SoundName, { volume: number; canPlayTwice: boolean }>();

  constructor({ onLoad, onError }: SoundsProps = {}) {
    this.onLoad = onLoad || (() => {});
    this.onError = onError || (() => {});
    this.tracks = Object.fromEntries(
      SOUND_NAMES.map((name) => [
        name,
        { src: SoundList[name].src, loop: SoundList[name].loop, loaded: false, howl: null },
      ]),
    ) as Record<SoundName, Track>;

    SOUND_NAMES.forEach((name) =>
      this.createTrack(name, () => {
        if (this.isLoaded()) this.onLoad();
      }),
    );
    this.bindLifecycle();
  }

  /** 全部音檔是否都已讀取完成 */
  public isLoaded(): boolean {
    return SOUND_NAMES.every((name) => this.tracks[name].loaded);
  }

  public checkIsMuted(): boolean {
    return this.isMuted;
  }

  /** 建立（或重建）單一音軌 */
  private createTrack(name: SoundName, onLoaded?: () => void): void {
    const track = this.tracks[name];
    track.howl?.unload();
    track.loaded = false;

    const howl = new Howl({
      src: [track.src],
      loop: track.loop,
      onload: () => {
        track.loaded = true;
        if (this.isMuted) howl.mute(true);
        onLoaded?.();
        this.flushPendingPlay(name);
      },
      onloaderror: (_id, error) => this.onError(`音軌 ${name} 載入失敗：${error}`),
      // 瀏覽器尚未解鎖音訊時，等 Howler 解鎖後再播
      onplayerror: () => howl.once('unlock', () => howl.play()),
    });
    track.howl = howl;
  }

  /** 取得已讀取完成的 Howl 實例 */
  private getHowl(name: SoundName): Howl | null {
    const track = this.tracks[name];
    return track.loaded ? track.howl : null;
  }

  public play(name: SoundName, volume = 1, canPlayTwice = true): void {
    const howl = this.getHowl(name);
    if (!howl) {
      // 第一次點擊時音檔多半還在讀取，先記下來，載入完成後自動播放
      this.onError(`音效 ${name} 尚未載入，載入完成後播放`);
      this.pendingPlays.set(name, { volume, canPlayTwice });
      return;
    }
    if (!canPlayTwice && howl.playing()) return;

    // 切回 App 後 ctx 可能仍是 suspended / interrupted，先用有接住錯誤的流程喚醒，
    // 不能只靠 Howler play() 內部的 _autoResume()（失敗時沒人處理，音軌會永久鎖住）
    if (howlerInternal().ctx?.state !== 'running') this.resume();

    try {
      howl.volume(volume);
      howl.play();
      if (this.tracks[name].loop) this.currentLoop = name;
    } catch (error) {
      // 播放失敗時重建音軌，等重新讀取完成後再播一次
      this.onError(`播放 ${name} 失敗，重新建立音軌：${error}`);
      this.createTrack(name, () => this.play(name, volume, canPlayTwice));
    }
  }

  /** 補播載入前被要求播放的音效 */
  private flushPendingPlay(name: SoundName): void {
    const pending = this.pendingPlays.get(name);
    if (!pending) return;
    this.pendingPlays.delete(name);
    this.play(name, pending.volume, pending.canPlayTwice);
  }

  public stop(name: SoundName): void {
    this.pendingPlays.delete(name);
    if (this.currentLoop === name) this.clearLoop();
    this.getHowl(name)?.stop();
  }

  public stopAll(): void {
    this.pendingPlays.clear();
    this.clearLoop();
    SOUND_NAMES.forEach((name) => this.getHowl(name)?.stop());
  }

  public fadeOut(name: SoundName, duration = 1000): void {
    this.pendingPlays.delete(name);
    if (this.currentLoop === name) this.clearLoop();

    const howl = this.getHowl(name);
    if (!howl) return;

    const volume = howl.volume();
    howl.fade(volume, 0, duration);
    howl.once('fade', () => {
      howl.stop();
      howl.volume(volume); // 恢復原始音量以便下次播放
    });
  }

  public mute(): void {
    this.setMuted(true);
  }

  public unmute(): void {
    this.setMuted(false);
  }

  private setMuted(muted: boolean): void {
    this.isMuted = muted;
    SOUND_NAMES.forEach((name) => this.getHowl(name)?.mute(muted));
  }

  private clearLoop(): void {
    this.currentLoop = null;
    this.loopSeekAtHide = null;
  }

  /** 卸載所有音軌並移除生命週期監聽 */
  public destroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.handleBackground);
    window.removeEventListener('pageshow', this.handleForeground);
    window.removeEventListener('focus', this.handleForeground);

    this.pendingPlays.clear();
    this.clearLoop();
    SOUND_NAMES.forEach((name) => {
      const track = this.tracks[name];
      track.howl?.unload();
      track.howl = null;
      track.loaded = false;
    });
  }

  /** 音訊狀態快照，供除錯「有音訊 icon 卻沒聲音」這類問題時檢視 */
  public checkAudioStatus() {
    const ctx = howlerInternal().ctx;
    const howl = this.getLoopHowl();
    const seek = howl?.seek();

    return {
      available: !document.hidden && ctx?.state === 'running',
      context: ctx?.state || 'unknown',
      loaded: this.isLoaded(),
      currentLoop: this.currentLoop,
      playing: howl?.playing() ?? false,
      seek: typeof seek === 'number' ? seek : null,
      seekAtHide: this.loopSeekAtHide,
    };
  }

  // ───────────────────────── 背景／前景切換的恢復機制 ─────────────────────────

  /**
   * 監聽回到前景的時機。
   * 瀏覽器在 App 切走時會把 AudioContext 打成 suspended（iOS 為 interrupted），
   * 而 Howler 只在 play() 與首次手勢解鎖時才會 _autoResume()，本身不監聽 visibilitychange，
   * 因此必須由這裡負責喚醒，否則循環播放的背景音樂切回來就再也不會響。
   */
  private bindLifecycle(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.handleBackground);
    window.addEventListener('pageshow', this.handleForeground);
    window.addEventListener('focus', this.handleForeground);
  }

  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') this.resume();
    else this.snapshotLoop();
  };

  private handleForeground = (): void => {
    if (document.visibilityState === 'visible') this.resume();
  };

  private handleBackground = (): void => {
    this.snapshotLoop();
  };

  private getLoopHowl(): Howl | null {
    return this.currentLoop ? this.getHowl(this.currentLoop) : null;
  }

  /** 記下切到背景當下的播放位置，回前景時用來比對音軌是否還活著 */
  private snapshotLoop(): void {
    const seek = this.getLoopHowl()?.seek();
    this.loopSeekAtHide = typeof seek === 'number' ? seek : null;
  }

  /** 從指定位置重新播放循環音軌；stop 會把 seek 歸零，所以順序必須是 stop → seek → play */
  private replayLoopFrom(howl: Howl, position: number | null): void {
    howl.stop();
    if (position !== null && position > 0) howl.seek(position);
    howl.play();
  }

  /**
   * 恢復目前的循環音軌。
   * 不能只看 playing()：iOS 中斷後 source node 已失效，但 Howler 仍認定在播放，
   * 這時 Safari 網址列還會顯示音訊 icon 卻完全沒有聲音。
   * 因此改以「播放位置有沒有從切到背景時前進」來判斷音軌是否真的還活著。
   */
  private restoreLoop(): void {
    const howl = this.getLoopHowl();
    if (!howl) return;

    const previous = this.loopSeekAtHide;

    if (!howl.playing()) {
      this.replayLoopFrom(howl, previous);
      this.loopSeekAtHide = null;
      return;
    }

    // 沒有比對基準就不動它，以免把正常播放中的音軌打斷
    if (previous === null) return;

    const current = howl.seek();
    const isStalled =
      typeof current !== 'number' || Math.abs(current - previous) < STALLED_SEEK_TOLERANCE;

    if (isStalled) this.replayLoopFrom(howl, previous);
    this.loopSeekAtHide = null;
  }

  /** AudioContext 無法自行恢復時（iOS 常見），改掛一次性監聽等使用者的下一個手勢 */
  private armGestureResume(): void {
    if (this.isGestureArmed) return;
    this.isGestureArmed = true;

    const unlock = (): void => {
      GESTURE_EVENTS.forEach((event) => document.removeEventListener(event, unlock, true));
      this.isGestureArmed = false;

      if (this.pendingRebuild) {
        this.pendingRebuild = false;
        this.rebuildAudio();
        return;
      }

      this.resume();
    };

    GESTURE_EVENTS.forEach((event) => document.addEventListener(event, unlock, true));
  }

  /**
   * 重建整組音訊。
   *
   * iOS 切換 App 後 AudioContext 的音訊裝置會起不來，此時 ctx.resume() 會以
   * InvalidStateError（Failed to start the audio device）失敗，該 context 已無法復原。
   * Howler.unload() 會 close 舊的 ctx 並建立全新的一個，同時卸載所有 Howl，
   * 所以只能整組重建再把循環音軌接回原本的位置。
   *
   * 新的 AudioContext 在 iOS 上需要使用者手勢才能啟動，因此這個方法只在手勢事件中被呼叫。
   */
  private rebuildAudio(): void {
    const loopName = this.currentLoop;
    const position = this.loopSeekAtHide;

    Howler.unload();
    SOUND_NAMES.forEach((name) => {
      this.tracks[name].howl = null;
      this.tracks[name].loaded = false;
    });

    // 音檔載入是非同步的，等到 onload 時早已離開手勢的呼叫堆疊，
    // 屆時 play() 內部的 _autoResume() 又會是一次沒接住的 ctx.resume()。
    // 所以趁還在手勢裡，先把新的 context 叫起來。
    const freshCtx = howlerInternal().ctx;
    if (freshCtx && freshCtx.state !== 'running') {
      freshCtx.resume().catch(() => this.onError('新的 AudioContext 啟動失敗'));
    }

    SOUND_NAMES.forEach((name) =>
      this.createTrack(name, () => {
        if (name !== loopName) return;
        const howl = this.getHowl(name);
        if (!howl) return;
        this.replayLoopFrom(howl, position);
        this.loopSeekAtHide = null;
      }),
    );
  }

  /**
   * 喚醒 Howler 的 AudioContext 並接回循環音軌。
   * 注意必須操作 Howler.ctx，自行 new 一個 AudioContext 來 resume 是無效的。
   */
  public resume(): void {
    // 即使沒有循環音軌也必須喚醒：單次音效若交給 Howler play() 內部的 _autoResume()，
    // iOS 上 ctx.resume() 失敗時 Howl 會卡在 _playLock 等不到 'resume' 事件，之後所有音效都不會響
    if (this.pendingRebuild) return;

    const howler = howlerInternal();
    const ctx = howler.ctx;

    if (!ctx || ctx.state === 'running') {
      this.restoreLoop();
      return;
    }

    // 不呼叫 Howler 的 _autoResume()：它內部的 ctx.resume() 沒有 rejection handler，
    // 在 iOS 上會直接炸成 Unhandled Promise Rejection，這裡自己接。
    ctx.resume().then(
      () => {
        howler.state = 'running';
        // 補發 'resume'，釋放在 ctx 暫停期間被呼叫 play() 而鎖住等待的 Howl
        howler._howls?.forEach((howl) => howl._emit('resume'));
        this.restoreLoop();
      },
      () => {
        // InvalidStateError: Failed to start the audio device
        // → 音訊裝置起不來，這個 context 已經死了，只能整組重建
        this.pendingRebuild = true;
        this.armGestureResume();
      },
    );

    // iOS 上 resume() 有時既不 resolve 也不 reject，補一道保險
    window.setTimeout(() => {
      if (this.pendingRebuild || this.isGestureArmed) return;

      if (ctx.state === 'running') this.restoreLoop();
      else this.armGestureResume();
    }, RESUME_FALLBACK_DELAY);
  }
}
