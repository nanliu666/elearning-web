<template>
  <div class="addLevel">
    <el-dialog
      :visible="visible"
      width="550px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <!-- 头部插槽 -->
      <div
        slot="title"
        class="dialogTitle"
      >
        {{ form.id ? '编辑等级' : '添加等级' }}
        <el-tooltip
          effect="dark"
          content="能力等级最少添加一级最多可添加五级"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-divider></el-divider>
      </div>
      <!-- 表单内容 -->
      <common-form
        ref="form"
        :model="form"
        :columns="columns"
      >
        <template slot="levelName">
          <div
            slot="label"
            class="form-label"
            style="display: inline-block; width: calc(100% - 10px); margin-left: 10px"
          >
            等级名称
            <span
              style="margin-left: 10px; font-size: 12px"
            >建议只填写等级名称，一次只填一级，例如：初级/中级/高级，1级/2级，A/B/C/D</span>
          </div>
          <el-input
            v-model="form.levelName"
            placeholder="请输入等级名称例如：高级/一级"
            maxlength="32"
            show-word-limit
          ></el-input>
        </template>
      </common-form>
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
          @click="handleConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddLevel',
  props: {
    abilityLevel: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visible: false,
      form: {
        levelName: '',
        levelDesc: ''
      },
      columns: [
        {
          itemType: 'slot',
          prop: 'levelName',
          label: '',
          span: 24,
          rules: [
            { required: true, message: '请输入等级名称', trigger: 'blur' },
            { min: 1, max: 32, message: '等级名称不能超过32个字符', trigger: 'blur' }
          ]
        },
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'levelDesc',
          label: '等级描述',
          span: 24,
          maxlength: 200,
          showWordLimit: true,
          autosize: { minRows: 4 },
          required: true
        }
      ],
      id: 2
    }
  },
  watch: {
    abilityLevel: {
      handler(newVal) {
        if (newVal) this.abilityLevel = newVal
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.visible = false
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = {
          levelName: '',
          levelDesc: ''
        }
      })
    },
    // 确定按钮
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 能力等级名称不能重复
        for (let i = 0; i < this.abilityLevel.length; i++) {
          if (
            this.form.levelName == this.abilityLevel[i].levelName &&
            this.abilityLevel[i].id != this.form.id
          ) {
            this.$message.warning('能力等级名称重复!')
            return
          }
        }
        // 当有id时是编辑操作，不然添加操作
        if (this.form.id) {
          this.$emit('levelForm', this.form, this.form.id)
        } else {
          this.form.id = this.id
          this.$emit('levelForm', this.form, false)
          this.id++
        }
        this.visible = false
        this.form = {
          levelName: '',
          levelDesc: ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addLevel {
  .dialogTitle {
    font-size: 20px;
  }
  .el-form {
    /deep/ .el-col:first-child .el-form-item .el-form-item__content {
      margin-top: -35px;
    }
  }
}
</style>
