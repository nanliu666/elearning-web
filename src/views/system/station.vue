<template>
  <div class="Jobs fill">
    <page-header title="岗位管理">
      <el-button
        slot="rightMenu"
        v-p="ADD_STATION"
        type="primary"
        size="medium"
        @click="addStation"
      >
        创建岗位
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="IMPORT_STATION"
        type="primary"
        size="medium"
        @click="importStation"
      >
        批量导入
      </el-button>
    </page-header>

    <basic-container block>
      <common-table
        ref="multipleTable"
        :key="Math.random()"
        :config="tableConfig"
        :columns="columnsVisible | columnsFilter"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            v-p="EXPORTS_STATION"
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
            <div class="operations-left">
              <seach-popover
                :require-options="searchPopoverConfig.requireOptions"
                @submit="handleSearch"
              />
              <!-- 岗位面包屑 -->
              <div style="display: flex; align-items: center; margin-top: 10px">
                <span>当前岗位层级：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item
                    v-for="(item, index) in positionBreadcrumb"
                    :key="index"
                    style="cursor: pointer"
                    @click.native="index != positionBreadcrumb.length - 1 && goLevel(item)"
                  >
                    <el-tag size="mini">
                      {{ item.label }}
                    </el-tag>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
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
        <template #handler="{ row }">
          <div class="table__handler">
            <el-button
              size="medium"
              type="text"
              @click.stop="() => handleViewUser(row)"
            >
              查看用户
            </el-button>
            <el-button
              size="medium"
              type="text"
              :disabled="positionBreadcrumb.length >= 5"
              @click.stop="() => handleCreateSubordinate(row, 'create')"
            >
              创建下级岗位
            </el-button>
            <el-dropdown
              trigger="hover"
              @command="(command) => handleCommand(command, row)"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-p="EDIT_STATION"
                  command="edit"
                >
                  编辑
                </el-dropdown-item>
                <el-dropdown-item
                  v-p="DELETE_STATION"
                  command="delete"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </common-table>
      <!-- 表单 -->
      <station-form
        ref="stationForm"
        :row-data="rowData"
        :position-breadcrumb="positionBreadcrumb"
        @initData="loadData"
      ></station-form>
    </basic-container>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '岗位名称',
    prop: 'name'
  },
  {
    label: '岗位描述',
    prop: 'remark'
  },
  {
    label: '所属组织',
    prop: 'fullOrg'
  },
  {
    label: '创建人',
    prop: 'creatorName'
  },
  {
    label: '更新时间',
    prop: 'updateTime'
  }
]

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入岗位名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]

const SEARCH_POPOVER_CONFIG = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

import stationForm from './components/stationForm'
import {
  ADD_STATION,
  EXPORTS_STATION,
  DETAIL_STATION,
  EDIT_STATION,
  DELETE_STATION,
  IMPORT_STATION
} from '@/const/privileges'
import { dateFormat } from '@/util/date'
import { getStationParent } from '@/api/system/station'
export default {
  name: 'Jobs',
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    stationForm
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
      tableData: [],
      tableColumns: TABLE_COLUMNS,
      tableLoading: false,
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableConfig: {
        showHandler: true,
        defaultExpandAll: false,
        enableMultiSelect: false,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        lazy: true,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        load: async (tree) => {
          this.loadTree(tree)
        },
        handlerColumn: {
          width: '200',
          fixed: false
        }
      },
      fullscreenLoading: false,
      filename: '岗位列表' + dateFormat(new Date(), 'yyyyMMdd'),
      autoWidth: true,
      bookType: 'xlsx',
      rowData: {},
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      positionBreadcrumb: [
        {
          value: '0',
          label: '顶级岗位'
        }
      ]
    }
  },
  computed: {
    ADD_STATION: () => ADD_STATION,
    EXPORTS_STATION: () => EXPORTS_STATION,
    DETAIL_STATION: () => DETAIL_STATION,
    EDIT_STATION: () => EDIT_STATION,
    DELETE_STATION: () => DELETE_STATION,
    IMPORT_STATION: () => IMPORT_STATION
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.loadData(this.searchPopoverConfig.requireOptions[0].data)
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.loadData(this.searchPopoverConfig.requireOptions[0].data)
    },
    // 查看用户
    handleViewUser(row) {
      this.$router.push({ path: '/system/stationDetail', query: { id: row.id } })
    },
    //批量导入
    importStation() {
      this.$router.push({ path: '/system/importStation' })
    },
    // 创建岗位
    addStation() {
      this.$refs.stationForm.openDialog('创建岗位')
      this.rowData = {}
    },
    // 创建下级岗位
    handleCreateSubordinate(row, type) {
      this.rowData = row
      this.$refs.stationForm.openDialog({ create: '创建下级岗位', edit: '编辑岗位' }[type], type)
    },
    handleSearch: _.debounce(function(params) {
      this.page.currentPage = 1
      this.loadData(params.name)
    }, 500),
    // 加载数据
    async loadData(value) {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        parentId: this.positionBreadcrumb[this.positionBreadcrumb.length - 1].value,
        name: value || ''
      }
      //  { parentId: this.rowData.parentId, isInitData: true } stationForm组件返回数据

      if (value && value.isInitData) {
        // params.parentId = value.parentId
        params.name = ''
      }
      this.tableLoading = true
      await getStationParent(params)
        .then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    // 批量导出
    batchExport(selection) {
      this.fullscreenLoading = true
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
      this.page.currentPage = 1
      this.loadData(this.searchPopoverConfig.requireOptions[0].data)
    },
    // 编辑删除按钮
    handleCommand(command, row) {
      switch (command) {
        case 'edit':
          this.handleCreateSubordinate(row, 'edit')
          break
        case 'delete':
          this.$refs.stationForm.deleteOpe(row)
          break
      }
    },
    async loadTree(tree) {
      this.page.currentPage = 1
      this.positionBreadcrumb.push({ value: tree.id, label: tree.name })
      this.loadData(this.searchPopoverConfig.requireOptions[0].data)
    },
    goLevel(item) {
      this.page.currentPage = 1
      this.positionBreadcrumb = this.positionBreadcrumb.slice(
        0,
        this.positionBreadcrumb.indexOf(item) + 1
      )
      this.loadData(this.searchPopoverConfig.requireOptions[0].data)
    }
  }
}
</script>
<style lang="scss" scoped>
$color_icon: #a0a8ae;
/deep/ .top-menu {
  height: auto !important;
}
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
  //   &-left {
  //     display: flex;
  //     align-items: center;
  //   }
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
<style lang="sass" scoped>
.basic-container--block
    height: calc(100% - 92px)
    min-height: calc(100% - 92px)
.Jobs
  // 添加一个分隔号 "｜"
.table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
        text-align: center
        padding: 0 8px
        margin-left: 0px
        position: relative
    &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
