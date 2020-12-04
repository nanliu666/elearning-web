<template>
  <div>
    <div class="formContent">
      <div class="flex flex-justify-between">
        <div>
          <label class="label"> <span class="islabel">*</span>试题类型</label>
          <el-select
            v-model="form.type"
            style="width: 200px"
            placeholder="请选择试题类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="flex flex-flow">
          <div class="add">
            添加试题
          </div>
          <div
            :class="[length === 1 ? 'delete' : 'add']"
            @click="handleDeleteBlock"
          >
            删除试题
          </div>
        </div>
      </div>
      <div class="flex flex-flow flexcenter">
        <label class="label">大题标题</label>
        <el-input
          v-model="form.title"
          placeholder="请填写大题标题"
        ></el-input>
      </div>
      <div>
        <common-table
          id="demo"
          ref="table"
          class="table"
          :columns="columnsVisible | columnsFilter"
          :config="tableConfig"
          :data="tableData"
        >
          <template #score="{row}">
            <el-input
              v-model="row.score"
              placeholder="请输入内容"
              type="Number"
              @change="questionChange($event, row)"
            >
            </el-input>
            <div
              v-if="valid && !row.score"
              class="valid"
            >
              请输入
            </div>
          </template>
          <template #handler="{row}">
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              上移
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              下移
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </common-table>
      </div>
    </div>
  </div>
</template>

<script>
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: true,
  enablePagination: false,
  enableMultiSelect: false, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}
const TABLE_COLUMNS = [
  {
    label: '题目列表',
    prop: 'type',
    slot: true,
    minWidth: 150
  },
  {
    label: '分数',
    prop: 'score',
    slot: true,
    minWidth: 120
  },
  {
    label: '答题限时',
    prop: 'limitTime',
    align: 'center',
    slot: true,
    minWidth: 120
  }
]
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
  name: 'ThemeBlock',
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    length: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
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
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      columns: BASE_COLUMNS,
      valid: false,
      tableData: [
        {
          id: '1',
          type: 1,
          score: '',
          limitTime: '5:00:00'
        }
      ]
    }
  },
  watch: {
    data: {
      handler() {},
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleDeleteBlock() {
      this.$emit('delete', this.data)
    },
    handleDelete(row) {
      this.tableData = this.tableData.filter((it) => it.id !== row.id)
      this.questionChange()
    },
    questionChange() {}
  }
}
</script>

<style lang="scss" scoped>
.formContent {
  background: #fafafa;
  padding: 24px;
  > div {
    margin-bottom: 22px;
  }
}
.islabel {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
label {
  margin-right: 20px;
  min-width: 70px;
  text-align: right;
  display: inline-block;
}
.add {
  font-size: 14px;
  color: #01aafc;
  letter-spacing: 0;
  line-height: 22px;
  cursor: pointer;
  margin-left: 17px;
}
.delete {
  font-size: 14px;
  color: rgba(0, 11, 21, 0.25);
  letter-spacing: 0;
  line-height: 22px;
  cursor: pointer;
  margin-left: 17px;
}
</style>
