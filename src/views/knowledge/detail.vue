<template>
  <div class="knowledge-detail">
    <div
      class="header"
      @click="$router.back()"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">查看详情</span>
    </div>

    <div class="body">
      <div class="container top">
        <div class="main-content">
          <div class="left">
            <div class="title">
              数据库安全
            </div>
            <div class="aside">
              <span>更新时间：2021-02-19 12:00:00</span>
              <span>级别路径：安全>数据安全安全</span>
            </div>
          </div>
          <el-row class="button-wrapper">
            <el-button
              v-p="EDIT_KNOWLEDGE"
              type="primary"
              size="medium"
            >
              编辑
            </el-button>
            <el-button
              v-p="DELETE_KNOWLEDGE"
              type="default"
              size="medium"
            >
              删除
            </el-button>
            <el-button
              v-p="CHILD_KNOWLEDGE"
              type="default"
              size="medium"
            >
              新增子级
            </el-button>
          </el-row>
        </div>
        <div class="desc-content">
          描述：常规软件工具进行捕捉、管理和处理的数据集合，是需要新处理模式才能具有更强的决策力、洞察发现力和流程优化能力的海量、高增长率和多样化的信息资产。常规软件工具进行捕捉、管理和处理的数据集合，是需要新处理模式才能具有更强的决策力、洞察发现力和流程优化能力的海量、高增长率和多样化的信息资产。
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
              :relevance-btn="RELEVANCE_KNOWLEDGE"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  RELEVANCE_KNOWLEDGE,
  EDIT_KNOWLEDGE,
  DELETE_KNOWLEDGE,
  CHILD_KNOWLEDGE
} from '@/const/knowledge'
import { Course, Knowledge, Live, Question, RequiredCourse, Training } from './components'
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
    EDIT_KNOWLEDGE: () => EDIT_KNOWLEDGE,
    DELETE_KNOWLEDGE: () => DELETE_KNOWLEDGE,
    CHILD_KNOWLEDGE: () => CHILD_KNOWLEDGE
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
      margin-left: 8px;
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
              margin-bottom: 5px;
            }
            .aside {
              display: flex;
              font-size: 0;
              span {
                display: inline-block;
                font-size: 14px;
                color: #6b6b6b;
                &:first-child {
                  flex: 0 0 200px;
                  width: 200px;
                  margin-right: 15px;
                }
              }
            }
          }
          .button-wrapper {
          }
        }
        .desc-content {
          margin-top: 20px;
          font-size: 14px;
          color: #6b6b6b;
        }
        margin-bottom: 20px;
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
