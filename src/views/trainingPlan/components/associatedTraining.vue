<template>
  <div class="associatedTraining">
    <el-dialog
      :visible="visible"
      width="800px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <!-- 头部插槽 -->
      <div
        slot="title"
        class="dialogTitle"
      >
        关联培训
        <el-divider></el-divider>
      </div>
      <el-form
        ref="commonForm"
        :model="associatedForm"
        label-position="top"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联培训">
              <el-input
                v-model="associatedForm.trainName"
                placeholder="输入培训名称搜索"
                suffix-icon="el-icon-search"
                style="width: 305px"
                clearable
                @input="relatedSearch"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            :offset="4"
          >
            <el-form-item label="培训分类">
              <el-tree-select
                :select-params="treeSeleteConfig.selectParams"
                :tree-params="treeSeleteConfig.treeParams"
                @select-clear="trainTreeSearch"
                @node-click="trainTreeSearch"
              ></el-tree-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 关联表格 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @select="handleSelectionChange"
        @select-all="allSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          label="培训名称"
          prop="trainName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="培训方式"
          prop="trainWay"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              {
                1: '面授',
                2: '混合',
                3: '在线'
              }[scope.row.trainWay]
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="培训类别"
          prop="trainScope"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{
              {
                inside: '内训',
                outer: '外训'
              }[scope.row.trainScope]
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="所在分类"
          prop="categoryName"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.categoryName || '--' }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination
          :current-page.sync="pageConfig.currentPage"
          :page-size="pageConfig.pageSize"
          layout="total, prev, pager, next"
          :total="pageConfig.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <!-- 底部插槽 -->
      <div slot="footer">
        <el-divider></el-divider>
        <el-button
          size="medium"
          @click="handleClose"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="loading"
          @click="handleConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveTrainRel } from '@/api/trainingPlan/trainingPlan'
import { getScheduleList } from '@/api/training/training' // 培训列表
import { getTrainCategoryTree } from '@/api/studyMap/studyMap' // 培训树状分类
export default {
  name: 'AssociatedTraining',
  components: {
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect')
  },
  data() {
    return {
      visible: false,
      loading: false,
      associatedForm: {
        trainName: '',
        trainCategoryId: ''
      },
      //   分页配置
      pageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      treeSeleteConfig: {
        selectParams: {
          placeholder: '请选择分类',
          multiple: false,
          clearable: true
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
            disabled: 'disabled',
            value: 'id'
          }
        }
      },
      tableData: [],
      multipleSelection: [], // 关联的培训id集合
      month: '', // 当前筛选的月份
      planDetailId: '' // 子计划id
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.visible = false
      this.pageConfig.currentPage = 1
      this.multipleSelection = []
    },
    // 切换分页
    async handleSizeChange(val) {
      this.pageConfig.pageSize = val
      await this.getScheduleList()
      this.echo()
    },
    async handleCurrentChange(val) {
      this.pageConfig.currentPage = val
      await this.getScheduleList()
      this.echo()
    },
    // 关联课程搜索
    relatedSearch: _.debounce(function(val) {
      this.pageConfig.currentPage = 1
      this.associatedForm.trainName = val
      this.getScheduleList()
    }, 500),
    // 培训分类搜索
    async trainTreeSearch(data) {
      this.associatedForm.trainCategoryId = data ? data.id : ''
      await this.getScheduleList()
    },
    // 获取培训分类
    async initTrainCategoryTree() {
      //   获取培训分类
      await getTrainCategoryTree().then((res) => {
        this.treeSeleteConfig.treeParams.data = res
      })
    },
    // 获取培训列表
    async getScheduleList() {
      this.loading = true
      let params = {
        pageNo: this.pageConfig.currentPage,
        pageSize: this.pageConfig.pageSize,
        trainName: this.associatedForm.trainName,
        categoryId: this.associatedForm.trainCategoryId,
        type: 0,
        source: '1'
      }
      await getScheduleList(params)
        .then((res) => {
          this.tableData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 单选时触发
    handleSelectionChange(selection, row) {
      let _this = this
      // true就是选中，0或者false是取消选中
      let selected = selection && selection.indexOf(row) !== -1
      if (!selected) {
        _this.multipleSelection.splice(_this.multipleSelection.indexOf(row.id), 1)
      } else {
        _this.multipleSelection.push(row.id)
      }
    },
    // 勾选全选框触发
    allSelectionChange(selection) {
      let _this = this
      // selection有长度则是全选，否则取消全选
      if (selection.length) {
        //   将勾选的数据添加到multipleSelection
        selection.forEach((row) => {
          if (_this.multipleSelection.indexOf(row.id) === -1) {
            _this.multipleSelection.push(row.id)
          }
        })
      } else {
        // 如果是取消勾选，并把当前页数据存在的在multipleSelection中去掉
        _this.tableData.forEach((row) => {
          if (_this.multipleSelection.indexOf(row.id) !== -1) {
            _this.multipleSelection.splice(_this.multipleSelection.indexOf(row.id), 1)
          }
        })
      }
    },
    // 分页数据回显
    echo() {
      let _this = this
      if (!_this.multipleSelection.length || !_this.tableData.length) return
      _this.$nextTick(() => {
        _this.tableData.forEach((row) => {
          if (_this.multipleSelection.indexOf(row.id) !== -1) {
            _this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    // 确认按钮
    async handleConfirm() {
      let params = {
        planDetailId: this.planDetailId,
        trainIds: this.multipleSelection.join(','),
        relatedMonth: this.month
      }
      this.loading = true
      await saveTrainRel(params)
        .then(() => {
          this.$message.success('保存成功')
          this.$emit('initAssociated')
        })
        .finally(() => {
          this.loading = false
          this.handleClose()
        })
    }
  },
  mounted() {
    this.initTrainCategoryTree()
  }
}
</script>

<style lang="scss" scoped>
.associatedTraining {
  .dialogTitle {
    font-size: 20px;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  /deep/ .el-tree-select-input {
    width: 100%;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
