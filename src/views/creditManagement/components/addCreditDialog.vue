<template>
  <el-dialog
    :close-on-click-modal="false"
    append-to-body
    title="添加积分"
    :visible="visible"
    width="550px"
    :modal-append-to-body="false"
    @close="handleClose"
  >
    <common-form
      ref="formRef"
      :model="model"
      :columns="columns"
    >
    </common-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="handleClose"
      >取消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="submit"
      >完成</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getWorkList } from '@/api/system/user'
import { handAddScore, getListSysRulus } from '@/api/credit/credit'
export default {
  name: 'AddCreditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'userId',
          itemType: 'lazySelect',
          load: this.loadUser,
          optionProps: {
            formatter: (item) => `${item.name}`,
            key: 'userId',
            value: 'userId'
          },
          searchable: true,
          placeholder: '请输入或选择',
          span: 24,
          required: true,
          label: '人员名称'
        },
        {
          prop: 'id',
          itemType: 'select',
          placeholder: '请选择',
          props: {
            label: 'sysRuleSource',
            value: 'id'
          },
          options: [],
          span: 24,
          required: true,
          label: '积分规则'
        },
        {
          prop: 'score',
          itemType: 'inputNumber',
          precision: 0,
          step: 1,
          maxlength: 32,
          placeholder: '请输入',
          span: 24,
          rules: [{ required: true, validator: this.checkScore, trigger: ['blur', 'change'] }],
          label: '积分数量'
        }
      ],
      model: {
        userId: '',
        id: '',
        score: 1
      }
    }
  },
  created() {
    this.initSetting()
  },
  methods: {
    submit() {
      this.$refs.formRef.validate(() => {
        handAddScore(this.model).then(() => {
          this.handleClose()
          this.$refs.formRef.resetFields()
          this.$emit('updateTable')
        })
      })
    },
    initSetting() {
      const idProp = _.find(this.columns, { prop: 'id' })
      getListSysRulus({ status: '1' }).then((res) => {
        _.set(idProp, 'options', res)
      })
    },
    checkScore(rule, value, callback) {
      if (value === 0) {
        callback(new Error('积分不能为0！'))
      } else {
        callback()
      }
    },
    loadUser(params) {
      return getWorkList(params)
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style scoped lang="scss"></style>
