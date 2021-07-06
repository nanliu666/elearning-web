<template>
  <el-form
    ref="form"
    class="training-edit-config"
    :model="form"
    :rules="rules"
    label-position="top"
  >
    <div class="form-area-title">
      <span>基础信息</span>
    </div>
    <el-form-item
      label="培训名称"
      prop="trainName"
      class="half-form-item margin-right-120"
    >
      <el-input
        v-model="form.trainName"
        :readonly="isUnderwayEdit"
        :maxlength="32"
        placeholder="请输入"
        clearable=""
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="categoryId"
      class="half-form-item slot-form-item"
    >
      <div
        slot="label"
        class="slot-item-header"
      >
        <span class="label-name">分类</span>
        <el-button
          style="padding: 0;"
          type="text"
          @click.native="toCategory"
        >
          分类管理
        </el-button>
      </div>
      <el-cascader
        ref="categoryCascader"
        v-model="form.categoryId"
        :disabled="isUnderwayEdit"
        filterable
        :filter-method="handleCategoryFilter"
        style="width: 100%"
        placeholder="请选择所在分类"
        :options="categoryData"
        :props="{ checkStrictly: true, label: 'name', value: 'id' }"
        :show-all-levels="false"
        clearable
        @change="handleCategoryChange"
      ></el-cascader>
    </el-form-item>

    <el-form-item
      class="half-form-item margin-right-120"
      label="培训时间"
      prop="trainTime"
    >
      <el-date-picker
        v-model="form.trainTime"
        :disabled="isUnderwayEdit"
        :default-time="['00:00:00', '23:59:59']"
        style="width: 100%;"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="截止日期"
        :picker-options="pickerOptions"
      />
    </el-form-item>

    <el-form-item
      label="知识体系"
      prop="knowledgeSystemId"
      class="half-form-item"
    >
      <tree-selector
        v-model="form.knowledgeSystemId"
        :disabled="isUnderwayEdit"
        style="width: 100%;"
        class="selector"
        :options="knowledgeData"
        placeholder="请选择"
        :props="selectorProps"
        @focus="getKnowledgeData"
      />
    </el-form-item>

    <el-form-item
      class="half-form-item margin-right-120"
      label="培训类型"
      prop="trainType"
    >
      <el-select
        v-model="form.trainType"
        :disabled="isUnderwayEdit"
        placeholder="请选择"
        style="width: 100%;"
      >
        <el-option
          v-for="option in trainTypeOptions"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      class="half-form-item"
      label="培训方式"
      prop="trainWay"
    >
      <el-radio-group
        v-model="form.trainWay"
        :disabled="isUnderwayEdit"
      >
        <el-radio
          v-for="radio in trainWayRadios"
          :key="radio.value"
          :label="radio.value"
        >
          {{ radio.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="type == 'outer'"
      label="培训机构"
      prop="organizer"
      class="half-form-item margin-right-120"
    >
      <el-input
        v-model="form.organizer"
        :readonly="isUnderwayEdit"
        :maxlength="32"
        placeholder="请输入"
        clearable=""
      ></el-input>
    </el-form-item>

    <el-form-item
      v-if="form.trainWay != '1'"
      label="培训地点"
      prop="address"
      class="half-form-item"
      :class="{ 'margin-right-120': type === 'inside' }"
    >
      <el-input
        v-model="form.address"
        :readonly="isUnderwayEdit"
        :maxlength="32"
        placeholder="请输入"
        clearable=""
      ></el-input>
    </el-form-item>

    <el-form-item
      label="项目经理"
      prop="headTeacher"
      class="half-form-item"
      :class="{ 'margin-right-120': type === 'outer' || form.trainWay === '1' }"
    >
      <lazy-select
        v-model="form.headTeacher"
        :disabled="isUnderwayEdit"
        :remote-method="getUserList"
        :props="{ value: 'userId', label: 'name' }"
        :init-options="headTeacherOptions"
        @getSelected="(data) => (form.contactPhone = data.phonenum)"
      />
    </el-form-item>

    <el-form-item
      label="手机号码"
      prop="contactPhone"
      class="half-form-item"
    >
      <el-input
        v-model="form.contactPhone"
        :readonly="isUnderwayEdit"
        :maxlength="32"
        placeholder="请输入"
        clearable=""
      ></el-input>
    </el-form-item>

    <div class="form-area-title">
      详细信息
    </div>

    <el-form-item
      v-if="type == 'inside'"
      label="计入积分"
      prop="asqScore"
      class="half-form-item margin-right-120"
    >
      <el-input-number
        v-model="form.scoreGet"
        :disabled="isUnderwayEdit"
        :step="1"
        :min="0"
        type="number"
        controls-position="right"
        style="width: 100%;"
        placeholder="请输入"
      />
    </el-form-item>

    <el-form-item
      label="计划人数"
      prop="people"
      class="half-form-item"
      :class="{ 'margin-right-120': type == 'outer' }"
    >
      <el-input-number
        v-model="form.people"
        :disabled="isUnderwayEdit"
        :precision="0"
        :min="0"
        type="number"
        controls-position="right"
        style="width: 100%;"
        placeholder="请输入"
      />
    </el-form-item>

    <el-form-item
      prop="costBudget"
      class="half-form-item slot-form-item"
      :class="{ 'margin-right-120': type === 'inside' }"
    >
      <div
        slot="label"
        class="slot-item-header"
      >
        <span class="label-name">费用预算</span>
        <span v-if="form.people && form.costBudget">人均费用：￥{{ cost }}</span>
      </div>
      <el-input-number
        v-model="form.costBudget"
        :disabled="isUnderwayEdit"
        class="coin"
        :precision="1"
        :step="0.5"
        :min="0"
        type="number"
        controls-position="right"
        style="width: 100%;"
        placeholder="请输入金额"
      >
      </el-input-number>
    </el-form-item>

    <el-form-item
      label="授课对象"
      class="half-form-item"
      :class="{ 'margin-right-120': type == 'outer' }"
    >
      <el-select
        v-model="form.teachingObject"
        style="width: 100%;"
        placeholder="请选择"
        :disabled="isUnderwayEdit"
      >
        <el-option
          v-for="option in [
            { label: '干部', value: 1 },
            { label: '后备干部', value: 2 },
            { label: '技术人员', value: 3 },
            { label: '技能人员', value: 4 },
            { label: '营销人员', value: 5 },
            { label: '管理人员', value: 6 },
            { label: '新入职/转岗', value: 7 }
          ]"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="公开报名"
      prop="applyJoin"
      class="half-form-item slot-form-item"
      :class="{ 'margin-right-120': type == 'inside' }"
    >
      <div
        slot="label"
        class="slot-item-header"
      >
        <span class="label-name">公开报名</span>
        <el-switch
          v-model="form.applyJoin"
          :disabled="isUnderwayEdit"
        />
      </div>
      <el-select
        v-model="form.applyJoinValue"
        style="width: 100%;"
        placeholder="请选择"
        :disabled="!form.applyJoin || isUnderwayEdit"
      >
        <el-option
          v-for="option in [
            { label: '审批通过', value: 'approval' },
            { label: '自动通过', value: 'automatic' }
          ]"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="form.applyJoin"
      label="报名截止日期"
      prop="date"
      class="half-form-item"
    >
      <el-date-picker
        v-model="form.applyJoinEndDate"
        :disabled="isUnderwayEdit"
        :picker-options="applyPickerOptions"
        style="width: 100%;"
        type="date"
        size="medium"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item
      v-if="type == 'inside'"
      label="发放证书"
      prop="signin"
      class="half-form-item slot-form-item margin-right-120"
    >
      <div
        slot="label"
        class="slot-item-header"
      >
        <span class="label-name">发放证书</span>
      </div>
      <lazy-select
        v-model="form.certificateId"
        :disabled="isUnderwayEdit"
        :remote-method="getCertificateList"
        :props="{ label: 'name', value: 'id' }"
      ></lazy-select>
    </el-form-item>

    <el-form-item
      v-if="type == 'inside'"
      class="half-form-item"
      label="评估功能"
      prop="evaluationType"
    >
      <el-checkbox-group
        v-model="form.evaluationType"
        :disabled="isUnderwayEdit"
      >
        <el-checkbox :label="1">
          整体满意度评估（默认）
        </el-checkbox>
        <el-checkbox :label="2">
          自定义问卷
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-if="type === 'inside' && form.evaluationType.includes(2)"
      label="选择评估问卷"
      prop="asqId"
      class="half-form-item"
    >
      <lazy-select
        v-model="form.asqId"
        :disabled="isUnderwayEdit"
        :remote-method="querySubject"
        :props="{ value: 'id', label: 'asqName' }"
        @getSelected="
          (data) => {
            form.questionCategoryId = data.categoryId
            form.questionCategoryName = data.categoryName
          }
        "
      />
    </el-form-item>

    <el-form-item
      style="display: block;"
      label="培训封面"
      prop="cover"
      class="half-form-item"
    >
      <common-upload
        drag
        :disabled="isUnderwayEdit"
        :show-file-list="false"
        :before-upload="beforeCoverUpload"
        :multiple="false"
        accept=".jpg,.jpeg,.bmp,.png"
        @getFile="handleUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          点击或者拖拽附件到此区域
          <div
            slot="tip"
            class="el-upload__tip"
          >
            上传的图片格式要求jpg、jpeg、bmp、png，大小不超过10M
          </div>
        </div>

        <div
          v-if="form.coverPic"
          style="background-color: #fff; position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
        >
          <img
            :src="form.coverPic"
            width="100%"
            height="100%"
          />
        </div>
      </common-upload>
    </el-form-item>

    <el-form-item
      prop="introduction"
      style="display: block; margin-bottom: 0;"
      label="培训内容"
    >
      <tinymce
        ref="tinymce"
        v-model="form.introduction"
        plugins="link lists code table colorpicker textcolor contextmenu image imagetools"
        :other-options="tinymceOption"
        :toolbar="tinymceToolbar"
        :height="450"
      />
      <div style="float: right; color: #ccc">
        {{ wordCount + ' 字' }}
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import lazySelect from '@/components/el-lazy-select'
import { getCreatorList } from '@/api/live'
import { querySubject } from '@/api/questionnaire'
import { getOrgUserList } from '@/api/system/user'
import { getCategoryTree } from '@/api/train/train'
import { getCertificateList } from '@/api/certificate/certificate'
import TreeSelector from '@/components/tree-selector'
import toolbar from '@/components/tinymce/src/toolbar'
export default {
  name: 'TrainingEditConfig',
  components: {
    TreeSelector,
    lazySelect,
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  props: {
    isUnderwayEdit: {
      type: Boolean,
      default: false
    },
    headTeacherOptions: {
      type: Array,
      default() {
        return []
      }
    },
    trainWayRadios: {
      type: Array,
      default() {
        return []
      }
    },
    trainTypeOptions: {
      type: Array,
      default() {
        return []
      }
    },
    form: {
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'inside'
    }
  },
  data() {
    return {
      tinymceOption: {},
      tinymceToolbar: toolbar,
      selectorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      knowledgeData: [],
      pickerOptions: {
        disabledDate(date) {
          const now = new Date()
          const d = new Date(date)
          return (
            d < now &&
            !(
              d.getFullYear() === now.getFullYear() &&
              d.getMonth() === now.getMonth() &&
              d.getDate() === now.getDate()
            )
          )
        }
      },
      applyPickerOptions: {},
      TiLength: 0,
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      categoryData: [],
      rules: {
        trainName: [{ trigger: 'blur', message: '请输入培训名称', required: true }],
        contactPhone: [
          { trigger: ['change', 'blur'], message: '请输入手机号码', required: true },
          {
            trigger: 'blur',
            message: '请输入正确的手机号码',
            validator: (_, value, callback) => {
              if (/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
                callback()
              } else {
                callback(new Error('请输入正确的手机号码'))
              }
            },
            required: true
          }
        ],
        introduction: [{ trigger: 'blur', message: '请输入培训内容', required: true }],
        organizer: [{ trigger: 'blur', message: '请输入培训机构', required: true }],
        categoryId: [{ trigger: 'change', message: '请选择分类', required: true }],
        trainTime: [{ trigger: 'change', message: '请选择培训时间', required: true }],
        trainWay: [{ trigger: 'change', message: '请选择培训形式', required: true }],
        trainType: [{ trigger: 'change', message: '请选择培训类型', required: true }],
        asqId: [{ trigger: 'change', message: '请选择评估问卷', required: true }],
        headTeacher: [{ trigger: 'change', message: '请选择项目经理', required: true }]
      },
      wordCount: 0
    }
  },
  computed: {
    cost() {
      const { costBudget, people } = this.form
      const result = (costBudget / people).toFixed(1)
      return +result
    }
  },
  watch: {
    'form.categoryId'() {
      this.$refs.form.validateField('categoryId')
    },
    'form.evaluationType'(types) {
      if (!types.includes(2)) {
        this.form.asqId = ''
      }
    },
    'form.introduction'() {
      this.handleWordCount()
    },
    isUnderwayEdit(val) {
      if (val) {
        this.disableTinymce()
      }
    }
  },
  created() {
    const that = this
    this.tinymceOption = {
      paste_auto_cleanup_on_paste: true,
      paste_remove_styles: true,
      paste_remove_styles_if_webkit: true,
      paste_strip_class_attributes: true,
      setup: function(editor) {
        that.editor = editor
        editor.on('change input keyup init', function() {
          if (editor.composition) return
          that.handleWordCount()
        })
        editor.on('compositionstart', function() {
          editor.composition = true
        })
        editor.on('compositionend', function() {
          if (!editor.composition) {
            return
          }
          editor.composition = false
          that.handleWordCount()
        })
      }
    }
    this.applyPickerOptions = {
      disabledDate(_date) {
        const trainTime = that.form.trainTime
        const [, endTime] = trainTime
        let date = new Date(_date)
        let now = new Date()
        const end = new Date(endTime)
        return (
          (date < now &&
            !(
              date.getFullYear() == now.getFullYear() &&
              date.getMonth() == now.getMonth() &&
              date.getDate() == now.getDate()
            )) ||
          date > end
        )
      }
    }
    this.rules.introduction.push({
      validator: (_, value, callback) => {
        if (this.wordCount > 5000) {
          callback(new Error('培训介绍最多不超过5000字'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    })
    if (this.isUnderwayEdit) {
      this.disableTinymce()
    }
    this.getData()
  },
  methods: {
    disableTinymce() {
      const fn = () => {
        this.tinymceOption.readonly = 1
        this.tinymceOption.menubar = false
        this.tinymceOption.statusbar = false
        this.tinymceOption.toolbar = false
        this.tinymceOption.mode = 'textareas'
        this.tinymceToolbar = []
        this.$nextTick(() => {
          this.editor.getBody().setAttribute('contenteditable', false)
          this.editor.editorContainer.querySelector('.tox-editor-header').style.display = 'none'
          this.editor.editorContainer.querySelector('.tox-statusbar').style.display = 'none'
          this.$refs.tinymce.$forceUpdate()
        })
      }

      this.timer = setTimeout(() => {
        if (this.editor && this.editor.getBody()) {
          fn()
        } else {
          this.disableTinymce()
        }
        clearTimeout(this.timer)
        this.timer = null
      }, 500)
    },
    handleWordCount() {
      if (!this.editor) {
        return
      }

      if (this.editor.composition) return
      const contentEl = this.editor.contentDocument
      if (!contentEl) return
      const { activeElement: el } = contentEl
      const imgRegExp = /(<img\s+[^>]*>)/g
      let img = el.innerHTML.match(imgRegExp) || []
      const text = el.innerHTML.replace(/<\/?[^<>]+>/g, '')
      this.wordCount = img.length + text.length
    },
    handleCategoryFilter(_, keyword) {
      this.getCategoryData(keyword)
    },
    handleCategoryChange(data) {
      if (!data) return
      this.form.categoryId = data[data.length - 1]
      if (this.$refs.categoryCascader) {
        this.$refs.categoryCascader.dropDownVisible = false
      }
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleUpload(file) {
      this.form.coverPic = file.fileUrl
    },
    beforeCoverUpload(file) {
      const regx = /^.*\.(jpg|jpeg|bmp|png)$/
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
    getUserList(params) {
      return getOrgUserList(Object.assign(params, { orgId: 0 }))
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid, obj) => {
          if (valid) {
            resolve(valid)
          } else {
            for (let key in obj) {
              const message = obj[key][0].message
              resolve(message)
            }
          }
        })
      })
    },
    getKnowledgeData() {
      getCreatorList({ source: 'knowledgeSystem' }).then((res) => {
        this.knowledgeData = res
      })
    },
    onEditorChange(event) {
      const { quill } = event
      if (quill.root.composing) return
      quill.deleteText(2000, 1)
      if (this.form.introduction.length === 0) {
        this.TiLength = 0
      } else {
        this.TiLength = quill.getLength() - 1
      }
      this.$refs.form.validateField('introduction')
    },
    getData() {
      this.getCategoryData()
      this.getKnowledgeData()
      this.handleWordCount()
    },
    getCertificateList(params) {
      return getCertificateList(Object.assign(params))
    },
    toCategory() {
      const routeData = this.$router.resolve({
        path: '/training/catalog'
      })
      window.open(routeData.href, '_blank')
    },
    querySubject(params) {
      return querySubject(params)
    },
    getCategoryData(search) {
      const params = {}
      if (search) {
        params.search = search
      }
      getCategoryTree(params).then((res) => {
        this.categoryData = res
      })
    }
  }
}
</script>

<style lang="scss">
.training-edit-config {
  .el-input-number {
    &.coin {
      position: relative;
      &:before {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 15px;
        transform: translate(-50%, -50%);
        font-size: 12px;
        content: '￥';
        z-index: 110;
      }
      .el-input__inner {
        padding-left: 25px;
      }
    }
  }

  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .el-form-item__label {
    padding-bottom: 0 !important;
  }
  .slot-form-item {
    .el-form-item__label {
      display: flex;
      align-items: center;
      width: 100%;
      .slot-item-header {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .ql-container {
    height: calc(100% - 100px);
  }
}
</style>

<style lang="scss" scoped>
.training-edit-config {
  .ivu-upload {
    display: none;
  }
  .half-form-item {
    display: inline-block;
    width: 450px;
    /deep/.el-upload__tip {
      line-height: 0;
    }
  }
  .margin-right-120 {
    margin-right: 120px;
  }
  .form-area-title {
    position: relative;
    font-size: 17px;
    font-weight: bold;
    color: #525252;
    margin-bottom: 12px;
    // padding-bottom: 12px;
    // border-bottom: 1px solid #409eff;
    width: 12px;
    white-space: nowrap;
  }
}
</style>
