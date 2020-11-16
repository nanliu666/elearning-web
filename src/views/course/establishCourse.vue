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
        <el-button size="small">
          存草稿
        </el-button>
        <el-button
          size="small"
          type="primary"
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
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="所在目录"
              prop="region"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                ></el-option>
                <el-option
                  label="区域二"
                  value="beijing"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="课程类型"
              prop="region"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                ></el-option>
                <el-option
                  label="区域二"
                  value="beijing"
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
            <el-form-item prop="num">
              <el-input-number
                v-model="ruleForm.num"
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
            <el-form-item prop="num">
              <el-input-number
                v-model="ruleForm.num"
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
              prop="type"
            >
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox
                  label="教师评定"
                  name="type"
                ></el-checkbox>
                <el-checkbox
                  label="考试通过"
                  name="type"
                ></el-checkbox>
                <el-checkbox
                  label="达到课程学时"
                  name="type"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="活动区域"
              prop="region"
            >
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择活动区域"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                ></el-option>
                <el-option
                  label="区域二"
                  value="beijing"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row class="switch_box">
          <el-col :span="10">
            <div>
              <span class="switch_title">是否推荐</span>
              <el-switch
                v-model="ruleForm.delivery"
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
            <quillEditor v-model="ruleForm.editorTitle"></quillEditor>
          </el-form-item>
        </div>
      </el-form>

      <!-- 填写课前思考内容 -->
      <div v-show="headIndex === 2">
        <div class="editorTitle">
          <div class="reflectTitle">
            课前思考
          </div>
          <quillEditor v-model="reflect"></quillEditor>
        </div>
      </div>

      <!-- 上传课程内容 -->
      <div v-show="headIndex === 3">
        <div class="upContent">
          <div class="up_head">
            <span>章节内容</span>
            <el-button
              type="primary"
              size="small"
            >
              主要按钮
            </el-button>
          </div>

          <!-- 表格 -->
          <el-table
            :data="tableData"
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
              prop="name"
              label="章节类型"
              width="185"
            >
              <template slot-scope="scope">
                <select
                  v-model="scope.row.value"
                  placeholder="请选择"
                  class="upContent_select"
                >
                  <option
                    v-for="item in scope.row.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    class="upContent_option"
                  >
                  </option>
                </select>
              </template>
            </el-table-column>

            <!-- 第四列 -->
            <el-table-column
              prop="name"
              label="内容"
              width="180"
            >
              <template slot-scope="scope">
                <el-button size="small">
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>

            <!-- 第五列 -->
            <el-table-column
              prop="address"
              label="操作"
            >
              <template>
                <el-button
                  type="text"
                  size="small"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  size="small"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  size="small"
                >
                  上移
                </el-button>
                <el-button
                  type="text"
                  size="small"
                >
                  下移
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: { quillEditor },
  data() {
    return {
      // 页面切换
      headIndex: 1,
      // 表格
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          value: '',
          options: [
            {
              value: '1',
              label: '黄金糕'
            },
            {
              value: '2',
              label: '黄金糕'
            }
          ]
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          value: '',
          options: [
            {
              value: '1',
              label: '黄金糕'
            },
            {
              value: '2',
              label: '黄金糕'
            }
          ]
        }
      ],

      // 填写课前思考富文本内容
      reflect: '',
      // 填写课程信息
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        num: 1,
        imageUrl: '',
        editorTitle: ''
      },
      rules: {
        editorTitle: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  methods: {
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
  }
  /deep/.el-input {
    width: 350px;
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
    height: 500px;
    /deep/.el-form-item__label {
      float: none;
    }
    /deep/ .ql-container.ql-snow {
      height: 350px;
    }
  }
  .sign {
    color: #3d7fff;
  }
  .reflectTitle {
    margin: 10px 0 10px;
  }
  .upContent {
    .up_head {
      display: flex;
      justify-content: space-between;
    }
  }
  .upContent_select {
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    width: 85px;
    height: 35px;
    color: #202940;
    .upContent_option {
      border: 1px solid #dcdfe6;
    }
  }
}
</style>
