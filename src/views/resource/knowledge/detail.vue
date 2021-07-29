<template>
  <div class="knowledge-detail">
    <div
      class="header"
      @click="$router.push('/resource/knowledge/index')"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">查看详情</span>
    </div>

    <div class="body">
      <div class="container top">
        <div class="main-content">
          <div class="left">
            <div class="title">
              {{ data.name }}
            </div>
            <div class="aside">
              <span>更新时间：{{ data.updateTime }}</span>
              <span>级别路径：{{ data.fullName || '--' }}</span>
            </div>
          </div>
        </div>
        <div class="desc-content">
          描述：{{ data.description || '--' }}
        </div>
      </div>
      <div class="container bottom">
        <el-tabs v-model="activeComponent">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.component"
            :label="tab.label"
            :name="tab.component"
          >
            <component
              :is="tab.component"
              v-if="activeComponent === tab.component"
              :knowledge-system-id="id"
              :relevance-btn="RELEVANCE_KNOWLEDGE"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { RELEVANCE_KNOWLEDGE } from '@/const/knowledge'
import { Course, Knowledge, Live, Question, RequiredCourse, Training } from './components'
import { queryCategoryDetail } from '@/api/knowledge'

export default {
  name: 'KnowledgeDetail',
  components: {
    Course,
    Knowledge,
    Live,
    Question,
    RequiredCourse,
    Training
  },
  data() {
    return {
      data: {},
      activeComponent: 'Course',
      tabs: [
        {
          component: 'Course',
          label: '课程'
        },
        {
          component: 'Knowledge',
          label: '知识库'
        },
        {
          component: 'Live',
          label: '直播'
        },
        {
          component: 'Question',
          label: '题库'
        },
        {
          component: 'RequiredCourse',
          label: '必修课'
        },
        {
          component: 'Training',
          label: '培训'
        }
      ]
    }
  },
  computed: {
    RELEVANCE_KNOWLEDGE: () => RELEVANCE_KNOWLEDGE,
    id() {
      return this.data.id
    }
  },
  activated() {
    this.activeComponent = 'Course'
    this.queryCategoryDetail()
  },
  deactivated() {
    this.activeComponent = ''
  },

  methods: {
    queryCategoryDetail() {
      queryCategoryDetail({ id: this.$route.query.id }).then((res) => {
        this.data = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-detail {
  cursor: default;
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 12px;
    }
  }

  .body {
    .container {
      padding: 24px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      box-sizing: border-box;
      &.top {
        .main-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            flex: 1;
            margin-right: 15px;
            .title {
              font-size: 19px;
              margin-bottom: 15px;
            }
            .aside {
              display: flex;
              align-items: center;
              font-size: 0;
              span {
                display: inline-block;
                font-size: 14px;
                color: #6b6b6b;
                &:first-child {
                  flex: 0 0 200px;
                  width: 200px;
                  margin-right: 50px;
                }
              }
            }
          }
        }
        .desc-content {
          margin-top: 15px;
          font-size: 14px;
          color: #6b6b6b;
        }
        margin-bottom: 12px;
      }
      &.bottom {
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
        border-radius: 4px;
      }
    }
  }
}
</style>
