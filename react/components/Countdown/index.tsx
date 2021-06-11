import React, { useState, useEffect, useMemo } from 'react';
import { pad } from '@/utils/utils';
import { useInterval } from '../../hooks/useInterval';
import styles from './index.less';

function getCountdown(
  start: number,
): {
  day: string;
  hour: string;
  minute: string;
  second: string;
} {
  let seconds = start;
  let day = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;
  if (seconds > 3600 * 24) {
    day = Math.floor(seconds / 3600 / 24);
    seconds -= 3600 * 24 * day;
  }
  if (seconds > 3600) {
    hour = Math.floor(seconds / 3600);
    seconds -= 3600 * hour;
  }
  if (seconds > 60) {
    minute = Math.floor(seconds / 60);
    seconds -= 60 * minute;
  }
  second = seconds;
  return {
    day: pad(day, 2),
    hour: pad(hour, 2),
    minute: pad(minute, 2),
    second: pad(second, 2),
  };
}

type PropsType = {
  /**
   * @description 是否开始倒计时
   */
  run?: boolean;
  /**
   * @description 倒计时结束时的回调
   */
  onEnd?: () => void;
  /**
   *  @description 倒计时的 deadline，单位是秒，十位数的时间戳
   */
  deadline?: number;
  label?: string;
  style?: React.CSSProperties;
};

/**
 * @description 倒计时组件
 * */
export default React.memo<PropsType>((props) => {
  const { style = {}, onEnd, deadline = 0, run, label } = props;
  // 剩余多少秒
  const [leftSeconds, setLeftSeconds] = useState(0);
  const countdown = useMemo(() => {
    return getCountdown(leftSeconds);
  }, [leftSeconds]);
  // 倒计时
  const [start, clear] = useInterval(() => {
    if (leftSeconds <= 0) {
      clear();
      onEnd?.();
      return;
    }
    setLeftSeconds(leftSeconds - 1);
  }, 1000);

  useEffect(() => {
    if (run) {
      const now = Math.floor(new Date().getTime() / 1000);
      if (now < deadline) {
        setLeftSeconds(deadline - now);
        start();
      } else {
        clear();
      }
    } else {
      clear();
    }
    return clear;
  }, [deadline, run]);

  useEffect(() => {
    let hidden: string;
    let visibilityChange: string = 'visibilitychange';
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    const onVisibleChange = () => {
      if (document[hidden]) {
        // 不要偷偷在切换 tab 之后倒计时
        // 因为浏览器会降频，导致倒计时不准
        clear();
        return;
      }
      if (run) {
        const now = Math.floor(new Date().getTime() / 1000);
        if (now < deadline) {
          setLeftSeconds(deadline - now);
          start();
        } else {
          clear();
        }
      } else {
        clear();
      }
    };
    document.addEventListener(visibilityChange, onVisibleChange);
    return () => {
      document.removeEventListener(visibilityChange, onVisibleChange);
    };
  }, []);

  return (
    <div className={styles.countdown} style={style}>
      <span>{label}</span>
      <div style={{ display: 'flex' }}>
        {countdown.day !== '00' && (
          <>
            {countdown.day.split('').map((t, i) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className={styles.number} key={`${i}-${t}`}>
                  {t}
                </div>
              );
            })}
            <div className={styles.day}>天</div>
          </>
        )}
        {countdown.hour.split('').map((t, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className={styles.number} key={`${i}-${t}`}>
              {t}
            </div>
          );
        })}
        <div className={styles.colon} />
        {countdown.minute.split('').map((t, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className={styles.number} key={`${i}-${t}`}>
              {t}
            </div>
          );
        })}
        <div className={styles.colon} />
        {countdown.second.split('').map((t, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div className={styles.number} key={`${i}-${t}`}>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
});
