<template>
  <div
    v-loading="isLoading"
    class="establishCourse"
  >
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
        <div
          :class="{ sign: headIndex === 3 }"
          class="schedule3"
          @click="headIndex = 3"
        >
          <i class="el-icon-s-tools"></i> 上传课程内容
        </div>
      </div>
      <div class="btns">
        <el-button
          v-if="isShowDraft"
          size="medium"
          @click="isAddCourse(2)"
        >
          存草稿
        </el-button>

        <el-button
          slot="reference"
          size="medium"
          type="primary"
          :disabled="disabledBtn"
          @click="isAddCourse(1)"
        >
          发布
        </el-button>
        <div
          v-if="tipsVisible"
          ref="tip"
          class="tip"
        >
          <div class="triangle"></div>
          <h3>信息不完善</h3>
          <p>以下信息不完善，修改后才能发布</p>
          <div
            v-if="toForm"
            class="tipText"
          >
            <span>填写课程信息</span><span>存在必填字段未填写</span><span @click="toRevise(1)">去修改</span>
          </div>
          <div
            v-if="toCourse"
            class="tipText"
          >
            <span>上传课程内容</span><span>存在章节内容缺失</span><span @click="toRevise(3)">去修改</span>
          </div>
        </div>
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
              label="课程编号"
              prop="courseNo"
            >
              <el-input
                v-model="ruleForm.courseNo"
                placeholder="请输入"
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="课程名称"
              prop="name"
            >
              <el-input
                v-model="ruleForm.name"
                placeholder="请输入"
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="讲师"
              prop="teacherId"
            >
              <el-select
                v-model="ruleForm.teacherId"
                v-loadmore="teacherLoadMore"
                filterable
                remote
                :remote-method="remoteTeacher"
                @visible-change="(flag) => visibleChange(flag, true)"
              >
                <el-option
                  v-for="(item, index) in TeacherData"
                  :key="index"
                  :value="item.idStr"
                  :label="item.name"
                />
                <el-option
                  v-show="flag.teacher.valve"
                  value="1"
                  class="loading"
                >
                  <i class="el-icon-loading"></i>加载中
                </el-option>
                <el-option
                  v-show="flag.teacher.noData"
                  value="1"
                  class="ending"
                >
                  {{ developerData.length === 0 ? '无数据' : '没有更多了' }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="授课方式"
              prop="type"
            >
              <el-select
                v-model="ruleForm.type"
                placeholder="请选择"
              >
                <el-option
                  label="在线"
                  :value="1"
                ></el-option>
                <el-option
                  label="面授"
                  :value="2"
                ></el-option>
                <el-option
                  label="直播"
                  :value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="课程分类"
              prop="catalogId"
            >
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
              prop="electiveType"
              label="选修类型"
            >
              <el-select
                v-model="ruleForm.electiveType"
                placeholder="请选择选修类型"
              >
                <el-option
                  label="开放选修"
                  :value="1"
                ></el-option>
                <!-- <el-option
                  label="通过审批"
                  :value="2"
                ></el-option> -->
                <el-option
                  label="禁止选修"
                  :value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="积分">
              <el-input-number
                v-model="ruleForm.credit"
                placeholder="请输入"
                controls-position="right"
                :min="0"
                :max="9999"
                :step="0.5"
                :precision="1"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item label="标准课时(分钟)">
              <el-input-number
                v-model="ruleForm.period"
                placeholder="请输入"
                controls-position="right"
                :min="0"
                :max="9999"
                :step="1"
                step-strictly
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="课程认证等级">
              <el-select v-model="ruleForm.grade">
                <el-option
                  label="初级"
                  :value="1"
                ></el-option>
                <el-option
                  label="中级"
                  :value="2"
                ></el-option>
                <el-option
                  label="高级"
                  :value="3"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item label="课程认证级别">
              <el-radio-group v-model="ruleForm.level">
                <el-radio :label="1">
                  公司级
                </el-radio>
                <el-radio :label="2">
                  单位级
                </el-radio>
                <el-radio :label="3">
                  部门级
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="开发费用">
              <el-input-number
                v-model="ruleForm.developCost"
                :min="0"
                :precision="2"
                controls-position="right"
                placeholder="请输入金额"
              />
              <span class="yen">&yen;</span>
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item label="课程开发人">
              <el-select
                v-model="ruleForm.developer"
                v-loadmore="founderLoadMore"
                filterable
                remote
                :remote-method="remoteFounder"
                @visible-change="(flag) => visibleChange(flag, false)"
              >
                <el-option
                  v-for="item in developerData"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
                <el-option
                  v-show="flag.founder.valve"
                  value="1"
                  class="loading"
                >
                  <i class="el-icon-loading"></i>加载中
                </el-option>
                <el-option
                  v-show="flag.founder.noData"
                  value="1"
                  class="ending"
                >
                  {{ developerData.length === 0 ? '无数据' : '没有更多了' }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="知识体系"
              prop="parentOrgId"
            >
              <el-tree-select
                ref="treeSelect"
                v-model="ruleForm.knowledgeSystemId"
                :select-params="column.props && column.props.selectParams"
                :tree-params="column.props && column.props.treeParams"
                v-bind="itemAttrs(column)"
                :placeholder="column.placeholder ? column.placeholder : `请选择${column.label}`"
                @node-click="nodeClick"
                @searchFun="searchTreeFun($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
          </el-col>
          <el-col :span="11">
            <el-form-item label="通过条件">
              <el-checkbox-group v-model="ruleForm.passCondition">
                <el-checkbox
                  label="c"
                  checked
                >
                  达到课程标准课时
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第七行 -->
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否推荐">
              <el-switch
                v-model="ruleForm.isRecommend"
                active-color="#198cff"
                inactive-color="#a0a8ae"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="课程封面"
              prop="url"
            >
              <common-upload
                class="upload-demo"
                drag
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
                @input="upLoadImg"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    只能上传jpg、jpeg、bmp、png文件，且不超过50MB
                  </div>
                </div>
                <img
                  v-if="ruleForm.url"
                  :src="ruleForm.url"
                  class="avatar"
                />
              </common-upload>
            </el-form-item>
          </el-col>
        </el-row>

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

      <!-- 上传课程内容 -->
      <div v-show="headIndex === 3">
        <div id="upContent">
          <div class="up_head">
            <span>章节内容
              <el-tooltip
                class="item"
                effect="dark"
                placement="top-start"
              >
                <div slot="content">
                  1.可根据章节类型添加内容；<br />
                  2.支持上传文档、ppt、pdf、图片和视频文件，视频文件大小不超过2G，其他文件不超过50M；<br />
                  3.资源下载是提供给学员的附件材料，学员可以在前端学习页面进行下载 。
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </span>
            <div class="up_head_title_btn">
              <el-button
                :disabled="ruleForm.contents.length >= 100"
                size="medium"
                @click="addTask"
              >
                添加作业
              </el-button>
              <common-upload
                v-model="fileList"
                class="upload-more"
                multiple
                need-handler
                :check-upload="checkUpload"
                :on-upload-complete="onUploadComplete"
                :on-upload-progress="onAllUploadProgress"
                :before-upload="CoursewareUpload"
                :limit="20"
                @on-pending="onUploadPending"
                @on-masterFileMax="masterFileMax"
                @input="upLoadSuc"
              >
                <el-button
                  :disabled="ruleForm.contents.length >= 100"
                  size="medium"
                >
                  批量上传课件
                </el-button>
              </common-upload>
              <el-button
                :disabled="ruleForm.contents.length >= 100"
                type="primary"
                size="medium"
                @click="addChapter"
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
                  v-model="scope.row.name"
                  placeholder="请输入内容"
                  maxlength="60"
                  show-word-limit
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
                <div v-if="!scope.row.taskBtn">
                  <el-select
                    v-model="scope.row.type"
                    placeholder="请选择"
                    :disabled="
                      !!(
                        scope.row.upLoad &&
                        scope.row.upLoad[0] &&
                        (scope.row.upLoad[0].url || scope.row.upLoad[0].content)
                      ) || scope.row.type === 4
                    "
                    @change="selectChange(scope)"
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
                </div>

                <div v-else>
                  <el-button
                    size="medium"
                    disabled
                  >
                    作业
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <!-- 第四列 -->
            <el-table-column
              prop="type"
              label="内容"
              width="250"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.type !== 1">
                  <span v-if="scope.row.fileData.status === 'pending'"> 等待上传... </span>
                  <el-progress
                    v-else-if="scope.row.fileData.status == 'progress'"
                    :percentage="scope.row.fileData.percent"
                    status="success"
                    text-inside
                    :stroke-width="18"
                    :color="scope.row.fileData.paused ? '#909399' : '#409eff'"
                  ></el-progress>
                  <common-upload
                    v-show="!scope.row.fileData.status || scope.row.fileData.status === 'complete'"
                    v-model="fileList"
                    need-handler
                    :on-upload-progress="
                      (fileData) => onUploadProgress(fileData, scope.row, scope.$index)
                    "
                    :check-upload="checkUpload"
                    :on-upload-complete="onUploadComplete"
                    :before-upload="beforeUpload"
                    :multiple="false"
                    @on-pending="(file) => onUploadPending(file, scope.row, scope.$index)"
                    @input="upLoadSuc"
                  >
                    <el-button
                      size="medium"
                      @click="chapterType = scope.row.type"
                    >
                      {{
                        tableColumnsText(
                          scope.row.type,
                          scope.row.upLoad && scope.row.upLoad[0] && scope.row.upLoad[0].content
                        )
                      }}
                    </el-button>
                  </common-upload>
                </div>
                <div v-else>
                  <el-button
                    size="medium"
                    @click="operation(scope.row, scope.$index)"
                  >
                    {{
                      tableColumnsText(
                        scope.row.type,
                        !!(scope.row.upLoad && scope.row.upLoad[0] && scope.row.upLoad[0].content)
                      )
                    }}
                  </el-button>
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
                  v-if="isQiNiu && scope.row.fileData.status === 'progress'"
                  type="text"
                  size="medium"
                  @click="controlUpload(scope.$index)"
                >
                  {{ scope.row.fileData.paused ? '继续' : '暂停' }}
                </el-button>
                <el-button
                  v-if="
                    scope.row.upLoad &&
                      scope.row.upLoad[0] &&
                      (scope.row.upLoad[0].url || scope.row.upLoad[0].content)
                  "
                  type="text"
                  size="medium"
                  @click="preview(scope.row)"
                >
                  预览
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
        </div>
      </div>
    </div>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      @submit="handleSubmit"
      @apprCancel="apprCancel"
    />
    <el-dialog
      title="添加文章"
      :visible="dialogVisible"
      width="60%"
      :modal-append-to-body="false"
      :show-close="false"
    >
      <el-form
        ref="ruleFormDialog"
        :model="addArticle"
        :rules="rulesDialog"
        label-width="60px"
        class="demo-ruleForm"
      >
        <div class="dialog_input">
          <el-form-item
            label="标题"
            prop="localName"
          >
            <el-input
              v-model="addArticle.localName"
              placeholder="请输入标题"
              maxlength="32"
              style="width: 480px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_tinymce">
          <el-form-item
            label="内容"
            prop="content"
          >
            <div>
              <tinymce
                id="tinymceId"
                v-model="addArticle.content"
                :init="{ selector: '#textarea1', placeholder: '在这里输入文字' }"
              ></tinymce>
            </div>
          </el-form-item>
        </div>
      </el-form>
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
    <div class="preview">
      <el-dialog
        :visible="showDialog"
        width="80%"
        title="章节预览"
        top="7vh"
        @close="close"
      >
        <video
          v-if="previewVideo"
          width="100%"
          height="100%"
          :src="previewVideo"
          autoplay
          controls
          controlsList="nodownload"
        ></video>
        <p
          v-if="previewHtml"
          v-html="previewHtml"
        ></p>
        <img
          v-if="previewImg"
          :src="previewImg"
          style="width: 100%"
        />
        <iframe
          v-if="perviewSrc"
          width="100%"
          height="100%"
          :src="perviewSrc"
          frameborder="0"
        ></iframe>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isQiNiu } from '@/config/env'
import { getReviewUrl } from '@/util/util'
import { categoryMap } from '@/const/approve'
import { getCourse, addCourse, listTeacher, editCourseInfo, id } from '@/api/course/course'
import { queryTeacherlist } from '@/api/lecturer/lecturer'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import { fileType } from '@/util/util'
import { defaultAttrs, noneItemAttrs } from '@/components/common-form/config'
import { relatedKnowledgeList } from '@/api/knowledge/knowledge'
export default {
  name: 'EstablishCourse',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload'),
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect'),
    ApprSubmit
  },
  data() {
    return {
      column: {
        label: '知识体系',
        itemType: 'treeSelect',
        prop: 'knowledgeSystemId',
        required: false,
        span: 11,
        offset: 1,
        props: {
          selectParams: {
            placeholder: '请选择知识体系',
            multiple: false
          },
          treeParams: {
            'check-strictly': true,
            'default-expand-all': false,
            'expand-on-click-node': false,
            clickParent: true,
            data: [],
            filterable: true,
            props: {
              children: 'children',
              label: 'name',
              value: 'id'
            }
          }
        }
      },
      isQiNiu,
      fileList: [],
      previewImg: '', // 图片预览路径
      previewHtml: '', // 富文本预览
      previewVideo: '', // 视频预览路径
      perviewSrc: '', // 文档预览路径
      word: /\.(ppt|pptx|doc|docx|xlsx|xls|pdf|wps|rtf)$/, // 文档格式
      video: /\.(avi|wmv|mp4|3gp|rm|rmvb|mov|flv)$/, // 视频格式
      image: /\.(jpg|jpeg|png|gif|bmp)$/, // 图片
      audio: /\.(mp3|wma|wav)$/, //
      toForm: false,
      toCourse: false,
      tipsVisible: false,
      courseNo: null,
      chapterType: 1,
      parentOrgIdLabel: '',
      disabledBtn: false,
      TeacherData: [],
      catalogIdoptions: [],
      checkboxVal: [],
      developerData: [],
      img: '',
      // 预览dialog
      showDialog: false,
      // 添加文章
      dialogVisible: false,
      addArticle: {
        localName: '',
        content: ''
      },
      // 页面切换
      headIndex: 1,
      type: null,
      // 上传课程内容章节类型
      typeOption: [
        {
          name: '视频',
          value: 5
        },
        {
          name: '文章',
          value: 1
        },
        {
          name: '资料下载',
          value: 3
        },
        {
          name: '作业',
          value: 4
        },
        {
          name: '文档',
          value: 2
        }
      ],
      isLoading: false,
      // 填写课程信息
      AddArticleBtntableIndex: '',
      ruleForm: {
        name: '',
        teacherId: '',
        type: '',
        catalogId: '',
        electiveType: '',
        credit: '',
        period: '',
        grade: '',
        level: '',
        developCost: '',
        developer: '',
        knowledgeSystemId: '',
        courseNo: '',
        passCondition: [],
        isRecommend: '',
        introduction: '',
        contents: [],
        url: null
      },
      rules: {
        courseNo: [
          { required: true, message: '请输入课程编号', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (this.courseNo && this.courseNo === this.ruleForm.courseNo) {
                return callback()
              } else {
                id({ courseNo: value })
                  .then(() => {
                    callback()
                  })
                  .catch(() => {
                    callback(new Error('课程编号重复'))
                  })
              }
            },
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入课程名称', trigger: ['blur', 'change'] }],
        teacherId: [{ required: true, message: '请输入讲师名称', trigger: ['blur', 'change'] }],
        catalogId: [{ required: true, message: '请选择所在分类', trigger: ['blur', 'change'] }],
        type: [{ required: true, message: '授课类型', trigger: ['blur', 'change'] }],
        electiveType: [{ required: true, message: '请选择选修类型', trigger: ['blur', 'change'] }],
        url: [{ required: true, message: '请选择课程封面', trigger: ['change'] }],
        introduction: [
          { required: true, message: '请书写课程介绍', trigger: ['blur', 'change'] },
          { max: 5000, message: '课程介绍最多不超过5000字', trigger: ['blur', 'change'] }
        ]
      },
      rulesDialog: {
        localName: [{ required: true, message: '请输入标题', trigger: ['blur'] }],
        content: [
          { required: true, message: '请输入文章内容', trigger: ['blur', 'change'] },
          { max: 5000, message: '课程介绍最多不超过5000字', trigger: ['blur', 'change'] }
        ]
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
      uploadingQueue: [],
      flag: {
        founder: {
          valve: false,
          noData: false
        },
        teacher: {
          valve: false,
          noData: false
        }
      },
      queryParams: {
        founder: {
          pageNo: 1,
          pageSize: 20,
          search: ''
        },
        teacher: {
          pageNo: 1,
          pageSize: 20,
          likeQuery: ''
        }
      }
    }
  },
  computed: {
    tableColumnsText() {
      return (type, is) => {
        let lang = ''
        if (is) {
          lang =
            type === 5
              ? '重新上传'
              : type === 1
              ? '修改文章'
              : type === 3
              ? '重新上传'
              : type === 4
              ? '修改作业'
              : type === 2
              ? '重新上传'
              : ''
        } else {
          lang =
            type === 5
              ? '上传视频'
              : type === 1
              ? '添加文章'
              : type === 3
              ? '上传资料'
              : type === 4
              ? '关联作业'
              : type === 2
              ? '上传文档'
              : ''
        }
        return lang
      }
    },
    isShowDraft() {
      console.log(this.$route)
      return !this.$route.query.id || this.$route.query.type === '2'
    }
  },
  watch: {
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
    }
  },
  created() {
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
    this.getSelectTeacher()
    this.isgetCatalog()
    this.getInfo()
    this.initRelatedKnowledgeList()
    this.disabledBtn = false
    document.body.addEventListener('click', this.bodyClick)
  },
  deactivated() {
    document.body.removeEventListener('click', this.bodyClick)
  },
  beforeRouteEnter(to, from, next) {
    from.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  destroyed() {
    document.body.removeEventListener('click', this.bodyClick)
  },
  methods: {
    searchTreeFun(data) {
      //   搜索需要指定一个treeKey，拿到对应的component，返回过滤后的值
      this.$refs.treeSelect.$refs.tree.filter(data)
      //   this.$refs.treeSelect.map((v, i) => {
      //     if (v.$attrs.treeKey == treeKey) {
      //       const searchTarget = _.get(this.$refs, `treeSelect[${i}].$refs.tree`)
      //       searchTarget.filter(data)
      //     }
      //   })
    },
    nodeClick(data) {
      this.ruleForm.knowledgeSystemId = data.id
    },
    itemAttrs(column) {
      const copy = { ...defaultAttrs[column.itemType] }
      for (const key in column) {
        if (!noneItemAttrs.includes(key)) {
          copy[key] = column[key]
        }
      }
      return copy
    },
    // 初始化知识体系列表
    initRelatedKnowledgeList() {
      //   各资源下的知识体系下拉框列表
      relatedKnowledgeList({ name: '' }).then((res) => (this.column.props.treeParams.data = res))
    },
    queryTeacherlist(params) {
      return queryTeacherlist(params)
    },
    founderLoadMore() {
      if (this.flag.founder.valve || this.flag.founder.noData) return
      this.flag.founder.valve = true
      this.queryParams.founder.pageSize += 20
      if (this.queryParams.founder.pageSize >= 500) this.queryParams.founder.pageNo++
      this.getSelectData()
    },
    teacherLoadMore() {
      if (this.flag.teacher.valve || this.flag.teacher.noData) return
      this.flag.teacher.valve = true
      this.queryParams.teacher.pageSize += 20
      if (this.queryParams.teacher.pageSize >= 500) this.queryParams.teacher.pageNo++
      this.getSelectTeacher()
    },
    // 下拉框数据获取
    getSelectData() {
      // 课程开发人
      queryTeacherlist(this.queryParams.founder).then((res) => {
        const length = this.developerData.length
        this.developerData.push(...res.data)
        this.developerData = _.uniqBy(this.developerData, 'userId')
        this.flag.founder.noData = length === this.developerData.length
        this.flag.founder.valve = false
      })
    },
    getSelectTeacher() {
      listTeacher(this.queryParams.teacher).then((res) => {
        const length = this.TeacherData.length
        this.TeacherData.push(...res)
        this.TeacherData = _.uniqBy(this.TeacherData, 'idStr')
        this.flag.teacher.valve = false
        this.flag.teacher.noData = length === this.TeacherData.length
      })
    },
    remoteFounder(v) {
      this.queryParams.founder.search = v.trim()
      this.queryParams.founder.pageSize = 20
      this.queryParams.founder.pageNo = 1
      this.developerData = []
      this.getSelectData()
    },
    remoteTeacher(v) {
      this.queryParams.teacher.likeQuery = v.trim()
      this.queryParams.teacher.pageSize = 20
      this.queryParams.teacher.pageNo = 1
      this.TeacherData = []
      this.getSelectTeacher()
    },
    visibleChange(show, flag) {
      if (show && (this.queryParams.teacher.likeQuery || this.queryParams.founder.search)) {
        flag ? (this.queryParams.teacher.likeQuery = '') : (this.queryParams.founder.search = '')
        flag ? this.getSelectTeacher() : this.getSelectData()
      }
    },
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
        fileData: {},
        isLoading: false,
        task: true
      }
      this.ruleForm.contents.push(item)
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
    toRevise(index) {
      this.headIndex = index
    },
    bodyClick(e) {
      if (this.tipsVisible && !e.path.includes(this.$refs.tip)) {
        this.tipsVisible = false
      }
    },
    // 图片上传成功
    upLoadImg(file) {
      this.img = file[0].localName
      this.ruleForm.url = file[0].url
      this.$refs.ruleForm.validateField('url')
    },
    onUploadPending(fileData, content, contentIdx) {
      fileData.status = 'pending'
      const contents = this.ruleForm.contents
      const spliceIdx = content ? contentIdx : contents.length
      const c = {
        saveOrcompile: 1,
        type: content ? content.type : 3,
        name: (content && content.name) || fileData.name || '社区的商业模式',
        upLoad: [
          {
            localName: fileData.name
          }
        ],
        fileData
      }
      contents.splice(spliceIdx, 1, c)
    },
    // 单个上传进度回调
    onUploadProgress(fileData, content, contentIdx) {
      const contents = this.ruleForm.contents
      let index = contents.findIndex((c) => c.fileData.uid === fileData.uid)
      const suffixIndex = fileData.name.lastIndexOf('.')
      let fileName = fileData.name.slice(0, suffixIndex)
      fileName = fileName.length > 60 ? fileName.substr(0, 60) : fileName
      if (index < 0) {
        fileData.status = 'progress'
        fileData.paused = false
        const c = {
          taskBtn: content ? content.taskBtn : '',
          saveOrcompile: 1,
          type: content ? content.type : 3,
          name: fileName,
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
        c.name = fileName
        contents.splice(index, 1, c)
      }
    },
    // 批量上传进度回调
    onAllUploadProgress(fileData, content, contentIdx) {
      let type = 2
      const contents = this.ruleForm.contents
      const suffixIndex = fileData.name.lastIndexOf('.')
      var judgeName = fileData.name.substr(suffixIndex).toLocaleLowerCase()
      var fileName = fileData.name.substr(0, suffixIndex)
      fileName = fileName.length > 60 ? fileName.slice(0, 60) : fileName
      let index = contents.findIndex((c) => c.fileData.uid === fileData.uid)
      if (index < 0) {
        if (this.video.test(judgeName)) type = 5
        fileData.status = 'progress'
        fileData.paused = false
        const c = {
          taskBtn: content ? content.taskBtn : '',
          saveOrcompile: 1,
          name: fileName,
          type,
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
        if (this.video.test(judgeName)) type = 5
        fileData.status = 'progress'
        fileData.paused = false
        const c = contents[index]
        c.upLoad = [{ localName: fileData.name }]
        c.fileData = fileData
        c.type = type
        c.name = fileName
        contents.splice(index, 1, c)
      }
    },
    onUploadComplete(file, url) {
      const contents = this.ruleForm.contents
      const content = contents.find((c) => c.fileData.uid === file.file.uid)
      content.upLoad[0].content = url
      content.upLoad[0].fileSize = (file.file.size / 1024).toFixed(1) //大小单位KB
      content.fileData.status = 'complete'
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
      this.$router.go(-1)
      const contents = this.ruleForm.contents
      if (contents.pending) return
      // this.$refs.ruleForm.clearValidate()
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
    // 上传前格式校验
    beforeUpload(file) {
      if (this.isFileSize(file)) return false
      if (this.chapterType === 5) return this.VideoUpload(file)
      else if (this.chapterType === 3) return this.DataUpload(file)
      else if (this.chapterType === 4) return this.DataUpload(file)
      else if (this.chapterType === 2) return this.fileUpload(file)
    },
    // 编辑页面的数据前
    // 编辑页面的数据后
    async getInfo() {
      const id = this.$route.query.id
      this.developerData = (await queryTeacherlist(this.queryParams.teacher)).data
      if (!id) return
      this.isLoading = true
      this.TeacherData = await listTeacher({
        pageSize: 9999999,
        pageNo: 1
      })
      getCourse({ courseId: id }).then((res) => {
        this.isLoading = false
        const { localName, url, introduction, passCondition = '', contents, catalogId } = res
        res.passCondition = passCondition === '' ? [] : passCondition.split(',')
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
        res.type = res.type ? res.type : ''
        res.electiveType = res.electiveType ? res.electiveType : ''
        this.ruleForm = res
        // 文章富文本回显
        res.contents.map((item, index) => {
          if (item.type == 1) {
            this.ruleForm.contents[index].upLoad[0].content = _.unescape(item.upLoad[0].content)
          }
        })
        this.courseNo = this.ruleForm.courseNo
        let ini = 0
        for (const key of this.TeacherData) {
          if (key.idStr == this.ruleForm.teacherId) {
            ini = 1
            break
          }
        }
        if (ini === 0) {
          this.ruleForm.teacherId = ''
        }
        // 导入回显创建人
        if (this.developerData.some((item) => item.userId !== res.developer))
          this.developerData.push({
            name: res.developerName,
            userId: res.developer
          })
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

    //添加章节内容
    operation(data, index) {
      if (data.type === 1) {
        this.addArticle.localName = data.upLoad[0] ? data.upLoad[0].localName : ''
        this.addArticle.content = data.upLoad[0] ? _.unescape(data.upLoad[0].content) : ''
        this.AddArticleBtntableIndex = index
        this.dialogVisible = true
      }
    },
    // 添加文章
    isAddArticle() {
      this.$refs.ruleFormDialog.validate((valid) => {
        if (valid) {
          let i = {
            localName: this.addArticle.localName,
            content: _.escape(this.addArticle.content)
          }
          this.ruleForm.contents[this.AddArticleBtntableIndex].upLoad = [i]
          this.addArticle.localName = ''
          this.addArticle.content = ''
          this.dialogVisible = false
        }
      })
    },

    // 发布&草稿
    isAddCourse(status) {
      const contents = this.ruleForm.contents
      // 还有正在上传的文件
      if (contents.some((item) => item.fileData.status === 'progress')) {
        // 提示
        const message =
          status === 2 ? '正在上传附件，暂时无法进行存草稿' : '正在上传附件，暂时无法进行发布.'
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
      this.isLoading = true
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
      params.localName = this.img
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
      // return
      // 草稿

      if (status === 2) {
        params.status = status
        if (!params.catalogId) {
          this.$message({
            message: '所在分类一定要填哦',
            type: 'warning'
          })
          this.isLoading = false
          this.toForm = true
          setTimeout(() => {
            this.tipsVisible = true
          }, 500)
          return
        }
        // 判断是新增草稿还是编辑草稿
        if (this.$route.query.id) {
          editCourseInfo(params).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.push({ path: '/course/courseDraft?status=' + status })
            this.disabledBtn = false
            this.isLoading = false
          })
        } else {
          addCourse(params).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.push({ path: '/course/courseDraft?status=' + status })
            this.disabledBtn = false
            this.isLoading = false
          })
        }
      }
      if (status === 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (!valid) {
            let upIndexArr = []
            params.contents.map((item, index) => {
              if (item.content == '' || item.name == '' || item.type == '') {
                upIndexArr.push(index + 1)
              }
            })
            if (upIndexArr.length) {
              setTimeout(() => {
                this.$message.error(
                  `第${upIndexArr}条章节内容或有遗漏，请重新编辑或者删除该章节内容`
                )
              }, 200)
              this.toCourse = true
              setTimeout(() => {
                this.tipsVisible = true
              }, 200)
            }

            this.$message({
              message: '信息填写不完整',
              type: 'warning'
            })
            setTimeout(() => {
              this.tipsVisible = true
              this.isLoading = false
            }, 200)
            this.toForm = true
          } else {
            // 查一下章节有没有内容 做一下校验
            let upIndexArr = []
            params.contents.map((item, index) => {
              if (item.content == '' || item.name == '' || item.type == '') {
                upIndexArr.push(index + 1)
              }
            })
            if (upIndexArr.length) {
              this.$message.error(`第${upIndexArr}条章节内容或有遗漏，请重新编辑或者删除该章节内容`)
              this.toCourse = true
              setTimeout(() => {
                this.tipsVisible = true
                this.isLoading = false
              }, 200)
              return
            }
            this.tipsVisible = false
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
                    this.isLoading = false
                  } else {
                    //发布成功清除数据
                    // this.isdeleteData()
                    this.$message({
                      message: '课程发布成功',
                      type: 'success'
                    })
                    this.$router.back()
                    this.isLoading = false
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
                    // this.isdeleteData()
                    this.$message({
                      message: '课程发布成功',
                      type: 'success'
                    })
                    this.$router.back()
                    this.isLoading = false
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
    // 审批组件取消事件
    apprCancel() {
      this.isLoading = false
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
          // this.isdeleteData()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
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
    // 文件校验
    DataUpload(file) {
      if (this.isFileSize(file)) return false
      const fileName = file.name.toLocaleLowerCase()
      if (this.video.test(fileName) || this.audio.test(fileName)) {
        if (file.size / 1024 / 1024 / 1024 > 2) {
          this.$message.error('视频或音频文件大小不能超过2GB')
          return false
        }
      } else if (file.size / 1024 / 1024 > 50) {
        this.$message.error('文档、音频、图片、压缩文件大小不能超过50M')
        return false
      }
    },
    // 视频校验
    VideoUpload(file) {
      if (this.isFileSize(file)) return false
      const fileName = file.name.toLocaleLowerCase()
      if (file.size / 1024 / 1024 / 1024 > 2) {
        this.$message.error('上传视频大小不能超过 2GB!')
        return false
      }
      if (!this.video.test(fileName)) {
        this.$message.error('上传视频仅支持avi,wmv,mp4,3gp,rm,rmvb,mov,flv文件')
        return false
      }
    },
    // 图片校验
    beforeAvatarUpload(file) {
      if (this.isFileSize(file)) return false
      const fileName = file.name.toLocaleLowerCase()
      const imgae = /\.(jpg|jpeg|png|bmp)$/
      if (!imgae.test(fileName)) {
        this.$message.error('只能上传jpg、jpeg、bmp、png文件')
        return false
      }
      if (file.size / 1024 / 1024 > 50) {
        this.$message.error('上传图片大小不能超过50M!')
        return false
      }
    },
    // 批量校验
    CoursewareUpload(file) {
      if (this.isFileSize(file)) return false
      const fileName = file.name.toLocaleLowerCase()
      if (this.video.test(fileName)) {
        if (file.size / 1024 / 1024 / 1024 > 2) {
          setTimeout(() => {
            this.$message({
              message: '视频文件大小不能超过2GB',
              type: 'error'
            })
          }, 200)
          return false
        }
      } else if (this.word.test(fileName) || this.image.test(fileName)) {
        if (file.size / 1024 / 1024 > 50) {
          setTimeout(() => {
            this.$message({
              message: '文档、图片文件大小不能超过50M',
              type: 'error'
            })
          }, 200)
          return false
        }
      } else {
        setTimeout(() => {
          this.$message({
            message: '上传课件仅支持上传视频、文档、图片三种类型的课件',
            type: 'error'
          })
        }, 200)
        return false
      }
    },
    // 上传文件数量超出
    masterFileMax() {
      this.$message.error('上传文件数不能超过20个')
    },
    // 文档上传校验
    fileUpload(file) {
      const fileName = file.name.toLocaleLowerCase()
      if (this.isFileSize(file)) return false
      if (this.word.test(fileName) || this.image.test(fileName)) {
        if (file.size / 1024 / 1024 > 50) {
          this.$message.error('上传文档或图片大小不能超过50M')
          return false
        }
        return true
      } else {
        this.$message.error('上传文档仅支持文档、图片文件')
        return false
      }
    },
    // 添加章节
    addChapter() {
      let item = {
        url: '',
        sort: this.ruleForm.contents.length, //序号
        localName: '', //章节标题用于请求
        type: 5, //章节类型
        name: '', // 章节名称
        content: '', //文章内容
        upLoad: [], //[url,localName],  //所有上传的文件
        isContent: false, //是否添加内容
        fileData: {}
      }
      this.ruleForm.contents.push(item)
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
    },
    // 章节类型切换
    selectChange(data) {
      this.ruleForm.contents[data.$index].upLoad = []
    },
    //上传成功后调用预览(前台预览需求)
    async upLoadSuc(flie) {
      this.fileList = []
      let type = 0
      const name = flie[0].localName.toLowerCase()
      const url = flie[0].fileUrl
      const { flag } = fileType(name)
      if (/pdf$/.test(name)) {
        type = 20
      } else if (flag === 1) {
        type = 0
      }
      await getReviewUrl({
        isDownloa: 0,
        isShowTitle: 0,
        isPrint: 0,
        isCopy: 1,
        htmlName: name,
        convertType: type,
        fileUrl: url
      })
    },
    // 预览dialogfile
    async preview(flie) {
      // 预览
      const name = flie.upLoad[0].localName.toLowerCase()
      const url = flie.upLoad[0].content
      const { flag } = fileType(name)
      if (/\.pdf$/.test(name)) {
        this.type = 20
      } else if (flag === 0) {
        this.previewVideo = url
        this.showDialog = true
        return
      } else if (flag === 2) {
        this.previewImg = url
        this.showDialog = true
        return
      } else if (flag === 1) {
        this.type = 0
      } else if (url && flie.type === 1) {
        this.previewHtml = `<h2>${
          flie.upLoad[0].localName
        }</h2><p style="padding-left:20px;">${_.unescape(url)}</p>`
        this.showDialog = true
        return
      } else {
        this.$message.warning('该文件类型暂不支持预览')
        return
      }

      let { data } = await getReviewUrl({
        isDownloa: 0,
        isShowTitle: 0,
        isPrint: 0,
        isCopy: 1,
        htmlName: flie.upLoad[0].localName,
        convertType: this.type,
        fileUrl: url
      })
      this.perviewSrc = data.data.viewUrl
      this.showDialog = true
    },
    close() {
      this.previewVideo = ''
      this.perviewSrc = ''
      this.previewImg = ''
      this.previewHtml = ''
      this.showDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
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
      display: flex;
      position: absolute;
      right: 10px;
      span {
        margin-left: 20px;
      }
    }
    .schedule {
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
.preview {
  ::v-deep .el-dialog__body {
    height: 80vh;
    overflow-y: auto;
  }
}
.yen {
  position: absolute;
  top: 40px;
  left: 5px;
}
.triangle {
  position: absolute;
  top: -10px;
  right: 21px;
  width: 0;
  height: 0;
  border-bottom: 10px solid #fff;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
.tip {
  position: absolute;
  right: -8px;
  top: 49px;
  background-color: #fff;
  width: 385px;
  padding: 15px;
  border: 1px solid #ccc;
  z-index: 999;
  h3,
  p {
    margin: 0;
    margin-bottom: 10px;
  }
  .tipText {
    display: flex;
    font-size: 14px;
    margin-top: 15px;
    background-color: #f2f2f2;
    line-height: 38px;
    padding-right: 15px;
    span:first-child {
      color: #000;
    }
    span:nth-child(2) {
      color: #c4c4c4;
      flex: 1;
    }
    span:last-child {
      cursor: pointer;
      color: #61b8fa;
    }
    span {
      flex-shrink: 0;
    }
  }
}
.loading {
  text-align: center;
  color: #ccc;
  pointer-events: none;
  i {
    margin-right: 10px;
  }
}
.ending {
  text-align: center;
  color: #ccc;
  pointer-events: none;
}
</style>
