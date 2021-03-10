<template>
  <div class="Jobs fill">
    <page-header
      title="查看用户"
      show-back
    >
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :config="tableConfig"
        :columns="columnsVisible | columnsFilter"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="currentChange"
        @page-size-change="sizeChange"
      >
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            v-p="EXPORTS_STATIONDETAIL"
            type="text"
            style="margin-bottom: 0"
            element-loading-text="正在导出,请稍后..."
            @click="batchExport(selection)"
          >
            <i class="el-icon-position"></i>
            批量导出
          </el-button>
        </template>
        <template #topMenu>
          <div class="operations">
            <div class="operations__left">
              <seach-popover
                :require-options="searchPopoverConfig.requireOptions"
                @submit="handleSearch"
              />
            </div>
            <div class="operations-right">
              <div
                class="refresh-container"
                @click="refresh"
              >
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <i
                  slot="reference"
                  style="padding-left: 10px; cursor: pointer"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of columns"
                      :key="item.prop"
                      :disabled="item.prop === 'name'"
                      :label="item.prop"
                      class="operations__column--item"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '用户编号',
    prop: 'workNo'
  },
  {
    label: '手机号',
    prop: 'phonenum'
  },
  {
    label: '状态',
    prop: 'userStatus',
    formatter(record) {
      return (
        {
          1: '正常',
          2: '禁用'
        }[record.userStatus] || ''
      )
    }
  },
  {
    label: '部门',
    prop: 'orgName'
  }
]
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入用户名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]

const SEARCH_POPOVER_CONFIG = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
import { EXPORTS_STATIONDETAIL } from '@/const/privileges'
import { dateFormat } from '@/util/date'
import { getOrgUserList } from '@/api/system/user'
export default {
  name: 'JobsDetail',
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      // 默认选中所有列
      columns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      tableColumns: TABLE_COLUMNS,
      tableLoading: false,
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableConfig: {
        showHandler: false,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        handlerColumn: {
          width: '200'
        }
      },
      fullscreenLoading: false,
      filename: '用户列表' + dateFormat(new Date(), 'yyyyMMdd'),
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  computed: {
    EXPORTS_STATIONDETAIL: () => EXPORTS_STATIONDETAIL,
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //  处理页码改变
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData()
    },
    // 输入框搜索
    handleSearch(params) {
      this.loadData(params.name)
    },
    // 加载数据
    async loadData(name) {
      this.tableLoading = true
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        positionId: this.id,
        orgId: 0,
        search: name || ''
      }
      await getOrgUserList(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
        this.tableLoading = false
      })
    },
    // 批量导出
    batchExport(selection) {
      this.fullscreenLoading = true
      selection.forEach((v) => {
        v.userStatus =
          {
            1: '正常',
            2: '禁用'
          }[v.userStatus] || ''
      })
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = this.tableColumns.map((v) => v.label)
        const filterVal = this.tableColumns.map((v) => v.prop)
        const data = this.formatJson(filterVal, selection)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.fullscreenLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
    // 刷新
    refresh() {
      this.searchPopoverConfig.requireOptions[0].data = ''
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
$color_icon: #a0a8ae;
.refresh-container {
  cursor: pointer;
  color: #a0a8ae;
  display: flex;
  align-items: center;
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
  }
}
.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &-right {
    display: flex;
    align-items: center;
    .refresh-container {
      position: relative;
      display: flex;
      align-items: center;
      color: #a0a8ae;
      padding: 0 10px;
      cursor: pointer;
      span {
        padding-left: 6px;
      }
      &::before {
        position: absolute;
        content: '';
        top: 3px;
        right: 0px;
        width: 0.5px;
        height: 80%;
        background-color: #a0a8ae;
      }
    }
  }
  &__column--item {
    height: 25px;
  }
  &__column--visible {
    height: 200px;
    overflow: scroll;
  }
  &:last-child {
    margin: 0;
    // margin-bottom: 8px
    // margin-right: 8px
  }
  i {
    color: $color_icon;
    font-size: 18px;
  }
}
</style>
