<template>
  <div>
    <div :class="$style.tip">
      <i class="xiaoicon">&#xe684;</i>
      <span>仅显示所获得的奖品，领取请联系星火网校老师</span>
    </div>
    <img 
      :class="$style.img" 
      v-for="(item, index) in list" 
      :key="item.url + index" 
      :src="item.url"
      alt="" 
    />
  </div>
</template>

<script>
export default {
  props: {
    list: {
      default: () => [],
      type: Array
    }
  }
}
</script>

<style lang="scss" module>
.tip {
  margin: .58666667rem /* 44/75 */ 0 .45333333rem /* 34/75 */;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > i {
    font-size: .42666667rem /* 32/75 */;
    color: #FFB946;
    margin-right: .13333333rem /* 10/75 */;
  }
  & > span {
    font-weight: 400;
    color: #5A5A5A;
    font-size: .34666667rem /* 26/75 */;
  }
}
.img {
  width: 100%;
  height: 4.06666667rem /* 305/75 */;
  display: block;
  margin-bottom: .32rem /* 24/75 */;
  border-radius: .21333333rem /* 16/75 */;
}
</style>