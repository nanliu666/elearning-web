<template>
  <div>
    <page-header title="教室列表">
      <el-button
        slot="rightMenu"
        v-p="ADD_CLASSROOM"
        type="primary"
        size="medium"
        @click="createClassroom"
      >
        创建教室
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="transitionBox">
            <div class="searchBox">
              <div class="search-box">
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSearch"
                />
                <div
                  class="search-sort-box"
                  @click="loadTableData"
                >
                  <i class="el-icon-refresh-right" />
                  <span class="sort-text">刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                  style="margin:0 0px 0 10px"
                >
                  <el-checkbox-group
                    v-model="columnsVisible"
                    style="display: flex;flex-direction: column;"
                  >
                    <el-checkbox
                      v-for="item in tableColumns"
                      :key="item.prop"
                      :label="item.prop"
                      :disabled="item.prop === 'orgName'"
                      class="originColumn"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <i
                    slot="reference"
                    class="el-icon-setting"
                    style="cursor: pointer;"
                  />
                </el-popover>
              </div>
            </div>
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="DELETE_CLASSROOM"
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #roomName="{row}">
          <div
            v-if="$p(VIEW_CLASSROOM)"
            class="ellipsis title"
            @click="jumpDetail(row)"
          >
            {{ row.roomName }}
          </div>
          <div v-else>
            {{ row.roomName }}
          </div>
        </template>
        <template #status="{row}">
          {{ row.status == 0 ? '已停用' : '已启用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="STOP_CLASSROOM"
              type="text"
              @click="handleStatus(row)"
            >
              {{ row.status == 0 ? '启用' : '停用' }}
            </el-button>
            <el-button
              v-p="EDIT_CLASSROOM"
              type="text"
              @click="editClassroom(row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="DELETE_CLASSROOM"
              type="text"
              @click="deleteClassroomFun(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { queryClassroom, deleteClassroom, updateClassroomStatus } from '@/api/resource/classroom'
import { getCategoryTree } from '@/api/live'
import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '编号',
    prop: 'roomNo',
    minWidth: 150
  },
  {
    label: '教室名称',
    prop: 'roomName',
    slot: true,
    minWidth: 120
  },
  {
    label: '教室状态',
    prop: 'status',
    slot: true,
    minWidth: 120
  },
  {
    label: '最大容纳人数',
    prop: 'maxCapacity',
    formatter: (row) => {
      return row.maxCapacity !== 0 ? `${row.maxCapacity}人` : '不限制'
    },
    minWidth: 120
  },
  {
    label: '分类',
    slot: true,
    prop: 'categoryName',
    minWidth: 150
  },
  {
    label: '地址',
    slot: true,
    prop: 'roomAddr',
    minWidth: 120
  },
  {
    label: '创建时间',
    slot: true,
    prop: 'createTime',
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
      field: 'roomName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入教室名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'treeSelect',
      field: 'categoryId',
      label: '所在分类',
      data: '',
      config: {
        selectParams: {
          placeholder: '请选择',
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
            label: 'name',
            disabled: 'disabled',
            value: 'id'
          }
        }
      }
    },
    {
      config: { placeholder: '请输入' },
      data: '',
      field: 'roomAddr',
      label: '地址',
      type: 'input'
    },
    {
      type: 'select',
      field: 'status',
      label: '教室状态',
      data: '',
      options: [
        { value: '', label: '全部' },
        { value: 0, label: '停用' },
        { value: 1, label: '启用' }
      ]
    },
    {
      type: 'numInterval',
      field: 'minCapacity,maxCapacity',
      data: { min: '', max: '' },
      label: '最大容纳人数'
    }
  ]
}
import {
  VIEW_CLASSROOM,
  ADD_CLASSROOM,
  STOP_CLASSROOM,
  EDIT_CLASSROOM,
  DELETE_CLASSROOM
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'ClassroomList',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      tablePageConfig: {},
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: SEARCH_CONFIG,
      queryInfo: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  computed: {
    VIEW_CLASSROOM: () => VIEW_CLASSROOM,
    ADD_CLASSROOM: () => ADD_CLASSROOM,
    STOP_CLASSROOM: () => STOP_CLASSROOM,
    EDIT_CLASSROOM: () => EDIT_CLASSROOM,
    DELETE_CLASSROOM: () => DELETE_CLASSROOM,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([STOP_CLASSROOM, EDIT_CLASSROOM, DELETE_CLASSROOM])
      },
      deep: true
    }
  },
  activated() {
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'categoryId' })
    getCategoryTree({ source: 'classroom' }).then((res) => {
      categoryIdType.config.treeParams.data = _.concat(
        [
          {
            name: '全部',
            id: ''
          }
        ],
        res
      )
    })
    this.loadTableData()
  },
  methods: {
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
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/resource/classroom/detail', query: { id: row.id } })
    },
    // 创建教室
    createClassroom() {
      this.$router.push({ path: '/resource/classroom/edit' })
    },
    // 编辑
    editClassroom(row) {
      this.$router.push({ path: '/resource/classroom/edit', query: { id: row.id } })
    },
    // 删除
    deleteClassroomFun(row) {
      if (row.isReserve) {
        const reserveTips = '该教室已被预订，无法删除'
        this.$confirm(reserveTips, '提示', {
          confirmButtonText: '我知道了',
          type: 'warning',
          showCancelButton: false,
          center: true
        })
      } else {
        const deleteTip = '您确定要删除该教室吗？'
        this.$confirm(deleteTip, '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFun(row.id)
        })
      }
    },
    // 具体的删除函数
    deleteFun(ids) {
      deleteClassroom({ ids }).then(() => {
        this.loadTableData()
        this.$refs.table.clearSelection()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 批量删除
    deleteSelected(selected) {
      const hasTrain = _.isEmpty(_.filter(selected, 'isReserve'))
      const deleteBatchTips = `您确定要批量删除${_.size(selected).length}个教室吗？`
      const reserveTips =
        '您选择的教室包含已关联正在进行中的培训安排，不能对其进行删除操作，是否忽略继续删除其他教室？'
      const confirmButtonText = hasTrain ? '继续删除' : '确定'
      const tips = hasTrain ? reserveTips : deleteBatchTips
      this.$confirm(tips, '提示', {
        confirmButtonText
      }).then(() => {
        let selectedIds = []
        _.each(selected, (item) => {
          selectedIds.push(item.id)
        })
        this.deleteFun(selectedIds.join(','))
      })
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableLoading = true
        queryClassroom(this.queryInfo).then((res) => {
          const { data, totalNum } = res
          this.tableData = data
          this.page.total = totalNum
          this.tableLoading = false
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      const statusText = row.status == 0 ? '停用' : '启用'
      const stopContent = '您确定要停用该教室吗？'
      const reserveTips = '该教室已被预订，停用后，后续不可再预订，确定继续此操作吗？'
      const stopTips = row.isReserve ? reserveTips : stopContent
      const startContent = '您确定要启用该教室吗？'
      const params = { status: row.status == 0 ? 1 : 0, id: row.id }
      this.$confirm(`${row.status == 0 ? stopTips : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateClassroomStatus(params).then(() => {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: `${statusText}成功!`
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}
.searchBox {
  position: absolute;
  width: 100%;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
  .search-box {
    display: flex;
    align-items: center;
    .search-sort-box {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
      .sort-text {
        color: #a0a8ae;
        margin-left: 6px;
        font-size: 14px;
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
  > div {
    display: flex;
    :first-child {
      flex: 1;
    }
    > button {
      height: 34px;
    }
  }
}
</style>
