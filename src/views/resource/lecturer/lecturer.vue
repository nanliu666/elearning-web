<template>
  <div class="trainingArrange">
    <page-header title="讲师管理">
      <!-- v-p="EXPORT_LECTURER" -->
      <el-button
        slot="rightMenu"
        :disabled="_.isEmpty(tableData)"
        type="primary"
        size="medium"
        @click="exportData"
      >
        导出
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="ADD_LECTURER"
        type="primary"
        size="medium"
        @click="toAddLecturer"
      >
        创建讲师
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="IMPORT_LECTURER"
        type="primary"
        size="medium"
        @click="toImportLecturer"
      >
        导入讲师
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <seach-popover
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
                  style="font-size: 16px; cursor: pointer"
                  class="operations__btns--item"
                  size="mini"
                  icon="el-icon-refresh-right"
                  type="text"
                  @click="islistTeacher(undefined)"
                >
                  <!-- <i class="iconfont iconicon_refresh" /> -->
                </el-button>
              </el-tooltip>
              <span
                class="text_refresh"
                style="font-size: 16px; cursor: pointer"
                @click="islistTeacher(undefined)"
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
                  <el-button
                    class="operations__btns--item"
                    size="mini"
                    type="text"
                    icon="el-icon-setting"
                    style="color: #acb3b8; font-size: 16px"
                  >
                    <!-- <i class="iconfont iconicon_setting" /> -->
                  </el-button>
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
            v-p="DELETE_LECTURER"
            style="margin-bottom: 0"
            type="text"
            @click="() => handleRemoveItems(selection)"
          >
            批量删除
          </el-button>
        </template>
        <!-- 培训名称 -->
        <template
          slot="name"
          slot-scope="{ row }"
        >
          <el-button
            type="text"
            @click="toParticularsLecturer(row)"
          >
            {{ row.name }}
          </el-button>
        </template>

        <!-- 操作 -->
        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-if="scope.row.status == 1"
            v-p="STOP_LECTURER"
            class="marginLine"
            type="text"
            size="medium"
            @click.stop="iseditSysRulus(scope.row, 0, '冻结')"
          >
            冻结
          </el-button>
          <span
            v-else
            v-p="STOP_LECTURER"
            class="marginLineColor"
            style="cursor: pointer"
            size="medium"
            @click.stop="iseditSysRulus(scope.row, 1, '解冻')"
          >
            解冻
          </span>

          <el-button
            v-p="EDIT_LECTURER"
            class="marginLine"
            type="text"
            size="medium"
            @click.stop="tocompileLecturer(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            v-p="DELETE_LECTURER"
            class="marginLine"
            type="text"
            size="medium"
            @click.stop="isTeacherdelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>

    <!-- 停用弹框 -->
    <el-dialog
      title="提醒"
      :visible.sync="blockDialogVisible"
      append-to-body
      width="420px"
    >
      <div class="dialog_box">
        <i class="el-icon-warning dialog_box_icon-warning"></i>
        <span>您选中讲师名下有正在进行或未开始的面授课程或线下培训{{ showBtnDel ? '删除' : '停用' }}
          <span></span>后需尽快对课程进行调整。 你确定要<span>{{
            showBtnDel ? '删除' : '停用'
          }}</span></span>该讲师吗？
        <div>
          <div
            class="showBtn"
            @click="showBtnData = !showBtnData"
          >
            查看关联课程 <i
              v-show="!showBtnData"
              class="el-icon-arrow-down"
            ></i>
            <i
              v-show="showBtnData"
              class="el-icon-arrow-up"
            ></i>
          </div>
          <div
            v-for="(item, index) in CourseList"
            v-show="showBtnData"
            :key="index"
            class="item_box"
          >
            {{ item.courseName }}
          </div>
        </div>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="blockDialogVisible = false">
          取 消
        </el-button>
        <el-button
          v-show="!showBtnDel"
          type="primary"
          @click="RulusFn(rowData, 0)"
        >
          确 定
        </el-button>
        <el-button
          v-show="showBtnDel"
          type="primary"
          @click="TeacherdeleteFn(rowData)"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <export-dialog
      :visible.sync="isShowExportDialog"
      :total-num="page.total"
      :export-api="exportCourseListData"
      :export-params="queryListParams"
    />
  </div>
