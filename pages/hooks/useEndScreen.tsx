import { useEffect, useState, useRef, RefObject } from 'react';

export default function useEndScreen(ref: RefObject<HTMLElement>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [endScreen, setEndScreen] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setEndScreen(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if(observerRef?.current !== null && ref.current !== null){
      observerRef?.current.observe(ref.current);
    }

    return () => {
      if(observerRef?.current !== null){
        observerRef?.current.disconnect();
      }
    };
  }, [ref]);

  return {
    endScreen,
    setEndScreen,
  };
}