<template>
  <div class="basicInfo">
    <!-- 基本信息页面 -->
    <basic-container>
      <el-row
        type="flex"
        justify="center"
        style="padding-top:40px;"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <common-form
            ref="form"
            :model="form"
            :columns="columns"
          ></common-form>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        recruitmentId: null,
        name: null,
        sex: null,
        age: null,
        email: null,
        addressArr: [],
        recruitment: null,
        resume: [],
        remark: '',
        orgId: '',
        date: null,
        date1: ''
      },
      columns: [
        {
          prop: 'recruitmentId',
          itemType: 'input',
          label: '课程安排编号',
          required: true
        },
        {
          prop: 'name',
          itemType: 'input',
          label: '课程安排名称',
          required: false,
          offset: 4
        },
        {
          prop: 'sex',
          itemType: 'datePicker',
          label: '时间范围',
          required: true
        },
        {
          prop: 'email',
          itemType: 'switch',
          label: '自动计算积分',
          required: false,
          offset: 4
        },
        {
          prop: 'addressArr',
          itemType: 'datePicker',
          label: '学习计划截止日期',
          required: false
        },
        {
          prop: 'resume',
          itemType: 'select',
          label: '所属分类',
          options: [],
          props: {
            label: 'jobName',
            value: 'id'
          },
          offset: 4,
          required: true
        },
        {
          prop: 'date',
          itemType: 'input',
          label: '创建者',
          required: false
        },
        {
          prop: 'remark',
          itemType: 'datePicker',
          label: '创建时间',
          offset: 4,
          required: false
        },
        {
          prop: 'date1',
          itemType: 'input',
          label: '主办单位',
          required: false
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.basicInfo {
}
</style>
