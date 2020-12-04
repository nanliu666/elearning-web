<template>
  <div
    ref="HandmadeTestPaper"
    class="HandmadeTestPaper"
  >
    <page-header
      title="新建手工试卷"
      show-back
    />
    <basic-container block>
      <div class="content">
        <div class="title">
          基础信息
        </div>
        <commonForm
          ref="form"
          :model="form"
          class="form"
          :columns="columns"
        >
          <template #isMulti>
            <div>
              <el-switch
                v-model="form.isMulti"
                inactive-text="单项变为不定项选择"
              >
              </el-switch>
            </div>
          </template>
          <template #isShowScore>
            <div>
              <el-switch
                v-model="form.isShowScore"
                inactive-text="试卷上显示试题分数"
              >
              </el-switch>
            </div>
          </template>
        </commonForm>
        <div class="title flex flex-justify-between">
          <div>
            试题设置:
            <span
              class="tip"
            >（当前总分数{{ TotalScore }}分<span
              v-if="form.totalScore"
            >，剩余分数：{{ score }}分</span>）</span>
          </div>
          <div>
            <el-button
              size="medium"
              type="primary"
              @click="handleAddType"
            >
              添加体型
            </el-button>
          </div>
        </div>
        <div
          v-for="block in testPaper"
          :key="block.id"
          class="block"
        >
          <themeBlock
            :data="block"
            :length="testPaper.length"
            @delete="handleDeleteBlock"
          ></themeBlock>
        </div>
      </div>
    </basic-container>
  </div>
</template>

<script>
import themeBlock from './components/themeBlock'

const BASE_COLUMNS = [
  {
    prop: 'name',
    itemType: 'input',
    label: '试卷名称',
    span: 11,
    maxlength: 32,
    required: false
  },
  {
    prop: 'categoryId',
    itemType: 'select',
    label: '试卷分类',
    span: 11,
    offset: 2,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ],
    required: true
  },
  {
    prop: 'totalScore',
    itemType: 'input',
    maxlength: 32,
    label: '计划总分',
    span: 11,
    required: true,
    props: {
      onlyNumber: true
    }
  },
  {
    prop: 'isScore',
    itemType: 'radio',
    label: '是否折算成计划分数',
    span: 11,
    offset: 2,
    required: true,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 }
    ]
  },
  {
    prop: 'isMulti',
    itemType: 'slot',
    label: '',
    span: 11,
    required: false
  },
  {
    prop: 'isShowScore',
    itemType: 'slot',
    label: '',
    span: 11,
    offset: 2,
    required: false,
    props: {}
  },
  {
    prop: 'expiredTime',
    itemType: 'datePicker',
    label: '过期时间',
    type: 'datetime',
    span: 11,
    required: true,
    props: {
      label: 'label',
      value: 'value'
    }
  },
  {
    prop: 'remark',
    itemType: 'input',
    label: '备注',
    type: 'textarea',
    span: 24,
    maxlength: 32,
    required: false
  }
]
export default {
  name: 'HandmadeTestPaper',
  components: {
    themeBlock
  },
  data() {
    return {
      columns: BASE_COLUMNS,
      TotalScore: '',
      score: '',
      form: {},
      typeList: [
        {
          label: '单选题',
          value: '1'
        },
        {
          label: '多选题',
          value: '2'
        },
        {
          label: '填空题',
          value: '3'
        },
        {
          label: '简答题',
          value: '4'
        }
      ],
      themeBlock: {
        id: 1
      },
      testPaper: []
    }
  },
  mounted() {
    this.testPaper.push(_.cloneDeep(this.themeBlock))
  },
  methods: {
    handleDeleteBlock(data) {
      this.testPaper = this.testPaper.filter((it) => it.id !== data.id)
    },
    handleAddType() {
      this.themeBlock.id += 1
      this.testPaper.push(_.cloneDeep(this.themeBlock))
      this.$nextTick(() => {
        let scroll = this.$refs.HandmadeTestPaper
        scroll.scrollTop = scroll.scrollHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}

.title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
  padding-right: 30px;

  .tip {
    /*font-weight: 400;*/
    font-size: 14px;
  }
}

.content {
  max-width: 896px;
  margin: 0 auto;

  .form {
  }

  .table {
  }
}
.block {
  margin-bottom: 60px;
}
</style>
