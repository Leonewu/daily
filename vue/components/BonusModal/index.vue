<template>
  <XiaoModal 
    :visible.sync="visible" 
    :showCloseIcon="false"
    :transformUpDown="true"
    :preventTouchMove="false"
    :transformDefault="false"
    :box-style="$style.box" 
  >
    <div :class="$style.wrapper">
      <header :class="$style.header">
        <span>我的累积奖励</span>
        <span 
          :class="['xiaoicon', $style.close]"
          @click="visible = false"
        >&#xe759;</span>
      </header>
      <section :class="$style.content">
        <ul :class="$style.tab">
          <li 
            v-for="(tab, key) in tabs" 
            :key="key" 
            :class="{ [$style.active]: currentTab === key }"
            @click="currentTab = key"
          >{{ tab }}</li>
        </ul>
        <div :class="$style.tabContent">
          <Card :type="currentTab" :count="count" />
          <SendList v-if="currentTab === 'count'" :list="sendList" />
          <CashBonusList v-else :list="bonusList" />
        </div>
      </section>
    </div>
  </XiaoModal>
</template>

<script>
import XiaoModal from '../XiaoModal/XiaoModal.vue'
import CashBonusList from './components/CashBonusList.vue'
import SendList from './components/SendList.vue'
import Card from './components/Card.vue'

export default {
  components: {
    XiaoModal, CashBonusList, SendList, Card
  },
  data() {
    return {
      visible: true,
      // 当前 tab 'count' | 'bonus'
      currentTab: 'count',
      tabs: {
        'count': '已发送人数',
        'bonus': '现金奖励'
      },
      sendList: [
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },        {
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          view_link_time: '2021/05/04 09:45:09',
          nickname: '单水电费水电费搜索的是的发送到发送到'
        },
      ],
      bonusList: [
        {
          cashback: '50.00',
          nickname: '按时大大所多水电费撒地方',
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          is_reward: true
        },
        {
          cashback: '50.00',
          nickname: '水电费撒阿达上大所大所大所地方',
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          is_reward: true
        },
        {
          cashback: '50.00',
          nickname: '水电费撒地方',
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          is_reward: true
        },
        {
          cashback: '50.00',
          nickname: '成功邀请后获得',
          portrait_url: 'https://avatars.githubusercontent.com/u/22951514?s=88&u=d7398394a4df01ed47008a727ea7ab72c72ac931&v=4',
          is_reward: false
        }
      ],
      cashback: 0
    }
  },
  computed: {
    count() {
      if (this.currentTab === 'count') {
        return this.sendList.length
      }
      return this.cashback.toFixed(2)
    }
  },
  methods: {
    show() {
      this.visible = true
    }
  },
  created() {

  }
}
</script>

<style lang="scss" module>
.box {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 0.266667rem 0.266667rem 0 0;
  overflow: hidden;
  background: #fff;
  // max-height: calc(100vh - 1.06666667rem /* 80/75 */);
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background: url('./images/poster_popup_bg@2x.png') no-repeat;
  background-size: 100% 100%;
}
.header {
  color: #fff;
  font-size: .48rem /* 36/75 */;
  position: relative;
  text-align: center;
  padding: .53333333rem /* 40/75 */ 0;
}
.close {
  position: absolute;
  font-size: .42666667rem /* 32/75 */;
  right: .53333333rem /* 40/75 */;
  top: 50%;
  transform: translateY(-50%);
}
.content {
  width: 100%;
  padding: 0 .21333333rem /* 16/75 */;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.tab {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  list-style: none;
  & > li {
    width: 4.82666667rem /* 362/75 */;
    height: .88rem /* 66/75 */;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .37333333rem /* 28/75 */;
    font-weight: 400;
    border-radius: .32rem /* 24/75 */ .32rem /* 24/75 */ 0px 0px;
    color: #5A5A5A;
    position: relative;
    z-index: 1;
  }
  & > li:first-child {
    background: linear-gradient(90deg, #FFFFFF 0%, #FFE4E0 100%);
  }
  & > li:last-child {
    background: linear-gradient(270deg, #FFFFFF 0%, #FFE4E0 100%);
  }
  & > li:first-child.active {
    width: 4.74666667rem /* 356/75 */;
    font-size: .42666667rem /* 32/75 */;
    font-weight: 500;
    height: 1.06666667rem /* 80/75 */;
    background: transparent;
    color: #282828;
    z-index: 2;
    &::before {
      content: '';
      width: 80%;
      height: 100%;
      position: absolute;
      border-radius: .32rem /* 24/75 */ 0 0 0;
      left: 0;
      bottom: 0;
      z-index: -1;
      background: #fff;
    }
    &::after {
      content: '';
      width: 50%;
      height: 100%;
      background: #fff;
      position: absolute;
      right: -.53333333rem /* 40/75 */;
      bottom: 0;
      z-index: -2;
      border-radius: 0 .42666667rem /* 32/75 */ 0 0;
      transform-origin: 0 100%;
      transform: skew(10deg);
      box-shadow: 0px 8px 12px 0px rgba(238, 90, 70, 0.48);
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
    &::before {
      content: '';
      width: 80%;
      height: 100%;
      position: absolute;
      border-radius: 0 .32rem /* 24/75 */ 0 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: #fff;
    }
    &::after {
      content: '';
      width: 50%;
      height: 100%;
      background: #fff;
      position: absolute;
      left: -.53333333rem /* 40/75 */;
      bottom: 0;
      z-index: -2;
      border-radius: .42666667rem /* 32/75 */ 0 0 0;
      transform-origin: 0 100%;
      transform: skew(-10deg);
      box-shadow: 0px 8px 12px 0px rgba(238, 90, 70, 0.48);
    }
  }
}
.tabContent {
  padding: 0 .42666667rem /* 32/75 */;
  background: #fff;
  flex: 1;
  z-index: 2;
}
</style>