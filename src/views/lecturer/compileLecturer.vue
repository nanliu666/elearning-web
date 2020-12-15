<template>
  <div class="addLecturer">
    <div
      class="addLecturer_head"
      @click="toLecturer"
    >
      <i class="el-icon-arrow-left"></i> {{ $route.query.id ? '编辑讲师' : '添加讲师' }}
    </div>
    <div class="addLecturer_content">
      <div class="addLecturer_content_title">
        基础信息
      </div>

      <!-- 表单区域 -->
      <div class="addLecturer_form">
        <el-form
          id="ruleForm"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          class="demo-ruleForm"
        >
          <!-- 第一行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="讲师姓名"
                prop="userId"
              >
                <el-input
                  v-model="ruleForm.userId"
                  maxlength="32"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="手机号码"
                prop="phonenum"
              >
                <el-input
                  v-model="ruleForm.phonenum"
                  maxlength="32"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="电子邮件"
                prop="userEmail"
              >
                <el-input
                  v-model="ruleForm.userEmail"
                  maxlength="32"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="性别"
                prop="sex"
              >
                <el-radio
                  v-model="ruleForm.sex"
                  :label="1"
                  disabled
                >
                  男
                </el-radio>
                <el-radio
                  v-model="ruleForm.sex"
                  :label="0"
                  disabled
                >
                  女
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="讲师类型"
                prop="type"
              >
                <el-select
                  v-model="ruleForm.type"
                  placeholder="请选择所在目录"
                >
                  <el-option
                    label="内训"
                    value="1"
                  ></el-option>
                  <el-option
                    label="外聘"
                    value="2"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <!-- data -->
              <el-form-item
                label="所属分类"
                prop="categoryId"
              >
                <el-cascader
                  v-model="ruleForm.categoryId"
                  :props="{ value: 'id' }"
                  :options="data"
                  @change="treeClickNode"
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row>
            <el-col :span="10">
              <!-- 目前这个不做 -->
              <!-- <el-form-item label="擅长领域" prop="taglds">
                <el-select v-model="ruleForm.taglds" placeholder="请选择所在目录">
                  <el-option label="区域一" value="1"></el-option>
                  <el-option label="区域二" value="2"></el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item
                label="讲师级别"
                prop="teacherLevel"
              >
                <el-input
                  v-model="ruleForm.teacherLevel"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="讲师职称"
                prop="teacherTitle"
              >
                <el-input
                  v-model="ruleForm.teacherTitle"
                  maxlength="32"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第五行 -->
          <el-row class="switch_box">
            <el-col :span="10">
              <el-form-item
                prop="isRecommend"
                label="是否推荐 "
              >
                <!-- <span style="color:#333;">是否推荐 &nbsp; &nbsp; &nbsp;</span> -->
                <el-switch
                  v-model="ruleForm.isRecommend"
                  active-color="#198cff"
                  inactive-color="#ccc"
                >
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="是否最新讲师"
                prop="isLatestTeacher"
              >
                <el-radio
                  v-model="ruleForm.isLatestTeacher"
                  :label="1"
                >
                  是
                </el-radio>
                <el-radio
                  v-model="ruleForm.isLatestTeacher"
                  :label="0"
                >
                  否
                </el-radio>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 两个单选框 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="是否热门讲师"
                prop="isPopularTeacher"
              >
                <el-radio
                  v-model="ruleForm.isPopularTeacher"
                  :label="1"
                >
                  是
                </el-radio>
                <el-radio
                  v-model="ruleForm.isPopularTeacher"
                  :label="0"
                >
                  否
                </el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="2">
            </el-col>
            <el-col :span="10">
            </el-col>
          </el-row>

          <!-- 第六行 -->
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="讲师照片"
                prop="attachments"
              >
                <common-upload
                  v-model="ruleForm.attachments"
                  class="upload-demo"
                  drag
                  :multiple="false"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em><br />
                    <div
                      slot="tip"
                      class="el-upload__tip"
                    >
                      只能上传jpg/jpge/png/GIF文件，且不超过5M
                    </div>
                  </div>
                  <img
                    v-if="ruleForm.attachments && ruleForm.attachments.length"
                    :src="ruleForm.attachments[ruleForm.attachments.length - 1].fileUrl"
                    class="avatar"
                  />
                </common-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第七行 -->
          <div class="editorTitle">
            <el-form-item
              label="详细介绍"
              prop="introduction"
            >
              <tinymce v-model="ruleForm.introduction" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom_btns">
      <el-button
        type="primary"
        size="medium"
        @click="isAddTeacher(1)"
      >
        完成
      </el-button>
      <el-button
        size="medium"
        @click="isAddTeacher(0)"
      >
        完成并继续添加
      </el-button>
    </div>
  </div>
