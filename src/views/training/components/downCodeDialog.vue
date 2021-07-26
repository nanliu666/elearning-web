<template>
  <el-dialog
    close-on-click-modal
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    :show-close="false"
    title="签到二维码下载"
    class="down-code-dialog"
  >
    <div
      slot="title"
      class="dialog-header"
    >
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>
          签到二维码下载
        </span>
        <span>
          <el-button
            type="text"
            size="medium"
            :disabled="!data.length"
            :loading="codeDownloadLoading"
            @click="batchDownload('code')"
          >
            打包下载二维码
          </el-button>

          <el-button
            type="text"
            size="medium"
            :disabled="!data.length"
            :loading="excelDownloadLoading"
            @click="batchDownload('excel')"
          >
            打包下载签到表
          </el-button>
        </span>
      </div>
    </div>

    <el-table :data="data">
      <el-table-column
        align="center"
        label="课程名称"
        width="210"
        show-overflow-tooltip
        prop="todoName"
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
          {{ scope.row.status == 1 ? '未开始' : scope.row.status == 2 ? '进行中' : '已结办' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="todoTime"
        align="center"
        label="授课时间"
        width="320"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="date"
        align="center"
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="downloadCode(scope.row)"
          >
            下载二维码
          </el-button>
          <el-button
            type="text"
            :loading="scope.row.btn2Loading"
            @click="downloadExcel(scope.row)"
          >
            下载签到表
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
import { getQrcode, offlineSignExcel } from '@/api/learnArrange'
import { backBaseUrl } from '@/config/env'
const CODE_HEIGHT = 300
const CODE_WIDTH = 300
const FOLDER_NAME = '签到二维码'
const SIGN_FOLDER_NAME = '所有签到表'
export default {
  props: {
    visible: {
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
      codeDownloadLoading: false,
      excelDownloadLoading: false,
      data: [],
      total: 0
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    trainId() {
      this.getData()
    }
  },
  methods: {
    downloadCode(row) {
      let { todoName, offlineTodoId } = row
      if (!todoName.trim().length) todoName = '签到二维码'
      const codeContainer = document.createElement('div')
      codeContainer.style.backgroundColor = '#ffffff'
      var qrcode = new QRCode(codeContainer, {
        width: CODE_WIDTH,
        height: CODE_HEIGHT,
        colorLight: '#ffffff'
      })
      const { href } = this.$router.resolve({
        path: '/pages/signin/index',
        query: {
          trainId: this.trainId,
          offlineTodoId
        }
      })
      // let baseURL = (url += '/mobile/#/pages/signin/index')
      qrcode.makeCode(`${backBaseUrl}/mobile/` + href)
      var canvas = qrcode._el.children[0]
      // const context = canvas.getContext('2d')
      // const { width, height } = canvas
      // fillCanvasBackground(context, width, height)
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
    downloadExcel(row) {
      row.btn2Loading = true
      const { offlineTodoId } = row
      offlineSignExcel({ offlineTodoId, trainId: this.trainId })
        .then((res = {}) => {
          const { userInfo = [], todoName } = res
          if (!userInfo.length) {
            this.$message.error('暂无学员信息，不能下载签到表')
            return
          }
          this.beforeExportExcel(
            todoName,
            userInfo.map((user) => {
              const { userName, orgName, phonenum } = user
              return {
                userName,
                phonenum,
                orgName,
                status: '',
                signTime: ''
              }
            })
          )
        })
        .finally(() => {
          row.btn2Loading = false
        })
    },
    batchDownload(type) {
      if (type == 'excel') {
        this.handleDownLoadExcelZip()
        return
      }
      this.codeDownloadLoading = true
      const codeContainer = document.createElement('div')
      codeContainer.style.backgroundColor = '#ffffff'
      var qrcode = new QRCode(codeContainer, {
        width: CODE_WIDTH,
        height: CODE_HEIGHT,
        colorLight: '#ffffff'
      })
      var zip = new JsZip()
      var promises = []
      let todoNames = []
      this.data.forEach((item) => {
        let { todoName, offlineTodoId } = item
        if (!todoName.trim().length) todoName = '签到二维码'
        const { href } = this.$router.resolve({
          path: '/pages/signin/index',
          query: {
            trainId: this.trainId,
            offlineTodoId
          }
        })
        qrcode.clear()
        qrcode.makeCode(`${backBaseUrl}/mobile/` + href)
        var canvas = qrcode._el.children[0]
        var imgFolder = zip.folder(FOLDER_NAME)

        let repetCount = todoNames.filter((name) => name === todoName).length
        todoNames.push(todoName)
        promises.push(
          new Promise((resolve) => {
            canvas.toBlob(function(blob) {
              imgFolder.file((repetCount ? todoName + repetCount : todoName) + '.png', blob)
              resolve()
            })
          })
        )
      })
      todoNames = []
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          saveAs(content, `${FOLDER_NAME}.zip`)
        })
        this.codeDownloadLoading = false
      })
    },
    handleDownLoadExcelZip() {
      this.excelDownloadLoading = true
      const promises = []
      this.data.forEach((item) => {
        // 多次请求后端接口 如果只有一次请求，那不用promise.all
        promises.push(
          offlineSignExcel({ offlineTodoId: item.offlineTodoId, trainId: this.trainId })
        )
      })
      var zip = new JsZip()
      const folder = zip.folder(SIGN_FOLDER_NAME)
      Promise.all(promises)
        .then((data) => {
          if (data.every((item) => !item.userInfo.length)) {
            this.$message.error('没有学员信息')
            return Promise.reject()
          }
          data.forEach((item, index) => {
            const { userInfo = [], todoName } = item
            let table =
              '<table id="tableExcel" width="100%" border="1" cellspacing="0" cellpadding="0"><tr style="text-align: center;"><td>学员姓名</td><td>手机号码</td><td>所属部门</td><td>签到情况</td><td>签到时间</td></tr>'
            userInfo.forEach((user) => {
              const { userName, phonenum, orgName } = user

              table += `<tr style="text-align: center;">
                <td>${userName}</td>
                <td>${phonenum}</td>
                <td>${orgName}</td>
                <td></td>
                <td></td>
              </tr>`
            })
            table += '</table>'
            let tableHtml = '<html><head><meta charset="UTF-8"></head><body>'
            tableHtml += table
            tableHtml += '</body></html>'
            const excelBlob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' })
            const fileName = todoName || '签到表' + index + 1
            folder.file(fileName + '.xlsx', excelBlob)
          })
        })
        .then(() => {
          zip.generateAsync({ type: 'blob' }).then(function(content) {
            saveAs(content, `${SIGN_FOLDER_NAME}.zip`)
          })
        })
        .catch(() => {})
        .finally(() => {
          this.excelDownloadLoading = false
        })
    },
    getData() {
      getQrcode({ trainId: this.trainId }).then((res) => {
        this.data = res
      })
    },
    handleExportExcel({
      header = {},
      data = [],
      filename = '签到表',
      autoWidth = true,
      bookType = 'xlsx'
    }) {
      if (!filename) {
        filename = '签到表'
      }
      return import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          header,
          data,
          filename,
          autoWidth,
          bookType
        })
      })
    },
    beforeExportExcel(filename, data) {
      const header = ['学员姓名', '手机号码', '所属部门', '签到情况', '签到时间']
      const keys = ['userName', 'phonenum', 'orgName', 'status', 'signTime']
      data = data.map((item) => {
        const arr = []
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index]
          arr.push(item[key])
        }
        return arr
      })
      this.handleExportExcel({ header, data, filename })
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
