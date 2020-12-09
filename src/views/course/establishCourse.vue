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
          @click="isAddCourse(2)"
        >
          存草稿
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="isAddCourse(1)"
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
          <el-col :span="11">
            <el-form-item
              label="课程名称"
              prop="name"
            >
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
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
          <el-col :span="11">
            <el-form-item
              label="所在目录"
              prop="catalogId"
            >
              <el-cascader
                v-model="ruleForm.catalogId"
                :props="{ value: 'id', label: 'name' }"
                :options="catalogIdoptions"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="课程类型"
              prop="type"
            >
              <el-select
                v-model="ruleForm.type"
                placeholder="请选择课程类型"
              >
                <el-option
                  label="在线课程"
                  value="1"
                ></el-option>
                <el-option
                  label="面授课程"
                  value="2"
                ></el-option>
                <el-option
                  label="直播课程"
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
          <el-col :span="11">
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
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
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
          <el-col :span="11">
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
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
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
          <el-col :span="11">
            <el-select
              v-model="ruleForm.tagIds"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in tagIdsOptions"
                :key="item.tagId"
                :label="item.name"
                :value="item.tagId"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
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
              <common-upload
                v-model="ruleForm.imageUrl"
                class="upload-demo"
                drag
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
              >
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    只能上传jpg/png文件，且不超过500kb
                  </div>
                </div>
                <img
                  v-if="ruleForm.imageUrl"
                  :src="ruleForm.imageUrl.url"
                  class="avatar"
                />
              </common-upload>
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
              @click="addArticleBtn"
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
                  v-if="scope.row.saveOrcompile === 0"
                  v-model="scope.row.name"
                  placeholder="请输入内容"
                ></el-input>
                <span v-if="scope.row.saveOrcompile === 1">{{ scope.row.name }}</span>
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
                <span v-if="scope.row.saveOrcompile === 0">
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
                </span>

                <span v-if="scope.row.saveOrcompile === 1">
                  <span v-if="typeOption[scope.row.type - 1]">
                    {{ typeOption[scope.row.type - 1].name }}
                  </span>
                </span>
              </template>
            </el-table-column>

            <!-- 第四列 -->
            <el-table-column
              prop="type"
              label="内容"
              width="250"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.saveOrcompile === 0">
                  <span
                    v-if="typeOption[scope.row.type - 1]"
                    size="medium"
                  >
                    <el-button
                      v-if="typeOption[scope.row.type - 1].value === 1"
                      @click="AddArticleBtntable(scope.$index)"
                    >添加文章</el-button>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value === 2"
                      v-model="upLoad"
                      :before-upload="CoursewareUpload"
                      :multiple="false"
                    >上传课件</common-upload>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value === 3"
                      v-model="upLoad"
                      :multiple="false"
                      :before-upload="DataUpload"
                    >上传资料</common-upload>
                    <el-button
                      v-if="typeOption[scope.row.type - 1].value === 4"
                    >关联考试</el-button>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value === 5"
                      v-model="upLoad"
                      :before-upload="VideoUpload"
                      :multiple="false"
                    >上传视频</common-upload>
                  </span>
                  <span
                    v-else
                    size="medium"
                  >
                    请选择章节类型
                  </span>
                </div>

                <div v-if="scope.row.saveOrcompile === 1">
                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 1">
                      <span v-if="scope.row.localName">{{ scope.row.localName }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 2">
                      <span v-if="upLoad">{{ upLoad[0].localName }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 3">
                      <span v-if="upLoad">{{ upLoad[0].localName }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 5">
                      <span v-if="upLoad">{{ upLoad[0].localName }}</span>
                    </span>
                  </span>
                </div>
              </template>
            </el-table-column>

            <!-- 第五列 -->
            <el-table-column
              label="操作"
              fixed="right"
              width="170"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.saveOrcompile === 1"
                  type="text"
                  size="small"
                  @click="scope.row.saveOrcompile = 0"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.saveOrcompile === 0"
                  type="text"
                  size="small"
                  @click="scope.row.saveOrcompile = 1"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="delContent(scope.$index)"
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
                v-model="addArticle.localName"
                placeholder="请输入标题"
              ></el-input>
            </div>
            <div class="dialog_tinymce">
              <span>内容</span>
              <div><tinymce v-model="addArticle.content" /></div>
            </div>

            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="isAddArticle()"
              >确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCourse, getCourseTags, getCatalog } from '@/api/course/course'
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      catalogIdoptions: [],
      // 上传视频
      UploadVideo: [],
      // 上传课件
      UploadCourseware: [],
      // 上传资料
      UploadData: [],

      checkboxVal: [],
      // 添加文章
      dialogVisible: false,
      addArticle: {
        localName: '',
        content: ''
      },
      // 添加标签
      tagIdsOptions: [
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
          name: '资料下载',
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
      AddArticleBtntableIndex: '',
      ruleForm: {
        imageUrl: [], //图片
        url: '',
        localName: '',
        catalogId: '',
        electiveType: '',
        thinkContent: '', //课前思考内容
        introduction: '', //课程介绍
        tagIds: '', //标签
        isRecommend: '', //是否推荐
        passCondition: '', //通过条件
        period: '', //时长
        credit: '', //学分
        // 所在分类现在没有
        type: '', //课程类型
        name: '', //课程名称
        teacherId: '', //讲师id
        // 表格
        contents: [
          {
            // url: '',
            // localName: '', //章节类型为文章时，表示标题；章节内容为课件时，表示文件名
            // sort: '', //序号
            // type: '', //章节类型
            // name: '', // 章节名称
            // content: '', //文章内容
            // upLoad: [], //[url,localName],  //所有上传的文件
            // saveOrcompile: 0 // 1保存&0编辑
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
        imageUrl: [{ required: true, message: '请选择课程封面', trigger: 'blur' }],
        introduction: [{ required: true, message: '请书写课程介绍', trigger: 'blur' }],
        thinkContent: [{ required: true, message: '请书写课前思考内容', trigger: 'blur' }]
      }
    }
  },
  watch: {},

  created() {
    this.isgetCourseTags()
    this.isgetCatalog()
  },
  methods: {
    // 拿到列表数据
    isgetCatalog() {
      getCatalog().then((res) => {
        // console.log(res)
        this.catalogIdoptions = res
      })
    },
    //添加文章tabel btn
    AddArticleBtntable(index) {
      this.AddArticleBtntableIndex = index
      this.dialogVisible = true
    },
    // 添加文章
    isAddArticle() {
      this.ruleForm.contents[this.AddArticleBtntableIndex].localName = this.addArticle.localName
      this.ruleForm.contents[this.AddArticleBtntableIndex].content = this.addArticle.content
      this.addArticle.localName = ''
      this.addArticle.content = ''
      this.dialogVisible = false
    },
    // 拿添加标签数据
    isgetCourseTags() {
      getCourseTags().then((res) => {
        this.tagIdsOptions = res
      })
    },

    // 发布&草稿
    isAddCourse(status) {
      this.ruleForm.contents.map((item, index) => {
        item.sort = index
        if (item.upLoad[0]) {
          item.localName = item.upLoad[item.upLoad.length - 1].localName
          item.url = item.upLoad[item.upLoad.length - 1].url
        }
      })
      this.ruleForm.localName = this.ruleForm.imageUrl.localName
      this.ruleForm.url = this.ruleForm.imageUrl.url
      // 草稿
      if (status === 2) {
        this.$confirm(
          '您有内容未保存，返回将丢失。您可以将草稿暂存在“草稿”分组下，可以再次编辑，是否保存草稿?',
          '提示',
          {
            confirmButtonText: '保存',
            cancelButtonText: '不保存',
            type: 'warning'
          }
        )
          .then(() => {
            this.ruleForm.status = status
            addCourse(this.ruleForm).then(() => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({ path: '/course/courseDraft' })
              }, 2000)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已保存消'
            })
            setTimeout(() => {
              this.$router.push({ path: '/course/courseDraft' })
            }, 2000)
          })
      }
      if (status === 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            this.$message({
              message: '信息填写不完整',
              type: 'warning'
            })
          } else {
            this.ruleForm.status = status
            addCourse(this.ruleForm).then(() => {
              this.$message({
                message: '本课程已发布成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({ path: '/course/courseDraft' })
              }, 2000)
            })
          }
        })
      }
    },

    // 资料校验
    DataUpload(file) {
      const regx = /^.*\.(txt|doc|wps|rtf|rar|zip|xls|xlsx|ppt|pptx|pdf)$/
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isLt10M) {
        this.$message.error('上传资料片大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传资料只支持txt,doc,wps,rtf,rar,zip,xls,xlsx,ppt,pptx,pdf文件')
        return false
      }
      return true
    },
    // 视频校验
    VideoUpload(file) {
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传视频只支持avi,wmv,mp4,3gp,rm,rmvb,mov文件')
        return false
      }
      return true
    },

    // 课件校验
    CoursewareUpload(file) {
      const regx = /^.*\.(txt|doc|wps|rtf|xls|xlsx|ppt|pptx|pdf)$/
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传资料只支持txt,doc,wps,rtf,xls,xlsx,ppt,pptx,pdf文件')
        return false
      }
      return true
    },
    // 1保存&0编辑btn
    saveOrcompileBtn() {},
    // 添加章节
    addArticleBtn() {
      let item = {
        sort: '', //序号
        type: '', //章节类型
        name: '', // 章节名称
        localName: '', //文章标题
        url: '',
        content: '', //文章内容
        upLoad: [], //[url,localName],  //所有上传的文件
        saveOrcompile: 0 // 1保存&0编辑
      }
      this.ruleForm.contents.push(item)
    },
    setCheckboxVal() {
      this.ruleForm.passCondition = this.checkboxVal
    },

    // 删除
    delContent(index) {
      // console.log(index)
      this.ruleForm.contents.splice(index, 1)
    },
    //数组元素互换位置方法
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 向上移动
    upward(scope) {
      this.swapArray(this.ruleForm.contents, scope - 1, scope)
    },
    // 向下移动
    downward(scope) {
      this.swapArray(this.ruleForm.contents, scope, scope + 1)
    },
    // 图片
    // handleAvatarSuccess(res, file) {
    //   this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
    //   // this.ruleForm.imageUrl
    //   // res, file
    // },
    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpge|png|GIF)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg|jpge|png|GIF文件')
        return false
      }
      return true
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
    padding: 10vh 10vw;
    #ruleForm {
      /deep/.el-input {
        width: 20vw;
      }
    }
  }

  /deep/.el-input-number {
    width: 20vw;
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
    width: 450px;
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
    border: 1px solid #ccc;
    padding: 40px 50px 20px;
    border-radius: 7px;
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
  .el-upload__text {
    width: 210px;
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
