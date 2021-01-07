<template>
  <div class="establishCourse">
    <!-- 头部 -->
    <div class="head">
      <i
        class="el-icon-arrow-left  icon"
        @click="tocourseDraft"
      ></i>

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
        <!-- <el-button size="medium">
          预览
        </el-button> -->
        <el-button
          size="medium"
          @click="isAddCourse(2)"
        >
          存草稿
        </el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="disabledBtn"
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
              <el-input
                v-model="ruleForm.name"
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="讲师"
              prop="teacherId"
            >
              <el-select
                v-model="ruleForm.teacherId"
                placeholder="请选择讲师"
                filterable
              >
                <el-option
                  v-for="(item, index) in TeacherData"
                  :key="index"
                  :label="item.name"
                  :value="item.idStr"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="所在分类"
              prop="catalogId"
            >
              <!-- <el-cascader
                v-model="ruleForm.catalogId"
                :props="{ value: 'id', label: 'name', checkStrictly: true }"
                :options="catalogIdoptions"
              ></el-cascader> -->

              <el-select
                v-model="ruleForm.catalogId"
                :multiple-limit="10"
                placeholder="请选择"
              >
                <el-option
                  style="height: auto;padding:0"
                  :value="ruleForm.catalogId"
                  :label="parentOrgIdLabel"
                >
                  <el-tree
                    ref="orgTree"
                    :data="catalogIdoptions"
                    node-key="catalogId"
                    :props="{
                      children: 'children',
                      label: 'name',
                      value: 'id'
                    }"
                    @node-click="handleOrgNodeClick"
                  />
                </el-option>
              </el-select>
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
                  :value="1"
                ></el-option>
                <el-option
                  label="面授课程"
                  :value="2"
                ></el-option>
                <el-option
                  label="直播课程"
                  :value="3"
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
                :max="100"
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
                :max="100"
                @change="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <!-- {{ruleForm.passCondition}} -->
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="通过条件"
              prop="passCondition"
            >
              <el-checkbox-group
                v-model="ruleForm.passCondition"
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
                  label="开放选修"
                  :value="1"
                ></el-option>
                <el-option
                  label="通过审批"
                  :value="2"
                ></el-option>
                <el-option
                  label="禁止选修"
                  :value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <!-- <span>添加标签</span> -->
        <el-row class="switch_box">
          <!-- <el-col :span="11">
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
          </el-col> -->
          <el-col :span="11">
            <div>
              <span class="switch_title">是否推荐</span>
              <el-switch
                v-model="ruleForm.isRecommend"
                active-color="#198cff"
                inactive-color="#a0a8ae"
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
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    只能上传jpg/jpeg/png文件，且不超过10MB
                  </div>
                </div>
                <img
                  v-if="ruleForm.imageUrl[1]"
                  :src="ruleForm.imageUrl[ruleForm.imageUrl.length - 1].url"
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
            prop="introduction"
          >
            <tinymce
              v-model="ruleForm.introduction"
              :init="{ height: 100 }"
            />
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
              size="medium"
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
                  maxlength="32"
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
                      type="text"
                      @click="AddArticleBtntable(scope.$index, scope.row)"
                    >
                      {{
                        scope.row.upLoad[0]
                          ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                          : '添加文章'
                      }}
                    </el-button>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value === 2"
                      v-model="scope.row.upLoad"
                      :before-upload="CoursewareUpload"
                      :multiple="false"
                    >
                      <el-button type="text">
                        {{
                          scope.row.upLoad[0]
                            ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                            : '上传课件'
                        }}
                      </el-button>
                    </common-upload>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value === 3"
                      v-model="scope.row.upLoad"
                      :multiple="false"
                      :before-upload="DataUpload"
                    >
                      <el-button type="text">
                        {{
                          scope.row.upLoad[0]
                            ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                            : '上传资料'
                        }}
                      </el-button>
                    </common-upload>
                    <el-button
                      v-if="typeOption[scope.row.type - 1].value === 4"
                      type="text"
                    >关联考试</el-button>
                    <common-upload
                      v-if="typeOption[scope.row.type - 1].value == 5"
                      v-model="scope.row.upLoad"
                      :before-upload="VideoUpload"
                      :multiple="false"
                    >
                      <el-button type="text">
                        {{
                          scope.row.upLoad[0]
                            ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                            : '上传视频'
                        }}
                      </el-button>
                    </common-upload>
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
                      <span v-if="scope.row.upLoad">{{
                        scope.row.upLoad[scope.row.upLoad.length - 1]
                          ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                          : ''
                      }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 2">
                      <span v-if="scope.row.upLoad">{{
                        scope.row.upLoad[scope.row.upLoad.length - 1]
                          ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                          : ''
                      }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 3">
                      <span v-if="scope.row.upLoad">{{
                        scope.row.upLoad[scope.row.upLoad.length - 1]
                          ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                          : ''
                      }}</span>
                    </span>
                  </span>

                  <span v-if="typeOption[scope.row.type - 1]">
                    <span v-if="typeOption[scope.row.type - 1].value === 5">
                      <span v-if="scope.row.upLoad">{{
                        scope.row.upLoad[scope.row.upLoad.length - 1]
                          ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                          : ''
                      }}</span>
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
                  size="medium"
                  @click="scope.row.saveOrcompile = 0"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.saveOrcompile === 0"
                  type="text"
                  size="medium"
                  @click="scope.row.saveOrcompile = 1"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click="delContent(scope.$index)"
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  :disabled="scope.$index === 0"
                  @click="upward(scope.$index)"
                >
                  上移
                </el-button>
                <el-button
                  type="text"
                  size="medium"
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
              <!-- <span>标题</span>
              <el-input
                v-model="addArticle.localName"
                placeholder="请输入标题"
                maxlength="32"
              ></el-input> -->

              <el-form
                ref="ruleFormDialog"
                :model="addArticle"
                :rules="rulesDialog"
                label-width="60px"
                class="demo-ruleForm"
              >
                <el-form-item
                  label="标题"
                  prop="localName"
                >
                  <el-input
                    v-model="addArticle.localName"
                    placeholder="请输入标题"
                    maxlength="32"
                    style="width:480px; margin-left: -15px"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog_tinymce">
              <span>内容</span>
              <div>
                <tinymce
                  id="tinymceId"
                  v-model="addArticle.content"
                />
              </div>
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
import {
  getCourseTags,
  getCatalog,
  getCourseContents,
  getCourse,
  addCourse,
  listTeacher
} from '@/api/course/course'
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      parentOrgIdLabel: '',
      remember: true,
      disabledBtn: false,
      TeacherData: '',
      catalogIdoptions: [],
      checkboxVal: [],
      // 添加文章
      dialogVisible: false,
      addArticle: {
        localName: '',
        content: ''
      },
      // 添加标签
      tagIdsOptions: [],
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
        imageUrl: [{}], //图片
        url: '',
        localName: '',
        catalogId: '',
        electiveType: '',
        thinkContent: '', //课前思考内容
        introduction: '', //课程介绍
        // tagIds: [], //标签
        isRecommend: false, //是否推荐
        passCondition: [], //通过条件
        period: undefined, //时长
        credit: undefined, //学分
        // 所在分类现在没有
        type: '', //课程类型
        name: '', //课程名称
        teacherId: '', //讲师id
        // 表格
        contents: [
          // {
          //   url: '',
          //   localName: '', //章节类型为文章时，表示标题；章节内容为课件时，表示文件名
          //   sort: '', //序号
          //   type: '', //章节类型
          //   name: '', // 章节名称
          //   content: '', //文章内容
          //   upLoad: [], //[url,localName],  //所有上传的文件
          //   saveOrcompile: 0 // 1保存&0编辑
          // }
        ]
      },
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: ['blur', 'change'] }],
        teacherId: [{ required: true, message: '请输入讲师名称', trigger: ['blur', 'change'] }],
        catalogId: [{ required: true, message: '请选择所在分类', trigger: ['blur', 'change'] }],
        type: [{ required: true, message: '请选择课程类型', trigger: ['blur', 'change'] }],
        passCondition: [
          { type: 'array', required: true, message: '请选择通过条件', trigger: ['blur'] }
        ],
        electiveType: [{ required: true, message: '请选择选修类型', trigger: ['blur', 'change'] }],
        imageUrl: [
          { type: 'array', required: true, message: '请选择课程封面', trigger: ['change'] }
        ],
        introduction: [{ required: true, message: '请书写课程介绍', trigger: ['blur', 'change'] }],
        thinkContent: [
          { required: true, message: '请书写课前思考内容', trigger: ['blur', 'change'] }
        ]
      },
      rulesDialog: {
        localName: [{ required: true, message: '请输入标题', trigger: ['blur'] }]
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
      },
      immediate: true,
      deep: true,
      return: true
    },
    'ruleForm.imageUrl': {
      handler() {
        this.$nextTick(() => {
          this.$refs.ruleForm.validateField('imageUrl', () => {})
        })
      },
      immediate: false,
      deep: true
    }
  },

  created() {
    this.isdeleteData()
  },
  activated() {
    this.isdeleteData()
    this.isgetCourseTags()
    this.isgetCatalog()
    // this.getInfo()
    this.islistTeacher()
    this.$refs.ruleForm.clearValidate()
  },

  methods: {
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.ruleForm.catalogId = data.id
        this.parentOrgIdLabel = data.name
      }
    },
    tocourseDraft() {
      // this.$router.push({ path: '/course/courseDraft' })
      this.$router.go(-1)
      // this.isdeleteData()
      this.$refs.ruleForm.clearValidate()
    },

    islistTeacher() {
      listTeacher().then((res) => {
        this.TeacherData = res
      })
    },

    // 编辑页面的数据前
    // 编辑页面的数据后
    getInfo() {
      let id = this.$route.query.id
      getCourseContents({ courseId: id }).then((res) => {
        // console.log('getCourseContents---------------', res)
        let data = res
        data.map((item) => {
          item.upLoad = [{ localName: '', url: '' }]
          item.upLoad[0].localName = item.localName
          item.upLoad[0].url = item.url
        })

        this.ruleForm.contents = data
      })
      getCourse({ courseId: id }).then((res) => {
        let data = res
        data.imageUrl = [{ localName: '', url: '' }]
        data.imageUrl[0].localName = data.localName
        data.imageUrl[0].url = data.url
        data.contents = []
        this.ruleForm = data
        this.$forceUpdate()
      })
    },

    // 拿到列表数据
    isgetCatalog() {
      getCatalog().then((res) => {
        let resList = this.ListData(res)
        this.catalogIdoptions = resList
      })
    },

    // 递归过滤数据
    ListData(arr) {
      if (arr.length > 0) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].status == 1) {
            arr.splice(i, 1)
          } else if (arr[i].children) {
            this.ListData(arr[i].children)
          }
        }
      }
      return arr
    },

    //添加文章tabel btn
    AddArticleBtntable(index, row) {
      this.addArticle.localName = row.upLoad[row.upLoad.length - 1]
        ? row.upLoad[row.upLoad.length - 1].localName
        : ''
      this.addArticle.content = row.upLoad[row.upLoad.length - 1]
        ? row.upLoad[row.upLoad.length - 1].content
        : ''
      this.AddArticleBtntableIndex = index
      this.dialogVisible = true
    },
    // 添加文章
    isAddArticle() {
      this.$refs.ruleFormDialog.validate((valid) => {
        if (valid) {
          let i = {
            localName: this.addArticle.localName,
            content: this.addArticle.content
          }
          // this.ruleForm.contents[this.AddArticleBtntableIndex].localName = this.addArticle.localName
          // this.ruleForm.contents[this.AddArticleBtntableIndex].content = this.addArticle.content
          this.ruleForm.contents[this.AddArticleBtntableIndex].upLoad.push(i)
          this.addArticle.localName = ''
          this.addArticle.content = ''
          this.dialogVisible = false
        }
      })
    },
    // 拿添加标签数据
    isgetCourseTags() {
      getCourseTags().then((res) => {
        this.tagIdsOptions = res
      })
    },

    // 发布&草稿
    isAddCourse(status) {
      if (this.remember) {
        this.ruleForm.imageUrl = this.ruleForm.imageUrl.splice(1, 1)
      }
      this.remember = false
      this.ruleForm.contents.map((item, index) => {
        item.sort = index
        if (item.upLoad.length !== 0) {
          item.localName = item.upLoad[item.upLoad.length - 1].localName
          item.url = item.upLoad[item.upLoad.length - 1].url
        }
      })
      this.ruleForm.localName = this.ruleForm.imageUrl[this.ruleForm.imageUrl.length - 1]
        ? this.ruleForm.imageUrl[this.ruleForm.imageUrl.length - 1].localName
        : ''
      this.ruleForm.url = this.ruleForm.imageUrl[this.ruleForm.imageUrl.length - 1]
        ? this.ruleForm.imageUrl[this.ruleForm.imageUrl.length - 1].url
        : ''

      let params = JSON.parse(JSON.stringify(this.ruleForm))
      delete params.imageUrl
      params.contents.forEach((item) => {
        delete item.upLoad
      })
      params.passCondition = params.passCondition ? params.passCondition.join(',') : ''
      params.isRecommend = params.isRecommend === false ? 0 : 1
      // 富文本要转换传后端
      params.introduction = _.escape(params.introduction)
      params.thinkContent = _.escape(params.thinkContent)

      // 草稿
      if (status === 2) {
        this.$confirm('您可以将草稿暂存在“草稿”分组下，可以再次编辑，是否保存草稿?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        })
          .then(() => {
            params.status = status

            addCourse(params).then(() => {
              // editCourseInfo(this.ruleForm).then(() => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              setTimeout(() => {
                this.isdeleteData()
                this.$router.push({ path: '/course/courseDraft?status=' + status })
                this.disabledBtn = false
                // this.$router.go(-1)
              }, 2000)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
            // setTimeout(() => {
            //   this.isdeleteData()
            //   this.$router.push({ path: '/course/courseDraft' })
            // }, 2000)
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
            this.disabledBtn = true
            params.status = status
            addCourse(params).then(() => {
              this.$message({
                message: '本课程已发布成功',
                type: 'success'
              })
              setTimeout(() => {
                this.isdeleteData()
                this.disabledBtn = false
                // this.$router.go(-1)
                this.$router.push({ path: '/course/courseDraft?status=' + status })
              }, 2000)
            })
          }
        })
      }
    },

    // 清空数据
    isdeleteData() {
      this.resetForm()
      this.ruleForm = {
        imageUrl: [{}], //图片
        url: null,
        localName: '',
        catalogId: null,
        electiveType: '',
        thinkContent: '', //课前思考内容
        introduction: ' ', //课程介绍
        // tagIds: [], //标签
        isRecommend: false, //是否推荐
        passCondition: [], //通过条件
        period: undefined, //时长
        credit: undefined, //学分
        // 所在分类现在没有
        type: '', //课程类型
        name: '', //课程名称
        teacherId: '', //讲师id
        // 表格
        contents: [
          // {
          //   // url: '',
          //   // localName: '', //章节类型为文章时，表示标题；章节内容为课件时，表示文件名
          //   // sort: '', //序号
          //   // type: '', //章节类型
          //   // name: '', // 章节名称
          //   // content: '', //文章内容
          //   upLoad: [] //[url,localName],  //所有上传的文件
          //   // saveOrcompile: 0 // 1保存&0编辑
          // }
        ]
      }
    },
    resetForm() {
      // this.$refs['ruleForm'].resetField()
      this.parentOrgIdLabel = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.$refs['ruleForm'].clearValidate()
      })
    },
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
      // this.ruleForm.passCondition = this.checkboxVal
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
      const regx = /^.*\.(jpg|jpeg|png)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg|jpeg|png文件')
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.tox-tinymce {
  height: 480px !important;
}
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
      .schedule1,
      .schedule2,
      .schedule3 {
        cursor: pointer;
      }
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
    // border: 1px solid #ccc;
    // padding: 40px 50px 20px;
    // border-radius: 7px;
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
    margin-left: -7vw;
    width: 60vw;
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
    width: 100%;
    text-align: center;
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
.icon {
  font-size: 28px;
  margin-left: 30px;
  position: absolute;
  top: 15px;
  left: 20px;
  cursor: pointer;
}
</style>
