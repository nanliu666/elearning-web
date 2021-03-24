<template>
  <el-drawer
    size="60%"
    :append-to-body="true"
    title="预定情况"
    :visible.sync="innnerVisible"
  >
    <div class="wrapper">
      <common-table
        id="demo"
        ref="table"
        :columns="tableColumns"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="top__container">
            <search-popover
              ref="searchPopover"
              :require-options="searchConfig.requireOptions"
              :popover-options="searchConfig.popoverOptions"
              @submit="handleSearch"
            />
            <div class="operations__right">
              <div class="spot__container">
                <span class="spot spot__green"></span>
                <span class="spot__title">授课时间</span>
              </div>
              <div class="spot__container">
                <span class="spot spot__red"></span>
                <span class="spot__title">已占用</span>
              </div>
            </div>
          </div>
        </template>
        <template
          v-for="item in timeQuantum"
          :slot="item.prop"
          slot-scope="{ row, column }"
        >
          <div
            :key="item.prop"
            :class="getTimeClass(row, column)"
          >
            {{ column.label }}
          </div>
        </template>
      </common-table>
    </div>
  </el-drawer>
</template>

<script>
import { getBookList } from '@/api/train/train'
const TABLE_CONFIG = {
  rowKey: 'id',
  showIndexColumn: false,
  border: true,
  enablePagination: true
}
const TABLE_COLUMNS = [
  {
    label: '教室名称',
    fixed: true,
    prop: 'roomName',
    width: 130
  },
  {
    label: '容纳人数',
    prop: 'maxCapacity',
    fixed: true,
    width: 100,
    formatter: (row) => {
      return row.maxCapacity ? row.maxCapacity : '不限制'
    }
  },
  {
    label: '投影仪',
    prop: 'hasProjector',
    fixed: true,
    width: 70,
    formatter: (row) => {
      return row.hasProjector ? '有' : '没有'
    }
  }
]
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'search',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入教室名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'input',
      field: 'roomAddr',
      label: '教室地址',
      data: ''
    }
  ]
}
import SearchPopover from '@/components/searchPopOver/index'
import moment from 'moment'
const TIME_CYCLE = 30 // 以30分钟为一个周期
export default {
  name: 'ClassroomReserve',
  components: { SearchPopover },
  props: {
    params: { type: Object, default: () => ({}) },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableConfig: TABLE_CONFIG,
      timeQuantum: [],
      tableColumns: TABLE_COLUMNS,
      searchConfig: SEARCH_CONFIG
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
  watch: {
    params: {
      handler(val) {
        if (val.todoDate) {
          this.loadTableData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initSetting()
  },
  methods: {
    getTimeClass(row, column) {
      return `time__container ${
        _.some(row.showLabel, (item) => {
          return _.includes(item, column['label'])
        })
          ? 'spot__red'
          : 'spot__green'
      } `
    },
    initSetting() {
      // 以半小时为刻度，范围为06:00-23:00。一共17个小时
      const endTime = moment('23: 00', 'HH:mm')
      const starTime = moment('06: 00', 'HH:mm')
      let diff = endTime.diff(starTime, 'minutes')
      let num = Math.ceil(diff / TIME_CYCLE)
      for (let i = 1; i <= num; i++) {
        this.timeQuantum.push({
          label: starTime
            .clone()
            .add((i - 1) * TIME_CYCLE, 'minutes')
            .format('HH:mm'),
          prop: `time${i}`,
          slot: true,
          showOverflowTooltip: false,
          width: 60
        })
      }
      this.tableColumns = [...TABLE_COLUMNS, ...this.timeQuantum]
    },
    close() {
      this.innnerVisible = false
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.loadTableData()
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    // 处理教室的使用时间，将类似['06:00-07:00', '09-10:00']的数据转化成['06:00', '06:30', '09:00', '09:30']
    handleUseTime() {
      _.each(this.tableData, (row) => {
        _.set(row, 'showLabel', [])
        if (!_.isEmpty(row.reservedTodoTime)) {
          // [6-7 9-12]
          _.each(row.reservedTodoTime, (item) => {
            const timeRange = _.split(item, '-')
            const startTime = moment(`${this.params.todoDate} ${timeRange[0]}`)
            const endTime = moment(`${this.params.todoDate} ${timeRange[1]}`)
            const diffInterval = endTime.diff(startTime, 'minutes') / TIME_CYCLE
            let startIndex = null
            _.each(this.timeQuantum, (timeItem, index) => {
              // 第一个元素为起点
              if (timeRange[0] === timeItem.label) {
                startIndex = index
              }
              if (_.isNumber(startIndex)) {
                // 当前的index以及index+diffInterval之内的被占领,计算到一个开区间时间轴如['06:00', '07:00')
                if (startIndex <= index && index < startIndex + diffInterval) {
                  row.showLabel.push(timeItem.label)
                }
              }
            })
          })
        }
      })
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        const params = _.assign(this.queryInfo, { todoDate: this.params.todoDate })
        let { totalNum, data } = await getBookList(params)
        this.tableData = data
        this.handleUseTime()
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$red: #f97272;
$green: #c1e9c8;
.wrapper {
  margin-top: -40px;
  padding: 20px;
  .top__container {
    display: flex;
    justify-content: space-between;
    .operations__right {
      display: flex;
      .spot__container {
        display: flex;
        align-items: center;
        margin-left: 20px;
        .spot {
          width: 16px;
          height: 16px;
          border-radius: 100%;
          margin-right: 10px;
        }
      }
    }
  }
  .time__container {
    width: calc(100% + 20px);
    margin-left: -10px;
    color: transparent;
  }
  .spot__green {
    background-color: $green;
  }
  .spot__red {
    background-color: $red;
  }
}
</style>
