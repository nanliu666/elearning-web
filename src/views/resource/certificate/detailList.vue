<template>
  <div>
    <page-header title="证书发放明细" />
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
    label: '证书名称',
    prop: 'templateName',
    slot: true,
    minWidth: 120
  },
  {
    label: '获得人数',
    prop: 'grantNum',
    minWidth: 120
  },
  {
    label: '证书类型',
    prop: 'category',
    minWidth: 120
  },
  {
    label: '生效日期',
    prop: 'activeTime',
    minWidth: 120
  },
  {
    label: '有效期',
    prop: '',
    formatter: (row) => (row.bornTime && row.deadTime ? row.bornTime + '~' + row.deadTime : '--'),
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
    minWidth: 50,
    fixed: 'right'
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
      config: { placeholder: '输入证书名称搜索', 'suffix-icon': 'el-icon-search', maxlength: 10 }
    }
  ],
  popoverOptions: [
    {
      type: 'select',
      label: '证书类型',
      data: '',
      field: 'category',
      options: [
        { label: '培训合格证书', value: 0 },
        { label: '聘书', value: 1 }
      ]
    },
    {
      type: 'input',
      label: '颁发机构',
      data: '',
      field: 'awardAgency',
      config: {
        maxlength: 10
      }
    }
  ]
}
import { EXPORT_CERTIFICATE, VIEW_CERTIFICATE } from '@/const/privileges'
import { exportToExcel } from '@/util/util'
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
      this.$router.push({
        path: '/resource/certificate/detail',
        query: { id: row.templateId, title: row.templateName }
      })
    },
    // 批量导出
    exportBatch(select) {
      const templateIds = _.join(_.map(select, 'templateId'), ',')
      exportTemplateExcel({ templateIds }).then((res) => {
        exportToExcel(res)
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
      this.queryInfo.pageNo = 1
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

<style scoped lang="scss">
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
