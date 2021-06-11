import React from 'react';
import rank1 from '@/assets/sale/rank1.svg';
import rank2 from '@/assets/sale/rank2.svg';
import rank3 from '@/assets/sale/rank3.svg';
import { multiply } from '@/utils/utils';
import type { ColumnType } from '../../components/CarouselTable';

export const consultantColumns: ColumnType[] = [
  {
    title: '排名',
    dataIndex: 'rank',
    align: 'center',
    width: '56px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        const svg = {
          '1': rank1,
          '2': rank2,
          '3': rank3,
        }[r.rank];
        return <img src={svg} alt="" style={{ width: 24, height: 24, display: 'inline-block' }} />;
      }
      return t;
    },
  },
  {
    title: '学规师',
    dataIndex: 'consultant_name',
    width: '148px',
    align: 'left',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{t || '--'}</span>;
      }
      return t || '--';
    },
  },
  {
    title: '分站',
    dataIndex: 'station_name',
    width: '138px',
    align: 'left',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{t || '--'}</span>;
      }
      return t || '--';
    },
  },
  {
    title: '签单科次',
    dataIndex: 'product_count',
    width: '100px',
    align: 'right',
    render(t, r) {
      const text = t ?? '--';
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
];

export const stationColumns: ColumnType[] = [
  {
    title: '排名',
    dataIndex: 'rank',
    align: 'center',
    width: '56px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        const svg = {
          '1': rank1,
          '2': rank2,
          '3': rank3,
        }[r.rank];
        return <img src={svg} alt="" style={{ width: 24, height: 24, display: 'inline-block' }} />;
      }
      return t;
    },
  },
  {
    title: '分站',
    dataIndex: 'org_name',
    align: 'left',
    width: '114px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{t || '--'}</span>;
      }
      return t || '--';
    },
  },
  {
    title: '签单科次',
    dataIndex: 'product_count',
    width: '92px',
    align: 'right',
    render(t, r) {
      const text = t ?? '--';
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
  {
    title: '目标科次',
    dataIndex: 'target_count',
    align: 'right',
    width: '88px',
    render(t, r) {
      const text = t ?? '--';
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
  {
    title: '完成率',
    dataIndex: 'finish_rate',
    align: 'right',
    width: '90px',
    render(t, r) {
      const text = `${multiply(+t, 100)}%`;
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
];

export const ProvinceColumns: ColumnType[] = [
  {
    title: '排名',
    dataIndex: 'rank',
    align: 'center',
    width: '56px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        const svg = {
          '1': rank1,
          '2': rank2,
          '3': rank3,
        }[r.rank];
        return <img src={svg} alt="" style={{ width: 24, height: 24, display: 'inline-block' }} />;
      }
      return t;
    },
  },
  {
    title: '省区',
    dataIndex: 'org_name',
    align: 'left',
    width: '114px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{t || '--'}</span>;
      }
      return t || '--';
    },
  },
  {
    title: '签单科次',
    dataIndex: 'product_count',
    align: 'right',
    width: '92px',
    render(t, r) {
      const text = t ?? '--';
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
  {
    title: '目标科次',
    dataIndex: 'target_count',
    align: 'right',
    width: '88px',
    render(t, r) {
      const text = t ?? '--';
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
  {
    title: '完成率',
    dataIndex: 'finish_rate',
    align: 'right',
    width: '90px',
    render(t, r) {
      const text = `${multiply(+t, 100)}%`;
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
];
