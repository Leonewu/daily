<template>
  <div :class="$style.wrapper">
    <header :class="{ [$style.sticky]: showSearch }">
      <i :class="`xiaoicon ${$style.arrow}`" @click="goBack">&#xe653;</i>
      <div :class="{ [$style.input]: true, [$style.spinner]: isSearching }">
        <input 
          ref="input"
          type="text"
          placeholder="城市/地区" 
          @focus="onFocus"
          @input="onInput"
          @compositionstart="onCompositionstart" 
          @compositionend="onCompositionend" 
          @blur="onBlur"
          @focusin="onFocusin"
          @focusout="onFocusout"
          v-model="searchText"
        />
        <i :class="`xiaoicon ${$style.clear}`" v-show="searchText.length" @mousedown.prevent="onClear">&#xe60d;</i>
      </div>
    </header>
    <template v-if="!showSearch">
      <ul :class="$style.left">
        <li
          v-if="recommendCityList.length"
          key="recommend" 
          @click="selectProvince({ code: 0 })"
          :class="{[$style.activeProvince]: selectedProvince.code === 0}"
        >推荐</li>
        <li 
          :key="item.code" 
          v-for="item in provinceList" 
          @click="selectProvince(item)"
          :class="{[$style.activeProvince]: selectedProvince.code === item.code}"
        >{{item.name}}</li>
      </ul>
      <section :class="$style.right">
        <!-- 城市已选，需要选择区 -->
        <template v-if="selectedCity && selectedCity.has_child">
          <div :class="$style.tag">
            <span>{{selectedCity.name}}</span>
            <i @click="onCityCancel" class="xiaoicon">&#xe759;</i>
          </div>
          <ul :class="$style.list">
            <li 
              :class="{[$style.activeCity]: selectedDistrict.code === item.code}"
              :key="item.code"
              v-for="item in districtList"
              @click="selectDistrict(item)"
            ><span>{{item.name}}</span></li>
          </ul>
        </template>
        <!-- 推荐 -->
        <template v-else-if="selectedProvince.code === 0">
          <span :class="$style.tip">你的生源地可能为</span>
          <ul :class="$style.list">
            <li 
              :key="item.code"
              v-for="item in recommendCityList"
              @click="selectRecommendCity(item)"
            ><span>{{item.city}}</span></li>
          </ul>
        </template>
        <!-- 城市列表 -->   
        <ul v-else :class="$style.list">
          <li 
            :class="{[$style.activeCity]: selectedCity.code === item.code}"
            :key="item.code"
            v-for="item in cityList"
            @click="selectCity(item)"
          ><span>{{item.name}}</span></li>
        </ul>
      </section>
    </template>
    <template v-else>
      <ul :class="$style.searchResult" ref="result" @scroll="onScroll" @touchstart="onTouchstart">
        <li 
          v-for="(item, index) in searchList"
          :key="index"
          @click="selectSearchResult(item)"
        >
          <template v-if="item.district">
            <span>{{item.district || item.city}}</span>
            <span>{{item.city}}</span>
            <span>{{item.province}}</span>
          </template>
          <template v-else-if="item.city">
            <span>{{item.city}}</span>
            <span>{{item.province}}</span>            
          </template>
          <template v-else>
            <span>{{item.province}}</span>            
          </template>
        </li>
        <li :class="$style.loading" v-show="isSearching">
          <i class="xiaoicon">&#xe756;</i>
          <span>正在加载中...</span>
        </li>
      </ul>
    </template>
  </div>
</template>


<script>

function throttle(fn, delay = 1000) {
  let loading = false
  return function(...args) {
    if (!loading) {
      loading = true
      fn.call(this, ...args)
      setTimeout(() => {
        loading = false
      }, delay)
    }
  }
}

import { api_getSortLocation, api_searchLocation, api_getRecommendLocation } from 'api/location'
import axios from 'axios'
const isIOS = /i(Pad|Phone|Pod)/i.test(navigator.userAgent.toLowerCase())
// const isAndroid = /android/i.test(navigator.userAgent.toLowerCase())

