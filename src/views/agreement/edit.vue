<template>
  <div class="agreement-edit">
    <div class="header">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
      >
        <el-col :span="7">
          <el-page-header
            content="创建培训协议"
            @back="$router.back()"
          ></el-page-header>
        </el-col>
        <el-col
          :span="6"
          style="margin-bottom: 0;"
        >
          <el-steps
            :active="activeStep"
            align-center
          >
            <el-step
              v-for="(step, index) in steps"
              :key="index"
              :title="step.title"
              :icon="step.icon"
              class="step"
              @click.native="handleStepChange(index + 1)"
            ></el-step>
          </el-steps>
        </el-col>
        <el-col :span="7">
          <el-row style="text-align: right">
            <el-button
              v-if="activeStep > 1"
              size="medium"
              @click="handleStepChange(activeStep - 1)"
            >
              上一步
            </el-button>
            <el-button
              v-if="activeStep < steps.length"
              type="primary"
              size="medium"
              @click="handleStepChange(activeStep + 1)"
            >
              下一步
            </el-button>

            <el-button
              v-if="activeStep === steps.length"
              type="primary"
              size="medium"
              :loading="publishLoading"
              @click="publish"
            >
              发布
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="body">
      <div
        v-show="activeStep === 1"
        class="message"
      >
        <el-form
          ref="form"
          :rules="rules"
          label-position="top"
          :model="form"
        >
          <el-form-item
            label="关联培训"
            prop="trainId"
            class="half-form-item margin-right-120"
          >
            <lazy-select
              v-model="form.trainId"
              :disabled="!!$route.query.trainId"
              :should-init-data="false"
              :remote-method="listTrain"
              :props="{ value: 'id', label: 'trainName' }"
              :init-options="trainOptions"
              @getLabel="(label) => (form.name = label + '协议')"
            />
          </el-form-item>
          <el-form-item
            label="培训协议名"
            prop="name"
            class="half-form-item"
          >
            <el-input
              v-model="form.name"
              disabled
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="协议起始日期"
            prop="agreementStartTime"
            class="half-form-item"
          >
            <el-date-picker
              v-model="form.agreementStartTime"
              style="width: 100%;"
              value-format="timestamp"
              placeholder="请选择协议起始日期"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div
        v-show="activeStep === 2"
        class="person"
      >
        <div class="table-container">
          <div class="table-header">
            <div class="header-left">
              <span class="header-item">
                <span class="desc">人数：</span>
                <span class="data">{{ response.peopleNum }}人</span>
              </span>
              <span class="header-item">
                <span class="desc">人均费用(元)：</span>
                <span
                  class="data"
                >￥{{ $route.query.costBudgetAvg || response.costBudgetAvg }}</span>
              </span>
              <span class="header-item">
                <span class="desc">服务年限:</span>
                <span class="data">{{ $route.query.serviceYear || response.serviceYear }}年</span>
              </span>
            </div>

            <div class="header-right">
              <el-input
                v-model="query.stuName"
                placeholder="请搜索人员"
                clearable
                class="filter-input"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>
          </div>
          <el-table
            v-loading="loading"
            :data="response.page.data"
            height="60vh"
          >
            <el-table-column
              label="用户编号"
              prop="workNo"
            ></el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
            ></el-table-column>
            <el-table-column
              label="所在部门"
              prop="orgName"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.orgName || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="用户岗位"
              prop="positionName"
            >
              <template slot-scope="scope">
                {{ scope.row.positionName || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              label="协议日期"
              width="220"
              show-overflow-tooltip=""
            >
              <template slot-scope="scope">
                {{ getAgreementDate(scope.row) }}
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :total="response.page.totalNum"
            @pagination="pagination"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listTrain, returnTrainUser, save } from '@/api/agreement'
import lazySelect from '@/components/el-lazy-select'
import Pagination from '@/components/common-pagination'
const o_response = {
  peopleNum: '',
  costBudgetAvg: '',
  serviceYear: '',
  page: {
    data: [],
    totalNum: 0
  }
}
export default {
  name: 'AgreementEdit',
  components: {
    lazySelect,
    Pagination
  },
  data() {
    return {
      activeStep: 1,
      loading: false,
      trainOptions: [],
      response: {
        peopleNum: '',
        costBudgetAvg: '',
        serviceYear: '',
        page: {
          data: [],
          totalNum: 0
        }
      },
      form: {
        name: '',
        trainId: '',
        dateRange: [],
        agreementStartTime: '',
        agreementEndTime: ''
      },
      rules: {
        trainId: [{ trigger: 'change', message: '请关联培训', required: true }],
        name: [{ trigger: 'change', message: '请选择关联培训', required: true }],
        agreementStartTime: [
          {
            trigger: 'change',
            required: true,
            message: '请选择协议起始日期'
          }
        ]
      },
      query: {
        stuName: '',
        pageNo: 1,
        pageSize: 10
      },
      publishLoading: false,
      steps: []
    }
  },
  computed: {
    activeComponent() {
      return this.steps[this.activeStep - 1].component
    }
  },
  watch: {
    'query.stuName': _.debounce(function() {
      this.resetPageAndGetList()
    }, 1000)
  },
  created() {
    this.steps = [
      {
        icon: 'el-icon-setting',
        title: '培训协议信息'
      },
      {
        icon: 'el-icon-user',
        title: '人员信息确认'
      }
    ]
    const trainId = this.$route.query.trainId

    if (trainId) {
      this.form.trainId = trainId
      this.form.name = this.$route.query.projectName + '协议'
      this.trainOptions = [
        { id: this.$route.query.trainId, trainName: this.$route.query.projectName }
      ]
    }
  },
  methods: {
    resetPageAndGetList() {
      this.query.pageNo = 1
      this.query.pageSize = 10
      this.getList()
    },
    getAgreementDate(item) {
      const { agreementStartTime, agreementEndTime } = item
      if (!agreementStartTime || !agreementEndTime) return ''
      const startTime = new Date(+agreementStartTime)
      const endTime = new Date(+agreementEndTime)

      return startTime.toLocaleDateString() + ' - ' + endTime.toLocaleDateString()
    },
    pagination({ page, limit }) {
      Object.assign(this.query, { pageNo: page, pageSize: limit })
      this.getList()
    },
    getList() {
      if (this.loading) return
      this.loading = true
      const { trainId, agreementStartTime, agreementEndTime } = this.form
      const query = { ...this.query, trainId, agreementStartTime, agreementEndTime }
      returnTrainUser(query)
        .then((res = JSON.parse(JSON.stringify(o_response))) => {
          Object.assign(this.response, res)
        })
        .finally(() => (this.loading = false))
    },
    handleDateChange(date = []) {
      const [startTime, endTime] = date
      Object.assign(this.form, { agreementStartTime: startTime, agreementEndTime: endTime })
    },
    listTrain(params) {
      return listTrain(params)
    },
    async publish() {
      this['publishLoading'] = true

      const params = JSON.parse(JSON.stringify(this.form))

      delete params.dateRange
      params.peopleNum = this.response.peopleNum

      save(params)
        .then(() => {
          this.$message.success('操作成功')
          this.$router.back()
        })
        .finally(() => {
          this['publishLoading'] = false
        })
    },

    async handleStepChange(step) {
      if (step !== 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.activeStep = step
            this.getList()
          }
        })
      } else {
        this.activeStep = step
      }
    }
  }
}
</script>

<style lang="scss">
.agreement-edit {
  .step {
    cursor: pointer;
  }

  .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .el-form-item__label {
    padding-bottom: 0 !important;
  }
  .slot-form-item {
    .el-form-item__label {
      display: flex;
      align-items: center;
      width: 100%;
      .slot-item-header {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.agreement-edit {
  background-color: #fafafa;
  overflow-y: scroll;
  height: 100%;
  .header {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 10px 24px;
    width: 100%;
    background-color: #fff;
    z-index: 111;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
    .back-btn {
      width: fit-content;
      font-size: 17px;
      cursor: pointer;
    }
  }
  .body {
    min-height: calc(100vh - 115px);
    background-color: #fff;
    margin: 90px auto 25px;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 65px 120px;
    width: 1300px;

    .half-form-item {
      display: inline-block;
      width: 450px;
      /deep/.el-upload__tip {
        line-height: 0;
      }
    }
    .margin-right-120 {
      margin-right: 120px;
    }
  }

  .table-container {
    .table-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 12px;
      .header-left {
        .header-item {
          color: #333;
          margin-right: 20px;
        }
      }
      .header-right {
        flex: 0 0 230px;
        width: 230px;
      }
    }
  }
}
</style>
