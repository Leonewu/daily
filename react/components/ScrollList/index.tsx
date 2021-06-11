import React, { useEffect, useRef, useReducer } from 'react';
import styles from './index.less';
import { useInterval } from '../hooks/useInterval';

declare module 'react' {
  // memo会丢失泛型 memo helper
  function memo<A, B>(Component: (props: A) => B): (props: A) => ReactElement | null;
}

type PropType<T = Record<string, unknown>> = {
  /* 元素需要指定高度，默认为 48px */
  itemHeight: number;
  /* 获取数据，参数最新的时间戳 */
  fetchList: (newestItem: T) => Promise<T[]>;
  render?: (item: T) => React.ReactNode;
  rowKey: React.Key | ((row: any) => React.Key);
};

const ScrollTable = <T extends Record<string, unknown>>(props: PropType<T>) => {
  const { fetchList, rowKey, render, itemHeight = 48 } = props;
  const list = useRef<T[]>([]);
  const visualList = useRef<T[]>([]);
  const scrollTimer = useRef<any>(null);
  const [, forceUpdate] = useReducer((x) => !x, false);
  // 最新的 item
  const newestItem = useRef<T>({} as T);
  const autoScroll = () => {
    if (scrollTimer.current) return;
    if (!list.current.length) return;
    scrollTimer.current = setTimeout(() => {
      visualList.current = list.current.slice(-5).concat(visualList.current.slice(0, 5));
      list.current = list.current.slice(0, -5);
      forceUpdate();
      scrollTimer.current = null;
      autoScroll();
    }, 2000);
  };
  const [start, clear] = useInterval(
    () => {
      fetchList(newestItem.current).then((res) => {
        list.current = (res || []).concat(list.current);
        if (res.length) {
          // 如果返回的是有值，则更新时间戳
          // eslint-disable-next-line prefer-destructuring
          newestItem.current = res[0];
        }
        autoScroll();
      });
    },
    3000,
    { immediate: true },
  );

  useEffect(() => {
    start();
    return clear;
  }, []);

  return (
    <div
      className={styles.wrapper}
      style={{ '--item-height': `${itemHeight}px` } as React.CSSProperties}
    >
      <ul className={styles.ul}>
        {visualList.current.map((item) => {
          let content: React.ReactNode = item;
          if (render && typeof render === 'function') {
            content = render(item);
          }
          let key;
          if (typeof rowKey === 'function') {
            key = rowKey(item);
          } else {
            key = item[rowKey];
          }
          return <li key={key}>{content}</li>;
        })}
      </ul>
    </div>
  );
};

export default React.memo(ScrollTable);
