<template>
  <basicContainer
    block
    class="addSchedule"
  >
    <!-- 添加课程页面 -->
    <div class="layout_header">
      <ul class="header_left">
        <li>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
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
      v-model="checkedCourseIds"
      @change="checkboxGroupChange"
    >
      <el-collapse
        v-model="activeNames"
        class="layout_content"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="item in courseList"
          :key="item.id"
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
            <common-form
              :model="item"
              :columns="columns"
            >
              <div
                slot="courseName"
                class="course-name-input"
              >
                <el-input v-model="item.courseName"></el-input><span
                  class="precondition"
                  @click="setPrecondition"
                >设置前置条件</span>
              </div>
              <template slot="studyFrequency">
                <el-input-number
                  v-model="item.studyFrequency"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
              </template>
              <template slot="timeList">
                <el-date-picker
                  v-model="item.timeList[0]"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
                <el-date-picker
                  v-model="item.timeList[1]"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
                <el-date-picker
                  v-model="item.timeList[2]"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
              </template>
            </common-form>
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
                    <el-dropdown @command="commandClick">
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">
                          人员列表
                        </el-dropdown-item>
                        <el-dropdown-item command="b">
                          前置条件
                        </el-dropdown-item>
                        <el-dropdown-item command="c">
                          删除
                        </el-dropdown-item>
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
        允许学习次数
      </div>
      <el-input-number
        v-model="learnNumber"
        controls-position="right"
        :min="0"
        placeholder="请输入"
      ></el-input-number>
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

    <!-- 前置条件的弹窗 -->
    <el-dialog
      title="前置条件"
      class="preconditionDialog"
      :visible.sync="precondDialogShow"
      :append-to-body="true"
    >
      <div class="precondition_label">
        当前课程：AAA
      </div>
      <ul class="precondition_container">
        <li class="container_title">
          <span class="precondition_left">当前课程</span>
          <span class="precondition_right">是否必须通过</span>
        </li>
        <li
          v-for="(item, idx) in preconditionList"
          :key="idx"
        >
          <el-select class="precondition_left">
            <el-option label="社区的分类与定位"></el-option>
          </el-select>
          <el-select class="precondition_right">
            <el-option label="是"></el-option>
          </el-select>
        </li>
      </ul>
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
    <CourseSelectDialog
      :visible.sync="courseDialogVisible"
      @submit="handleCourseSelectSubmit"
    />
  </basicContainer>
</template>

<script>
import CourseSelectDialog from './CourseSelectDialog'
export default {
  inject: ['parentObj'],
  components: {
    CourseSelectDialog
  },
  props: {
    courseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false, // 弹出对象值
      courseDialogVisible: false, // 课程列表的弹窗标记

      datePick1: '',
      datePick2: '',
      datePick3: '',
      learnNumber: '', // 允许学习次数
      iputSearch: '',
      checkAll: true,
      activeNames: '',
      checkedCourseIds: [],
      isIndeterminate: true,
      columns: [
        {
          prop: 'courseName',
          label: '课程名称',
          itemType: 'slot',
          required: true
        },
        {
          prop: 'text',
          itemType: 'checkbox',
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
          prop: 'startTime',
          itemType: 'datePicker',
          label: '开课时间',
          type: 'daterange',
          required: true
        },
        {
          prop: 'studyFrequency',
          itemType: 'slot',
          label: '允许学习次数',
          offset: 4,
          required: true
        },
        {
          prop: 'timeList',
          label: '允许时间段',
          itemType: 'slot',
          required: false
        }
      ],
      activeName: 'first',

      preconditionList: [], // 前置条件数组
      precondDialogShow: false // 前置条件弹窗隐藏和显示
    }
  },
  methods: {
    handleCourseSelectSubmit(selected) {
      // 课程列表弹窗确认回调
      let idArr = this.courseList.map((item) => item.id)
      let filterArr = selected.filter((item) => {
        return !idArr.includes(item.id)
      })
      filterArr.forEach((item) => {
        item.timeList = [[], [], []]
        return item
      })
      this.courseList.push(...filterArr)
      // this.treeData
    },
    handleCheckAllChange(val) {
      // 全选回调
      this.checkedCourseIds = val ? this.courseList.map((item) => item.id) : []
      this.indeterminate = false
    },

    commandClick(val) {
      // 关联开始删除
      switch (val) {
        case 'a':
          break
        case 'b':
          break
        case 'c': // 删除
          this.$confirm('您确定要删除当前课程吗?', '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {})
            .catch(() => {})
          break
      }
    },
    bulkEdit() {
      // 批量修改
      this.dialogVisible = true
    },
    checkboxGroupChange(val) {
      this.checkAll = val.length == this.courseList.length ? true : false
      this.indeterminate = val.length < this.courseList.length ? true : false
    },
    setPrecondition() {
      // 设置前置条件
      this.precondDialogShow = true
    },
    handleChange() {},
    handleClick() {},
    dropdownClick() {},
    tabsAddBtn(arr) {
      arr.push({ name: '信息安全考试' })
    },
    deleteTableData() {
      // 删除列表数据
      this.courseList.forEach((item, index, arr) => {
        if (this.checkedCourseIds.includes(item.id)) {
          let that = this
          let ids = that.checkedCourseIds.indexOf(item.id)
          arr.splice(index, 1)
          this.checkedCourseIds.splice(ids, 1)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.addSchedule {
  /deep/.el-input-number {
    width: 100%;
  }
  .course-name-input {
    position: relative;
    .precondition {
      color: #01aafc;
      cursor: pointer;
      position: absolute;
      right: -90px;
      top: 0;
    }
  }
  .layout_header {
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
.preconditionDialog {
  /deep/.el-dialog {
    .precondition_label {
      line-height: 40px;
    }
    .precondition_container {
      .container_title {
        text-align: center;
        background-color: rgb(207, 201, 201);
        // color: #fff;
        line-height: 40px;
      }
      .precondition_left,
      .precondition_right {
        display: inline-block;
      }
      .precondition_left {
        width: 60%;
        .el-select {
          width: 100%;
        }
      }
      .precondition_right {
        width: 40%;
        .el-select {
          width: 150px;
        }
      }
    }
  }
}
</style>
