<template>
  <div>
    <div :class="$style.table" v-if="list.length">
      <header id="thead" :class="$style.thead">
        <div :class="$style.th">打开链接人昵称</div>
        <div :class="$style.th">打开链接时间</div>
      </header>
      <ul :class="$style.tbody" :style="{ maxHeight: `calc(100vh - 120px - ${theadOffsetTop}px)` }">
        <li :class="$style.tr" v-for="(item, index) in list" :key="index">
          <div :class="$style.td"><img :src="item.portrait_url" /><span :class="$style.name">{{ item.nickname }}</span></div>
          <div :class="$style.td">{{ item.view_link_time }}</div>
        </li>
      </ul>
    </div>
    <div :class="$style.empty" v-else>
      <img :class="$style.img" src="../images/newEmpty/public_empty_img8@2x.png" />
      <p :class="$style.tip">当前未有好友打开您的推荐链接<br />赶紧去邀请好友吧~</p>
      <a :class="$style.btn">去邀请 拿现金</a>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 表头相对弹窗顶部的距离
      theadOffsetTop: 0,
      visible: true,
      // 当前 tab 'count' | 'bonus'
      currentTab: 'count',
      tabs: {
        'count': '已发送人数',
        'bonus': '现金奖励'
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    }
  },
  created() {

  },
  mounted() {
    if (document.querySelector('#thead')) {
      this.theadOffsetTop = document.querySelector('#thead').offsetTop
    }
  }
}
</script>

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
.tbody {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: scroll;
}
.tr {
  width: 100%;
  padding: .16rem /* 12/75 */ .32rem /* 24/75 */;
  font-weight: 400;
  color: #5A5A5A;
  font-size: .34666667rem /* 26/75 */;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  &:nth-child(2n +1) {
    background: #fffaf3;
  }
}
.td {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  & > img {
    width: .74666667rem /* 56/75 */;
    height: .74666667rem /* 56/75 */;
    margin-right: .21333333rem /* 16/75 */;
    border-radius: 50%;
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
  padding: .64rem /* 48/75 */ 0 .74666667rem /* 56/75 */;
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