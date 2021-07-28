<template>
  <div class="competition-list">
    <page-header title="闯关竞赛">
      <el-button
        slot="rightMenu"
        v-p="COMPETITION_ADD"
        size="medium"
        type="primary"
        @click="addCompetition"
      >
        创建闯关竞赛
      </el-button>
    </page-header>
    <basic-container>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="tablePage"
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
              @reset="searchParams.creatorId = ''"
            >
              <template #creatorId>
                <el-select
                  v-model="searchParams.creatorId"
                  v-loadmore="loadMore"
                  filterable
                  remote
                  :remote-method="remoteFounder"
                  @visible-change="visibleChange"
                >
                  <el-option
                    v-for="item in classify"
                    :key="item.creatorId"
                    :label="item.name"
                    :value="item.creatorId"
                  ></el-option>
                  <el-option
                    v-show="valve"
                    value="1"
                    class="loading"
                  >
                    <i class="el-icon-loading"></i>加载中
                  </el-option>
                  <el-option
                    v-show="noData"
                    value="1"
                    class="ending"
                  >
                    {{ classify.length === 0 ? '无数据' : '没有更多了' }}
                  </el-option>
                </el-select>
              </template>
            </seach-popover>
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
            v-p="COMPETITION_DEL"
            style="margin-bottom: 0"
            type="text"
            @click="batchDel(selection)"
          >
            批量删除
          </el-button>
          <el-button
            v-p="COMPETITION_DEL"
            style="margin-bottom: 0"
            type="text"
            @click="batchExport(selection)"
          >
            批量导出
          </el-button>
        </template>
        <template #handler="{ row }">
          <el-button
            v-p="COMPETITION_EDIT"
            :disabled="isEdit(row)"
            type="text"
            @click="edit(row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-p="COMPETITION_DEL"
            type="text"
            @click="del(row.id)"
          >
            删除
          </el-button>
        </template>
        <template #name="{ row }">
          <el-button
            type="text"
            @click="goToInfo(row.id)"
          >
            {{ row.name }}
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { COMPETITION_ADD, COMPETITION_EDIT, COMPETITION_DEL } from '@/const/privileges'
import { getCompetitionList, creatUser, delCompetition } from '@/api/examManage/competition'
import { getcategoryTree } from '@/api/examManage/category'
import { mapGetters } from 'vuex'
import moment from 'moment'
const TABLE_COLUMNS = [
  {
    label: '闯关竞赛名称',
    prop: 'name',
    slot: true,
    minWidth: '120px'
  },
  {
    label: '分类',
    prop: 'categoryName',
    minWidth: '80px'
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => {
      const day = moment().valueOf()
      const start = moment(row.beginTime).valueOf()
      const end =
        moment(row.endTime)
          .add(1, 'd')
          .valueOf() - 1000
      return day < start ? '未开始' : day > end ? '已结束' : '进行中'
    }
  },
  {
    label: '有效期限',
    prop: 'beginTime',
    minWidth: '150px',
    formatter: (row) => {
      if (row.beginTime && row.endTime) {
        return (
          row.beginTime.split(' ')[0].replaceAll('-', '/') +
          ' - ' +
          row.endTime.split(' ')[0].replaceAll('-', '/')
        )
      }
    }
  },
  {
    label: '竞赛关数',
    prop: 'barrierNum'
  },
  {
    label: '参与人数',
    prop: 'raceJoinNum'
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
    config: { placeholder: '输入闯关竞赛名称' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    data: '',
    field: 'categoryId',
    label: '分类',
    type: 'treeSelect',
    config: {
      multiple: false,
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
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: 1, label: '未开始' },
      { value: 2, label: '进行中' },
      { value: 3, label: '已结束' }
    ]
  },
  {
    field: 'creatorId',
    label: '创建人',
    type: 'slot'
  },
  {
    type: 'dataPicker',
    data: '',
    field: 'beginTime,endTime',
    label: '创建时间',
    config: {
      // 显示类型
      type: 'daterange',
      placeholder: '请选择'
    }
  }
]
const SEARCH_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  computed: {
    COMPETITION_ADD: () => COMPETITION_ADD,
    COMPETITION_EDIT: () => COMPETITION_EDIT,
    COMPETITION_DEL: () => COMPETITION_DEL,
    ...mapGetters(['privileges'])
  },
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
      time: '',
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      searchPopoverConfig: SEARCH_CONFIG,
      searchParams: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        creatorId: '',
        categoryId: '',
        beginTime: '',
        endTime: '',
        status: ''
      },
      tablePage: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      valve: false,
      noData: false,
      classify: [],
      classflyParams: {
        pageNo: 1,
        pageSize: 20,
        name: ''
      },
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
        return v
      })
    }
  },
  created() {
    this.getData()
    getcategoryTree({
      type: 1,
      parentId: 0
    }).then((res) => {
      this.searchPopoverConfig.popoverOptions[0].config.treeParams.data = res
    })
    this.getSelectData()
  },
  methods: {
    refresh() {
      this.getData()
    },
    getData() {
      this.tableLoading = true
      getCompetitionList(this.searchParams)
        .then((res) => {
          this.tableData = res.data
          this.tablePage.total = res.totalNum
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    batchDel(ids) {
      ids = ids.reduce((total, item) => total + item.id + ',', '').slice(0, -1)
      this.del(ids)
    },
    edit(id) {
      this.$router.push({
        path: '/examManagement/competition/addAndEdit',
        query: {
          tagName: '编辑闯关竞赛',
          id
        }
      })
    },
    async del(id) {
      await this.$confirm('您确定要删除选中的闯关竞赛吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await delCompetition(id)
      this.getData()
      this.$refs.table.clearSelection()
      this.$message.success('删除成功')
    },
    addCompetition() {
      this.$router.push({
        path: '/examManagement/competition/addAndEdit',
        query: {
          tagName: '创建闯关竞赛'
        }
      })
    },
    goToInfo(id) {
      this.$router.push({
        path: '/examManagement/competition/info',
        query: {
          id
        }
      })
    },
    handleCurrentPageChange(params) {
      this.tablePage.currentPage = params
      this.searchParams.pageNo = params
      this.getData()
    },
    handlePageSizeChange(params) {
      this.tablePage.currentPage = 1
      this.tablePage.pageSize = params
      this.searchParams.pageNo = 1
      this.searchParams.pageSize = params
      this.getData()
    },
    handleSearch(data) {
      delete data.creatorId
      this.searchParams
      this.searchParams = {
        ...this.searchParams,
        ...data
      }
      this.classflyParams.pageNo = 1
      this.getData()
    },
    loadMore() {
      if (this.valve || this.noData) return
      this.valve = true
      this.classflyParams.pageSize += 20
      this.getSelectData()
    },
    getSelectData() {
      creatUser(this.classflyParams).then((res) => {
        const length = this.classify.length
        this.classify.push(...res.records)
        this.classify = _.uniqBy(this.classify, 'creatorId')
        this.noData = length === this.classify.length
        this.valve = false
      })
    },
    remoteFounder(v) {
      this.classflyParams.name = v.trim()
      this.classflyParams.pageSize = 20
      this.classflyParams.pageNo = 1
      this.classify = []
      this.getSelectData()
    },
    visibleChange(flag) {
      if (flag) {
        this.classflyParams.name = ''
        this.getSelectData()
      }
    },
    isEdit(data) {
      return moment().valueOf() > moment(data.beginTime)
    }
  }
}
</script>

<style lang="scss" scoped>
.competition-list {
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
}
::v-deep.loading {
  text-align: center;
  color: #ccc;
  pointer-events: none;
  i {
    margin-right: 10px;
  }
}
::v-deep.ending {
  text-align: center;
  color: #ccc;
  pointer-events: none;
}
</style>
