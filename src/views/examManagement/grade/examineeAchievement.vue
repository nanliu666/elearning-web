<template>
  <div class="fill">
    <page-header
      title="查看考生成绩"
      show-back
    >
      <template
        v-if="!isOnline"
        slot="rightMenu"
      >
        <div class="handle__button">
          <el-button
            style="margin-right: 20px"
            size="medium"
            @click="downloadModel"
          >
            下载导入模板
          </el-button>
          <el-upload
            accept=".xls,.xlsx"
            action=""
            :http-request="exportScore"
            :show-file-list="false"
            :auto-upload="true"
          >
            <el-button
              size="medium"
              type="primary"
            >
              导入成绩
            </el-button>
          </el-upload>
        </div>
      </template>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="tableColumns | columnsFilter(columnsVisible)"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="tableLoading"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="transitionBox">
            <div class="searchBox">
              <div class="search-box">
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  :has-slot-right="searchConfig.hasSlotRight"
                  @submit="handleSearch"
                >
                  <template>
                    <div style="display: inline-block; margin-left: 20px">
                      <span>考试通过条件：</span>
                      <span>{{
                        `${
                          passType == 1
                            ? `${passScope}分`
                            : `${((totalScope * passPercentage) / 100).toFixed(2)}分`
                        }以上`
                      }}</span>
                    </div>
                    <div
                      v-if="!isOnline"
                      style="display: inline-block; margin-left: 20px"
                    >
                      <span>试卷总分：</span>
                      <span>{{ `${totalScope ? `${totalScope}分` : '改卷未设置总分'}` }}</span>
                    </div>
                  </template>
                </search-popover>
                <div
                  class="refresh-container"
                  @click="loadTableData"
                >
                  <span class="icon el-icon-refresh-right" />
                  <span class="refresh-text">刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                  style="margin-left: 10px"
                >
                  <el-checkbox-group
                    v-model="columnsVisible"
                    style="display: flex; flex-direction: column"
                  >
                    <el-checkbox
                      v-for="item in tableColumns"
                      :key="item.prop"
                      :label="item.prop"
                      :disabled="item.prop === 'examName'"
                      class="originColumn"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <i
                    slot="reference"
                    class="el-icon-setting"
                    style="cursor: pointer"
                  />
                </el-popover>
              </div>
            </div>
          </div>
        </template>
        <template slot="multiSelectMenu">
        </template>
        <template #name="{ row }">
          <el-link
            type="primary"
            style="line-height: 22px"
          >
            {{ row.name }}
          </el-link>
        </template>
        <template #handler="{ row }">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleEdit(row)"
            >
              修改
            </el-button>
          </div>
        </template>
      </common-table>
      <examineeDialog
        v-if="visible"
        :visible.sync="visible"
        :row="row"
        :is-online="isOnline"
        @loadData="loadTableData"
      ></examineeDialog>
    </basic-container>
  </div>
</template>

