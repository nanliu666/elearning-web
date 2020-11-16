<template>
  <div class="course">
    <!-- 头部 -->
    <page-header title="目录管理">
      <el-dropdown slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
        >
          新建目录
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            单个新建
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </page-header>

    <div class="course_in">
      <!-- 导航 -->
      <div class="select_bar">
        <span
          :class="{ select: isSelect === 1 }"
          @click="showSelect(1)"
        >已发布</span>
        <span
          :class="{ select: isSelect === 2 }"
          @click="showSelect(2)"
        >草稿</span>
      </div>

      <!-- 内容 -->
      <div class="draft">
        <!-- 搜索 -->
        <div class="search_bar">
          <el-input
            placeholder="请输入目录名称搜索"
            suffix-icon="el-icon-search"
            class="search_bar_input"
          >
          </el-input>

          <div class="adjustment">
            <i class="el-icon-refresh-right icon"></i>
            <span>刷新</span>
            <span class="wire"></span>
            <i
              class="el-icon-s-tools icon"
              @click="toStudySituation"
            ></i>
          </div>
        </div>

        <!-- 表格内容 -->

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            label="序号"
            width="50"
            fixed
          >
            <template slot-scope="id">
              {{ id.row.id }}
            </template>
          </el-table-column>

          <el-table-column
            label="课程名称"
            width="300"
            fixed
          >
            <template slot-scope="nameCourse">
              <el-button
                type="text"
                size="small"
              >
                {{ nameCourse.row.nameCourse }}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="directory"
            label="所在目录"
            width="260"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="type"
            label="课程类型"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="condition"
            label="通过条件"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="select"
            label="选修类型"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            width="200"
          >
          </el-table-column>

          <el-table-column
            label="操作"
            width="200"
            fixed="right"
          >
            <template slot-scope="operation">
              <el-button
                type="text"
                size="small"
              >
                {{ operation.row.operation[0] }}
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                {{ operation.row.operation[1] }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="block">
          <el-pagination
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- Dialog无数据 -->
    <div
      v-show="dialogVisible"
      class="dialog"
    >
      <i
        class="el-icon-close"
        @click="dialogVisible = false"
      ></i>

      <div class="guide">
        <p>如何快速添加课程 !</p>
        <div class="box_all">
          <div class="bxo">
            <div class="bxo_x"></div>
            <div class="bxo_y"></div>
            <div class="number">
              1
            </div>
          </div>
          <div class="arrows">
            <i class="el-icon-caret-right"></i>
            <div class="wire"></div>
          </div>
          <div class="bxo">
            <div class="bxo_x"></div>
            <div class="bxo_y"></div>
            <div class="number">
              2
            </div>
          </div>
        </div>

        <div class="describe">
          <span>先完善展示的目录配置</span>
          <span>开始创建课程</span>
        </div>

        <div class="btn_b">
          <el-button
            type="primary"
            size="mini"
          >
            &nbsp; &nbsp; 知道了，马上去完善目录配置 &nbsp; &nbsp;
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Dialog无数据
      dialogVisible: false,
      // 导航
      isSelect: 2,
      // 表格
      tableData: [
        {
          id: 1,
          nameCourse: '产品产品产品产',
          teacher: '王小虎',
          directory: 'javajavajavajavajavajava',
          type: '在线课程',
          condition: '老师评定',
          select: '开放选修',
          creator: '李白',
          operation: ['编辑', '删除']
        },
        {
          id: 1,
          nameCourse: '产品产品产品产',
          teacher: '王小虎',
          directory: 'javajavajavajavajavajava',
          type: '在线课程',
          condition: '老师评定',
          select: '开放选修',
          creator: '李白',
          operation: ['编辑', '删除']
        },
        {
          id: 1,
          nameCourse: '产品产品产品产',
          teacher: '王小虎',
          directory: 'javajavajavajavajavajava',
          type: '在线课程',
          condition: '老师评定',
          select: '开放选修',
          creator: '李白',
          operation: ['编辑', '删除']
        }
      ],
      // 选择框
      multipleSelection: [],
      // 分页
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  watch: {
    isSelect(newVal) {
      if (newVal === 1) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
      }
    }
  },
  methods: {
    //   去学习情况
    toStudySituation() {
      // 目前不用做
      // this.$router.push('/course/studySituation')
    },
    // Dialog无数据
    handleClose() {},

    // 导航
    showSelect(index) {
      this.isSelect = index
    },
    // 分页
    handleSizeChange() {
      // (`每页 ${val} 条`)这有个(val)
    },
    handleCurrentChange() {
      // (`当前页: ${val}`)这有个(val)
    },
    // 选择框
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.course_in {
  position: relative;
  background-color: #fff;
  .select_bar {
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    span {
      height: 50px;
      line-height: 50px;
      margin-left: 30px;
    }
    .select {
      border-bottom: 2px solid #1677ff;
    }
  }
  .draft {
    .search_bar {
      padding: 15px;
      .search_bar_input {
        width: 250px;
        margin-right: 25px;
      }
      .adjustment {
        float: right;
        display: flex;
        padding: 6px;
        .icon {
          margin-top: 3px;
          margin-right: 12px;
        }
        .wire {
          width: 1px;
          height: 20px;
          background-color: #ccc;
          margin: 0 12px;
        }
      }
    }
    .block {
      box-sizing: border-box;
      padding-top: 10px;
      height: 50px;
      text-align: right;
    }
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
</style>
