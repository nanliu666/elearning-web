<template>
  <div class="fill">
    <common-table
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
            <div class="table-search">
              <search-popover
                ref="searchPopover"
                class="search-list"
                :require-options="searchConfig.requireOptions"
                :popover-options="searchConfig.popoverOptions"
                @submit="handleSearch"
              />
              <div
                class="search-sort-box"
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
                    v-for="item in columnsVisibleFilter"
                    :key="item.prop"
                    :label="item.prop"
                    :disabled="
                      item.prop == 'selection' ||
                        item.prop == 'studentName' ||
                        item.prop == 'orgName'
                    "
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

      <template #studentName="{ row }">
        <div
          class="ellipsis title"
          @click="handleView(row)"
        >
          {{ row.studentName }}
        </div>
      </template>

      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          type="text"
          icon="el-icon-delete"
          @click="changeImport(selection)"
        >
          批量导出
        </el-button>

        <!-- <el-button
          style="margin-left:20px;"
          type="text"
          icon="el-icon-delete"
          @click="changeSelected(selection)"
        >
          批量出师
        </el-button> -->
      </template>
      <!-- 出师、查看评价、评价,根据字段来判断 -->
      <template #handler="{ row }">
        <div
          v-if="row.operation == '1'"
          class="menuClass"
        >
          <el-button
            type="text"
            @click="handleOpera(row, 'start')"
          >
            出师
          </el-button>
          <el-button
            type="text"
            @click="handleOpera(row)"
          >
            解约
          </el-button>
        </div>

        <div
          v-else
          class="menuClass"
        >
          <el-button
            type="text"
            @click="handleOpera(row)"
          >
            {{ row.operation == '2' ? '评价' : row.operation == '3' ? '查看评价' : '查看' }}
          </el-button>
        </div>
      </template>
    </common-table>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :visible="visible"
      width="550px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <div
        slot="title"
        style="color:#303133;font-size: 18px;"
      >
        <template v-if="isOpera == 'pj'">
          评价徒弟
          <el-tooltip placement="top">
            <i class="el-icon-question"></i>
            <div
              slot="content"
              style="width:250px;"
            >
              优秀：95-100分；良好：85-94分；合格：75-84分；不合格：75分以下。
            </div>
          </el-tooltip>
        </template>

        <template v-if="isOpera == 'viewPj'">
          查看评价
        </template>

        <template v-if="isOpera == 'termin'">
          解约
        </template>

        <template v-if="isOpera == 'view'">
          查看
        </template>
      </div>
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="newOrgDailog"
      >
        <template v-if="isOpera == 'termin'">
          <el-row>
            <el-col>
              <el-form-item label="解约原因">
                <el-input
                  v-model.trim="formData.cancelReason"
                  class="form-item-des"
                  type="textarea"
                  maxlength="200"
                  :rows="4"
                  resize="none"
                  show-word-limit
                  placeholder="请输入解约原因"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="isOpera == 'view'">
          <el-row>
            <el-col>
              <el-form-item label="解约原因">
                <p class="hasContent">
                  {{ formData.cancelReason || '--' }}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="isOpera == 'pj' || isOpera == 'viewPj'">
          <template v-if="(isOpera == 'viewPj' && viewPjEdit) || isOpera == 'pj'">
            <el-row>
              <el-col>
                <el-form-item
                  label="评分："
                  prop="score"
                >
                  <el-input-number
                    v-model="formData.score"
                    style="width:100%"
                    controls-position="right"
                    placeholder="请输入徒弟分数，满分100分"
                    :step="0.5"
                    :min="0.5"
                    :max="100"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                  label="评语："
                  prop="comment"
                >
                  <el-input
                    v-model.trim="formData.comment"
                    class="form-item-des"
                    type="textarea"
                    maxlength="200"
                    :rows="4"
                    resize="none"
                    show-word-limit
                    placeholder="导师暂未评价"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row>
              <el-col>
                <div>
                  评分
                  <span
                    style="display:inline-block;margin-left:12px;"
                  >{{ formData.score || 0 }}分</span>
                </div>
              </el-col>
              <el-col>
                <p>评语</p>
                <div>{{ formData.comment || '--' }}</div>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <template v-if="isOpera === 'viewPj'">
          <el-button
            v-show="viewPjEdit"
            size="medium"
            @click="handleClose"
          >取消</el-button>
          <el-button
            v-show="viewPjEdit"
            type="primary"
            size="medium"
            @click="submit"
          >保存</el-button>

          <el-button
            v-show="!viewPjEdit"
            size="medium"
            @click="pjEdit"
          >编辑</el-button>
        </template>

        <template v-if="isOpera === 'termin'">
          <el-button
            size="medium"
            @click="handleClose"
          >取消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="submit"
          >确定</el-button>
        </template>

        <template v-if="isOpera === 'pj'">
          <el-button
            size="medium"
            @click="handleClose"
          >取消</el-button>
          <el-button
            type="primary"
            size="medium"
            @click="submit"
          >确定</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { studentList, evaluateStudent, updateStatus } from '@/api/resource/teach'
