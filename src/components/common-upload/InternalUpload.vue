<!--内部上传公共组件-->
<template>
  <div>
    <el-upload
      ref="upload"
      v-loading="uploading"
      class="upload"
      action=""
      :disabled="disabled"
      :limit="limit"
      :accept="accept"
      :multiple="multiple"
      :show-file-list="showFileList"
      :http-request="uploadRequest"
      :before-upload="beforeUpload"
      :file-list="value"
      :on-exceed="masterFileMax"
      :list-type="listType"
      v-bind="$attrs"
    >
      <slot />
      <slot
        slot="tip"
        name="tip"
      />
    </el-upload>
  </div>
</template>
<script>
import { uploadNew } from '@/api/upload'
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
      uploading: false
    }
  },
  methods: {
    //上传文件数量限制回调
    masterFileMax(res) {
      this.$emit('on-masterFileMax', res)
    },
    // uploadCancelFn(){ // 内部上传取消上传
    //   uploadCancel()
    // },
    // 上传请求
    async uploadRequest(file) {
      const fileData = {
        uid: file.file.uid,
        name: file.file.name,
        percent: 0,
        subscription: {
          unsubscribe: Object // 取消上传
        },
        observable: true
      }
      this.$emit('on-pending', fileData)
      const onUploadProgressFn = (file) => {
        // console.log('file,b,c,d',file,b,c,d)
        fileData.percent = parseInt((file.loaded / file.total) * 100)
        fileData.status = file.type
        this.onUploadProgress(fileData)
      }
      let formData = new FormData()
      formData.append('file', file.file)
      // formData.file=file
      let res = await uploadNew(formData, { onUploadProgress: onUploadProgressFn }, fileData)
      let newFile = {
        fileUrl: res,
        uid: file.file.uid,
        url: res, // 新增url字段，为与移动端上传回显一致
        fileName: file.file.name,
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
    }
  }
}
</script>
<style scoped></style>
