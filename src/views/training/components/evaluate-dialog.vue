<template>
  <el-dialog
    class="evaluate-dialog"
    :visible.sync="dialogVisible"
    destroy-on-close
    title="培训评定"
  >
    <div
      v-loading="dialogLoading"
      class="dialog-content"
    >
      <div class="header"></div>
      <el-table :data="data">
        <el-table-column
          label="评定维度"
          prop="name"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="权重"
          prop="weight"
          align="center"
        ></el-table-column>
        <el-table-column
          label="得分"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.value">
              {{ scope.row.value }}
            </div>
            <el-input-number
              v-else
              v-model="form[scope.row.key]"
              style="width: 85px;"
              placeholder="未填"
              size="mini"
              :max="100"
              :min="0"
              controls-position="right"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>

      <el-form style="margin-top: 12px; margin-left: 12px;">
        <el-form-item
          label="是否通过"
          required
        >
          <el-radio-group v-model="form.pass">
            <el-radio :label="0">
              未通过
            </el-radio>
            <el-radio
              v-if="form.certificateId"
              :label="1"
            >
              通过，已发放证书
            </el-radio>
            <el-radio
              v-if="form.certificateId"
              :label="2"
            >
              通过，未发放证书
            </el-radio>
            <el-radio
              v-if="!form.certificateId"
              :label="3"
            >
              通过
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="dialogVisible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        size="medium"
        :loading="confirmLoading"
        @click="handleConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { manualScoring, getAssessment } from '@/api/train/train'

export default {
  name: 'EvaluateDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      dialogLoading: false,
      data: [
        {
          name: '集中测试',
          key: 'focusTest',
          weight: '',
          value: '100'
        },
        {
          name: '课程学习',
          key: 'courseStudy',
          weight: '',
          value: '100'
        },
        {
          name: '出勤情况',
          key: 'attendance',
          weight: '',
          value: '100'
        },
        {
          name: '培训总结',
          key: 'reportMaterial',
          weight: ''
        },
        {
          name: '实操考试',
          key: 'practicalTest',
          weight: ''
        },
        {
          name: '答辩汇报',
          key: 'defenseReport',
          weight: ''
        },
        {
          name: '课程表现',
          key: 'coursePerformance',
          weight: ''
        }
      ],
      form: {
        pass: 0,
        focusTest: '100',
        courseStudy: '100',
        attendance: '100',
        reportMaterial: '',
        practicalTest: '',
        defenseReport: '',
        coursePerformance: '',
        certificateId: ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        this.getData()
      }
    }
  },
  methods: {
    handleConfirm() {
      this.confirmLoading = true
      let data = Object.assign({}, this.params)
      manualScoring(Object.assign(data, this.form))
        .then(() => {
          this.dialogVisible = false
          this.$message.success('操作成功')
          this.$emit('updateEvaluate')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    getData() {
      this.dialogLoading = true
      getAssessment(this.params)
        .then((res) => {
          this.data.forEach((cur) => {
            Object.keys(res).forEach((key) => {
              if (cur.key === key) {
                cur.weight = res[key + '1']
                this.form[key] = res[key]
              }
            })
          })
          Object.assign(this.form, res)
        })
        .finally(() => (this.dialogLoading = false))
    }
  }
}
</script>

<style></style>
