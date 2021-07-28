<template>
  <div class="training-edit-setting">
    <div class="form-area-title">
      <span class="text">通过条件：</span>
      <el-radio-group
        v-model="form.evaluateCondition"
        :disabled="isUnderwayEdit"
      >
        <el-radio label="1">
          项目经理评定
        </el-radio>
        <el-radio label="2">
          系统自动评定
        </el-radio>
      </el-radio-group>
    </div>
    <div class="table-wrapper">
      <div class="table-header">
        <div class="table-header-title">
          <div class="name">
            评定维度
          </div>
          <div class="info">
            （剩余权重：<span style="color: red;">{{ curWeightedValue }}%</span>）
          </div>
        </div>
        <div
          class="label"
          style="color: #838383;"
        >
          注：评定维度权重为0表示不计算改维度
        </div>
      </div>
      <el-table
        ref="table"
        :data="settingData"
        border
      >
        <el-table-column
          align="center"
          label="评定维度"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="权重"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="getSettingDisabledValue(scope.row.key)"
              disabled
              style="color: #bfbfbf; user-select: none;"
            >未配置</span>

            <!--            <span v-else-if="form.trainCurrentStatus === 2">-->
            <!--              {{form[scope.row.key] + '%'}}-->
            <!--            </span>-->
            <span v-else>
              <el-input-number
                v-model="form[scope.row.key]"
                placeholder="请输入"
                size="mini"
                :max="
                  100 -
                    activeSettingData
                      .filter((item) => item !== scope.row)
                      .reduce((total, next) => (total += form[next.key]), 0)
                "
                controls-position="right"
                :min="0"
                style="width: 100px; margin-right: 7px;"
              />
              <span>%</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="评定方式"
          prop="way"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isUnderwayEdit: {
      type: Boolean,
      default: false
    },
    activeSettingData: {
      type: Array,
      default() {
        return []
      }
    },
    settingData: {
      type: Array,
      default() {
        return []
      }
    },
    curWeightedValue: {
      type: Number,
      default: 0
    },
    getSettingDisabledValue: {
      type: Function,
      default: () => true
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    validate() {
      return new Promise((resolve) => {
        if (this.activeSettingData.length && this.curWeightedValue > 0) {
          resolve('权重需分配完才能进入下一步')
          return
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.training-edit-setting {
  .form-area-title {
    display: flex;
    align-items: flex-end;
    .text {
      font-size: 17px;
      color: #525252;
    }
  }
  .table-wrapper {
    margin-top: 15px;
    padding-top: 20px;
    border-top: 1px solid #f7f7f7;
  }
  .table-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .table-header-title {
      display: flex;
      align-items: center;
      color: #333;
      line-height: 0;
      .name {
        font-size: 17px;
        margin-right: 8px;
      }
      .info {
        font-size: 14px;
      }
    }
  }
}
</style>
