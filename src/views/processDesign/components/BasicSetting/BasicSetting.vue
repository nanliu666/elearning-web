<template>
  <div class="setting-container">
    <commonForm
      ref="elForm"
      :model="conf"
      :columns="columns"
    >
      <template slot="processVisible">
        <user-picker
          v-model="conf.processVisible"
          :use-type="'process'"
          title="适用范围"
        />
      </template>
      <div slot="approverNull">
        <el-radio-group v-model="conf.approverNull">
          <el-radio :label="0">
            自动通过
            <el-tooltip
              content="当指定人员或主管为空的时候，审批单将自动通过"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">
            自动转交给管理员
            <el-tooltip
              content="当指定人员或主管为空的时候，审批单将自动转交给管理员"
              placement="top"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </div>
      <template slot="isOpinion">
        <el-checkbox v-model="conf.isOpinion">
          必填
          <el-tooltip
            content="如果勾选，审批人必须填写意见才可以提交审批结果"
            placement="top"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-checkbox>
      </template>
      <template slot="processMap">
        <div class="processMapTip">
          <div class="processMapTip2">
            <el-tooltip placement="top">
              <div slot="content">
                设置该流程适用的预算范围，若人员提交的申请预算在该范围内，则适用该流程
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
        </div>
        <div class="budgetCla">
          <el-input-number
            v-model="conf.processMap.min"
            prefix-icon="iconfont iconrmb money"
            :min="0"
            :precision="2"
            :max="100000000000"
          ></el-input-number>
          <!-- <el-input
            v-model="conf.processMap.min"
            prefix-icon="iconfont iconrmb money"
            placeholder=""
          ></el-input> -->
          <div class="budContnet">
            <span v-if="conf.categoryId == 2">≤人均预算＜</span>
            <span v-if="conf.categoryId == 10">≤费用预算＜</span>
          </div>
          <el-input-number
            v-model="conf.processMap.max"
            prefix-icon="iconfont iconrmb money"
            :min="0"
            :precision="2"
            :max="100000000000"
          ></el-input-number>
          <!-- <el-input
            v-model="conf.processMap.max"
            prefix-icon="iconfont iconrmb money"
            placeholder=""
          ></el-input> -->
        </div>
      </template>
    </commonForm>
  </div>
</template>
<script>
import { columns } from './config'
import UserPicker from '@/components/trainingSelectUser/trainingSelectUser'

export default {
  components: {
    UserPicker
  },
  props: {
    tabName: { type: String, default: '' },
    conf: { type: Object, default: null }
  },
  data() {
    return {
      columns
    }
  },
  watch: {
    'conf.categoryId'(val) {
      // 适用预算范围显示和隐藏
      var processMap = this.columns.find((item) => item.prop === 'processMap')
      if (val == '2' || val == '10') {
        processMap.isHidden = false
      } else {
        processMap.isHidden = true
      }
    }
  },
  destroyed() {
    // 重置是否显示：适用预算范围
    let processMap = this.columns.find((item) => item.prop === 'processMap')
    if (processMap) {
      processMap.isHidden = true
      this.conf.processMap.min = 0
      this.conf.processMap.max = 0
    }
  },
  mounted() {},
  methods: {
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm']
          .validate()
          .then((valid) => {
            if (!valid) {
              reject({ target: this.tabName })
              return
            }

            if (
              (this.conf.categoryId == '2' || this.conf.categoryId == '10') &&
              (typeof this.conf.processMap.max == 'undefined' ||
                typeof this.conf.processMap.min == 'undefined')
            ) {
              this.$message({
                message: '请填写：适用预算范围',
                type: 'warning'
              })
              reject({ target: this.tabName })
              return
            }
            if (this.conf.processMap.max <= this.conf.processMap.min&&(this.conf.categoryId == '2' || this.conf.categoryId == '10')) {
              this.$message({
                message: '最大金额必须大于最小金额',
                type: 'warning'
              })
              reject({ target: this.tabName })
              return
            }
            resolve({ target: this.tabName }) // TODO 提交表单
          })
          .catch(() => {
            this.$emit('jump', 'basicSetting')
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-container {
  width: 600px;
  height: 100%;
  min-height: calc(100vh - 69px);
  margin: auto;
  background: white;
  padding: 16px;

  /deep/.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
  }
}
.processMapTip {
  position: absolute;
}
.processMapTip2 {
  position: relative;
  top: -28px;
  left: 100px;
}
.processMapTip2 i {
  color: #606266;
}
.budgetCla {
  display: flex;
  height: 42px;
}
.budgetCla /deep/.el-input-number__decrease,
.budgetCla /deep/ .el-input-number__increase {
  height: 32px;
}
.budgetCla .budContnet {
  padding: 0 20px;
}
.budgetCla /deep/.el-input-number .el-input::before {
  content: '\e653';
  position: absolute;
  left: 40px;
  font-size: 18px;
  font-family: 'iconfont' !important;
}
.budgetCla /deep/.el-input-number--medium .el-input__inner {
  padding-left: 58px;
  padding-right: 58px;
}
.setting-container /deep/ .money {
  font-size: 18px;
  color: #666;
}
</style>
