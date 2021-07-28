<template>
  <section class="main__container">
    <common-form
      ref="formRef"
      :model="batchData"
      :columns="columns"
    >
      <template #classroomId-label-slot>
        <div class="classroom__label">
          <span>
            <span>考试教室</span>
            <el-tooltip
              style="margin-left: 4px"
              effect="dark"
              content="若考试时间跨天，则无法选择教室"
              placement="top-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <!-- 编辑的时候，同一天的进行中、已完成的的批次的教室的操作需要置灰 -->
          <span
            class="classroom__title"
            :class="{ active__title: !classroomDisabled && hasDelete }"
            @click="viewReserve"
          >
            预览教室
          </span>
        </div>
      </template>
      <!-- 没有删除权限或者跨天置灰 -->
      <template #classroomId>
        <div class="classroom__container">
          <lazy-select
            ref="classroomRef"
            v-model="batchData.classroomId"
            :disabled="!hasDelete || classroomDisabled"
            :searchable="true"
            :first-option="classroomDefault"
            :option-props="{ label: 'roomName', value: 'id', key: 'id' }"
            :load="loadClassroom"
            :payload-params="reserveParams"
            @select="selectClassroom"
          />
        </div>
      </template>
    </common-form>
    <div class="select__person">
      <div class="common__container">
        <div class="title__box">
          <div class="title__left">
            <div class="left">
              <span style="color: #f56c6c; margin-right: 4px">*</span>
              <span>关联人员</span>
            </div>
            <div class="right">
              <span>人数：</span>
              <span>
                <span>{{ totalNum }}</span>
                <span>人</span>
              </span>
            </div>
          </div>
          <div class="title__right">
            <el-input
              v-model="search"
              placeholder="请搜索人员"
            />
          </div>
        </div>
      </div>
      <batch-org :org-data.sync="batchData.orgList" />
      <batch-position :position-data.sync="batchData.positionList" />
      <batch-person :person-data.sync="batchData.examList" />
    </div>
    <classroom-reserve
      :visible.sync="reserveVisible"
      :params="reserveParams"
    />
  </section>
