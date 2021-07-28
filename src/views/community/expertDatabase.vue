<template>
  <div class="zone">
    <page-header title="专家库">
      <el-button
        slot="rightMenu"
        v-p="ADD_EXPERT"
        size="medium"
        type="primary"
        @click="add"
      >
        创建专家
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
            v-p="DEL_EXPERT"
            style="margin-bottom: 0"
            type="text"
            @click="batchDel(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{ row }">
          <el-button
            v-p="EDIT_EXPERT"
            type="text"
            @click="edit(row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-p="DEL_EXPERT"
            type="text"
            @click="del(row.id)"
          >
            删除
          </el-button>
        </template>
        <template #name="{ row }">
          <el-button
            type="text"
            @click.stop.prevent="look(row.id)"
          >
            {{ row.name }}
          </el-button>
        </template>
      </common-table>
    </basic-container>
    <updateExpert
      :dialog-visible="dialogVisible"
      :title="title"
      :expert-id="expertId"
      @cancle="closeDialog"
    />
  </div>
</template>

<script>
import { ADD_EXPERT, DEL_EXPERT, EDIT_EXPERT } from '@/const/privileges'
import { mapGetters } from 'vuex'
import { getExpertList, delExpert, batchDel, queryZone } from '@/api/community/expertDatabase'
const TABLE_COLUMNS = [
  {
    label: '专家名称',
    prop: 'name',
    slot: true
  },
  {
    label: '所属专区',
    prop: 'areaName',
    formatter: (row) => row.areaName.replace(/,/g, '/')
  },
  {
    label: '发帖数量',
    prop: 'topicNum'
  },
  {
    label: '回复数量',
    prop: 'replyNum'
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
    config: { placeholder: '输入专家名称' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    data: '',
    field: 'areaId',
    label: '专区',
    type: 'select',
    config: { placeholder: '请选择' },
    options: []
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
    SeachPopover: () => import('@/components/searchPopOver'),
    updateExpert: () => import('./components/updateExpert.vue')
  },
  data() {
    return {
      title: '',
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      searchPopoverConfig: searchConfig,
      searchParams: {
        name: '',
        areaId: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
        return v
      }),
      dialogVisible: false,
      expertId: null
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    handleCurrentPageChange(params) {
      this.page.currentPage = params
      this.getExpertList()
    },
    handlePageSizeChange(params) {
      this.page.currentPage = 1
      this.page.pageSize = params
      this.getExpertList()
    },
    refresh() {
      this.getExpertList()
      this.selectZone()
    },
    selectZone() {
      queryZone({ page: 1, pageSize: 99999, name: '' }).then((res) => {
        this.searchPopoverConfig.popoverOptions[0].options = res.data.map(
          (item) =>
            (item = {
              value: item.id,
              label: item.name
            })
        )
      })
    },
    async batchDel(data) {
      await this.$confirm('删除后，专家将会删除，但是帖子需要在前台删除，是否继续。', '提醒', {
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
      this.page.currentPage = 1
      this.refresh()
      this.$refs.table.clearSelection()
    },
    edit(id) {
      this.expertId = id
      this.dialogVisible = true
      this.title = '编辑专家'
    },
    async del(id) {
      await this.$confirm('删除后，专家将会删除，但是帖子需要在前台删除，是否继续。', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await delExpert(id)
      this.page.currentPage = 1
      this.refresh()
    },
    look(id) {
      this.expertId = id
      this.dialogVisible = true
      this.title = '查看专家'
    },
    add() {
      this.dialogVisible = true
      this.title = '创建专家'
    },
    async getExpertList() {
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        ...this.searchParams
      }
      const res = await getExpertList(params)
      this.tableData = res.data
      this.page.total = res.totalNum
    },
    handleSearch(searchParams) {
      this.searchParams = searchParams
      this.page.currentPage = 1
      this.getExpertList()
    },
    closeDialog() {
      this.dialogVisible = false
      this.refresh()
    }
  },
  computed: {
    ADD_EXPERT: () => ADD_EXPERT,
    DEL_EXPERT: () => DEL_EXPERT,
    EDIT_EXPERT: () => EDIT_EXPERT,
    ...mapGetters(['privileges'])
  },
  watch: {
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([DEL_EXPERT, EDIT_EXPERT, ADD_EXPERT])
      },
      deep: true
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
