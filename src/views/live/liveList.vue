<template>
  <div class="fill">
    <page-header title="直播列表">
      <el-button
        slot="rightMenu"
        type="primary"
        size="medium"
        @click="toEstablishCourse"
      >
        创建直播
      </el-button>
    </page-header>

    <!-- 表格 -->
    <basic-container block>
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible | columnsFilter"
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
                  @submit="handleSearch"
                />
                <div
                  class="refresh-container"
                  @click="loadTableData"
                >
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
                      :disabled="item.prop === 'examName'"
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
        <template
          slot="index"
          slot-scope="{ row }"
        >
          <span>{{ tableData.indexOf(row) + 1 }}</span>
        </template>

        <template v-slot:isUsed="{ row }">
          <span v-show="row.isUsed == 1">正常</span>
          <span v-show="row.isUsed == 0">禁用</span>
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleLock(row)"
            >
              <span v-show="row.isUsed == 1">禁用</span>
              <span v-show="row.isUsed == 0">启用</span>
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(tableData, row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>
<script>
import SearchPopover from '@/components/searchPopOver/index'
import { getcategoryTree } from '@/api/live/editLive'
import {
  getLiveList,
  delLive,
  toggleLiveStatus,
  getLiveStatus,
  getCreateUserId
} from '@/api/live/liveList'

const TABLE_COLUMNS = [
  {
    label: '序号',
    prop: 'index',
    width: '70',
    slot: true
  },
  {
    label: '直播编号',
    prop: 'liveNo'
  },
  {
    label: '直播标题',
    prop: 'channelName',
    slot: true
  },
  {
    label: '所属分类',
    prop: 'categoryName',
    slot: true
  },
  {
    label: '包含课程',
    prop: 'courses'
  },
  {
    label: '创建人',
    slot: true,
    prop: 'creatorName'
  },
  {
    label: '状态',
    slot: true,
    prop: 'isUsed'
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
  name: 'LiveList',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      // 分页
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableLoading: false,
      // 搜索和筛选
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'titleOrNo',
            label: '',
            data: '',
            options: [],
            config: { placeholder: '输入直播标题或编号搜索', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: [
          {
            type: 'treeSelect',
            // data多选是数组单选是字符串
            data: '',
            label: '所属分类',
            field: 'categoryId',
            config: {
              multiple: true,
              selectParams: {
                placeholder: '请选择'
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
                  label: 'name',
                  disabled: 'disabled',
                  value: 'id'
                }
              }
            }
          },
          {
            type: 'select',
            field: 'creatorId',
            label: '创建人',
            data: '',
            options: [],
            config: { optionLabel: 'name', optionValue: 'id', placeholder: '请选择' }
          },
          {
            type: 'select',
            field: 'isUsed',
            label: '状态',
            data: '',
            options: [
              { value: '', label: '全部' },
              { value: '1', label: '正常' },
              { value: '0', label: '禁用' }
            ]
          }
        ]
      },
      tableData: [],
      createUserList: [],
      liveClassification: []
    }
  },
  activated() {
    // 加载数据
    this.loadTableData()
    // 获取所有直播创建人列表
    getCreateUserId({
      source: 'live'
    }).then((res) => {
      this.createUserList = res
      this.searchConfig.popoverOptions[1].options = res
    })
    //   获取直播分类
    getcategoryTree({
      source: 'live'
    }).then((res) => {
      this.searchConfig.popoverOptions[0].config.treeParams.data = res
      console.log(res)
    })
  },
  methods: {
    /**
     * @author guanfenda
     * @desc 加载第几页方法
     * @params param 页数
     * */
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.loadTableData()
    },
    /**
     * @author guanfenda
     * @desc 加载数据一次多少条
     * @params 加载一次的数量
     * */
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.loadTableData()
    },
    handleSearch(searchParams) {
      this.loadTableData(searchParams)
    },
    // 加载函数
    /**
     * @author guanfenda
     * @desc 加载table数据
     *
     * */
    async loadTableData(searchParams) {
      if (this.tableLoading) {
        //防抖
        return
      }
      try {
        var params = {}
        if (searchParams) {
          params.titleOrNo = searchParams.titleOrNo
          params.categoryId = searchParams.categoryId
          params.isUsed = searchParams.isUsed
          params.creatorId = searchParams.creatorId
        }
        this.tableLoading = true
        getLiveList(_.assign(params, this.page, { pageNo: this.page.currentPage })).then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
          this.tableLoading = false
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    },
    handleEdit(row) {
      getLiveStatus({
        liveId: row.liveId
      }).then((res) => {
        if (res) {
          this.$alert('该直播正在进行，请直播结束后再尝试。', '提醒', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.$router.push({ path: '/live/editLive', query: { id: row.liveId } })
        }
      })
    },
    // 直播禁用/启用控制方法，根据不同的状态进行弹窗提示
    handleLock(row) {
      if (row.isUsed == 1) {
        this.$confirm('禁用后，该直播对讲师和学员将不可见，您确定要禁用该直播吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getLiveStatus({
            liveId: row.liveId
          }).then((res) => {
            // 如果有在进行的直播进行禁用提示
            if (res) {
              this.$confirm(
                '该直播正在进行，禁用后，该直播对讲师和学员将不可见，您确定要禁用该直播吗？',
                '提醒',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                toggleLiveStatus({
                  isUsed: 1,
                  liveId: row.liveId
                }).then(() => {
                  row.isUsed = 0
                })
              })
            } else {
              toggleLiveStatus({
                isUsed: 0,
                liveId: row.liveId
              }).then(() => {
                row.isUsed = 0
              })
            }
          })
        })
      } else {
        this.$confirm('启用后，该直播对讲师和学员将可见，您确定要启用该直播吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          toggleLiveStatus({
            isUsed: 1,
            liveId: row.liveId
          }).then(() => {
            row.isUsed = 1
          })
        })
      }
    },
    handleDelete(arr, row) {
      getLiveStatus({
        liveId: row.liveId
      }).then((res) => {
        if (res) {
          this.$alert('该直播正在进行，请直播结束后再尝试。', '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          this.$confirm(
            '删除后，直播相关的信息，直播回放将会删除，您确认要删除该直播吗？',
            '提醒',
            {
              confirmButtonText: '确定',
              type: 'warning'
            }
          ).then(() => {
            delLive({ liveId: row.liveId }).then(() => {
              var index = arr.findIndex((item) => item.liveId == row.liveId)
              arr.splice(index, 1)
            })
          })
        }
      })
    },
    toEstablishCourse() {
      this.$router.push({ path: '/live/editLive' })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
.search_box button {
  line-height: initial;
  margin: 0 15px;
}
.fl_r {
  float: right;
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
.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
</style>
