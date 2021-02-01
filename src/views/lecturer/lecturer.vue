<template>
  <div class="trainingArrange">
    <div class="box_title">
      <div class="title">
        讲师管理
      </div>
      <div>
        <el-button
          v-p="ADD_LECTURER"
          type="primary"
          size="medium"
          @click="toAddLecturer"
        >
          &nbsp; 添加讲师 &nbsp;
        </el-button>
      </div>
    </div>

    <div class="box_content">
      <!-- 内容 -->
      <div class="draft_issue">
        <div class="issue_l">
          <my-column
            :column-interface="columnInterface"
            @treeClick="treeClick"
          ></my-column>
        </div>

        <div class="issue_r">
          <!-- 表格内容 -->
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
                    <!-- <i class="el-icon-upload2"></i>
                    &nbsp; &nbsp;
                    <span>导出</span> -->
                    &nbsp; &nbsp;
                    <el-tooltip
                      class="operations__btns--tooltip"
                      content="刷新"
                      effect="dark"
                      placement="top"
                      style="color:#acb3b8;"
                    >
                      <el-button
                        style="font-size: 16px; cursor:pointer;"
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
                      style="font-size: 16px; cursor:pointer;"
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
                          style="color:#acb3b8; font-size: 16px;"
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
                  style="margin-bottom:0;"
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

              <!-- 状态 -->
              <template
                slot="status"
                slot-scope="{ row }"
              >
                <span v-if="row.status == 0">停用</span>
                <span v-if="row.status == 1">正常</span>
              </template>

              <!-- 性别 -->
              <template
                slot="sex"
                slot-scope="{ row }"
              >
                <span v-if="row.sex == 0">女</span>
                <span v-if="row.sex == 1">男</span>
              </template>

              <!-- '讲师类型（1：内训，2：外聘）',-->
              <template
                slot="type"
                slot-scope="{ row }"
              >
                <span v-if="row.type == 1">内训</span>
                <span v-if="row.type == 2">外聘</span>
              </template>

              <!--  是否推荐（1：是，0：否）',-->
              <template
                slot="is_recommend"
                slot-scope="{ row }"
              >
                <span v-if="row.is_recommend == 1">是</span>
                <span v-if="row.is_recommend == 0">否</span>
              </template>

              <!-- '是否最新讲师（1：是，0：否）', -->

              <template
                slot="is_latest_teacher"
                slot-scope="{ row }"
              >
                <span v-if="row.is_latest_teacher == 1">是</span>
                <span v-if="row.is_latest_teacher == 0">否</span>
              </template>
              <!-- '是否热门讲师（1：是，0：否）', -->
              <template
                slot="is_popular_teacher"
                slot-scope="{ row }"
              >
                <span v-if="row.is_popular_teacher == 1">是</span>
                <span v-if="row.is_popular_teacher == 0">否</span>
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
                  @click.stop="iseditSysRulus(scope.row, 0)"
                >
                  停用
                </el-button>
                <span
                  v-else
                  v-p="STOP_LECTURER"
                  class="marginLineColor"
                  style=" cursor:pointer; "
                  size="medium"
                  @click.stop="iseditSysRulus(scope.row, 1)"
                >
                  启用
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
        </div>
      </div>
    </div>

    <!-- 停用弹框 -->
    <el-dialog
      title="提醒"
      :visible.sync="blockDialogVisible"
      append-to-body
      width="420px"
    >
      <div class="dialog_box">
        <i class="el-icon-warning dialog_box_icon-warning"></i>
        <span>您选中讲师名下有正在进行或未开始的面授课程或线下培训，
          <span>{{ showBtnDel ? '删除' : '停用' }}</span>后需尽快对课程进行调整。 你确定要<span>{{ showBtnDel ? '删除' : '停用' }}</span>该讲师吗？</span>
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
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course'
import {
  listTeacherCategory,
  addCatalog,
  listTeacher,
  editSysRulus,
  deleteTeacherCatalog,
  Teacherdelete,
  move,
  editTeacherCatalog
} from '@/api/lecturer/lecturer'
// import { delete } from 'vue/types/umd'
// 侧栏数据

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
    label: '手机号码',
    prop: 'phonenum',
    width: '160'
  },
  {
    label: '电子邮箱',
    prop: 'user_email',
    width: '200'
  },
  {
    label: '状态',
    prop: 'status',
    slot: true,
    width: '80'
  },
  {
    label: '性别',
    prop: 'sex',
    slot: true,
    width: '120'
  },
  {
    label: '讲师类型',
    prop: 'type',
    slot: true,
    width: '120'
  },
  // {
  //   label: '擅长领域',
  //   prop: 'lingyu',
  //   minWidth: 130
  // },
  {
    label: '讲师级别',
    prop: 'teacher_level',
    minWidth: '120'
  },
  {
    label: '讲师职称',
    prop: 'teacher_title',
    minWidth: '80'
  },
  {
    label: '是否推荐',
    prop: 'is_recommend',
    slot: true,
    minWidth: '80'
  },
  {
    label: '是否最新讲师',
    prop: 'is_latest_teacher',
    slot: true,
    minWidth: '120'
  },
  {
    label: '是否热门讲师',
    prop: 'is_popular_teacher',
    slot: true,
    minWidth: '120'
  },
  {
    label: '创建人',
    prop: 'createName',
    minWidth: '160'
  },
  {
    label: '创建时间',
    prop: 'create_time',
    minWidth: '160'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
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
      { value: '0', label: '停用' },
      { value: '1', label: '正常' },
      { value: '', label: '全部' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'type',
    label: '讲师类型',
    type: 'select',
    options: [
      { value: '1', label: '内训' },
      { value: '2', label: '外聘' },
      { value: '', label: '全部' }
    ]
  },
  // {
  //   config: { placeholder: '请选择' },
  //   data: '',
  //   field: 'lingyu',
  //   label: '擅长领域',
  //   type: 'select',
  //   options: []
  // },
  {
    config: { placeholder: '请输入' },
    data: '',
    field: 'teacher_level',
    label: '讲师级别',
    type: 'input'
  },
  {
    config: { placeholder: '请输入' },
    data: '',
    field: 'teacher_title',
    label: '讲师职称',
    type: 'input'
  },
  {
    // config: { placeholder: '请选择' },
    data: '',
    field: 'is_recommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { value: '1', label: '是' },
      { value: '0', label: '否' }
    ]
  },
  {
    // config: { placeholder: '请选择' },
    data: '',
    field: 'is_latest_teacher',
    label: '是否最新',
    type: 'select',
    options: [
      { value: '1', label: '是' },
      { value: '0', label: '否' }
    ]
  },
  {
    // config: { placeholder: '请选择' },
    data: '',
    field: 'is_popular_teacher',
    label: '是否热门',
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

import { ADD_LECTURER, STOP_LECTURER, EDIT_LECTURER, DELETE_LECTURER } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    MyColumn: () => import('./components/MyColumn')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      CourseList: '',
      blockDialogVisible: false,
      showBtnData: false,
      showBtnDel: false,
      rowData: '',
      // 接口
      columnInterface: {
        listTeacherCategory, //查询讲师分类列表
        addCatalog, //新增分组/分类
        deleteTeacherCatalog, //删除分组/分类
        move, //移动
        editTeacherCatalog //编辑
      },

      // 保存左栏点过的的id或者默认id
      clickId: '',
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
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    ADD_LECTURER: () => ADD_LECTURER,
    STOP_LECTURER: () => STOP_LECTURER,
    EDIT_LECTURER: () => EDIT_LECTURER,
    DELETE_LECTURER: () => DELETE_LECTURER,
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
  },
  activated() {
    this.islistTeacher(undefined)
  },
  methods: {
    treeClick(val) {
      this.clickId = val
      this.islistTeacher(val)
    },
    isgetCatalogs() {},
    // 去添加
    toAddLecturer() {
      this.$router.push({ path: '/lecturer/addLecturer' })
    },
    // 去详情
    toParticularsLecturer(row) {
      this.$router.push({
        path: '/lecturer/particularsLecturer',
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
      // this.$router.push({ path: `/lecturer/compileLecturer?id= ${row.user_id_str}&name =${row.name}&userEmail=${row.user_email}&sex=${row.sex}` })
      this.$router.push({
        path: '/lecturer/compileLecturer',
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
        // 如果没有课程
        if (res.data.length === 0) {
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
          message: `${i ? '启动' : '停用'}成功`,
          type: 'success'
        })
        this.blockDialogVisible = false
        this.islistTeacher()
      })
    },

    // 启动/停用按钮
    iseditSysRulus(id, i) {
      // 启用弹框
      if (i) {
        this.$confirm('您确定要启用该讲师吗？', '提示', {
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
              message: '已取消删除'
            })
          })
      } else {
        // 停用弹框
        // 先查讲师下面有没有课程
        // 再弹框

        getCourseListData({ teacherId: id.user_id_str, pageNo: 1, pageSize: 999 }).then((res) => {
          // 如果没有课程
          if (res.data.length === 0) {
            this.$confirm('您确定要停用该讲师吗？', '提示', {
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
                  message: '已取消删除'
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
    islistTeacher(id, searchParams) {
      let params = { categoryId: id || this.clickId, ...searchParams, ...this.page }
      if (!params.categoryId) {
        delete params.categoryId
      }
      console.log(params)
      listTeacher(params).then((res) => {
        this.tableData = res.teacherInfos
        this.page.total = res.totalNum || 0
        // 下拉筛选框
        // this.tableData.forEach((item) => {
        //   SEARCH_POPOVER_POPOVER_OPTIONS[2].options.push({
        //     value: item.lingyu,
        //     label: item.lingyu
        //   })
        // })
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
      this.islistTeacher(this.clickId, searchParams)
    },
    // 批量删除
    handleRemoveItems(selection) {
      this.$confirm('确定将选择数据删除?', {
        type: 'warning'
      })
        .then(() => {
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
          })
        })
        .then(() => {
          // 删除完成后更新视图
          this.$refs.table.clearSelection()
          this.islistTeacher()
        })
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/.el-input
  width: 100%
/deep/.el-select
  width: 100%
/deep/.el-input

.operations__btns
    color: #acb3b8
    display: flex;
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

.trainingArrange {
  .box_title {
    height: 60px;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
  }
  .box_content {
    background-color: #fff;
    .content_nav {
      height: 50px;
      border-bottom: 1px solid #ccc;
      display: flex;
      span {
        height: 50px;
        line-height: 50px;
        margin-left: 30px;
      }
      .select {
        border-bottom: 3px solid #1677ff;
      }
    }
    .draft_issue {
      padding-top: 25px;
      display: flex;
      height: 710px;
      // overflow: hidden;
      .issue_l {
        position: relative;
        width: 20%;
        border-right: 1px solid #ccc;
        padding-top: 7px;
        height: 100%;
        .issue_l_tree {
          padding: 20px;
          // padding: 0 25px;
          width: 100%;
          height: 100%;
          padding-bottom: 200px;
          overflow: auto;
          // &::-webkit-scrollbar {
          //   display: none;
          // }
          /deep/.el-input {
            margin-bottom: 15px;
          }
          .ungrouped {
            color: #606266;
            margin: 0 0 5px 22px;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .btn_bottom_box {
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          .btn_bottom {
            position: relative;
            bottom: 0;
            left: 0;
            height: 50px;
            width: 100%;
            border-top: 1px solid #ccc;
            .btn1 {
              display: block;
              background-color: #fff;
              cursor: pointer;
              line-height: 50px;
              height: 100%;
              width: 100%;
              text-align: center;
              color: #1677ff;
            }
          }
        }
      }
      .issue_r {
        width: 75%;
        padding: 0 40px;
      }
      .istrainingArrange {
        width: 100%;
      }
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;

      // /deep/ .el-icon-more {
      //   transform: rotate(-90deg);
      // }
      .right-content {
        display: none;
      }

      &:hover {
        .right-content {
          display: inline-block;
        }
      }
      .more-column {
        display: inline-block;
        transform: rotate(90deg);
        -ms-transform: rotate(90deg); /* IE 9 */
        -moz-transform: rotate(90deg); /* Firefox */
        -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
        -o-transform: rotate(90deg);
      }
    }
    .tree_input {
      width: 60%;
      font-size: 14px;

      /deep/ input {
        height: 25px;
        margin-left: -15px;
      }
    }
    /deep/ .el-tree-node__content {
      margin-top: 10px;
    }

    .isShowinput {
      margin-top: 5px;
      display: flex;
      line-height: 35px;
      .isShowinput_input {
        width: 65%;
      }

      .isShowinput_yes {
        color: #2092fb;
        padding: 0 12px;
        cursor: pointer;
      }
      .isShowinput_no {
        cursor: pointer;
      }
      /deep/ input {
        height: 25px;
      }
    }
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
  /deep/ .el-input {
    width: 65px;
  }
}

.marginLine {
  margin-left: 20px;
}

.marginLineColor {
  color: #01aafc;
  margin-left: 20px;
}
</style>
