<template>
  <div class="report">
    <el-row
      type="flex"
      align="middle"
      class="header-area row-bg"
      justify="space-between"
    >
      <el-col>
        <span class="title">统计报表</span>
      </el-col>

      <el-col>
        <div class="filter-wrapper">
          <tree-selector
            class="selector"
            :options="treeOptions"
            placeholder="请选择组织"
            :props="seletorProps"
            @getValue="selectorChange"
          />

          <el-date-picker
            v-model="filterDate"
            class="date-picker"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>

    <div class="data-area margin-top-24">
      <div class="title">
        系统统计
      </div>
      <data-block
        :title="system.ORG.title"
        :data="Object.values(system.ORG.data)"
      />

      <el-row
        type="flex"
        justify="space-between"
        class="margin-top-16"
        :gutter="16"
      >
        <el-col :span="12">
          <data-block
            :title="system.member.title"
            :data="Object.values(system.member.data)"
          />
        </el-col>
        <el-col :span="12">
          <data-block
            :title="system.login.title"
            :data="Object.values(system.login.data)"
          />
        </el-col>
      </el-row>
    </div>

    <div class="data-area margin-top-56">
      <div class="title">
        学习统计
      </div>
      <data-block
        :title="study.course.title"
        :data="Object.values(study.course.data)"
      />
      <el-row
        type="flex"
        justify="space-between"
        class="margin-top-16"
        :gutter="16"
      >
        <el-col :span="12">
          <data-block
            :title="study.live.title"
            :data="Object.values(study.live.data)"
          />
        </el-col>
        <el-col :span="12">
          <data-block
            :title="study.plan.title"
            :data="Object.values(study.plan.data)"
          />
        </el-col>
      </el-row>
      <data-block
        :title="study.train.title"
        :data="Object.values(study.train.data)"
        class="margin-top-8"
      />
    </div>

    <div class="data-area margin-top-64">
      <div class="title">
        考试统计
      </div>

      <data-block
        :title="exam.title"
        :data="Object.values(exam.data)"
      />
      <div class="charts-container margin-top-64">
        <el-row
          type="flex"
          align="middle"
          class="row-bg charts-header"
          justify="space-between"
        >
          <el-col>
            <span class="charts-name">部门学习分析</span>
          </el-col>

          <el-col>
            <el-select
              v-model="chartsType"
              placeholder="请选择"
              class="charts-selector"
            >
              <el-option
                v-for="item in [
                  { value: 'course', label: '课程' },
                  { value: 'live', label: '直播' },
                  { value: 'train', label: '培训' },
                  { value: 'exam', label: '考试' }
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <charts
          ref="charts"
          :type="chartsType"
          :data="chartsData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TreeSelector from '@/components/tree-selector'
import Charts from './components/charts'
import DataBlock from './components/data-block'
import { getOrgTreeSimple } from '@/api/org/org'
import {
  systemDashboard,
  systemMember,
  systemLogin,
  studyCourse,
  studyLive,
  studyTrain,
  studyPlan,
  getExam,
  analysis
} from '@/api/report'

