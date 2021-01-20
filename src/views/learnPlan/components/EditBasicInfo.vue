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
import { filterTree, handleCatalogsData } from '@/util/util'
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
          maxlength: 32,
          required: true
        },
        {
          prop: 'coursePlanName',
          itemType: 'input',
          label: '课程安排名称',
          maxlength: 32,
          required: true,
          offset: 4
        },
        {
          prop: 'timeRange',
          itemType: 'datePicker',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          type: 'daterange',
          label: '时间范围',
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
          prop: 'categoryId',
          itemType: 'cascader',
          label: '所属分类',
          options: [],
          props: {
            value: 'id',
            emitPath: false
          },
          showAllLevels: false
        },
        {
          prop: 'creatorName',
          itemType: 'input',
          label: '创建者',
          offset: 4,
          required: false
        },
        {
          prop: 'createTime',
          itemType: 'datePicker',
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          label: '创建时间',
          required: false
        },
        {
          prop: 'sponsor',
          itemType: 'input',
          label: '主办单位',
          offset: 4,
          maxlength: 32,
          required: false
        }
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
        const data = handleCatalogsData(res)
        this.categoryData = data
        this.columns[4].options = data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
