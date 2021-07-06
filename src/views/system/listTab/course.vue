<template>
  <div class="fill">
    <common-table
      id="demo"
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
                @click="loadTableData(true)"
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
                    :disabled="item.prop == 'selection' || item.prop == 'courseName'"
                    class="originColumn"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
                <div
                  slot="reference"
                  class="reference-set"
                >
                  <i class="el-icon-setting" />
                  <span>列项显示</span>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </template>

      <template #handler="{ row }">
        <div class="menuClass">
          <el-button
            v-if="row.privilege == '0'"
            :disabled="true"
            type="text"
          >
            审核中
          </el-button>
          <el-button
            v-if="row.privilege == '1'"
            :disabled="true"
            type="text"
          >
            已申请
          </el-button>
          <el-button
            v-if="row.privilege == '2'"
            v-p="LIST_APPLY"
            type="text"
            @click="handleAuth(row, 'apply')"
          >
            申请
          </el-button>
          <el-button
            v-if="row.privilege == '5'"
            v-p="LIST_APPLY"
            type="text"
            @click="handleAuth(row, 'apply')"
          >
            重新申请
          </el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>

<script>
import {
  getAllCourse,
  createCourseUser,
  getKnowledgeSystem,
  listTeacherComboBox,
  noPrivilegeTree,
  listCatalog
} from '@/api/system/systemList'
import SearchPopover from '@/components/searchPopOver/index'
import styles from '@/styles/variables.scss'
import { LIST_APPLY } from '@/const/privileges'
const TABLE_COLUMNS = [
  {
    label: '课程编号',
    prop: 'courseNo',
    minWidth: 100
  },
  {
    label: '课程名称',
    prop: 'courseName'
  },
  // {
  //   label: '状态',
  //   prop: 'status',
  //   formatter: (row) => {
  //     return row.status == 1
  //       ? '已发布'
  //       : row.status == 2
  //       ? '草稿'
  //       : row.status == 3
  //       ? '停用'
  //       : '审核中'
  //   }
  // },
  {
    label: '讲师',
    prop: 'teacherName'
  },
  {
    label: '所在分类',
    prop: 'catalogName'
  },
  {
    label: '授课方式',
    prop: 'type',
    formatter: (row) => {
      return row.type == 1 ? '在线' : row.type == 2 ? '面授' : '直播'
    }
  },
  {
    label: '选修类型',
    prop: 'electiveType',
    formatter: (row) => {
      return row.electiveType == '1'
        ? '开放选修'
        : row.electiveType == '2'
        ? '通过审批'
        : '禁止选修'
    }
  },
  {
    label: '知识体系',
    prop: 'knowledgeSystemFullName'
  },
  {
    label: '是否推荐',
    prop: 'isRecommend',
    formatter: (row) => {
      return row.isRecommend == 1 ? '是' : '否'
    }
  },
  {
    label: '创建人',
    prop: 'creatorName'
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    width: 160
  }
]
const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  defaultExpandAll: false, //是否默认展开所有行
  showIndexColumn: false, //是否显示序号列
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: 'right'
  }
}
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    type: 'input',
    field: 'courseName',
    config: { placeholder: '输入课程名称搜索', 'suffix-icon': 'el-icon-search' }
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  // {
  //   field: 'status',
  //   label: '状态',
  //   type: 'select',
  //   options: [
  //     { value: '0', label: '审核中' },
  //     { value: '1', label: '已发布' },
  //     { value: '2', label: '草稿' },
  //     { value: '3', label: '停用' }
  //   ],
  //   config: { placeholder: '请选择' }
  // },
  {
    field: 'teacherId',
    label: '讲师',
    type: 'select',
    options: [],
    config: { optionLabel: 'name', optionValue: 'idStr', filterable: true, placeholder: '请选择' }
  },
  {
    field: 'catalogId',
    label: '所在分类',
    type: 'treeSelect',
    config: {
      selectParams: {
        placeholder: '请选择',
        // 是否多选
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
          disabled: '',
          value: 'id'
        }
      }
    }
  },
  {
    field: 'type',
    label: '授课方式',
    type: 'select',
    options: [
      { label: '在线', value: '1' },
      { label: '面授', value: '2' },
      { label: '直播', value: '3' }
    ],
    config: { optionLabel: 'label', optionValue: 'value', placeholder: '请选择' }
  },
  {
    field: 'electiveType',
    label: '选修类型',
    type: 'select',
    options: [
      { value: '1', label: '开放选修' },
      { value: '2', label: '通过审批' },
      { value: '3', label: '禁止选修' }
    ],
    config: { placeholder: '请选择' }
  },
  {
    data: '',
    field: 'isRecommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
    ],
    config: { optionLabel: 'label', optionValue: 'value', placeholder: '请选择' }
  },
  {
    field: 'creatorId',
    label: '创建人',
    type: 'select',
    options: [],
    config: {
      optionLabel: 'creatorName',
      optionValue: 'creatorId',
      filterable: true,
      placeholder: '请选择'
    }
  },
  {
    field: 'knowledgeSystemId',
    label: '知识体系',
    type: 'select',
    options: [],
    config: { optionLabel: 'name', optionValue: 'idStr', placeholder: '请选择' }
  },
  {
    field: 'orgId',
    label: '组织',
    type: 'treeSelect',
    config: {
      selectParams: {
        placeholder: '请选择',
        // 是否多选
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
          disabled: '',
          value: 'orgId'
        }
      }
    }
  }
]
const searchConfig = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS
}
export default {
  name: 'CatelogManager',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      columnsVisibleFilter: TABLE_COLUMNS.filter((item) => item.label),
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: TABLE_CONFIG,
      activeColor: styles.primaryColor,
      tableLoading: false,
      tableData: [],
      searchConfig,
      searchParams: {
        //搜索的参数
        catalogId: '',
        courseName: '',
        creatorId: '',
        electiveType: '',
        isPutaway: '',
        isRecommend: '',
        status: 1,
        teacherId: '',
        type: '',
        knowledgeSystemId: '',
        orgId: ''
      }
    }
  },
  computed: {
    LIST_APPLY: () => LIST_APPLY
  },
  mounted() {
    this.loadTableData() //列表
    this.createUser() //创建人
    this.getTeacher() //讲师
    this.getClass() //课程分类
    this.funKnowledgeSystem() //知识体系
    this.getOrganiz() //组织
  },
  methods: {
    //处理页码改变
    handleCurrentPageChange(param) {
      this.$set(this.page, 'currentPage', param)
      this.loadTableData()
    },
    //处理页码大小更改
    handlePageSizeChange(param) {
      this.$set(this.page, 'size', param)
      this.loadTableData(true)
    },

    // 搜索
    handleSearch(params) {
      _.assign(this.searchParams, params)
      this.loadTableData(true)
    },
    // 课程申请操作
    handleAuth(row) {
      this.$confirm('您确定要拷贝该课程到自己的组织吗？', '提醒', {
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/system/listingCourseApply',
            query: {
              courseId: row.id
            }
          })
        })
        .catch(() => {})
    },
    //创建人
    createUser() {
      createCourseUser().then((res) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'creatorId') {
            val.options = res
          }
        })
      })
    },
    //讲师
    getTeacher() {
      const params = {
        pageSize: 9999,
        pageNo: 1,
        likeQuery: ''
      }
      listTeacherComboBox(params).then((res) => {
        res = _.uniqBy(res, 'idStr')
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'teacherId') {
            val.options = res
          }
        })
      })
    },
    //课程分类
    getClass() {
      listCatalog({ status: 0 }).then((res) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'catalogId') {
            val.config.treeParams.data = res
          }
        })
      })
    },
    //知识体系
    funKnowledgeSystem() {
      getKnowledgeSystem({ source: 'knowledgeSystem' }).then((res) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'knowledgeSystemId') {
            val.options = res
          }
        })
      })
    },
    //组织
    getOrganiz() {
      noPrivilegeTree({ parentOrgId: '0' }).then((res) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'orgId') {
            val.config.treeParams.data = res
          }
        })
      })
    },

    //课程清单列表
    loadTableData(isLoad) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      const param = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        ...this.searchParams
      }
      this.tableLoading = true
      getAllCourse(param)
        .then((res) => {
          this.tableLoading = false
          const { totalNum, data } = res
          this.tableData = data
          this.page.total = totalNum
        })
        .catch(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}

.searchBox {
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
    }
  }
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
    color: #a0a8ae;
  }
}
.reference-set {
  color: #a0a8ae;
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    margin-left: 6px;
  }
}
</style>
