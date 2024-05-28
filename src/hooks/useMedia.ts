import { useEffect, useState } from 'react';

export enum MediaType {
  Unset = 0,
  XXS = 1,
  XS = 2,
  SM = 3,
  MD = 4,
  LG = 5,
}

const useMedia = () => {
  const [state, setState] = useState<MediaType>(MediaType.Unset);
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth <= 430) return setState(MediaType.XXS);
      else if (window.innerWidth <= 768) return setState(MediaType.XS);
      else if (window.innerWidth <= 1024) return setState(MediaType.SM);
      else if (window.innerWidth <= 1280) return setState(MediaType.MD);
      else return setState(MediaType.LG);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return [state];
};
export default useMedia;
