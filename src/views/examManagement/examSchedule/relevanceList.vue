<template>
  <div class="Menu fill">
    <page-header title="查看关联考卷" />
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
              type="primary"
              size="medium"
              @click="loadTableData"
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
import { getKnowledgeManageList, deleteKnowledgeList } from '@/api/knowledge/knowledge'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '试卷',
    minWidth: 500,
    slot: true,
    prop: 'resName'
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
        pageNo: 1,
        pageSize: 10
      },
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  activated() {
    this.refreshTableData()
  },
  methods: {
    // 删除
    handleDelete(row) {
      this.$message.error(`${row.name}`)
    },
    async multipleDeleteClick(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      await deleteKnowledgeList({ id: selectedIds.join(',') })
      this.$message.success('删除成功')
      this.loadTableData()
    },
    // 预览
    handlePreview(rowData) {
      this.$router.push({ path: '/examManagement/examSchedule/preview', query: { id: rowData.id } })
    },
    // 跳去详情
    jumpDetail({ id }) {
      this.$router.push({
        path: '/repository/knowledgeDetail',
        query: { id }
      })
    },
    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData()
    },
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        let { data } = await getKnowledgeManageList(this.queryInfo)
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
