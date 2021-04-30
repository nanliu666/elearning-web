<template>
  <div class="fill">
    <page-header title="制度清单">
      <template v-if="activeIndex != '1'">
        <el-button
          slot="rightMenu"
          size="medium"
          type="primary"
        >
          {{ tabList[activeIndex].btnText }}
        </el-button>
      </template>
    </page-header>
    <basic-container block>
      <el-menu
        :default-active="activeIndex"
        class="el-menu"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <!-- <el-menu-item index="0">
          制度培训
        </el-menu-item>
        <el-menu-item index="1">
          业务列表
        </el-menu-item>
        <el-menu-item index="2">
          课程清单
        </el-menu-item> -->
        <el-menu-item
          v-for="(item, idx) in tabList"
          :key="idx"
          :index="item.key"
        >
          {{ item.name }}
        </el-menu-item>
      </el-menu>
      <template v-if="activeIndex != '2'">
        <common-table
          ref="table"
          :columns="tableColumns"
          :config="tableConfig"
          :page="page"
          :data="tableData"
          :loading="tableLoading"
          @current-page-change="handleCurrentPageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #topMenu>
            <div class="search-box">
              <div>
                <span class="upload-date">上传时间</span>
                <el-date-picker
                  v-model="searchParams.uploadDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  @change="dateChange"
                >
                </el-date-picker>
              </div>
              <search-popover
                ref="searchPopover"
                :require-options="searchConfig.requireOptions"
                :popover-options="searchConfig.popoverOptions"
                @submit="handleSearch"
              />
              <!-- <el-button
                v-p="ADD_EXAM_CATALOG"
                type="primary"
                size="medium"
                @click="addCategory"
              >
                创建分类
              </el-button> -->
            </div>
          </template>

          <template #testPaper="{ row }">
            <div
              class="ellipsis title"
              @click="jumpDetail(row)"
            >
              {{ row.testPaper }}
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

          <template #takeExamTimes="{ row }">
            {{ row.takeExamTimes === 1 ? '正常' : '已停用' }}
          </template>

          <template #handler="{ row }">
            <div class="menuClass">
              <el-button
                v-p="STOP_EXAM_CATALOG"
                type="text"
                @click="handleStatus(row)"
              >
                {{ row.status === 1 ? '取消置顶' : '置顶' }}
              </el-button>
              <el-button
                v-p="AUTH_EXAM_CATALOG"
                type="text"
                @click="handleAuth(row, 'download')"
              >
                下载
              </el-button>
              <el-button
                v-p="AUTH_EXAM_CATALOG"
                type="text"
                @click="handleAuth(row, 'delete')"
              >
                删除
              </el-button>
            </div>
          </template>
        </common-table>
      </template>

      <template v-else>
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
                        :disabled="item.prop == 'selection'"
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

          <template #courseName="{ row }">
            <div
              class="ellipsis title"
              @click="jumpDetail(row)"
            >
              {{ row.testPaper }}
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
              批量申请
            </el-button>
          </template>
          <template #handler="{ row }">
            <div class="menuClass">
              <el-button
                v-p="AUTH_EXAM_CATALOG"
                type="text"
                @click="handleAuth(row, 'apply')"
              >
                申请
              </el-button>
            </div>
          </template>
        </common-table>
      </template>
    </basic-container>
  </div>
</template>

