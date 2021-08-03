<template>
  <div class="training-edit-person">
    <div class="table-header">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
      >
        <el-form-item prop="total">
          <div class="table-header-title">
            <div class="name">
              关联人员
            </div>
            <div class="info">
              人数: {{ totalNum }}人
            </div>
          </div>
        </el-form-item>
      </el-form>

      <el-input
        :maxlength="32"
        placeholder="请搜索人员姓名"
        size="medium"
        suffix-icon="el-icon-search"
        clearable
        :value="inputValue"
        @input="searchPeople"
      ></el-input>
    </div>

    <div class="table-container">
      <div class="sub-header">
        <div class="sub-header-title">
          <span>部门:{{ departmentList.length }}个</span>
          <span>人数:{{ peopleNum(departmentList) }}人</span>
        </div>
        <el-button
          type="primary"
          size="medium"
          @click="add(0)"
        >
          添加部门
        </el-button>
      </div>
      <div
        v-loading="departmentLoading"
        class="tag-table-container"
      >
        <el-row
          v-if="departmentList.length"
          :gutter="20"
          class="tag-table"
        >
          <el-col
            v-for="org in showlist(departmentList, departmentPage, 1)"
            :key="org.id"
            :span="8"
          >
            <div class="tag-table-item">
              <div class="name">
                （{{ org.workNum }}人）{{ org.name }}
              </div>
              <i
                class="el-icon-close"
                @click="del(org, 0)"
              ></i>
            </div>
          </el-col>
        </el-row>
        <div
          v-else
          class="empty-tips"
        >
          暂无数据
        </div>
      </div>

      <div class="page-container">
        <pagination
          :total="departmentList.length"
          :page.sync="departmentPage.pageNo"
          :limit.sync="departmentPage.pageSize"
        ></pagination>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header empty-header"></div>
      <div class="sub-header">
        <span>岗位:{{ positionList.length }}个</span>
        <span>人数:{{ peopleNum(positionList) }}人</span>
        <el-button
          type="primary"
          size="medium"
          @click="add(1)"
        >
          添加岗位
        </el-button>
      </div>

      <div
        v-loading="positionLoading"
        class="tag-table-container"
      >
        <el-row
          v-if="positionList.length"
          :gutter="20"
          class="tag-table"
        >
          <el-col
            v-for="position in showlist(positionList, positionPage, 2)"
            :key="position.positionId"
            :span="8"
          >
            <div class="tag-table-item">
              <div class="name">
                （{{ position.workNum }}人）{{ position.positionName }}
              </div>
              <i
                class="el-icon-close"
                @click="del(position, 1)"
              ></i>
            </div>
          </el-col>
        </el-row>
        <div
          v-else
          class="empty-tips"
        >
          暂无数据
        </div>
      </div>

      <div
        v-if="positionList.length > 10"
        class="page-container"
      >
        <pagination
          :total="positionList.length"
          :page.sync="positionPage.pageNo"
          :limit.sync="positionPage.pageSize"
        ></pagination>
      </div>
    </div>

    <div class="table-container">
      <div class="sub-header">
        <div class="sub-header-title">
          <div v-if="multipleSelection.length">
            <span>{{ `已选中${multipleSelection.length}人` }}</span>
            <span
              style="
                display: inline-block;
                width: 1px;
                height: 1em;
                margin: 0 8px;
                vertical-align: middle;
                background-color: #dcdfe6;
              "
            ></span>
            <el-button
              type="text"
              style="padding: 0"
              @click="batchDel"
            >
              批量删除
            </el-button>
          </div>
          <div v-else>
            人数：{{ personList.length }}人
          </div>
        </div>
        <el-row>
          <el-button
            type="default"
            size="medium"
            :loading="downloadLoading"
            @click="handleDownloadTemplate"
          >
            <i class="el-icon-download"></i>
            模板下载
          </el-button>
          <el-upload
            accept=".xls,.xlsx"
            action=""
            :http-request="handleImportExcel"
            :show-file-list="false"
            style="margin: 0 10px; display: inline-block"
          >
            <el-button
              type="default"
              size="medium"
            >
              <i class="el-icon-upload"></i>
              批量导入
            </el-button>
          </el-upload>

          <el-button
            type="primary"
            size="medium"
            @click="add(2)"
          >
            添加人员
          </el-button>
        </el-row>
      </div>
      <el-table
        ref="personTable"
        style="margin-top: 12px"
        height="450"
        :data="showlist(personList, personPage, 3)"
        align="center"
        header-align="center"
        row-key="bizId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          reserve-selection
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="用户编号"
          prop="workNo"
        >
          <template slot-scope="scope">
            {{ scope.row.workNo || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="bizName"
        ></el-table-column>
        <el-table-column
          width="180"
          show-overflow-tooltip
          prop="orgName"
          label="部门"
        >
          <template slot-scope="scope">
            {{ scope.row.orgName || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="用户岗位"
          prop="positionName"
        >
          <template slot-scope="scope">
            {{ scope.row.positionName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="del(scope.row, 2)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="personPage.total"
        :page.sync="personPage.pageNo"
        :limit.sync="personPage.pageSize"
      ></pagination>
    </div>
    <!-- 添加部门 -->
    <common-picker
      v-model="departmentList"
      dialog-title="添加部门"
      header-title="请选择部门"
      :visible.sync="departmentVisible"
      :options="departmentOptions"
      :props="departmentPickerProps"
      :selected-style="{
        icon: 'icon-usercircle2',
        label: 'name'
      }"
      :reserve="false"
      @pickerCancel="departmentLoading = false"
    />
    <!-- 添加岗位 -->
    <common-picker
      v-model="positionList"
      dialog-title="添加岗位"
      header-title="请选择岗位"
      :visible.sync="positionPickerVisible"
      :options="positionPickerOptions"
      :props="positionPickerProps"
      :selected-style="positionSelectedStyle"
      :reserve="false"
      @pickerCancel="positionLoading = false"
    />
    <!-- 添加人员 -->
    <common-picker
      ref="person-picker"
      v-model="personList"
      :visible.sync="personPickerVisible"
      :options="personPickerOptions"
    />
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import CommonPicker from '@/components/common-picker'
import { userImportCheck, getOrgChild } from '@/api/train/train'
import { getGroup } from '@/api/system/user'
import XLSX from 'xlsx'
import { getUsergroupList, getPositionUserList1 } from '@/api/examManage/schedule'
import { getStationParent } from '@/api/system/station'
import { getTemplate } from '@/api/system/template'
import axios from 'axios'
const requiredTHeader = [
  { name: '用户手机号', key: 'phonenum' },
  { name: '姓名', key: 'userName' }
]
export default {
  name: 'Relation',
  components: {
    Pagination,
    CommonPicker
  },
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      valve: false,
      inputValue: '',
      usersArr: [],
      timer: null,
      searchName: '',
      // 部门
      departmentList: [],
      departmentPage: {
        pageNo: 1,
        pageSize: 10
      },
      departmentVisible: false,
      departmentLoading: false,
      departmentOptions: [
        {
          name: '部门',
          request: getOrgChild,
          type: 'tree',
          placeholder: '搜索部门名称',
          treeOption: {
            'check-strictly': true,
            props: {
              label: 'name',
              children: 'children'
            },
            nodeKey: 'id'
          },
          resolveRequest: {
            handler: function(node, resolve) {
              const {
                data: { id, parentIds }
              } = node
              getOrgChild({ parentId: id }).then((res) => {
                const { orgs = [] } = res
                orgs.forEach((org) => {
                  org.parentIds = parentIds ? [id].concat(parentIds) : [id]
                })
                resolve(orgs)
              })
            }
          },
          query: {
            search: {
              key: 'search',
              value: ''
            },
            id: {
              key: 'parentId',
              value: '0',
              initialValue: '0',
              from: 'id'
            }
          },
          response: {
            props: {
              data: 'orgs'
            }
          },
          props: {
            value: 'id',
            select: ['id', 'name', 'workNum', 'parentIds']
          }
        }
      ],
      departmentPickerProps: {
        label: 'name',
        value: 'id',
        select: ['id', 'name', 'workNum']
      },
      // 岗位
      positionList: [],
      positionPage: {
        pageNo: 1,
        pageSize: 10
      },
      positionPickerVisible: false,
      positionLoading: false,
      positionPickerOptions: [
        {
          name: '岗位',
          request: getStationParent,
          type: 'scroll-tree',
          placeholder: '搜索岗位名称',
          response: {
            props: {
              data: 'data',
              total: 'totalNum'
            }
          },
          treeOption: {
            props: {
              label: 'name',
              children: 'children'
            },
            'check-strictly': false,
            nodeKey: 'userId'
          },
          props: {
            value: 'id',
            select: ['id', 'name', 'workNum']
          },
          label: function(data) {
            const { name } = data
            return name
          },
          query: {
            search: {
              key: 'name',
              value: ''
            },
            page: {
              key: 'pageNo',
              value: 1
            },
            pageSize: {
              key: 'pageSize',
              value: 50
            }
          },
          resolveRequest: {
            handler() {
              return false
            }
          }
        }
      ],
      positionPickerProps: {
        value: 'positionId',
        select: ['positionId', 'positionName', 'workNum', 'parentIds']
      },
      positionSelectedStyle: {
        icon: 'icon-usercircle2',
        label: function(node) {
          const { positionName } = node
          return positionName
        }
      },
      // 人员
      personList: [],
      personPickerVisible: false,
      personPickerOptions: [
        {
          name: '岗位',
          request: getStationParent,
          type: 'scroll-tree',
          placeholder: '搜索岗位名称',
          response: {
            props: {
              data: 'data',
              total: 'totalNum'
            }
          },
          treeOption: {
            props: {
              label: 'name',
              children: 'children'
            },
            'check-strictly': false,
            nodeKey: 'userId'
          },
          props: {
            value: 'userId',
            select: [
              'userId',
              'name',
              'orgName',
              'positionName',
              'workNo',
              'phoneNum',
              'orgId',
              'positionId'
            ]
          },
          label: function(data) {
            const { name } = data
            return name
          },
          query: {
            search: {
              key: 'name',
              value: ''
            },
            page: {
              key: 'pageNo',
              value: 1
            },
            pageSize: {
              key: 'pageSize',
              value: 50
            }
          },
          resolveRequest: {
            handler() {
              return false
            }
          },
          checkRequest: {
            handler: function($data, resolve) {
              getPositionUserList1({ parentId: $data.id }).then((res = {}) => {
                if (Array.isArray(res)) {
                  resolve(res)
                } else {
                  let data = []
                  Object.keys(res).forEach((key) => {
                    data = data.concat(res[key])
                  })
                  resolve(data)
                }
              })
            }
          }
        },
        {
          name: '分组',
          request: getGroup,
          resolveRequest: {
            condition: function(node) {
              // node 是el-tree的node
              return !node.data.userId
            },
            handler: function(node, resolve) {
              // node 是el-tree的node
              getUsergroupList({ ids: node.data.id }).then((res) => {
                resolve(res)
              })
            }
          },
          type: 'tree',
          placeholder: '搜索分组名称',
          treeOption: {
            props: {
              label: 'name',
              children: 'children'
            },
            'check-strictly': false,
            nodeKey: 'userId'
          },
          checkRequest: {
            condition: function(data) {
              return !data.userId
            },
            handler: function(data, resolve) {
              getUsergroupList({ ids: data.id }).then((res) => {
                resolve(res)
              })
            }
          },
          props: {
            value: 'userId',
            select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phoneNum', 'orgId']
          },
          response: {
            props: {
              data: 'records',
              total: 'totalNum'
            }
          },
          label: function(node) {
            const { name } = node
            return name
          },
          query: {
            search: {
              key: 'search',
              value: ''
            }
          }
        }
      ],
      personPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      multipleSelection: [],
      downloadLoading: false,
      rules: {
        total: [
          {
            validator: (rule, value, callback) => {
              this.totalNum > 0 ? callback() : callback(new Error('关联人员不能为空'))
            }
          }
        ]
      }
    }
  },
  computed: {
    peopleNum() {
      return (data) => {
        let num = 0
        data.forEach((item) => (num += item.workNum))
        return num
      }
    },
    totalNum() {
      const data = [...this.departmentList, ...this.positionList]
      const filterArr = {
        org: this.departmentList.map((item) => (item = item.name)),
        position: this.positionList.map((item) => item.positionName)
      }
      let totalNum = this.personList.reduce((total, item) => {
        return (
          total +
          Number(
            !(
              filterArr.org.includes(item.orgName) || filterArr.position.includes(item.positionName)
            )
          )
        )
      }, 0)
      console.log(totalNum)
      return this.peopleNum(data) + totalNum
    },
    // 显示的列表
    showlist() {
      return (data, page, flag) => {
        if (this.searchName) {
          if (flag === 3) {
            data = data.filter((item) => item.bizName.indexOf(this.searchName) !== -1)
          } else {
            if (!this.usersArr.length) return
            data = data.filter((item) => {
              if (flag === 1) {
                return this.usersArr.some((org) => org.orgId === item.id)
              } else if (flag === 2) {
                return this.usersArr.some((position) => position.positionId === item.positionId)
              }
            })
          }
        }
        page.total = data.length
        const start = (page.pageNo - 1) * page.pageSize
        const totalNum =
          data.length >= page.pageSize * page.pageNo ? page.pageSize * page.pageNo : data.length + 1
        return data.slice(start, totalNum)
      }
    }
  },
  activated() {
    this.departmentList = this.form.orgIds
    this.positionList = this.form.positionIds
    this.personList = this.form.userIds
  },
  methods: {
    add(flag) {
      if (flag === 0) {
        this.departmentVisible = true
        this.departmentLoading = true
      } else if (flag === 1) {
        this.positionPickerVisible = true
        this.positionLoading = true
      } else if (flag === 2) {
        this.personPickerVisible = true
      }
    },
    del(data, flag) {
      if (flag === 0) {
        const index = this.departmentList.findIndex((item) => item.id === data.id)
        this.departmentList.splice(index, 1)
      } else if (flag === 1) {
        const index = this.positionList.findIndex((item) => item.positionId === data.positionId)
        this.positionList.splice(index, 1)
      } else if (flag === 2) {
        const index = this.personList.findIndex((item) => item.bizId === data.bizId)
        this.personList.splice(index, 1)
      }
    },
    async handleDownloadTemplate() {
      const { fileUrl, fileName } = await getTemplate({ code: 't3' })
      axios
        .get(fileUrl, {
          responseType: 'blob'
        })
        .then((res) => {
          console.log(res)
          let a = document.createElement('a')
          a.style.display = 'none'
          a.href = window.URL.createObjectURL(res.data)
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        })
    },

    handleSelectionChange(selections) {
      this.multipleSelection = selections
    },
    batchDel() {
      this.personList = this.personList.filter(
        (item) => !this.multipleSelection.some((element) => element.bizId === item.bizId)
      )
      this.$refs.personTable.clearSelection()
      this.multipleSelection = []
    },
    handleImportExcel(file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        let { SheetNames, Sheets } = XLSX.read(data, { type: 'binary' })
        const valid = this.checkSheets(Sheets)

        if (!valid) return
        SheetNames = SheetNames.filter((name) => name.indexOf('用户导入数据') > -1)
        var rowData = SheetNames.map((name) => {
          return XLSX.utils.sheet_to_json(Sheets[name])
        })
        const promises = []
        rowData.forEach((data) => {
          promises.push(this.validateExcelData(data))
        })
        Promise.all(promises)
          .then((dataArray) => {
            const personList = this.personList
            const personData = []
            dataArray.forEach((list) => {
              list.forEach((person) => {
                if (!personList.find((p) => p.bizId == person.userId)) {
                  person.bizName = person.userName
                  person.bizId = person.userId
                  personData.push(person)
                }
              })
            })
            this.personList = personList.concat(personData)
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
    validateExcelData(data) {
      return new Promise((resolve, reject) => {
        let params = data.map((item) => {
          let newItem = {}
          for (const key in item) {
            let header = requiredTHeader.find((header) => key.indexOf(header.name) > -1)
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
                const { phonenum, userName, failDesc } = info
                return [phonenum, userName, failDesc]
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
    checkSheets(sheets) {
      const sheetsKeys = Object.keys(sheets)
      for (let index = 0; index < sheetsKeys.length; index++) {
        const key = sheetsKeys[index]
        const sheet = sheets[key]
        const headers = []
        Object.keys(sheet).forEach((key) => {
          if (key[key.length - 1] == 1) {
            const cur = sheet[key]
            headers.push(cur.v)
          }
        })
        const missHeaders = requiredTHeader
          .map((header) => header.name)
          .filter((name) => {
            for (let i = 0; i < headers.length; i++) {
              const header = headers[i]
              let left, right
              if (name.length > header.length) {
                left = name
                right = header
              } else {
                left = header
                right = name
              }
              if (!left || !right) continue
              left += ''
              right += ''
              if (left.indexOf(right) > -1) {
                return false
              }
            }
            return true
          })
        if (missHeaders.length) {
          const requestTips =
            key + '缺少表头：[' + missHeaders.map((name) => name).join(',') + ']请检查重新上传'
          this.$alert(requestTips, '导入错误', { confirmButtonText: '确定', type: 'warning' })
          return false
        }
        return true
      }
    },
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
    searchPeople(e) {
      if (!e.trim()) {
        this.inputValue = e.trim()
        this.searchName = e.trim()
        return
      }
      this.inputValue = e.trim()
      if (this.valve) return
      clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        this.valve = true
        getOrgChild({ search: e.trim() }).then((res) => {
          this.searchName = e.trim()
          this.usersArr = res.users
          this.valve = false
        })
      }, 300)

      this.personPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
      this.positionPage.pageNo = 1
      this.departmentPage.pageNo = 1
    },
    validate() {
      return this.$refs.form.validate()
    }
  }
}
</script>
<style lang="scss">
.training-edit-person {
  .sub-header {
    .sub-header-title {
      position: relative;
    }
  }
}
</style>
<style lang="scss" scoped>
.training-edit-person {
  .table-header {
    display: flex;
    width: 100%;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 12px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 24px;
    .table-header-title {
      display: flex;
      color: #333;
      align-items: flex-end;
      .name {
        font-size: 18px;
        margin-right: 8px;
      }
      .info {
        font-size: 14px;
      }
    }
    .el-input {
      width: 250px;
    }
  }
  .table-container {
    margin-top: 20px;
    .sub-header {
      margin-top: 12px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .sub-header-title {
        font-size: 14px;
        .el-button--text {
          padding: 0;
        }
      }
    }
    .tag-table-container {
      position: relative;
      margin-top: 12px;
      min-height: 260px;
    }
    .tag-table {
      .tag-table-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        padding: 0 12px;
        height: 38px;
        line-height: 38px;
        border-radius: 3px;
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
        color: #909399;
        i {
          cursor: pointer;
          font-size: 16px;
        }
      }
    }
  }
}
.empty-header {
  padding: 0 !important;
  margin: 0 !important;
}
.empty-tips {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6f6f6f;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>
