import { useState, useEffect, useCallback } from 'react';

function isDOM(node: any) {
  if (typeof HTMLElement === 'object') {
    return node instanceof HTMLElement;
  }
  return (
    node && typeof node === 'object' && node.nodeType === 1 && typeof node.nodeName === 'string'
  );
}

function throttle(fn: Function, delay: number) {
  let loading = false;
  return function t(this: any, ...args: any[]) {
    if (loading) {
      return;
    }
    loading = true;
    fn.call(this, ...args);
    setTimeout(() => {
      loading = false;
    }, delay);
  };
}

function debounce(fn: Function, delay: number) {
  let timer: any = null;
  return function t(this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
}

/**
 * @describtion 鼠标长时间不移动隐藏鼠标
 * @params ref 可以是 react ref 或者 dom 元素
 * @params wait(ms) 不操作 wait 后隐藏
 * @example
 * const ref = useRef<any>();
 * useHideCursor(ref, 10000);
 * html: <div ref={ref}>需要隐藏鼠标的元素</div>
 */
export const useHideCursor = (
  ref: HTMLElement | React.MutableRefObject<HTMLElement>,
  wait: number = 10000,
) => {
  const [isHide, setIsHide] = useState(false);

  const hide = useCallback(
    debounce(() => {
      setIsHide(true);
    }, wait),
    [],
  );

  const onMouseMove = useCallback(
    throttle(() => {
      setIsHide(false);
      hide();
    }, 1000),
    [],
  );

  useEffect(() => {
    let node: HTMLElement;
    if (isDOM(ref)) {
      node = ref as HTMLElement;
    } else {
      node = (ref as React.MutableRefObject<HTMLElement>).current;
    }
    node.addEventListener('mousemove', onMouseMove);
    return () => {
      node.removeEventListener('mousemove', onMouseMove);
    };
  }, [ref]);

  useEffect(() => {
    let node: HTMLElement;
    if (isDOM(ref)) {
      node = ref as HTMLElement;
    } else {
      node = (ref as React.MutableRefObject<HTMLElement>).current;
    }
    if (isHide) {
      node.classList.add('__hideCursor__');
    } else {
      node.classList.remove('__hideCursor__');
    }
    return () => {
      node.classList.remove('__hideCursor__');
    };
  }, [isHide]);

  useEffect(() => {
    const id = '__HIDE_CURSOR_STYLE__';
    if (document.getElementById(id)) {
      return;
    }
    const style = document.createElement('style');
    style.id = id;
    style.innerHTML =
      '.__hideCursor__ { cursor: none !important; }.__hideCursor__ > * { cursor: none !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);
  }, []);

  return [isHide];
};

/**
 * @describtion 获取鼠标是否在 wait 时间内不移动
 * @params wait(ms) 不移动的时间
 * @example
 * const [isMouseStop] = useMouseStop(10000);
 */
export const useMouseStop = (wait: number = 10000) => {
  const [isStop, setIsStop] = useState(true);
  const stop = useCallback(
    debounce(() => {
      setIsStop(true);
    }, wait),
    [],
  );

  const onMouseMove = useCallback(
    throttle(
      () => {
        setIsStop(false);
        stop();
      },
      wait < 1000 ? 200 : 1000,
    ),
    [],
  );

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
  return [isStop];
};
