<template>
  <div :class="$style.card">
    <section :class="$style.cardLeft">
      <span>{{ type === 'count' ? '累计已发送人数' : '现金奖励' }}</span>
      <span>{{ type === 'count' ? '仅统计成功打开链接人数' : '仅统计好友成功购买课程后的奖励金' }}</span>

      <span v-if="type === 'bonus'"><span :class="$style.prefix">¥</span>{{ count }}</span>
      <span v-else>{{ count }}<span :class="$style.suffix">人</span></span>
    </section>
    <section :class="$style.cardRight">
      <img :class="$style.symbol" src="../images/poster_card_right@2x.png" />
      <div :class="$style.button">
        <img src="../images/poster_button@2x.png" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'count'
    },
    count: {
      default: '',
      type: [String, Number]
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style module lang="scss">
.card {
  width: 100%;
  height: 2.29333333rem /* 172/75 */;
  margin-top: .53333333rem;
  // box-shadow: 0px 0px .26666667rem /* 20/75 */ 0px rgba(0, 0, 0, 0.1);
  border-radius: .21333333rem /* 16/75 */;
  padding-left: .53333333rem /* 40/75 */;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: radial-gradient(circle at 0 50%, transparent 10px, #fff 0) top left/100% 100% no-repeat;
  // background: radial-gradient(circle at 0px 50px, transparent 10px, #fff 0) top;
  // drop-shadow 能覆盖 box-shadow 无法覆盖的地方，比如 popover 的箭头
  filter: drop-shadow(0px 0px .26666667rem /* 20/75 */ rgba(0,0,0,.1));
}

.cardLeft {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: .26666667rem /* 20/75 */ 0;
  z-index: 2;
  & > span:first-child {
    font-size: .37333333rem /* 28/75 */;
    font-weight: 500;
    color: #282828;
    line-height: .37333333rem /* 28/75 */;
  }
  & > span:nth-child(2) {
    font-weight: 400;
    color: #8A8A8A;
    line-height: .32rem /* 24/75 */;
    font-size: .32rem /* 24/75 */;
    margin: .16rem /* 12/75 */ 0;
  }
  & > span:last-child {
    font-size: .74666667rem /* 56/75 */;
    font-family: xiaonum;
    font-weight: 500;
    color: #EE5A46;
    line-height: .74666667rem /* 56/75 */;
  }
}

.cardRight {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
  &::before {
    position: absolute;
    content: '';
    width: 2.74666667rem /* 206/75 */;
    height: 2.50666667rem /* 188/75 */;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    background: radial-gradient(circle at -.4rem /* 30/75 */ 50%, #fff .88rem /* 66/75 */, transparent 0) top left/100% 100% no-repeat;
  }
  &::after {
    width: 2.74666667rem /* 206/75 */;
    background: linear-gradient(90deg, #FFE3B5 0%, #FAC07F 100%);
    border-radius: .16rem /* 12/75 */ .21333333rem /* 16/75 */ .21333333rem /* 16/75 */ .16rem /* 12/75 */;
    position: absolute;
    content: '';
    width: 2.74666667rem /* 206/75 */;
    height: 2.50666667rem /* 188/75 */;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 
      .26666667rem /* 20/75 */ 0px .26666667rem /* 20/75 */ -.26666667rem /* 20/75 */ rgba(251, 198, 137, 0.3), 
      .26666667rem /* 20/75 */ .26666667rem /* 20/75 */ .26666667rem /* 20/75 */ -.26666667rem /* 20/75 */ rgba(251, 198, 137, 0.3),
      .26666667rem /* 20/75 */ -.26666667rem /* 20/75 */ .26666667rem /* 20/75 */ -.26666667rem /* 20/75 */ rgba(251, 198, 137, 0.3);
    z-index: 1;
  }
}

.prefix {
  font-size: .53333333rem /* 40/75 */;
  line-height: .53333333rem /* 40/75 */;
}
.suffix {
  font-size: .42666667rem /* 32/75 */;
  line-height: .42666667rem /* 32/75 */;
  font-family: intial;
  vertical-align: baseline;
}

.symbol {
  width: 1.6rem /* 120/75 */;
  height: 1.6rem /* 120/75 */;
  z-index: 3;
  border-radius: 50%;
  box-shadow: 0 0 .2rem /* 15/75 */ .2rem /* 15/75 */ #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 2.48rem /* 186/75 */;
}

.button {
  width: 1.86666667rem /* 140/75 */;
  height: 1.86666667rem /* 140/75 */;
  z-index: 2;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: .18666667rem /* 14/75 */;
  background: #fab26b;
  &::before {
    content: '';
    width: 1.57333333rem /* 118/75 */;
    height: 1.57333333rem /* 118/75 */;
    position: absolute;
    z-index: -1;
    left: 50%;
    top: calc(50% + .04rem /* 3/75 */);
    transform: translate(-50%, -50%);
    background: linear-gradient(270deg, #C4231C 0%, #EB432B 100%);
    border-radius: 50%;
  }
  & > img {
    width: 1.57333333rem /* 118/75 */;
    height: 1.52rem /* 114/75 */;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: calc(50% - .08rem /* 6/75 */);
    transform: translate(-50%, -50%);
    animation: popup ease 0.6s infinite;
  }
}

@keyframes popup {
  0% {
    top: calc(50% - .08rem /* 6/75 */);
  }
  50% {
    top: 50%;
  }
  100% {
    top: calc(50% - .08rem /* 6/75 */);
  }
}

</style>