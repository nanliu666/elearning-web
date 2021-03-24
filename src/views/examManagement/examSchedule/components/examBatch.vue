<template>
  <div class="exam-batch">
    <header class="batch-header">
      <span class="header-title">考生批次</span>
      <el-button
        :disabled="addDisabled"
        size="medium"
        type="primary"
        @click="addBatch"
      >
        增加批次
      </el-button>
    </header>
    <section class="batch-content">
      <ComEmpty v-if="_.size(batchList) === 0" />
      <ul
        v-else
        class="batch-ul"
      >
        <el-alert
          v-if="addDisabled"
          title="试卷已过期无法添加考试批次！"
          type="error"
          style="margin-bottom: 10px"
          :closable="false"
        />
        <li
          v-for="(item, index) in batchList"
          :key="index"
          class="batch-li"
          @click="collapseExpand(index)"
        >
          <header class="li-header">
            <div>
              <i
                :class="[currentExpand !== index ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
                style="margin-right:6px"
              />
              <span>第{{ index + 1 }}批 {{ item.examTime[0] | filterMoment }}~{{
                item.examTime[1] | filterMoment
              }}（共{{ _.size(item.examList) }}人）</span>
            </div>
            <el-button
              v-if="hasDelete(item.examTime)"
              size="medium"
              type="text"
              @click.stop="deleteBatch(index)"
            >
              删除批次
            </el-button>
          </header>
          <ul
            v-if="currentExpand === index"
            class="students-ul"
          >
            <li
              v-for="(studentItem, studentIndex) in item.examList"
              :key="studentIndex"
              class="students-li"
            >
              <span>{{ studentItem.name }}</span>
              <span>手机：{{ studentItem.phoneNum || studentItem.phonenum }}</span>
              <span>部门：{{ studentItem.orgName ? studentItem.orgName : '无部门' }}</span>
              <el-button
                v-if="hasDelete(item.examTime)"
                size="medium"
                type="text"
                @click.stop="deleteBatchItem(index, studentIndex)"
              >
                删除
              </el-button>
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <BatchEdit
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @submit="submitBatch"
    />
  </div>
</template>

<script>
import { getUserList } from '@/api/examManage/schedule'
import moment from 'moment'
import BatchEdit from './batchEdit'
import ComEmpty from '@/components/common-empty/empty'
import { getBatchexaminee } from '@/api/examManage/schedule'
import { mapGetters } from 'vuex'
export default {
  name: 'ExamBatch',
  components: {
    ComEmpty,
    BatchEdit
  },
  filters: {
    filterMoment(data) {
      return moment(data).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentExpand: -1,
      batchList: []
    }
  },
  computed: {
    ...mapGetters(['paperTimeInVuex']),
    addDisabled() {
      // 存在试卷过期时间，并且今天在过期时间之前才可以添加考生批次
      return !_.isEmpty(this.paperTimeInVuex) && moment(new Date()).isAfter(this.paperTimeInVuex)
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 判断是否存在删除按钮
    hasDelete(time) {
      // 今天在开始日期之前
      return moment(new Date()).isSameOrBefore(time[0])
    },
    initData() {
      if (this.$route.query.id && this.$route.query.type !== 'copy') {
        getBatchexaminee({ id: this.$route.query.id }).then((res) => {
          this.batchList = res
        })
      }
    },
    getData(type) {
      return new Promise((resolve) => {
        if (type === 'publish' && _.size(this.batchList) === 0) {
          this.$message.error('考生批次至少存在一批')
          this.$emit('jump')
        } else {
          resolve(this.getHandlerData()) // TODO 提交表单
        }
      })
    },
    getHandlerData() {
      let data = []
      _.each(this.batchList, ({ examList, examTime, id }, index) => {
        let examineeIds = []
        _.each(examList, (item) => {
          examineeIds.push(item.userId)
        })
        data.push({ batchNumber: index, examTime, examineeIds, id })
      })
      return data
    },
    // 拉取公司的直属员工，在map中遍历await
    async handlerData(data) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          let examList = _.groupBy(data.examList, (item) => {
            // 非人员且部门下员工不为0
            return item.type === 'Org'
          })
          let personList = _.filter(data.examList, (item) => {
            return item.type === 'User'
          })
          // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
          if (examList.true) {
            let result = []
            result = await Promise.all(
              examList.true.map(async (item) => {
                return (async () => {
                  return await getUserList({ orgId: item.id })
                })()
              })
            )
            if (_.size(personList)) {
              data.examList = [...examList.false, ..._.flattenDeep(result)]
            } else {
              data.examList = _.flattenDeep(result)
            }
          }
          resolve(data) // 必须要有resolve, await才能生效
        })
      })
    },
    // 检测是否有重叠
    checkOverlap(data) {
      let temp = _.filter(this.batchList, (item) => {
        return _.isEqual(item.examTime, data.examTime)
      })
      // 不为空，有重叠时间段
      if (!_.isEmpty(temp)) {
        this.$message.error('该时间段的批次已存在')
        return false
      } else {
        return true
      }
    },
    // 提交批次后数据处理
    async submitBatch(data) {
      data.examTime = _.map(data.examTime, (item) => {
        return moment(item).format('YYYY-MM-DD HH:mm:ss')
      })
      // 存在时间重叠，则不进行下一步
      if (!this.checkOverlap(data)) return
      await this.handlerData(data)
      this.batchList.push(data)
      this.sortExamTime()
    },
    // 排序
    sortExamTime() {
      // 先用开始时间排序
      // 再用结束时间排序
      this.batchList = _.chain(this.batchList)
        .sortBy((item) => {
          return moment(item.examTime[0])
        })
        .groupBy((item) => {
          return moment(item.examTime[0])
        })
        .map((item) => {
          return _.sortBy(item, (sonitem) => {
            return moment(sonitem.examTime[1])
          })
        })
        .flattenDeep()
        .value()
    },
    addBatch() {
      this.dialogVisible = true
    },
    collapseExpand(index) {
      this.currentExpand = this.currentExpand === index ? -1 : index
    },
    deleteBatch(index) {
      this.batchList.splice(index, 1)
      this.$message.success('删除成功')
    },
    // 删除单独的项，当这个批次内的所有考生都删除后，必须将本批次删除
    deleteBatchItem(index, sonIndex) {
      this.batchList[index].examList.splice(sonIndex, 1)
      if (_.size(this.batchList[index].examList) === 0) {
        this.deleteBatch(index)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.exam-batch {
  background-color: #fff;
  padding: 20px 60px;
  margin-bottom: 30px;
  min-height: calc(100% - 30px);
  margin-bottom: 30px;
  .batch-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
      margin-top: 8px;
    }
  }
  .batch-content {
    margin-top: 20px;
    .batch-ul {
      .batch-li {
        margin-bottom: 20px;
        .li-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f7f8fa;
          border-bottom: 1px solid #e4e7e9;
          padding: 4px 20px 4px 10px;
          height: 40px;
          cursor: pointer;
        }
        .students-li {
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 20px 4px 24px;
          border-bottom: 1px solid #e4e7e9;
          span {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
