<template>
  <el-drawer
    :visible.sync="visible"
    direction="rtl"
    @close="cancelDrawer"
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
        <!-- <el-form-item label="设备类型：">
          <el-select v-model="form.deviceType">
            <el-option label="APP" value="APP"></el-option>
            <el-option label="PC" value="PC"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="Banner图：">
          <common-upload
            v-model="uploadData"
            :before-upload="beforeUpload"
            :multiple="true"
            list-type="picture"
            :show-file-list="true"
            :on-remove="removeBanner"
            :limit="1"
            :on-exceed="onExceed"
          >
            <el-button
              size="small"
              type="primary"
            >
              选择图片
            </el-button>
            <div
              slot="tip"
              style="color: #ff0000; font-size: 12px"
            >
              说明：图片只能是 jpg、jpeg、png 格式，且不能超过5MB!
            </div>
          </common-upload>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.sort"></el-input>
          <div style="color: #ff0000; font-size: 12px; margin-top: 5px; line-height: 12px">
            说明：数值越小越靠前
          </div>
        </el-form-item>
        <el-form-item label="链接地址：">
          <el-input v-model="form.linkUrl"></el-input>
          <div style="color: #ff0000; font-size: 12px; margin-top: 5px; line-height: 12px">
            例如：http://www.qht-training.com.cn/Reception/NewIndex/Product-233.html
          </div>
        </el-form-item>
        <!-- <el-form-item label="链接模块：">
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
        </el-form-item> -->
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
        <el-button
          type="primary"
          :loading="loading"
          @click="addSaveBanner"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { addBanner, updateBanner } from '@/api/diy/diyHomePc'
export default {
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  props: {
    activeOrg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      title: '',
      visible: false,
      uploadData: [],
      form: {
        deviceType: 'APP',
        sort: 0,
        linkUrl: '',
        remark: ''
      },
      rowData: {},
      bannerId: '',
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
      ],
      loading: false
    }
  },
  watch: {
    activeOrg: {
      handler(val) {
        this.activeOrg = val
        // this.$emit('init')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showDrawer(value, data) {
      // add新增,edit编辑
      switch (value) {
        case 'add':
          this.title = '新建Banner'
          break
        case 'edit':
          this.title = '编辑Banner'
          break
      }
      this.bannerId = data ? data.id : ''
      this.rowData = data
      //   编辑数据回显
      if (this.bannerId) {
        this.form.sort = data.sort
        this.form.linkUrl = data.linkUrl
        this.form.remark = data.remark
        this.uploadData.push({
          fileUrl: data.picUrl,
          url: data.picUrl,
          uid: Math.round(Math.random() * 10000 + 1000)
        })
      }
      this.visible = true
    },
    beforeUpload(file) {
      //   if (file.name.replace(/[\x00-\xff]/gi, '--').length > 64) {
      //     this.$message.error('文件名过长,无法上传')
      //     return false
      //   }
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg、jpeg、png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 移除图片
    removeBanner(file) {
      this.uploadData = this.uploadData.filter((v) => v.uid != file.uid)
    },
    // 超出限制
    onExceed() {
      this.$message({
        type: 'error',
        message: '一次只能上传1张banner!'
      })
    },
    // 新增保存图片
    async addSaveBanner() {
      if (!this.uploadData.length) {
        this.$message({
          type: 'error',
          message: '请上传图片!'
        })
        return
      }
      this.loading = true
      let params = {
        picUrl: this.uploadData[0].fileUrl,
        ...this.form
      }

      // 编辑操作
      if (this.bannerId) {
        if (this.rowData) Object.assign(params, { orgId: this.rowData.orgId })
        //   判断是否是全部
        //   if (this.rowData && this.rowData.orgId == '0') Object.assign(params, { orgId: '' })
        params.id = this.bannerId
        await updateBanner(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$emit('addSuccess')
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败，请联系管理员!'
            })
          })
          .finally(() => {
            this.loading = false
            this.cancelDrawer()
          })
      } else {
        if (this.activeOrg && this.activeOrg.orgId)
          Object.assign(params, { orgId: this.activeOrg.orgId })
        // 新增操作
        await addBanner(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '添加banner成功!'
            })
            this.$emit('addSuccess')
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '添加失败，请联系管理员!'
            })
          })
          .finally(() => {
            this.loading = false
            this.cancelDrawer()
          })
      }
    },
    cancelDrawer() {
      this.visible = false
      this.uploadData = []
      this.form = {
        deviceType: 'APP',
        sort: 0,
        linkUrl: '',
        remark: ''
      }
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
    text-align: center;
    // display: flex;
    // button {
    //   flex: 1;
    // }
  }
}
</style>