<script>
import { delCategory } from '@/api/examManage/category'
import { getArrangeList } from '@/api/examManage/schedule'
import SearchPopover from '@/components/searchPopOver/index'
const TABLE_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '制度名称',
    prop: 'testPaper',
    slot: true
  },
  {
    label: '上传时间',
    prop: 'effectiveTime'
  },
  {
    label: '上传人员',
    prop: 'createUser',
    slot: true
  },
  {
    label: '状态',
    prop: 'takeExamTimes',
    slot: true
  }
]
const TABLE_COLUMNS2 = [
  {
    label: '课程编号',
    type: 'index',
    prop: 'selection',
    width: 80
  },
  {
    label: '课程名称',
    prop: 'courseName',
    slot: true
  },
  {
    label: '选修类型',
    prop: 'createUser'
  },
  {
    label: '知识体系',
    prop: 'rightRate'
  },
  {
    label: '是否推荐',
    prop: 'takeExamTimes'
  },
  {
    label: '创建人',
    prop: 'takeExamTimes2'
  },
  {
    label: '更新时间',
    prop: 'takeExamTimes3'
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
    width: 140,
    fixed: false
  }
}
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    type: 'input',
    field: 'name',
    label: '',
    data: '',
    options: [],
    config: { placeholder: '', 'suffix-icon': 'el-icon-search' }
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    data: '',
    field: 'isPutaway',
    label: '状态',
    type: 'select',
    options: [
      { value: '2', label: '全部' },
      { value: '1', label: '上架' },
      { value: '0', label: '下架' }
    ],
    config: { placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '讲师',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '所在分类',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '课程类型',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '选修类型',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '是否推荐',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '创建人',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '知识体系',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  },
  {
    data: '',
    field: 'teacherId',
    label: '组织',
    type: 'select',
    options: [],
    config: { optionLabel: 'teacherName', optionValue: 'teacherId', placeholder: '请选择' }
  }
]
const searchConfig = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: []
}
import styles from '@/styles/variables.scss'
import {
  ADD_EXAM_CATALOG,
  STOP_EXAM_CATALOG,
  AUTH_EXAM_CATALOG,
  EDIT_EXAM_CATALOG,
  DELETE_EXAM_CATALOG,
  ADD_GROUNP_EXAM_CATALOG
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'CatelogManager',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS2, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      tableColumns: TABLE_COLUMNS,
      columnsVisibleFilter: TABLE_COLUMNS2.filter((item) => item.label),
      columnsVisible: _.map(TABLE_COLUMNS2, ({ prop }) => prop),
      tabList: [
        {
          name: '制度培训',
          key: '0',
          searchPlace: '培训制度名称/上传人员',
          btnText: '上传制度培训'
        },
        { name: '业务列表', key: '1', searchPlace: '业务表单名称/上传人', btnText: '' },
        { name: '课程清单', key: '2', searchPlace: '输入课程名称搜索', btnText: '上传课程清单' }
      ],
      queryInfo: {
        categoryId: '', // 分类ID
        creatorId: '', //评卷人id
        examType: '', //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
        pageNo: 1,
        pageSize: 10,
        status: '', //状态: 未开始-1, 进行中-2, 已结束-3
        testPaper: '', //关联考卷id
        type: 0 //状态:0-已发布，1-草稿箱
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: TABLE_CONFIG,
      activeIndex: '0',
      activeColor: styles.primaryColor,
      tableLoading: false,
      tableData: [],
      searchConfig,
      searchParams: {
        //搜索的参数
        parentId: 0,
        type: '0',
        name: '',
        uploadDate: ''
      }
    }
  },
  computed: {
    ADD_EXAM_CATALOG: () => ADD_EXAM_CATALOG,
    STOP_EXAM_CATALOG: () => STOP_EXAM_CATALOG,
    AUTH_EXAM_CATALOG: () => AUTH_EXAM_CATALOG,
    EDIT_EXAM_CATALOG: () => EDIT_EXAM_CATALOG,
    DELETE_EXAM_CATALOG: () => DELETE_EXAM_CATALOG,
    ADD_GROUNP_EXAM_CATALOG: () => ADD_GROUNP_EXAM_CATALOG,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          STOP_EXAM_CATALOG,
          AUTH_EXAM_CATALOG,
          EDIT_EXAM_CATALOG,
          DELETE_EXAM_CATALOG,
          ADD_GROUNP_EXAM_CATALOG
        ])
      },
      deep: true
    }
  },
  created() {
    this.setConfig('0')
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    //处理页码改变
    handleCurrentPageChange(param) {
      console.log('改变分页', param)
      this.queryInfo = _.assign(this.queryInfo, { pageNo: param })
      this.loadTableData()
    },
    //处理页码大小更改
    handlePageSizeChange(param) {
      console.log('改变页码大小', param)
      this.queryInfo = _.assign(this.queryInfo, { pageSize: param })
      this.loadTableData()
    },
    handleSelect(key) {
      if (this.activeIndex == key) return
      this.activeIndex = key
      this.$set(this.searchParams, 'type', key)
      this.$set(this.searchParams, 'uploadDate', '')
      this.$set(this.searchParams, 'name', '')
      this.$set(this.searchConfig.requireOptions[0], 'data', '')
      this.$refs.table.clearSelection()
      this.loadTableData()
      this.setConfig(key)
    },
    // 设置配置
    setConfig(key) {
      const statusIndex = _.findIndex(TABLE_COLUMNS, (item) => item.prop == 'testPaper')
      TABLE_COLUMNS[statusIndex].label = ['制度名称', '表单名称'][key]
      this.$set(
        this.searchConfig.requireOptions[0].config,
        'placeholder',
        this.tabList[key].searchPlace
      )
      this.$set(searchConfig, 'popoverOptions', key == '2' ? SEARCH_POPOVER_POPOVER_OPTIONS : [])
      // const examNameIndex = _.findIndex(TABLE_COLUMNS, (item) => {
      //   return item.prop === 'examName'
      // })
      // const statusIndex = _.findIndex(TABLE_COLUMNS, (item) => {
      //   return item.prop === 'status'
      // })
      // if (this.activeIndex === '0') {
      //   if (statusIndex === -1) {
      //     TABLE_COLUMNS.splice(examNameIndex + 1, 0, STATUS_CONFIG)
      //   }
      // } else {
      //   if (statusIndex !== -1) {
      //     TABLE_COLUMNS.splice(statusIndex, 1)
      //   }
      // }
      //  _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // this.columnsVisible=key=='2'?TABLE_COLUMNS2:TABLE_COLUMNS
      // this.columnsVisible = _.map(TABLE_COLUMNS2, ({ prop }) => prop).filter((v) => {
      //   return v != 'testPaper' && v != 'createUser'
      // })
    },
    //选择时间搜索
    dateChange(date) {
      this.$set(this.searchParams, 'uploadDate', date || '')
      this.loadTableData()
    },
    //跳转
    jumpDetail(row) {
      if (row.url) {
        window.oepn(row.url)
      } else {
        this.$message.error('此文件类型无法预览，推荐下载之后打开')
      }
    },
    // 搜索
    handleSearch(params) {
      _.assign(this.searchParams, params)
      this.loadTableData()
    },
    // 删除下载操作
    handleAuth(row, key) {
      if (key == 'download') {
        this.$message.warning('点击下载')
      } else if (key == 'delete') {
        const content =
          this.activeIndex == '0' ? '您确定要删除该制度吗？' : '您确定要删除该表单吗？'
        this.$confirm(content, '提醒', {
          type: 'warning'
        })
          .then(() => {
            this.$message.warning('删除成功')
          })
          .catch(() => {
            this.$message.warning('取消成功')
          })
      } else {
        this.$confirm('您确定要拷贝该课程到自己的组织吗？', '提醒', {
          type: 'warning'
        })
          .then(() => {
            this.$router.push({ path: '/system/listingCourseApply' })
          })
          .catch(() => {
            this.$message.warning('申请失败')
          })
      }
    },

    // 具体的删除函数
    deleteFun(id) {
      delCategory({ id }).then(() => {
        this.loadTableData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$refs.table.clearSelection()
      })
    },
    // 单个删除
    // handleDelete(row) {
    //   let hasChildren = !_.isEmpty(row.children)
    //   if (hasChildren) {
    //     this.$message.error('很抱歉，您选中的分类下存在子分类，请先将子分类调整后再删除!')
    //   } else {
    //     this.$confirm('您确定要删除选中的分类吗？', '提醒', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.deleteFun(row.id)
    //     })
    //   }
    // },
    // 批量删除
    deleteSelected(selection) {
      if (!selection.length) return
      const content = this.activeIndex == 2 ? '你确定申请吗？' : '你确定删除？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('删除成功')
        })
        .catch(() => {
          console.log('删除失败')
        })
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getArrangeList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }

      // if (this.tableLoading) return
      // try {
      //   this.tableLoading = true
      //   getCategoryList(this.searchParams).then((res) => {
      //     console.log(res)
      //     this.tableData = res
      //     this.tableLoading = false
      //   })
      //   this.$refs.orgEdit.loadOrgTree()
      // } catch (error) {
      //   this.$message.error(error.message)
      // } finally {
      //   this.tableLoading = false
      // }
    },

    //置顶或取消置顶
    handleStatus(row) {
      console.log(row)
      this.$message.warning('置顶操作')
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
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
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
  justify-content: space-between;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
}
</style>
