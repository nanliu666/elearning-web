<template>
  <div class="establishCourse">
    <!-- 头部 -->
    <div class="head">
      <i
        class="el-icon-arrow-left icon"
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
        <!-- <div
          :class="{ sign: headIndex === 2 }"
          class="schedule2"
          @click="headIndex = 2"
        >
          <i class="el-icon-s-marketing"></i> 填写课前思考内容
        </div> -->
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
          v-show="!this.$route.query.id"
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
                placeholder="请输入"
                maxlength="32"
                @blur="ruleForm.name = $event.target.value.trim()"
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
                  style="height: auto; padding: 0"
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
          <span><span
            style="color: #f56c6c;
    margin-right: 5px; display: inline-block; width: 3px; text-align: left;"
          >*</span>选修类型</span>
        </div>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="period">
              <el-input-number
                v-model="ruleForm.period"
                placeholder="请输入"
                controls-position="right"
                :min="0"
                :max="100"
                :step="0.5"
                :precision="1"
                @change="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <!-- <el-col
            v-if="false"
            :span="11"
          >
            <el-form-item prop="credit">
              <el-input-number
                v-model="ruleForm.credit"
                placeholder="请输入"
                controls-position="right"
                :min="0"
                :step="0.5"
                :max="100"
                :precision="1"
                @change="handleChange"
              ></el-input-number>
            </el-form-item>
          </el-col> -->

          <el-col :span="11">
            <el-form-item prop="electiveType">
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
                :active-value="1"
                :inactive-value="0"
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
                    只能上传jpg、jpeg、bmp、png文件，且不超过10MB
                  </div>
                </div>
                <img
                  v-if="ruleForm.imageUrl[0]"
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
              :init="{ selector: '#textarea1', placeholder: '在这里输入文字' }"
            ></tinymce>
          </el-form-item>
        </div>
      </el-form>

      <!-- 填写课前思考内容 -->
      <!-- <div v-show="headIndex === 2">
        <div class="editorTitle">
          <div class="reflectTitle">
            课前思考
          </div>
          <tinymce v-model="ruleForm.thinkContent" />
        </div>
      </div> -->

      <!-- 上传课程内容 -->
      <div v-show="headIndex === 3">
        <div id="upContent">
          <div class="reflection">
            <div class="reflection_title">
              <span>课前思考</span>
              <el-button
                type="primary"
                size="medium"
                :disabled="reflectionData.length != 0"
                @click="addReflectionData"
              >
                添加课前思考
              </el-button>
            </div>
            <div class="reflection_table">
              <el-table
                :data="reflectionData"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="70"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="章节名称"
                  width="330"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.name"
                      placeholder="请输入内容"
                      maxlength="32"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="章节类型"
                  width="185"
                >
                  <el-button
                    disabled
                    size="medium"
                  >
                    课前思考
                  </el-button>
                </el-table-column>
                <el-table-column
                  label="内容"
                  width="250"
                >
                  <el-button
                    type="text"
                    @click="reflectionVisible = true"
                  >
                    添加课前思考
                  </el-button>
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="170"
                >
                  <el-button
                    type="text"
                    @click="delReflectionData()"
                  >
                    删除
                  </el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div class="up_head">
            <span>章节内容
              <el-tooltip
                class="item"
                effect="dark"
                placement="top-start"
              >
                <div slot="content">
                  1.可根据章节类型添加内容<br />2.演示课件支持上传文档、ppt、pdf和视频，每个文件大小不超过10M；<br />3.资源下载是提供给学员的附件材料，学员可以在前端学习页面进行下载
                  。
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <div class="up_head_title_btn">
              <el-button
                size="medium"
                @click="addTask"
              >
                添加作业
              </el-button>
              <common-upload
                class="upload-more"
                multiple
                need-handler
                :check-upload="checkUpload"
                :on-upload-complete="onUploadComplete"
                :on-upload-progress="onUploadProgress"
                :before-upload="CoursewareUpload"
                @on-pending="onUploadPending"
              >
                <el-button size="medium">
                  批量上传课件
                </el-button>
              </common-upload>
              <el-button
                type="primary"
                size="medium"
                @click="addArticleBtn"
              >
                添加章节
              </el-button>
            </div>
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
              width="330"
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
                <span v-if="scope.row.taskBtn !== 'task'">
                  <span v-if="scope.row.saveOrcompile === 0">
                    <el-select
                      v-model="scope.row.type"
                      placeholder="请选择"
                      :disabled="scope.row.type == 4"
                      @change="() => selectChange(scope)"
                      @visible-change="() => selectVisibleChange(scope)"
                    >
                      <el-option
                        v-for="item in typeOption"
                        v-show="item.value != 4"
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
                  </span></span>

                <span v-else>
                  <el-button
                    size="medium"
                    disabled
                  >作业 <span class="taskBtnBox"></span>
                  </el-button>
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
                <div v-if="scope.row.taskBtn !== 'task'">
                  <div v-if="scope.row.saveOrcompile === 0">
                    <span
                      v-if="scope.row.type"
                      size="medium"
                    >
                      <el-button
                        v-if="scope.row.type === 1"
                        type="text"
                        @click="AddArticleBtntable(scope.$index, scope.row)"
                      >
                        {{
                          scope.row.upLoad[0]
                            ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                            : '添加文章'
                        }}
                      </el-button>

                      <span v-else>
                        <span v-if="scope.row.fileData.status === 'pending'">
                          等待上传...
                        </span>
                        <common-upload
                          v-else
                          need-handler
                          :on-upload-progress="
                            (fileData) => onUploadProgress(fileData, scope.row, scope.$index)
                          "
                          :check-upload="checkUpload"
                          :on-upload-complete="onUploadComplete"
                          :before-upload="uploadRef[scope.row.type - 2].beforeUpload"
                          :multiple="false"
                          @on-pending="(file) => onUploadPending(file, scope.row, scope.$index)"
                        >
                          <el-button type="text">{{
                            scope.row.upLoad[0] && scope.row.upLoad[0].localName
                              ? scope.row.upLoad[scope.row.upLoad.length - 1].localName
                              : uploadRef[scope.row.type - 2].tips
                          }}</el-button>
                        </common-upload>
                      </span>
                    </span>
                    <span
                      v-else
                      size="medium"
                    > 请选择章节类型 </span>
                  </div>

                  <div v-if="scope.row.saveOrcompile == 1">
                    <span
                      v-if="
                        scope.row.type == 1 ||
                          !scope.row.fileData.status ||
                          scope.row.fileData.status == 'complete'
                      "
                    >{{ scope.row.upLoad[scope.row.upLoad.length - 1].localName }}</span>
                    <span v-else-if="scope.row.fileData.status == 'pending'">等待上传...</span>
                    <el-progress
                      v-else-if="scope.row.fileData.status == 'progress'"
                      :percentage="scope.row.fileData.percent"
                      status="success"
                      text-inside
                      :stroke-width="18"
                    ></el-progress>
                  </div>
                </div>

                <div v-else>
                  <common-upload
                    need-handler
                    :on-upload-progress="
                      (fileData) => onUploadProgress(fileData, scope.row, scope.$index)
                    "
                    :check-upload="checkUpload"
                    :on-upload-complete="onUploadComplete"
                    :before-upload="taskUpload"
                    :multiple="false"
                    @on-pending="(file) => onUploadPending(file, scope.row, scope.$index)"
                  >
                    <el-button
                      v-if="scope.row.upLoad.length != 0"
                      type="text"
                      size="medium"
                    >
                      修改作业
                    </el-button>
                    <el-button
                      v-else
                      type="text"
                    >
                      上传附件
                    </el-button>
                  </common-upload>
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
                  v-if="scope.row.fileData.status === 'progress'"
                  type="text"
                  size="medium"
                  @click="controlUpload(scope.$index)"
                >
                  {{ scope.row.fileData.paused ? '继续' : '暂停' }}
                </el-button>

                <el-button
                  v-if="
                    (scope.row.content || scope.row.upLoad.length) && scope.row.saveOrcompile === 1
                  "
                  type="text"
                  size="medium"
                  @click="scope.row.saveOrcompile = 0"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="
                    (scope.row.content || scope.row.upLoad.length) && scope.row.saveOrcompile === 0
                  "
                  type="text"
                  size="medium"
                  @click="scope.row.saveOrcompile = 1"
                >
                  保存
                </el-button>
                <el-button
                  type="text"
                  size="medium"
                  @click="delContent(scope.row, scope.$index)"
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
                    style="width: 480px; margin-left: -15px"
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

          <!-- 课前思考dialog -->
          <el-dialog
            title="添加课前思考"
            :visible.sync="reflectionVisible"
            width="50%"
            :modal-append-to-body="false"
          >
            <!-- <div class="reflection_content">
              <tinymce v-model="ruleForm.thinkContent" />
            </div> -->
            <el-form
              :model="ruleForm"
              :rules="rules"
            >
              <el-form-item prop="thinkContent">
                <tinymce v-model="ruleForm.thinkContent" />
              </el-form-item>
            </el-form>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                type="primary"
                @click="reflectionVisible = false"
              >确 定</el-button>
              <el-button @click="reflectionVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { categoryMap } from '@/const/approve'
