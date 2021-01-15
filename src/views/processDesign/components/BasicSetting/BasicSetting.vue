<template>
  <div class="setting-container">
    <commonForm
      ref="elForm"
      :model="formData"
      :columns="columns"
    >
      <template slot="initiator">
        <user-picker v-model="formData.initiator" />
      </template>
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
    initiator: { type: Array, default: () => [] },
    conf: { type: Object, default: null }
  },
  data() {
    return {
      columns,
      all: true, //显示所有人
      org: true, //可以选择部门
      infoForm: {},
      formData: {
        processName: '',
        processType: '',
        initiator: [],
        approverDistinct: 0,
        isOpinion: '',
        tip: ''
      }
    }
  },
  watch: {
    initiator: {
      handler(val) {
        this.formData.initiator = val || []
      },
      immediate: true
    },
    formData: {
      handler() {},
      immediate: true
    },
    conf: {
      handler() {
        // if (typeof this.conf === 'object' && this.conf !== null) {
        //   Object.assign(this.formData, this.conf)
        //   !Array.isArray(this.formData.processAdmin) &&
        //     (this.formData.processAdmin = [this.formData.processAdmin])
        // }
      },
      deep: true
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
