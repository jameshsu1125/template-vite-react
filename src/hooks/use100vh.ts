// Ported from react-div-100vh (https://github.com/mvasin/react-div-100vh, MIT)
import { useEffect, useState } from 'react';

export const measureHeight = (): number => window.innerHeight;

/** 回傳真實可視高度（px），視窗 resize 時更新 */
export const use100vh = (): number => {
  const [height, setHeight] = useState<number>(measureHeight);

  useEffect(() => {
    const onResize = () => setHeight(measureHeight());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return height;
};

export default use100vh;
