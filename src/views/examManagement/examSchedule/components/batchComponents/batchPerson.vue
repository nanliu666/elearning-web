<template>
  <div class="position__container common__container">
    <div class="title__box">
      <div class="title__left">
        <div class="right">
          <span>人数：</span>
          <span>{{ _.size(pagePersonList) }}人</span>
        </div>
      </div>
      <div
        v-if="batchLiData.hasDelete"
        class="title__right"
      >
        <el-button
          type="text"
          @click="handleDownloadTemplate"
        >
          模板下载
        </el-button>
        <el-upload
          accept=".xls,.xlsx"
          action=""
          :http-request="handleImportExcel"
          :show-file-list="false"
          style="margin: 0 10px; display: inline-block;"
        >
          <el-button type="text">
            批量导入
          </el-button>
        </el-upload>
        <el-button
          type="text"
          @click="personPickerVisible = true"
        >
          添加人员
        </el-button>
      </div>
    </div>
    <common-table
      ref="table"
      :columns="tableColumns"
      :config="tableConfig"
      :data="currentPersonList"
      :loading="tableLoading"
      :page="personPage"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          type="text"
          icon="el-icon-delete"
          @click="deleteSelected(selection)"
        >
          批量删除
        </el-button>
      </template>
      <template #handler="{row}">
        <el-button
          type="text"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </common-table>
    <!-- 选人弹窗 -->
    <common-picker
      ref="person-picker"
      v-model="personList"
      :visible.sync="personPickerVisible"
      :options="PERSON_OPTIONS"
    />
  </div>