/** 选择学员生源地 */
export default {
  data() {
    return {
      provinceList: [],
      cityList: [],
      districtList: [],
      selectedProvince: {},
      selectedCity: {},
      selectedDistrict: {},
      // 可能生源地
      recommendCityList: [],
      showSearch: false,
      searchList: [],
      debounceTimer: null,
      inputLock: false,
      isSearching: false,
      searchText: '',
      cancel: undefined,
      isIOSKeyboardPop: false,
      lastScrollTop: 0,
      hasNextPage: true,
      pageSize: 20
    }
  },
  methods: {
    goBack() {
      if (this.showSearch) {
        this.showSearch = false
        return
      }
      this.$router.go(-1)
    },
    selectProvince(item) {
      if (item.code === this.selectedProvince.code) return
      this.selectedProvince = item
      this.selectedCity = {}
      this.selectedDistrict = {}
      this.cityList = []
      this.districtList = []
      if (item.code === 0) return
      this.getCityList()
    },
    selectCity(item) {
      this.selectedCity = item
      if (item.has_child) {
        this.getDistrictList()
      } else {
        this.onSave()
      }
    },
    selectDistrict(item) {
      if (item.code === this.selectedDistrict.code) return
      this.selectedDistrict = item
      this.onSave()
    },
    onSave() {
      const selected = {
        province_name: this.selectedProvince.name,
        province: this.selectedProvince.code,
        city_name: this.selectedCity.name,
        city: this.selectedCity.code,
        district_name: this.selectedDistrict.name,
        district: this.selectedDistrict.code,
      }
      this.$emit('select', selected)
      this.$router.go(-1)
    },
    onCityCancel() {
      this.selectedCity = {}
      this.selectedDistrict = {}
      this.districtList = []
    },
    selectRecommendCity(item) {
      // 选择推荐城市
      this.selectedProvince = this.provinceList.find(province => province.code === item.province_code) || {}
      if (this.selectedProvince.code) {
        this.getCityList().then(() => {
          this.selectedCity = this.cityList.find(city => city.code === item.city_code) || {}
          if (this.selectedCity.code) {
            if (this.selectedCity.has_child) {
              this.getDistrictList()
            } else {
              this.onSave()
            }
          }
        })
      }
    },
    selectSearchResult(item) {
      // 搜索后选择
      this.selectedProvince = this.provinceList.find(province => province.code === item.province_code) || {}
      this.getCityList().then(() => {
        this.selectedCity = this.cityList.find(city => city.code === item.city_code) || {}
        if (this.selectedCity.code) {
          if (this.selectedCity.has_child) {
            this.getDistrictList().then(() => {
              this.selectedDistrict = this.districtList.find(district => district.code === item.district_code) || {}
              if (this.selectedDistrict.code) {
                this.onSave()
              }
            })
          } else {
            this.onSave()
          }
          this.$nextTick(() => {
            this.showSearch = false
          })
        } else {
          this.showSearch = false
        }
      })
    },
    getProvinceList() {
      return api_getSortLocation().then(res => {
        if (res.data && res.data.list) {
          this.provinceList = res.data.list.map(item => {
            const name = item.name.replace(/(市|省|特别行政区|维吾尔自治区|壮族自治区|回族自治区|自治区)$/, '')
            return {
              ...item, name
            }
          })
        }
      })
    },
    getCityList() {
      return api_getSortLocation({ code: this.selectedProvince.code }).then(res => {
        this.cityList = (res.data && res.data.list) ? res.data.list : []
      }).catch(() => {
        this.cityList = []
      })
    },
    getDistrictList() {
      return api_getSortLocation({ code: this.selectedCity.code }).then(res => {
        this.districtList = (res.data && res.data.list) ? res.data.list : []
      }).catch(() => {
        this.districtList = []
      })
    },
    onTouchstart() {
      // IOS 在弹出键盘的时候，搜索完，键盘还没有收起
      // 在没有收起的状态下，进行滚动，会很难滚动
      // 因为 IOS 键盘弹出时，会有两个滚动条
      // 一个是页面本身的滚动条，一个是列表内部的滚动条
      // 处理方法：开始滚了就失焦
      this.$refs.input.blur()
    },
    onInput(e) {
      // inputLock 输入中文时，首先会填充英文字母，空格之后才会显示中文
      // 填充英文字母的过程中也会触发 input 事件
      if (this.inputLock) return
      this.onSearch(e.target.value)
    },
    onCompositionstart() {
      // 输入中文开始
      this.inputLock = true
    },
    onCompositionend(e) {
      // 输入中文结束
      this.inputLock = false
      this.onSearch(e.target.value)
    },
    onFocus() {
      this.showSearch = true
    },
    onBlur() {
      // input 输入中，此时键盘弹出，输入完毕，滑动搜索结果列表或者点击 IOS 键盘上的完成按钮
      // 这种情况下不需要隐藏搜索列表
      if (this.isIOSKeyboardPop) {
        return
      }
      setTimeout(() => {
        this.showSearch = false
      }, 0)
    },
    onClear() {
      this.searchText = ''
      this.onSearch('')
    },
    onSearch(name) {
      this.debounceTimer && clearTimeout(this.debounceTimer)
      if (name === '') {
        if (this.isSearching && this.cancel) {
          this.cancel()
          this.cancel = undefined
        }
        this.isSearching = false
        this.searchList = []
        return
      }
      this.debounceTimer = setTimeout(() => {
        if (this.isSearching && this.cancel) {
          this.cancel()
          this.cancel = undefined
        }
        this.isSearching = true
        api_searchLocation({ search_key: name }, {
          cancelToken: new axios.CancelToken(c => {
            this.cancel = c
          })
        }).then(res => {
          this.searchList = res.data || []
          if (res.data && res.data.length < this.pageSize) {
            this.hasNextPage = false
          } else {
            this.hasNextPage = true
          }
          this.$refs.result && this.$refs.result.scrollTo(0, 0)
        }).catch((err) => {
          if (axios.isCancel(err)) {
            console.log('哈哈哈哈')
          }
        }).finally(() => {
          this.isSearching = false
        })
      }, 500)
    },
    onFocusout() {
      // IOS 软键盘收起的事件
      if (isIOS) {
        this.isIOSKeyboardPop = false
      }
    },
    onFocusin() {
      // IOS 软键盘弹出的事件
      if (isIOS) {
        this.isIOSKeyboardPop = true
      }
    },
    onScroll: function(e) {
      // 由于要判断方向，这里不能加 throttle
      const { scrollHeight, clientHeight, scrollTop } = e.target
      if (scrollHeight - clientHeight - scrollTop < 100 && scrollTop > this.lastScrollTop) {
        console.log('fetch')
        this.scrollFetch()
      }
      this.lastScrollTop = scrollTop
    },
    scrollFetch: throttle(function() {
      // 滚动加载
      if (this.isSearching && this.cancel) {
        this.cancel()
        this.cancel = undefined
        this.isSearching = false
      }
      if (this.searchText === '') {
        this.searchList = []
        return
      }
      if (!this.hasNextPage) return
      this.isSearching = true
      const params = { 
        search_key: this.searchText,
        length: this.pageSize,
        index_id: this.searchList[this.searchList.length - 1].index_id
      }
      api_searchLocation(params, {
        cancelToken: new axios.CancelToken(c => {
          this.cancel = c
        })
      }).then(res => {
        this.searchList = (this.searchList.concat(res.data || []))
        if (res.data && res.data.length < this.pageSize) {
          this.hasNextPage = false
        } else {
          this.hasNextPage = true
        }
      }).catch((err) => {
        if (axios.isCancel(err)) {
          console.log('哈哈哈哈')
        }
      }).finally(() => {
        this.isSearching = false
      })
    }, 500)
  },
  created() {
    this.getProvinceList()
    api_getRecommendLocation().then(res => {
      if (res.data) {
        this.recommendCityList = (res.data.re_location || []).map(item => {
          if (item.province_code === item.city_code) {
            return {
              ...item, city_code: item.district_code, city: item.district 
            }
          }
          return item
        })
        if (res.data.re_location) {
          this.selectProvince({ code: 0 })
        }
      }
    }).catch(() => {})
  },
  destroyed() {
  }
}
</script>