</template>

<script>
import { queryTeacherlist, listTeacherCategory, getTeacher, update } from '@/api/lecturer/lecturer'
// import { uploadQiniu } from '@/util/uploadQiniu'
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      userIdData: '',
      Teacherlist: [], //讲师的数据
      data: [], //分类列表
      checkboxVal: [],
      // 添加标签
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      // 填写课程信息
      ruleForm: {
        categoryId: '',
        userId: '',
        userEmail: '',
        phonenum: '',
        sex: '',
        attachments: [],
        isRecommend: 0,
        isLatestTeacher: 0,
        isPopularTeacher: 0
      },
      rules: {
        userId: [{ required: true, message: '请选择讲师', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择所在目录', trigger: 'blur' }],
        type: [{ required: true, message: '请选择课程类型', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 'ruleForm.name': {
    //   handler(n) {
    //     this.Teacherlist.forEach((item, index) => {
    //       if (item.userId == n) {
    //         this.ruleForm.phonenum = this.Teacherlist[index].phonenum
    //         this.disableDdata.disabledPhonenum = this.Teacherlist[index].phonenum ? true : false
    //         this.ruleForm.userEmail = this.Teacherlist[index].userEmail
    //         this.disableDdata.disabledUserEmail = this.Teacherlist[index].userEmail ? true : false
    //         this.ruleForm.sex = this.Teacherlist[index].sex
    //         this.disableDdata.disabledSex = this.Teacherlist[index].sex ? true : false
    //       }
    //     })
    //   }
    // immediate: true,  //刷新加载 立马触发一次handler
    // deep: true  // 可以深度检测到 person 对象的属性值的变化
    // }
  },
  created() {
    this.isgetTeacher()
    this.isqueryTeacherlist()
    this.islistTeacherCategory()
  },
  methods: {
    // 拿到数据
    async isgetTeacher() {
      let data = await getTeacher({ id: this.$route.query.id })
      // 存userId
      // console.log(data.teacherInfo)
      this.userIdData = data.teacherInfo.userId
      data.teacherInfo.attachments = []
      data.teacherInfo.attachments.push({ fileUrl: data.teacherInfo.photo })
      data.teacherInfo.userId = this.$route.query.name
      data.teacherInfo.userEmail = this.$route.query.userEmail
      data.teacherInfo.sex = this.$route.query.sex == true ? 1 : 0
      data.teacherInfo.phonenum = this.$route.query.phonenum
      this.ruleForm = data.teacherInfo
    },

    // 点击节点
    treeClickNode(data) {
      if (data) {
        this.islistTeacherCategory(data[0])
      }
    },

    // 查询讲师分类列表
    islistTeacherCategory(id) {
      let params = {}
      if (id) {
        params = {
          test: '123',
          parentId: '' // 父ID
        }
        params.parentId = id
      } else {
        params = {
          test: '123'
        }
      }
      listTeacherCategory(params).then((res) => {
        this.data = []
        for (let key in res) {
          if (key == 'group') {
            res[key].forEach((item) => {
              let i = {
                id: 1,
                label: '一级 1',
                btnshow: 1,
                children: []
              }
              i.id = item.idStr
              i.label = item.name
              i.btnshow = 1
              i.children = ''
              this.data.push(i)
            })
          }
        }

        for (let key in res) {
          if (key == 'son') {
            this.data.forEach((item, index) => {
              res[key].forEach((istem) => {
                if (item.id == istem.parentStr) {
                  let i = {
                    id: 1,
                    label: '一级 1',
                    btnshow: 1
                  }
                  i.id = istem.idStr
                  i.parent_id = istem.parentStr
                  i.label = istem.name
                  i.btnshow = 0
                  this.data[index].children = []
                  this.data[index].children.push(i)
                }
              })
            })
          }
        }
      })
    },

    // 查询添加讲师的数据
    isqueryTeacherlist() {
      let params = {
        pageNo: 1,
        pageSize: 999,
        search: ''
      }

      queryTeacherlist(params).then((res) => {
        this.Teacherlist = res.data
        // console.log(res)
      })
    },
    // 去讲师列表
    toLecturer() {
      this.$router.push({ path: '/lecturer/lecturer' })
    },

    // 添加讲师
    isAddTeacher(i) {
      // let categoryId = []
      // categoryId.push(
      //   this.ruleForm.categoryId
      //     ? this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1]
      //     : ''
      // )
      this.ruleForm.categoryId = this.ruleForm.categoryId
        ? this.ruleForm.categoryId[this.ruleForm.categoryId.length - 1]
        : ''
      let attachments = []
      if (this.ruleForm.attachments.length !== 0)
        attachments.push(
          this.ruleForm.attachments.length !== 0
            ? this.ruleForm.attachments[this.ruleForm.attachments.length - 1]
            : ''
        )
      this.ruleForm.attachments = attachments
      this.ruleForm.isRecommend = this.ruleForm.isRecommend === true ? 1 : 0
      // console.log(this.ruleForm)
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message({
            message: '信息填写不完整',
            type: 'warning'
          })
        } else {
          this.ruleForm.teacherId = this.$route.query.id
          this.ruleForm.userId = this.userIdData
          update(this.ruleForm).then(() => {
            if (i) {
              this.toLecturer()
              this.ruleForm = {
                categoryId: '',
                userId: '',
                userEmail: '',
                phonenum: '',
                sex: '',
                attachments: [],
                isRecommend: ''
              }
            } else {
              this.ruleForm = {
                categoryId: '',
                userId: '',
                userEmail: '',
                phonenum: '',
                sex: '',
                attachments: [],
                isRecommend: ''
              }
            }
          })
        }
      })
    },

    // 图片校验
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpge|png|GIF)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg|jpge|png|GIF文件')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo {
  width: 20vw;
  height: 20vh;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 3vh 0 0 4vw;
  position: relative;
  overflow: hidden;
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 20vw;
    height: 20vh;
  }
}
.addLecturer {
  .addLecturer_head {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    color: #333;
  }
  .addLecturer_content {
    background-color: #fff;
    padding: 50px 100px;
  }
  .addLecturer_content_title {
    color: #333;
    font-size: 18px;
    font-weight: normal;
  }
  .addLecturer_form {
    padding: 30px 15%;
  }

  .bottom_btns {
    width: 100%;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    height: 60px;
    box-shadow: 2px 2px 5px #000;
    background-color: #fff;
    padding: 15px 170px;
    z-index: 999999;
  }
}
/deep/.el-input-number {
  width: 350px;
}
/deep/.el-input-number .el-input__inner {
  text-align: left;
}
/deep/.el-form-item__label {
  width: 350px;
  text-align: left;
}
/deep/.el-form-item__label {
  float: none;
}
/deep/ .tox-edit-area {
  height: 350px;
}
/deep/.el-upload__tip {
  line-height: 0;
}
/deep/.el-select {
  width: 350px;
}
/deep/.el-input {
  width: 20vw !important;
}
</style>