import {
  getCourseTags,
  // getCatalog,
  // getCourseContents,
  getCourse,
  addCourse,
  listTeacher,
  editCourseInfo
} from '@/api/course/course'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
// import { logout } from '@/api/user'
import { queryCategoryOrgList } from '@/api/resource/classroom'
export default {
  name: 'EstablishCourse',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload'),
    ApprSubmit
  },
  data() {
    return {
      reflectionData: [],
      reflectionVisible: false,
      isMultiple: false,
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
      chapterType: '',
      openChange: 1,
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
          name: '作业',
          value: 4
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
        // tagIds: [], //标签
        isRecommend: 0, //是否推荐
        passCondition: [], //通过条件
        period: '', //时长
        credit: 0, //积分
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
        introduction: [
          { required: true, message: '请书写课程介绍', trigger: ['blur', 'change'] },
          { max: 5000, message: '课程介绍最多不超过5000字', trigger: ['blur', 'change'] }
        ],
        thinkContent: [
          { required: true, message: '请书写课前思考内容', trigger: ['blur', 'change'] },
          { max: 5000, message: '课前思考内容最多不超过5000字', trigger: ['blur', 'change'] }
        ]
      },
      rulesDialog: {
        localName: [{ required: true, message: '请输入标题', trigger: ['blur'] }]
      },
      uploadRef: [
        {
          tips: '上传课件',
          beforeUpload: 'CoursewareUpload'
        },
        {
          tips: '上传资料',
          beforeUpload: 'DataUpload'
        },
        {
          tips: '上传作业',
          beforeUpload: 'taskUpload'
        }
      ],
      pendingQueue: [],
      uploadingQueue: []
    }
  },
  watch: {
    // $route: {
    //   handler() {
    //     this.$nextTick(() => {
    //       this.$refs.ruleForm.clearValidate()
    //       // this.$refs.ruleForm.resetFields()
    //     })
    //   },
    //   immediate: true,
    //   deep: true,
    //   return: true
    // },
    'ruleForm.imageUrl': {
      handler() {
        this.$nextTick(() => {
          if (this.ruleForm.imageUrl.length) {
            this.$refs.ruleForm.validateField('imageUrl', () => {})
          }
        })
      },
      immediate: false,
      deep: true
    },
    'ruleForm.passCondition': {
      handler() {
        this.$nextTick(() => {
          if (this.ruleForm.passCondition.length) {
            this.$refs.ruleForm.validateField('passCondition', () => {})
          }
        })
      },
      immediate: false,
      deep: true
    }
  },
  created() {
    this.uploadRef.forEach((ref) => {
      ref.beforeUpload = this[ref.beforeUpload]
    }),
      this.isdeleteData()
    this.isgetCourseTags()
    this.isgetCatalog()
    this.getInfo()
    this.islistTeacher()
    this.disabledBtn = false
    this.reflectionData = []
  },
  mounted() {
    this.$nextTick(() => {
      this.isdeleteData()
    })
  },
  activated() {
    // 检测断线重连
    window.addEventListener('online', () => {
      this.ruleForm.contents.map((c) => {
        if (!c.fileData) return
        const { status, hooks, observable } = c.fileData || {}
        if (status && status !== 'complete') {
          c.fileData.subscription = observable.subscribe(hooks)
        }
      })
    })
    this.isdeleteData()
    this.isgetCourseTags()
    this.isgetCatalog()
    this.getInfo()

    this.$refs.ruleForm.clearValidate()
    this.disabledBtn = false
    this.reflectionData = []
  },
  beforeRouteLeave(to, from, next) {
    to.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  methods: {
    // 讲师list
    async islistTeacher() {
      let id = this.ruleForm.teacherId
      let ini = 0
      let res = await listTeacher()
      this.TeacherData = res
      res.forEach((item) => {
        if (id == item.idStr) {
          ++ini
        }
      })
      if (ini === 0) {
        this.ruleForm.teacherId = ''
      }
    },
    selectVisibleChange(scope) {
      ++this.openChange
      if (this.openChange % 2 === 0) {
        this.chapterType = scope.row.type
      }
    },

    selectChange(scope) {
      if (scope.row.upLoad.length) {
        this.$confirm('切换类型是否需要清除内容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.ruleForm.contents[scope.$index].upLoad = []
            this.$message({
              type: 'success',
              message: '清除成功!'
            })
          })
          .catch(() => {
            this.ruleForm.contents[scope.$index].type = this.chapterType
            this.$message({
              type: 'info',
              message: '已取消清除'
            })
          })
      }
    },
    delReflectionData() {
      this.reflectionData = []
      this.ruleForm.thinkContent = ''
    },
    beforeTaskUpload() {},
    // 添加作业btn
    addTask() {
      let item = {
        sort: '', //序号
        type: 4, //章节类型
        name: '', // 章节名称
        localName: '', //文章标题
        url: '',
        content: '', //文章内容
        upLoad: [], //[url,localName],  //所有上传的文件
        saveOrcompile: 0, // 1保存&0编辑
        fileData: {},
        taskBtn: 'task'
      }
      this.ruleForm.contents.push(item)
    },
    // 添加课前思考
    addReflectionData() {
      let data = {
        url: '',
        localName: '', //章节类型为文章时，表示标题；章节内容为课件时，表示文件名
        sort: '', //序号
        type: '', //章节类型
        name: '', // 章节名称
        content: '', //文章内容
        upLoad: [], //[url,localName],  //所有上传的文件
        saveOrcompile: 0 // 1保存&0编辑
      }
      this.reflectionData.push(data)
    },
    typeChange(c) {
      if (c.type === 1) return
      c.upLoad = [{}]
      c.fileData = {}
    },
    checkUpload(file) {
      if (this.uploadingQueue.length >= 2) {
        if (!this.pendingQueue.includes(file)) {
          this.pendingQueue.push(file)
        }
        return true
      } else {
        this.uploadingQueue.push(file)
      }
      return false
    },
    onUploadPending(fileData, content, contentIdx) {
      fileData.status = 'pending'
      const contents = this.ruleForm.contents
      const spliceIdx = content ? contentIdx : contents.length
      const c = {
        saveOrcompile: 1,
        type: content ? content.type : 2,
        name: (content && content.name) || fileData.name || '社区的商业模式',
        upLoad: [
          {
            localName: fileData.name
            // fileSize: fileData.file.size // (fileData.file.size / 1024).toFixed(1) //大小单位KB
          }
        ],
        fileData
      }
      contents.splice(spliceIdx, 1, c)
    },
    onUploadProgress(fileData, content, contentIdx) {
      const contents = this.ruleForm.contents
      let index = contents.findIndex((c) => c.fileData.uid === fileData.uid)
      if (index < 0) {
        fileData.status = 'progress'
        fileData.paused = false
        const c = {
          taskBtn: content ? content.taskBtn : '',
          saveOrcompile: 1,
          type: content ? content.type : 2,
          name: (content && content.name) || fileData.name,

          upLoad: [
            {
              localName: fileData.name
            }
          ],
          fileData
        }
        const spliceIdx = content ? contentIdx : contents.length
        contents.splice(spliceIdx, 1, c)
      } else if (fileData.paused === undefined) {
        fileData.status = 'progress'
        fileData.paused = false
        const c = contents[index]
        c.upLoad = [{ localName: fileData.name }]
        c.fileData = fileData
        contents.splice(index, 1, c)
      }
    },
    onUploadComplete(file, url) {
      const contents = this.ruleForm.contents
      const content = contents.find((c) => c.fileData.uid === file.file.uid)
      content.upLoad[0].url = url
      content.upLoad[0].fileSize = (file.file.size / 1024).toFixed(1) //大小单位KB
      content.fileData.status = 'complete'
      if (contents.every((c) => c.fileData.status === 'complete') && contents.pending) {
        this.isAddCourse(contents.addStatus)
      }
      this.continueUploading(file)
    },
    controlUpload(index) {
      const content = this.ruleForm.contents[index]
      const { observable, subscription, hooks } = content.fileData
      const paused = (content.fileData.paused = !content.fileData.paused)
      // 继续上传
      if (!paused) {
        content.fileData.subscription = observable.subscribe(hooks)
      } else {
        // 暂停上传
        subscription.unsubscribe()
        if (this.pendingQueue.length) {
          content.fileData.status = 'pending'
          const file = this.uploadingQueue.find((f) => f.file.uid === content.fileData.uid)
          this.pendingQueue.unshift(file)
          this.continueUploading(file)
        }
      }
    },
    continueUploading(abortFile) {
      this.uploadingQueue.splice(this.uploadingQueue.indexOf(abortFile), 1)
      if (this.pendingQueue.length) {
        const f = this.pendingQueue.pop()
        const content = this.ruleForm.contents.find((c) => c.fileData.uid === f.file.uid)
        if (typeof content.fileData.paused === 'boolean') {
          content.fileData.paused = false
          const { observable, hooks } = content.fileData
          content.fileData.status = 'progress'
          content.fileData.subscription = observable.subscribe(hooks)
        } else {
          f.uploader.httpRequest(f)
        }
      }
    },
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
      const contents = this.ruleForm.contents
      if (contents.pending) return
      this.$refs.ruleForm.clearValidate()
      contents.forEach((c) => {
        if (!c.fileData) return
        if (!c.fileData.observable) return
        c.fileData.subscription.unsubscribe()
        c.fileData.observable = null
        c.fileData.subscription = null
        c.fileData.hooks = null
        c.fileData = null
        c = null
      })
      this.ruleForm.contents = []
      delete contents.status
      this.uploadingQueue = []
      this.pendingQueue = []
    },

    // 编辑页面的数据前
    // 编辑页面的数据后
    getInfo() {
      let id = this.$route.query.id
      if (!id) return
      getCourse({ courseId: id }).then((res) => {
        const {
          localName,
          url,
          introduction,
          // thinkContent,
          passCondition = '',
          contents,
          catalogId
        } = res
        res.passCondition = passCondition.split(',')
        res.contents = contents.map((c) => {
          const item = {}
          const { localName = '', content = '', name = '' } = c
          item.upLoad = [{ localName, content: _.unescape(content), name }]
          item.saveOrcompile = 1
          item.type = +c.type
          item.fileData = {}
          item.name = c.name
          item.fileSize = c.fileSize
          item.id = c.id
          return item
        })
        res.imageUrl = [{ localName, url }]
        this.catalogName = catalogId
        res.catalogId = this.$route.query.catalogName

        // 富方本回显
        if (introduction) {
          res.introduction = _.unescape(introduction)
        }
        // if (thinkContent) {
        //   res.thinkContent = _.unescape(thinkContent)
        // }

        // 课前思考数据回显处理
        let delIndex
        let thinkContentData
        res.contents.map((item, index) => {
          if (item.type == 5) {
            let data = {
              url: '',
              localName: '', //章节类型为文章时，表示标题；章节内容为课件时，表示文件名
              sort: '', //序号
              type: '', //章节类型
              name: item.name, // 章节名称
              content: '', //文章内容
              upLoad: [], //[url,localName],  //所有上传的文件
              saveOrcompile: 0 // 1保存&0编辑
            }
            if (!this.reflectionData.length) {
              this.reflectionData.push(data)
              delIndex = index
            }
            thinkContentData = item.upLoad[0].content
            res.contents.splice(delIndex, 1)
          }
        })
        this.ruleForm = res
        // 文章富文本回显
        res.contents.map((item, index) => {
          if (item.type == 1) {
            this.ruleForm.contents[index].upLoad[0].content = _.unescape(item.upLoad[0].content)
          }
        })
        this.ruleForm.thinkContent = _.unescape(thinkContentData)
        this.islistTeacher()
      })
    },

    // 拿到列表数据
    isgetCatalog() {
      queryCategoryOrgList({ source: 'course' }).then((res) => {
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
        ? _.unescape(row.upLoad[row.upLoad.length - 1].content)
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
            content: _.escape(this.addArticle.content)
          }
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
      const contents = this.ruleForm.contents
      // 还有正在上传的文件
      if (contents.some((item) => item.fileData.status === 'progress')) {
        // 提示
        const message =
          status === 2
            ? '正在上传附件，上传完成后将自动保存至草稿箱'
            : '正在上传附件，上传完成后将自动发布'
        this.$message({
          message,
          type: 'warning'
        })
        // 保存发布类型
        contents.addStatus = status
        // 设置标志位
        contents.pending = true
        return
      }

      delete contents.addStatus
      delete contents.pending
      let params = {}
      Object.keys(this.ruleForm).forEach((key) => {
        if (key === 'contents') return
        params[key] = this.ruleForm[key]
      })

      params.contents = contents.map((item) => {
        const n = {}
        Object.keys(item).forEach((key) => {
          if (key === 'fileData') return
          n[key] = item[key]
        })
        return n
      })
      params.contents.map((item, index) => {
        item.sort = index
        if (item.upLoad.length !== 0) {
          item.localName = item.upLoad[item.upLoad.length - 1].localName
          item.fileSize = item.upLoad[item.upLoad.length - 1].fileSize
          item.id = item.id || ''
          item.content =
            item.upLoad[item.upLoad.length - 1].url || item.upLoad[item.upLoad.length - 1].content
        }
        if (item.type == 1) {
          item.content = _.escape(item.content)
        }
      })
      params.localName = params.imageUrl[params.imageUrl.length - 1]
        ? params.imageUrl[params.imageUrl.length - 1].localName
        : ''
      params.url = params.imageUrl[params.imageUrl.length - 1]
        ? params.imageUrl[params.imageUrl.length - 1].url
        : ''

      delete params.imageUrl
      params.contents.forEach((item) => {
        delete item.upLoad
      })
      params.passCondition = params.passCondition ? params.passCondition.join(',') : ''
      // params.isRecommend = params.isRecommend === false ? 0 : 1
      params.catalogId =
        this.$route.query.catalogName == params.catalogId ? this.catalogName : params.catalogId
      // params.tagIds = params.tagIds.join(',')
      // 富文本要转换传后端
      params.introduction = _.escape(params.introduction)
      params.thinkContent = _.escape(params.thinkContent)

      // 查一下章节有没有内容 做一下校验
      let upIndexArr = []
      params.contents.map((item, index) => {
        if (item.content == '' || item.name == '' || item.type == '') {
          upIndexArr.push(index + 1)
        }
      })
      if (upIndexArr.length) {
        this.$message.error(`第${upIndexArr}条章节内容或有遗漏，请重新编辑或者删除该章节内容`)
      }
      if (upIndexArr.length) return
      // 把课前思考加入contents
      if ((this.reflectionData[0] ? this.reflectionData[0].name : false) || params.thinkContent) {
        params.contents.push({
          type: 5,
          name: this.reflectionData[0] ? this.reflectionData[0].name : '',
          content: params.thinkContent || ''
        })
      }
      delete params.thinkContent
      // console.log(params)
      // return
      // 草稿

      if (status === 2) {
        this.$confirm('您可以将草稿暂存在“草稿”分组下，可以再次编辑，是否保存草稿?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning'
        })
          .then(() => {
            params.status = status

            // 分类不管是不是草稿都要填
            if (!params.catalogId) {
              this.$message({
                message: '所在分类一定要填哦',
                type: 'warning'
              })
              return
            }

            // 判断是新增还是编辑
            if (this.$route.query.id) {
              editCourseInfo(params).then(() => {
                // editCourseInfo(this.ruleForm).then(() => {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.isdeleteData()
                this.$router.push({ path: '/course/courseDraft?status=' + status })
                this.disabledBtn = false
                // this.$router.go(-1)
              })
            } else {
              addCourse(params).then(() => {
                // editCourseInfo(this.ruleForm).then(() => {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.isdeleteData()
                this.$router.push({ path: '/course/courseDraft?status=' + status })
                this.disabledBtn = false
                // this.$router.go(-1)
              })
            }
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
            // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
            this.$refs.apprSubmit.validate().then((process) => {
              this.disabledBtn = true
              params.status = process ? 0 : 1

              // 判断是编辑还是新增
              if (this.$route.query.id) {
                editCourseInfo(params).then(({ id }) => {
                  // 如果没有任何审批流程可选则不需要经过审批
                  if (process) {
                    // 状态设置为审批中
                    this.submitApprApply(params.id ? params.id : id)
                  } else {
                    //发布成功清除数据
                    this.isdeleteData()
                    this.$message({
                      message: '课程发布成功',
                      type: 'success'
                    })
                    this.$router.back()
                  }
                })
              } else {
                addCourse(params).then(({ id }) => {
                  // 如果没有任何审批流程可选则不需要经过审批
                  if (process) {
                    // 状态设置为审批中
                    this.submitApprApply(params.id ? params.id : id)
                  } else {
                    //发布成功清除数据
                    this.isdeleteData()
                    this.$message({
                      message: '课程发布成功',
                      type: 'success'
                    })
                    this.$router.back()
                  }
                })
              }
            })
          }
        })
      }
    },
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.isAddCourse(1)
    },
    // 提交课程审批
    submitApprApply(courseId) {
      //创建课程  直接发布  给ruleForm 添加id,catalogName字段
      this.ruleForm.id = courseId
      this.ruleForm.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: courseId,
          processName: categoryMap['1'],
          formKey: 'CourseApplyInfo',
          // 课程标题
          formTitle: this.ruleForm.name,
          formData: JSON.stringify(this.ruleForm)
        })
        .then(() => {
          this.$message({
            message: '本课程已发布成功',
            type: 'success'
          })

          this.disabledBtn = false
          // this.$router.go(-1)
          this.$router.push({ path: '/course/courseDraft?status=' + status })
          //发布成功清除数据
          this.isdeleteData()
        })
    },
    // 清空数据
    isdeleteData() {},
    // 是否空文件
    isFileSize(file) {
      if (file.size === 0) {
        this.$message({
          message: '请不要上传空文件哦！',
          type: 'warning'
        })
        return true
      }
    },
    // 作业上传校验
    taskUpload(file) {
      if (this.isFileSize(file)) return false
      const isLt10M = file.size / 1024 / 1024 < 20
      if (!isLt10M) {
        this.$message.error('上传资料大小不能超过 20MB!')
        return false
      }
      return true
    },
    DataUpload(file) {
      if (this.isFileSize(file)) return false
      const regx = /^.*\.(doc|docx|wps|rtf|rar|zip|xls|xlsx|ppt|pptx|pdf)$/
      const regxtxt = /.*\.(txt)$/
      const isLt10M = file.size / 1024 / 1024 < 2048
      if (regxtxt.test(file.name)) {
        this.$message.error('不支持上传txt类型课件!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传资料大小不能超过 2GB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传资料只支持doc,docx,wps,rtf,rar,zip,xls,xlsx,ppt,pptx,pdf文件')
        return false
      }
      return true
    },
    // 视频校验
    VideoUpload(file) {
      if (this.isFileSize(file)) return false
      const regx = /^.*\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/
      const isLt10M = file.size / 1024 / 1024 < 2048

      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过 2GB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传视频只支持avi,wmv,mp4,3gp,rm,rmvb,mov文件')
        return false
      }
      return true
    },
    beforeAvatarUpload(file) {
      if (this.isFileSize(file)) return false
      const regx = /^.*\.(jpg|jpeg|png|bmp|JPG)$/
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg,jpeg,bmp,png文件')
        return false
      }
      return true
    },

    // 课件校验
    CoursewareUpload(file) {
      if (this.isFileSize(file)) return false
      const regx = /^.*\.(doc|docx|wps|rtf|xls|xlsx|ppt|pptx|pdf|avi|wmv|mp4|3gp|rm|rmvb|mov|jpg|bmp|jpeg|png)$/
      const regxImg = /^.*\.(jpg|jpeg|png|bmp)$/
      const regxtxt = /.*\.(txt)$/
      const isLt10M = file.size / 1024 / 1024 < 2048
      const isLtImg = file.size / 1024 / 1024 < 10
      if (regxtxt.test(file.name)) {
        this.$message.error('不支持上传txt类型课件!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 2GB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传资料仅支持上传视频、文档、ppt、pdf、图片五种类型的课件')
        return false
      }
      if (regxImg.test(file.name)) {
        if (!isLtImg) {
          this.$message.error('上传图片大小不能超过 10MB!')
          return false
        }

        return true
      }
      return true
    },
    // 1保存&0编辑btn
    saveOrcompileBtn() {},
    // 添加章节
    addArticleBtn() {
      let item = {
        sort: '', //序号
        type: 2, //章节类型
        name: '', // 章节名称
        localName: '', //文章标题
        url: '',
        content: '', //文章内容
        upLoad: [], //[url,localName],  //所有上传的文件
        saveOrcompile: 0, // 1保存&0编辑
        fileData: {}
      }
      this.ruleForm.contents.push(item)
    },
    setCheckboxVal() {
      // this.ruleForm.passCondition = this.checkboxVal
    },

    // 删除
    delContent(c, i) {
      this.ruleForm.contents.splice(i, 1)
      this.$message({
        message: '该章节已成功删除',
        type: 'success'
      })
      // 文章类型
      if (c.type === 1) return
      const uploadIndex = this.uploadingQueue.findIndex((file) => file.file.uid === c.fileData.uid)
      const pendingIndex = this.pendingQueue.findIndex((file) => file.file.uid === c.fileData.uid)
      if (uploadIndex > -1) this.uploadingQueue.splice(uploadIndex, 1)
      if (pendingIndex > -1) this.pendingQueue.splice(pendingIndex, 1)
      if (c.fileData.observable) {
        c.fileData.subscription.unsubscribe()
        c.fileData.observable = null
        c.fileData.subscription = null
        c.fileData.hooks = null
      }
      c.fileData = null
      c = null
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
/deep/.tox-tinymce {
  height: 480px !important;
}
::-webkit-scrollbar {
  display: none;
}
.establishCourse {
  color: #666666;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  overflow: -moz-scrollbars-none;

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
      width: 40%;
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
    // box-sizing: border-box;
    margin: 20px auto;
    background-color: #fff;
    width: 80%;
    padding: 10vh 13vw;
    #ruleForm {
      /deep/.el-input {
        width: 17vw;
      }
    }
  }

  /deep/.el-input-number {
    width: 17vw;
  }
  /deep/.el-input-number .el-input__inner {
    text-align: left;
  }
  .num_title {
    padding-bottom: 8px;
    span {
      display: inline-block;
      width: 55%;
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
    margin-left: -10vw;
    margin-top: -5vh;
    width: 60vw;
    padding-bottom: 5vh;
    .up_head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      margin-top: 50px;
      .upload-more {
        margin-right: 5px;
        display: inline-block;
      }
      &_title_btn {
        width: 330px;
        display: flex;
        justify-content: space-between;
      }
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
.reflection {
  &_title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
.reflection_content {
  border-top: 1px solid #ccc;
  margin: -25px -20px 0;
  padding: 20px;
}
.taskBtnBox {
  width: 93px;
  display: inline-block;
}
</style>
