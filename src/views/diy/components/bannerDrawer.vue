<template>
  <el-drawer
    :visible.sync="visible"
    direction="rtl"
  >
    <div
      slot="title"
      style="font-size: 20px"
    >
      {{ title }}
    </div>
    <el-divider style="margin-top: -20px"></el-divider>
    <div class="container">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="设备类型：">
          <el-select v-model="form.deviceType">
            <el-option
              label="APP"
              value="APP"
            ></el-option>
            <el-option
              label="PC"
              value="PC"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Banner图：">
          <el-upload
            action
            :limit="1"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture"
            :auto-upload="false"
            :on-exceed="exceedFun"
            accept="image/jpeg, image/jpg, image/png"
          >
            <el-button
              size="small"
              type="primary"
            >
              选择图片
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.sorting"></el-input>
          <div style="color: #ff0000; font-size: 12px; margin-top: 5px; line-height: 12px">
            说明：数值越大越靠前
          </div>
        </el-form-item>
        <el-form-item label="链接地址：">
          <el-input v-model="form.linkAddress"></el-input>
          <div style="color: #ff0000; font-size: 12px; margin-top: 5px; line-height: 12px">
            例如：http://www.qht-training.com.cn/Reception/NewIndex/Product-233.html
          </div>
        </el-form-item>
        <el-form-item label="链接模块：">
          <el-select v-model="form.module">
            <el-option
              v-for="(z, k) in moduleList"
              :key="k"
              :label="z.label"
              :value="z.value"
            ></el-option>
          </el-select>
          <div style="color: #ff0000; font-size: 12px; margin-top: 5px; line-height: 12px">
            说明：选择链接模块后链接地址失效
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button @click="cancelDrawer">
          取 消
        </el-button>
        <el-button type="primary">
          确定
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      visible: false,
      form: {
        deviceType: 'APP',
        sorting: 0,
        linkAddress: '',
        module: '',
        remark: ''
      },
      fileList: [],
      moduleList: [
        {
          label: '培训班',
          value: 0
        },
        {
          label: '直播',
          value: 1
        },
        {
          label: '企业知识',
          value: 2
        }
      ]
    }
  },
  methods: {
    showDrawer(value, data) {
      // add新增,edit编辑
      switch (value) {
        case 'add':
          this.title = '发布Banner'
          break
        case 'edit':
          this.title = '编辑Banner'
          break
      }
      if (data) {
        console.log(data)
      }
      this.visible = true
    },
    beforeUpload(file) {
      //   if (file.name.replace(/[\x00-\xff]/gi, '--').length > 64) {
      //     this.$message.error('文件名过长,无法上传')
      //     return false
      //   }
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    exceedFun() {
      this.$message.error('一次只能上传一张图片!')
    },
    cancelDrawer() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 30px);
  padding: 20px 20px 0;
  form {
    flex: 1;
  }
  .drawer__footer {
    display: flex;
    button {
      flex: 1;
    }
  }
}
</style>
