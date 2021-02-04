import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Carousel } from 'antd';
import { useInterval } from '../hooks/useInterval';
import styles from './index.less';

/* XXX table-layout: fixed 即不用默认布局算法渲染（列宽会取内容宽度最大的宽度），默认为 auto */
/**
 * @description 轮播效果的翻页表格
 * @description react-slick 没有异步滚动的接口
 * @question 为什么不仿照 antd table 使用 props.dataSource 做为渲染数据源？
    因为 props.dataSource 变化引起的更新无法控制，而轮播的滚动是有一定时间的
    这种情况下使得动画和数据更新无法完美地控制顺序
    需要兼顾表格的翻页数据的实时准确性和滚动体验
  * @notice 默认会调用 fetchList 初始化第一页数据
*/

export type ColumnType = {
  title?: string;
  dataIndex?: string;
  render?: (text: string | number, row: any, index: number) => React.ReactNode;
  width?: string;
  key?: React.Key;
};

export type FetchListType = (
  pagination: Required<PaginationType>,
) => Promise<{
  total: number;
  list: any[];
}>;

export type PaginationType = {
  pageSize?: number;
  current?: number;
};
export interface TablePropsType {
  pagination?: PaginationType;
  columns: ColumnType[];
  style?: React.CSSProperties;
  loading?: boolean;
  rowKey?: React.Key | ((row: any, index: number) => React.Key);
  /** 获取数据的 Promise，需要返回 list 和 total */
  fetchList?: FetchListType;
  /** 是否自动播放，自动播放时，手动点击切换页码会禁用 */
  autoplay?: boolean;
}

const CarouselTable: React.FC<TablePropsType> = (props) => {
  const { columns, pagination: propsPagination, fetchList, autoplay, rowKey, style = {} } = props;
  const defaultPagination = {
    pageSize: 10,
    total: 0,
    current: 1,
  };
  const pagination = { ...defaultPagination, ...propsPagination };
  const [current, setCurrent] = useState(pagination.current);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const carouselRef = useRef<any>(null);
  const totalPage = useMemo(() => {
    return Math.ceil((total || list.length) / pagination.pageSize);
  }, [total, pagination.pageSize, list]);

  const srollTo = (page: number) => {
    // 滚动到第几页 page 从 1 开始
    // FIXME: 默认第二页时，手动点击第一页动画效果不流畅
    setTimeout(() => {
      setCurrent(page);
      if (current === totalPage && page === 1) {
        carouselRef.current?.next();
      } else {
        carouselRef.current?.goTo(page - 1);
      }
    }, 400);
  };

  const fetchAndGoto = async (page: number) => {
    if (page > totalPage) return;
    // 如果不是自动播放，页码一样就不需要请求
    // 如果是自动播放，页码一样时要请求数据，因为要实时刷新本页数据
    if (!autoplay && current === page) return;
    try {
      const res = await fetchList?.({ ...pagination, current: page });
      const tempList = [...list];
      const newList = res?.list || [];
      tempList.splice((page - 1) * pagination.pageSize, pagination.pageSize, ...newList);
      setList(tempList);
      setTotal(res!.total || 0);
      srollTo(page);
    } catch (e) {
      console.error(e);
    }
  };

  const init = () => {
    // 默认会调用 fetchList 初始化首屏数据
    fetchList?.(pagination).then((res) => {
      const tempList = Array.from({ length: res?.total });
      const newList = res?.list || [];
      tempList.splice(
        (pagination.current - 1) * pagination.pageSize,
        pagination.pageSize,
        ...newList,
      );
      setList(tempList);
      setTotal(res?.total || 0);
      srollTo(pagination.current);
    });
  };

  const [start, clear] = useInterval(() => {
    if (current + 1 <= totalPage) {
      fetchAndGoto(current + 1);
    } else {
      fetchAndGoto(1);
    }
  }, 5000);

  useEffect(() => {
    // TODO 兼容异步 init 的情况
    init();
  }, []);

  useEffect(() => {
    // 自动播放
    if (autoplay) {
      start();
    } else {
      clear();
    }
    return clear;
  }, [autoplay]);

  const renderTable = (p: number) => {
    const renderList = list.slice((p - 1) * pagination.pageSize, p * pagination.pageSize);
    return (
      <table className={styles.mainTable}>
        <colgroup>
          {columns.map((column, index) => {
            const columnKey = column.key ?? column.dataIndex ?? index;
            const colStyle: React.CSSProperties = {};
            if (column.width) {
              colStyle.width = column.width;
            }
            return <col key={columnKey} style={colStyle} />;
          })}
        </colgroup>
        <tbody>
          {renderList.map((row, rowIndex) => {
            // 这里的 row 可能为 undefined
            const tds = columns.map((column, columnIndex) => {
              const columnKey = column.key ?? column.dataIndex ?? columnIndex;
              const text = column.dataIndex && row ? row[column.dataIndex] : '';
              const content = column.render ? column.render?.(text, row || {}, rowIndex) : text;
              let title = text;
              if (
                ['[object String]', '[object Number]'].includes(
                  Object.prototype.toString.call(content),
                )
              ) {
                title = content;
              }
              return (
                <td
                  key={columnKey}
                  style={{
                    height: 48,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={title}
                >
                  {content}
                </td>
              );
            });
            let key;
            // 没有传 rowKey 默认用 index
            if (typeof rowKey === 'function') {
              key = row ? rowKey(row, rowIndex) : rowIndex;
            } else if (typeof rowKey === 'string') {
              key = row ? row[rowKey] : rowIndex;
            } else {
              key = rowIndex;
            }
            return <tr key={key}>{tds}</tr>;
          })}
        </tbody>
      </table>
    );
  };

  const renderCarousel = () => {
    const items = Array.from({ length: totalPage }).map((item, i) => {
      // eslint-disable-next-line react/no-array-index-key
      return <div key={i}>{renderTable(i + 1)}</div>;
    });
    return (
      <>
        <Carousel ref={carouselRef} dots={false}>
          {items}
        </Carousel>
        <ul className={styles.dots}>
          {Array.from({ length: totalPage }).map((dot, i) => {
            return (
              <li
                className={current === i + 1 ? styles.active : ''}
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                onClick={() => {
                  if (autoplay) return;
                  fetchAndGoto(i + 1);
                }}
              >
                <i />
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className={styles.carouselTable} style={style}>
        <table className={styles.headTable}>
          <colgroup>
            {columns.map((column, columnIndex) => {
              const columnKey = column.key ?? column.dataIndex ?? columnIndex;
              const colStyle: React.CSSProperties = {};
              if (column.width) {
                colStyle.width = column.width;
              }
              return <col key={columnKey} style={colStyle} />;
            })}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column, columnIndex) => {
                const columnKey = column.key ?? column.dataIndex ?? columnIndex;
                return <th key={columnKey}>{column.title}</th>;
              })}
            </tr>
          </thead>
        </table>
        {renderCarousel()}
      </div>
    </div>
  );
};

export default React.memo(CarouselTable);
