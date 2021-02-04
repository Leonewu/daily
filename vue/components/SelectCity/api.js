import axios from 'axios'
import data from './district.json'


export function api_getSortLocation(params) {
  // return axios.get('', { params })
}
export function api_searchLocation(params, config) {
  return newPromise((resolve) => {
    setTimeout(() => {
      const list = [
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '广州',
          city_code: '440100',
          district: '',
          district_code: '',
        },

        {
          province: '广东',
          province_code: '440000',
          city: '珠海',
          city_code: '440400',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '珠海',
          city_code: '440400',
          district: '',
          district_code: '',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '珠海',
          city_code: '440400',
          district: '香洲区',
          district_code: '440402',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '珠海',
          city_code: '440400',
          district: '香洲区',
          district_code: '440402',
        },
        {
          province: '广东',
          province_code: '440000',
          city: '珠海',
          city_code: '440400',
          district: '香洲区澳门大学横琴校区(由澳门特别行政区实施管辖)',
          district_code: '440499',
        }
      ]
      resolve({ data: list })
    })
  })
  // return axios.get('', { params, ...config })
}
export function api_getRecommendLocation(params) {
  // return axios.get('', { params })
}