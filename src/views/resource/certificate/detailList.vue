<template>
  <div>
    <page-header title="发放明细" />
    <basic-container>
      <common-table
        ref="table"
        :columns="tableColumns"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <search-popover
            ref="searchPopover"
            :require-options="searchConfig.requireOptions"
            :popover-options="searchConfig.popoverOptions"
            @submit="handleSearch"
          />
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-sold-out"
            @click="exportBatch(selection)"
          >
            批量导出
          </el-button>
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="VIEW_CERTIFICATE"
              type="text"
              @click="viewCertificate(row)"
            >
              查看
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '模板编号',
    prop: 'templateId',
    slot: true,
    minWidth: 150
  },
  {
    label: '模板名称',
    prop: 'templateName',
    slot: true,
    minWidth: 120
  },
  {
    label: '发放人数',
    prop: 'grantNum',
    minWidth: 120
  },
  {
    label: '颁发机构',
    prop: 'awardAgency',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'templateId',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 50
  }
}
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'templateName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '输入证书名称/编号搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: []
}
import { EXPORT_CERTIFICATE, VIEW_CERTIFICATE } from '@/const/privileges'
import { mapGetters } from 'vuex'
import SearchPopover from '@/components/searchPopOver/index'
import { getCertificateGrantDetail, exportTemplateExcel } from '@/api/certificate/certificate'
export default {
  components: { SearchPopover },
  data() {
    return {
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      searchConfig: SEARCH_CONFIG
    }
  },
  computed: {
    EXPORT_CERTIFICATE: () => EXPORT_CERTIFICATE,
    VIEW_CERTIFICATE: () => VIEW_CERTIFICATE,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([VIEW_CERTIFICATE])
      },
      deep: true
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    // 查看
    viewCertificate(row) {
      // tagName: row.templateName
      this.$router.push({
        path: '/resource/certificate/detail',
        query: { id: row.id, title: row.templateName }
      })
    },
    // 批量导出
    exportBatch(select) {
      const templateIds = _.join(_.map(select, 'templateId'), ',')
      exportTemplateExcel({ templateIds }).then((res) => {
        const { data, headers } = res
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
        const blob = new Blob([data], { type: headers['content-type'] })
        let dom = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        dom.href = url
        dom.download = decodeURI(fileName)
        dom.style.display = 'none'
        document.body.appendChild(dom)
        dom.click()
        dom.parentNode.removeChild(dom)
        window.URL.revokeObjectURL(url)
      })
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.loadTableData()
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getCertificateGrantDetail(this.queryInfo)
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
