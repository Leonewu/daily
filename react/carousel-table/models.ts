import { useState, useRef, useMemo } from 'react';
import API from '@/services/new-saleApi/api';
import { message } from 'antd';
import type * as MODEL from '@/services/new-saleModel/model';




/* 业绩大屏预览 */
// const source = new Array(20)
// .fill({
//   rank: 1,
//   org_name: '广东',
//   product_count: 100000,
//   target_count: 200000,
//   finish_rate: '100%',
// })
// .map((r, i) => ({
//   ...r,
//   rank: i + 1,
//   org_name: i === 19 ? '看看打开就打开打开的开导开导东' : '广东',
//   org_id: i,
// }));
export const usePerfData = () => {
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [stationLoading, setStationLoading] = useState(false);
  const [consultantLoading, setConsultantLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<
    Partial<MODEL.ApiV21ExpansionToolboxPerformanceShowOverallStatistics>
  >({});

  const fetchProvinceData = async (
    params: Omit<MODEL.ApiV21ExpansionToolboxPerformanceShowRankOrgBody, 'org_type'>,
  ) => {
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 1000);
    // });
    // return {
    //   list: source.slice(params.start, params.length),
    //   total: source.length,
    // };
    setProvinceLoading(true);
    return API.ApiV21ExpansionToolboxPerformanceShowRankOrg({ ...params, org_type: 1 })
      .then((res) => {
        const data = {
          list: res?.sort_list || [],
          total: res?.total || 0,
        };
        return data;
      })
      .finally(() => {
        setProvinceLoading(false);
      });
  };

  const fetchStationData = async (
    params: Omit<MODEL.ApiV21ExpansionToolboxPerformanceShowRankOrgBody, 'org_type'>,
  ) => {
    setStationLoading(false);
    return API.ApiV21ExpansionToolboxPerformanceShowRankOrg({ ...params, org_type: 2 })
      .then((res) => {
        const data = {
          list: res?.sort_list || [],
          total: res?.total || 0,
        };
        return data;
      })
      .finally(() => {
        setStationLoading(false);
      });
  };

  const fetchConsultantData = async (
    params: MODEL.ApiV21ExpansionToolboxPerformanceShowRankConsultantBody,
  ) => {
    setConsultantLoading(false);
    return API.ApiV21ExpansionToolboxPerformanceShowRankConsultant(params)
      .then((res) => {
        const data = {
          list: res?.sort_list || [],
          total: res?.total || 0,
        };
        return data;
      })
      .finally(() => {
        setConsultantLoading(false);
      });
  };

  const fetchOverviewData = async (
    params: MODEL.ParamsApiV21ExpansionToolboxPerformanceShowOverallStatisticsGET,
  ) => {
    // setOverviewData({
    //   show_status: 1,
    //   start_time: 1622691120,
    // });
    // return {
    //   show_status: 1,
    //   start_time: 1622691120,
    // };
    return API.ApiV21ExpansionToolboxPerformanceShowOverallStatistics(params).then((res) => {
      setOverviewData(res || {});
      return res;
    });
  };
  return {
    provinceLoading,
    stationLoading,
    consultantLoading,
    overviewData,
    fetchProvinceData,
    fetchStationData,
    fetchConsultantData,
    fetchOverviewData,
  };
};

/* 霸屏数据 */
export const useDominateData = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchDominateData: (
    p: MODEL.ApiV21ExpansionSysManagePerformanceShowDominateScreenBody,
  ) => Promise<any[]> = async (params) => {
    setLoading(true);
    try {
      const res = await API.ApiV21ExpansionSysManagePerformanceShowDominateScreen(params);
      // await new Promise((r) => setTimeout(r, 500));
      // const res = new Array(10).fill({
      //   consultant_name: '饭团团团',
      //   consultant_image: 'https://avatars.githubusercontent.com/u/22951514?v=4',
      //   station_name: '广州分站',
      //   num: 1200,
      // });

      setList(res || []);
      setLoading(false);
      return res || [];
    } catch (e) {
      console.error(e);
      setLoading(false);
      return list;
    }
  };
  return {
    list,
    loading,
    fetchDominateData,
  };
};

// type ScrollListRow = {
//   name: string;
//   num: number;
// };

/* 签单记录 */
// export const useScrollList = () => {
//   const list = useRef<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const id = useRef(100);
//   const fetchList: () => Promise<ScrollListRow[]> = async () => {
//     setLoading(true);
//     await new Promise((r) => {
//       setTimeout(r, 1000);
//     });
//     if (id.current < 0) {
//       setLoading(false);
//       return [];
//     }
//     let temp = [
//       { name: 'sdf', num: 12 },
//       // { name: 'sdf', num: 12 },
//       // { name: 'sdf', num: 12 },
//       // { name: 's辅导df', num: 12 },
//       // { name: 's手动df', num: 12 },
//       // { name: 'sd第三代f', num: 12 },
//       // { name: 's阿道夫df', num: 12 },
//       // { name: 's发发发df', num: 12 },
//       // { name: 'sdf', num: 12 },
//       // { name: 'sd订单f', num: 12 },
//       // { name: 'sdf', num: 12 },
//       // { name: 's阿道夫df', num: 12 },
//       // { name: 'sd碍事法师f', num: 12 },
//       // { name: 's沙发df', num: 12 },
//       // { name: 'sasddf', num: 12 },
//     ].map((g) => ({ ...g, name: `${g.name}-${id.current--}`, time_stamp: id.current }));
//     if (id.current === 95) {
//       temp = [
//         // { name: 'sdf', num: 12 },
//         // { name: 'sdf', num: 12 },
//         // { name: 'sdf', num: 12 },
//         { name: 's辅导df', num: 12 },
//         { name: 's手动df', num: 12 },
//         { name: 'sd第三代f', num: 12 },
//         { name: 's阿道夫df', num: 12 },
//         { name: 's发发发df', num: 12 },
//         { name: 'sdf', num: 12 },
//         { name: 'sd订单f', num: 12 },
//         // { name: 'sdf', num: 12 },
//         { name: 's阿道夫df', num: 12 },
//         { name: 'sd碍事法师f', num: 12 },
//         { name: 's沙发df', num: 12 },
//         // { name: 'sasddf', num: 12 },
//       ].map((g) => ({ ...g, name: `${g.name}-${id.current--}`, time_stamp: id.current }));
//     }
//     setLoading(false);
//     return temp;
//   };
//   return {
//     list,
//     loading,
//     fetchList,
//   };
// };

/* 签单记录 */
export const useScrollList = () => {
  const [loading, setLoading] = useState(false);
  const fetchList = async (params: { performance_show_id: string; time_stamp: number }) => {
    // if (loading) return;
    setLoading(true);
    try {
      const res = await API.ApiV21ExpansionSysManagePerformanceShowRecords(params);
      return res || [];
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    fetchList,
  };
};
