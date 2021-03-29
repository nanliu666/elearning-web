<template>
  <el-dialog
    close-on-click-modal
    :modal-append-to-body="false"
    :visible.sync="dialogVisibe"
    :show-close="false"
    title="签到二维码下载"
    class="down-code-dialog"
    @close="onClose"
  >
    <div
      slot="title"
      class="dialog-header"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col :span="6">
          签到二维码下载
        </el-col>
        <el-col :span="2">
          <el-button
            type="text"
            size="medium"
            :disabled="downloadLoading || !data.length"
            :loading="downloadLoading"
            @click="batchDownload"
          >
            打包下载
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table :data="data">
      <el-table-column
        prop="todoName"
        align="center"
        label="课程名称"
      >
      </el-table-column>
      <el-table-column
        prop="todoType"
        align="center"
        label="课程类型"
      >
        <template slot-scope="scope">
          {{ scope.row.todoType == 'course' ? '面授课程' : '线下活动' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '已结束' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="todoTime"
        align="center"
        label="授课时间"
      >
      </el-table-column>
      <el-table-column
        prop="date"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="downCodeImg(scope.row)"
          >
            下载二维码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import JsZip from 'jszip'
import { saveAs } from 'file-saver'
import QRCode from 'qrcodejs2'
import { getQrcode } from '@/api/learnArrange'
import { backBaseUrl } from '@/config/env'

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      var dataURL = this.toDataURL(type, quality).split(',')[1]
      setTimeout(function() {
        var binStr = atob(dataURL),
          len = binStr.length,
          arr = new Uint8Array(len)

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }

        callback(new Blob([arr], { type: type || 'image/png' }))
      })
    }
  })
}

const CODE_HEIGHT = 100
const CODE_WIDTH = 100
const FOLDER_NAME = '签到二维码'
export default {
  props: {
    dialogVisibe: {
      type: Boolean,
      default: false
    },
    trainId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      downloadLoading: false,
      data: [],
      total: 0
    }
  },
  watch: {
    trainId() {
      this.getData()
    }
  },
  methods: {
    downCodeImg(row) {
      let { todoName, offlineTodoId } = row
      if (!todoName.trim().length) todoName = '签到二维码'
      const params = {
        trainId: this.trainId,
        offlineTodoId
      }
      const codeContainer = document.createElement('div')
      var qrcode = new QRCode(codeContainer, {
        width: CODE_WIDTH,
        height: CODE_HEIGHT
      })
      let url = backBaseUrl
      let baseURL = (url += '/mobile/pages/signin/index')

      let p = ''
      Object.keys(params).forEach((key) => {
        p += '&' + key + '=' + params[key]
      })

      baseURL += '?' + p.slice(1)
      qrcode.makeCode(baseURL)
      var canvas = qrcode._el.children[0]
      var data = canvas.toDataURL().replace('image/png', 'image/octet-stream;') //获取二维码值，并修改响应头部。
      var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = data
      saveLink.download = `${todoName}.png`
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      saveLink.dispatchEvent(event)
    },
    batchDownload() {
      this.downloadLoading = true
      const codeContainer = document.createElement('div')
      var qrcode = new QRCode(codeContainer, {
        width: CODE_WIDTH,
        height: CODE_HEIGHT
      })
      var zip = new JsZip()
      var promises = []
      this.data.forEach((item) => {
        let { todoName, offlineTodoId } = item
        if (!todoName.trim().length) todoName = '签到二维码'
        const params = {
          trainId: this.trainId,
          offlineTodoId
        }
        qrcode.clear()
        qrcode.makeCode(JSON.stringify(params))
        var canvas = qrcode._el.children[0]
        var imgFolder = zip.folder(FOLDER_NAME)
        promises.push(
          new Promise((resolve) => {
            canvas.toBlob(function(blob) {
              imgFolder.file(todoName + '.png', blob)
              resolve()
            })
          })
        )
      })

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          saveAs(content, `${FOLDER_NAME}.zip`)
        })
        this.downloadLoading = false
      })
    },
    getData() {
      getQrcode({ trainId: this.trainId }).then((res) => {
        this.data = res
      })
    },
    onClose() {
      this.$emit('update:dialogVisibe', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.down-code-dialog {
  .dialog-footer {
    padding: 0 24px;
  }
}
</style>
