<template>
  <div class="course">
    <!-- 头部 -->
    <page-header title="课程管理">
      <!-- v-p="EXPORT_COURSE" -->
      <el-button
        slot="rightMenu"
        size="medium"
        :disabled="_.isEmpty(tableData)"
        type="primary"
        @click="exportData"
      >
        导出
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="ADD_COURSE"
        size="medium"
        type="primary"
        @click="toEstablishCourse"
      >
        创建课程
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="IMPORT_COURSE"
        size="medium"
        type="primary"
        @click="importCourse"
      >
        导入课程
      </el-button>
    </page-header>

    <!-- Dialog无数据 -->
    <div
      v-if="!tableData"
      id="isdialog_show"
    >
      <div>如何创建课程：</div>
      <div>1.先在 <span @click="toCatalog">【课程中心-分类管理】</span> 完善展示的分类配置；</div>
      <div>2.开始创建课程。</div>
      <i class="el-icon-close"></i>
    </div>

    <div class="course_in">
      <!-- 内容 -->
      <div class="draft">
        <!-- 表格内容 -->
        <basic-container block>
          <common-table
            ref="table"
            :loading="loading"
            :columns="columnsVisible | columnsFilter"
            :config="tableConfig"
            :data="tableData"
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
                      @click="refreshTableData"
                    >
                    </el-button>
                  </el-tooltip>
                  <span
                    class="text_refresh"
                    style="cursor: pointer; font-size: 16px"
                    @click="refreshTableData"
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
                v-p="SYNCHRONIZATION_COURSE"
                style="margin-bottom: 0"
                type="text"
                @click="() => synchronizationCourse(selection)"
              >
                批量同步
              </el-button>
              <el-button
                v-p="DELETE_COURSE"
                style="margin-bottom: 0"
                type="text"
                @click="() => handleRemoveItems(selection)"
              >
                批量删除
              </el-button>
            </template>
            <!-- 课程名称 -->
            <template
              slot="courseName"
              slot-scope="{ row }"
            >
              <el-link
                type="primary"
                class="courseName"
                @click="todetail(row.id)"
              >
                {{ row.courseName ? row.courseName : '--' }}
              </el-link>
            </template>
            <template #handler="{ row, column }">
              <el-button
                v-if="row.isPutaway"
                v-p="PUTAWAY_COURSE"
                type="text"
                :disabled="disabled(0, row.status)"
                @click="handleCommand(0, row)"
              >
                停用
              </el-button>
              <el-button
                v-else
                v-p="PUTAWAY_COURSE"
                type="text"
                :disabled="disabled(0, row.status)"
                @click="handleCommand(1, row)"
              >
                发布
              </el-button>
              <el-button
                v-p="EDIT_COURSE"
                type="text"
                :disabled="disabled(1, row.status)"
                @click="handleCommand(2, row)"
              >
                编辑
              </el-button>
              <el-button
                v-p="DELETE_COURSE"
                type="text"
                :disabled="disabled(2, row.status)"
                @click="handleCommand(3, row, column)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </basic-container>
      </div>
    </div>
    <!-- 停用弹框 -->
    <el-dialog
      title="提醒"
      :visible="stopVisible"
      append-to-body
      width="420px"
      @close="cancel"
    >
      <div class="dialog_box">
        <i
          class="el-icon-warning dialog_box_icon-warning"
          style="color: #f3cc84; margin-right: 10px; font-size: 18px"
        ></i>
        <span v-html="information"></span>
        <div>
          <div
            class="showBtn"
            @click="showBtn = !showBtn"
          >
            <span>查看关联内容</span>
            <i
              v-show="!showBtn"
              class="el-icon-arrow-down"
            ></i>
            <i
              v-show="showBtn"
              class="el-icon-arrow-up"
            ></i>
          </div>
          <div
            v-for="(item, index) in relatedContent"
            v-show="showBtn"
            :key="index"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="item"
              placement="top-start"
              :disabled="item.length < 15"
            >
              <div class="item_box">
                {{ item }}
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-show="!showBtnDel"
          @click="cancel"
        >
          取 消
        </el-button>
        <el-button
          v-show="!showBtnDel"
          type="primary"
          @click="stopUsing"
        >
          确 定
        </el-button>
        <el-button
          v-show="showBtnDel"
          type="primary"
          @click="cancel"
        >
          知道了
        </el-button>
      </div>
    </el-dialog>
    <export-dialog
      :visible.sync="isShowExportDialog"
      :total-num="page.total"
      :export-api="exportCourseList"
      :export-params="queryListParams"
    />
  </div>
