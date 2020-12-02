<template>
  <div class="fill">
    <page-header title="查看考生成绩" />

    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="tableLoading"
      >
        <template #topMenu>
          <div class="transitionBox">
            <div class="searchBox">
              <div class="search-box">
                <search-popover
                  ref="searchPopover"
                  :require-options="searchConfig.requireOptions"
                  :popover-options="searchConfig.popoverOptions"
                  @submit="handleSearch"
                />
                <div class="refresh-container">
                  <span class="icon  el-icon-refresh-right" />
                  <span class="refresh-text">刷新</span>
                </div>
                <el-popover
                  placement="bottom"
                  width="40"
                  trigger="click"
                  style="margin-left:10px"
                >
                  <el-checkbox-group
                    v-model="columnsVisible"
                    style="display: flex;flex-direction: column;"
                  >
                    <el-checkbox
                      v-for="item in tableColumns"
                      :key="item.prop"
                      :label="item.prop"
                      :disabled="item.prop === 'orgName'"
                      class="originColumn"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <i
                    slot="reference"
                    class="el-icon-setting"
                    style="cursor: pointer;"
                  />
                </el-popover>
              </div>
            </div>
          </div>
        </template>
        <template slot="multiSelectMenu">
        </template>
        <template #name="{row}">
          <el-link
            type="primary"
            style="line-height: 22px"
          >
            {{ row.name }}
          </el-link>
        </template>
        <template #handler="{row}">
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
      ></examineeDialog>
    </basic-container>
  </div>
</template>

<script>
import { getKnowledgeCatalogList } from '@/api/knowledge/knowledge'
import SearchPopover from '@/components/searchPopOver/index'
import { getOrgTreeSimple } from '@/api/org/org'
import examineeDialog from './compoments/examineeDialog'
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'name',
    slot: true,
    fixed: true,
    minWidth: 150
  },
  {
    label: '手机号码',
    prop: 'status',
    slot: true,
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'creatorName',
    minWidth: 120
  },
  {
    label: '考试时间',
    slot: true,
    prop: 'updateTime',
    minWidth: 120
  },
  {
    label: '答卷时间（分钟）',
    slot: true,
    prop: 'updateTime1',
    minWidth: 150
  },
  {
    label: '成绩',
    slot: true,
    prop: 'updateTime2',
    minWidth: 120
  },
  {
    label: '试卷总分',
    slot: true,
    prop: 'updateTime23',
    minWidth: 120
  },
  {
    label: '是否通过',
    slot: true,
    prop: 'updateTime223',
    minWidth: 120
  },
  {
    label: '状态',
    slot: true,
    prop: 'updateTime2223',
    minWidth: 120
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
export default {
  name: 'ExamineeAchievement',
  components: { SearchPopover, examineeDialog },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      visible: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableLoading: false,
      tableData: [],
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      checkColumn: ['name', 'status', 'creatorName', 'updateTime'],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'name',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入考生姓名或手机搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'treeSelect',
            // data多选是数组单选是字符串
            data: [],
            label: '所在部门',
            field: 'orgs',
            arrField: 'orgId',
            config: {
              multiple: true,
              selectParams: {
                placeholder: '请输入内容',
                multiple: true
              },
              treeParams: {
                data: [],
                'check-strictly': true,
                'default-expand-all': false,
                'expand-on-click-node': false,
                clickParent: true,
                filterable: false,
                props: {
                  children: 'children',
                  label: 'orgName',
                  disabled: 'disabled',
                  value: 'orgId'
                }
              }
            },
            firstLoad(flag, item, callBack) {
              // fage为true，selsec框展开
              if (flag && item.config.treeParams.data.length === 0) {
                item.loadMoreFun(item, callBack)
              }
            },
            loadMoreFun(item, callBack) {
              if (item.loading || item.noMore) return
              item.loading = true
              getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
                if (res.length > 0) {
                  item.config.treeParams.data.push(...res)
                  item.loading = false
                  item.noMore = true
                  callBack(item, res)
                }
              })
            }
          },
          {
            type: 'numInterval',
            field: 'userId',
            data: {},
            label: '成绩',
            options: [],
            config: { optionLabel: 'name', optionValue: 'userId' },
            loading: false,
            noMore: false
          },
          {
            type: 'select',
            field: 'status1',
            label: '答卷状态',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: 0, label: '启用' },
              { value: 1, label: '停用' }
            ]
          },
          {
            type: 'select',
            field: 'status11',
            label: '是否通过',
            data: '',
            options: [
              { value: 1, label: '是' },
              { value: 0, label: '否' }
            ]
          }
        ]
      },
      data: [],
      createOrgDailog: false,
      searchParams: {}
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    handleEdit() {
      this.visible = true
    },

    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        const params = this.searchParams
        this.tableLoading = true
        getKnowledgeCatalogList(params).then((res) => {
          this.tableData = res
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
      this.searchParams = params
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