</template>
<script>
import { getBookList } from '@/api/train/train'
import { COLUMNS_CONFIGS } from '@/views/examManagement/examSchedule/components/batchComponents/personConfig'
import { userCheck } from '@/api/train/train'
const nzhcn = require('nzh/cn')
import moment from 'moment'
export default {
  name: 'BatchLi',
  inject: ['examBatchData'],
  provide() {
    return {
      batchLiData: this
    }
  },
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect'),
    ClassroomReserve: () => import('@/views/training/components/drawerComponents/ClassroomReserve'),
    BatchOrg: () =>
      import('@/views/examManagement/examSchedule/components/batchComponents/batchOrg'),
    BatchPosition: () =>
      import('@/views/examManagement/examSchedule/components/batchComponents/batchPosition'),
    BatchPerson: () =>
      import('@/views/examManagement/examSchedule/components/batchComponents/batchPerson')
  },
  props: {
    batchData: {
      type: Object,
      default: () => {
        return {
          examTime: [], // 考试开始结束时间
          classroomId: '' // 考试教室
        }
      }
    },
    batchIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      orgIdsList: [], // 搜索用户的部门id结果
      positionIdsList: [], // 搜索用户的部门id结果
      reserveParams: {},
      search: '',
      classroomDefault: [],
      reserveVisible: false,
      columns: _.cloneDeep(COLUMNS_CONFIGS)
    }
  },
  computed: {
    // 新增批次（id为空）或者编辑且今天在开始日期之前的批次均可以删除或者是草稿
    hasDelete() {
      const isAddBatch = _.get(this.batchData, 'id', '') == ''
      const isDraft = _.get(this.$route, 'query.isDraft', 0) == 1 // // 0-已发布，1-草稿箱
      const editAndLegalTime =
        !isAddBatch && moment().isBefore(moment(_.get(this.batchData, 'examTime[0]')))
      const target = isAddBatch || editAndLegalTime || isDraft
      return target
    },
    totalNum() {
      const orgNum = _.sum(_.map(this.batchData.orgList, 'workNum'))
      const positionNum = _.sum(_.map(this.batchData.positionList, 'workNum'))
      const person = _.size(this.batchData.examList)
      return _.sum([Number(orgNum), Number(positionNum), Number(person)])
    },
    isOnline() {
      return _.get(this.$route, 'query.examPattern', 'general') === 'general'
    },
    // 第几批
    batchCH() {
      return `第${nzhcn.encodeS(this.batchIndex + 1)}批`
    },
    // 教室的置灰规则
    classroomDisabled() {
      const { todoDate, secondDate } = this.getTimeFormatter()
      // 未跨天
      const startSameEnd = todoDate && todoDate == secondDate
      const target = !startSameEnd
      return target
    }
  },
  watch: {
    // 监听删除权限，控制时间置灰
    hasDelete: {
      handler(val) {
        const examTimeProp = _.find(this.columns, { prop: 'examTime' })
        examTimeProp.disabled = !val
      },
      deep: true,
      immediate: true
    },
    search: _.debounce(function(newName, oldName) {
      if (!newName || newName == oldName) return
      this.searchNameFun()
    }, 1000),
    isOnline: {
      handler() {
        this.setClassrommRules()
      },
      deep: true,
      immediate: true
    },
    'batchData.examTime': {
      handler() {
        this.setReserveParams()
        this.setExamTimeRule()
      },
      deep: true,
      immediate: true
    },
    // 设置教室默认值
    'batchData.classroomId': {
      handler(val) {
        if (val) {
          this.classroomDefault = [
            {
              roomName: this.batchData.roomName,
              id: val
            }
          ]
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 维护每个批次内部的获取入参逻辑
     */
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.formRef
          .validate()
          .then(() => {
            if (this.totalNum === 0) {
              this.$message.error(`${this.batchCH}的关联人数为0`)
              reject(this.batchIndex)
            } else {
              resolve()
            }
          })
          .catch(() => {
            this.$nextTick(() => {
              this.$message.error(`${this.batchCH}的必填项未填`)
            })
            reject(this.batchIndex)
          })
      })
    },
    /**
     * 考试时间的校验规则
     */
    setExamTimeRule() {
      const examTimeProp = _.find(this.columns, { prop: 'examTime' })
      const isBetween = this.getIsBetween()
      // 存在重叠时段，必须触发考试时间校验
      examTimeProp.rules[1].validator = (rule, value, callback) => {
        if (isBetween) {
          return callback(new Error('存在相同时段'))
        } else {
          callback()
        }
      }
    },
    /**
     * 获取当前时间是否为存在完全相同时段
     */
    getIsBetween() {
      const { batchList } = this.examBatchData
      const examTimeList = _.map(batchList, 'examTime')
      // 完全相同时段：存在两个一模一样的元素（开始时间与结束时间一致）
      let isSame1 = false // 与前一个比较
      let isSame2 = false // 与后一个比较
      _.reduce(examTimeList, (prev, cur) => {
        isSame1 = _.isEqual(cur, prev)
      })
      _.reduce(examTimeList, (prev, cur) => {
        isSame2 = _.isEqual(prev, cur)
      })
      // 最终此二维数组内有无重叠时间段
      return _.some([isSame1, isSame2], Boolean)
    },
    /**
     * 设置教室查询参数以及教室的必填校验规则的处理
     */
    setReserveParams() {
      const { todoDate, startTime, endTime } = this.getTimeFormatter()
      // 必须是同一天才会去设置考试教室必填
      this.setClassrommRules()
      if (!this.classroomDisabled) {
        this.reserveParams = {
          todoDate,
          startTime,
          endTime
        }
      }
    },
    /**
     * 获取指定的时间格式
     */
    getTimeFormatter() {
      // [YYYY-MM-DD HH:mm:ss, YYYY-MM-DD HH:mm:ss]
      // 需要开始时间YYYY-MM-DD相同
      const { examTime } = this.batchData
      const todoDate = _.get(_.split(_.get(examTime, '[0]'), ' '), '[0]') // 取第一天的年月日
      const startTime = _.get(_.split(_.get(examTime, '[0]'), ' '), '[1]') // 取第一天的时分秒
      const secondDate = _.get(_.split(_.get(examTime, '[1]'), ' '), '[0]') // 取第二天的年月日
      const endTime = _.get(_.split(_.get(examTime, '[1]'), ' '), '[1]') // 取第二天的年月日
      return { todoDate, startTime, secondDate, endTime }
    },
    // 搜索名字
    async searchNameFun() {
      const { orgList, positionList } = this.batchData
      const orgIds = _.map(orgList, 'id')
      const positionIds = _.map(positionList, 'positionId')
      const params = { userName: _.trim(this.search), orgIds, positionIds }
      const res = await userCheck(params)
      this.orgIdsList = _.uniq(_.flattenDeep(_.map(res, 'orgIds')))
      this.positionIdsList = _.uniq(_.flattenDeep(_.map(res, 'positionIds')))
    },
    /**
     * 设置教室的必填规则如下：
     * 考试时间跨天置灰
     * 线下必填
     */
    setClassrommRules() {
      const classroomProp = _.find(this.columns, { prop: 'classroomId' })
      // 线下必填
      classroomProp.required = !this.isOnline
      // 跨天置灰
      classroomProp.disabled = !this.classroomDisabled
    },
    // 加载教室
    loadClassroom(params) {
      if (_.size(_.get(params, 'search')) > 32) {
        this.$message.error('您输入的教室名称过长，无法搜索！')
      } else {
        return getBookList(params)
      }
    },
    // 选择了教室的数据处理。教室名称赋值
    selectClassroom(data) {
      _.set(this.batchData, 'classroomName', data.roomName)
    },
    // 查看预定情况
    viewReserve() {
      if (this.classroomDisabled) return
      this.reserveVisible = true
    }
  }
}
</script>
<style scoped lang="scss">
@import '../batchComponents/person.scss';
.main__container {
  .classroom__title {
    float: right;
    font-size: 12px;
    color: #dadada;
  }
  .active__title {
    cursor: pointer;
    color: #53b2fd;
  }
  .select__person {
  }
  .classroom__label {
    display: flex;
    justify-content: space-between;
  }
}
</style>
