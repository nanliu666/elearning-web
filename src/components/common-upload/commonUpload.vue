<template>
  <el-upload
    ref="upload"
    v-loading="uploading"
    class="upload"
    action=""
    :disabled="disabled"
    :limit="limit"
    :accept="accept"
    :multiple="multiple"
    :show-file-list="false"
    :http-request="httpRequest"
    :before-upload="beforeUpload"
    :file-list="value"
  >
    <slot />
    <slot
      slot="tip"
      name="tip"
    />
  </el-upload>
</template>

<script>
import { uploadQiniu } from '@/util/uploadQiniu'

export default {
  name: 'CommonUpload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // 上传前校验
    beforeUpload: {
      type: Function,
      default: () => true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: Number,
      default: null
    },
    limit: {
      type: Number,
      default: null
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    httpRequest(file) {
      const that = this
      that.uploading = true
      uploadQiniu(file.file, {
        // next({ total }) {
        //     that.uploadPercent = parseInt(total.percent)
        // },

        error(err) {
          that.uploading = false
          if (err.code === 614) {
            that.$message.error('上传失败，已存在相同文件')
          } else {
            that.$message.error('上传失败，请联系管理员')
            // eslint-disable-next-line
            console.error('upload err:', err)
          }
        },
        complete({ url, fileName }) {
          that.uploading = false
          let newFile = {
            fileUrl: url,
            url: url, // 新增url字段，为与移动端上传回显一致
            fileName,
            localName: file.file.name
          }
          let newValue = [...that.value, newFile]
          that.$emit('input', newValue)
          // 专门给表格设计器的上传附件组件使用的，组件name为FileUpload
          that.$emit('getValue', newValue)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  display: inline-block;
}
</style>
