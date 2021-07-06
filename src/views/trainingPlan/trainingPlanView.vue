<template>
  <div class="trainingPlanView">
    <!-- 顶部 -->
    <el-card
      style="margin-top: 20px"
      shadow="never"
      :body-style="{ padding: '15px 20px' }"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <div class="screening">
          <!-- 按年月查看 -->
          <el-select
            v-model="screeningType"
            placeholder="请选择"
            style="width: 150px"
            @change="changeTimeType"
          >
            <el-option
              label="按年查看"
              value="year"
            >
            </el-option>
            <el-option
              label="按月查看"
              value="month"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="screeningTime"
            :type="screeningType"
            :clearable="false"
            placeholder="请选择"
            :value-format="screeningType == 'year' ? 'yyyy' : 'yyyy-M'"
            style="width: 150px; margin-left: 10px"
            @change="initTrainPlanYearMap"
          >
          </el-date-picker>
          <span
            style="display: inline-block; margin-left: 10px"
          ><el-tree-select
            :select-params="treeSeleteConfig.selectParams"
            :tree-params="treeSeleteConfig.treeParams"
            @select-clear="orgTreeSearch"
            @node-click="orgTreeSearch"
          ></el-tree-select></span>
        </div>
        <!-- 右侧图例 -->
        <div
          v-if="!showSubitems"
          class="legend"
        >
          <div
            v-for="(item, index) in legendTemp"
            :key="index"
            class="box"
          >
            <span :style="{ background: item.color }"></span>{{ item.label }}
          </div>
        </div>
      </el-row>
    </el-card>
    <!-- 数据表格 -->
    <basic-container block>
      <div class="header-title">
        <el-row type="flex">
          <div>
            年度计划完成度：<span class="progress">{{ (trainPlanInfo.yearRate || 0) + '%' }}</span>
          </div>
          <div style="margin-left: 25px">
            {{
              screeningType == 'month' ? screeningTime.split('-')[1] : new Date().getMonth() + 1
            }}月完成度：<span class="progress">{{ (trainPlanInfo.monthRate || 0) + '%' }}</span>
          </div>
          <div
            v-if="showSubitems"
            style="margin-left: 25px"
          >
            {{
              screeningType == 'month' ? screeningTime.split('-')[1] : new Date().getMonth() + 1
            }}月完成情况：<span class="progress">{{
              (trainPlanInfo.doneOfMonth || 0) + '/' + (trainPlanInfo.allOfMonth || 0)
            }}</span>（已完成培训/总培训）
          </div>
        </el-row>
      </div>
      <!-- 甘特图 -->
      <wlGantt
        v-if="!showSubitems"
        ref="wlGantt"
        v-loading="loading"
        @tableCell="tableCell"
      ></wlGantt>
      <!-- 子计划详情 -->
      <subitems-plan-details
        v-else
        ref="subitemsPlanDetails"
        v-loading="loading"
        @initTable="initTrainPlanYearMap"
      ></subitems-plan-details>
    </basic-container>
  </div>
</template>

<script>
import { getOrgTree } from '@/api/org/org'
import wlGantt from './components/wlGantt.vue'
import subitemsPlanDetails from './components/subitemsPlanDetails'
import { trainPlanYearMap } from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'TrainingPlanView',
  components: {
    elTreeSelect: () => import('@/components/elTreeSelect/elTreeSelect'),
    wlGantt,
    subitemsPlanDetails
  },
  data() {
    return {
      screeningType: 'year', // 按年月查看
      screeningTime: new Date().getFullYear() + '', // 选择日期
      orgId: '',
      loading: false,
      showSubitems: false, // 是否显示子计划详情
      treeSeleteConfig: {
        selectParams: {
          placeholder: '请选择部门',
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
            label: 'orgName',
            disabled: 'disabled',
            value: 'orgId'
          }
        }
      },
      legendTemp: [
        // 图例
        {
          value: 1,
          label: '未开始',
          color: '#A7D5FA'
        },
        {
          value: 2,
          label: '进行中',
          color: '#2875D4'
        },
        {
          value: 3,
          label: '已完成',
          color: '#97D681'
        },
        {
          value: 4,
          label: '超期',
          color: '#F5623B'
        },
        {
          value: 5,
          label: '已取消',
          color: 'rgba(0,11,21,0.25)'
        }
      ],
      trainPlanInfo: {}
    }
  },
  activated() {
    this.initPlan()
    this.initTrainPlanYearMap()
  },
  mounted() {
    this.getDepartment()
  },
  methods: {
    initPlan() {
      this.showSubitems = false
      this.screeningType = 'year'
      this.screeningTime = new Date().getFullYear() + ''
    },
    changeTimeType(val) {
      switch (val) {
        case 'year':
          this.screeningTime = new Date().getFullYear() + ''
          this.showSubitems = false
          break
        case 'month':
          this.screeningTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
          this.showSubitems = true
          break
      }
      this.initTrainPlanYearMap()
    },
    // 点击组织分类
    async orgTreeSearch(data) {
      if (data) {
        this.orgId = data.orgId
      } else {
        this.orgId = ''
      }
      this.initTrainPlanYearMap()
    },
    //   获取部门组织架构
    async getDepartment() {
      await getOrgTree({ parentOrgId: '0' }).then((res) => {
        this.treeSeleteConfig.treeParams.data = res
      })
    },
    // 初始化数据
    async initTrainPlanYearMap() {
      this.loading = true
      let params = {
        year: this.screeningType == 'year' ? this.screeningTime : this.screeningTime.split('-')[0],
        orgId: this.orgId,
        month:
          this.screeningType == 'month'
            ? this.screeningTime.split('-')[1]
            : new Date().getMonth() + 1,
        type: this.screeningType
      }
      await trainPlanYearMap(params)
        .then((res) => {
          this.trainPlanInfo = res
          if (this.showSubitems) {
            this.$refs.subitemsPlanDetails.tableData = JSON.parse(
              JSON.stringify(res.planDetailList)
            )
            this.$refs.subitemsPlanDetails.month =
              this.screeningType == 'month'
                ? this.screeningTime.split('-')[1]
                : new Date().getMonth() + 1
          } else {
            this.$refs.wlGantt.processingTabular(JSON.parse(JSON.stringify(res.planDetailList)))
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 点击单元格事件，获取到月份
    tableCell(month) {
      if (this.screeningType == 'year') {
        this.screeningTime = this.screeningTime + '-' + month
      } else {
        this.screeningTime = this.screeningTime.split('-')[0] + '-' + month
      }
      this.screeningType = 'month'
      this.showSubitems = true
      this.initTrainPlanYearMap()
    }
  }
}
</script>

<style lang="scss" scoped>
.trainingPlanView {
  .legend {
    .box {
      display: inline-block;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.65);
      margin: 6px 0 0 25px;
      span {
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 6px 8px 0 0;
        vertical-align: 1px;
      }
    }
  }
  .basic-container--block {
    height: calc(100% - 110px);
    min-height: calc(100% - 110px);
  }
  .header-title {
    font-size: 16px;
    color: rgba(0, 11, 21, 0.65);
    .progress {
      font-weight: bold;
    }
  }
}
</style>
