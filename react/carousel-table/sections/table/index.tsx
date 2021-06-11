import React, { useCallback } from 'react';
import CarouselTable from '../../components/CarouselTable';
import type { FetchListType } from '../../components/CarouselTable';
import styles from './index.less';
import { usePerfData } from '../../../models';
import { consultantColumns, stationColumns, ProvinceColumns } from './consts';

/* 省区，分站，学规师 滚动表格 */

export const Province: React.FC<{
  perfId: string;
  autoplay?: boolean;
  bg?: string;
}> = React.memo((props) => {
  const { fetchProvinceData } = usePerfData();
  const { perfId, autoplay, bg } = props;
  const pagination = {
    pageSize: 8,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = fetchProvinceData({
      start: (p.current - 1) * p.pageSize,
      length: p.pageSize,
      performance_show_id: perfId,
    });
    return res;
  }, []);

  return (
    <div className={styles.tableWrapper} style={{ width: '466px', height: '536px' }}>
      <img className={styles.tableHeader} src={bg} />
      <CarouselTable
        rowKey="org_id"
        autoplay={autoplay}
        columns={ProvinceColumns}
        pagination={pagination}
        fetchList={fetchList}
        className={styles.table}
      />
    </div>
  );
});

export const Station: React.FC<{
  perfId: string;
  autoplay?: boolean;
  bg?: string;
}> = React.memo((props) => {
  const { fetchStationData } = usePerfData();
  const { perfId, autoplay, bg } = props;
  const pagination = {
    pageSize: 18,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = await fetchStationData({
      start: (p.current - 1) * p.pageSize,
      length: p.pageSize,
      performance_show_id: perfId,
    });
    return res;
  }, []);

  return (
    <div className={styles.tableWrapper} style={{ width: '466px', height: '1016px' }}>
      <img className={styles.tableHeader} src={bg} />
      <CarouselTable
        rowKey="org_id"
        autoplay={autoplay}
        columns={stationColumns}
        pagination={pagination}
        className={styles.table}
        fetchList={fetchList}
      />
    </div>
  );
});

export const Consultant: React.FC<{
  perfId: string;
  autoplay?: boolean;
  bg?: string;
}> = React.memo((props) => {
  const { fetchConsultantData } = usePerfData();
  const { perfId, autoplay, bg } = props;
  const pagination = {
    pageSize: 5,
    current: 1,
  };
  const fetchList: FetchListType = useCallback(async (p) => {
    const res = await fetchConsultantData({
      start: (p.current - 1) * p.pageSize,
      length: p.pageSize,
      performance_show_id: perfId,
    });
    if (res.total >= 10) {
      // 只展示前十条
      res.total = 10;
    }
    return res;
  }, []);

  return (
    <div className={styles.tableWrapper} style={{ width: '466px', height: '396px' }}>
      <img className={styles.tableHeader} src={bg} />
      <CarouselTable
        rowKey="consultant_id"
        autoplay={autoplay}
        columns={consultantColumns}
        pagination={pagination}
        fetchList={fetchList}
        className={styles.table}
      />
    </div>
  );
});
