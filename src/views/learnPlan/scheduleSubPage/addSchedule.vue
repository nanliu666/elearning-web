<template>
  <div class="addSchedule">
    <!-- 添加课程页面 -->
    <div class="layout_header">
      <ul class="header_left">
        <li>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </li>
        <li @click="deleteTableData">
          <i class="el-icon-delete"></i>删除
        </li>
        <li @click="bulkEdit">
          <i class="el-icon-edit-outline"></i>批量修改
        </li>
      </ul>
      <el-button
        class="header_right"
        type="primary"
        size="medium"
        @click="addScheduleBtn"
      >
        添加课程
      </el-button>
    </div>
    <el-checkbox-group
      v-model="checkboxGroup"
      @change="checkboxGroupChange"
    >
      <el-collapse
        v-model="activeNames"
        class="layout_content"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="(item, index) in treeData"
          :key="index"
          :name="item.id"
        >
          <template slot="title">
            <div class="layout_content_label">
              <i class="el-icon-arrow-down"></i>
              <el-checkbox
                :key="index"
                :label="item.id"
              ></el-checkbox>
              {{ item.label }}
              <i
                class="el-icon-s-grid"
                title="拖拽可调整课程排序"
              ></i>
            </div>
          </template>
          <div class="layout_content_detail">
            <el-row
              type="flex"
              justify="center"
              style="padding-top:40px;"
            >
              <el-col
                :xl="16"
                :lg="16"
                :md="18"
                :sm="20"
                :xs="22"
              >
                <common-form
                  :model="item.form"
                  :columns="columns"
                ></common-form>
              </el-col>
            </el-row>
            <el-tabs
              v-model="activeName"
              @tab-click="handleClick"
            >
              <el-tab-pane
                label="关联考试"
                name="first"
              >
                <div
                  v-for="(list, indexs) in item.arr1"
                  :key="indexs"
                  class="tab_list clearfix"
                >
                  {{ list.name }}
                  <div class="tab_right">
                    <span>预览</span><span>编辑</span>
                    <el-dropdown>
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>人员列表</el-dropdown-item>
                        <el-dropdown-item>前置条件</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div
                  class="tabsAddBtn"
                  @click="tabsAddBtn(item.arr1)"
                >
                  添加
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="关联练习"
                name="second"
              >
              </el-tab-pane>
              <el-tab-pane
                label="关联作业"
                name="third"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-checkbox-group>

    <!-- 批量修改的弹窗 -->
    <el-dialog
      title="批量修改"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <div class="batch_label">
        允许输入的时间段
      </div>
      <el-date-picker v-model="datePick1"></el-date-picker>
      <el-date-picker v-model="datePick2"></el-date-picker>
      <el-date-picker v-model="datePick3"></el-date-picker>
      <div class="batch_label">
        允许输入的时间段
      </div>
      <el-input v-model="iputSearch"></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 课程列表的弹窗 -->
    <el-dialog
      title="课程列表"
      :visible.sync="courseListDialog"
      :append-to-body="true"
    >
      <common-table
        ref="table"
        class="commonTable"
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
          <SearchPopover
            ref="searchPopover"
            :popover-options="searchPopoverConfig.popoverOptions"
            :require-options="searchPopoverConfig.requireOptions"
            @submit="handleSearch"
          />
        </template>
      </common-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="courseListDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="courseSureBtn"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import { getCourseList } from '@/api/learnPlan'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '课程名称',
    width: 180,
    prop: 'courseName'
  },
  {
    label: '讲师',
    prop: 'teacherName',
    width: 200
  },
  {
    label: '所在类目',
    prop: 'catalogName',
    minWidth: 150
  }
]
export default {
  inject: ['parentObj'],
  components: {
    SearchPopover
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    const TABLE_CONFIG = {
      enablePagination: true,

      enableMultiSelect: true,
      rowKey: 'id',
      showHandler: false,
      treeProps: { hasChildren: 'hasChildren', children: 'children' }
    }
    const TABLE_PAGE_CONFIG = {}
    // 搜索配置
    const SEARCH_POPOVER_REQUIRE_OPTIONS = [
      {
        config: { placeholder: '课程名称搜索', 'suffix-icon': 'el-icon-search' },
        data: '',
        field: 'courseName',
        label: '',
        type: 'input'
      },
      {
        config: { placeholder: '请选择', 'suffix-icon': 'el-icon-search' },
        data: '',
        field: 'catalogId',
        label: '',
        options: this.parentObj.treeData.map((item) => {
          return { value: item.id, label: item.name }
        }),
        type: 'select'
      }
    ]
    let SEARCH_POPOVER_POPOVER_OPTIONS = []
    let SEARCH_POPOVER_CONFIG = {
      popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
      requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
    }
    return {
      dialogVisible: false, // 弹出对象值
      courseListDialog: false, // 课程列表的弹窗标记
      queryInfo: {
        // 课程列表的请求参数
        pageNo: 1,
        pageSize: 10,
        catalogId: '',
        courseName: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      datePick1: '',
      datePick2: '',
      datePick3: '',
      iputSearch: '',
      checkAll: true,
      activeNames: '',
      checkboxGroup: [],
      indeterminate: true,
      treeData: [],
      checkboxArr: [{ val: '' }],
      columns: [
        {
          prop: 'recruitmentId',
          itemType: 'datePicker',
          label: '课程名称',
          required: true
        },
        {
          prop: 'text',
          itemType: 'radio',
          label: '通过条件',
          options: [
            { label: '教师评定', value: '1' },
            { label: '考试通过', value: '2' },
            { label: '达到课程学时', value: '3' }
          ],
          offset: 4,
          required: true
        },
        {
          prop: 'begainTime',
          itemType: 'daterange',
          label: '开课时间',
          required: true
        },
        {
          prop: 'time1',
          itemType: 'daterange',
          label: '前置条件关系',
          required: true
        },
        {
          prop: 'timeList',
          itemType: 'select',
          label: '允许时间段',
          slot: true
        },
        {
          prop: 'beforeCourse',
          itemType: 'daterange',
          label: '前置课程',
          required: true
        }
      ],
      activeName: 'first',
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  methods: {
    handleSearch(searchParams) {
      for (let i in searchParams) {
        this.queryInfo[i] = searchParams[i]
      }
      this.getCourseData()
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.getCourseData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.getCourseData()
    },
    loadTableData() {},
    courseSureBtn() {
      // 课程列表弹窗确认回调
      // this.treeData
    },
    handleCheckAllChange(val) {
      // 全选回调
      this.checkboxGroup = val ? this.treeData.map((item) => item.id) : []
      this.indeterminate = false
    },
    bulkEdit() {
      // 批量修改
      this.dialogVisible = true
    },
    checkboxGroupChange(val) {
      this.checkAll = val.length == this.treeData.length ? true : false
      this.indeterminate = val.length < this.treeData.length ? true : false
    },
    handleChange() {},
    handleClick() {},
    dropdownClick() {},
    tabsAddBtn(arr) {
      arr.push({ name: '信息安全考试' })
    },
    deleteTableData() {
      // 删除列表数据
      this.treeData.forEach((item, index, arr) => {
        if (this.checkboxGroup.includes(item.id)) {
          let that = this
          let ids = that.checkboxGroup.indexOf(item.id)
          arr.splice(index, 1)
          this.checkboxGroup.splice(ids, 1)
        }
      })
      this.checkboxGroupChange(this.checkboxGroup)
    },
    addScheduleBtn() {
      this.courseListDialog = true
      this.getCourseData()
      // this.$router.push({path: '/course/courseDraft'});
      //   添加课程按钮回调
      //   let id =  1 || this.treeData[this.treeData.length - 1].id + 1
      //   this.treeData.push({
      //     label: '课程一',
      //     id: id,
      //     form: {
      //       recruitmentId: '',
      //       text: '',
      //       time1: '',
      //       selectVal: '',
      //       time2: '',
      //       time3: ''
      //     },
      //     checkbox: false,
      //     arr1: [],
      //     arr2: [],
      //     arr3: []
      //   })
      //   this.checkboxGroupChange(this.checkboxGroup)
    },
    getCourseData() {
      let data = this.queryInfo
      getCourseList(data)
        .then((res) => {
          this.page.total = res.totalNum
          this.tableData = res.data
        })
        .catch((err) => {
          window.console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.addSchedule {
  .layout_header {
    margin-top: 54px;
    &::after {
      content: '';
      clear: both;
      display: block;
    }
    .header_left {
      display: inline-block;
      line-height: 36px;
      li {
        display: inline-block;
        margin-right: 33px;
        cursor: pointer;
        i {
          margin-right: 5px;
        }
      }
    }
    .header_right {
      float: right;
    }
  }
  .layout_content {
    .layout_content_label {
      width: 100%;
      position: relative;
      /deep/.el-checkbox {
        margin: 0 10px;
        .el-checkbox__label {
          display: none;
        }
      }
      .el-icon-s-grid {
        right: 0;
        top: 18.5px;
        position: absolute;
      }
      .el-icon-arrow-down {
        transform: rotate(180deg);
        transition: transform 0.3s linear;
      }
    }
    .is-active {
      .el-icon-arrow-down {
        transform: rotate(0);
      }
    }
    .layout_content_detail {
      /deep/.el-tabs {
        .tab_list {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          padding-left: 15px;
          color: rgba(0, 11, 21, 0.85);
          border-bottom: 1px solid #ebeced;
          .tab_right {
            float: right;
            span {
              display: inline-block;
              color: #01aafc;
              margin-right: 10px;
              cursor: pointer;
            }
            i {
              cursor: pointer;
            }
          }
        }
        .tabsAddBtn {
          width: 100%;
          height: 42px;
          line-height: 42px;
          margin-top: 10px;
          cursor: pointer;
          text-align: center;
          border: 1px dashed rgb(230, 218, 218);
        }
      }
    }
    /deep/.el-collapse-item__arrow {
      display: none;
    }
  }
}
.clearfix::after {
  clear: both;
  display: block;
  content: '';
}
/deep/.el-dialog {
  //   max-width: 420px;
  .el-date-editor {
    width: 100%;
    margin-bottom: 8px;
  }
  width: 80%;
  max-width: 600px;
}
.commonTable {
  /deep/.el-form-item {
    width: 45%;
  }
}
</style>
