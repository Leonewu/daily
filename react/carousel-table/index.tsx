import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'umi';
import { multiply } from '@/utils/utils';
import moment from 'moment';
import { message } from 'antd';
// import bg from '@/assets/sale/perf_bg_1920.png';
import { useInterval } from '../hooks/useInterval';
import { useHideCursor, useMouseStop } from '../hooks/useHideCursor';
import IconFont from '@/components/IconFont';
import { useFullscreen } from 'ahooks';
import styles from './index.less';
import { usePerfData, useScrollList, useDominateData } from './models';
import { Province, Station, Consultant } from './sections/table';
import Celebration from './sections/celebration';
import ScrollList from '../components/ScrollList';
import CarouselList from '../components/CarouselList';
import Countdown from '../components/Countdown';

function format(time: number = 0) {
  const now = new Date().getTime() / 1000;
  const distance = now - time;
  if (distance < 60) {
    return '刚刚';
  }
  if (distance > 60 && distance < 3600) {
    return `${Math.floor(distance / 60)}分钟前`;
  }
  return `${Math.floor(distance / 3600)}小时前`;
}

export default () => {
  const { overviewData, fetchOverviewData } = usePerfData();
  const { fetchList } = useScrollList();
  const { fetchDominateData } = useDominateData();
  const {
    show_status,
    statistic_time = 0,
    dominate_screen_begin_time = 0,
    dominate_screen_end_time = 0,
    carousel_begin_time = 0,
    carousel_end_time = 0,
    count_down_time = 0,
    end_time = 0,
    start_time = 0,
    image_url = {},
    product_count = 0,
    target_count = 0,
    finish_rate = 0,
  } = overviewData || {};

  const perfId = (useParams() as { id: string }).id;
  const ref = useRef<any>();
  const [isFullscreen, { toggleFull }] = useFullscreen(document.querySelector('html'));
  const celebrationRef = useRef<any>();
  useHideCursor(ref, 15000);
  const [isStop] = useMouseStop(2000);
  // 接口轮询
  const [startPoll, clearPoll] = useInterval(
    () => {
      fetchOverviewData({ performance_show_id: perfId })
        .then((res) => {
          if (res?.show_status === 4) {
            // 活动结束
            clearPoll();
          }
        })
        .catch((err) => {
          if ([7845, 7846].includes(err?.err)) {
            const msg = err.err === 7845 ? err.msg : '获取业绩大屏数据失败';
            message.error(msg);
            clearPoll();
          }
        });
    },
    7000,
    { immediate: true },
  );

  useEffect(() => {
    if (perfId) {
      console.log(document.body.clientWidth);
      console.log(window.screen.width);
      console.log(window.screen.width);
      startPoll();
    }
    return () => {
      clearPoll();
    };
  }, [perfId]);

  const WIDTH = 1920;
  const HEIGHT = 1080;

  const autoplay = useMemo(() => {
    return !!(show_status && show_status !== 4);
  }, [show_status]);

  const renderNotice = () => {
    if (show_status === 3) {
      return <p className={styles.notice}>数据正在重新计算中，请稍等</p>;
    }
    if (statistic_time) {
      return (
        <p className={styles.notice}>
          数据更新时间：
          {moment(Number(statistic_time) * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </p>
      );
    }
    return (
      <p className={styles.notice} style={{ visibility: 'hidden' }}>
        活动未开始
      </p>
    );
  };

  const renderCarouselList = () => {
    const now = new Date().getTime() / 1000;
    const showScrollList = carousel_begin_time < now && now < carousel_end_time;
    // 延迟 6s 才显示霸屏，后端要计算
    const showDominate =
      dominate_screen_begin_time &&
      dominate_screen_begin_time + 6 < now &&
      now < dominate_screen_end_time;
    if (showScrollList) {
      if (showDominate) {
        // 展示霸屏
        const s = moment(Number(dominate_screen_begin_time) * 1000).format('HH:mm:ss');
        const e = moment(Number(dominate_screen_end_time) * 1000).format('HH:mm:ss');
        return (
          <>
            <img src={image_url.dominate_screen_image_url} />
            <div className={styles.content}>
              <div className={styles.carouselListWrapper}>
                <header>
                  {s} - {e}
                </header>
                <CarouselList
                  autoplay
                  className={styles.carouselList}
                  fetchList={() => {
                    return fetchDominateData({
                      performance_show_id: perfId,
                    });
                  }}
                />
              </div>
            </div>
          </>
        );
      }
      // 展示签单记录
      return (
        <>
          <img src={image_url.record_image} />
          <div className={styles.content}>
            <ScrollList<any>
              fetchList={(item) => {
                return fetchList({
                  performance_show_id: perfId,
                  time_stamp: item.time_stamp || 0,
                });
              }}
              itemHeight={48}
              render={(item) => {
                const time = format(item.time_stamp);
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <span>
                      {item.teacher_name}({item.station_name})：签单科次+{item.sign_num}
                    </span>
                    <span>{time}</span>
                  </div>
                );
              }}
              rowKey={(item) => `${item.order_id}-${item.teacher_id}`}
            />
          </div>
        </>
      );
    }
    return null;
  };

  const renderCountdown = () => {
    const now = new Date().getTime() / 1000;
    if (count_down_time > 0 && now > count_down_time && now < end_time) {
      // 结束倒计时
      return (
        <Countdown
          label="业绩冲刺倒计时："
          deadline={end_time}
          run={true}
          onEnd={() => {
            celebrationRef.current.show(product_count);
          }}
        />
      );
    }
    if (now < start_time) {
      // 未开始
      return <Countdown label="开始倒计时：" deadline={start_time} run={true} />;
    }
    return null;
  };

  const style = useMemo(() => {
    const s = {
      backgroundImage: `url(${image_url.background_image || ''})`,
      '--width': `${WIDTH}px`,
      '--height': `${HEIGHT}px`,
    } as React.CSSProperties;
    // if (true) {
    //   s[
    //     '--bg-image'
    //   ] = `url(${'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABcUlEQVR4Xu3VMQ0AIBDFUNCEfzHMOGAiQcUbegqaNj83z91rdIyBWRCmxQcpiNWjIFiPghREM4Dx9EMKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcBzHjKbhWveqyAAAAAElFTkSuQmCC'})`;
    // }
    if (image_url?.pattern_bottom_image) {
      s['--bg-image'] = `url(${image_url.pattern_bottom_image})`;
    }
    if (window.screen.width !== WIDTH) {
      // 屏幕不是指定宽度需要缩放
      const scale =
        window.screen.width > WIDTH
          ? (WIDTH / window.screen.width).toFixed(5)
          : (window.screen.width / WIDTH).toFixed(5);
      s.transform = `scale(${scale})`;
      s.transformOrigin = '0 0';
    }
    return s;
  }, [image_url]);

  return (
    <div className={styles.preview} style={style} ref={ref}>
      <Celebration ref={celebrationRef} />
      <IconFont
        onClick={toggleFull}
        className={`${styles.fullScreen} ${!isStop && styles.show}`}
        type={isFullscreen ? 'xhwxicon-quanping22-fill' : 'xhwxicon-quanping2-fill'}
      />
      <section
        className={styles.left}
        onClick={() => {
          if (window.location.hash.slice(1)) {
            celebrationRef.current.show(parseInt(window.location.hash.slice(1)) || target_count);
          }
        }}
      >
        <Province bg={image_url.province_order_image} autoplay={autoplay} perfId={perfId} />
        <div>
          <Consultant bg={image_url.consultant_order_image} autoplay={autoplay} perfId={perfId} />
          {renderNotice()}
        </div>
      </section>
      <section className={styles.middle}>
        <img className={styles.middleBg} src={image_url.topic_image} />
        <div className={styles.countdown}>{renderCountdown()}</div>
        <ul
          className={styles.target}
          style={{ visibility: show_status === 1 ? 'hidden' : 'visible' }}
        >
          <li>
            <span>{target_count?.toLocaleString()}</span>
            <span>目标科次</span>
          </li>
          <li>
            <span>{product_count?.toLocaleString()}</span>
            <span>签单科次</span>
          </li>
          <li>
            <span>{multiply(+(finish_rate ?? 0), 100)}%</span>
            <span>完成率</span>
          </li>
        </ul>
        <div className={styles.list}>{renderCarouselList()}</div>
      </section>
      <section className={styles.right}>
        <Station bg={image_url.station_order_image} autoplay={autoplay} perfId={perfId} />
      </section>
    </div>
  );
};
