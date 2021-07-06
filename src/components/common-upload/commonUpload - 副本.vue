<!--内部上传公共组件-->
<template>
  <div>
    <el-upload
      ref="uploadIn"
      v-loading="uploading"
      class="upload"
      action=""
      :disabled="disabled"
      :limit="limit"
      :accept="accept"
      :multiple="multiple"
      :show-file-list="showFileList"
      :http-request="isQiNiu?httpRequest:uploadRequest"
      :before-upload="beforeUpload"
      :file-list="value"
      :on-exceed="masterFileMax"
      :on-remove="onRemove"
      :list-type="listType"
      v-bind="$attrs"
    >    
      <slot />
      <slot slot="tip" name="tip" />
    </el-upload>
  </div>
</template>
<script>
import { uploadNew } from '@/api/upload'
import { uploadQiniu } from '@/util/uploadQiniu'
import {isQiNiu} from '@/config/env'
export default {
  name: 'InternalUpload',
  props: {
    checkUpload: {
      type: Function,
      default: () => false
    },
    onUploadComplete: {
      type: Function,
      default: () => true
    },
    onUploadProgress: {
      type: Function,
      default: () => true
    },
    onUploadError: {
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
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
    },
    value: {
      type: Array,
      default: () => []
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    onRemove: {
      type: Function,
      default: () => true
    },
    listType: {
      type: String,
      default: 'picture'
    }
  },
  data() {
    return {
      isQiNiu, // 判断是用七牛还是用内部上传
      uploading: false
    }
  },
  methods: {
    //上传文件数量限制回调
    masterFileMax(res) {
      this.$emit('on-masterFileMax', res)
    },
    // 内部上传请求
    async uploadRequest(file) {
      const fileData = {
        uid: file.file.uid,
        name: file.file.name,
        percent:0
      }
      this.$emit('on-pending', fileData)
      const onUploadProgressFn=(file)=>{
        // console.log('file,b,c,d',file,b,c,d)
        fileData.percent = parseInt(file.loaded/file.total*100)
        fileData.status = file.type
        this.onUploadProgress(fileData)
      }
      let formData = new FormData()
      formData.append('file', file.file)
      // formData.file=file
      let res = await uploadNew(formData, { onUploadProgress: onUploadProgressFn })
      if (this.needHandler) {
        this.onUploadComplete(file, res)
      }
      let newFile = {
        fileUrl: res,
        uid: file.file.uid,
        url: res, // 新增url字段，为与移动端上传回显一致
        fileName:file.file.name,
        size: file.file.size,
        localName: file.file.name
      }
      let newValue = [...this.value, newFile]

      this.$emit('input', newValue)
      // 专门给表格设计器的上传附件组件使用的，组件name为FileUpload
      this.$emit('getValue', newValue)
      // that.$emit('on-complete', fileData)

      this.$emit('getFile', newFile)
      fileData.status = 'complete'
      if (this.needHandler) {
        this.onUploadComplete(file, res)
      }

      // .then((res)=>{
      //   console.log('333',res)
      // }).catch((res)=>{
      //   console.log('444',res)
      // })
      console.log(res, 'res111')
    },  
    // 七牛上传请求  
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
          fileData.status = 'progress'
          if (that.needHandler) {
            that.onUploadProgress(fileData)
          }
        },
        error(err) {
          fileData.isError = true
          that.$emit('on-error', err)
          if (err.code === 614) {
            that.$message.error('上传失败，已存在相同文件')
          } else {
            that.$message.error('上传失败，请联系管理员')
          }
          if (that.needHandler) {
            that.onUploadError(fileData)
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

          that.$emit('getFile', newFile)
          fileData.status = 'complete'
          if (that.needHandler) {
            that.onUploadComplete(file, url)
          }
        }
      }).then(({ hooks, observable, subscription, chunks }) => {
        fileData.hooks = hooks
        fileData.observable = observable
        fileData.subscription = subscription
        fileData.chunks = chunks
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
<style scoped></style>