</template>
<script>
const TABLE_COLUMNS = [
  {
    label: '用户编号',
    prop: 'workNo',
    minWidth: 200,
    formatter: (row) => (row.workNo ? row.workNo : '--')
  },
  {
    label: '姓名',
    prop: 'bizName',
    minWidth: 200
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 200,
    formatter: (row) => (row.orgName ? row.orgName : '--')
  },
  {
    label: '用户岗位',
    prop: 'positionName',
    minWidth: 200,
    formatter: (row) => (row.positionName ? row.positionName : '--')
  }
]
const TABLE_CONFIG = {
  rowKey: 'bizId',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 50
  }
}
import XLSX from 'xlsx'
const requiredTHeader = [
  { name: '用户编号', key: 'workNo' },
  { name: '姓名', key: 'userName' },
  { name: '所在部门', key: 'orgName' },
  { name: '用户岗位', key: 'positionName' }
]
import { userImportCheck } from '@/api/train/train'
import { PERSON_OPTIONS } from './personConfig'
export default {
  name: 'BatchPerson',
  inject: ['batchLiData'],
  components: {
    CommonPicker: () => import('@/components/common-picker')
  },
  props: {
    personData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableLoading: false,
      tableConfig: _.cloneDeep(TABLE_CONFIG),
      tableColumns: TABLE_COLUMNS,
      personPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      personPickerVisible: false // 是否展示选人
    }
  },
  computed: {
    // 实际部门数据
    personList: {
      get() {
        return this.personData
      },
      set(val) {
        // 设置页数总数
        this.$emit('update:personData', val)
      }
    },
    pagePersonList() {
      let tempList = []
      const searchName = _.get(this.batchLiData, 'search')
      if (searchName) {
        tempList = _.filter(this.personList, (item) => {
          return _.includes(item.bizName, searchName)
        })
      } else {
        tempList = this.personList
      }
      return tempList
    },
    // 页面展示的部门数据
    currentPersonList() {
      const { pageSize, pageNo } = this.personPage
      return this.pagePersonList.slice(pageSize * (pageNo - 1), pageSize * pageNo)
    },
    PERSON_OPTIONS: () => PERSON_OPTIONS
  },
  watch: {
    pagePersonList: {
      handler(val) {
        this.personPage.total = _.size(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initSetting()
  },
  methods: {
    // 初始化当前批次的table的操作权限
    initSetting() {
      this.tableConfig.showHandler = this.batchLiData.hasDelete
      this.tableConfig.enableMultiSelect = this.batchLiData.hasDelete
    },
    // 批量删除
    deleteSelected(select) {
      _.each(select, (item) => {
        this.handleDelete(item)
      })
      this.$refs.table.clearSelection()
    },
    // 单个删除
    handleDelete(row) {
      const index = _.findIndex(this.personList, (item) => item.bizId === row.bizId)
      this.personList.splice(index, 1)
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.personPage.pageNo = param
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.personPage.pageSize = param
    },
    /**
     * 处理导入函数
     */
    handleImportExcel(file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        const { SheetNames, Sheets } = XLSX.read(data, { type: 'binary' })
        var rowData = SheetNames.map((name) => {
          return XLSX.utils.sheet_to_json(Sheets[name])
        })
        const promises = []

        rowData.forEach((data) => {
          promises.push(this.validateExcelData(data))
        })
        Promise.all(promises)
          .then((dataArray) => {
            const personListTemp = this.personList
            const personData = []
            dataArray.forEach((list) => {
              list.forEach((person) => {
                if (!personListTemp.find((p) => p.bizId == person.userId)) {
                  person.bizName = person.userName
                  person.bizId = person.userId
                  personData.push(person)
                }
              })
            })
            this.personList = personListTemp.concat(personData)
          })
          .catch((err) => {
            if (typeof err != 'string') {
              err = JSON.stringify(err)
            }
            this.$message.error(err)
          })
      }
      reader.readAsBinaryString(file.file)
    },
    _getFailDesc(desc) {
      switch (desc) {
        case 'phonenum':
          return '账号（用户手机号码）填写错误或不存在'
        case 'workNo':
          return '用户编号填写错误或不存在'
        case 'userName':
          return '姓名填写错误或不存在'
        case 'orgName':
          return '所在部门填写错误或不存在'
        case 'positionName':
          return '用户岗位填写错误或不存在'
      }
    },
    /**
     * 验证导入函数
     */
    validateExcelData(data) {
      return new Promise((resolve, reject) => {
        let params = data.map((item) => {
          let newItem = {}
          for (const key in item) {
            let header = requiredTHeader.find((header) => header.name == key)
            if (!header) continue
            newItem[header.key] = item[key]
          }
          return newItem
        })

        userImportCheck(params)
          .then((res = {}) => {
            const { failUserInfo = [], successUserInfo = [] } = res
            resolve(successUserInfo)
            this.$alert(`已成功导入${successUserInfo.length}条数据。`, '导入成功', {
              confirmButtonText: '确定',
              type: 'success'
            })
            if (failUserInfo.length) {
              this.$alert(
                `已成功导入${successUserInfo.length}条数据，导入失败${failUserInfo.length}条数据，已自动下载错误报告，可修改后重新导入。`,
                '导入提醒',
                {
                  confirmButtonText: '确定',
                  type: 'warning'
                }
              )
              const data = failUserInfo.map((info) => {
                const { phonenum, workNo, userName, orgName, positionName } = info
                return [phonenum, workNo, userName, orgName, positionName, '找不到该账号']
              })
              this.handleExportExcel({
                header: requiredTHeader.map((header) => header.name).concat('错误信息'),
                data,
                filename: '导入失败数据'
              })
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 导出具体函数
    handleExportExcel({
      header,
      data,
      filename = '用户导入模板',
      autoWidth = true,
      bookType = 'xlsx'
    }) {
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
    // 模板下载
    handleDownloadTemplate() {
      const header = ['账号', '用户编号', '姓名', '所在部门', '用户岗位']
      const data = [['13200000000', '01920192', '张三', '事业部/设计中心', '初级设计师']]
      this.handleExportExcel({ header, data })
    }
  }
}
</script>
<style scoped lang="scss">
@import './person.scss';
</style>
