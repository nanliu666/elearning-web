<template>
  <div class="apprSubmit fill">
    <page-header
      :title="'发起' + basicSetting.processName + '申请'"
      :show-back="true"
      :back="goBack"
    >
      <div
        v-if="!hasHandle"
        slot="rightMenu"
        class="preview-box"
      >
        <span style="margin-right: 10px">正在模拟发起人：{{ currentInitiator }}</span>
        <el-button
          type="text"
          @click="changeInitiator"
        >
          切换发起人
        </el-button>
      </div>
    </page-header>
    <basic-container
      v-loading="loading"
      block
    >
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <form-parser
            ref="form"
            :form-data.sync="form"
          />
          <appr-picker
            ref="apprPicker"
            :process-data="processData"
            :form-data="form"
          />
          <div
            v-if="hasHandle"
            class="footer"
          >
            <el-button
              size="medium"
              @click="goBack"
            >
              取消
            </el-button>
            <el-button
              size="medium"
              type="primary"
              :loading="submiting"
              @click="submit"
            >
              提交
            </el-button>
          </div>
        </el-col>
      </el-row>
    </basic-container>
    <userSelect
      ref="userSelect"
      :org="false"
      :is-single="true"
      :is-preview-select="true"
      :init-data="initDialogData"
      :visible.sync="selectVisible"
      @addUser="adduser"
    />
  </div>
</template>

<script>
import userSelect from '@/components/OrgSelect/userSelect'
import { getProcessDetail, getApprRreview, getApprDetail } from '@/api/apprProcess/apprProcess'
import apprPicker from '@/components/appr-picker/apprPicker'
import { mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  name: 'ApprSubmit',
  components: {
    apprPicker,
    userSelect
  },
  data() {
    return {
      initDialogData: [],
      selectVisible: false,
      currentInitiator: '',
      hasHandle: true,
      basicSetting: {},
      formData: {},
      form: {},
      processData: null,
      advancedSetting: {},
      loading: false,
      processId: null,
      apprNo: null,
      submiting: false
    }
  },
  computed: {
    ...mapGetters(['tag', 'userInfo'])
  },
  activated() {
    this.processId = this.$route.query.processId
    this.apprNo = this.$route.query.apprNo
    this.getProcess()
    if (this.$route.query.type && this.$route.query.type === 'preview') {
      this.hasHandle = false
      // 重置tag的名字
      this.$store.commit('SET_TAG_LABEL', '审批预览')
      this.currentInitiator = this.userInfo.nick_name
    }
  },
  methods: {
    changeInitiator() {
      // 在表单设计的时候，设置的发起人
      let initiator = this.processData.properties.initiator
      this.selectVisible = true
      this.initDialogData = initiator
    },
    adduser(data) {
      this.currentInitiator = data[0].name
    },
    getProcess() {
      if (!this.processId) {
        return
      }
      this.loading = true
      let loadFun = this.$route.query.type !== 'preview' ? getProcessDetail : getApprRreview
      loadFun({ processId: this.processId }).then((res) => {
        const obj = JSON.parse(Base64.decode(res.baseJson))
        if (typeof obj === 'object') {
          this.basicSetting = obj.basicSetting
          this.processData = obj.processData
          // 此处为提交审批内的权限，故只取第一层数据的权限
          const formOperates = this.processData.properties.formOperates
          this.advancedSetting = obj.advancedSetting
          // 带入之前提交的数据
          if (this.apprNo) {
            this.getApplyDetail(formOperates)
          } else {
            this.formData = obj.formData
            this.handlerPrivilege(formOperates)
            this.$refs.form.init(this.formData)
            this.loading = false
          }
        }
      })
    },
    getApplyDetail(formOperates) {
      this.loading = true
      getApprDetail({ apprNo: this.apprNo })
        .then((res) => {
          const formData = JSON.parse(Base64.decode(res.formData)).formData
          this.formData = formData
          // 如果表单数据为空直接跳出
          if (_.isEmpty(formData.fields)) return
          this.handlerPrivilege(formOperates)
          this.$refs.form.init(formData)
          this.loading = false
        })
        .catch()
    },
    /**
     * TODO：不优雅的处理，如果有思路并且有空可以进行优化
     * 处理发起审批相关权限
     * formPrivilege 0为可编辑， 1为只读（在此展示位置灰处理），2隐藏
     * 注意明细控件是存在children，在此处取模板值__config__.children
     */
    handlerPrivilege(formOperates) {
      // 流程数据内的第一层权限遍历，内部再遍历表格设计器的每一个权限
      if (formOperates && formOperates.length > 0) {
        formOperates.forEach((item) => {
          this.formData.fields.forEach((formItem) => {
            // 选中当前的控件
            if (item.formId === formItem.__config__.formId) {
              formItem.__config__.formPrivilege = item.formPrivilege
              if (formItem.__config__.children) {
                formItem.__config__.children.forEach((childrenItem) => {
                  childrenItem.__config__.formPrivilege = item.formPrivilege
                })
              }
              if (formItem.__config__.formPrivilege === 1) {
                formItem.__config__.required = false
                if (formItem.__config__.children) {
                  formItem.__config__.children.forEach((childrenItem) => {
                    childrenItem.__config__.required = false
                  })
                }
              }
            }
          })
        })
      }
    },
    submit() {
      Promise.all([this.$refs.form.validate(), this.$refs.apprPicker.validate()]).then(() => {
        this.submiting = true
        this.$refs.apprPicker
          .submit({
            formData: Base64.encode(
              JSON.stringify({
                formData: this.$refs.form.formConfCopy,
                processData: this.processData
              })
            ),
            processId: this.processId,
            processName: this.basicSetting.processName
          })
          .then(() => {
            this.$message.success('审批提交成功')
            this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
            this.goBack()
          })
          .finally(() => {
            this.submiting = false
          })
      })
    },
    goBack() {
      this.$router.go(-1)
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    },
    clear() {
      this.$refs.form.resetForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.apprSubmit {
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-button + .el-button {
    margin-left: 16px;
  }
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
</style>
