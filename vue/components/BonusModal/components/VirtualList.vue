<template>
  <div>
    <div :class="$style.table">
      <header :class="$style.thead">
        <div :class="$style.th">打开链接人昵称</div>
        <div :class="$style.th">打开链接时间</div>
      </header>
      <!-- <div id="tbodyWrapper" :class="$style.tbodyWrapper"> -->
      <div id="tbodyWrapper" :class="$style.tbodyWrapper" @scroll="handleScroll">
        <ul :class="$style.tbody">
          <li 
            v-for="(item, index) in visualList" 
            :key="item.view_id" 
            :class="[`item-${index}`, 'virtual-item', $style.tr, { [$style.active]: item.is_possible }]"
          >
            <div :class="$style.td">
              <div :class="$style.avatarWrapper">
                <img :class="$style.avatar" :src="avatar" />
                <img :class="$style.badge" v-show="item.is_possible" src="../../images/list_1@2x.png" />
              </div>
              <span :class="$style.name">{{ item.is_stranger ? '陌生人' : `手机尾数${item.nickname}` }}</span>
            </div>
            <div :class="$style.td">{{ item.view_link_time * 1000 | dateTime }}</div>
            <img :class="$style.banner" v-show="item.is_possible" src="../../images/list_2@2x.png" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from 'src/images/common/avatar_student.png'
import { api_getFissionSendList } from 'src/api/fission' 

function throttle(fn, delay = 500) {
  let loading = false
  return function (...args) {
    if (!loading) {
      loading = true
      fn.call(this, ...args)
      setTimeout(() => {
        loading = false
      }, delay)
    }
  }
}

export default {
  name: "VirtualList",
  props: {
    inviterId: {
      type: String
    },
  },
  data() {
    return {
      avatar,
      list: [],
      loading: false,
      // 起始下标，及可视区第一个元素的下标
      startIndex: 0,
      // 虚拟列表的增量，这个值必须大于可视区的行数
      increment: 20,
      visualList: [],
      lastScrollTop: 0,
      // 存放已经渲染过的每一列的 height 和 top，方便定位 startIndex
      heightList: [],
      table: null,
      total: 0
    }
  },
  computed: {
    hasNoMore() {
      return this.list.length >= this.total
    },
    endIndex() {
      return this.startIndex + this.increment
    },
    paddingBottom() {
      if (this.endIndex < this.heightList.length) {
        const totalHeight = this.heightList[this.heightList.length - 1]
        const currentHeight = this.heightList[this.endIndex]
        return totalHeight.height + totalHeight.top - currentHeight.height - currentHeight.top
      }
      return 0
    }
  },
  methods: {
    fetchData(nextPage) {
      return api_getFissionSendList({
        start: nextPage ? this.list.length : 0,
        length: 50,
        activity_inviter_id: this.inviterId
      }).then(res => {
        if (nextPage) {
          this.list = this.list.concat(res.data.open_link_info_list || [])
        } else {
          this.list = res.data.open_link_info_list || []
        }
        this.total = res.data.total
        this.$emit('update:total', this.total)
      }).finally(() => {
        this.loading = false
      })
    },
    scrollFetch: throttle(function(scrollTop) {
      this.fetchData(true).then(() => {
        this.updateVisualList(scrollTop)
      })
    }, 800),
    /* 根据 startIndex 和 endIndex 设置 padding */
    setPadding() {
      const table = document.querySelector("#tbodyWrapper ul")
      table.style.paddingTop = this.heightList[this.startIndex].top + "px"
      table.style.paddingBottom = this.paddingBottom + "px"
    },
    isScrollDown(scrollTop) {
      const lastScrollTop = this.lastScrollTop
      this.lastScrollTop = scrollTop
      if (lastScrollTop < scrollTop) {
        return true
      }
      return false
    },
    /* 根据 scrollTop 更新 visualList， startIndex，setPadding */
    updateVisualList(scrollTop) {
      const index = this.findStartIndex(scrollTop)
      const lastStartIndex = this.startIndex
      if (lastStartIndex !== index) {
        if (this.list.length >= this.increment) {
          if (index + this.increment > this.list.length) {
            // 处理滚到最后的情况
            this.startIndex = this.list.length - this.increment
          } else {
            this.startIndex = index
          }
          this.visualList = this.list.slice(this.startIndex, this.endIndex)
          this.updateHeightList()
          this.setPadding()
        }
      }
    },
    handleScroll(e) {
      if (this.loading) return
      const { scrollHeight, scrollTop, clientHeight } = e.target
      if (this.isScrollDown(scrollTop) && !this.hasNoMore) {
        // 往下滚动
        if (scrollHeight - clientHeight - scrollTop < 100) {
          this.scrollFetch(scrollTop)
          return
        }
      }
      this.updateVisualList(scrollTop)
    },
    /* 找出当前滚到第几个 */
    findStartIndex(scrollTop) {
      // 找到第一个大于 scrollTop 的元素，再减去 1 就是当前的 startIndex
      let index = this.heightList.findIndex(item => item.top > scrollTop)
      return index > 0 ? index - 1 : index
    },
    /* 维护包含每一列的 height 和 top 的数组 */
    updateHeightList() {
      if (this.endIndex <= this.heightList.length) return
      this.$nextTick(() => {
        const list = Array.from(document.querySelectorAll(".virtual-item"))
        if (this.heightList.length) {
          // 如果不是第一次生成高度数组
          const start = this.heightList.length - this.endIndex
          list.slice(start, list.length).forEach(item => {
            const lastIndex = this.heightList.length - 1
            const top = this.heightList[lastIndex].top + this.heightList[lastIndex].height
            this.heightList.push({
              height: item.clientHeight,
              top
            })
          })
        } else {
          list.forEach((item, index) => {
            let top
            if (index === 0) {
              top = 0
            } else {
              top = this.heightList[index - 1].top + this.heightList[index - 1].height
            }
            this.heightList.push({
              height: item.clientHeight,
              top
            })
          })
        }
      })
    }
  },
  mounted() {
    // if (document.querySelector("#tbodyWrapper")) {
    //   document.querySelector("#tbodyWrapper").addEventListener("scroll", this.handleScroll)
    // }
    this.fetchData().then(() => {
      this.visualList = this.list.slice(this.startIndex, this.endIndex)
      this.updateHeightList()
      this.$nextTick(() => {
        this.setPadding()
      })
    })
  },
  destroyed() {
    // if (document.querySelector("#tbodyWrapper")) {
    //   document.querySelector("#tbodyWrapper").removeEventListener("scroll", this.handleScroll)
    // }
  }
}
</script>

