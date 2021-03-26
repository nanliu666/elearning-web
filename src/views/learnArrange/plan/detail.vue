<template>
  <div class="learn-plan-detail">
    <div
      class="back-btn"
      @click="back"
    >
      <i class="icon el-icon-arrow-left"></i>
      <span class="text">线上必修安排详情</span>
    </div>

    <div class="intro-wrapper">
      <div class="intro-left">
        <div class="title">
          <div class="name">
            {{ data.studyName }}
          </div>
          <div
            class="status"
            :class="{ will: data.status === 1, doing: data.status === 2, done: data.status === 3 }"
          >
            {{
              data.status === 2
                ? '进行中'
                : data.status === 1
                  ? '未开始'
                  : data.status === 3
                    ? '已结束'
                    : ''
            }}
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            分类：
            <span class="text">{{ data.categoryName }}</span>
          </div>
          <div class="intro-item">
            有效时间：
            <span class="text">{{ data.startTime }} ~ {{ data.endTime }}</span>
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            创建人：
            <span class="text">{{
              data.trainWay === 1 ? '在线' : data.trainWay === 2 ? '面授' : '混合'
            }}</span>
          </div>
          <div class="intro-item">
            创建时间：
            <span class="text">{{ data.createTime }}</span>
          </div>
        </div>
        <div class="intro-list">
          <div class="intro-item">
            主办单位：
            <span class="text">{{ data.sponsor }}</span>
          </div>
          <div class="intro-item">
            积分：
            <span class="text">{{ data.credit }}</span>
          </div>
        </div>
      </div>
      <div class="intro-right">
        <el-row>
          <el-button
            size="mini"
            type="primary"
            :disabled="[2, 3].includes(data.status)"
            @click="jumpEdit(data)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            :disabled="[2].includes(data.status)"
            @click="handleDelete(data)"
          >
            删除
          </el-button>
          <el-button
            size="mini"
            :disabled="[3].includes(data.status)"
            @click="closePlan(data)"
          >
            结办
          </el-button>
        </el-row>
      </div>
    </div>
    <div class="main-container">
      <el-tabs
        v-model="activeTab"
        class="tabs"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab"
          :label="reference[tab]"
          :name="tab"
        >
          <div class="main-content">
            <component
              :is="tab"
              :data="tabData"
              :parent-vm="parentVm"
            ></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { StudyState } from './contents'
import { queryStudyInfo, queryStudyList } from '@/api/learnArrange'
import { getOrgTree } from '@/api/org/org'

import { deletePlan, updateStatus } from '@/api/learnPlan'

export default {
  name: 'TrainDetail',
  components: {
    StudyState
  },
  data() {
    return {
      reference: {
        'study-state': '学习情况'
      },
      data: {},
      tabs: ['study-state'],
      activeTab: 'study-state',
      tabData: {
        'study-state': {
          data: [],
          orgData: [],
          total: 0
        }
      }
    }
  },
  computed: {
    parentVm() {
      return this
    }
  },
  activated() {
    const $data = JSON.parse(this.$route.query.data)
    Object.assign(this.data, $data)
    this.getData()
  },
  deactivated() {
    this.data = {}
    this.tabData = {
      'study-state': {
        data: [],
        orgData: [],
        total: 0
      }
    }
    this.activeTab = 'study-state'
  },
  methods: {
    back() {
      this.$router.back()
    },
    getData() {
      this.queryStudyInfo()
      this.queryStudyList()
      getOrgTree({ parentOrgId: 0 }).then((res) => {
        this.tabData['study-state'].orgData = res
      })
    },
    queryStudyList(params = {}) {
      const data = { id: this.data.id, ...params }
      if (Array.isArray(data.deptName)) {
        data.deptName = data.deptName[data.deptName.length - 1]
      }
      return queryStudyList(data).then((res) => {
        const { data = [], totalNum = 0 } = res
        this.tabData['study-state'].data = data
        this.tabData['study-state'].total = totalNum
      })
    },
    queryStudyInfo() {
      queryStudyInfo({ id: this.data.id }).then((res) => {
        this.data = Object.assign(this.data, res)
        this.tabData.studyName = this.data.studyName
        this.$forceUpdate()
      })
    },
    handleDelete(selection) {
      if (selection.status === 2) {
        this.$confirm('选中的课程安排正在进行中，无法进行删除操作。', {
          confirmButtonText: '关闭',
          callback: () => {}
        })
      } else {
        this.$confirm('确定要删除选中的课程安排吗？', {
          showCancelButton: true,
          callback: (action) => {
            if (action !== 'cancel') {
              this.deletePlanFn([selection])
            }
          }
        })
      }
    },
    closePlan(row) {
      // 结办
      this.$confirm('您确定要提前结办该课程安排吗？', {
        showCancelButton: true,
        callback: (action) => {
          if (action !== 'cancel') {
            updateStatus({ id: row.id }).then(() => {
              this.$message({
                type: 'success',
                message: '结办成功!'
              })
            })
            this.queryStudyInfo()
          }
        }
      })
    },
    deletePlanFn(arr) {
      // 删除学习计划
      let ids = _(arr)
        .filter((item) => item.status != 2)
        .map('id')
        .join(',')
      if (!ids) {
        return
      }
      deletePlan({
        ids
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$router.push({
            path: '/learnArrange/plan/index'
          })
        })
        .catch()
    },
    jumpEdit(row) {
      this.$router.push({
        path: '/learnPlan/edit',
        query: { id: row.id }
      })
    }
  }
}
</script>

<style lang="scss">
.learn-plan-detail {
  .el-tabs__header {
    margin: 0;
  }
}
</style>

<style lang="scss" scoped>
.learn-plan-detail {
  .breadcrumb-wrap {
    margin: 24px 0 16px;
  }
  .back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin: 16px 0;
    font-size: 16px;
    color: rgba(0, 11, 21, 0.85);
    .icon {
      font-weight: 700;
      margin-right: 4px;
    }
  }
  .intro-wrapper {
    display: flex;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    cursor: default;
    .intro-left {
      flex: 1;
      .title {
        font-size: 0;
        margin-bottom: 18px;
        .name {
          display: inline-block;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          margin-right: 16px;
        }
        .status {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          text-align: center;
          width: 52px;
          font-size: 12px;
          border-radius: 4px;
          &.will {
            color: #00b061;
            background-color: #e7ffee;
          }
          &.doing {
            color: #fcba00;
            background-color: #fffce6;
          }
          &.done {
            color: #01aafc;
            background-color: #e7fbff;
          }
        }
      }

      .intro-list {
        display: flex;
        color: rgba(0, 11, 21, 0.45);
        font-size: 14px;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
        .intro-item {
          display: flex;
          flex: 1;
          align-items: center;
          .text {
            width: 287px;
            color: rgba(0, 11, 21, 0.85);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .intro-right {
      flex: 0 0 188px;
      width: 188px;
    }
  }

  .main-container {
    margin-top: 20px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .el-tabs__item {
      font-size: 16px;
      padding: 0 !important;
      margin: 0 20px;
      &:first-child {
        margin-left: 0;
      }
    }
    .main-content {
      padding: 24px;
    }
  }
}
</style>
