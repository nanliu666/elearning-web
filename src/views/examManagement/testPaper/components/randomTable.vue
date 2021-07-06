<template>
  <div>
    <common-table
      ref="table"
      :columns="tableColumns"
      :config="tableConfig"
      :data="tableData"
    >
      <template #index="{$index}">
        {{ $index + 1 }}
      </template>
      <template #handler="{row, $index}">
        <el-button
          type="text"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
        <el-button
          type="text"
          :disabled="$index === 0"
          @click="moveUp($index)"
        >
          上移
        </el-button>
        <el-button
          type="text"
          :disabled="$index === tableData.length - 1"
          @click="moveDown($index)"
        >
          下移
        </el-button>
      </template>
    </common-table>
    <add-topic-dialog
      v-if="addTopicVisible"
      :visible.sync="addTopicVisible"
      :topic-data="topicData"
      @submit="submitTopic"
    />
  </div>
</template>
<script>
import AddTopicDialog from './addTopicDialog'
import { QUESTION_TYPE_MAP_TOTAL } from '@/const/examMange'
const TABLE_COLUMNS = [
  {
    label: '序号',
    prop: 'index',
    slot: true,
    align: 'center',
    minWidth: 80
  },
  {
    label: '试题类型',
    formatter: (row) => QUESTION_TYPE_MAP_TOTAL[row.type],
    prop: 'type',
    minWidth: 120
  },
  {
    label: '试题来源',
    prop: 'categoryTitles',
    formatter: (row) => _.join(row.categoryTitles, ','),
    minWidth: 220
  },
  {
    label: '试卷试题数',
    prop: 'questionNum',
    minWidth: 145
  },
  {
    label: '单题分数',
    prop: 'score',
    minWidth: 145
  },
  {
    label: '大题题目',
    prop: 'title',
    minWidth: 145
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: false, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 180
  }
}
export default {
  name: 'RandomTable',
  components: {
    AddTopicDialog
  },
  data() {
    return {
      addTopicVisible: false,
      topicData: {},
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS
    }
  },
  created() {},
  methods: {
    submitTopic(data) {
      const index = _.findIndex(this.tableData, (item) => item.id === data.id)
      if (index === -1) {
        this.tableData.push(data)
      } else {
        this.$set(this.tableData, index, data)
      }
      this.$emit('countScore')
    },
    /**
     * @desc 添加题目
     * */
    handleAddTopic() {
      this.addTopicVisible = true
      this.topicData = {}
    },
    /**
     * @desc 试题设置里的行操作删除
     * */
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => it.id !== row.id)
      this.$emit('countScore')
    },
    handleEdit(row) {
      this.addTopicVisible = true
      this.topicData = row
    },
    moveUp(index) {
      const sourceIndex = index
      const targetIndex = index - 1
      this.moveFun(sourceIndex, targetIndex)
    },
    moveDown(index) {
      const sourceIndex = index
      const targetIndex = index + 1
      this.moveFun(sourceIndex, targetIndex)
    },
    moveFun(sourceIndex, targetIndex) {
      this.tableData[sourceIndex] = this.tableData.splice(
        targetIndex,
        1,
        this.tableData[sourceIndex]
      )[0]
    }
  }
}
</script>
<style scoped lang="scss"></style>
