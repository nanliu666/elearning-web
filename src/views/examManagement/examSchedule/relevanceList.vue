<template>
  <div class="Menu fill">
    <page-header
      title="查看关联考卷"
      show-back
    />
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="topMenu">
            <span>预生成试卷列表</span>
            <el-button
              :disabled="disabled"
              type="primary"
              size="medium"
              @click="loadTableData('refresh')"
            >
              重新生成试卷
            </el-button>
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="multipleDeleteClick(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{row}">
          <el-button
            type="text"
            class="top-button"
            @click="handlePreview(row)"
          >
            预览试卷
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getPreviewList, delExamPreview, generatePreviewList } from '@/api/examManage/schedule'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '试卷',
    minWidth: 500,
    slot: true,
    prop: 'name'
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  showIndexColumn: false,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}

export default {
  name: 'KnowledgeManagement',
  data() {
    return {
      // 默认选中所有列
      columnsVisible: TABLE_COLUMNS,
      // 请求参数
      queryInfo: {
        examId: '',
        paperId: ''
      },
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  computed: {
    disabled() {
      return false
    }
  },
  activated() {
    // 现在手动生成
    this.loadTableData('refresh')
  },
  methods: {
    // 单个删除删除
    handleDelete(row) {
      delExamPreview({ id: row.id }).then(() => {
        this.$message.success('删除成功')
        this.loadTableData('start')
      })
    },
    // 批量删除
    multipleDeleteClick(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      delExamPreview({ id: selectedIds.join(',') }).then(() => {
        this.$message.success('删除成功')
        this.loadTableData('start')
      })
    },
    // 预览
    handlePreview(rowData) {
      this.$router.push({
        path: '/examManagement/examSchedule/preview',
        query: { paperId: rowData.id }
      })
    },
    // 加载表格数据
    async loadTableData(type) {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        this.tableData = []
        let { paperId, examId, maxNum } = this.$route.query
        let commomFarams = { paperId, examId }
        const loadFun = type === 'start' ? getPreviewList : generatePreviewList
        const params = type === 'start' ? commomFarams : _.assign(commomFarams, { maxNum })
        let { data } = await loadFun(params)
        this.tableData = data
      } catch (error) {
        window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$color_icon: #a0a8ae;
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .topMenu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1e1e1e;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
