<template>
  <div class="fill">
    <common-table
      ref="table"
      :columns="table.columns"
      :data="table.data"
      :config="tableConfig"
      :page="page"
      :loading="table.loading"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #topMenu>
        <ul class="topMenu-score">
          <li>
            <label>综合得分：</label>
            <span>{{ teachInfo.totalScore || 0 }}</span>
          </li>
          <li>
            <label>徒弟综合评分：</label>
            <span>{{ teachInfo.avgScore || 0 }}</span>
          </li>
          <li>
            <label>部门负责人评分：</label>
            <span>{{ teachInfo.leaderScore || 0 }}</span>
          </li>
          <li>
            <label>部门负责人评语：</label>
            <span>{{ teachInfo.leaderComment || '--' }}</span>
          </li>
        </ul>
        <div class="transitionBox">
          <div class="searchBox">
            <div class="table-search">
              <search-popover
                ref="searchPopover"
                class="search-list"
                :require-options="searchConfig.requireOptions"
                :popover-options="searchConfig.popoverOptions"
                @submit="handleSearch"
              />
            </div>
          </div>
        </div>
      </template>
      <template #studentName="{ row }">
        <div
          class="ellipsis title"
          @click="handleView(row)"
        >
          {{ row.studentName }}
        </div>
      </template>

      <template #handler="{ row }">
        <div class="menuClass">
          <el-button
            type="text"
            @click="handleSee(row)"
          >
            查看评价
          </el-button>
        </div>
      </template>
    </common-table>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      title="查看评价"
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <div
        v-for="(item, index) in seeArray"
        :key="index"
      >
        <p>{{ `${index + 1}.${item.content}` }}</p>
        <el-radio-group
          :value="item.checked"
          readonly
        >
          <el-radio :label="5">
            5分
          </el-radio>
          <el-radio :label="4">
            4分
          </el-radio>
          <el-radio :label="3">
            3分
          </el-radio>
          <el-radio :label="2">
            2分
          </el-radio>
          <el-radio :label="1">
            1分
          </el-radio>
        </el-radio-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { studentList } from '@/api/resource/teach'
import SearchPopover from '@/components/searchPopOver/index'
import styles from '@/styles/variables.scss'
const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  defaultExpandAll: false, //是否默认展开所有行
  showIndexColumn: false, //是否显示序号列
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    width: 120,
    fixed: 'right'
  }
}
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    type: 'input',
    field: 'queryCondition',
    label: '',
    data: '',
    options: [],
    config: { placeholder: '输入徒弟名/手机号搜索', 'suffix-icon': 'el-icon-search' }
  }
]
const searchConfig = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: []
}
export default {
  name: 'Evalua',
  components: { SearchPopover },
  props: {
    teachInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      seeArray: [
        { content: '导师的责任心强、带徒水平高、对我的帮助非常大', checked: 5 },
        { content: '导师每周都有与我做工作及思想方面的交流', checked: 1 },
        { content: '导师给我制定的工作计划非常清晰,我清楚的知道每天的工作任务', checked: 3 },
        { content: '我能感受到导师对本岗位相关知识非常了解', checked: 4 },
        { content: '导师出色的表达和逻辑组织能力，让我更易理解', checked: 2 },
        { content: '我觉得导师的指导非常实用,能够帮助我快速掌握岗位应知应会知识', checked: 2 }
      ],
      tableConfig: TABLE_CONFIG,
      searchConfig,
      visible: false,
      table: {
        loading: false,
        data: [],
        query: {
          id: '',
          queryCondition: ''
        },
        columns: [
          {
            label: '姓名',
            prop: 'studentName',
            fixed: 'left',
            slot: true
          },
          {
            label: '所属部门',
            prop: 'orgName'
          },
          {
            label: '岗位',
            prop: 'positionName'
          },
          {
            label: '性别',
            prop: 'sex',
            width: 80,
            formatter: (row) => {
              return row.sex == '0' ? '女' : '男'
            }
          },
          {
            label: '徒弟打分',
            prop: 'scoreTutor'
          },
          {
            label: '手机号',
            prop: 'phonenum'
          }
        ]
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      activeColor: styles.primaryColor
    }
  },
  mounted() {
    this.handleReset()
    this.table.query.id = this.teachInfo.idStr
    this.loadTableData()
  },
  methods: {
    //处理页码改变
    handleCurrentPageChange(val) {
      this.page.currentPage = val
      this.loadTableData()
    },
    //处理页码大小更改
    handlePageSizeChange(val) {
      this.page.size = val
      this.loadTableData(true)
    },
    // 搜索
    handleSearch(params) {
      _.assign(this.table.query, params)
      this.loadTableData(true)
    },
    //搜索重置
    handleReset() {
      this.searchConfig.requireOptions[0].data = ''
    },
    //查看用户
    handleView(row) {
      this.$router.push({
        path: '/system/userDetail',
        query: {
          userId: row.userId
        }
      })
    },

    handleClose() {
      this.visible = false
    },
    //查看评价
    handleSee(row) {
      let scoreTutorStr = row.scoreList || []
      if (scoreTutorStr.length < 1) {
        scoreTutorStr = [0, 0, 0, 0, 0, 0]
      }
      scoreTutorStr.map((val, index) => {
        this.seeArray[index].checked = parseInt(val)
      })
      this.visible = true
    },

    // 列表
    loadTableData(isLoad) {
      if (isLoad) {
        //是否重置分页
        this.$set(this.page, 'currentPage', 1)
      }
      this.table.loading = true
      const param = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        ...this.table.query
      }
      studentList(param)
        .then((res) => {
          this.$set(this.table, 'data', res.data)
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.table.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.top-menu {
  height: auto;
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.title {
  color: $primaryColor;
  cursor: pointer;
}
.topMenu-score {
  margin: 0px 0 16px;
  font-size: 14px;
  li + li {
    margin-top: 8px;
  }
  li {
    display: flex;
    label {
      color: rgba(0, 11, 21, 0.45);
    }
    span {
      flex: 1;
      word-break: break-all;
    }
  }
}
.transitionBox {
  position: relative;
  height: 50px;
}
.search-list {
  /deep/.el-input__inner {
    min-width: 240px;
  }
}
/deep/.el-dialog__body {
  padding: 16px 30px 30px;
  border-top: 1px solid #eee;
}
</style>
