import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'umi';
import moment from 'moment';
import { message } from 'antd';
import { pad, multiply } from '../../utils/utility';
import bg from './images/perf_bg_1920.png';
import { useInterval } from '../hooks/useInterval';
import CarouselTable, { FetchListType } from '../components/CarouselTable';
import styles from './index.less';
import { usePerfData } from './models';
import { consultantColumns, stationColumns } from './columns';

function getCountdown(
  start: number,
): { day: string; hour: string; minute: string; second: string } {
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

export default () => {
  const { overviewData, fetchOverviewData } = usePerfData();
  const perfId = (useParams() as { id: string }).id;
  const [startSeconds, setStartSeconds] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const countdown = useMemo(() => {
    return getCountdown(startSeconds);
  }, [startSeconds]);

  // 倒计时
  const [startCountdown, clearCountdown] = useInterval(() => {
    if (startSeconds <= 0) {
      clearCountdown();
      fetchOverviewData({ performance_show_id: perfId });
      return;
    }
    setStartSeconds(startSeconds - 1);
  }, 1000);

  // 接口轮询
  const [startPoll, clearPoll] = useInterval(
    () => {
      fetchOverviewData({ performance_show_id: perfId })
        .then((res) => {
          if (res?.show_status === 4) {
            // 活动结束
            clearCountdown();
            clearPoll();
            return;
          }
          const now = new Date().getTime();
          const distance = res?.start_time * 1000 - now;
          if (res?.show_status !== 1 || !res?.start_time || distance < 0) {
            clearCountdown();
            return;
          }
          if (res?.start_time !== startTime) {
            // 如果开始时间和本地缓存的不相等，就重新倒计时
            setStartSeconds(Math.floor(distance / 1000));
            startCountdown();
            setStartTime(res?.start_time);
          }
        })
        .catch((err) => {
          if ([7845, 7846].includes(err?.err)) {
            const msg = err.err === 7845 ? err.msg : '获取业绩大屏数据失败';
            message.error(msg);
            clearPoll();
            clearCountdown();
          }
        });
    },
    5000,
    { immediate: true },
  );

  useEffect(() => {
    if (perfId) {
      startPoll();
    }
    return () => {
      clearCountdown();
      clearPoll();
    };
  }, [perfId]);

  const autoplay = useMemo(() => {
    return !!(overviewData.show_status && overviewData.show_status !== 4);
  }, [overviewData.show_status]);

  const renderNotice = () => {
    if (overviewData.show_status === 3) {
      return <p className={styles.notice}>数据正在重新计算中，请稍等</p>;
    }
    if (overviewData.statistic_time) {
      return (
        <p className={styles.notice}>
          数据更新时间：
          {moment(Number(overviewData.statistic_time) * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </p>
      );
    }
    return (
      <p className={styles.notice} style={{ visibility: 'hidden' }}>
        活动未开始
      </p>
    );
  };

  return (
    <div className={styles.preview} style={{ backgroundImage: `url(${overviewData?.image_url || bg})` }}>
      <section className={styles.left}>
        <Province
          style={{ width: '466px', minHeight: '436px' }}
          autoplay={autoplay}
          perfId={perfId}
        />
        <div>
          <Consultant
            style={{ width: '466px', minHeight: '292px' }}
            autoplay={autoplay}
            perfId={perfId}
          />
          {renderNotice()}
        </div>
      </section>
      <section className={styles.middle}>
        {overviewData.show_status === 1 ? (
          <>
            <header>开始倒计时</header>
            <div className={`${styles.countdown} ${countdown.day !== '00' && styles.showDay}`}>
              {countdown.day !== '00' && (
                <>
                  <span>{countdown.day}</span>
                  <span>天</span>
                </>
              )}
              <span>{countdown.hour}</span>
              <span>时</span>
              <span>{countdown.minute}</span>
              <span>分</span>
              <span>{countdown.second}</span>
              <span>秒</span>
            </div>
          </>
        ) : (
          <div className={styles.target}>
            <div>
              <header>签单科次</header>
              <span>{overviewData.product_count?.toLocaleString()}</span>
            </div>
            <div>
              <header>目标科次</header>
              <span>{overviewData.target_count?.toLocaleString()}</span>
            </div>
            <div>
              <header>完成率</header>
              <span>{multiply(+(overviewData.finish_rate ?? 0), 100)}%</span>
            </div>
          </div>
        )}
      </section>
      <section className={styles.right}>
        <Station style={{ width: '466px' }} autoplay={autoplay} perfId={perfId} />
      </section>
    </div>
  );
};

/* 表格 */

const Province: React.FC<{
  style?: React.CSSProperties;
  perfId: string;
  autoplay?: boolean;
}> = React.memo((props) => {
  const { provinceLoading, fetchProvinceData } = usePerfData();
  const { perfId, autoplay, style = {} } = props;
  const pagination = {
    pageSize: 8,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = fetchProvinceData({
      start: (p.current - 1) * p.pageSize,
      length: pagination.pageSize,
      performance_show_id: perfId,
    });
    return res;
  }, []);

  return (
    <CarouselTable
      rowKey="org_id"
      loading={provinceLoading}
      autoplay={autoplay}
      columns={stationColumns}
      pagination={pagination}
      style={style}
      fetchList={fetchList}
    />
  );
});

const Station: React.FC<{
  style?: React.CSSProperties;
  perfId: string;
  autoplay?: boolean;
}> = React.memo((props) => {
  const { stationLoading, fetchStationData } = usePerfData();
  const { perfId, autoplay, style = {} } = props;
  const pagination = {
    pageSize: 20,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = await fetchStationData({
      start: (p.current - 1) * p.pageSize,
      length: pagination.pageSize,
      performance_show_id: perfId,
    });
    return res;
  }, []);

  return (
    <CarouselTable
      rowKey="org_id"
      loading={stationLoading}
      autoplay={autoplay}
      columns={stationColumns}
      pagination={pagination}
      style={style}
      fetchList={fetchList}
    />
  );
});

const Consultant: React.FC<{
  style?: React.CSSProperties;
  perfId: string;
  autoplay?: boolean;
}> = React.memo((props) => {
  const { consultantLoading, fetchConsultantData } = usePerfData();
  const { perfId, autoplay, style = {} } = props;
  const pagination = {
    pageSize: 5,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = await fetchConsultantData({
      start: (p.current - 1) * p.pageSize,
      length: pagination.pageSize,
      performance_show_id: perfId,
    });
    return res;
  }, []);

  return (
    <CarouselTable
      rowKey="consultant_id"
      loading={consultantLoading}
      autoplay={autoplay}
      columns={consultantColumns}
      pagination={pagination}
      fetchList={fetchList}
      style={style}
    />
  );
});
