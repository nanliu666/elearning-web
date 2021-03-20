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
import { getAllCatalog } from '@/api/learnPlan'
import { filterTree } from '@/util/util'
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
        // {
        //   prop: 'coursePlanNo',
        //   itemType: 'input',
        //   label: '课程安排编号',
        //   maxlength: 32,
        //   required: true
        // },
        {
          prop: 'coursePlanName',
          itemType: 'input',
          label: '线上必修计划名称',
          maxlength: 32,
          required: true
        },
        {
          itemType: 'treeSelect',
          label: '所属分类',
          prop: 'categoryId',
          offset: 4,
          props: {
            selectParams: {
              placeholder: '请选择分类',
              multiple: false
            },
            treeParams: {
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              data: [],
              filterable: false,
              props: {
                children: 'list',
                label: 'name',
                value: 'id'
              },
              required: true
            }
          },
          required: false
        },
        {
          prop: 'timeRange',
          itemType: 'datePicker',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          type: 'daterange',
          label: '学习时间',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          required: true
        },
        {
          prop: 'automaticIntegralCount',
          itemType: 'switch',
          label: '自动计算学分',
          required: false,
          offset: 4
        },
        {
          prop: 'sponsor',
          itemType: 'input',
          label: '主办单位',
          maxlength: 32,
          required: false
        }
        // {
        //   prop: 'creatorName',
        //   itemType: 'input',
        //   label: '创建者',
        //   offset: 4,
        //   required: false
        // },
        // {
        //   prop: 'createTime',
        //   itemType: 'datePicker',
        //   type: 'datetime',
        //   valueFormat: 'yyyy-MM-dd HH:mm:ss',
        //   label: '创建时间',
        //   required: false
        // },
      ],
      categoryData: []
    }
  },
  watch: {
    'model.categoryId': {
      immediate: true,
      handler(val) {
        const node = filterTree(this.categoryData, (node) => node.id === val, true)[0]
        if (node) {
          this.$set(this.model, 'categoryName', node.label)
        }
      }
    },
    $route(to) {
      if (to.path === '/learnPlan/CoursePlanList') {
        this.$refs.form.resetFields()
      }
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
      getAllCatalog().then((res) => {
        const data = res
        this.categoryData = data
        this.columns.find((it) => it.prop === 'categoryId').props.treeParams.data = data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
