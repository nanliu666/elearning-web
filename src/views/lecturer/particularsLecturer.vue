<template>
  <div class="compileLecturer">
    <div
      class="compileLecturerr_head"
      @click="toLecturer"
    >
      <i class="el-icon-arrow-left"></i> 讲师详情
    </div>
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
            :span="7"
            style="color:#333;"
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
            :span="4"
            style="color:#333;"
          >
            手机号码：
          </el-col>
          <el-col :span="8">
            {{ teacherData.phonenum }}
          </el-col>
          <el-col
            :span="4"
            style="color:#333;"
          >
            电子邮箱：
          </el-col>
          <el-col :span="8">
            {{ teacherData.userEmail }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="4"
            style="color:#333;"
          >
            性别：
          </el-col>
          <el-col :span="8">
            <span v-if="teacherData.sex == 1">男</span>
            <span v-if="teacherData.sex == 0">女</span>
          </el-col>
          <el-col
            :span="4"
            style="color:#333;"
          >
            讲师类型：
          </el-col>
          <el-col :span="8">
            <span v-if="teacherData.type == 1">内训</span>
            <span v-if="teacherData.type == 2">外聘</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="4"
            style="color:#333;"
          >
            讲师级别：
          </el-col>
          <el-col :span="8">
            {{ teacherData.teacherLevel }}
          </el-col>
          <el-col
            :span="4"
            style="color:#333;"
          >
            讲师职称：
          </el-col>
          <el-col :span="8">
            {{ teacherData.teacherTitle }}
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col
            :span="4"
            style="color:#333;"
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
          v-if="teacherData.status == 1"
          size="medium"
          @click="iseditSysRulus(0)"
        >
          停用
        </el-button>
        <el-button
          v-else
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
  </div>
</template>

<script>
import { getTeacher, Teacherdelete, editSysRulus } from '@/api/lecturer/lecturer'
export default {
  data() {
    return {
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

  methods: {
    // 启动/停用系统规则列表
    iseditSysRulus(status) {
      let params = {
        id: '',
        status: '' // '0 停用 1 正常',
      }
      params.id = this.$route.query.id
      params.status = status
      editSysRulus(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isgetTeacher()
      })
    },

    // 删除讲师
    isTeacherdelete(id) {
      let params = {
        ids: id
      }
      params.ids = this.$route.query.id
      Teacherdelete(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.toLecturer()
      })
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
        // console.log(res.teacherInfo);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.compileLecturer {
  .compileLecturerr_head {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
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
      img {
        width: 400px;
        height: 220px;
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
