<template>
  <!-- 基本信息页面 -->
  <basic-container block>
    <el-form
      ref="form"
      class="plan-edit-config"
      :model="model"
      :rules="rules"
      label-position="top"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :offset="3">
          <el-form-item
            label="线上必修安排名称"
            prop="coursePlanName"
            class="half-form-item"
          >
            <el-input
              v-model="model.coursePlanName"
              :maxlength="32"
              placeholder="请输入"
              clearable=""
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
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
            <tree-selector
              v-model="model.categoryId"
              @
              style="width: 100%; "
              class="selector"
              :options="categoryData"
              placeholder="请选择所在分类"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
              @getLabel="(label) => (model.categoryName = label)"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :offset="3">
          <el-form-item
            class="half-form-item"
            label="学习时间"
            prop="timeRange"
          >
            <el-date-picker
              v-model="model.timeRange"
              style="width: 100%;"
              type="daterange"
              format="yyyy-MM-dd"
              @change="timeRangeChange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="截止日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label="知识体系"
            prop="knowledgeSystemId"
            class="half-form-item"
          >
            <tree-selector
              v-model="model.knowledgeSystemId"
              style="width: 100%;"
              class="selector"
              :options="knowledgeData"
              placeholder="请选择"
              :props="{
                value: 'id',
                label: 'name',
                children: 'children'
              }"
              @focus="getKnowledgeData"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :offset="3">
          <el-form-item
            label="项目经理"
            prop="projectManagerId"
            class="half-form-item"
          >
            <lazy-select
              v-model="model.projectManagerId"
              :remote-method="getUserList"
              :props="{ value: 'userId', label: 'name' }"
              :init-options="headTeacherOptions"
            />
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item
            label="计入积分"
            prop="asqScore"
            class="half-form-item"
          >
            <el-input-number
              v-model="model.score"
              :precision="1"
              :step="0.5"
              :min="0"
              :max="999"
              type="number"
              controls-position="right"
              style="width: 100%;"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :offset="3">
          <el-form-item
            style="display: block;"
            label="培训封面"
            prop="cover"
            class="half-form-item"
          >
            <common-upload
              drag
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
                v-if="model.coverUrl"
                style="background-color: #fff; position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
              >
                <img
                  :src="model.coverUrl"
                  width="100%"
                  height="100%"
                />
              </div>
            </common-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>

<script>
import { getCategoryTree } from '@/api/learnPlan'
import { getOrgUserList } from '@/api/system/user'
import LazySelect from '@/components/el-lazy-select'
import TreeSelector from '@/components/tree-selector'
import { getCreatorList } from '@/api/live'

export default {
  components: {
    TreeSelector,
    LazySelect,
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  props: {
    headTeacherOptions: {
      type: Array,
      default() {
        return []
      }
    },
    model: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          const now = new Date()
          const d = new Date(date)
          return (
            d < now &&
            !(
              d.getFullYear() == now.getFullYear() &&
              d.getMonth() == now.getMonth() &&
              d.getDate() == now.getDate()
            )
          )
        }
      },
      categoryData: [],
      knowledgeData: [],
      rules: {
        coursePlanName: [{ trigger: 'blur', message: '请输入线上必修安排名称', required: true }],
        categoryId: [{ trigger: 'change', message: '请选择分类', required: true }],
        timeRange: [{ trigger: 'change', message: '请选择学习时间', required: true }],
        projectManagerId: [{ trigger: 'change', message: '请选择项目经理', required: true }]
      }
    }
  },
  watch: {
    'form.categoryId'() {
      this.$refs.form.validateField('categoryId')
    },
    $route(to) {
      if (to.path === '/learnPlan/CoursePlanList') {
        this.$refs.form.resetFields()
      }
    }
  },
  created() {
    this.getCategoryData()
    this.getKnowledgeData()
  },
  methods: {
    timeRangeChange(val){
      val[0] = `${val[0]} 00:00:00`
      val[1] = `${val[1]} 23:59:59`
    },
    toCategory() {
      this.$router.push({
        path: '/learnPlan/catalog'
      })
    },
    getUserList(params) {
      return getOrgUserList(Object.assign(params, { orgId: 0 }))
    },
    handleUpload(file) {
      this.model.coverUrl = file.fileUrl
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
    getOrgUserList(params) {
      return getOrgUserList(Object.assign(params, { orgId: '0' }))
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['form']
          .validate()
          .then(() => {
            resolve() // TODO 提交表单
          })
          .catch(() => {
            reject()
          })
      })
    },
    getCategoryData() {
      getCategoryTree({status:1}).then((res) => {
        this.categoryData = res
      })
    },
    getKnowledgeData() {
      getCreatorList({ source: 'knowledgeSystem' }).then((res) => {
        this.knowledgeData = res
      })
    }
  }
}
</script>

<style lang="scss">
.plan-edit-config {
  .basic-container--block .el-card__body {
    padding-left: 120px;
    padding-right: 120px;
  }
  .el-card__body {
    padding-left: 120px;
    padding-right: 120px;
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
.plan-edit-config {
  .ivu-upload {
    display: none;
  }
  .half-form-item {
    display: inline-block;
    width: 353px;
    /deep/.el-upload__tip {
      line-height: 0;
    }
  }
  .margin-right-120 {
    margin-right: 120px;
  }
  .margin-right-90 {
    margin-right: 90px;
  }
  .margin-left-90 {
    margin-left: 90px;
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
