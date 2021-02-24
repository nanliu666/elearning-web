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
    v-bind="$attrs"
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
    checkUpload: {
      type: Function,
      default: () => true
    },
    onUploadComplete: {
      type: Function,
      default: () => true
    },
    onUploadProgress: {
      type: Function,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    needHandler: {
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
      const fileData = {
        uid: file.file.uid,
        name: file.file.name
      }
      file.uploader = this
      if (this.needHandler) {
        if (this.checkUpload(file)) {
          this.$emit('on-pending', fileData)
          return
        }
      }
      const that = this
      uploadQiniu(file.file, {
        next({ total }) {
          fileData.percent = parseInt(total.percent)
          if (that.needHandler) {
            that.onUploadProgress(fileData)
          }
        },
        error(err) {
          fileData.status = 'error'
          if (err.code === 614) {
            that.$message.error('上传失败，已存在相同文件')
          } else {
            that.$message.error('上传失败，请联系管理员')
            // eslint-disable-next-line
            console.error('upload err:', err)
          }
        },
        complete({ url, fileName }) {
          let newFile = {
            fileUrl: url,
            uid: file.file.uid,
            url: url, // 新增url字段，为与移动端上传回显一致
            fileName,
            size: file.file.size,
            localName: file.file.name
          }
          let newValue = [...that.value, newFile]

          that.$emit('input', newValue)
          // 专门给表格设计器的上传附件组件使用的，组件name为FileUpload
          that.$emit('getValue', newValue)
          // that.$emit('on-complete', fileData)
          if (that.needHandler) {
            that.onUploadComplete(file, url)
          }
        }
      }).then(({ hooks, observable, subscription }) => {
        fileData.hooks = hooks
        fileData.observable = observable
        fileData.subscription = subscription
        this.$emit('on-start', fileData)
      })
    },
    abort(file) {
      this.$nextTick(() => {
        try {
          this.$refs.upload.abort(file)
        } catch (e) {
          // todo
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
