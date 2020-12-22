<template>
  <el-dialog
    title="增加批次"
    :visible="innnerVisible"
    width="550px"
    append-to-body
    @close="handleClose"
  >
    <common-form
      ref="form"
      :model="formData"
      :columns="columns"
    >
      <template #examList>
        <SelectUser
          v-model="formData.examList"
          title="考生安排"
        ></SelectUser>
      </template>
    </common-form>
    <span slot="footer">
      <el-button
        size="medium"
        @click="handleClose"
      >取消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="submit"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SelectUser from '@/components/trainingSelectUser/trainingSelectUser'
import moment from 'moment'
const EventColumns = [
  {
    itemType: 'datePicker',
    span: 24,
    type: 'datetimerange',
    required: true,
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    prop: 'examTime',
    pickerOptions: {
      disabledDate(time) {
        return moment(new Date()).isAfter(time, 'day')
      }
    },
    label: '考试时间'
  },
  {
    itemType: 'slot',
    label: '考生安排',
    prop: 'examList',
    rules: [{ required: true, message: '请选择人员', trigger: 'blur' }],
    options: [],
    span: 24
  }
]
export default {
  name: 'BatchEdit',
  components: {
    SelectUser
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: EventColumns,
      formData: {
        batchNumber: '',
        id: '',
        examList: [],
        examTime: [new Date(), new Date()]
      }
    }
  },
  computed: {
    innnerVisible: {
      get: function() {
        return this.visible
      },
      set: function(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    // 提交
    submit() {
      this.$refs.form.validate().then(() => {
        this.$emit('submit', this.formData)
        this.handleClose()
      })
    },
    handleClose() {
      this.innnerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
