<template>
  <div class="exam-batch">
    <header class="batch-header">
      <span class="header-title">考生批次</span>
      <el-button
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
        <li
          v-for="(item, index) in batchList"
          :key="index"
          class="batch-li"
          @click="collapseExpand(index)"
        >
          <header class="li-header">
            <div>
              <i
                class="el-icon-arrow-down"
                style="margin-right:6px"
              />
              <span>第{{ index + 1 }}批 {{ item.fixedTime[0] | filterMoment }}~{{
                item.fixedTime[1] | filterMoment
              }}（共{{ _.size(item.trainObjectsList) }}人）</span>
            </div>
            <el-button
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
              v-for="(studentItem, studentIndex) in item.trainObjectsList"
              :key="studentIndex"
              class="students-li"
            >
              <span>{{ studentItem.name }}</span>
              <span>手机：{{ studentItem.phone }}</span>
              <span>部门：{{ studentItem.part }}</span>
              <el-button
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
import moment from 'moment'
import BatchEdit from './batchEdit'
import ComEmpty from '@/components/common-empty/empty'
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
  created() {},
  methods: {
    submitBatch(data) {
      this.batchList.push(data)
      // 先用开始时间排序
      this.batchList = _.sortBy(this.batchList, (item) => {
        return item.fixedTime[0]
      })
      // 再用结束时间排序
      this.batchList = _.sortBy(this.batchList, (item) => {
        return item.fixedTime[1]
      })
    },
    addBatch() {
      this.dialogVisible = true
    },
    collapseExpand(index) {
      this.currentExpand = this.currentExpand === index ? -1 : index
    },
    deleteBatch(index) {
      this.batchList.splice(index, 1)
    },
    // 删除单独的项，当这个批次内的所有考生都删除后，必须将本批次删除
    deleteBatchItem(index, sonIndex) {
      this.batchList[index].trainObjectsList.splice(sonIndex, 1)
      if (_.size(this.batchList[index].trainObjectsList) === 0) {
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
      font-size: 16px;
      color: #1e1e1e;
      font-weight: 550;
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
        }
      }
    }
  }
}
</style>
