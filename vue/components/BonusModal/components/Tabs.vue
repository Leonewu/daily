<template>
  <div :class="$style.tabWrapper">
    <div :style="bgStyle.leftStyle" :class="[$style.tabBg, $style.ltr]" />
    <div :style="bgStyle.rightStyle" :class="[$style.tabBg, $style.rtl]" />
    <ul :class="$style.tab">
      <li 
        v-for="(tab) in tabs" 
        :key="tab.key" 
        :class="{ [$style.active]: value === tab.key }"
        @click="$emit('change', tab.key, tab)"
      >{{ tab.value }}</li>
    </ul>
  </div>
</template>

<script>

export default {
  model: {
    props: 'value',
    event: 'change'
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    bgStyle() {
      // 渐变背景稍微复杂，需要 js 控制
      const leftStyle = {}
      const rightStyle = {}
      const tabIndex = this.tabs.findIndex(tab => tab.key === this.value)
      if (tabIndex > -1) {
        const unit = `100% / ${this.tabs.length}`
        if (tabIndex === 0) {
          // 第一个
          leftStyle.width = `calc((${unit}) * ${tabIndex + 1})`
        } else {
          leftStyle.width = `calc((${unit}) * ${tabIndex})`
        }
        if (tabIndex === this.tabs.length - 1) {
          // 最后一个
          rightStyle.width = `calc((${unit}) * ${this.tabs.length - tabIndex})`
        } else {
          rightStyle.width = `calc((${unit}) * ${this.tabs.length - tabIndex - 1})`
        }
      }
      return {
        leftStyle,
        rightStyle
      }
    },
  },
  methods: {
  
  },
  created() {

  }
}
</script>

<style lang="scss" module>
.tabWrapper {
  position: relative;
}
.tabBg {
  position: absolute;
  width: 100%;
  height: 100%;
  height: .88rem /* 66/75 */;
  bottom: 0;
  // 背景由两部分组成
  &.ltr {
    left: 0;
    border-radius: .32rem /* 24/75 */ 0px 0px 0px;
    background: linear-gradient(90deg, #FFFFFF 0%, #FFE4E0 100%);
  }
  &.rtl {
    right: 0;
    border-radius: 0px .32rem /* 24/75 */ 0px 0px;
    background: linear-gradient(270deg, #FFFFFF 0%, #FFE4E0 100%);
  }
}
.tab {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  list-style: none;
  position: relative;
  & > li {
    flex: 1;
    width: 4.82666667rem /* 362/75 */;
    height: .88rem /* 66/75 */;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .37333333rem /* 28/75 */;
    font-weight: 400;
    color: #5A5A5A;
    position: relative;
    z-index: 1;
  }
  & > li:first-child {
    border-radius: .32rem /* 24/75 */ 0px 0px 0px;
    background: transparent;
  }
  & > li:not(:first-child):not(:last-child) {
    &::before {
      content: '';
      position: absolute;
      width: 2px;
      height: .42666667rem /* 32/75 */;
      background: #FFE4E0;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &::after {
      content: '';
      position: absolute;
      width: 2px;
      height: .42666667rem /* 32/75 */;
      background: #FFE4E0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  & > li:last-child {
    border-radius: 0px .32rem /* 24/75 */ 0px 0px;
    background: transparent;
  }
  & > li:first-child.active {
    width: 4.74666667rem /* 356/75 */;
    font-size: .42666667rem /* 32/75 */;
    font-weight: 500;
    height: 1.06666667rem /* 80/75 */;
    padding-top: .05333333rem /* 4/75 */;
    background: transparent;
    color: #282828;
    background: #fff;
    z-index: 2;
    &::after {
      content: '';
      width: 50%;
      height: 100%;
      background: #fff;
      position: absolute;
      right: -.56rem /* 42/75 */;
      bottom: 0;
      z-index: -2;
      border-radius: 0 .42666667rem /* 32/75 */ 0 0;
      transform-origin: 0 100%;
      transform: skew(10deg);
      box-shadow: 0.16rem /* 12/75 */ .10666667rem /* 8/75 */ .16rem /* 12/75 */ -.10666667rem /* 8/75 */ rgba(238, 90, 70, 0.48);
    }
  }
  & > :not(:first-child):not(:last-child).active {
    width: 3.2rem /* 240/75 */;
    font-size: .42666667rem /* 32/75 */;
    font-weight: 500;
    height: 1.06666667rem /* 80/75 */;
    background: transparent;
    color: #282828;
    background: #fff;
    z-index: 2;
    border-radius: .32rem /* 24/75 */ .32rem /* 24/75 */ 0px 0px;
    box-shadow: 0px .10666667rem /* 8/75 */ .16rem /* 12/75 */ 0px rgba(238, 90, 70, 0.48);
    transform: scaleX(1.05);
    transform-origin: center;
    &::before, &::after {
      display: none;
    }
  }
  & > li:last-child.active {
    width: 4.74666667rem /* 356/75 */;
    font-size: .42666667rem /* 32/75 */;
    font-weight: 500;
    height: 1.06666667rem /* 80/75 */;
    background: transparent;
    color: #282828;
    z-index: 2;
    background: #fff;
    &::after {
      content: '';
      width: 50%;
      height: 100%;
      background: #fff;
      position: absolute;
      left: -.56rem /* 42/75 */;
      bottom: 0;
      z-index: -2;
      border-radius: .42666667rem /* 32/75 */ 0 0 0;
      transform-origin: 0 100%;
      transform: skew(-10deg);
      box-shadow: -.16rem /* 12/75 */ .10666667rem /* 8/75 */ .16rem /* 12/75 */ -.10666667rem /* 8/75 */ rgba(238, 90, 70, 0.48);
    }
  }
}
</style>