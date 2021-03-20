<template>
  <XiaoModal
    ref="modal"
    :visible.sync="innerVisible"
    :showCloseIcon="false"
    :tranformDefault="false"
    :boxStyle="$style.boxStyle"
    :closeOnClickDimmer="closeOnClickDimmer"
    :opacityAnimate="true"
    :transformUpDown="true"
  >
    <div :class="[$style.modalHeader, title && $style.titleWrapper]">
      <slot name="title">{{ title }}</slot>
    </div>
    <i
      v-if="closeBtnVisible"
      :class="['xiaoicon', $style.iconClose]"
      :style="`top: ${title ? '0.4266666666666667rem' : '.5333333333333333rem' }`"
      @click="handleClose"
    >
      &#xe759;
    </i>
    <slot></slot>
  </XiaoModal>
</template>

<script>
import XiaoModal from './XiaoModal.vue'

export default {
  name: 'xiao-bottom-modal',
  components: {
    XiaoModal,
  },
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    },
    closeOnClickDimmer: {
      type: Boolean,
      default: true
    },
    overflowSinking : String, // 页面内容溢出屏幕时，内容下沉距离
    closeBtnVisible: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.handleResize()
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleResize () {
      const { overflowSinking, $refs } = this
      // 内容溢出不做处理
      if (!overflowSinking) return
      const modal = $refs['modal']
      if (!modal) return
      let contentEl = modal.$refs['slotBox']
      const clientH = document.documentElement.clientHeight
      const callback = () => {
        var bodyH =  document.body.scrollHeight
        if (!contentEl) {
          if (!modal.$refs['slotBox']) return
          contentEl = modal.$refs['slotBox']
        }
        contentEl.style.bottom = bodyH < clientH ? `-${overflowSinking}` : '0'
      }
      window.addEventListener('resize', callback)
      this.$emit('hook:beforeDestory', () => {
        window.removeEventListener('resize', callback)
      })
    },
    handleClose() {
      this.innerVisible = false
    }
  }
}
</script>

<style lang="scss" module>
.boxStyle {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #ffffff;
  border-radius: 0.32rem 0.32rem 0px 0px;
  overflow: hidden;
}
.modalHeader {
  position: relative;
}
.iconClose {
  position: absolute;
  top: .5333333333333333rem;
  right: .5333333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #b3b3b3;
}
.titleWrapper {
  height: 1.28rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5333333333333333rem;
  text-align: center;
  background: #fafafa;
  font-size: 0.4266666666666667rem;
  font-weight: 500;
  color: #464646;
}
</style>