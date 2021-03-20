<template>
  <transition>
    <div v-if="visible"
      class="xhwx_xiaoModal"
      :style="modalStyle"
      :class="[$style.modal,
        {[$style.center]: center, [$style.modal_pc]: $UA.pc},
        {[$style.transformDefault]:transformDefault},
        {[$style.transformUpDown]:transformUpDown},
        {[$style.compatiblePC]: compatiblePC && $UA.pc}
      ]"
      @touchmove="onTouchMove">
      <div v-if="showDimmer"
        :class="[$style.dimmer,{[$style.dimmerChange]:dimmerChange}]"
        :style="dimmerStyle"
        @click.stop="onClickDimmer"></div>
      <div :class="[$style.box, boxStyle]"
        :style="slotBoxStyle"
        ref="slotBox">
        <slot></slot>
        <div v-if="showCloseIcon"
          :class="$style.close"
          :style="closeStyle"
          @click.stop="close"></div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" module src="./xiao-modal.module.scss"></style>

<script>
export default {
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.setBodyStyle()
        } else {
          setTimeout(() => {
            this.clearBodyStyle()
          }, 500)
        }
        if (this.opacityAnimate) {
          //渐变
          setTimeout(() => {
            this.dimmerChange = val
          }, 0)
        } else {
          //无渐变
          this.dimmerChange = val
        }
      },
      immediate: true
    }
  },
  props: {
    opacityAnimate: {
      type: Boolean,
      default: false
    },
    transformDefault: {
      type: Boolean,
      default: true
    },
    transformUpDown: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    boxStyle: [String, Array],
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    showDimmer: {
      type: Boolean,
      default: true
    },
    closeOnClickDimmer: {
      type: Boolean,
      default: true
    },
    preventTouchMove: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    slotboxHeight: {
      type: Number,
      default: 0
    },
    closeStyle: {
      type: Object,
      default: null
    },
    // 针对最外层modal的样式，原来的zIndex也放到这里面去，z-index 必须大于1000
    modalStyle: {
      type: Object,
      default: null
    },
    dimmerStyle: {
      type: Object,
      default: null
    },
    openGIO: {
      type: Boolean,
      default: false
    },
    // 是否开启兼容pc样式
    compatiblePC: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dimmerChange: true
    }
  },
  computed: {
    // box垂直居中
    slotBoxStyle() {
      if (this.slotboxHeight) {
        return {
          marginTop: `-${parseInt(this.slotboxHeight / 2)}px`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    close() {
      if (this.openGIO) {
        this.$emit('gio-emit', 2)
      }
      this.$emit('update:visible', false)
    },
    onClickDimmer() {
      if (this.closeOnClickDimmer) {
        if (this.openGIO) {
          this.$emit('gio-emit', 1)
        }
        this.$emit('update:visible', false)
      }
    },
    onTouchMove(e) {
      if (this.preventTouchMove) {
        e.preventDefault()
      }
    },
    setBodyStyle() {
      let dom = document.getElementsByClassName('xhwx_xiaoModal') || []
      if (dom.length === 0) {
        const scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.top = `-${scrollTop}px`
      }
      dom = null
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    },
    clearBodyStyle() {
      let dom = document.getElementsByClassName('xhwx_xiaoModal') || []
      if (dom.length > 0) {
        dom = null
        return
      }
      dom = null
      if (
        document.body.style.overflow === 'hidden' ||
        document.body.style.position === 'fixed'
      ) {
        const length = document.body.style.top.length // 截取px
        let top = document.body.style.top.slice(0, length - 2)
        top = top < 0 ? -top : top
        document.body.style.overflow = ''
        document.body.style.width = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.scrollTop = document.documentElement.scrollTop = top
      }
    }
  },
  beforeDestroy() {
    setTimeout(() => {
      this.clearBodyStyle()
    }, 500)
  }
}
</script>

