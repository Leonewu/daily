import React from 'react';
import rank1 from './images/rank1.svg';
import rank2 from './images/rank2.svg';
import rank3 from './images/rank3.svg';
import { multiply } from '../../utils/utility';
import { ColumnType } from '../components/CarouselTable/';

export const consultantColumns: ColumnType[] = [
  {
    title: '排名',
    dataIndex: 'rank',
    width: '80px',
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        const svg = {
          '1': rank1,
          '2': rank2,
          '3': rank3,
        }[r.rank];
        return <img src={svg} alt="" style={{ width: 24, height: 24 }} />;
      }
      return (
        <div style={{ width: 24, height: 24, lineHeight: '24px', textAlign: 'center' }}>{t}</div>
      );
    },
  },
  {
    title: '学规师',
    dataIndex: 'consultant_name',
    width: '120px',
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
    width: '150px',
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
    width: '80px',
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
    render(t, r) {
      if ([1, 2, 3].includes(r.rank)) {
        const svg = {
          '1': rank1,
          '2': rank2,
          '3': rank3,
        }[r.rank];
        return <img src={svg} alt="" style={{ width: 24, height: 24 }} />;
      }
      return (
        <div style={{ width: 24, height: 24, lineHeight: '24px', textAlign: 'center' }}>{t}</div>
      );
    },
  },
  {
    title: '省区',
    dataIndex: 'org_name',
    width: '150px',
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
    width: '80px',
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
    width: '80px',
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
    width: '80px',
    render(t, r) {
      const text = `${multiply(+t, 100)}%`;
      if ([1, 2, 3].includes(r.rank)) {
        return <span style={{ color: '#FFE132' }}>{text}</span>;
      }
      return text;
    },
  },
];
