import { useState, useEffect, useRef, useCallback } from 'react';

type OptionsType = {
  /** 是否在首次调用时立即执行 */
  immediate?: boolean;
};
/**
 * @description
 * @example
 *  const [start, clear] = useInterval(() => {
      // do something
    }, 5000);
*/
export function useInterval(callback: Function, delay: number, options?: OptionsType) {
  const savedCallback = useRef<any>();
  const [timer, setTimer] = useState<any>(null);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(
    (...args) => {
      function tick() {
        savedCallback.current?.(...args);
      }
      if (delay !== null) {
        if (options?.immediate) {
          tick();
        }
        setTimer(setInterval(tick, delay));
      }
    },
    [delay],
  );

  return [
    start,
    () => {
      clearInterval(timer);
    },
  ];
}
