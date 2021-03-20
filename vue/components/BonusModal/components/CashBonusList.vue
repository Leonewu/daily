<template>
  <div>
    <ul :class="$style.list">
      <li 
        :class="[$style.item, { [$style.active]: item.is_reward }]" 
        v-for="(item, index) in list" 
        :key="index + new Date().getTime()"
      >
        <span><span>¥</span>{{ item.cashback }}</span>
        <img :src="item.portrait_url" />
        <span>{{ item.is_reward ? item.nickname : '成功邀请后获得' }}</span>
      </li>
    </ul>
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
    }
  }
}
</script>

<style module lang="scss">

.list {
  width: 100%;
  padding: .64rem /* 48/75 */ 0 .32rem /* 24/75 */;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 2.8rem /* 210/75 */;
  height: 2.37333333rem /* 178/75 */;
  background-image: url('../images/poster_popup_packet_gary@2x.png');
  background-repeat: no-repeat;
  background-size: contain;
  padding: .32rem /* 24/75 */ 0 .24rem /* 18/75 */;
  &:nth-child(3n + 1) {
    margin-bottom: .37333333rem /* 28/75 */;
  }
  & > span:first-child {
    font-size: .58666667rem /* 44/75 */;
    font-family: xiaonum;
    font-weight: 500;
    color: #5A5A5A;
    line-height: .53333333rem /* 40/75 */;
    & > span {
      font-size: .34666667rem /* 26/75 */;
      line-height: .37333333rem /* 28/75 */;
    }
  }
  & > img {
    visibility: hidden;
    width: .74666667rem /* 56/75 */;
    height: .74666667rem /* 56/75 */;
    border: .05333333rem /* 4/75 */ solid #FFF1DA;
    border-radius: 50%;
    margin: .05333333rem /* 4/75 */ 0 .16rem /* 12/75 */;
  }
  & > span:last-child {
    max-width: 2.24rem /* 168/75 */;
    min-width: 84px;
    font-weight: 500;
    color: #FAFAFA;
    line-height: .32rem /* 24/75 */;
    font-size: .32rem /* 24/75 */;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.active {
    background-image: url('../images/poster_popup_packet_red@2x.png');
    & > span:first-child {
      color: #EE5A46;
    }
    & > img {
      visibility: visible;
    }
    & > span:last-child {
      color: #FFF1DA;
    }
  }
}
</style>