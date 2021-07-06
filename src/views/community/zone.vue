<template>
  <div class="zone">
    <page-header title="专区管理">
      <el-button
        slot="rightMenu"
        v-p="ADD_ZONE"
        size="medium"
        type="primary"
        @click="addZone"
      >
        创建专区
      </el-button>
    </page-header>
    <basic-container>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <seach-popover
              ref="seachPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations__btns">
              <el-tooltip
                class="operations__btns--tooltip"
                content="刷新"
                effect="dark"
                placement="top"
                style="color: #acb3b8"
              >
                <el-button
                  class="operations__btns--item"
                  size="mini"
                  icon="el-icon-refresh-right"
                  style="font-size: 18px"
                  type="text"
                  @click="refresh"
                >
                </el-button>
              </el-tooltip>
              <span
                class="text_refresh"
                style="cursor: pointer; font-size: 18px; color: #acb3b8; margin-right: 20px"
                @click="refresh"
              >刷新</span>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <el-tooltip
                  slot="reference"
                  class="operations__btns--tooltip"
                  content="显隐"
                  effect="dark"
                  placement="top"
                >
                  <i
                    class="el-icon-setting"
                    style="color: #acb3b8; font-size: 18px; margin-left: 0px"
                  />
                </el-tooltip>

                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
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
        <template #multiSelectMenu="{ selection }">
          <el-button
            v-p="DEL_ZONE"
            style="margin-bottom: 0"
            type="text"
            @click="batchDel(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{ row }">
          <el-button
            v-if="!!row.status"
            v-p="STOP_ZONE"
            type="text"
            @click="stopAndStart(row.id, true)"
          >
            停用
          </el-button>
          <el-button
            v-else
            v-p="STOP_ZONE"
            type="text"
            @click="stopAndStart(row.id, false)"
          >
            启用
          </el-button>
          <el-button
            v-p="EDIT_ZONE"
            type="text"
            @click="editZone(row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-p="DEL_ZONE"
            type="text"
            @click="delZone(row.id)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { ADD_ZONE, DEL_ZONE, EDIT_ZONE, STOP_ZONE } from '@/const/privileges'
import { zoneList, delZone, stopZone, startZone, batchDel } from '@/api/community/zone'
import { getOrgTreeSimple } from '@/api/org/org'
import { mapGetters } from 'vuex'
const TABLE_COLUMNS = [
  {
    label: '专区名称',
    prop: 'name',
    slot: true
  },
  {
    label: '专区人数',
    prop: 'totalUserNum'
  },
  {
    label: '关注数',
    prop: 'totalFocusNum'
  },
  {
    label: '发帖数量',
    prop: 'totalTopicNum'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  }
]
const TABLE_CONFIG = {
  enableMultiSelect: true,
  showHandler: true,
  handlerColumn: {
    label: '操作',
    minWidth: 150
  },
  highlightSelect: true,
  rowKey: 'id'
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入专区名称' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    data: '',
    field: 'orgId',
    label: '部门',
    type: 'treeSelect',
    config: {
      multiple: true,
      selectParams: {
        placeholder: '请选择'
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
          value: 'id'
        }
      }
    }
  }
]
const searchConfig = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  data() {
    return {
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      searchPopoverConfig: searchConfig,
      searchParams: {
        name: '',
        orgId: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
        return v
      })
    }
  },
  computed: {
    STOP_ZONE: () => STOP_ZONE,
    ADD_ZONE: () => ADD_ZONE,
    DEL_ZONE: () => DEL_ZONE,
    EDIT_ZONE: () => EDIT_ZONE,
    ...mapGetters(['privileges'])
  },
  watch: {
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([STOP_ZONE, ADD_ZONE, DEL_ZONE, EDIT_ZONE])
      },
      deep: true
    }
  },
  async activated() {
    this.tableLoading = true
    const res = await getOrgTreeSimple({ parentOrgId: 0 })
    this.searchPopoverConfig.popoverOptions[0].config.treeParams.data = res
    this.getData()
  },
  methods: {
    // 获取专区数据
    async getData() {
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchParams
      }
      try {
        const res = await zoneList(params)
        this.tableData = res.data
        this.page.total = res.totalNum
      } finally {
        this.tableLoading = false
      }
    },

    handleCurrentPageChange(params) {
      this.page.currentPage = params
      this.getData()
    },
    handlePageSizeChange(params) {
      this.page.currentPage = 1
      this.page.pageSize = params
      this.getData()
    },
    handleSearch(searchParams) {
      this.searchParams = searchParams
      this.page.currentPage = 1
      this.getData()
    },
    // 添加专区
    addZone() {
      this.$router.push({
        path: '/community/addOrEdit',
        query: {
          tagName: '创建专区'
        }
      })
    },

    // 刷新
    refresh() {
      this.page.currentPage = 1
      this.getData()
    },
    // 编辑
    editZone(id) {
      this.$router.push({
        path: '/community/addOrEdit',
        query: {
          tagName: '编辑专区',
          id
        }
      })
    },
    // 停用与启用
    async stopAndStart(id, flag) {
      const str = flag
        ? '停用后，所有人看不到该专区，是否继续？'
        : '启用后，所有人可以看到该专区，是否继续？'
      await this.$confirm(str, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      flag ? await stopZone(id) : await startZone(id)
      this.refresh()
    },
    // 删除
    async delZone(id) {
      await this.$confirm('删除后，专区所有信息包括专家和帖子，都会删除，请谨慎操作。', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await delZone(id)
      this.refresh()
    },
    // 批量删除
    async batchDel(data) {
      await this.$confirm('删除后，专区所有信息包括专家和帖子，都会删除，请谨慎操作。', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let params = ''
      data.forEach((item) => {
        params += item.id + ','
      })
      params.slice(0, -1)
      await batchDel(params)
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.operations {
  align-items: center;
  display: flex;
  justify-content: space-between;
  &__column--item {
    height: 25px;
  }
  &__column--visible {
    height: 200px;
    overflow: scroll;
  }
  &__btns {
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: flex-start;
  }
  &__btns--item {
    margin: 0;
    margin-right: 4px;
    padding: 0;
    height: 24px;
    width: 24px;
    line-height: 24px;
    &:last-child {
      margin: 0;

      .iconfont {
        font-weight: bold;
        font-size: 16px;
      }
      .Menu {
        .table__handler {
          display: flex;
          justify-content: flex-end;
          > .el-button--text {
            text-align: center;
            padding: 0 8px;
            margin-left: 0px;
            position: relative;
            &:not(:last-child)::after {
              background-color: #e3e7e9;
              content: '';
              height: 10px;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
            }
          }
        }
      }
    }
  }
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
