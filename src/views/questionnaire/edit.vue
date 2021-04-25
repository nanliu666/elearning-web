<template>
  <div class="edit-questionnaire">
    <div
      class="header"
      @click="$router.back()"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">{{ form.id ? '编辑问卷' : '创建问卷' }}</span>
    </div>

    <div class="body">
      <div class="basic-info">
        <div class="block-header">
          <div class="block-header">
            <div class="title">
              基本信息
            </div>
          </div>
        </div>

        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="form"
          label-position="top"
        >
          <el-form-item
            label="问卷名称"
            prop="asqName"
            class="half-form-item"
            style="margin-right: 50px;"
          >
            <el-input
              v-model="form.asqName"
              clearable
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所在分类"
            prop="categoryId"
            class="half-form-item"
          >
            <tree-selector
              style="width: 100%;"
              class="selector"
              :value="form.categoryId"
              :options="treeData"
              placeholder="请选择所在分类"
              :props="seletorProps"
              @getValue="(id) => (form.categoryId = id)"
            />
          </el-form-item>

          <el-form-item
            label="问卷简介"
            prop="intro"
            style="width: 1090px;"
          >
            <el-input
              v-model="form.remark"
              :autosize="{ minRows: 6 }"
              type="textarea"
              placeholder="请输入"
              :maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="asqQuestion-table">
        <div class="block-header">
          <div class="title">
            问卷题目 <span style="font-size: 14px;">(数量：{{ form.asqQuestions.length }}个)</span>
          </div>
          <el-button
            class="button"
            size="medium"
            type="primary"
            @click="() => handleEdit()"
          >
            添加题目
          </el-button>
        </div>
        <el-table
          :data="form.asqQuestions"
          align="center"
          header-align="center"
          height="462px"
          row-key="content"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="content"
            label="题干"
            align="center"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="题目类型"
          >
            <template slot-scope="scope">
              <div>
                {{ getType(scope.row.type) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            align="center"
            label="是否必填"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.status == 0 ? '否' : '是' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-row
        style="margin: 12px auto;"
        type="flex"
        justify="center"
      >
        <el-button
          :loading="submitLoading"
          type="primary"
          size="medium"
          @click="handleSubmit"
        >
          完成
        </el-button>
        <el-button
          size="medium"
          @click="$router.back()"
        >
          取消
        </el-button>
      </el-row>
    </div>
    <transition name="fade">
      <div
        v-show="drawerVisible"
        class="drawer-cover"
        @click="handleDrawerVisible(false)"
      ></div>
    </transition>
    <transition name="draw">
      <div
        v-show="drawerVisible"
        ref="draw-wrapper"
        class="asqQuestion-drawer-wrapper"
      >
        <div
          ref="asqQuestion-drawer"
          class="asqQuestion-drawer"
        >
          <div class="drawer-header">
            <div class="drawer-title">
              添加题目
            </div>
            <i
              class="el-icon-close drawer-close-btn"
              @click="drawerVisible = false"
            ></i>
          </div>

          <div
            ref="drawer-body"
            class="drawer-body"
          >
            <el-form
              ref="questionForm"
              label-position="top"
              label-width="80px"
              :model="asqQuestion"
              :rules="questionRules"
            >
              <el-form-item
                label="题干"
                prop="content"
              >
                <el-input
                  v-model="asqQuestion.content"
                  type="textarea"
                  placeholder="请输入"
                  :maxlength="200"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="type"
                class="drawer-asqQuestion-type"
              >
                <template slot="label">
                  <div class="drawer-asqQuestion-type-label">
                    <div>题目类型</div>
                    <el-checkbox
                      v-model="asqQuestion.status"
                      :true-label="1"
                      :false-label="0"
                    >
                      必填
                    </el-checkbox>
                  </div>
                </template>
                <el-select
                  v-model="asqQuestion.type"
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in [
                      { label: '简答题', value: 'short_answer' },
                      { label: '单选题', value: 'single_choice' },
                      { label: '多选题', value: 'multi_choice' }
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div
              v-if="asqQuestion.type && asqQuestion.type !== 'short_answer'"
              class="option-container"
            >
              <div class="option-title">
                <span style="color: red; margin-right: 5px;">*</span>
                <span
                  style="font-size:14px;color:rgba(0,11,21,0.65); margin-right: 5px;"
                >选项</span>
                <el-popover
                  transition="none"
                  trigger="click"
                >
                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="cursor: pointer;"
                  ></i>
                  <template slot>
                    <div>
                      <span>1.最多添加15个选项（包含“其他”选项)</span><br /><br />
                      <span>2.每项最多150个字</span>
                    </div>
                  </template>
                </el-popover>
              </div>
              <div class="option-list">
                <el-form
                  ref="optionForm"
                  :rules="optionRules"
                  :model="optionForm"
                >
                  <draggable
                    v-model="asqQuestion.asqQuestionOptions"
                    :animation="200"
                  >
                    <transition-group>
                      <el-form-item
                        v-for="(option, index) in asqQuestion.asqQuestionOptions"
                        :key="index"
                        class="option-item"
                        :prop="'content' + index"
                      >
                        <i class="icon-drag"></i>
                        <el-input
                          v-model="option.content"
                          :disabled="option.disabled"
                          :placeholder="option.placeholder"
                          class="option-input"
                        ></el-input>

                        <div class="option-delete-btn">
                          <i
                            v-if="asqQuestion.asqQuestionOptions.length > 2"
                            class="el-icon-close"
                            @click="deleteOption(option)"
                          ></i>
                        </div>
                      </el-form-item>
                    </transition-group>
                  </draggable>
                </el-form>
              </div>
              <div
                class="add-option-btn"
                :class="{ disabled: asqQuestion.asqQuestionOptions.length >= 15 }"
                @click="addQuestionOption"
              >
                <i class="el-icon-plus"></i>
                <span class="add-option-text">新建选项</span>
              </div>

              <el-button
                v-if="asqQuestion.type && asqQuestion.type !== 'short_answer'"
                type="text"
                class="other-option-btn"
                @click="addOtherOptions"
              >
                添加“其他”选项
              </el-button>

              <div
                v-if="hasOtherOptions"
                class="other-option-container"
              >
                <el-form
                  ref="otherForm"
                  :rules="questionRules"
                  :model="asqQuestion"
                  style="display: flex;"
                >
                  <el-form-item
                    class="other-option-item"
                    label="最少可选"
                    prop="multiMin"
                  >
                    <el-select
                      v-model="asqQuestion.multiMin"
                      class="selector"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in otherMinOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                    项
                  </el-form-item>

                  <el-form-item
                    class="other-option-item"
                    label="最多可选"
                    prop="multiMax"
                  >
                    <el-select
                      v-model="asqQuestion.multiMax"
                      class="selector"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in otherMaxOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                    项
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <el-row
            type="flex"
            justify="center"
            style="margin-top: 24px;"
          >
            <el-button
              type="primary"
              @click="handleAsqQuestionSave"
            >
              保存
            </el-button>
            <el-button @click="handleDrawerVisible(false)">
              取消
            </el-button>
          </el-row>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import TreeSelector from '@/components/tree-selector'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import draggable from 'vuedraggable'
import { questionnaireAdd, questionnaireEdit, editView } from '@/api/questionnaire'
import Sortable from 'sortablejs'
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
const OTHER_OPTIONS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']

const ASQ_QUESTION = {
  content: '',
  type: 'single_choice',
  sort: '',
  status: 1,
  multiMin: '2',
  multiMax: '不限',
  asqQuestionOptions: [{ content: '' }, { content: '' }]
}
export default {
  name: 'EditQuestionnaire',
  components: {
    TreeSelector,
    draggable
  },
  data() {
    return {
      otherMinValue: '',
      otherMaxValue: '',
      drawerVisible: false,
      hasOtherOptions: false,
      form: {
        asqName: '',
        categoryId: '',
        remark: '',
        asqQuestions: []
      },
      seletorProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      asqQuestion: {},
      rules: {
        asqName: [{ required: true, message: '请输入问卷名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择类别', trigger: 'change' }]
      },
      questionRules: {
        content: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
        multiMin: [{ required: true, message: '请选择最少可选', trigger: 'change' }],
        multiMax: [{ required: true, message: '请选择最多可选', trigger: 'change' }]
      },
      optionForm: {},
      optionRules: {},
      treeData: [],
      submitLoading: false
    }
  },
  computed: {
    otherMinOptions() {
      const maxValue = this.asqQuestion.multiMax
      let endIndex = this.asqQuestion.asqQuestionOptions.length - 1
      if (maxValue && maxValue !== '不限') {
        endIndex = OTHER_OPTIONS.indexOf(maxValue + '') + 1
      }
      return OTHER_OPTIONS.slice(0, endIndex)
    },
    otherMaxOptions() {
      const minValue = this.asqQuestion.multiMin
      let startIndex = 0
      if (minValue) {
        startIndex = OTHER_OPTIONS.indexOf(minValue + '')
      }
      return ['不限'].concat(
        OTHER_OPTIONS.slice(startIndex, this.asqQuestion.asqQuestionOptions.length - 1)
      )
    }
  },
  watch: {
    'asqQuestion.asqQuestionOptions': {
      handler(val) {
        if (!val) return
        const form = (this.optionForm = {})
        const rules = (this.optionRules = {})
        val.forEach((item, index) => {
          item.placeholder = '选项' + (index + 1)
        })
        val.forEach((opt, i) => {
          form['content' + i] = opt.content
          rules['content' + i] = [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 150, message: '长度在 1 到 150 个字符', trigger: 'blur' }
          ]
        })
        Object.assign(this.asqQuestion, { multiMin: '2', multiMax: '不限' })
        this.$refs['asqQuestion-drawer'].scrollTop = this.$refs['asqQuestion-drawer'].scrollHeight
        this.clearValidate(this.$refs.optionForm)
      },
      deep: true
    },
    asqQuestion: {
      handler(question) {
        const type = question.type
        if (type === 'multi_choice') {
          const singleOtherIndex = this.asqQuestion.asqQuestionOptions.findIndex(
            (option) => option.disabled
          )
          if (singleOtherIndex < 0) return
          this.asqQuestion.asqQuestionOptions.splice(singleOtherIndex, 1)
        } else if (type === 'single_choice') {
          if (this.hasOtherOptions) this.hasOtherOptions = false
        }
      },
      deep: true
    }
  },
  activated() {
    this.initData()
  },
  mounted() {
    this.clearValidate()
    this.rowDrop()
  },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.form.asqQuestions.splice(oldIndex, 1)[0]
          _this.form.asqQuestions.splice(newIndex, 0, currRow)
        }
      })
    },
    addOtherOptions() {
      if (this.asqQuestion.type === 'multi_choice') {
        this.hasOtherOptions = !this.hasOtherOptions
      } else {
        const asqQuestionOptions = this.asqQuestion.asqQuestionOptions
        if (asqQuestionOptions.length >= 15) return
        if (asqQuestionOptions.find((option) => option.content === '其他')) return
        asqQuestionOptions.push({
          content: '其他',
          disabled: true
        })
      }
    },
    async handleSubmit() {
      const valid = await this.formValidate()
      if (!valid) {
        this.$message.error('创建失败，请输入必填项')
        return
      }

      if (!this.form.asqQuestions.length) {
        this.$message.error('创建失败，至少添加一条题目')
        return
      }
      this.processQuestionData(this.form.asqQuestions)
      let request
      let typeMsg
      if (this.form.id) {
        request = questionnaireEdit
        typeMsg = '编辑'
      } else {
        request = questionnaireAdd
        typeMsg = '新增'
      }
      this.submitLoading = true
      request(this.form)
        .then(() => {
          this.$message.success(`${typeMsg}成功`)
          this.$router.back()
        })
        .catch((e) => {
          this.$message.error(`${typeMsg}失败，${e}`)
        })
        .finally(() => (this.submitLoading = false))
    },
    processQuestionData(data) {
      if (!data || !data.length) return
      const keys = ['content', 'type', 'asqQuestionOptions', 'status']
      data.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          if (!keys.includes(key)) {
            delete item[key]
          }
        })
        item.sort = index + 1
        if (!item.asqQuestionOptions) {
          return
        }
        item.asqQuestionOptions.forEach((q, idx) => {
          q.sort = idx + 1
        })
      })
    },
    initData() {
      const id = this.$route.query.id
      this.form = {
        asqName: '',
        categoryId: '',
        remark: '',
        asqQuestions: []
      }
      if (id) {
        this.form.id = id
        editView({ id }).then((res) => {
          const [form = {}] = res
          this.form = form
        })
      }
      queryCategoryOrgList({ source: 'questionnaire' }).then((res) => {
        this.treeData = res
      })
    },
    getType(type) {
      switch (type) {
        case 'single_choice':
          return '单选题'
        case 'multi_choice':
          return '多选题'
        case 'short_answer':
          return '简答题'
        default:
          return ''
      }
    },
    handleEdit(target) {
      let asqQuestion = deepClone(ASQ_QUESTION)
      asqQuestion = (target && Object.assign(asqQuestion, target)) || asqQuestion

      this.asqQuestion = asqQuestion
      while (asqQuestion.asqQuestionOptions.length < 2) {
        this.addQuestionOption()
      }
      if (target) {
        this.asqQuestion.target = target
      }
      const { multiMin, multiMax } = this.asqQuestion
      if (multiMin && multiMax) {
        this.hasOtherOptions = true
      }

      this.handleDrawerVisible(true)
    },
    handleDrawerVisible(visible) {
      if (!visible) {
        this.hasOtherOptions = false
        this.asqQuestion = {}
      }
      this.clearValidate(this.$refs.questionForm)
      this.drawerVisible = visible
    },
    addQuestionOption() {
      if (this.asqQuestion.asqQuestionOptions.length >= 15) {
        return
      }
      this.asqQuestion.asqQuestionOptions.push({
        content: ''
      })
    },

    async handleAsqQuestionSave() {
      const valid = await this.questionFormValidate()
      if (!valid) return
      const asqQuestion = this.asqQuestion
      if (asqQuestion.type != 'short_answer') {
        const valid = await this.optionFormValidate()
        if (!valid) return
      } else {
        delete asqQuestion.asqQuestionOptions
        this.hasOtherOptions = false
      }

      // 没有添加更多选项
      if (!this.hasOtherOptions) {
        delete asqQuestion.multiMin
        delete asqQuestion.multiMax
      } else {
        const valid = await this.otherFormValidate()
        if (!valid) return
        asqQuestion.multiMax = asqQuestion.multiMax + ''
        asqQuestion.multiMin = asqQuestion.multiMin + ''
      }

      const asqQuestions = this.form.asqQuestions
      let target = asqQuestion.target
      if (target) {
        asqQuestions.splice(asqQuestions.indexOf(target), 1, asqQuestion)
        delete asqQuestion.target
      } else {
        asqQuestions.push(asqQuestion)
      }

      this.handleDrawerVisible(false)
    },
    formValidate() {
      return new Promise((resolve) => {
        this.$refs['form'].validate((valid) => {
          resolve(valid)
        })
      })
    },
    questionFormValidate() {
      return new Promise((resolve) => {
        this.$refs['questionForm'].validate((valid) => {
          if (valid) {
            resolve('valid')
          }
        })
      })
    },
    optionFormValidate() {
      return new Promise((resolve) => {
        this.$refs['optionForm'].validate((valid) => {
          if (valid) {
            resolve('valid')
          }
        })
      })
    },
    otherFormValidate() {
      return new Promise((resolve) => {
        this.$refs['otherForm'].validate((valid) => {
          if (valid) {
            resolve('valid')
          }
        })
      })
    },
    deleteOption(option) {
      this.asqQuestion.asqQuestionOptions.splice(
        this.asqQuestion.asqQuestionOptions.indexOf(option),
        1
      )
    },
    handleDelete(index) {
      this.form.asqQuestions.splice(index, 1)
      this.$message.success('已删除')
    },
    clearValidate(formDom) {
      this.$nextTick(() => {
        formDom = formDom || this.$refs.form
        formDom.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss">
.edit-questionnaire {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .drawer-asqQuestion-type {
    .el-form-item__label {
      display: flex;
    }
    .drawer-asqQuestion-type-label {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .option-item {
    .el-form-item__error {
      margin-left: 28px;
    }
    .el-form-item__content {
      display: flex;
      align-items: center;
      width: 100%;
    }
    .option-delete-btn {
      width: 16px;
      height: 16px;
      line-height: 16px;
      overflow: hidden;
      text-align: center;
      i {
        font-size: 16px;
      }
    }
  }
  .other-option-item {
    .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.edit-questionnaire {
  cursor: default;
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 8px;
    }
  }

  .body {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 24px;
    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .title {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
    .half-form-item {
      display: inline-block;
      width: 520px;
    }
  }
  .drawer-cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 100;
  }
  .asqQuestion-drawer-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 500px;
    z-index: 111;
    background-color: #fff;
  }
  .drawer-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 90px;
    width: 100%;
    border-top: 1px solid #ebeced;
    box-sizing: border-box;
  }
  .asqQuestion-drawer {
    width: 100%;
    height: calc(100% - 90px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0 24px;

    .drawer-header {
      display: flex;
      height: 76px;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeced;
      margin-bottom: 24px;
      .drawer-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 28px;
      }
      .drawer-close-btn {
        cursor: pointer;
        font-size: 20px;
      }
    }
    .option-container {
      .option-title {
        margin-bottom: 8px;
      }
      .option-list {
        .option-item {
          display: flex;
          align-items: center;
          height: 36px;
          margin-bottom: 24px;
          .icon-drag {
            color: rgba(0, 11, 21, 0.65);
            cursor: move;
            font-size: 12px;
          }
          .option-input {
            margin: 0 8px;
          }
          .el-icon-close {
            color: rgba(0, 11, 21, 0.65);
            cursor: pointer;
          }
        }
      }
      .add-option-btn {
        margin: auto;
        width: 409px;
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        cursor: pointer;
        border: 1px dashed #d9dbdc;
        text-align: center;
        color: #01aafc;
        border-radius: 3px;
        &.disabled {
          cursor: not-allowed;
          color: #ddd;
        }
        .el-icon-plus {
          font-size: 16px;
          margin-right: 8px;
        }
        .add-option-text {
          font-size: 14px;
        }
      }
      .other-option-btn {
        margin: 16px 0;
      }
      .other-option-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .other-option-item {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.65);
          letter-spacing: 0;
          line-height: 22px;
          &:first-child {
            margin-right: 40px;
          }
          .el-form-item__label {
            padding: 0;
          }
          .selector {
            width: 100px;
            margin: 0 8px;
          }
        }
      }
    }
  }

  .draw-enter-active,
  .draw-leave-active {
    transition: transform 0.3s;
  }
  .draw-enter,
  .draw-leave-to {
    transform: translateX(-100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .draw-enter,
  .draw-leave-to {
    transform: translateX(100%);
  }
}
</style>
