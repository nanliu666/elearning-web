<template>
  <div class="course">
    <div class="course_in">
      <!-- 内容 -->
      <div class="draft">
        <!-- 表格内容 -->
        <basic-container block>
          <common-table
            ref="table"
            :columns="columnsVisible | columnsFilter"
            :config="tableConfig"
            :data="tableData"
            :page-config="tablePageConfig"
            :page="page"
            @current-page-change="handleCurrentPageChange"
            @page-size-change="handlePageSizeChange"
          >
            <template #topMenu>
              <div class="operations">
                <seach-popover
                  :require-options="searchPopoverConfig.requireOptions"
                  @submit="handleSearch"
                />
                <div class="operations__btns">
                  <el-popover
                    placement="bottom"
                    width="40"
                    trigger="click"
                  >
                    <el-tooltip
                      slot="reference"
                      class="operations__btns--tooltip"
                      content="显隐"
                      effect="dark"
                      placement="top"
                    >
                      <el-button
                        class="operations__btns--item"
                        size="mini"
                        type="text"
                        icon="el-icon-setting"
                        style="color:#acb3b8;"
                      >
                        <!-- <i class="iconfont iconicon_setting" /> -->
                      </el-button>
                    </el-tooltip>

                    <!-- 设置表格列可见性 -->
                    <div class="operations__column--visible">
                      <el-checkbox-group v-model="columnsVisible">
                        <el-checkbox
                          v-for="item of tableColumns"
                          :key="item.prop"
                          :disabled="item.prop === 'name'"
                          :label="item.prop"
                          class="operations__column--item"
                        >
                          {{ item.label }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-popover>
                </div>
              </div>
            </template>

            <template #multiSelectMenu="{ selection }">
              <el-button
                style="margin-bottom:0;"
                type="text"
                @click="() => handleRemoveItems(selection)"
              >
                批量删除
              </el-button>
            </template>

            <!-- 培训名称 -->
            <template
              slot="trainName"
              slot-scope="{ row }"
            >
              <el-button
                type="text"
                @click="toTrainingDetail(row.id)"
              >
                {{ row.trainName }}
              </el-button>
            </template>

            <!-- 状态 -->
            <template
              slot="status"
              slot-scope="{ row }"
            >
              <span v-if="row.status === 0">已办结</span>
              <span v-if="row.status === 1">未开始</span>
              <span v-if="row.status === 2">进行中</span>
            </template>
            <!-- 培训方式 -->
            <template
              slot="trainWay"
              slot-scope="{ row }"
            >
              <span v-if="row.trainWay === 1">面授</span>
              <span v-if="row.trainWay === 2">混合</span>
              <span v-if="row.trainWay === 3">在线</span>
            </template>

            <!-- 标签 -->
            <template
              slot="trainTagList"
              slot-scope="{ row }"
            >
              <span
                v-for="(item, index) in row.trainTagList"
                :key="index"
                class="item_icon"
              >{{
                item
              }}</span>
              <div v-if="row.trainTagList"></div>
            </template>

            <!-- 操作 -->
            <!-- 已发布 -->
            <template
              slot="handler"
              slot-scope="scope"
            >
              <div>
                <!-- 草稿 -->

                <el-button
                  type="text"
                  size="medium"
                  @click.stop="toTrainingEdit(scope)"
                >
                  编辑
                </el-button>
                <span style="color: #a0a8ae;"> &nbsp;&nbsp;|&nbsp;</span>
                <el-button
                  type="text"
                  size="medium"
                  @click.stop="isDraftDel(scope)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </common-table>
        </basic-container>
      </div>
    </div>
  </div>
</template>

<script>
import { getScheduleList, delTrain } from '@/api/training/training'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '培训名称',
    prop: 'trainName',
    width: '200',
    slot: true
  },
  {
    label: '分类',
    prop: 'categoryName',
    minWidth: 160
  },
  {
    label: '培训时间',
    prop: 'trainTime',
    minWidth: 180
  },
  {
    label: '计划人数',
    prop: 'people',
    minWidth: 80
  },
  {
    label: '培训方式',
    prop: 'trainWay',
    slot: true,
    minWidth: 80
  },
  {
    label: '主办单位',
    prop: 'sponsor',
    minWidth: 130
  },
  {
    label: '承办单位',
    prop: 'organizer',
    minWidth: 130
  },
  {
    label: '标签',
    prop: 'trainTagList',
    slot: true,
    minWidth: 200
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 120
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false

  // 树形结构懒加载
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入培训名称搜索' },
    data: '',
    field: 'trainName',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = []
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  // 搜索组件
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },

  data() {
    return {
      idSchedule: '',
      compileNewly: '',
      addId: '',
      // 新建分组&分类
      inputGroupingSon: '',
      inputGrouping: '',
      // nav
      status: 0,
      // tree
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        optionData: ''
      },
      // tree
      filterText: '',
      // 侧栏数据
      data: [],
      input: '',
      isShowinput: false, //显示分组——输入框
      isEdit: false, //显示分类——输入框
      isEditId: '', //显示分类——输入框id
      btnshow: 'false', //新增分类&移动

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格
      query: {
        name: ''
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  created() {
    this.isgetScheduleList()
  },
  activated() {
    // this.loadData()
  },
  methods: {
    toTrainingEdit(scope) {
      this.$router.push({ path: '/training/trainingEdit?id=' + scope.row.id })
    },
    // 去培训详情
    toTrainingDetail(id) {
      this.$router.push({ path: '/training/trainingDetail?id=' + id })
    },

    // 草稿删除
    isDraftDel(scope) {
      let params = { ids: scope.row.id }
      delTrain(params).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.isgetScheduleList()
      })
    },

    isgetScheduleList(param) {
      let params = {
        type: '' //0.已发布、1.草稿
      }
      params.type = 1
      params = { ...params, ...this.page, ...param }
      getScheduleList(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
      })
    },

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.isgetScheduleList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.isgetScheduleList()
    },

    handleSearch(searchParams) {
      this.isgetScheduleList(searchParams)
    },
    handleRemoveItems(selection) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = { ids: '' }
          selection.forEach((item) => {
            params.ids += item.id + ','
          })
          delTrain(params).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.isgetScheduleList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.item_icon {
  padding: 5px;
  background-color: #ccc;
  color: #333;
  margin-left: 10px;
}
#isdialog_show {
  width: 100%;
  height: 100px;
  background-color: #6b6b6b;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px;
  color: #fff;
  position: relative;
  span {
    color: #a0b5fd;
  }
  i {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 22px;
  }
}
.addUser {
  font-size: 14px;
  display: inline-block;
  color: #757c85;
  line-height: 14px;
  cursor: pointer;
  padding-right: 12px;
  border-right: 0.5px solid #e9e9e9;
}
.icon {
  margin-left: 12px;
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
.course_in {
  width: 100%;
  position: relative;
  background-color: #fff;
  .select_bar {
    height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    span {
      height: 50px;
      line-height: 50px;
      margin-left: 30px;
    }
    .select {
      border-bottom: 2px solid #1677ff;
    }
  }
  .draft {
    padding: 0 25px;
    margin-top: -20px;
  }
}
.dialog {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  .el-icon-close {
    position: absolute;
    top: 35px;
    right: 35px;
    font-size: 35px;
    color: #fff;
  }
  .guide {
    p {
      font-size: 20px;
      text-align: center;
      margin-bottom: 45px;
    }
    .box_all {
      display: flex;
      .bxo {
        position: relative;
        width: 150px;
        height: 150px;
        border: 1px solid #fff;
        .bxo_x {
          position: absolute;
          top: -30px;
          right: 75px;
          width: 1px;
          height: 210px;
          background-color: #fff;
          transform: rotate(45deg);
        }
        .bxo_y {
          position: absolute;
          top: -30px;
          right: 74px;
          width: 1px;
          height: 210px;
          background-color: #fff;
          transform: rotate(135deg);
        }
        .number {
          position: absolute;
          top: 65px;
          right: 65px;
          background-color: #616263;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
        }
      }
      .arrows {
        position: relative;
        width: 220px;
        height: 150px;
        .el-icon-caret-right {
          font-size: 30px;
          position: absolute;
          top: 65px;
          right: 28px;
        }
        .wire {
          position: absolute;
          top: 78px;
          right: 45px;
          width: 130px;
          height: 5px;
          background-color: #fff;
        }
      }
    }
    .describe {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      span {
        width: 150px;
        text-align: center;
      }
    }
    .btn_b {
      margin-top: 45px;
      text-align: center;
    }
  }
}
/deep/ #recommend {
  position: relative;
  /deep/ .icon_rec {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-45deg);
    font-size: 10px !important;
    text-align: center;
    line-height: 24px;
  }
  /deep/ #triangle_topleft {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: 30px solid #d6dcfd;
    border-right: 30px solid transparent;
  }
  /deep/ #recommend_info {
    padding-left: 15px;
  }
}
/deep/.page-wrap[data-v-793409ea] {
  margin-right: 70px;
}
</style>
<style lang="sass" scoped>

/deep/.el-input
  width: 100%
/deep/.el-select
  width: 100%
/deep/.el-input

.operations__btns
    color: #acb3b8
    display: flex;
.text_refresh
    color: #acb3b8
    margin-right: 20px
$color_icon: #A0A8AE

.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
  // 添加一个分隔号 "｜"
  .table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
      text-align: center
      padding: 0 8px
      margin-left: 0px
      position: relative
      &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
