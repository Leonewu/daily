<template>
  <xiao-modal 
    :transformUpDown="false"
    :transformDefault="false"
    :showCloseIcon="false"
    :visible.sync="innerVisible"
    :closeOnClickDimmer="false"
    :boxStyle="`${$style.box}`"> 
    <div :class="$style.title">{{ title }}</div>
    <div :class="$style.desc">
      <span>{{ description }}</span>
    </div>
    <div :class="$style.footer">
      <button type="button" :class="[$style.btn_active]" @click="$emit('confirm')">{{ positiveDesc }}</button>
      <button type="button" :class="[$style.btn_normal]" @click="$emit('cancel')">{{ negativeDesc }}</button>
    </div>
  </xiao-modal>
</template>
<style lang="scss" module>
@import 'app/sass/utils/_mixin.scss';
.box {
  width: 7.73333333rem;
  background: #FFFFFF;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  padding: .64rem .53333333rem;
  border-radius: .26666667rem;
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
  font-size: .4rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #5A5A5A;
  line-height: .64rem;
}
.footer {
  margin-top: .53333333rem;
}
.btn {
  height: 1.17333333rem;
  display: block;
  border-radius: .58666667rem;
  width: 100%;
}
.btn_active {
  @include button(6.666666666666667rem, 1.1733333333333333rem, linear-gradient(135deg, #4EDC66 0%, #00C55D 100%));
  margin-bottom: .32rem;
  font-size: .42666667rem;
  font-family: SFProText-Medium, SFProText;
  font-weight: 500;
  color: #FFFFFF;
  border-radius: .5866666666666667rem;
  &:hover {
    background:#00C55D;
  }
}
.btn_normal {
  @include button(6.666666666666667rem, 1.1733333333333333rem, #F7F7F8);
  background: #F7F7F8;
  font-size: .42666667rem;
  font-family: SFProText-Regular, SFProText;
  font-weight: 400;
  color: #5A5A5A;
  border-radius: .5866666666666667rem;
  &:hover {
    background: #EBEBEB;
  }
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
    positiveDesc: {
      typeof: String,
      default: '确定'
    },
    negativeDesc: {
      typeof: String,
      default: '放弃'
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