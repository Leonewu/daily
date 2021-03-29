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
        <Tabs :tabs="tabs" v-model="currentTab"/>
        <div :class="$style.tabContent">
          <Card v-if="['count', 'bonus'].includes(currentTab)" :type="currentTab" :count="count" />
          <SendList v-if="currentTab === 'count'" :list="sendList" />
          <CashBonusList v-else-if="currentTab === 'bonus'" :list="bonusList" />
          <AwardList v-else :list="awardList"/>
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
import Tabs from './components/Tabs.vue'

export default {
  components: {
    XiaoModal, CashBonusList, SendList, Card, Tabs
  },
  data() {
    return {
      visible: true,
      // 当前 tab 'count' | 'bonus'
      currentTab: 'count',
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
      cashback: 0,
      awardList: [
        { url: 'sdkdkd' }
      ],
    }
  },
  computed: {
    count() {
      if (this.currentTab === 'count') {
        return this.sendList.length
      }
      return this.cashback.toFixed(2)
    },
    tabs() {
      return [
        {
          key: 'count',
          value: '已发送人数',
        },
        {
          key: 'bonus',
          value: '现金奖励'
        },
        {
          key: 'award',
          value: '我的奖品'
        }
      ]
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
.tabContent {
  padding: 0 .42666667rem /* 32/75 */;
  background: #fff;
  flex: 1;
  z-index: 2;
}
</style>