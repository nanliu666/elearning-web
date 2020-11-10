<template>
  <!-- 审批意见模态框 -->
  <el-dialog
    :title="apprTitle"
    :visible.sync="dialogVisible"
    width="550px"
    :modal-append-to-body="false"
    :before-close="handleClose"
  >
    <div v-loading="loading">
      <commonForm
        ref="BackOff"
        :model="infoForm"
        :columns="columns"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="dialogVisible = false"
      >取 消</el-button>
      <el-button
        v-loading="loading"
        size="medium"
        type="primary"
        @click="onsubmitOverrule"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { postOverrule } from '@/api/apprProcess/apprProcess'

export default {
  name: 'BackOffDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nodelist: {
      type: Array,
      default: function() {
        return []
      }
    },
    processInstanceId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      apprTitle: '回退',
      loading: false,
      infoForm: {
        comment: '',
        nodeId: '',
        nodeName: ''
      },
      columns: [
        {
          span: 20,
          offset: 2,
          prop: 'nodeId',
          options: this.nodelist,
          itemType: 'select',
          label: '退回至',
          change: this.change,
          props: {
            label: 'label',
            value: 'value'
          },
          required: true
        },
        {
          span: 20,
          offset: 2,
          prop: 'comment',
          itemType: 'input',
          type: 'textarea',
          label: '审批意见',
          props: {},
          required: true
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['tag'])
  },

  watch: {
    'infoForm.nodeId': {
      handler(Id) {
        this.nodelist.map((it) => {
          if (it.value == Id) {
            this.infoForm.nodeName = it.label
          }
        })
      },
      deep: true
    },
    visible: {
      handler(data) {
        data && (this.dialogVisible = true)
      },
      deep: true,
      immediate: true
    },
    nodelist: {
      handler(data) {
        this.columns.find((it) => it.prop === 'nodeId').options = data
      },
      immediate: true
    },
    dialogVisible: {
      handler(data) {
        if (!data) {
          this.$emit('update:visible', data)
        }
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    onsubmitOverrule() {
      this.$refs.BackOff.validate().then((res) => {
        if (res) {
          let params = {
            comment: this.infoForm.comment,
            nodeId: this.infoForm.nodeId,
            nodeName: this.infoForm.nodeName,
            processInstanceId: this.processInstanceId,
            taskId: this.taskId
          }
          this.loading = true
          postOverrule(params)
            .then(() => {
              this.loading = false
              this.$message.success('回退成功')
              this.dialogVisible = false
              this.$emit('load')
            })
            .then(() => {
              this.handleBack()
            })
        }
      })
      return
    },
    handleBack() {
      this.$store.commit('DEL_TAG', this.tag)
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

/*/deep/ .el-form-item {*/
/*  margin-bottom: 12px;*/
/*}*/

.info,
.address {
  margin-bottom: 12px;
  font-size: 14px;
  color: #202940;
}

.casvader {
  width: 100%;
}
/deep/ .el-form-item {
  margin-bottom: 20px !important;
}
</style>