export default {
  name: 'Report',
  components: {
    Charts,
    DataBlock,
    TreeSelector
  },
  data() {
    return {
      org: '',
      orgTree: [],
      filterDate: '',
      //系统统计
      system: {
        ORG: {
          title: '组织统计',
          data: {
            orgNum: {
              name: '部门数量',
              content: 0
            },
            positionNum: {
              name: '岗位数量',
              content: 0
            },
            roleNum: {
              name: '角色数量',
              content: 0
            },
            managerNum: {
              name: '管理员数量',
              content: 0
            }
          }
        },
        member: {
          title: '人员统计',
          data: {
            userNum: {
              name: '用户数',
              content: 0
            },
            teacherNum: {
              name: '讲师数量',
              content: 0
            }
          }
        },
        login: {
          title: '登录统计',
          data: {
            loginUsers: {
              name: '登录人数',
              content: 0
            },
            loginTimes: {
              name: '登录次数',
              content: 0
            }
          }
        }
      },

      //学习统计
      study: {
        course: {
          title: '课程',
          data: {
            courseNum: {
              name: '课程总数',
              content: 0
            },
            studentNum: {
              name: '学习人数',
              content: 0
            },
            allTime: {
              name: '总学时时长（h）',
              content: 0
            },
            avgTime: {
              name: '人均学时时长（h）',
              content: 0
            }
          }
        },
        live: {
          title: '直播',
          data: {
            liveTimes: {
              name: '直播数',
              content: 0
            },
            playerTimes: {
              name: '参加人数',
              content: 0
            }
          }
        },
        plan: {
          title: '线上必修安排',
          data: {
            compulsoryNum: {
              name: '线上必修安排总数',
              content: 0
            },
            compulsoryStudents: {
              name: '参加人数',
              content: 0
            },
            compulsoryTime: {
              name: '总学习时长（h）',
              content: 0
            }
          }
        },
        train: {
          title: '培训统计',
          data: {
            trainNum: {
              name: '培训项目总数',
              content: 0
            },
            trainStudents: {
              name: '参加培训人数',
              content: 0
            },
            trainTime: {
              name: '总学习时长（h）',
              content: 0
            },
            trainPass: {
              name: '通过率',
              content: 0,
              isPercent: true
            }
          }
        }
      },
      //考试统计
      exam: {
        title: '',
        data: {
          examNum: {
            name: '发布考试数',
            content: 0
          },
          examStudents: {
            name: '参考人数',
            content: 0
          },
          examTimes: {
            name: '参考次数',
            content: 0
          },
          passRate: {
            name: '考试通过率',
            content: 0,
            isPercent: true
          }
        }
      },
      treeOptions: [],
      seletorProps: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      },
      query: {
        orgId: '',
        startTime: '',
        endTime: ''
      },
      chartsType: 'course',
      chartsData: {}
    }
  },
  watch: {
    chartsType() {
      this.getAnalysis()
    }
  },
  created() {
    this.getOrgTree()
    this.getData()
  },
  methods: {
    selectorChange(id) {
      this.query.orgId = id
      this.getData()
    },
    dateChange(date) {
      date = date || []
      const [startTime = '', endTime = ''] = date
      Object.assign(this.query, { startTime, endTime })
      this.getData()
    },
    getOrgTree() {
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.treeOptions = res
      })
    },
    getData() {
      systemDashboard(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.system.ORG.data[key].content = res[key]
        })
      })
      systemMember(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.system.member.data[key].content = res[key]
        })
      })
      systemLogin(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.system.login.data[key].content = res[key]
        })
      })
      studyCourse(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.study.course.data[key].content = res[key]
        })
      })
      studyLive(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.study.live.data[key].content = res[key]
        })
      })
      studyPlan(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.study.plan.data[key].content = res[key]
        })
      })
      studyTrain(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          this.study.train.data[key].content = res[key]
        })
      })
      getExam(this.query).then((res = {}) => {
        Object.keys(res).forEach((key) => {
          const data = this.exam.data
          if (data.hasOwnProperty(key)) {
            data[key].content = res[key]
          }
        })
      })
      this.getAnalysis()
    },
    getAnalysis() {
      if (this.$refs.charts) {
        this.$refs.charts.setLoadingVisbile(true)
      }
      analysis({ type: this.chartsType, ...this.query })
        .then((res = {}) => {
          this.chartsData = res
        })
        .finally(() => this.$refs.charts.setLoadingVisbile(false))
    }
  }
}
</script>
<style lang="scss">
.report {
  .header-area {
    .date-picker {
      width: 365px;
      .el-range-separator {
        min-width: 25px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.report {
  padding: 24px 16px;
  .header-area {
    height: 84px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    padding: 0 24px;
    border-radius: 4px;
    .title {
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
    }
    .filter-wrapper {
      display: flex;
      align-items: center;
      .selector {
        width: 355px;
        margin-right: 16px;
      }
    }
  }
  .data-area {
    .title {
      position: relative;
      font-size: 18px;
      line-height: 28px;
      font-weight: bold;
      text-indent: 12px;
      margin-bottom: 16px;
      color: rgba(0, 11, 21, 0.85);
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        content: ' ';
        height: 16px;
        width: 4px;
        background-color: #01aafc;
        border-radius: 30px;
      }
    }

    .charts-container {
      padding: 28px 24px;
      background: #ffffff;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      border-radius: 4px;
      .charts-name {
        font-size: 18px;
        font-weight: bold;
        color: rgba(0, 11, 21, 0.85);
      }
      .charts-selector {
        width: 300px;
        float: right;
        margin-right: 60px;
      }
    }
  }
  .margin-top-24 {
    margin-top: 24px;
  }
  .margin-bottom-24 {
    margin-bottom: 24px;
  }
  .margin-top-16 {
    margin-top: 16px;
  }
  .margin-top-8 {
    margin-top: 8px;
  }
  .margin-top-56 {
    margin-top: 56px;
  }
  .margin-top-64 {
    margin-top: 64px;
  }
}
</style>