</template>

<script>
import {
  getCourseListData,
  listTeacher,
  getCourseInfoUserList,
  delCourseInfo,
  putawayOperate,
  classList,
  syncCourses,
  verifyCourseCanDelete,
  exportCourseList
} from '@/api/course/course'
import { relatedKnowledgeList } from '@/api/knowledge/knowledge'
// 表格属性
const type = ['在线', '面授', '直播']
const electiveType = ['开放选修', '通过审批', '禁止选修']
const tableColumns = [
  {
    label: '课程编号',
    prop: 'courseNo',
    fixed: 'left',
    minWidth: 150
  },
  {
    label: '课程名称',
    prop: 'courseName',
    slot: true,
    minWidth: 150,
    fixed: 'left'
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => {
      let str = '--'
      switch (row.status) {
        case 0:
          str = '审核中'
          break
        case 1:
          str = '已发布'
          break
        case 2:
          str = '草稿'
          break
        case 3:
          str = '已停用'
          break
        case 11:
          str = '已拒绝'
          break
        case 12:
          str = '已撤回'
          break
      }
      return str
    },
    minWidth: 120
  },
  {
    label: '讲师',
    prop: 'teacherName',
    minWidth: 120
  },
  {
    label: '课程分类',
    prop: 'catalogName',
    minWidth: 120
  },
  {
    label: '归属组织',
    prop: 'orgScopeName',
    minWidth: 120
  },
  {
    label: '授课方式',
    prop: 'type',
    formatter: (row) => (type[row.type - 1] ? type[row.type - 1] : '--'),
    minWidth: 120
  },
  {
    label: '选修类型',
    prop: 'electiveType',
    formatter: (row) =>
      electiveType[row.electiveType - 1] ? electiveType[row.electiveType - 1] : '--',
    minWidth: 120
  },
  {
    label: '知识体系',
    prop: 'knowledgeSystemFullName',
    minWidth: 120
  },
  {
    label: '是否推荐',
    prop: 'isRecommend',
    formatter: (row) => (row.isRecommend === 0 ? '否' : '是'),
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'creatorName',
    minWidth: 120
  },
  {
    label: '更新时间',
    slot: true,
    prop: 'updateTime',
    minWidth: 120
  }
]
const tableConfig = {
  enableMultiSelect: true,
  showHandler: true,

  handlerColumn: {
    label: '操作',
    minWidth: 150,
    fixed: 'right'
  },
  highlightSelect: true,
  rowKey: 'id'
}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入课程名称搜索' },
    data: '',
    field: 'courseName',
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
      { value: 0, label: '审核中' },
      { value: 1, label: '已发布' },
      { value: 2, label: '草稿' },
      { value: 3, label: '已停用' },
      { value: 12, label: '已撤回' },
      { value: 11, label: '已拒绝' }
    ]
  },
  {
    data: '',
    field: 'teacherId',
    label: '讲师',
    type: 'select',
    options: [],
    config: {
      placeholder: '请选择',
      filterable: true
    }
  },
  {
    data: '',
    field: 'catalogId',
    label: '课程分类',
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
    field: 'courseType',
    label: '授课方式',
    type: 'select',
    options: [
      { value: 1, label: '在线' },
      { value: 2, label: '面授' },
      { value: 3, label: '直播' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'electiveType',
    label: '选修类型',
    type: 'select',
    options: [
      { value: '1', label: '开放选修' },
      // { value: '2', label: '通过审批' },
      { value: '3', label: '禁止选修' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'isRecommend',
    label: '是否推荐',
    type: 'select',
    options: [
      { value: '1', label: '是' },
      { value: '0', label: '否' }
    ]
  },
  {
    data: '',
    field: 'creatorId',
    label: '创建人',
    type: 'select',
    options: [],
    config: { placeholder: '请选择', filterable: true }
  },
  {
    label: '知识体系',
    type: 'treeSelect',
    field: 'knowledgeSystemId',
    config: {
      selectParams: {
        placeholder: '请选择知识体系',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
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

import { mapGetters } from 'vuex'
import {
  ADD_COURSE,
  EXPORT_COURSE,
  TOP_COURSE,
  EDIT_COURSE,
  DELETE_COURSE,
  MOVE_COURSE,
  PUTAWAY_COURSE,
  REFRESH_COURSE,
  IMPORT_COURSE,
  SYNCHRONIZATION_COURSE
} from '@/const/privileges'
export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver'),
    exportDialog: () => import('@/components/common-export/exportDialog.vue')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(tableColumns, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      queryListParams: {}, // 剥离请求题库列表的入参，因为导出弹窗亦需要此入参
      isShowExportDialog: false, // 是否展示导出弹窗
      stopId: '',
      throttle: false, // 节流阀
      loading: false,
      // Dialog无数据
      dialogVisible: false,
      // 表格
      query: {
        name: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchParams: '',
      // 默认选中所有列
      columnsVisible: _.map(tableColumns, ({ prop }) => prop).filter((v) => {
        return v != 'passCondition' && v != 'creatorName' && v != 'updateTime'
      }),
      searchPopoverConfig: searchConfig,
      // query: {},
      tableColumns: tableColumns,
      tableConfig: tableConfig,
      tableData: [],
      stopVisible: false,
      relatedContent: [],
      showBtn: false,
      information: '',
      showBtnDel: false
    }
  },
  computed: {
    exportCourseList: () => exportCourseList,
    ADD_COURSE: () => ADD_COURSE,
    EXPORT_COURSE: () => EXPORT_COURSE,
    TOP_COURSE: () => TOP_COURSE,
    EDIT_COURSE: () => EDIT_COURSE,
    DELETE_COURSE: () => DELETE_COURSE,
    MOVE_COURSE: () => MOVE_COURSE,
    PUTAWAY_COURSE: () => PUTAWAY_COURSE,
    REFRESH_COURSE: () => REFRESH_COURSE,
    IMPORT_COURSE: () => IMPORT_COURSE,
    SYNCHRONIZATION_COURSE: () => SYNCHRONIZATION_COURSE,
    ...mapGetters(['privileges']),
    disabled() {
      return (type, status) => {
        let boolean = false
        switch (status) {
          case 0:
            boolean = true
            break
          case 1:
            boolean = false
            break
          case 2:
            boolean = type === 0
            break
          case 3:
            boolean = false
            break
          case 11:
            boolean = type === 0
            break
          case 12:
            boolean = type === 0
            break
        }
        return boolean
      }
    }
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          TOP_COURSE,
          PUTAWAY_COURSE,
          EDIT_COURSE,
          DELETE_COURSE,
          MOVE_COURSE
        ])
      },
      deep: true
    }
  },
  created() {
    this.refreshTableData()
    this.getInfo()
    this.getScreenInfo()
  },
  activated() {
    this.getInfo()
    this.getScreenInfo()
    this.initRelatedKnowledgeList()
  },
  mounted() {
    this.$nextTick().then(() => {
      this.$refs.seachPopover.resetForm()
    })
  },
  methods: {
    exportData() {
      this.isShowExportDialog = true
    },
    //   初始化知识体系列表
    async initRelatedKnowledgeList() {
      let knowledgeSystemId = _.find(SEARCH_POPOVER_POPOVER_OPTIONS, { field: 'knowledgeSystemId' })
      await relatedKnowledgeList({ name: '' }).then((res) => {
        res.unshift({ id: '', name: '全部' })
        knowledgeSystemId.config.treeParams.data = res
      })
    },
    //导入课程
    importCourse() {
      this.$router.push('/course/importCourse')
    },
    // 去详情
    todetail(id) {
      this.$router.push({ path: '/course/detail?id=' + id })
    },
    toEstablishCourse() {
      this.$router.push({
        path: '/course/establishCourse',
        meta: {
          $keepAlive: false
        }
      })
    },
    // 递归过滤数据
    ListData(arr) {
      if (arr.length > 0) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].status == 1) {
            arr.splice(i, 1)
          } else if (arr[i].children) {
            this.ListData(arr[i].children)
          }
        }
      }
      return arr
    },
    // 去目录管理
    toCatalog() {
      this.$router.push({ path: '/course/catalog' })
    },
    // 操作函数
    async handleCommand(e, row) {
      if (e === 0) {
        verifyCourseCanDelete([row.id]).then((res) => {
          this.showBtnDel = false
          this.stopVisible = true
          this.stopId = row.id
          this.information = `课程停用后，将不在前台的课程中心发布展示，若<br />
          要对正在关联的线上必修、培训、直播、学习地图<br />
          生效，请在对应模块中进行调整.<br />
          您确定要继续停用该课程吗？`
          if (res.resultCode === 292) this.relatedContent = res.resultList
        })
      } else if (e === 1) {
        await putawayOperate({ choice: 1, courseIds: [row.id] })
        this.refreshTableData()
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      } else if (e === 2) {
        // 去编辑
        this.$router.push({
          path:
            '/course/compileCourse?id=' +
            row.id +
            '&catalogName=' +
            row.catalogName +
            '&type=' +
            row.status,
          meta: {
            $keepAlive: false
          }
        })
      } else if (e === 3) {
        verifyCourseCanDelete([row.id]).then((res) => {
          if (res.resultCode !== 200) {
            this.showBtnDel = true
            this.stopVisible = true
            this.information = '本课程已关联培训/线上必修,暂时不能删除.'
            this.relatedContent = res.resultList
          } else {
            this.$confirm('你确定要删除该课程?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(async () => {
                this.delCourse([row.id])
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          }
        })
      }
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.currentPage = 1
      this.page.pageSize = param
      this.getInfo()
    },

    handleSearch(searchParams) {
      this.searchParams = searchParams
      this.page.currentPage = 1
      this.getInfo()
    },
    //批量同步课程
    synchronizationCourse(selection) {
      this.$confirm('此操作将批量同步选中课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let courseIds = selection.reduce((pre, cur) => {
            pre.push(cur.id)
            return pre
          }, [])
          syncCourses({ courseIds }).then((r) => {
            this.$message({
              type: 'info',
              message: r.resMsg
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 批量删除
    handleRemoveItems(selection) {
      // 批量删除
      let params = []
      // 关联培训或者审核中
      let noDel = []
      selection.forEach((item) => {
        params.push(item.id)
        if (item.status === 0) {
          noDel.push(item.id)
        }
      })
      this.$confirm('此操作将删除选中课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await verifyCourseCanDelete(params)
          if (res.resultCode !== 200 || noDel.length !== 0) {
            this.$confirm(
              '你选择的课程中包含已关联培训/线上必修和审批中的课程,暂时不能删除.，不能进行删除操作，是否忽略继续删除其它课程？',
              '提示',
              {
                confirmButtonText: '继续删除',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(async () => {
                if (res.resultCode === 293)
                  params = res.resultList.filter((item) => !noDel.includes(item))
                else if (res.resultCode === 292 || res.resultCode === 291)
                  return this.$message.success('删除成功!')
                else params = params.filter((item) => !noDel.includes(item))
                this.delCourse(params)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
          } else {
            this.delCourse(params)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 停用
    stopUsing() {
      putawayOperate({ choice: 0, courseIds: [this.stopId] }).then(() => {
        this.$message.success('停用成功')
        this.cancel()
        this.refreshTableData()
      })
    },
    // 刷新列表数据
    refreshTableData() {
      this.getInfo()
    },

    // 去重
    arrayUnique(arr, name) {
      var hash = {}
      return arr.reduce(function(item, next) {
        hash[next[name]] ? '' : (hash[next[name]] = true && item.push(next))
        return item
      }, [])
    },

    // 去空数据
    arrClearBlank(arr, name) {
      arr.map((item, index) => {
        if (item[name] == '') {
          arr.splice(index, 1)
        }
      })
      return arr
    },

    // 给筛选拿数据
    getScreenInfo() {
      listTeacher({
        pageSize: 9999999,
        pageNo: 1
      }).then((res) => {
        res = this.arrayUnique(res, 'name')
        res = this.arrClearBlank(res, 'name')
        let arr = []
        res.forEach((item, index) => {
          arr[index] = { value: item.idStr, label: item.name }
        })
        this.searchPopoverConfig.popoverOptions[1].options = [...arr]
      })
      getCourseInfoUserList().then((res) => {
        let arr = []
        res = this.arrayUnique(res, 'creatorName')
        res = this.arrClearBlank(res, 'creatorName')
        res.forEach((item, index) => {
          arr[index] = { value: item.creatorId, label: item.creatorName }
        })
        this.searchPopoverConfig.popoverOptions[6].options = [...arr]
      })
      classList().then((res) => {
        res = this.arrayUnique(res, 'name')
        res = this.arrClearBlank(res, 'name')
        this.searchPopoverConfig.popoverOptions[2].config.treeParams.data = res
      })
    },
    // 拿数据
    getInfo() {
      if (this.throttle) return
      this.throttle = true
      this.loading = true
      let page = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      let params = { ...page, ...this.searchParams }
      if (params.isPutaway == 2) {
        delete params.isPutaway
      }
      this.queryListParams = params
      getCourseListData(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
        this.throttle = false
        this.loading = false
      })
    },
    cancel() {
      this.stopVisible = false
      this.relatedContent = []
    },
    // 删除
    async delCourse(params) {
      if (!params.length) {
        this.$message.success('删除成功!')
        this.$refs.table.clearSelection()
        return
      }
      await delCourseInfo(params)
      this.$message.success('删除成功!')
      this.$refs.table.clearSelection()
      this.page.currentPage = 1
      this.refreshTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.atags_icon {
  display: inline-block;
  padding: 5px;
  background-color: #ccc;
  margin-left: 10px;
}
#isdialog_show {
  width: 100%;
  height: 100px;
  background-color: #6b6b6b;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px;
  color: #fff;
  position: relative;
  span {
    color: #a0b5fd;
  }
  i {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
  }
}
.addUser {
  font-size: 14px;
  display: inline-block;
  color: #757c85;
  line-height: 14px;
  cursor: pointer;
  padding-right: 12px;
  border-right: 0.5px solid #e9e9e9;
}
.icon {
  margin-left: 12px;
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
.course_in {
  position: relative;
  background-color: #fff;
  .draft {
    padding: 25px;
  }
}
.dialog {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  .el-icon-close {
    position: absolute;
    top: 35px;
    right: 35px;
    font-size: 35px;
    color: #fff;
  }
  .guide {
    p {
      font-size: 20px;
      text-align: center;
      margin-bottom: 45px;
    }
    .box_all {
      display: flex;
      .bxo {
        position: relative;
        width: 150px;
        height: 150px;
        border: 1px solid #fff;
        .bxo_x {
          position: absolute;
          top: -30px;
          right: 75px;
          width: 1px;
          height: 210px;
          background-color: #fff;
          transform: rotate(45deg);
        }
        .bxo_y {
          position: absolute;
          top: -30px;
          right: 74px;
          width: 1px;
          height: 210px;
          background-color: #fff;
          transform: rotate(135deg);
        }
        .number {
          position: absolute;
          top: 65px;
          right: 65px;
          background-color: #616263;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
        }
      }
      .arrows {
        position: relative;
        width: 220px;
        height: 150px;
        .el-icon-caret-right {
          font-size: 30px;
          position: absolute;
          top: 65px;
          right: 28px;
        }
        .wire {
          position: absolute;
          top: 78px;
          right: 45px;
          width: 130px;
          height: 5px;
          background-color: #fff;
        }
      }
    }
    .describe {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      span {
        width: 150px;
        text-align: center;
      }
    }
    .btn_b {
      margin-top: 45px;
      text-align: center;
    }
  }
}
/deep/ #recommend {
  position: relative;
  /deep/ .icon_rec {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-45deg);
    font-size: 10px !important;
    text-align: center;
    line-height: 24px;
  }
  /deep/ #triangle_topleft {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: 30px solid #d6dcfd;
    border-right: 30px solid transparent;
  }
  /deep/ #recommend_info {
    padding-left: 15px;
  }
}
/deep/.page-wrap[data-v-793409ea] {
  margin-right: 70px;
}
/deep/.el-card {
  border: none !important;
}
::v-deep a.courseName.el-link.el-link--primary.is-underline {
  width: 100%;
  span.el-link--inner {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

<style lang="scss" scoped>
/deep/.el-input {
  width: 100%;
}
/deep/.el-select {
  width: 100%;
}
/deep/ .page-wrap {
  padding-right: 20px;
}
/deep/.el-input .operations__btns {
  color: #acb3b8;
  display: flex;
}
.text_refresh {
  color: #acb3b8;
  margin-right: 20px;
  $color_icon: #a0a8ae;
}

.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
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
      // margin-bottom: 8px
      // margin-right: 8px
      .iconfont {
        font-weight: bold;
        font-size: 16px;
      }
      .Menu {
        // 添加一个分隔号 "｜"
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
.courseNameBox {
  cursor: pointer;
  padding: 10px 10px 0;
  .coverUrl {
    width: 100px;
    height: 80px;
    background-color: #ccc;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.showBtn {
  margin-top: 10px;
  color: #01aafc;
}
.item_box {
  margin-top: 10px;
  width: 236px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