<script>
import { exportToExcel } from '@/util/util'
import {
  getExamineeAchievement,
  getPaperinfo,
  getOfflineExamineeAchievement,
  exportModel,
  importOffline
} from '@/api/examManagement/achievement'
import SearchPopover from '@/components/searchPopOver/index'
import { getorganizationNew } from '@/api/org/org'
import examineeDialog from './compoments/examineeDialog'
import moment from 'moment'
// 离线配置
const OFFLINE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    fixed: true,
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phoneNumber',
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 150,
    formatter: (row) => (row.orgName ? row.orgName : '无部门')
  },
  {
    label: '成绩',
    slot: true,
    prop: 'score',
    minWidth: 120
  },
  {
    label: '是否通过',
    prop: 'isPass',
    minWidth: 120,
    formatter: (row) => {
      return (
        {
          1: '是',
          0: '否'
        }[row.isPass] || ''
      )
    }
  }
]
// 由于后端要求前端更换，所以搞出一个总的配置表，用于列的显示
const TATOL_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    fixed: true,
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phoneNumber',
    minWidth: 120
  },
  {
    label: '姓名',
    prop: 'name',
    fixed: true,
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phoneNum',
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 150,
    formatter: (row) => (row.orgName ? row.orgName : '无部门')
  },
  {
    label: '考试时间',
    prop: 'examTime',
    minWidth: 350
  },
  {
    label: '答卷时间（分钟）',
    prop: 'answerTime',
    minWidth: 150,
    formatter: (row) => {
      const timeList = _.split(row.examTime, '~')
      const timeDiff = Math.ceil(moment(timeList[1]).diff(moment(timeList[0]), 'seconds') / 60)
      return timeDiff
    }
  },
  {
    label: '成绩',
    slot: true,
    prop: 'score',
    minWidth: 120
  },
  {
    label: '是否通过',
    prop: 'isPass',
    minWidth: 120,
    formatter: (row) => {
      return (
        {
          1: '是',
          0: '否'
        }[row.isPass] || ''
      )
    }
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 120,
    formatter: (row) => {
      return (
        {
          1: '已发布',
          2: '已提交',
          3: '已阅卷',
          4: '考试中',
          5: '阅卷中'
        }[row.status] || ''
      )
    }
  }
]
// 在线配置
const ONLINE_COLUMNS = [
  {
    label: '姓名',
    prop: 'name',
    fixed: true,
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'phoneNum',
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 150,
    formatter: (row) => (row.orgName ? row.orgName : '无部门')
  },
  {
    label: '考试时间',
    prop: 'examTime',
    minWidth: 350
  },
  {
    label: '答卷时间（分钟）',
    prop: 'answerTime',
    minWidth: 150,
    formatter: (row) => {
      const timeList = _.split(row.examTime, '~')
      const timeDiff = Math.ceil(moment(timeList[1]).diff(moment(timeList[0]), 'seconds') / 60)
      return timeDiff
    }
  },
  {
    label: '成绩',
    slot: true,
    prop: 'score',
    minWidth: 120
  },
  {
    label: '是否通过',
    prop: 'isPass',
    minWidth: 120,
    formatter: (row) => {
      return (
        {
          1: '是',
          0: '否'
        }[row.isPass] || ''
      )
    }
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 120,
    formatter: (row) => {
      return (
        {
          1: '已发布',
          2: '考试中',
          3: '已提交',
          4: '阅卷中',
          5: '已阅卷'
        }[row.status] || ''
      )
    }
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: false,
  showIndexColumn: false,
  enablePagination: false,
  enableMultiSelect: true, // TODO：关闭批量删除
  handlerColumn: {
    minWidth: 150
  }
}
// 答卷状态: 1-已发布 2-考试中 3-已提交 4-阅卷中 5-已阅卷
const status = [
  { label: '已发布', value: '1' },
  { label: '考试中', value: '2' },
  { label: '已提交', value: '3' },
  { label: '阅卷中', value: '4' },
  { label: '已阅卷', value: '5' }
]
// const SEARCH_CONFIG =
export default {
  name: 'ExamineeAchievement',
  components: { SearchPopover, examineeDialog },
  filters: {
    // 过滤不可见的列
    columnsFilter: (columns, visibleColProps) =>
      _.filter(columns, ({ prop }) => _.includes(visibleColProps, prop))
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  data() {
    return {
      uploadList: [],
      passType: 1,
      passScope: 60,
      passPercentage: 80,
      totalScope: 100,
      row: {},
      visible: false,
      page: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TATOL_COLUMNS,
      columnsVisible: _.map(TATOL_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'search',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入考生姓名或手机搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'treeSelectNew',
            field: 'orgId',
            label: '所属部门',
            data: '',
            config: {
              selectParams: {
                placeholder: '请输入内容',
                multiple: false
              },
              treeParams: {
                data: [],
                'check-strictly': true,
                'default-expand-all': false,
                'expand-on-click-node': false,
                clickParent: true,
                load: this.loadSelectTreeFn,
                lazy: true,
                filterable: false,
                props: {
                  isLeaf: (data) => {
                    return !data.hasChildren
                  },
                  children: 'children',
                  label: 'orgName',
                  disabled: 'disabled',
                  value: 'orgId'
                }
              }
            }
          },
          {
            type: 'numInterval',
            field: 'minAchievement,maxAchievement',
            data: {},
            label: '成绩',
            options: [],
            config: { optionLabel: 'name', optionValue: 'userId' },
            loading: false,
            noMore: false
          },
          {
            type: 'select',
            field: 'status',
            label: '答卷状态',
            data: '',
            options: status
          },
          {
            type: 'select',
            field: 'isPass',
            label: '是否通过',
            data: '',
            options: [
              { value: '1', label: '是' },
              { value: '0', label: '否' }
            ]
          }
        ],
        hasSlotRight: true
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  computed: {
    // general在线模式，offline线下模式
    isOnline() {
      return _.get(this.$route, 'query.examPattern') === 'general'
    }
  },
  watch: {
    isOnline: {
      handler(val) {
        // 在线配置
        if (val) {
          this.tableColumns = ONLINE_COLUMNS
        } else {
          this.tableColumns = OFFLINE_COLUMNS
          const statusFieldIndex = _.findIndex(this.searchConfig.popoverOptions, {
            field: 'status'
          })
          this.searchConfig.popoverOptions.splice(statusFieldIndex, 1)
        }
      },
      deep: true,
      immediate: true
    }
  },
  activated() {
    this.loadTableData()
    this.getOrgTree()
    getPaperinfo({ examId: this.$route.query.id }).then((res) => {
      const { passPercentage, passScope, passType, totalScope } = res
      this.passType = passType
      this.passScope = passScope
      this.passPercentage = passPercentage
      this.totalScope = totalScope
    })
  },
  methods: {
    async loadSelectTreeFn(node, resolve) {
      //  懒加载下拉树数据
      if (this.$refs.tree != undefined) this.checkedKeys = this.$refs.tree.getCheckedKeys()
      let params = { parentId: node.data && node.data.id ? node.data.id : '0' }
      getorganizationNew(params).then((res) => {
        // res.map(val=>val.hasChildren=true)
        resolve(res)
      })
      if (this.$refs.tree != undefined) this.$refs.tree.setCheckedKeys(this.checkedKeys)
    },

    downloadModel() {
      exportModel({ examId: this.$route.query.id }).then((res) => {
        exportToExcel(res)
      })
    },
    exportScore(file) {
      this.tableLoading = true
      let formdata = new FormData()
      formdata.append('file', file.file)
      formdata.append('examId', this.$route.query.id)
      importOffline(formdata)
        .then(() => {
          this.tableLoading = false
          this.loadTableData()
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    /**
     * 获取用人部门
     */
    getOrgTree() {
      // getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
      //   this.searchConfig.popoverOptions[0].config.treeParams.data = res
      // })
    },
    handleEdit(row) {
      this.row = _.cloneDeep(row)
      this.visible = true
    },
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.loadTableData()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.loadTableData()
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        const loadFun = this.isOnline ? getExamineeAchievement : getOfflineExamineeAchievement
        loadFun(
          _.assign(params, {
            pageNo: this.page.currentPage,
            pageSize: this.page.pageSize,
            id: this.$route.query.id
          })
        ).then((res) => {
          const { data, totalNum } = res
          this.tableData = data
          this.page.total = totalNum
          this.tableLoading = false
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    // 搜索
    handleSearch(params) {
      // const orgNameIds = _.join(params.orgId, ',')
      const orgNameIds = params.orgId
      let tempParams = _.cloneDeep(params)
      tempParams.orgId = orgNameIds
      this.searchParams = tempParams
      this.page.currentPage = 1
      this.loadTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
.handle__button {
  display: flex;
}

.originColumn {
  height: 25px;
}

.transitionBox {
  position: relative;
  height: 50px;
}

.searchBox {
  position: absolute;
  width: 100%;

  i {
    color: #a0a8ae;
    font-size: 18px;
  }

  .search-box {
    display: flex;
    align-items: center;

    .search-sort-box {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;

      .sort-text {
        color: #a0a8ae;
        margin-left: 6px;
        font-size: 14px;
      }

      &::before {
        position: absolute;
        content: '';
        top: 3px;
        right: 0px;
        width: 0.5px;
        height: 80%;
        background-color: #a0a8ae;
      }
    }
  }

  > div {
    display: flex;

    :first-child {
      flex: 1;
    }

    > button {
      height: 34px;
    }
  }
}

/deep/ .avue-crud__pagination {
  height: 0px;
}

.newOrgDailog {
  .el-select {
    width: 100%;
  }
}

/deep/ .avue-crud__pagination {
  display: none;
}

.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
</style>
