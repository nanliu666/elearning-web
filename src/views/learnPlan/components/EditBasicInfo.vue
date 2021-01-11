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
          prop: 'categoryId',
          itemType: 'cascader',
          label: '所属分类',
          options: [],
          props: {
            value: 'id',
            emitPath: false
          },
          showAllLevels: false,
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
          prop: 'sponsor',
          itemType: 'input',
          label: '主办单位',
          required: false
        }
      ],
      categoryData: []
    }
  },
  watch: {
    'model.courseCatalogId': {
      immediate: true,
      handler(val) {
        const node = filterTree(this.categoryData, (node) => node.id === val, true)[0]
        if (node) {
          this.$set(this.model, 'courseCatalogName', node.label)
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
        let data = []
        res.group.forEach((item) => {
          if (!item.id) {
            return
          }
          data.push({
            id: item.idStr,
            label: item.name,
            btnshow: 1,
            children: [],
            count: item.count
          })
        })
        data.forEach((item) => {
          let filterArr = res.son.filter((list) => list.parentStr == item.id) || []
          filterArr = filterArr.map((item) => {
            return {
              id: item.idStr,
              parent_id: item.parentStr,
              label: item.name,
              btnshow: 0,
              count: item.count
            }
          })
          filterArr.length > 0 ? (item.children = filterArr) : ''
        })
        this.categoryData = data
        this.columns[5].options = data
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
