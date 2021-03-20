<template>
  <xiao-modal 
    :transformUpDown="false"
    :transformDefault="false"
    :showCloseIcon="false"
    :visible.sync="innerVisible"
    :boxStyle="`${$style.box}`"> 
    <div :class="$style.title">{{ title }}</div>
    <div :class="$style.desc">
      <span>{{ description }}</span>
    </div>
    <div :class="$style.footer" @click="$emit('confirm')">
      {{ confirmDescription }}
    </div>
  </xiao-modal>
</template>
<style lang="scss" module>
.box {
  width: 7.73333333rem;
  background: #FFFFFF;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: .5333333333333333rem 0 0 0;
  border-radius: .34666667rem;
}
.title {
  font-size: .48rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #464646;
  text-align: center;
  line-height: .48rem;
  margin-bottom: .32rem;
} 
.desc {
  padding: 0 .53333333rem;
  font-size: .37333333rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8A8A8A;
  line-height: .58666667rem;
  margin-bottom: .42666667rem;
  text-align: center;
  span {
    display: inline-block;
    text-align: left;
  }
}
.footer { 
  height: 1.17333333rem;
  font-size: .42666667rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #00C55D;
  text-align: center;
  line-height: 1.17333333rem;
  border-top: .01333333rem solid #ccc;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
    .footer { border-top: .0066666666666667rem solid #cccccc }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
    .footer { border-top: .00444444rem solid #cccccc }
}
</style>
<script>
import XiaoModal from './XiaoModal.vue'
export default {
  components: {
    XiaoModal,
  },
  props: {
    visible: {
      typeof: Boolean,
      default: false
    }, 
    title: {
      typeof: String,
      default: '温馨提示'
    },
    description: {
      typeof: String,
      default: ''
    },
    confirmDescription: {
      typeof: String,
      default: '我知道了'
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit("update:visible", val)
      }
    }
  },
  data() {
    return {

    }
  }
}
</script>