<style>
ul, li {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
<style lang="scss" module>

.table {
  width: 100%;
  padding: .64rem /* 48/75 */ 0;
}
.thead {
  width: 100%;
  height: .96rem /* 72/75 */;
  line-height: .96rem /* 72/75 */;
  display: flex;
  background: #FFE3B5;
  padding: 0 .32rem /* 24/75 */;
  color: #464646;
  font-weight: 400;
  font-size: .34666667rem /* 26/75 */;
  text-align: left;
  border-radius: .21333333rem /* 16/75 */ .21333333rem /* 16/75 */ 0 0;
}
.th {
  width: 50%;
}
.tbodyWrapper {
  overflow-y: auto;
  max-height: calc(100vh - 8.3733rem);
}
.tbody {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  // overflow-y: scroll;
  // max-height: calc(100vh - 8.3733rem);
}
.tr {
  width: 100%;
  padding: .16rem /* 12/75 */ .32rem /* 24/75 */;
  box-sizing: border-box;
  font-weight: 400;
  color: #5A5A5A;
  flex: none;
  font-size: .34666667rem /* 26/75 */;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  position: relative;
  &.active {
    background: #fffaf3;
  }
}

.banner {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.2rem /* 90/75 */;
  height: .4rem /* 30/75 */;
}

.td {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  & > .avatarWrapper {
    width: .74666667rem /* 56/75 */;
    height: .74666667rem /* 56/75 */;
    margin-right: .21333333rem /* 16/75 */;
    position: relative;
    & > .avatar {
      width: .74666667rem /* 56/75 */;
      height: .74666667rem /* 56/75 */;
      border-radius: 50%;
    }
    & > .badge {
      position: absolute;
      display: block;
      width: .32rem /* 24/75 */;
      height: .32rem /* 24/75 */;
      bottom: 0;
      right: -3px;
    }
  }
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - .96rem /* 72/75 */);
}

.empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 7.14666667rem /* 536/75 */;
}
.img {
  width: 3.2rem /* 240/75 */;
  height: 3.2rem /* 240/75 */;
}
.tip {
  font-weight: 400;
  color: #ABB1B4;
  line-height: .58666667rem /* 44/75 */;
  font-size: .37333333rem /* 28/75 */;
  margin: .21333333rem /* 16/75 */ 0 .42666667rem /* 32/75 */;
  text-align: center;
}
.btn {
  width: 4.26666667rem /* 320/75 */;
  height: 1.06666667rem /* 80/75 */;
  background: linear-gradient(241deg, #FA5C48 0%, #F70632 100%);
  border-radius: .53333333rem /* 40/75 */;
  font-size: .37333333rem /* 28/75 */;
  font-weight: 500;
  line-height: .37333333rem /* 28/75 */;
  line-height: 1.06666667rem /* 80/75 */;
  text-align: center;
  color: #fff;
  &:active {
    background: #F70632;
  }
}
</style>

