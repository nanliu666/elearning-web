<template>
  <!-- 因为A4纸的宽为841.89像素，取大一点就可以了 -->
  <el-dialog
    :title="isEdit ? '编辑关卡' : '添加关卡'"
    :close-on-click-modal="false"
    width="430px"
    append-to-body
    :visible="innerVisible"
    :modal-append-to-body="false"
    @close="handleClose"
    @opened="handleOpen"
  >
    <div>
      <div class="topic__container">
        <commonForm
          ref="form"
          :model="formData"
          :columns="formColumns"
        >
          <template #categoryIds-label-slot>
            <span>
              <span>试题来源</span>
              <span>
                <span>（题库试题总数：</span>
                <span>{{ formData.questionNumTotal }}</span>
                <span> ）</span>
              </span>
            </span>
          </template>
          <template #questionNum-label-slot>
            <span>试卷试题数</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="竞赛时从题库中随机抽取出现的试题数，且不能大于题库试题总数"
              placement="top-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
        </commonForm>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >确定</el-button>
        <el-button
          size="medium"
          @click="handleClose"
        >取消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { getcategoryTree } from '@/api/examManage/category'
import { getQuestionList } from '@/api/examManage/question'

export default {
  name: 'AddTopicDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    topicData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      categoryIdsOptions: [],
      relatedList: [],
      formData: {},
      formColumns: [
        {
          prop: 'type',
          itemType: 'select',
          label: '试题类型',
          options: [
            {
              label: '单选题',
              value: 'single_choice'
            },
            {
              label: '多选题',
              value: 'multi_choice'
            },
            {
              label: '不定项题',
              value: 'not_sure_choice'
            },
            {
              label: '判断题',
              value: 'judgment'
            }
          ],
          span: 24,
          required: true
        },
        {
          itemType: 'cascader',
          hasLabelSolt: true,
          showAllLevels: false,
          label: '',
          span: 24,
          prop: 'categoryIds',
          options: [],
          required: true,
          filterable: true,
          collapseTags: true,
          clearable: true,
          props: {
            multiple: true,
            value: 'id',
            label: 'name'
          }
        },
        {
          prop: 'questionNum',
          hasLabelSolt: true,
          itemType: 'inputNumber',
          min: 0,
          step: 1,
          stepStrictly: true,
          span: 24,
          required: true,
          label: '',
          rules: [
            {
              validator: this.validateTotalQuestionNum,
              trigger: ['change', 'input']
            }
          ]
        }
      ]
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isEdit() {
      return !_.isEmpty(this.topicData)
    }
  },
  watch: {
    'formData.type': {
      handler(val) {
        if (val) {
          this.getTopicCategory(val)
        }
      },
      deep: true,
      immediate: true
    },
    'formData.categoryIds': {
      handler(val) {
        this.calculateTotalNum(val)
      },
      deep: true
    },
    visible: {
      handler(val) {
        if (val) {
          this.formData = Object.create(null)
          // 编辑回填数据
          if (this.isEdit) {
            this.formData = _.cloneDeep(this.topicData)
          } else {
            // 新增需要初始化数据
            const BASIC_DATA = {
              type: 'single_choice',
              categoryIds: [],
              questionNum: '',
              questionNumTotal: 0
            }
            this.formData = _.cloneDeep(BASIC_DATA)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    pickNum(data) {
      const target = _.pick(data, ['relatedNum', 'name', 'id', 'parentId'])
      this.relatedList.push(target)
    },
    /**
     * 拼接深层的id数组，
     * 格式[[最顶级的id，次之id，...，自己的id]]
     */
    initcategoryIds() {
      const deepEditData = _.cloneDeep(this.topicData)
      const { categoryIds } = deepEditData
      // 由于入参只入最末一级id，所以现在回显的数据结构是[['1'], ['2']]，将其展开
      const flattenIds = _.flatten(categoryIds)
      // 存在深层的结构数据
      const hasDeepIdList = _.filter(
        this.relatedList,
        (item) => _.includes(flattenIds, item.id) && item.parentId !== '0'
      )
      // 获取到深层id数组
      const hasDeepId = _.map(hasDeepIdList, 'id')
      // 自己就是第一层id,在返回数据中，除了深层数据，就是表层数据
      const firstIdList = _.difference(flattenIds, hasDeepId)
      // 拼接key为当前id，value为当前父id的值
      const keyToValueMap = new Map()
      const loop = (data) => {
        _.each(data, (item) => {
          if (!_.isEmpty(item.children)) {
            loop(item.children)
          }
          keyToValueMap.set(item.id, item.parentId)
        })
      }
      loop(this.categoryIdsOptions)
      let targetIdList = []

      _.each(hasDeepIdList, (tempItem) => {
        let flag = false
        let compareKey = tempItem.parentId
        let middleIdlist = [tempItem.id, compareKey]
        while (!flag) {
          const targetId = keyToValueMap.get(compareKey)
          // 结束条件是父id为0
          if (targetId != '0') {
            middleIdlist.push(targetId)
            compareKey = targetId
          } else {
            flag = true
          }
        }
        targetIdList.push(_.reverse(middleIdlist))
      })
      _.each(firstIdList, (item) => {
        targetIdList.push([item])
      })
      this.formData.categoryIds = targetIdList
    },
    // 手动拼接数据源格式
    initRelatedSource() {
      const loop = (data) => {
        if (_.isEmpty(data.children)) return

        _.each(data.children, (item) => {
          this.pickNum(item)
          loop(item)
        })
      }
      _.each(this.categoryIdsOptions, (item) => {
        this.pickNum(item)
        loop(item)
      })
    },
    /**
     * 计算试题来源的试题总数
     */
    calculateTotalNum(val) {
      const valList = _.map(val, (item) => {
        let idTemp = ''
        _.forIn(item, (value) => {
          idTemp = value
        })
        return { id: idTemp }
      })
      const sameList = _.intersectionBy(this.relatedList, valList, 'id')
      const relatedNumList = _.map(sameList, 'relatedNum')
      this.formData.questionNumTotal = _.set(_.sum(relatedNumList), 0)
      this.formData.categoryTitles = _.map(sameList, 'name')
      this.validateFieldNum()
    },
    /**
     * 校验试卷试题数
     */
    validateTotalQuestionNum(rule, value, callback) {
      if (value === 0) {
        callback(new Error('试题数必须大于0'))
      }
      if (value > this.formData.questionNumTotal) {
        callback(new Error('所填试题数不能大于题库试题总数'))
      } else {
        callback()
      }
    },
    /**
     * @desc 获取试题来源
     * @param relateType
     * */
    async getTopicCategory(relateType) {
      let params = {
        type: '0',
        relateType: relateType,
        expireStatus: '1'
      }
      const treeData = await getcategoryTree(params)
      // let categoryObject = await this.category(relateType)
      this.categoryIdsOptions = [
        // { id: '-1', name: '未分类', relatedNum: categoryObject.totalNum, parentId: '0' },
        ...treeData
      ]
      const categoryIdsProp = _.find(this.formColumns, { prop: 'categoryIds' })
      categoryIdsProp.options = this.categoryIdsOptions
      // 切换题目类型清空试题数组
      this.relatedList = []
      this.initRelatedSource()
      if (this.isEdit) {
        this.initcategoryIds()
      }
      // 切换试题类型需要重新计算试题总数
      this.calculateTotalNum(this.formData.categoryIds)
    },
    validateFieldNum() {
      // 切换试题类型需要校验试题数量
      if (!_.isEmpty(_.get(this.$refs, 'form')) && !_.isEmpty(this.formData.categoryIds)) {
        this.$refs.form.validateField('questionNum')
      }
    },
    /***
     * @desc 获取未分类
     * */
    category(relateType) {
      let params = {
        status: 'normal',
        pageNo: 1,
        pageSize: 1,
        type: relateType
      }
      return new Promise((resolve, reject) => {
        getQuestionList(params)
          .then((res) => {
            resolve(res)
          })
          .finally(() => {
            reject()
          })
      })
    },
    submit() {
      let tempList = _.cloneDeep(this.formData.categoryIds)
      _.each(this.formData.categoryIds, (item, index) => {
        _.forIn(item, (value) => {
          tempList[index] = [value]
        })
      })
      let params = _.cloneDeep(this.formData)
      params.categoryIds = tempList
      params.handlerType = _.isEmpty(this.topicData)
      this.$refs.form.validate().then(() => {
        this.$emit('submit', params, this.topicData.arrIndex)
        this.handleClose()
      })
    },
    handleClose() {
      this.innerVisible = false
      this.$emit('close')
    },
    handleOpen() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-col {
  position: relative;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-right: 20px;
}
</style>
