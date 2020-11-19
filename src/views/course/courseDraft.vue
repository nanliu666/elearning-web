<template>
  <div class="course">
    <!-- 头部 -->
    <page-header title="课程管理">
      <el-dropdown slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
        >
          新建课程
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
        <!-- 表格内容 -->
        <common-table
          ref="crud"
          :config="tableConfig"
          :columns="columns"
          :loading="loading"
          :data="draftData"
          :page="page"
          @current-page-change="currentChange"
          @page-size-change="sizeChange"
        >
          <template
            slot="multiSelectMenu"
            slot-scope="{ selection }"
          >
            <el-button
              type="text"
              style="margin-bottom:0;"
              @click="handleReset(selection)"
            >
              批量做点什么
            </el-button>
          </template>
          <template slot="topMenu">
            <div class="flex flex-flow flex-justify-between flex-items">
              <el-input
                v-model="query.name"
                placeholder="请输入目录名称搜索"
                clearable
                style="width:280px;margin-right:12px;"
                suffix-icon="el-icon-search"
                @input="searchLoadData"
              />
            </div>
          </template>
          <!-- 序号 -->
          <template
            slot="index"
            slot-scope="{ row }"
          >
            <span>{{ draftData.indexOf(row) + 1 }}</span>
          </template>
          <!-- 课程名称 -->
          <template
            slot="name"
            slot-scope="{ row }"
          >
            <div id="recommend">
              <span
                v-if="row.isTop === 1"
                id="triangle_topleft"
              ></span>
              <span
                v-if="row.isTop === 1"
                class="icon_rec"
              >推荐</span>
              <el-button
                id="recommend_info"
                type="text"
              >
                {{ row.name }}
              </el-button>
            </div>
          </template>
          <!-- 课程类型 -->
          <template
            slot="type"
            slot-scope="{ row }"
          >
            <span v-if="row.type === 1">在线课程</span>
            <span v-if="row.type === 2">面授课程</span>
            <span v-if="row.type === 3">直播课程</span>
          </template>
          <!-- //通过条件（前端为多选，用a,b,c,d,...组合）a:教师评定 ，b:考试通过，c:达到课程学时 -->
          <template
            slot="passCondition"
            slot-scope="{ row }"
          >
            <span v-if="row.passCondition === 'a'">教师评定</span>
            <span v-if="row.passCondition === 'b'">考试通过</span>
            <span v-if="row.passCondition === 'c'">达到课程学时</span>
          </template>
          <!-- electiveType: 2, //选修类型 (1:开发选修 2:通过审批 3:禁止选修) -->
          <template
            slot="electiveType"
            slot-scope="{ row }"
          >
            <span v-if="row.electiveType === 1">开发选修</span>
            <span v-if="row.electiveType === 2">通过审批</span>
            <span v-if="row.electiveType === 3">禁止选修</span>
          </template>

          <template
            slot="handler"
            slot-scope="{ row }"
          >
            <el-button
              size="medium"
              type="text"
              @click="handleEditRole(row)"
            >
              编辑
            </el-button>
            <el-button
              size="medium"
              type="text"
              @click="handleReset(row)"
            >
              删除
            </el-button>
          </template>
        </common-table>
      </div>
    </div>

    <!-- Dialog无数据 -->
    <div
      v-show="dialogVisible"
      v-if="draftData"
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
import { getOrgUserList, resetPwd } from '@/api/system/user'
import { getCourseList } from '@/api/course/course'
export default {
  props: {
    activeOrg: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      // Dialog无数据
      dialogVisible: false,
      // 导航
      isSelect: 2,
      // 表格
      query: {
        name: ''
      },
      loading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: {
        showHandler: true,
        enableMultiSelect: true,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'userId',
        handlerColumn: {
          width: '180'
        }
      },
      columns: [
        {
          label: '序号',
          prop: 'index',
          width: '70',
          slot: true
        },

        {
          label: '课程名称',
          prop: 'name',
          slot: true
        },
        {
          label: '讲师',
          prop: 'teacherId'
        },
        {
          label: '所在目录',
          prop: 'catalogId'
        },
        {
          label: '课程类型',
          prop: 'type',
          slot: true
        },
        {
          label: '通过条件',
          prop: 'passCondition',
          slot: true
        },
        {
          label: '选修类型',
          prop: 'electiveType',
          slot: true
        },
        {
          label: '创建人',
          prop: 'createName'
        }
      ],
      // 表格数据
      draftData: [
        {
          isRecommend: 1, //是否推荐课程
          passCondition: 'c', //通过条件（前端为多选，用a,b,c,d,...组合）a:教师评定 ，b:考试通过，c:达到课程学时
          catalogId: 4, //课程目录id
          teacherId: 4, //	课程讲师id
          isTop: 1, //是否置顶
          createId: 4, //创建人账号
          name: 'dd', //课程名称
          electiveType: 2, //选修类型
          id: 4, //主键id
          type: 2, //	课程类型(1:在线 2:面授 3:直播)
          createName: '小红' //创建人
        },
        {
          isRecommend: 1, //是否推荐课程
          passCondition: 'c', //通过条件（前端为多选，用a,b,c,d,...组合）a:教师评定 ，b:考试通过，c:达到课程学时
          catalogId: 4, //课程目录id
          teacherId: 4, //	课程讲师id
          isTop: 1, //是否置顶
          createId: 4, //创建人账号
          name: 'dd', //课程名称
          electiveType: 2, //选修类型 (1:开发选修 2:通过审批 3:禁止选修)
          id: 4, //主键id
          type: 2, //	课程类型(1:在线 2:面授 3:直播)
          createName: '小红' //创建人
        }
      ],
      editVisible: false,
      editingUser: {}
    }
  },
  watch: {
    isSelect(newVal) {
      if (newVal === 1) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
      }
    },
    activeOrg: function() {
      this.page = {
        currentPage: 1,
        size: 10,
        total: 0
      }
      this.loadData()
    }
  },
  created() {
    this.loadData()
    // this.getInfo()
    // console.log(this.draftData)
  },
  activated() {
    this.loadData()
  },
  methods: {
    // 拿数据
    getInfo() {
      getCourseList(1).then((res) => {
        // this.data= res
        window.console.log('1--------------', res)
      })
      // console.log('2--------------',this.data);
    },
    // Dialog无数据
    handleClose() {},

    // 导航
    showSelect(index) {
      this.isSelect = index
    },

    // 以下都是表格
    searchLoadData: _.debounce(function() {
      this.loadData()
    }, 500),
    // 编辑
    handleEditRole(user) {
      this.$refs['userRoleEdit'].init(user)
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.loadData()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.loadData()
    },
    handleReset(data) {
      let ids
      if (Array.isArray(data)) {
        ids = data.map((item) => item.userId).join(',')
      } else {
        ids = data.userId
      }
      this.$confirm('确定将选择账号密码重置为123456?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.resetPwd(ids, data)
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    resetPwd(ids, data) {
      resetPwd(ids).then(() => {
        Array.isArray(data) ? (data.length = 0) : ''
        this.loadData()
      })
    },
    loadData() {
      this.loading = true
      getOrgUserList({
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        orgId: this.activeOrg ? this.activeOrg.orgId : '0',
        search: this.query.name
      })
        .then((res) => {
          this.page.total = res.totalNum
          this.data = res.data
          // this.selectionClear()
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
