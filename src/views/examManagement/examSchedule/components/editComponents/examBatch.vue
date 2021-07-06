<template>
  <div class="exam-batch">
    <header class="batch__header">
      <ul class="batch__ul">
        <li
          v-for="(item, index) in batchList"
          :key="index"
          ref="batchLi"
          class="batch__li"
          :class="{ active__li: activeBatch === index }"
          @click="changeLi(index)"
        >
          <span>
            <span v-if="isShowText">批次</span>
            <span>{{ index + 1 }}</span>
          </span>
          <i
            v-if="hasDeleteFun(item)"
            style="margin: 3px 0 0 4px"
            class="el-icon-close"
            @click.stop="deleteBatch(index)"
          />
        </li>
      </ul>
      <div
        v-if="hasAdd"
        class="batch__li add__button"
        @click="addBatch"
      >
        <i
          class="el-icon-plus"
          style="margin: 3px 4px 0 0px"
        />
        <span>增加批次</span>
      </div>
    </header>
    <ComEmpty v-if="_.size(batchList) === 0" />
    <ul v-else>
      <li
        v-for="(item, index) in batchList"
        :key="index"
      >
        <batch-li
          v-show="index === activeBatch"
          ref="batchLiRef"
          :batch-index="index"
          :batch-data.sync="batchList[index]"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getBatchexaminee } from '@/api/examManage/schedule'
export default {
  provide() {
    return {
      examBatchData: this
    }
  },
  name: 'ExamBatch',
  components: {
    BatchLi: () => import('./batchLi'),
    ComEmpty: () => import('@/components/common-empty/empty')
  },
  data() {
    return {
      isShowText: true,
      activeBatch: -1,
      batchList: []
    }
  },
  computed: {
    // 只有通用考试或者是新增状态或者是复制的考试才能增加考生批次
    hasAdd() {
      const isAdd = !this.id
      const isGenery = this.id && _.get(this.$route, 'query.examType') === 'CurrencyExam'
      const isCopy = _.get(this.$route, 'query.type') === 'copy'
      return isAdd || isGenery || isCopy
    },
    id() {
      return _.get(this.$route, 'query.id')
    },
    ...mapGetters(['paperTimeInVuex']),
    addDisabled() {
      // 存在试卷过期时间，并且今天在过期时间之前才可以添加考生批次
      return !_.isEmpty(this.paperTimeInVuex) && moment(new Date()).isAfter(this.paperTimeInVuex)
    }
  },
  watch: {
    batchList: {
      handler() {
        const batchTextRefWidth = _.get(this.$refs, 'batchLi[0].offsetWidth')
        if (batchTextRefWidth) {
          this.isShowText = batchTextRefWidth > 70
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    hasDeleteFun(item) {
      // 新增批次（id为空）或者编辑且今天在开始日期之前的批次均可以删除
      const isAddBatch = _.get(item, 'id', '') == ''
      const editAndLegalTime =
        !isAddBatch && moment().isSameOrBefore(moment(_.get(item, 'examTime[0]')))
      const target = isAddBatch || editAndLegalTime
      return target
    },
    // 切换批次
    changeLi(index) {
      this.activeBatch = index
    },
    /**
     * 初始化数据
     */
    initData() {
      if (this.$route.query.id && this.$route.query.type !== 'copy') {
        getBatchexaminee({ id: this.$route.query.id }).then((res) => {
          this.batchList = res
          if (_.size(res) !== 0) {
            this.activeBatch = 0
          }
        })
      }
    },
    /**
     * 校验必填以及传输入参
     */
    getData(type) {
      const batchLiRef = this.$refs.batchLiRef
      return new Promise((resolve) => {
        // 草稿可以直接不填批次
        if (type !== 'publish') {
          resolve(this.getHandlerData())
        } else {
          // 点击完成按钮
          this.$emit('jump')
          if (_.size(batchLiRef) === 0) {
            this.$message.error('考生批次至少存在一批')
          } else {
            Promise.all(
              _.map(batchLiRef, (item) => {
                return item.getData()
              })
            )
              .then(() => {
                // 所有批次的校验都通过
                resolve(this.getHandlerData())
              })
              .catch((error) => {
                // 跳转到未填写的批次
                this.changeLi(error)
              })
          }
        }
      })
    },
    /**
     * 转化成后端需要的入参
     */
    getHandlerData() {
      let params = []
      _.each(this.batchList, (item, index) => {
        const { examList, orgList, positionList, classroomId, id, examTime } = item
        const examineeIds = _.map(examList, 'bizId')
        const orgIds = _.map(orgList, 'id')
        const positionIds = _.map(positionList, 'positionId')
        params.push({
          batchNumber: index,
          examTime,
          examineeIds,
          id,
          classroomId,
          orgIds,
          positionIds
        })
      })
      return params
    },
    // 新增批次
    addBatch() {
      if (_.size(this.batchList) === 10) {
        this.$message.error('批次最多可建10批')
      } else if (this.addDisabled) {
        this.$message.error('试卷已过期无法添加考试批次！')
      } else {
        const BATCH_INIT = {
          id: '',
          batchNumber: 0,
          classroomId: '',
          classroomName: '',
          examList: [],
          orgList: [],
          positionList: [],
          examTime: []
        }
        this.batchList.push(BATCH_INIT)
        this.activeBatch = this.activeBatch === -1 ? 0 : (this.activeBatch += 1)
      }
    },
    // 删除当前批次
    deleteBatch(index) {
      this.batchList.splice(index, 1)
      this.$message.success('删除成功')
      this.activeBatch -= 1
    }
  }
}
</script>

<style scoped lang="scss">
.exam-batch {
  min-height: calc(100% - 30px);
  .batch__header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .batch__li {
      background-color: #f5f6f6;
      color: #000000;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      border-radius: 4px;
      width: 122px;
      height: 50px;
      cursor: pointer;
    }
    .add__button {
      flex-shrink: 0;
    }
    .batch__ul {
      display: flex;
      overflow: auto;
      .active__li {
        background-color: #207efa;
        color: #ffffff;
      }
    }
  }
}
</style>