<style lang="scss" module>
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background: #fff;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  z-index: 9999;
  & > header {
    width: 100%;
    height: 1.17333333rem /* 88/75 */;
    padding: 0 .42666667rem /* 32/75 */;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    &.sticky {
      position: sticky;
      top: 0;
    }
  }
}
.arrow {
  font-size: .42666667rem /* 32/75 */;
  color: #363636;
}
/* 输入框的转圈圈 */
@keyframes spin {
  0% {
    transform: translateY(-50%) rotateZ(0deg);
  }
  100% {
    transform: translateY(-50%) rotateZ(360deg);
  }
}
/* 加载中的转圈圈 */
@keyframes spin2 {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
.input {
  position:relative;
  margin-left: .21333333rem /* 16/75 */;
  flex: 1;
  & > input {
    display: block;
    width: 100%;
    height: .85333333rem /* 64/75 */;
    padding-left: .85333333rem /* 64/75 */;
    background: #f7f8fa;
    border-radius: .48rem /* 36/75 */;
    border: 0;
    outline: 0;
    font-size: .37333333rem /* 28/75 */;
    color: #464646;
    caret-color: #00C55D;
    &::placeholder {
      color: #ccc;
      font-weight: 400;
    }
  }
  &::before {
    font-family: 'xiaoicon';
    display: block;
    position: absolute;
    font-size: .42666667rem /* 32/75 */;
    left: .32rem /* 24/75 */;
    top: 50%;
    transform: translateY(-50%);
    content: '\e69c';
    color: #ccc;
  }
  &.spinner::before {
    font-family: 'xiaoicon';
    display: block;
    position: absolute;
    font-size: .42666667rem /* 32/75 */;
    left: .32rem /* 24/75 */;
    top: 50%;
    transform: translateY(-50%);
    content: '\e756';
    color: #ccc;
    animation: spin 2s linear infinite;
  }
}
.clear {
  font-size: .34666667rem /* 26/75 */;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: .2rem /* 15/75 */;
  color: #ccc;
  &:active {
    color: #8a8a8a;
  }
}
.searchResult {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 1.17333333rem);
  max-height: calc(100% - 1.17333333rem);
  overflow-y: scroll;
  padding: 0 .4rem /* 30/75 */;
  background: #fff;
  & > li {
    flex-shrink: 0;
    width: 100%;
    padding: .4rem /* 30/75 */ 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    font-size: .32rem /* 24/75 */;
    color: #8a8a8a;
    border-bottom: 1px solid #ebebeb;
    & > span:first-child {
      width: 100%;
      font-size: .37333333rem /* 28/75 */;
      color: #464646;
      margin-bottom: .10666667rem /* 8/75 */;
    }
    & > span:nth-child(2) {
      margin-right: .16rem /* 12/75 */
    }
  }
  & > .loading {
    border: 0;
    justify-content: center;
    color: #ccc;
    & > i {
      height: .42666667rem /* 32/75 */;
      width: .42666667rem /* 32/75 */;
      line-height: .42666667rem /* 32/75 */;
      text-align: center;
      font-size: .37333333rem /* 28/75 */;
      font-family: 'xiaoicon';
      color: #ccc;
      animation: spin2 2s linear infinite;
    }
    & > span {
      margin-left: 2px;
    }
  }
}
.left {
  width: 1.70666667rem /* 128/75 */;
  max-height: calc(100% - 1.17333333rem /* 88/75 */);
  overflow-y: scroll;
  color: #8a8a8a;
  background: #f7f7f8;
  font-size: .37333333rem /* 28/75 */;
  & > li {
    position: relative;
    padding: .42666667rem /* 32/75 */ 0 .45333333rem /* 34/75 */ .32rem /* 24/75 */;
    font-weight: 500;
    &.activeProvince {
      background: #fff;
      color: #00C55D;
      &::before {
        display: block;
        content: '';
        width: .10666667rem /* 8/75 */;
        height: .64rem /* 48/75 */;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 0 .05333333rem /* 4/75 */ .05333333rem /* 4/75 */ 0;
        background: #00C55D;
      }
    }
  }
}
.right {
  flex: 1;
  max-height: calc(100% - 1.17333333rem /* 88/75 */);
  overflow-y: scroll;
  padding: .45333333rem /* 34/75 */ .33333333rem /* 25/75 */ 0;
}
.tag {
  display: inline-block;
  font-size: .34666667rem /* 26/75 */;
  color: #00C55D;
  background: #E5F9EE;
  padding: .16rem /* 12/75 */;
  border-radius: .05333333rem /* 4/75 */;
  margin-bottom: .32rem /* 24/75 */;
  & > i {
    margin-left: .16rem /* 12/75 */;
    font-size: .32rem /* 24/75 */;
  }
}
.tip {
  display: inline-block;
  color: #464646;
  font-size: .37333333rem /* 28/75 */;
  margin-bottom: .32rem /* 24/75 */;
}
.list {
  overflow-y: scroll;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  & > li {
    width: 2.4rem /* 180/75 */;
    height: 1.06666667rem /* 80/75 */;
    margin-bottom: .32rem /* 24/75 */;
    background: #FAFAFA;
    border-radius: .53333333rem /* 40/75 */;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    color: #464646;
    font-weight: 400;
    font-size: .34666667rem /* 26/75 */;
    &:nth-child(3n - 1) {
      margin: 0 calc(50% - 3.6rem);
    }
    & > span {
      max-width: 1.73333333rem /* 130/75 */;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /*! autoprefixer: ignore next */
      -webkit-box-orient: vertical;
    }
    &.activeCity {
      color: #fff;
      background: #00C55D;
    }
  }
}
</style>