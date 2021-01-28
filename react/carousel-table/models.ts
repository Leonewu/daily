import { useState } from 'react';


/* 业绩大屏预览 */
const source = new Array(20)
.fill({
  rank: 1,
  org_name: '广东',
  product_count: 100000,
  target_count: 200000,
  finish_rate: '100%',
})
.map((r, i) => ({
  ...r,
  rank: i + 1,
  org_name: i === 19 ? '看看打开就打开打开的开导开导东' : '广东',
  org_id: i,
}));

const now = new Date().getTime();

export const usePerfData = () => {
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [stationLoading, setStationLoading] = useState(false);
  const [consultantLoading, setConsultantLoading] = useState(false);
  const [overviewData, setOverviewData] = useState<any>({});

  const fetchProvinceData = async (params: any) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      list: source.slice(params.start, params.length),
      total: source.length,
    };
  };

  const fetchStationData = async (params: any) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      list: source.slice(params.start, params.length),
      total: source.length,
    };
  };

  const fetchConsultantData = async (params: any) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      list: source.slice(params.start, params.length),
      total: source.length,
    };
  };

  const fetchOverviewData = async (params: any) => {
    const r = {
      finish_rate: 0,
      image_url: "",
      product_count: 0,
      show_status: 1,
      // start_time: 1653360776,
      start_time: Math.floor(now / 1000) + (24 * 3600),
      statistic_time: 0,
      target_count: 2,
    }
    setOverviewData(r);
    return r;
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