</template>

<script>
import { getCourseListData, exportCourseListData } from '@/api/course/course'
import {
  listTeacher,
  editSysRulus,
  Teacherdelete,
  queryTeacherCataList
} from '@/api/lecturer/lecturer'
// import { delete } from 'vue/types/umd'
// 侧栏数据
const teacherLevel = ['预备级', '助理级', '初级', '中级', '高级', '资深级', '专家级', '非讲师']
const teacherTitle = ['', '助理级', '初级', '中级', '高级', '研究员级', '无']
const cata = ['', '技术类', '管理类', '营销类', '技能类']
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '讲师姓名',
    prop: 'name',
    width: '160',
    slot: true,
    fixed: 'left'
  },
  {
    label: '部门',
    prop: 'orgName',
    align: 'center',
    formatter: (row) => (row.teacher_type ? '--' : row.orgName),
    width: '160'
  },
  {
    label: '岗位',
    prop: 'positionName',
    align: 'center',
    formatter: (row) => (row.teacher_type ? '--' : row.positionName),
    width: '200'
  },

  {
    label: '性别',
    prop: 'sex',
    formatter: (row) => (row.sex === 0 ? '女' : row.sex === 1 ? '男' : '--'),
    width: '120'
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => (row.status ? '正常' : '冻结'),
    width: '80'
  },
  {
    label: '讲师类型',
    prop: 'teacher_type',
    formatter: (row) => (row.teacher_type === 0 ? '内部' : row.teacher_type === 1 ? '外部' : '--'),
    width: '120'
  },
  {
    label: '聘用类型',
    prop: 'type',
    formatter: (row) => (row.type === 1 ? '内训' : row.type === 2 ? '外聘' : '--'),
    width: '120'
  },
  {
    label: '讲师聘期',
    prop: '',
    formatter: (row) =>
      row.hire_start_time && row.hire_end_time
        ? row.hire_start_time + '~' + row.hire_end_time
        : '--',
    width: '200'
  },
  {
    label: '讲师等级',
    prop: 'teacher_level',
    formatter: (row) => teacherLevel[+row.teacher_level],
    minWidth: '120'
  },
  {
    label: '专业分类',
    prop: 'professional_cata',
    formatter: (row) => cata[+row.professional_cata],
    minWidth: '120'
  },
  {
    label: '讲师职称',
    prop: 'teacher_title',
    formatter: (row) => teacherTitle[+row.teacher_title],
    minWidth: '120'
  },
  {
    label: '擅长领域',
    prop: 'skilled_field',
    formatter: (row) => {
      if (row.skilled_field instanceof Array) {
        return row.skilled_field.join('; ')
      } else return ''
    },
    minWidth: '130'
  },
  {
    label: '是否推荐',
    prop: 'is_recommend',
    align: 'center',
    formatter: (row) => (row.is_recommend === 1 ? '是' : row.is_recommend === 0 ? '否' : '--'),
    minWidth: '80'
  },
  {
    label: '联系方式',
    prop: 'phonenum',
    align: 'center',
    minWidth: '160'
  },
  {
    label: '创建人',
    prop: 'createName',
    align: 'center',
    minWidth: '160'
  },

  {
    label: '创建时间',
    prop: 'create_time',
    align: 'center',
    minWidth: '160'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200,
    fixed: 'right'
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入姓名/手机号码搜索' },
    data: '',
    field: 'likeQuery',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'status',
    label: '状态',
    type: 'select',
    options: [
      { value: '', label: '全部' },
      { value: '0', label: '冻结' },
      { value: '1', label: '正常' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'type',
    label: '聘用类型',
    type: 'select',
    options: [
      { value: '', label: '全部' },
      { value: '1', label: '内训' },
      { value: '2', label: '外聘' }
    ]
  },
  {
    config: { placeholder: '请输入' },
    data: '',
    field: 'skilled_field',
    label: '擅长领域',
    type: 'input'
  },
  {
    data: '',
    field: 'categoryId',
    label: '讲师分类',
    type: 'treeSelect',
    config: {
      multiple: true,
      selectParams: {
        placeholder: '讲师分类'
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
          value: 'idStr'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'teacher_level',
    label: '讲师级别',
    type: 'select',
    options: [
      { value: '00', label: '预备级' },
      { value: '01', label: '助理级' },
      { value: '02', label: '初级' },
      { value: '03', label: '中级' },
      { value: '04', label: '高级' },
      { value: '05', label: '资深级' },
      { value: '06', label: '专家级' },
      { value: '07', label: '非讲师' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'professional_cata',
    label: '专业分类',
    type: 'select',
    options: [
      { value: '01', label: '技术类' },
      { value: '02', label: '管理类' },
      { value: '03', label: '营销类' },
      { value: '04', label: '技能类' }
    ]
  },
  {
    data: '',
    field: 'is_recommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { value: '1', label: '是' },
      { value: '0', label: '否' }
    ]
  }
]
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}

import {
  EXPORT_LECTURER,
  ADD_LECTURER,
  STOP_LECTURER,
  EDIT_LECTURER,
  DELETE_LECTURER,
  IMPORT_LECTURER
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    exportDialog: () => import('@/components/common-export/exportDialog.vue')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      queryListParams: {}, // 剥离请求题库列表的入参，因为导出弹窗亦需要此入参
      isShowExportDialog: false, // 是否展示导出弹窗
      searchParamsData: '',
      CourseList: '',
      blockDialogVisible: false,
      showBtnData: false,
      showBtnDel: false,
      rowData: '',
      props: {
        lazy: true,
        isLeaf: (data, node) => {
          if (node.level === 2 || data.label == '未分类') {
            return true
          }
        }
      },

      dataAddCatalog: { input: '' },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        optionData: ''
      },
      // tree
      filterText: '',
      // 侧栏数据
      data: [],
      input: '',
      isShowinput: false, //显示分组——输入框
      isEdit: false, //显示分类——输入框
      isEditId: '', //显示分类——输入框id
      btnshow: 'false', //新增分类&移动

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格
      query: {
        name: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter(() => {
        return true
      }),
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    exportCourseListData: () => exportCourseListData,
    EXPORT_LECTURER: () => EXPORT_LECTURER,
    ADD_LECTURER: () => ADD_LECTURER,
    STOP_LECTURER: () => STOP_LECTURER,
    EDIT_LECTURER: () => EDIT_LECTURER,
    DELETE_LECTURER: () => DELETE_LECTURER,
    IMPORT_LECTURER: () => IMPORT_LECTURER,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([STOP_LECTURER, EDIT_LECTURER, DELETE_LECTURER])
      },
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.islistTeacher(undefined)
    this.getTeacherList()
  },
  activated() {
    this.islistTeacher(undefined)
    this.getTeacherList()
  },
  methods: {
    exportData() {
      this.isShowExportDialog = true
    },
    // 获取讲师分类列表
    getTeacherList() {
      queryTeacherCataList({ source: 'teacher' }).then((res) => {
        this.searchPopoverConfig.popoverOptions[3].config.treeParams.data = res
      })
    },
    //导入
    toImportLecturer() {
      this.$router.push({ path: '/resource/lecturer/importLecturer' })
    },
    // 去添加
    toAddLecturer() {
      this.$router.push({
        path: '/resource/lecturer/addLecturer',
        meta: {
          $keepAlive: false
        }
      })
    },
    // 去详情
    toParticularsLecturer(row) {
      this.$router.push({
        path: '/resource/lecturer/particularsLecturer',
        query: {
          id: row.idStr,
          name: row.name,
          userEmail: row.user_email,
          sex: row.sex,
          phonenum: row.phonenum,
          user_id_str: row.user_id_str
        }
      })
    },
    // 去编辑
    tocompileLecturer(row) {
      let query = { id: row.idStr }
      this.$router.push({
        path: '/resource/lecturer/compileLecturer',
        query
      })
    },

    // 删除讲师fn
    TeacherdeleteFn(id) {
      let params = {
        ids: id.idStr || id.teacherId
      }
      Teacherdelete(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.islistTeacher()
        this.blockDialogVisible = false
      })
    },

    // 删除讲师按钮
    isTeacherdelete(id) {
      getCourseListData({ teacherId: id.user_id_str, pageNo: 1, pageSize: 999 }).then((res) => {
        // 过滤在线课程
        let countIndex = 0
        res.data.map((item) => {
          if (item.type == 1) {
            // 在线课程
            ++countIndex
          }
        })
        // 如果没有课程&在线课程
        if (res.data.length == 0 || res.data.length == countIndex) {
          this.$confirm('您确定要删除该讲师吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.TeacherdeleteFn(id)
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        } else {
          // 如果有课程
          this.blockDialogVisible = true
          // teacherId
          this.CourseList = res.data
          this.showBtnDel = true
          this.rowData = id
        }
      })
    },
    // 启动/停用方法
    RulusFn(id, i) {
      let params = {
        id: '',
        status: '' // '0 停用 1 正常',
      }
      params.id = id.idStr || id.teacherId
      params.status = i

      editSysRulus(params).then(() => {
        this.$message({
          message: `${i ? '解冻' : '冻结'}成功`,
          type: 'success'
        })
        this.blockDialogVisible = false
        this.islistTeacher()
      })
    },

    // 启动/停用按钮
    iseditSysRulus(id, i, text) {
      // 启用弹框
      if (i) {
        this.$confirm('您确定要解冻该讲师吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.RulusFn(id, i)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${text}`
            })
          })
      } else {
        // 停用弹框
        // 先查讲师下面有没有课程
        // 再弹框

        getCourseListData({ teacherId: id.user_id_str, pageNo: 1, pageSize: 999 }).then((res) => {
          // 过滤在线课程
          let countIndex = 0
          res.data.map((item) => {
            if (item.type == 1) {
              // 在线课程
              ++countIndex
            }
          })
          // 如果没有课程&在线课程
          if (res.data.length == 0 || res.data.length == countIndex) {
            this.$confirm('您确定要冻结该讲师吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.RulusFn(id, 0)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: `已取消${text}`
                })
              })
          } else {
            // 如果有课程
            this.blockDialogVisible = true
            this.CourseList = res.data
            this.showBtnDel = false
            this.rowData = id
          }
        })
      }
    },

    // 查询讲师列表
    islistTeacher() {
      let params = { ...this.searchParamsData, ...this.page }
      if (!params.categoryId) {
        delete params.categoryId
      }
      this.queryListParams = params
      listTeacher(params).then((res) => {
        this.tableData = res.teacherInfos
        this.page.total = res.totalNum || 0
      })
    },

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.islistTeacher()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.islistTeacher()
    },

    // 搜索
    handleSearch(searchParams) {
      this.page.pageNo = 1
      this.page.currentPage = 1
      this.searchParamsData = searchParams
      this.islistTeacher()
    },
    // 批量删除
    handleRemoveItems(selection) {
      this.$confirm('确定将选择数据删除?', {
        type: 'warning'
      }).then(() => {
        let params = {
          ids: ''
        }

        for (let i = 0; i < selection.length; i++) {
          params.ids += selection[i].idStr + ','
        }
        Teacherdelete(params).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          // 删除完成后更新视图
          this.$refs.table.clearSelection()
          this.islistTeacher()
          // this.$refs.myTree.islistTeacherCategory()
        })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep .el-input
  width: 100%

.el-select
  width: 100%

/deep/.el-input

.operations__btns
  color: #acb3b8
  display: flex
.text_refresh
  color: #acb3b8
  margin-right: 5px
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
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
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  padding-left: 25%;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.dialog_box {
  padding: 0 10px;
  color: #606266;
  font-size: 14px;
  .dialog_box_icon-warning {
    color: #e6a23c;
    font-size: 24px !important;
    margin-right: 12px;
  }
  .showBtn {
    color: #227ffa;
    margin-top: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .item_box {
    color: #606266;
    margin-top: 5px;
  }
}
/deep/.el-card,
/deep/.is-never-shadow {
  border: none;
}

/deep/ .el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}
::v-deep .el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}

.el-popover {
  width: 60% !important;
  margin-left: 300px !important;
}

/deep/.el-pagination {
  padding-right: 50px;
}
.marginLineColor {
  color: #01aafc;
}
/deep/.el-table__empty-block {
  text-align: left;
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
