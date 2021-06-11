import React, { useState, useRef, useEffect } from 'react';
import { Carousel } from 'antd';
import { useInterval } from '../../hooks/useInterval';
import styles from './index.less';

export interface PropsType {
  style?: React.CSSProperties;
  rowKey?: React.Key;
  /** 获取数据的 Promise，需要返回 list 和 total */
  fetchList: (...args: any[]) => Promise<any[]>;
  /** 是否自动播放，自动播放时，手动点击切换页码会禁用 */
  autoplay?: boolean;
  className?: string;
}

const CarouselList = React.memo<PropsType>((props) => {
  const { fetchList, autoplay, rowKey, className } = props;
  const [list, setList] = useState<any[]>([]);
  const size = 5;
  const totalPage = Math.ceil(list.length / size);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<any>(null);

  const srollTo = (page: number) => {
    // 滚动到第几页 page 从 1 开始
    // FIXME: 默认第二页时，手动点击第一页动画效果不流畅
    // setTimeout(() => {
    setCurrent(page);
    if (current === totalPage && page === 1) {
      carouselRef.current?.next();
    } else {
      carouselRef.current?.goTo(page - 1);
    }
    // }, 400);
  };

  const fetchAndGoto = async (page: number) => {
    if (loading) return;
    // 获取数据并滚动，page 从 1 开始
    if (totalPage && page > totalPage) return;
    // 如果不是自动播放，页码一样就不需要请求
    // 如果是自动播放，页码一样时要请求数据，因为要实时刷新本页数据
    if (!autoplay && current === page) return;
    try {
      setLoading(true);
      const res = await fetchList?.();
      setList(res || []);
      // setTotal(res!.total || 0);
      srollTo(page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [start, clear] = useInterval(() => {
    if (current + 1 <= totalPage) {
      fetchAndGoto(current + 1);
    } else {
      fetchAndGoto(1);
    }
  }, 5000);

  useEffect(() => {
    if (autoplay) {
      start();
    } else {
      clear();
    }
    return clear;
  }, [autoplay]);

  useEffect(() => {
    // 默认会调用 fetchList 初始化首屏数据
    setLoading(true);
    fetchList?.()
      .then((res) => {
        setList(res || []);
        srollTo(1);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <Carousel swipe={false} dots={false} ref={carouselRef}>
        {Array.from({ length: totalPage }).map((t, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} style={{ width: '100%', height: '100%' }}>
              <ul className={styles.ul}>
                {list.slice(i * size, (i + 1) * size).map((item, index) => {
                  const key = rowKey ? item[rowKey] || index : index;
                  const isNo1 = i === 0 && index === 0;
                  return (
                    <li key={key} className={isNo1 ? styles.no1 : ''}>
                      <div title={item.consultant_name} className={styles.avatar}>
                        {item.consultant_image && <img src={item.consultant_image} />}
                        <div className={styles.name}>{item.consultant_name}</div>
                      </div>
                      <span>{item.num}科</span>
                      <span>{item.station_name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </Carousel>
      <ul className={styles.dots}>
        {Array.from({ length: totalPage }).map((dot, i) => {
          return (
            <li
              className={current === i + 1 ? styles.active : ''}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onClick={() => {
                // if (autoplay) return;
                if (i + 1 === current) return;
                if (autoplay) {
                  // 正在自动播放先停止，再播放
                  clear();
                  fetchAndGoto(i + 1).finally(() => {
                    start();
                  });
                } else {
                  fetchAndGoto(i + 1);
                }
              }}
            >
              <i />
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default CarouselList;
