import Sounds from '@/components/sounds';
import { ActionType, IAction } from '@/settings/type';
import { Dispatch, useEffect } from 'react';
import { flushSync } from 'react-dom';

/** 視為「使用者點擊畫面」的事件；觸控、滑鼠、觸控筆都會觸發 pointerdown */
const FIRST_TOUCH_EVENTS = ['pointerdown', 'keydown'] as const;

/**
 * 使用者第一次點擊畫面時建立 Sounds 並讀取全部音檔，再存進 Context 的 sounds。
 * 瀏覽器規定要有使用者手勢才能播放聲音，所以不在頁面載入時就建立。
 * 元件內取用：const [context] = useContext(Context); context[ActionType.Sounds]?.track?.play('click');
 */
const useSoundsOnFirstTouch = (dispatch: Dispatch<IAction>) => {
  useEffect(() => {
    let sounds: Sounds | null = null;

    const removeListeners = () =>
      FIRST_TOUCH_EVENTS.forEach((event) => document.removeEventListener(event, load, true));

    function load() {
      removeListeners();
      sounds = new Sounds({
        onLoad: () => dispatch({ type: ActionType.Sounds, state: { loaded: true } }),
        onError: (message) => console.warn(`[Sounds] ${message}`),
      });
      // 同步寫入 Context，確保同一次點擊的 click handler 已拿得到 track（載入完成後會自動補播）
      flushSync(() => dispatch({ type: ActionType.Sounds, state: { track: sounds } }));
    }

    FIRST_TOUCH_EVENTS.forEach((event) => document.addEventListener(event, load, true));

    return () => {
      removeListeners();
      sounds?.destroy();
    };
  }, [dispatch]);
};

export default useSoundsOnFirstTouch;
