<template>
  <div>
    <page-header
      :title="$route.query.title || '查看详情'"
      show-back
    />
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
            v-p="EXPORT_CERTIFICATE_DETAIL"
            type="text"
            icon="el-icon-sold-out"
            @click="exportBatch(selection)"
          >
            批量导出
          </el-button>
          <el-button
            v-p="REVOKE_CERTIFICATE_DETAIL"
            type="text"
            icon="el-icon-sold-out"
            @click="revokeCertificateFun(selection)"
          >
            批量撤回
          </el-button>
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="REVOKE_CERTIFICATE_DETAIL"
              :disabled="row.status === '2'"
              type="text"
              @click="revokeCertificateFun(row)"
            >
              撤回证书
            </el-button>
            <el-button
              v-if="false"
              v-p="SOURCE_CERTIFICATE_DETAIL"
              type="text"
              @click="viewCertificate(row)"
            >
              查看来源
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
    label: '姓名',
    prop: 'stuName',
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phonenum',
    slot: true,
    minWidth: 120
  },
  {
    label: '部门',
    prop: 'deptName',
    minWidth: 120
  },
  {
    label: '获得时间',
    prop: 'grantTime',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'status',
    formatter(data) {
      return data.status == '1' ? '已获得' : '已撤销'
    },
    minWidth: 120
  },
  {
    label: '撤回时间',
    prop: 'revokeTime',
    formatter(data) {
      return _.isEmpty(data.revokeTime) ? '--' : data.revokeTime
    },
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150
  }
}
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'stuName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入姓名搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'dataPicker',
      label: '日期范围',
      data: '',
      field: 'startTime,endTime',
      config: {
        type: 'datetimerange',
        'range-separator': '至',
        'value-format': 'yyyy-MM-dd HH:mm:ss'
      }
    },
    {
      type: 'treeSelect',
      field: 'parentOrgId',
      label: '部门',
      data: '',
      config: {
        selectParams: {
          placeholder: '请选择部门',
          multiple: false
        },
        treeParams: {
          data: [],
          'check-strictly': true,
          'default-expand-all': false,
          'expand-on-click-node': false,
          clickParent: true,
          filterable: false,
          props: {
            children: 'children',
            label: 'orgName',
            disabled: 'disabled',
            value: 'orgId'
          }
        }
      }
    },
    {
      type: 'input',
      field: 'batchNumber',
      label: '手机号',
      data: ''
    },
    {
      type: 'select',
      data: '',
      field: 'status',
      label: '状态',
      options: [
        { label: '已获得', value: 'Yes' },
        { label: '已撤销', value: 'No' }
      ]
    }
  ]
}
import {
  EXPORT_CERTIFICATE_DETAIL,
  SOURCE_CERTIFICATE_DETAIL,
  REVOKE_CERTIFICATE_DETAIL
} from '@/const/privileges'
import { mapGetters } from 'vuex'
import SearchPopover from '@/components/searchPopOver/index'
import {
  getCertificateGrantList,
  revokeCertificate,
  exportGrantExcel
} from '@/api/certificate/certificate'
import { getOrgTreeSimple } from '@/api/org/org'
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
        pageSize: 10,
        templateId: ''
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
    EXPORT_CERTIFICATE_DETAIL: () => EXPORT_CERTIFICATE_DETAIL,
    REVOKE_CERTIFICATE_DETAIL: () => REVOKE_CERTIFICATE_DETAIL,
    SOURCE_CERTIFICATE_DETAIL: () => SOURCE_CERTIFICATE_DETAIL,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          SOURCE_CERTIFICATE_DETAIL,
          REVOKE_CERTIFICATE_DETAIL
        ])
      },
      deep: true
    }
  },
  created() {
    this.queryInfo.templateId = this.$route.query.id
  },
  activated() {
    this.loadTableData()
    const parentOrgIdConfig = _.find(this.searchConfig.popoverOptions, { field: 'parentOrgId' })
    getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
      _.set(parentOrgIdConfig, 'config.treeParams.data', res)
    })
  },
  methods: {
    // 查看来源
    viewCertificate() {},
    // 撤回证书
    revokeCertificateFun(row) {
      const isBatch = _.isArray(row)
      const canRevokeList = _.filter(row, (item) => {
        return item.status === '1'
      })
      const revokeTips = isBatch
        ? `您确定要为${_.get(canRevokeList, '[0].stuName')}等${_.size(
            canRevokeList
          )}个学员撤回证书吗？`
        : `您确定要撤回${row.stuName}的证书吗？`
      const ids = isBatch ? _.map(canRevokeList, 'id') : [row.id]
      this.$confirm(revokeTips, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        revokeCertificate({ ids }).then(() => {
          this.loadTableData()
          this.$message.success('撤回证书成功')
        })
      })
    },
    // 批量导出
    exportBatch(select) {
      const ids = _.join(_.map(select, 'id'), ',')
      exportGrantExcel({ ids }).then((res) => {
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
      console.log('params:', params)
      let currentStatus = ''
      if (params.status && params.status === 'No') {
        currentStatus = '2'
      } else if (params.status && params.status === 'Yes') {
        currentStatus = '1'
      } else {
        currentStatus = ''
      }
      let currentParams = {
        pageNo: 1,
        pageSize: this.queryInfo.pageSize,
        stuName: params.stuName,
        templateId: this.queryInfo.templateId,
        deptCode: params.parentOrgId ? params.parentOrgId : '',
        phonenum: params.batchNumber,
        status: currentStatus,
        dateRange: `${params.startTime ? params.startTime : ''}~${
          params.endTime ? params.endTime : ''
        }`
      }
      this.queryInfo = currentParams
      this.loadTableData()
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getCertificateGrantList(this.queryInfo)
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
