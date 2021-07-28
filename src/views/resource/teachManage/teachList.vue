<template>
  <div class="fill">
    <page-header title="导师管理">
      <el-button
        slot="rightMenu"
        v-p="TEACH_CREATE"
        size="medium"
        type="primary"
        @click="handleOpera('', 'add')"
      >
        创建导师
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="tableLoading"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="transitionBox">
            <div class="searchBox">
              <div class="table-search">
                <search-popover
                  ref="searchPopover"
                  class="search-list"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSearch"
                />
                <div
                  class="search-sort-box"
                  @click="loadTableData"
                >
                  <span class="icon el-icon-refresh-right" />
                  <span class="refresh-text">刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                  style="margin-left: 10px"
                >
                  <el-checkbox-group
                    v-model="columnsVisible"
                    style="display: flex; flex-direction: column"
                  >
                    <el-checkbox
                      v-for="item in columnsVisibleFilter"
                      :key="item.prop"
                      :label="item.prop"
                      :disabled="
                        item.prop == 'selection' ||
                          item.prop == 'tutorName' ||
                          item.prop == 'orgName'
                      "
                      class="originColumn"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <i
                    slot="reference"
                    class="el-icon-setting"
                    style="cursor: pointer"
                  />
                </el-popover>
              </div>
            </div>
          </div>
        </template>

        <template #tutorName="{ row }">
          <div
            class="ellipsis title"
            @click="handleView(row)"
          >
            {{ row.tutorName }}
          </div>
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="TEACH_DEL"
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{ row }">
          <div class="menuClass">
            <el-button
              v-p="TEACH_EDIT"
              type="text"
              @click="handleOpera(row, 'edit')"
            >
              编辑
            </el-button>
            <el-button
              v-p="TEACH_DEL"
              type="text"
              @click="handleOpera(row, 'del')"
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
import styles from '@/styles/variables.scss'
import { TEACH_EDIT, TEACH_DEL, TEACH_CREATE } from '@/const/privileges'
import { selectTutorList, deleteTutor } from '@/api/resource/teach'
import SearchPopover from '@/components/searchPopOver/index'
import { getorganizationNew } from '@/api/org/org'
import { getStationParent } from '@/api/system/station'
const TABLE_COLUMNS = [
  {
    label: '导师姓名',
    prop: 'tutorName',
    slot: true
  },
  {
    label: '岗位',
    prop: 'positionName'
  },
  {
    label: '所在部门',
    prop: 'orgName'
  },
  {
    label: '性别',
    prop: 'sex',
    formatter: (row) => {
      return row.sex == '0' ? '女' : '男'
    }
  },
  {
    label: '综合得分',
    prop: 'totalScore'
  },
  {
    label: '职称',
    prop: 'professionalName'
  },
  {
    label: '本岗位工作年限',
    prop: 'workYear',
    width: 140
  },
  {
    label: '毕业院校',
    prop: 'graduateSchool'
  },
  {
    label: '专业',
    prop: 'major'
  },
  {
    label: '学历',
    prop: 'qualification'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '创建人',
    prop: 'creatorName'
  }
]
const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  defaultExpandAll: false, //是否默认展开所有行
  showIndexColumn: false, //是否显示序号列
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    //操作列配置
    width: 120,
    fixed: 'right'
  }
}
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    type: 'input',
    field: 'queryCondition',
    options: [],
    config: { placeholder: '输入姓名/手机号码进行搜索', 'suffix-icon': 'el-icon-search' }
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    label: '部门',
    disabled: false,
    field: 'orgId',
    data: '',
    placeholder: '请选择部门',
    type: 'lazycascader',
    filterMethod: () => {},
    filterProps: {},
    options: [],
    change: () => {},
    props: {}
  },
  {
    data: '',
    field: 'positionId',
    label: '岗位',
    type: 'lazySelect',
    optionList: [],
    placeholder: '请选择岗位',
    optionProps: {
      formatter: (item) => `${item.name}`,
      key: 'name',
      value: 'id'
    },
    load: (p) => {
      p.name = p.search
      return getStationParent(p)
    },
    remote: true,
    searchable: true,
    config: { optionLabel: 'name', optionValue: 'id' }
  }
  // {
  //   type: 'treeSelect',
  //   field: 'positionId',
  //   label: '岗位',
  //   data: '',
  //   config: {
  //     selectParams: {
  //       placeholder: '请选择岗位',
  //       multiple: false
  //     },
  //     treeParams: {
  //       data: [],
  //       'check-strictly': true,
  //       'default-expand-all': false,
  //       'expand-on-click-node': false,
  //       clickParent: true,
  //       filterable: false,
  //       props: {
  //         children: 'children',
  //         label: 'name',
  //         value: 'id'
  //       }
  //     }
  //   }
  // }
]
const searchConfig = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS
}
export default {
  name: 'TeachList',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      columnsVisibleFilter: TABLE_COLUMNS.filter((item) => item.label),
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      queryInfo: {
        queryCondition: '',
        orgId: '',
        positionId: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      activeColor: styles.primaryColor,
      searchConfig
    }
  },
  computed: {
    TEACH_EDIT: () => TEACH_EDIT,
    TEACH_DEL: () => TEACH_DEL,
    TEACH_CREATE: () => TEACH_CREATE
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([TEACH_DEL, TEACH_EDIT])
      },
      deep: true
    }
  },
  mounted() {
    const org = (this.orgOption = this.searchConfig.popoverOptions[0])
    org.filterMethod = this.loadOrgData
    org.filterProps = {
      size: {
        key: 'pageSize',
        value: 1000
      },
      page: {
        key: 'pageNo',
        value: 0
      },
      search: {
        key: 'orgName',
        value: ''
      }
    }
    org.props = {
      checkStrictly: true,
      multiple: false,
      label: 'orgName',
      value: 'orgId',
      lazy: true,
      lazyLoad: this.orgLazyLoad,
      loadProps: {
        size: {
          key: 'pageSize',
          value: 10
        },
        page: {
          key: 'pageNo',
          value: 1
        },
        value: {
          key: 'parentId',
          value: ''
        }
      }
    }
    this.loadTableData()
    this.loadOrgData()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  methods: {
    orgLazyLoad(node, resolve) {
      if (!node.data) return []
      this.loadOrgData({ parentId: node.data.id }, resolve)
    },
    loadOrgData(query, resolve) {
      if (query && typeof query === 'object') {
        if (!query.pageSize) {
          Object.assign(query, { pageSize: 10, pageNo: 1 })
        } else {
          if (query.name) {
            delete query.parentId
          } else {
            delete query.name
          }
        }
      } else {
        query = { name: query }
      }
      if (!query.name) {
        query.parentId = query.parentId || '0'
      }

      // 接口
      getorganizationNew(query).then((res) => {
        if (resolve) {
          resolve(res)
        } else {
          this.orgOption.options = res
        }
      })
    },
    //处理页码改变
    handleCurrentPageChange(val) {
      this.page.currentPage = val
      this.loadTableData()
    },
    //处理页码大小更改
    handlePageSizeChange(val) {
      this.page.size = val
      this.loadTableData(true)
    },
    // 搜索
    handleSearch(params) {
      _.assign(this.queryInfo, params)
      this.loadTableData(true)
    },
    //查看导师
    handleView(row) {
      this.$router.push({
        path: '/resource/teachManage/teachDetail',
        query: {
          id: row.idStr
        }
      })
    },

    // 删除、编辑、新建导师
    handleOpera(row, key) {
      if (key === 'del') {
        //删除
        this.$confirm('确定要删除该导师吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteFun(row.idStr)
          })
          .catch(() => {})
      } else {
        this.$router.push({
          path: '/resource/teachManage/teachNew',
          query: {
            operation: key,
            id: row.idStr
          }
        })
      }
    },

    // 具体的删除函数
    deleteFun(ids) {
      deleteTutor({ ids }).then(() => {
        this.loadTableData(true)
        this.$message.success('删除成功')
        this.$refs.table.clearSelection()
      })
    },
    // 批量删除
    deleteSelected(selection) {
      if (!selection.length) return
      this.$confirm('确定要批量删除导师吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = selection.map((val) => val.idStr).join(',')
          this.deleteFun(ids)
        })
        .catch(() => {})
    },
    // 加载函数
    async loadTableData(isLoad) {
      if (this.tableLoading) {
        return
      }
      try {
        if (isLoad) {
          //是否重置分页
          this.$set(this.page, 'currentPage', 1)
        }
        const param = {
          pageNo: this.page.currentPage,
          pageSize: this.page.size,
          ...this.queryInfo
        }
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await selectTutorList(param)
        this.tableLoading = false
        this.tableData = data || []
        this.page.total = totalNum || 0
      } catch (error) {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
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
  // position: absolute;
  // width: 100%;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
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
  .table-search {
    display: flex;
    align-items: center;
    .search-list {
      flex: 1;
      /deep/.el-input__inner {
        min-width: 240px;
      }
    }
  }
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
    color: #a0a8ae;
  }
}

.search-box {
  display: flex;
  align-items: center;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
  .upload-more {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
