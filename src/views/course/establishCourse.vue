<template>
  <div class="establishCourse">
    <!-- 头部 -->
    <div class="head">
      <div class="schedule">
        <div
          :class="{ sign: headIndex === 1 }"
          class="schedule1"
          @click="headIndex = 1"
        >
          <i class="el-icon-info"></i> 填写课程信息
        </div>
        <div
          :class="{ sign: headIndex === 2 }"
          class="schedule2"
          @click="headIndex = 2"
        >
          <i class="el-icon-s-marketing"></i> 填写课前思考内容
        </div>
        <div
          :class="{ sign: headIndex === 3 }"
          class="schedule3"
          @click="headIndex = 3"
        >
          <i class="el-icon-s-tools"></i> 上传课程内容
        </div>
      </div>
      <div class="btns">
        <el-button size="small">
          预览
        </el-button>
        <el-button
          size="small"
          @click="addCourse(2)"
        >
          存草稿
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="addCourse(1)"
        >
          发布
        </el-button>
      </div>
    </div>

    <!-- 表单 -->
    <div class="content">
      <!-- 填写课程信息 -->
      <el-form
        v-show="headIndex === 1"
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
              label="课程名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="讲师"
              prop="teacherId"
            >
              <el-input v-model="ruleForm.teacherId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="所在目录"
              prop="catalogId"
            >
              <el-select
                v-model="ruleForm.catalogId"
                placeholder="请选择所在目录"
              >
                <el-option
                  label="区域一"
                  value="1"
                ></el-option>
                <el-option
                  label="区域二"
                  value="2"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="课程类型"
              prop="type"
            >
              <el-select
                v-model="ruleForm.type"
                placeholder="请选择课程类型"
              >
                <el-option
                  label="在线"
                  value="1"
                ></el-option>
                <el-option
                  label="面授"
                  value="2"
                ></el-option>
                <el-option
                  label="直播"
                  value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <div class="num_title">
          <span>学时(小时)</span>
          <span> 学分 </span>
        </div>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="period">
              <el-input-number
                v-model="ruleForm.period"
                controls-position="right"
                :min="0"
                :step="0.5"
                @change="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item prop="credit">
              <el-input-number
                v-model="ruleForm.credit"
                controls-position="right"
                :min="0"
                :step="0.5"
                @change="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="通过条件"
              prop="passCondition"
            >
              <el-checkbox-group
                v-model="checkboxVal"
                @change="setCheckboxVal"
              >
                <el-checkbox label="a">
                  教师评定
                </el-checkbox>
                <el-checkbox label="b">
                  考试通过
                </el-checkbox>
                <el-checkbox label="c">
                  达到课程学时
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="选修类型"
              prop="electiveType"
            >
              <el-select
                v-model="ruleForm.electiveType"
                placeholder="请选择选修类型"
              >
                <el-option
                  label="开放"
                  value="1"
                ></el-option>
                <el-option
                  label="通过审批"
                  value="2"
                ></el-option>
                <el-option
                  label="禁止"
                  value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <span>添加标签</span>
        <el-row class="switch_box">
          <el-col :span="10">
            <el-select
              v-model="value1"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <div>
              <span class="switch_title">是否推荐</span>
              <el-switch
                v-model="ruleForm.isRecommend"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </div>
          </el-col>
        </el-row>
        <!-- 第六行 -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="课程封面"
              prop="imageUrl"
            >
              <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em><br />
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </div>
                <img
                  v-if="ruleForm.imageUrl"
                  :src="ruleForm.imageUrl"
                  class="avatar"
                />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第七行 -->
        <div class="editorTitle">
          <el-form-item
            label="课程介绍"
            prop="editorTitle"
          >
            <tinymce v-model="ruleForm.introduction" />
          </el-form-item>
        </div>
      </el-form>

      <!-- 填写课前思考内容 -->
      <div v-show="headIndex === 2">
        <div class="editorTitle">
          <div class="reflectTitle">
            课前思考
          </div>
          <tinymce v-model="ruleForm.thinkContent" />
        </div>
      </div>

      <!-- 上传课程内容 -->
      <div v-show="headIndex === 3">
        <div id="upContent">
          <div class="up_head">
            <span>章节内容</span>
            <el-button
              type="primary"
              size="small"
              @click="dialogVisible = true"
            >
              添加章节
            </el-button>
          </div>

          <!-- 表格 -->
          <el-table
            :data="ruleForm.contents"
            style="width: 100%"
          >
            <!-- 第一列 -->
            <el-table-column
              label="序号"
              type="index"
              width="70"
            >
            </el-table-column>
            <!-- 第二列 -->
            <el-table-column
              prop="name"
              label="章节名称"
              width="380"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <!-- 第三列 -->
            <el-table-column
              id="type_select"
              prop="type"
              label="章节类型"
              width="185"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.type"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <!-- 第四列 -->
            <el-table-column
              prop="type"
              label="内容"
              width="250"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="typeOption[scope.row.type - 1]"
                  size="medium"
                >
                  <span v-if="typeOption[scope.row.type - 1].value === 1">添加文章</span>
                  <span v-if="typeOption[scope.row.type - 1].value === 2">上传课件</span>
                  <span v-if="typeOption[scope.row.type - 1].value === 3">关联知识点</span>
                  <span v-if="typeOption[scope.row.type - 1].value === 4">关联考试</span>
                  <span v-if="typeOption[scope.row.type - 1].value === 5">上传视频</span>
                </el-button>
                <el-button
                  v-else
                  size="medium"
                >
                  请选择章节类型
                </el-button>
              </template>
            </el-table-column>

            <!-- 第五列 -->
            <el-table-column
              prop="address"
              label="操作"
              fixed="right"
              width="170"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delContent(scope.row.id)"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  :disabled="scope.$index === 0"
                  @click="upward(scope.$index)"
                >
                  上移
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  :disabled="scope.$index === ruleForm.contents.length - 1"
                  @click="downward(scope.$index)"
                >
                  下移
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 添加文章 -->
          <el-dialog
            title="添加文章"
            :visible.sync="dialogVisible"
            width="60%"
            :modal-append-to-body="false"
          >
            <div class="dialog_input">
              <span>标题</span>
              <el-input
                v-model="addArticle.name"
                placeholder="请输入标题"
              ></el-input>
            </div>
            <div class="dialog_tinymce">
              <span>内容</span>
              <div><tinymce v-model="addArticle.thinkContent" /></div>
            </div>

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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCourseList, delCourseContent, addCourse } from '@/api/course/course'
export default {
  data() {
    return {
      checkboxVal: [],
      // 添加文章
      dialogVisible: false,
      addArticle: {
        name: '',
        thinkContent: ''
      },
      // 添加标签
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value1: [],
      // 页面切换
      headIndex: 1,
      // 上传课程内容章节类型
      typeOption: [
        {
          name: '文章',
          value: 1
        },
        {
          name: '普通课件',
          value: 2
        },
        {
          name: '知识点',
          value: 3
        },
        {
          name: '考试',
          value: 4
        },
        {
          name: '视频',
          value: 5
        }
      ],
      // 填写课程信息
      ruleForm: {
        status: '', //课程状态
        name: '', // 课程名称
        teacherId: '', // 讲师
        catalogId: '', // 所在目录
        type: '', // 课程类型(1:在线 2:面授 3:直播)
        period: 0, //学时
        credit: 0, // 学分
        passCondition: '', //通过条件（前端为多选，用a,b,c,d,...组合）
        electiveType: '', //选修类型
        isRecommend: '', //是否推荐(0：否   1：是)
        cover: '', //封面
        introduction: '', //课程介绍
        thinkContent: '', //课前思考内容
        region: '', //删
        resource: '',
        imageUrl: '',
        // 表格
        contents: [
          {
            articleContent: '', // 文件内容
            articleTitle: '', // 文章标题
            courseWareName: '', // 课件名称
            courseWareUrl: '', // 课件URL
            createId: '', // 创建人帐号
            createTime: '', // 创建时间
            id: 1, // 章节内容ID
            name: '', // 内容名称
            order: '', // 内容顺序
            type: '', //章节类型（1:文章 2:普通课件 3:知识点 4:考试 5:视频）
            updateTime: '' //更新时间
          }
        ]
      },
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        teacherId: [{ required: true, message: '请输入讲师名称', trigger: 'blur' }],
        catalogId: [{ required: true, message: '请选择所在目录', trigger: 'blur' }],
        type: [{ required: true, message: '请选择课程类型', trigger: 'blur' }],
        passCondition: [{ required: true, message: '请选择通过条件', trigger: 'blur' }],
        electiveType: [{ required: true, message: '请选择选修类型', trigger: 'blur' }],
        cover: [{ required: true, message: '请选择课程封面', trigger: 'blur' }],
        introduction: [{ required: true, message: '请书写课程介绍', trigger: 'blur' }],
        thinkContent: [{ required: true, message: '请书写课前思考内容', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传照片', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getInfo()
  },
  methods: {
    setCheckboxVal() {
      this.ruleForm.passCondition = this.checkboxVal
    },
    // 发布&草稿
    addCourse(status) {
      this.ruleForm.status = status
      addCourse(this.ruleForm).then((res) => {
        window.console.log(res)
        this.$message({
          message: '发送成功！！！',
          type: 'success'
        })
      })
    },
    // 删除
    delContent(id) {
      delCourseContent(id)
        .then((res) => {
          window.console.log(res)

          this.$message({
            message: '该章节已成功删除',
            type: 'success'
          })
        })
        .catch((err) => {
          window.console.log(err)

          this.$message.error(err.resMsg)
        })
    },
    // 拿数据
    getInfo() {
      getCourseList(1).then((res) => {
        this.ruleForm = { ...this.ruleForm } = res
      })
    },
    //数组元素互换位置方法
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 向上移动
    upward(scope) {
      this.swapArray(this.ruleForm.contents, scope - 1, scope)
      // console.log(scope)
    },
    // 向下移动
    downward(scope) {
      this.swapArray(this.ruleForm.contents, scope, scope + 1)
      // console.log(scope)
    },
    // 图片
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
      // this.ruleForm.imageUrl
      // res, file
    },
    beforeAvatarUpload(file) {
      // (file
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 计数器
    handleChange() {
      // (value 这有个(value)
    },

    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          // ('error submit!!'
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.establishCourse {
  color: #666666;
  width: 100%;
  margin: 0;
  padding: 0;
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #fff;
    height: 60px;
    width: 100%;
    border-top: 1px solid #d7d7d7;
    border-bottom: 1px solid #d7d7d7;
    box-shadow: 0px 2px 13px -6px #666666;
    .btns {
      margin-top: 8px;
      margin-right: 25px;
      position: absolute;
      top: 10px;
      right: 0;
      display: flex;
    }
    .schedule {
      margin: 0 auto;
      width: 60%;
      display: flex;
      justify-content: space-around;
    }
  }
  .content {
    box-sizing: border-box;
    margin: 20px auto;
    background-color: #fff;
    width: 80%;
    padding: 40px 100px;
    #ruleForm {
      /deep/.el-input {
        width: 350px;
      }
    }
  }

  /deep/.el-input-number {
    width: 350px;
  }
  /deep/.el-input-number .el-input__inner {
    text-align: left;
  }
  .num_title {
    padding-bottom: 8px;
    span {
      display: inline-block;
      width: 58%;
      &:nth-child(2) {
        width: 42%;
      }
    }
  }
  /deep/.el-form-item__label {
    width: 350px;
    text-align: left;
  }
  .switch_box {
    margin-top: 20px;
    margin-bottom: 40px;
    .switch_title {
      margin-right: 20px;
    }
  }
  .upload-demo {
    position: relative;
    .avatar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .editorTitle {
    width: 100%;
    padding-bottom: 20px;
    /deep/.el-form-item__label {
      float: none;
    }
    /deep/ .tox-edit-area {
      height: 350px;
    }
  }
  .sign {
    color: #3d7fff;
  }
  .reflectTitle {
    margin: 10px 0 10px;
  }
  #upContent {
    .up_head {
      display: flex;
      justify-content: space-between;
    }

    #type_select {
      box-sizing: border-box;
      width: 120px;
      /deep/.el-input {
        width: 100%;
      }
    }
  }
  .tox-edit-area {
    height: 450px;
  }
  /deep/.el-upload__tip {
    line-height: 0;
  }
  .dialog_input {
    margin: 20px;
    display: flex;
    width: 70%;
    span {
      width: 50px;
      line-height: 35px;
    }
  }
  .dialog_tinymce {
    margin: 20px;
    display: flex;
    span {
      width: 50px;
      line-height: 35px;
    }
    div {
      width: 100%;
    }
  }
}
</style>
