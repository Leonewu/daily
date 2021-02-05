import axios from 'axios'
import data from './district.json'

const provinceList = Object.keys(data).
  filter(code => code.includes('0000')).
  map(code => {
    return {
      code,
      // 省区肯定有下一级
      has_child: true,
      name: data[code]
    }
  })

const getCityList = (code) => {
  // ￥#%￥#！@乱写一通
  let reg = new RegExp()
  let mode = ''
  let mainCode = ''
  if (code.lastIndexOf('0000') === 2) {
    mode = 'city'
    mainCode = code.replace(/(\d{2})(0000)/, '$1')
    reg = new RegExp(`${mainCode}\\d{2}00`)
    if (!Object.keys(data).some(c => reg.test(c) && c !== code)) {
      // 北京市等直辖市
      mode = 'district'
      reg = new RegExp(`${mainCode}\\d{4}`)
    }
  } else if (code.lastIndexOf('00') === 4) {
    mode = 'district'
    mainCode = code.replace(/(\d{4})(00)/, '$1')
    reg = new RegExp(`${mainCode}\\d{2}`)
  } else {
    return []
  }
  if (mode === 'city') {
    // 找省区下的所有城市，包括直辖县
    const cities = Object.keys(data).filter(c => reg.test(c) && c !== code).map(c => {
      return {
        code: c,
        // 00 结束的都是有下一级的
        has_child: true,
        name: data[c]
      }
    })
    // 直辖区/县
    const districts = []
    Object.keys(data).filter(c => c !== code && new RegExp(`${mainCode}\\d{4}`).test(c)).forEach(c => {
      if (c.lastIndexOf('00') === 4) return
      const parentCode = c.replace(/\d{2}$/, '00')
      if (!data[parentCode]) {
        districts.push({
          code: c,
          has_child: false,
          name: data[c]
        })
      }
    })
    return [...cities, ...districts]
  }
  return Object.keys(data).filter(c => reg.test(c) && c !== code).map(c => {
    let has_child = false
    return {
      code: c,
      has_child,
      name: data[c]
    }
  })
}

export async function api_getSortLocation(params) {
  // return axios.get('', { params })
  await new Promise(r => {
    setTimeout(r, 1000)
  })
  if (!params.code) {
    return { data: { list: provinceList } }
  }
  return { data: { list: getCityList(params.code) } }
}
export async function api_searchLocation(params, config) {
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
  return { data: list }
  // return axios.get('', { params, ...config })
}
export async function api_getRecommendLocation(params) {
  // return axios.get('', { params })
  return []
}