<template>
  <div class="agreement-view">
    <div
      class="header"
      @click="$router.back()"
    >
      <i class="el-icon-arrow-left"> </i>
      <span class="title">{{ $route.query.name || '培训服务协议' }}</span>
    </div>

    <div class="body">
      <div class="data-wrapper">
        <ul class="data-list">
          <li class="data-item">
            <div class="desc">
              培训项目
            </div>
            <div
              class="data"
              :title="data.trainName"
            >
              {{ data.trainName }}
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              人均费用(元)
            </div>
            <div class="data">
              {{ '￥ ' + data.costBudgetAvg }}
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              服务年限
            </div>
            <div class="data">
              {{ ageLimit }} 年
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              协议日期
            </div>
            <div class="data">
              {{ getAgreementDate(data) }}
            </div>
          </li>
        </ul>
      </div>

      <div class="filter-container">
        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="queryForm.name"
                clearable
                size="medium"
                placeholder="输入学员姓名搜索"
                suffix-icon="el-icon-search"
                :maxlength="32"
              ></el-input>
            </div>

            <el-popover
              v-model="queryFormVisible"
              :offset="650"
              placement="bottom-end"
              transition="false"
            >
              <el-form
                ref="queryForm"
                :rules="queryFormRules"
                label-position="left"
                :inline="true"
                :model="queryForm"
                class="filter-form"
                label-width="80px"
                style="padding: 24px;"
              >
                <el-form-item label="所属部门">
                  <el-cascader
                    ref="orgCascade"
                    v-model="queryForm.orgId"
                    style="width: 202px"
                    placeholder="请选择所属部门"
                    :options="departmentData"
                    :props="{ checkStrictly: true, label: 'orgName', value: 'orgId' }"
                    :show-all-levels="false"
                    clearable
                    @change="handleOrgChange"
                  ></el-cascader>
                </el-form-item>

                <el-form-item label="用户岗位">
                  <!-- <el-cascader
                    ref="deptCascade"
                    v-model="queryForm.position"
                    style="width: 202px"
                    placeholder="请选择岗位"
                    :options="orgData"
                    :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                    :show-all-levels="false"
                    clearable
                    @change="handleDeparmentChange"
                  ></el-cascader> -->
                  <!-- 下拉搜索 岗位-->
                  <lazy-select
                    :ref="positionConfig.field"
                    v-model="positionConfig.data"
                    :load="positionConfig.load"
                    :option-list.sync="positionConfig.optionList"
                    :placeholder="positionConfig.placeholder"
                    :option-props="positionConfig.optionProps"
                    :searchable="positionConfig.searchable"
                    @select="positionChange"
                  />
                </el-form-item>

                <el-form-item label="签订状态">
                  <el-select
                    v-model="queryForm.status"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in [
                        { label: '未签订', value: '1' },
                        { label: '已签订', value: '2' },
                        { label: '违约', value: '3' }
                      ]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <div style="text-align: right; margin-right: 75px">
                  <el-button
                    type="primary"
                    size="medium"
                    :disabled="loading"
                    @click.native="resetPageAndGetList"
                  >
                    搜索
                  </el-button>
                  <el-button
                    size="medium"
                    @click.native="resetQueryForm"
                  >
                    重置
                  </el-button>
                </div>
              </el-form>
              <el-button
                slot="reference"
                size="medium"
                icon="icon-basics-filter-outlined"
                :disabled="loading"
              >
                筛选
              </el-button>
            </el-popover>
          </div>
        </div>
      </div>

      <div class="table-container">
        <div style="margin-bottom: 8px; height:21px;">
          <div v-if="multipleSelection.length">
            <span>{{ `已选中${multipleSelection.length}项` }}</span>
            <span
              style="
                display: inline-block;
                width: 1px;
                margin: 0 8px;
                vertical-align: middle;
                background-color: #dcdfe6;
              "
            ></span>
            <el-button
              v-if="getMultipleStatus()"
              type="text"
              style="padding: 0"
              @click="
                () =>
                  handleStatusEdit(
                    getMultipleStatus() == 'sign' ? { signDate: false } : { signDate: true }
                  )
              "
            >
              {{ getMultipleStatus() == 'sign' ? '批量签订' : '批量违约' }}
            </el-button>
          </div>
        </div>

        <el-table
          ref="table"
          v-loading="loading"
          :data="list"
          height="50vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            align="left"
            prop="workNo"
            :show-overflow-tooltip="true"
            label="用户编号"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            align="left"
            prop="name"
            :show-overflow-tooltip="true"
            label="姓名"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            align="left"
            prop="orgName"
            :show-overflow-tooltip="true"
            label="所在部门"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.orgName || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="positionName"
            :show-overflow-tooltip="true"
            label="岗位"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.positionName || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            prop="signDate"
            label="签订日期"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ getDate(scope.row.signDate) }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            label="协议日期"
            min-width="220"
          >
            <template slot-scope="scope">
              {{ getAgreementDate(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            prop="breakDate"
            label="违约日期"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ getDate(scope.row.breakDate) }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            prop="breakAmount"
            label="违约金"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.breakAmount || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :show-overflow-tooltip="true"
            prop="idNo"
            label="身份证号"
            min-width="220"
          >
            <template slot-scope="scope">
              {{ scope.row.idNo || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="操作"
            fixed="right"
            width="180"
          >
            <template slot-scope="scope">
              <el-button
                v-p="AGREEMENT_VIEW_EDIT"
                type="text"
                size="medium"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-p="AGREEMENT_VIEW_STATUS"
                type="text"
                size="medium"
                @click="handleStatusEdit(scope.row)"
              >
                {{ scope.row.signDate ? '违约' : '签订' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>

    <el-dialog
      destroy-on-close
      :title="statusForm.signDate ? '违约' : '签订'"
      :visible.sync="statusDialogVisible"
      width="650px"
    >
      <el-form
        v-if="statusForm.id"
        label-position="left"
        inline
        class="demo-table-expand"
      >
        <el-form-item label="姓名">
          <span>{{ statusForm.name }}</span>
        </el-form-item>
        <el-form-item label="所在部门">
          <span>{{ statusForm.orgName }}</span>
        </el-form-item>
        <el-form-item label="用户岗位">
          <span>{{ statusForm.positionName }}</span>
        </el-form-item>
        <el-form-item label="协议日期">
          <span>{{ getAgreementDate(statusForm) }}</span>
        </el-form-item>
      </el-form>
      <div v-else>
        已选 {{ multipleSelection.length }} 人
      </div>
      <el-form
        ref="statusForm"
        label-position="top"
        :rules="statusFormRules"
        :model="statusForm"
      >
        <el-form-item
          v-if="!statusForm.signDate"
          label="签订日期"
          prop="signTime"
        >
          <el-date-picker
            v-model="statusForm.signTime"
            :clearable="false"
            placeholder="请选择签订日期"
            style="width: 100%;"
            format="yyyy-MM-dd"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="statusForm.signDate"
          label="违约日期"
          prop="breakTime"
        >
          <el-date-picker
            v-model="statusForm.breakTime"
            :clearable="false"
            format="yyyy-MM-dd"
            placeholder="请选择违约日期"
            style="width: 100%;"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="statusForm.signDate"
          label="违约金额(元)"
          prop="breakAmount"
        >
          <el-input-number
            v-model="statusForm.breakAmount"
            :precision="1"
            :min="0"
            class="coin"
            placeholder="请输入违约金额"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="statusDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="statusLoading"
          @click="handleStatusConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      destroy-on-close
      title="编辑协议日期"
      :visible.sync="editDialogVisible"
      width="450px"
    >
      <el-form
        ref="editForm"
        label-position="top"
        :model="editForm"
        :rules="editFormRules"
      >
        <el-form-item
          label="协议日期"
          prop="dateRange"
        >
          <el-date-picker
            v-model="editForm.dateRange"
            style="width: 100%;"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="editDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          size="medium"
          @click="handleEditConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import { getStationParent } from '@/api/system/station'
import {
  getTrainAgreement,
  editTrainAgreementUser,
  trainAgreementBreak,
  trainAgreementSign
} from '@/api/agreement'

import { AGREEMENT_VIEW_EDIT, AGREEMENT_VIEW_STATUS } from '@/const/agreement'

import { getOrgTreeSimple } from '@/api/org/org'
import { queryStation } from '@/api/system/station'

export default {
  name: 'Management',
  components: {
    Pagination,
    lazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  data() {
    return {
      positionConfig:{
        data: '',
        field: 'positionId',
        label: '岗位',
        type: 'lazySelect',
        optionList: [],
        placeholder: '请选择岗位',
        optionProps: {
          formatter: (item) => `${item.name}(${item.fullOrg?item.fullOrg:'暂无'})`,
          key: 'name',
          value: 'id'
        },
        load: (p)=>{
          p.name = p.search
          return getStationParent(p)
        },
        remote:true,
        searchable: true,
        config: { optionLabel: 'name', optionValue: 'id' }
    },
      multipleSelection: [],
      editLoading: false,
      statusLoading: false,
      queryFormVisible: false,
      initForm: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        name: '',
        position: '',
        orgId: '',
        status: ''
      },
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        name: '',
        position: '',
        orgId: '',
        status: ''
      },
      queryFormRules: {},
      loading: false,
      list: [],
      departmentData: [],
      orgData: [],
      total: 0,
      editDialogVisible: false,
      statusDialogVisible: false,
      editForm: {
        dateRange: []
      },
      editFormRules: {
        dateRange: [
          {
            trigger: 'change',
            required: true,
            message: '请选择协议起始日期'
          }
        ]
      },
      statusForm: {
        signDate: '',
        signTime: '',
        breakTime: '',
        breakAmount: ''
      },
      statusFormRules: {
        breakAmount: [{ trigger: 'blur', message: '请输入违约金额', required: true }]
      }
    }
  },
  computed: {
    AGREEMENT_VIEW_EDIT: () => AGREEMENT_VIEW_EDIT,
    AGREEMENT_VIEW_STATUS: () => AGREEMENT_VIEW_STATUS,

    data() {
      return this.$route.query
    },
    ageLimit() {
      const { agreementStartTime, agreementEndTime } = this.data

      const diff = agreementEndTime - agreementStartTime

      return Math.round(diff / 31536000000)
    }
  },
  watch: {
    'queryForm.name': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  },
  activated() {
    //清空岗位数据
    this.positionConfig.data= ""
    this.queryForm.id = this.data.id
    this.getData()
  },
  methods: {
    //选择了岗位回调
    async positionChange(val){
        this.queryForm.position = val.id
        if (this.$refs.deptCascade) {
          this.$refs.deptCascade.dropDownVisible = false
        }
    },
    handleOrgChange(data) {
      this.queryForm.orgId = data[data.length - 1]
      if (this.$refs.orgCascade) {
        this.$refs.orgCascade.dropDownVisible = false
      }
    },
    handleDeparmentChange(data) {
      this.queryForm.position = data[data.length - 1]
      if (this.$refs.deptCascade) {
        this.$refs.deptCascade.dropDownVisible = false
      }
    },
    getMultipleStatus() {
      const list = this.multipleSelection
      // return 'break'
      if (list.every((item) => item.signDate)) {
        return 'break'
      } else if (list.every((item) => !item.signDate)) {
        return 'sign'
      } else {
        return false
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getAgreementDate(item) {
      const { agreementStartTime, agreementEndTime } = item
      if (!agreementStartTime || !agreementEndTime) return ''
      const startTime = new Date(+agreementStartTime)
      const endTime = new Date(+agreementEndTime)

      return startTime.toLocaleDateString() + ' - ' + endTime.toLocaleDateString()
    },
    getDate(d) {
      if (!d) return '--'
      const date = new Date(+d)
      return date.toLocaleDateString()
    },
    resetQueryForm() {
      this.queryForm = { ...this.initForm, id: this.queryForm.id }
      //清空岗位数据
      this.positionConfig.data = ''
    },
    resetPageAndGetList() {
      this.queryForm.pageNo = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    handleEdit(item) {
      const { agreementStartTime = '', agreementEndTime = '', id } = item
      this.editForm.dateRange = [agreementStartTime, agreementEndTime]
      this.editForm.id = id
      this.editDialogVisible = true
    },
    handleEditConfirm() {
      const { dateRange, id: ids } = this.editForm
      let [startTime, endTime] = dateRange
      startTime = startTime + ''
      endTime = endTime + ''
      this.editLoading = true
      editTrainAgreementUser({
        ids,
        startTime,
        endTime
      })
        .then(() => {
          this.$message.success('操作成功')
          this.editDialogVisible = false
          this.getList()
        })
        .catch((err) => {
          this.$message.error(err)
        })
        .finally(() => {
          this.editLoading = false
        })
    },
    async handleStatusConfirm() {
      const { id, signTime, breakTime, breakAmount, signDate } = this.statusForm
      let request,
        params = {
          ids: id ? id : this.multipleSelection.map((item) => item.id).join(',')
        }
      if (signDate) {
        request = trainAgreementBreak
        params.breakTime = breakTime
        params.breakAmount = breakAmount
      } else {
        request = trainAgreementSign
        params.signTime = signTime
      }

      this.statusLoading = true
      request(params)
        .then(() => {
          this.getList()
          this.$message.success('操作成功')
          this.statusDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(err)
        })
        .finally(() => {
          this.statusLoading = false
        })
    },
    formValidate(formName) {
      return new Promise((resolve) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },
    handleStatusEdit(item) {
      if (item.id) {
        Object.keys(item).forEach((key) => {
          this.statusForm[key] = item[key]
        })
      } else {
        this.statusForm = {
          signDate: item.signDate,
          breakTime: '',
          signTime: ''
        }
      }
      let date = Date.now()
      let { breakTime, signTime } = this.statusForm
      let time
      if (item.signDate) {
        if (breakTime) {
          breakTime = new Date(breakTime)
          time = breakTime.getTime()
        } else {
          time = date
        }
        this.statusForm.breakTime = time
      } else {
        if (signTime) {
          signTime = new Date(signTime)
          time = signTime.getTime()
        } else {
          time = date
        }
        this.statusForm.signTime = time
      }
      this.statusDialogVisible = true
    },
    getData() {
      this.getList()
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.departmentData = res
      })
      queryStation().then((res) => {
        this.orgData = res
      })
    },
    getList() {
      if (this.loading) return
      this.loading = true
      getTrainAgreement(this.queryForm)
        .then((res = {}) => {
          const { data = [], totalNum = 0 } = res
          this.list = data
          this.total = totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetFormAndGetList() {
      this.queryForm = { ...this.initForm }
      this.getList()
    },
    pagination({ page, limit }) {
      this.queryForm.pageNo = page
      this.queryForm.pageSize = limit
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.agreement-view {
  .el-input-number {
    &.coin {
      position: relative;
      &:before {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 15px;
        transform: translate(-50%, -50%);
        font-size: 12px;
        content: '￥';
        z-index: 111;
      }
      .el-input__inner {
        padding-left: 25px;
      }
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid #f6f6f6;
  }
  .demo-table-expand {
    font-size: 0;
    margin-left: 6px;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    display: block;
    margin-right: 0;
    margin-bottom: 0;
  }

  .column-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table th.gutter {
    display: table-cell !important;
  }

  .el-table colgroup.gutter {
    display: table-cell !important;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-form-item {
    margin-right: 20px;
  }
  .operate-wrapper .operate-left .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }

  .filter-form {
    .el-form-item__label {
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.agreement-view {
  .header {
    width: fit-content;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 29px 0 21px;
    i {
      color: #8c9195;
      font-size: 16px;
    }
    .title {
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: rgba(0, 11, 21, 0.85);
      margin-left: 8px;
    }
  }
  .body {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;
    .data-list {
      display: flex;

      margin-bottom: 24px;
      border-bottom: 1px solid #ebeced;
      .data-item {
        cursor: default;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        flex: 1;
        height: 80px;
        width: 0;
        .desc {
          opacity: 0.45;
          font-size: 14px;
          color: #000b15;
          margin-bottom: 8px;
        }
        .data {
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          margin-bottom: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .unit {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            margin-left: 6px;
          }
        }
        .intro {
          .intro-item {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            font-weight: 600;
            &:first-child {
              margin-right: 40px;
            }
            .count {
              display: inline-block;
              vertical-align: bottom;
              max-width: 80px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 12px;
              color: rgba(0, 11, 21, 0.85);
            }
          }
        }
      }
    }

    .filter-container {
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .operate-left {
          display: flex;
          align-items: center;
          .input-wrapper {
            width: 202px;
            margin-right: 10px;
          }
          .filter-btn {
            width: 85px;
          }
        }
        .operate-right {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 10px;
          color: #a0a8ae;
          .fresh-wrap {
            padding-right: 10px;
            border-right: 1px solid #a0a8ae;
            .fresh-btn {
              cursor: pointer;
            }
          }
          .set-btn {
            cursor: pointer;
            margin-left: 10px;
            margin-top: 2px;
          }
        }
      }
    }
    .table-container {
    }
  }
}
</style>
