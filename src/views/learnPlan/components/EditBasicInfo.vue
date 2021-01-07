<template>
  <!-- 基本信息页面 -->
  <basic-container block>
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
          :model="model"
          :columns="columns"
        ></common-form>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getCatalogs } from '@/api/learnPlan'
export default {
  props: {
    model: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'coursePlanNo',
          itemType: 'input',
          label: '课程安排编号',
          required: true
        },
        {
          prop: 'coursePlanName',
          itemType: 'input',
          label: '课程安排名称',
          required: false,
          offset: 4
        },
        {
          prop: 'timeRange',
          itemType: 'datePicker',
          type: 'daterange',
          label: '时间范围',
          required: true
        },
        {
          prop: 'automaticIntegralCount',
          itemType: 'switch',
          label: '自动计算积分',
          required: false,
          offset: 4
        },
        {
          prop: 'endDate',
          itemType: 'datePicker',
          label: '学习计划截止日期',
          required: false
        },
        {
          prop: 'courseCatalogId',
          itemType: 'select',
          label: '所属分类',
          options: [],
          props: {
            label: 'name',
            value: 'id'
          },
          offset: 4,
          required: true
        },
        {
          prop: 'creatorName',
          itemType: 'input',
          label: '创建者',
          required: false
        },
        {
          prop: 'createTime',
          itemType: 'datePicker',
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
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
      ],
      categoryData: []
    }
  },
  created() {
    this.getCategoryData()
  },

  methods: {
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
      getCatalogs().then((res) => {
        this.categoryData = res
        this.columns[5].options = res
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
