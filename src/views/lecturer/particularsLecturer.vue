<template>
  <div class="compileLecturer">
    <!-- <div
      class="compileLecturerr_head"
      @click="toLecturer"
    >
      <i class="el-icon-arrow-left"></i> 讲师详情
    </div> -->
    <page-header
      title="讲师详情"
      :back="() => toLecturer()"
      show-back
    />

    <div class="compileLecturerr_head_box">
      <div class="head_box_img">
        <img
          :src="teacherData.photo"
          alt=""
        />
        <div class="in_img_icon">
          推荐
        </div>
      </div>
      <div class="head_box_content">
        <el-row>
          <el-col
            :span="5"
            style="color:#333;font-size: 18px;"
          >
            {{ name }}
          </el-col>
          <el-col :span="8">
            <span
              v-if="teacherData.status == 1"
              class="box_content_icon content_icon1"
            >正常</span>
            <span
              v-if="teacherData.status == 0"
              class="box_content_icon content_icon1"
            >停用</span>
            <span
              v-if="teacherData.isPopularTeacher == 1"
              class="box_content_icon content_icon2"
            >热门</span>

            <span
              v-if="teacherData.isLatestTeacher == 1"
              class="box_content_icon content_icon3"
            >最新</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            手机号码：
          </el-col>
          <el-col :span="7">
            {{ teacherData.phonenum }}
          </el-col>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            电子邮箱：
          </el-col>
          <el-col :span="7">
            {{ teacherData.userEmail || '--' }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            性别：
          </el-col>
          <el-col :span="7">
            <span v-if="teacherData.sex == 1">男</span>
            <span v-if="teacherData.sex == 0">女</span>
            <span v-if="teacherData.sex == ''">--</span>
          </el-col>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            讲师类型：
          </el-col>
          <el-col :span="7">
            <span v-if="teacherData.type == 1">内训</span>
            <span v-if="teacherData.type == 2">外聘</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            讲师级别：
          </el-col>
          <el-col :span="7">
            {{ teacherData.teacherLevel || '--' }}
          </el-col>
          <el-col
            :span="5"
            style="color:#898989;"
          >
            讲师职称：
          </el-col>
          <el-col :span="7">
            {{ teacherData.teacherTitle || '--' }}
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col
            :span="4"
            style="color:#898989;"
          >
            擅长领域：
          </el-col>
          <el-col :span="8">
            <span class="box_content_icon">计算机技术</span><span class="box_content_icon">计算机技术</span>
          </el-col>
        </el-row> -->
      </div>
      <div class="head_box_btns">
        <el-button
          type="primary"
          size="medium"
          @click="tocompileLecturer"
        >
          编辑
        </el-button>
        <el-button
          v-show="teacherData.status == 1"
          size="medium"
          @click="iseditSysRulus(0)"
        >
          停用
        </el-button>
        <el-button
          v-show="teacherData.status == 0"
          size="medium"
          type="primary"
          @click="iseditSysRulus(1)"
        >
          启用
        </el-button>
        <el-button
          size="medium"
          @click="isTeacherdelete"
        >
          删除
        </el-button>
      </div>
    </div>
    <div class="compileLecturerr_introduce">
      <div class="introduce_title">
        讲师介绍
      </div>
      <div class="ntroduce_content">
        <div v-html="teacherData.introduction"></div>
      </div>
      <!-- <div class="ntroduce_img">
        <img
          src=""
          alt=""
        />
      </div> -->
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
            {{ item.catalogName }}
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
          @click="RulusFn(0)"
        >
          确 定
        </el-button>
        <el-button
          v-show="showBtnDel"
          type="primary"
          @click="TeacherdeleteFn()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseListData } from '@/api/course/course'
import { getTeacher, Teacherdelete, editSysRulus } from '@/api/lecturer/lecturer'
export default {
  data() {
    return {
      CourseList: '',
      blockDialogVisible: false,
      showBtnData: false,
      showBtnDel: false,

      teacherData: {
        photo: '',
        status: '',
        isPopularTeacher: '',
        phonenum: '',
        userEmail: '',
        sex: '',
        type: '',
        teacherLevel: '',
        teacherTitle: '',
        introduction: ''
      },
      name: ''
    }
  },
  created() {
    this.isgetTeacher()
  },
  activated() {
    this.isgetTeacher()
  },

  methods: {
    // // 启动/停用系统规则列表
    // iseditSysRulus(status) {
    //   let params = {
    //     id: '',
    //     status: '' // '0 停用 1 正常',
    //   }
    //   params.id = this.$route.query.id
    //   params.status = status
    //   editSysRulus(params).then(() => {
    //     this.$message({
    //       message: '操作成功',
    //       type: 'success'
    //     })
    //     this.isgetTeacher()
    //   })
    // },

    // // 删除讲师
    // isTeacherdelete(id) {
    //   let params = {
    //     ids: id
    //   }
    //   params.ids = this.$route.query.id
    //   Teacherdelete(params).then(() => {
    //     this.$message({
    //       message: '操作成功',
    //       type: 'success'
    //     })
    //     this.toLecturer()
    //   })
    // },

    // 删除讲师fn
    TeacherdeleteFn() {
      let params = {
        ids: this.$route.query.id
      }
      Teacherdelete(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.toLecturer()
        this.blockDialogVisible = false
      })
    },

    // 删除讲师按钮
    isTeacherdelete(id) {
      getCourseListData({ teacherId: this.teacherData.userId, pageNo: 1, pageSize: 999 }).then(
        (res) => {
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
          }
        }
      )
    },
    // 启动/停用方法
    RulusFn(i) {
      let params = {
        id: '',
        status: '' // '0 停用 1 正常',
      }
      params.id = this.$route.query.id
      params.status = i
      editSysRulus(params).then(() => {
        this.$message({
          message: `${i ? '启用' : '停用'}成功`,
          type: 'success'
        })
        //刷新
        this.isgetTeacher()
        this.blockDialogVisible = false
      })
    },

    // 启动/停用按钮
    iseditSysRulus(i) {
      // 启用弹框
      if (i) {
        this.$confirm('您确定要启用该讲师吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.RulusFn(i)
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

        getCourseListData({ teacherId: this.teacherData.userId, pageNo: 1, pageSize: 999 }).then(
          (res) => {
            // 如果没有课程
            if (res.data.length === 0) {
              this.$confirm('您确定要启用该讲师吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.RulusFn(i)
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
            }
          }
        )
      }
    },

    // 去编辑
    tocompileLecturer() {
      let row = {}
      row.idStr = this.$route.query.id
      row.name = this.$route.query.name
      row.user_email = this.$route.query.userEmail
      row.sex = this.$route.query.sex
      row.phonenum = this.$route.query.phonenum
      row.user_id_str = this.$route.query.user_id_str

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
    // 去讲师列表
    toLecturer() {
      this.$router.push({ path: '/lecturer/lecturer' })
    },
    // 拿数据
    isgetTeacher() {
      let params = { id: '' }
      params.id = this.$route.query.id
      params.id = params.id.trim()
      this.name = this.$route.query.name
      getTeacher(params).then((res) => {
        this.teacherData = res.teacherInfo
        this.teacherData.introduction = _.unescape(this.teacherData.introduction)
      })
    }
  }
}
</script>

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
.compileLecturer {
  .compileLecturerr_head {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  .compileLecturerr_head_box {
    padding: 25px 20px;
    background-color: #fff;
    display: flex;
    .head_box_img {
      margin: 15px 0;
      position: relative;
      overflow: hidden;
      padding-right: 55px;
      width: 400px;
      height: 220px;
      img {
        width: 100%;
        height: 100%;
      }
      .in_img_icon {
        position: absolute;
        top: -11px;
        left: -45px;
        background-color: #d6dcff;
        width: 137px;
        height: 57px;
        color: #090e7a;
        line-height: 76px;
        text-align: center;
        transform: rotate(-45deg);
        font-size: 16px;
      }
    }
    .head_box_content {
      width: 55%;
      margin: 20px 25px 0 55px;
      font-size: 16px;
      /deep/ .el-row {
        margin-top: 12px;
      }
      .box_content_icon {
        padding: 5px 12px;
        color: #666;
        margin-right: 15px;
        font-size: 12px;
        border-radius: 2px;
        background-color: #f0f2f4;
      }
      .content_icon1 {
        background-color: #cbf5e8;
      }
      .content_icon2 {
        background-color: #fff491;
      }
      .content_icon3 {
        background-color: #c4e6ff;
      }
    }
    .head_box_btns {
      width: 20%;
      display: flex;
      justify-content: flex-end;
      height: 35px;
    }
  }
  .compileLecturerr_introduce {
    padding: 55px 90px;
    background-color: #fff;
    margin-top: 25px;
    .introduce_title {
      font-size: 16px;
      color: #333;
    }
    .ntroduce_content {
      padding: 20px 45px;
    }
    .ntroduce_img {
      padding: 0 45px;
    }
  }
}
</style>