import SearchPopover from '@/components/searchPopOver/index'
import styles from '@/styles/variables.scss'
import myMixins from '@/mixins'
// import {
//   ADD_EXAM_CATALOG,
//   STOP_EXAM_CATALOG,
//   AUTH_EXAM_CATALOG,
//   EDIT_EXAM_CATALOG,
//   DELETE_EXAM_CATALOG,
//   ADD_GROUNP_EXAM_CATALOG
// } from '@/const/privileges'
// import { mapGetters } from 'vuex'
const TABLE_COLUMNS = [
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
    label: '协议期',
    prop: 'agreementStartTime',
    formatter: (row) => {
      return `${row.agreementStartTime}~${row.agreementEndTime}`
    }
  },
  {
    label: '是否出师',
    prop: 'completeStatus',
    formatter: (row) => {
      return row.completeStatus == '0' ? '否' : '是'
    }
  },
  {
    label: '是否解约',
    prop: 'operation',
    formatter: (row) => {
      return row.operation == '4' ? '是' : '否'
    }
  },
  {
    label: '评定等级',
    prop: 'level',
    width: 120,
    formatter: (row) => {
      return row.level == '1'
        ? '优秀'
        : row.level == '2'
        ? '良好'
        : row.level == '3'
        ? '合格'
        : row.level == '4'
        ? '不合格'
        : '--'
    }
  },
  {
    label: '得分',
    prop: 'score'
  }
]
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
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'treeSelect',
    field: 'orgId',
    label: '部门',
    data: '',
    config: {
      selectParams: {
        placeholder: '请选择部门',
        multiple: false
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
          value: 'orgId'
        }
      }
    }
  },
  {
    type: 'treeSelect',
    field: 'positionId',
    label: '岗位',
    data: '',
    config: {
      selectParams: {
        placeholder: '请选择岗位',
        multiple: false
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
          value: 'id'
        }
      }
    }
  },
  {
    field: 'level',
    label: '等级',
    type: 'select',
    data: '',
    options: [
      { label: '全部', value: '' },
      { label: '优秀', value: '1' },
      { label: '良好', value: '2' },
      { label: '合格', value: '3' },
      { label: '不合格', value: '4' }
    ],
    config: { optionLabel: 'label', optionValue: 'value', placeholder: '请选择' }
  },
  {
    field: 'completeStatus',
    label: '是否出师',
    type: 'select',
    data: '',
    options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
    ],
    config: { optionLabel: 'label', optionValue: 'value', placeholder: '请选择' }
  }
]
const searchConfig = {
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS,
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS
}
export default {
  name: 'CatelogManager',
  components: { SearchPopover },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  mixins: [myMixins],
  props: {
    teachId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      downloadLoading: false,
      isOpera: '',
      viewPjEdit: false,
      formData: {},
      rules: {
        score: [{ required: true, message: '请填写评分', trigger: 'blur' }],
        comment: [{ required: true, message: '请填写评语', trigger: 'blur' }]
      },
      visible: false,

      tableLoading: false,
      columnsVisibleFilter: TABLE_COLUMNS.filter((item) => item.label),
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      queryInfo: {
        positionId: '',
        orgId: '',
        level: '',
        completeStatus: '',
        queryCondition: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      activeColor: styles.primaryColor,
      searchConfig
    }
  },
  // computed: {
  //   ADD_EXAM_CATALOG: () => ADD_EXAM_CATALOG,
  //   STOP_EXAM_CATALOG: () => STOP_EXAM_CATALOG,
  //   AUTH_EXAM_CATALOG: () => AUTH_EXAM_CATALOG,
  //   EDIT_EXAM_CATALOG: () => EDIT_EXAM_CATALOG,
  //   DELETE_EXAM_CATALOG: () => DELETE_EXAM_CATALOG,
  //   ADD_GROUNP_EXAM_CATALOG: () => ADD_GROUNP_EXAM_CATALOG,
  //   ...mapGetters(['privileges'])
  // },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    // privileges: {
    //   handler() {
    //     this.tableConfig.showHandler = this.$p([
    //       STOP_EXAM_CATALOG,
    //       AUTH_EXAM_CATALOG,
    //       EDIT_EXAM_CATALOG,
    //       DELETE_EXAM_CATALOG,
    //       ADD_GROUNP_EXAM_CATALOG
    //     ])
    //   },
    //   deep: true
    // }
  },

  mounted() {
    this.handleReset()
    this.$nextTick(() => {
      this.queryInfo.id = this.teachId
      this.loadTableData()
    })
    this.loadTree() //部门
    this.loadPosition() //岗位
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
      _.assign(this.queryInfo, params)
      this.loadTableData(true)
    },
    //搜索重置
    handleReset() {
      this.$refs.searchPopover.resetForm()
      this.searchConfig.requireOptions[0].data = ''
    },
    //查看用户
    handleView(row) {
      this.$router.push({
        path: '/system/userDetail',
        query: { userId: row.userId }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'sex') {
            return v[j] == '1' ? '男' : '女'
          } else if (j === 'agreementStartTime') {
            return `${v.agreementStartTime}~${v.agreementEndTime}`
          } else if (j === 'completeStatus') {
            return v[j] == '0' ? '否' : '是'
          } else if (j === 'operation') {
            return v[j] == '4' ? '是' : '否'
          } else if (j === 'level') {
            return v[j] == '1'
              ? '优秀'
              : v[j] == '2'
              ? '良好'
              : v[j] == '3'
              ? '合格'
              : v[j] == '4'
              ? '不合格'
              : ''
          }
          return v[j]
        })
      )
    },
    //批量导出
    changeImport(selection) {
      if (selection.length < 1) {
        this.$message.warning('暂无数据')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '姓名',
          '所属部门',
          '岗位',
          '性别',
          '协议期',
          '是否出师',
          '是否解约',
          '评定等级',
          '得分'
        ]
        const filterVal = [
          'studentName',
          'orgName',
          'positionName',
          'sex',
          'agreementStartTime',
          'completeStatus',
          'operation',
          'level',
          'score'
        ]
        const list = selection
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '徒弟列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    //批量出师
    // changeSelected(selection){
    //   const ids=[];
    //   selection.forEach((val) => {
    //     if(val.operation=='1'){
    //       ids.push(val.strId);
    //     }
    //   })
    //   const idsStr=ids.join(',');
    //   isExpired({id:idsStr}).then((res)=>{
    //     const content=res.data?"确定所选徒弟可以出师吗？":"您选择的徒弟中包含正在协议期内的徒弟，不能进行出师操作，是否忽略继续出师其他徒弟？";
    //     const confirmText=res.data?'确定':'继续出师';
    //     this.$confirm(content, '提醒', {
    //         confirmButtonText: confirmText,
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         this.startFunc(idsStr);
    //       }).catch(() => {})
    //   })
    // },
    //出师操作
    startFunc(ids) {
      const param = {
        ids,
        completeStatus: 1
      }
      updateStatus(param).then(() => {
        this.loadTableData(true)
        this.$message.success('操作成功')
        this.$refs.table.clearSelection()
      })
    },

    // 出师、解约、查看评价、评价、查看
    handleOpera(row, key) {
      this.formData = {}
      if (row.operation == '1' && key === 'start') {
        //出师
        this.$confirm('确定该徒弟可以出师吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.startFunc(row.strId)
          })
          .catch(() => {})
        return
      }
      if (row.operation == '2') {
        //评价
        this.isOpera = 'pj'
      } else if (row.operation == '3') {
        //查看评价
        this.isOpera = 'viewPj'
        this.$set(this.formData, 'score', row.score)
        this.$set(this.formData, 'comment', row.comment)
      } else if (row.operation == '4') {
        //查看
        this.isOpera = 'view'
        this.$set(this.formData, 'cancelReason', row.cancelReason)
      } else {
        this.isOpera = 'termin' //解约
      }
      this.formData.id = row.strId
      this.visible = true
    },
    pjEdit() {
      this.viewPjEdit = true
    },
    handleClose() {
      if (this.isOpera === 'pj') {
        this.$refs.ruleForm.resetFields()
      }
      this.visible = false
      this.viewPjEdit = false
    },

    //评价提交
    submit() {
      if (this.isOpera === 'pj' || this.isOpera === 'viewPj') {
        //评价、查看评价
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const param = {
              id: this.formData.id,
              comment: this.formData.comment,
              score: this.formData.score
            }
            evaluateStudent(param).then(() => {
              this.$message.success(this.isOpera === 'pj' ? '提交成功' : '修改成功')
              this.loadTableData(true)
              this.handleClose()
            })
          }
        })
        return
      } else if (this.isOpera === 'termin') {
        //解约
        const param = {
          ids: this.formData.id,
          isCancelled: 1,
          cancelReason: this.formData.cancelReason
        }
        updateStatus(param).then(() => {
          this.$message.success('解约成功')
          this.loadTableData(true)
          this.handleClose()
        })
      }
    },

    // 加载函数
    async loadTableData(isLoad) {
      if (this.tableLoading) {
        return
      }
      try {
        if (isLoad) {
          //是否重置分页
          this.$set(this.page, 'currentPage', 1)
        }
        const param = {
          pageNo: this.page.currentPage,
          pageSize: this.page.size,
          ...this.queryInfo
        }
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await studentList(param)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.hasContent {
  margin: 0;
  line-height: 1.7;
}
.title {
  color: $primaryColor;
  cursor: pointer;
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}
.form-item-des {
  /deep/.el-input__count {
    line-height: 1;
  }
}

.searchBox {
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
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
  .table-search {
    display: flex;
    align-items: center;
    .search-list {
      flex: 1;
      /deep/.el-input__inner {
        min-width: 240px;
      }
    }
  }
  .refresh-text {
    padding-left: 6px;
    display: inline-block;
    height: 18px;
    color: #a0a8ae;
  }
}
</style>
