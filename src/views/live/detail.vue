<template>
  <!-- CSS起名规则按照BEM -->
  <div class="live">
    <page-header
      title="查看直播"
      show-back
    />
    <el-card>
      <div class="live__header">
        <div class="header__left">
          <div class="header__logo">
            <el-image
              class="logo__img"
              :src="detailData.coverImageUrl"
              fit="cover"
            >
              <div
                slot="error"
                class="image__slot"
              >
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
          <div class="header__content">
            <div>
              <div class="header__title">
                {{ detailData.channelName }}
              </div>
              <div>
                <div class="content__classify content">
                  <span class="label">直播分类：</span>
                  <span class="value">{{ detailData.categoryName }}</span>
                </div>
                <div class="content">
                  <span class="label">知识体系：</span>
                  <span class="value">{{ detailData.knowledgeSystemFullName }}</span>
                </div>
                <div class="content">
                  <span class="label">直播讲师：</span>
                  <span class="value">{{ detailData.lecturerName }}</span>
                </div>
                <div class="content live__time">
                  <span class="label">直播时间：</span>
                  <span class="value">
                    <ul v-if="!_.isEmpty(detailData.liveBatch)">
                      <li
                        v-for="(item, index) in detailData.liveBatch"
                        :key="index"
                        class="value__li"
                      >
                        <span>{{ item.startTime }}</span>
                        <span>至</span>
                        <span>{{ item.endTime }}</span>
                      </li>
                    </ul>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="live__main">
      <el-tabs
        v-model="activeIndex"
        @tab-click="handleSelect"
      >
        <el-tab-pane
          label="报名情况"
          name="1"
        >
          立楷负责，还未开放
          <live-apply />
        </el-tab-pane>
        <el-tab-pane
          label="考试情况"
          name="2"
        >
          陈龙负责，还未开发
          <live-exam />
        </el-tab-pane>
        <el-tab-pane
          label="学员列表"
          name="3"
        >
          <live-student :data="detailData" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import LiveStudent from './components/LiveStudent'
import { getLiveDetails } from '@/api/live/editLive'
export default {
  name: 'LiveDetail',
  components: {
    LiveStudent,
    LiveApply: () => import('./components/LiveApply'),
    LiveExam: () => import('./components/LiveExam')
  },
  data() {
    return {
      activeIndex: '1',
      detailData: {}
    }
  },
  computed: {
    id() {
      return _.get(this.$route, 'query.liveId', null)
    }
  },
  activated() {
    const params = { liveId: this.id }
    getLiveDetails(params).then((res) => {
      this.detailData = res
    })
  },
  methods: {
    // 切换nav
    handleSelect(tab) {
      this.activeIndex = tab.name
    }
  }
}
</script>

<style scoped lang="scss">
.live {
  .live__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header__left {
      display: flex;
      .header__logo {
        position: relative;
        width: 320px;
        height: 180px;
        margin-right: 40px;
        .logo__img {
          width: 100%;
          height: 100%;
          background-color: #d0d0d0;
        }
      }
      .header__content {
        display: flex;
        align-items: stretch;
        flex-direction: column;
        justify-content: space-between;
        .label {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(#000b15, 0.45);
        }
        .value {
          opacity: 0.85;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #000b15;
        }
        .header__title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #000b15;
          font-weight: 550;
          margin-bottom: 16px;
        }
        .content__classify {
        }
        .live__time {
          display: flex;
          .value__li {
            margin-bottom: 6px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .content {
          margin-bottom: 8px;
        }
      }
    }
  }
  .live__main {
    margin-top: 20px;
    min-height: 55vh;
  }
}
</style>
