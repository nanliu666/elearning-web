<template>
  <div class="Menu fill">
    <page-header title="证书管理">
      <template slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
          @click="toAddCertificate"
        >
          新建模板
        </el-button>
      </template>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <SearchPopover
              ref="searchPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations-right">
              <div
                class="refresh-container"
                @click="loadTableData"
              >
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <i
                  slot="reference"
                  style="cursor: pointer;"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
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

        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="multipleDeleteClick(selection)"
          >
            批量删除
          </el-button>
        </template>

        <!-- 状态 -->
        <template #status="{row}">
          {{ row.status === 0 ? '停用' : '正常' }}
        </template>

        <template #handler="{row}">
          <el-button
            v-if="row.status"
            type="text"
            @click.stop="blockStart(row.id, 0)"
          >
            停用
          </el-button>
          <span
            v-else
            class="startBtn"
            @click.stop="blockStart(row.id, 1)"
          >启用 &nbsp; </span>
          <!-- 预览框 -->
          <el-tooltip
            placement="top"
            effect="light"
          >
            <div
              slot="content"
              class="preview"
            >
              <div class="previewTitle">
                <span>预览</span>
              </div>
              <div class="previewContent">
                <div class="preview_right_box">
                  <img
                    :src="preview.backUrl"
                    alt=""
                    class="bgimg"
                  />
                  <div class="name">
                    {{ preview.name }}
                  </div>
                  <div class="text">
                    {{ preview.text }}
                  </div>
                  <img
                    v-if="preview.logoUrl"
                    :src="preview.logoUrl"
                    alt=""
                    class="logo"
                  />
                  <div class="studentName">
                    张三
                  </div>
                  <div class="serial">
                    <div>证书编号:</div>
                    <div>YB-20201130-0001</div>
                    <div>{{ preview.createTime }}</div>
                  </div>
                </div>
              </div>
              <!-- <div class="previewBtn">
                <el-button>取消</el-button>
                <el-button type="primary">
                  确定
                </el-button>
              </div> -->
            </div>
            <el-button type="text">
              <span @mouseover="previewMouseOver(row.id)">预览</span>
            </el-button>
          </el-tooltip>

          <el-button
            type="text"
            @click="handleRemove(row.id)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import {
  getCertificateList,
  getSingleCertificate,
  updateStatus,
  delTemplate
} from '@/api/certificate/certificate'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '编号',
    width: 70,
    type: 'index'
  },
  {
    label: '模板名称',
    width: 180,
    prop: 'name'
  },
  {
    label: '文案',
    prop: 'text',
    width: 300
  },
  {
    label: '颁发机构',
    prop: 'awardAgency',
    minWidth: 100
  },
  {
    label: '状态',
    slot: true,
    prop: 'status',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入模板名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'input',
    field: 'agency',
    label: '颁发机构',
    data: ''
    // config: { optionLabel: 'name', optionValue: 'id' }
  },
  {
    type: 'select',
    field: 'status',
    label: '状态',
    data: '',
    options: [
      { value: 0, label: '停用' },
      { value: 1, label: '正常' }
    ]
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = [
  {
    label: '移动到新目录',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 24,
    props: {
      selectParams: {
        placeholder: '请选择所在目录',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        required: true
      }
    }
  }
]
export default {
  name: 'KnowledgeManagement',
  components: {
    SearchPopover
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      preview: {},
      moveKnowledgeRow: {},
      formColumns: FORM_COLUMNS,
      formData: {
        catalogId: ''
      },
      dialogTableVisible: false,
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        status: '',
        name: '',
        agency: ''
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  activated() {
    // this.initSearchData()
    this.refreshTableData()
  },
  methods: {
    // 去新建证书
    toAddCertificate() {
      this.$router.push({ path: '/certificate/addCertificate' })
    },
    // 批量删除
    multipleDeleteClick(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      // 提示
      this.$confirm('您确定要删除选中的类目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delTemplate({ templateIds: selectedIds.join(',') })
          this.$message.success('删除成功')
          this.loadTableData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除
    handleRemove(id) {
      // 提示
      this.$confirm('您确定要删除选中的类目吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTemplate({ templateIds: id }).then(() => {
            this.$message.success('删除成功')
            this.loadTableData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 停用&启用
    blockStart(id, i) {
      let info = `${
        i
          ? '您确定要启用该学分规则吗？'
          : '您确定要停用该学分规则吗？停用后，该学分规则将暂停使用。'
      }`

      this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateStatus({ templateId: id, choice: i }).then(() => {
            this.$message.success(`${i ? '启用' : '停用'}成功`)
            this.loadTableData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //   预览Btn
    previewMouseOver(id) {
      getSingleCertificate({ templateId: id }).then((res) => {
        this.preview = res
      })
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
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      for (let i in searchParams) {
        this.queryInfo[i] = searchParams[i]
      }
      this.loadTableData()
    },
    // 跳去详情
    jumpDetail({ id }) {
      this.$router.push({
        path: '/repository/knowledgeDetail',
        query: { id }
      })
    },
    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData()
    },
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        let { totalNum, data } = await getCertificateList(this.queryInfo)
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        // window.console.log(error)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.startBtn {
  color: #d7d7d7;
  cursor: pointer;
}

.preview_right_box {
  position: relative;
  border: 1px solid #d9dbdc;
  margin-top: 15px;
  width: 100%;
  height: 100%;
  .bgimg {
    width: 100%;
    height: 100%;
    z-index: -1;
    background-repeat: no-repeat;
  }
  .name {
    position: absolute;
    top: 22%;
    left: 50%;
    font-size: 30px;
    font-weight: 700;
    transform: translateX(-50%);
    text-align: center;
    width: 85%;
  }
  .text {
    position: absolute;
    top: 58%;
    left: 50%;
    font-size: 12px;
    font-weight: 700;
    transform: translateX(-50%);
    color: #8b8a8a;
    width: 50%;
    height: 28%;
    text-align: center;
    word-wrap: break-word;
  }
  .logo {
    position: absolute;
    top: 75.6%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px !important;
    height: 40px !important;
  }
  .studentName {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 22px;
    font-weight: 500;
  }
  .serial {
    position: absolute;
    right: 9%;
    bottom: 9%;
    color: #8b8a8a;
    font-size: 8px;
  }
}

.preview {
  z-index: 999;
  width: 422px;
  height: 370px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0;
  border: 1px solid #ccc;
  margin: -12px;
  padding: 20px;
  .previewTitle {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 28px;
    font-weight: 900;
    display: flex;
    justify-content: space-between;
    height: 40px;
    border-bottom: 1px solid #ebeced;
  }
  .previewContent {
    width: 374px;
    height: 280px;
    overflow: hidden;
    margin-top: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .previewBtn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
.top-button {
  width: 40px;
}
.operations-right {
  i {
    margin-left: 12px;
    font-size: 18px;
    color: #a0a8ae;
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  .refresh-container {
    position: relative;
    display: flex;
    align-items: center;
    color: #a0a8ae;
    padding: 0 10px;
    cursor: pointer;
    span {
      padding-left: 6px;
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
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE
.status-span
    padding: 4px;
    border-radius: 2px;
.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.title
  color: $primaryColor
  cursor: pointer
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
