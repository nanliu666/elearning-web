<template>
  <div>
    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
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
                  style="margin:0 20px 0 10px"
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
                <el-button
                  slot="rightMenu"
                  v-p="ADD_REP_CATALOG"
                  type="primary"
                  size="medium"
                  @click="createClassroom"
                >
                  创建教室
                </el-button>
              </div>
            </div>
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #status="{row}">
          {{ row.status === '0' ? '已启用' : '已停用' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="STOP_REP_CATALOG"
              type="text"
              @click="handleStatus(row)"
            >
              {{ row.status === '0' ? '停用' : '启用' }}
            </el-button>
            <el-button
              v-p="AUTH_REP_CATALOG"
              type="text"
              @click="editClassroom(row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="AUTH_REP_CATALOG"
              type="text"
              @click="deleteClassroom(row)"
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
import {
  getKnowledgeCatalogList,
  deleteKnowledgeCatalog,
  updateStatusKnowledgeCatalog
} from '@/api/knowledge/knowledge'
import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '编号',
    prop: 'name',
    slot: true,
    minWidth: 150
  },
  {
    label: '教室名称',
    prop: 'creatorName',
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
    slot: true,
    prop: 'updateTime',
    minWidth: 120
  },
  {
    label: '分类',
    slot: true,
    prop: 'updateTime1',
    minWidth: 150
  },
  {
    label: '所属组织',
    slot: true,
    prop: 'updateTime2',
    minWidth: 120
  },
  {
    label: '地址',
    slot: true,
    prop: 'updateTime3',
    minWidth: 120
  },
  {
    label: '创建时间',
    slot: true,
    prop: 'updateTime4',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: true,
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
      field: 'name',
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
      type: 'treeSelect',
      field: 'categoryId1',
      label: '所属组织',
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
      field: 'teacher_title',
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
        { value: 0, label: '启用' },
        { value: 1, label: '停用' }
      ]
    },
    {
      type: 'numInterval',
      field: 'minUserNum,maxUserNum',
      data: { min: '', max: '' },
      label: '最大容纳人数'
    }
  ]
}
import {
  ADD_REP_CATALOG,
  STOP_REP_CATALOG,
  AUTH_REP_CATALOG,
  EDIT_REP_CATALOG,
  DELETE_REP_CATALOG,
  ADD_CHILD_REP_CATALOG
} from '@/const/privileges'
import { mapGetters } from 'vuex'
import { getCategoryList } from '@/api/examManage/category'
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
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: SEARCH_CONFIG,
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  computed: {
    ADD_REP_CATALOG: () => ADD_REP_CATALOG,
    STOP_REP_CATALOG: () => STOP_REP_CATALOG,
    AUTH_REP_CATALOG: () => AUTH_REP_CATALOG,
    EDIT_REP_CATALOG: () => EDIT_REP_CATALOG,
    DELETE_REP_CATALOG: () => DELETE_REP_CATALOG,
    ADD_CHILD_REP_CATALOG: () => ADD_CHILD_REP_CATALOG,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          STOP_REP_CATALOG,
          AUTH_REP_CATALOG,
          EDIT_REP_CATALOG,
          DELETE_REP_CATALOG,
          ADD_CHILD_REP_CATALOG
        ])
      },
      deep: true
    }
  },
  activated() {
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'categoryId' })
    getCategoryList({ type: 1 }).then((res) => {
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
    // 创建教室
    createClassroom() {},
    // 编辑
    editClassroom() {
      this.$message.warning('正在开发中...')
    },
    // 删除
    deleteClassroom(row) {
      if (row.isReserveTips) {
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
    deleteFun(id) {
      deleteKnowledgeCatalog({ id }).then(() => {
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
      const hasTrain = true
      const deleteBatchTips = `您确定要批量删除${_.size(selected).length}个教室吗？`
      const reserveTips =
        '您选择的教室包含已关联正在进行中的培训安排，不能对其进行删除操作 </br>是否忽略继续删除其他教室？'
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
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        getKnowledgeCatalogList(params).then((res) => {
          this.tableData = res
          this.tableLoading = false
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    changevisible(data) {
      this.createOrgDailog = data
    },
    // 搜索
    handleSearch(params) {
      this.searchParams = params
      this.loadTableData()
    },
    /**
     * 处理停用启用
     */
    handleStatus(row) {
      const statusText = row.status === '0' ? '停用' : '启用'
      const stopContent = '您确定要停用该教室吗？'
      const reserveTips = '该教室已被预订，停用后，后续不可再预订，确定继续此操作吗？'
      const stopTips = row.isReserveTips ? reserveTips : stopContent
      const startContent = '您确定要启用该分类吗？'
      const params = { status: row.status === '0' ? 1 : 0 }
      this.$confirm(`${row.status === '0' ? stopTips : startContent}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatusKnowledgeCatalog(params).then(() => {
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
