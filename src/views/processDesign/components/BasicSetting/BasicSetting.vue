<template>
  <div class="setting-container">
    <commonForm
      ref="elForm"
      :model="formData"
      :columns="columns"
    >
      <template slot="processVisible">
        <user-picker v-model="formData.processVisible" />
      </template>
      <div slot="approverNull">
        <el-radio-group v-model="formData.approverNull">
          <el-radio :label="0">
            自动通过
            <el-tooltip
              content="当指定人员或主管为空的时候，审批单将自动通过"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">
            自动转交给管理员
            <el-tooltip
              content="当指定人员或主管为空的时候，审批单将自动转交给管理员"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </div>
      <template slot="isOpinion">
        <el-checkbox v-model="formData.isOpinion">
          必填
          <el-tooltip
            content="如果勾选，审批人必须填写意见才可以提交审批结果"
            placement="top"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-checkbox>
      </template>
    </commonForm>
  </div>
</template>
<script>
import { columns } from './config'
import UserPicker from '@/components/trainingSelectUser/trainingSelectUser'

export default {
  components: {
    UserPicker
  },
  props: {
    tabName: { type: String, default: '' },
    conf: { type: Object, default: null }
  },
  data() {
    return {
      columns,
      formData: {
        processName: '',
        processType: '',
        categoryId: '1',
        processVisible: [],
        approverDistinct: 0,
        isOpinion: '',
        tip: ''
      }
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
    }
  },
  mounted() {},
  methods: {
    // 给父级页面提供得获取本页数据得方法
    getData() {
      this.formData.icon = this.activeIcon
      return new Promise((resolve, reject) => {
        this.$refs['elForm']
          .validate()
          .then((valid) => {
            if (!valid) {
              reject({ target: this.tabName })
              return
            }

            resolve({ formData: this.formData, target: this.tabName }) // TODO 提交表单
          })
          .catch(() => {
            this.$emit('jump', 'basicSetting')
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-container {
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  /deep/.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
}
</style>
