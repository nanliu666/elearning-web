<template>
  <div class="training-edit-person">
    <div class="table-header">
      <div class="table-header-title">
        <div class="name">
          关联人员
        </div>
        <div class="info">
          人数：{{ total }}人
        </div>
      </div>
      <el-input
        v-model="searchName"
        :maxlength="32"
        placeholder="请搜索人员姓名"
        size="medium"
        suffix-icon="el-icon-search"
        clearable
      ></el-input>
    </div>

    <div
      v-if="type == 'inside'"
      class="table-container"
    >
      <div class="sub-header">
        <div class="sub-header-title">
          部门：{{ orgSearchList.length ? orgSearchList.length : orgList.length }} 人数：{{
            curOrgList.reduce((total, next) => (total += next.workNum || 0), 0)
          }}人
        </div>
        <el-button
          type="primary"
          size="medium"
          @click="orgPickerVisible = true"
        >
          添加部门
        </el-button>
      </div>
      <div
        v-loading="curOrgList.length && orgListLoading"
        class="tag-table-container"
      >
        <el-row
          v-if="curOrgList.length"
          :gutter="20"
          class="tag-table"
        >
          <el-col
            v-for="org in curOrgList"
            :key="org.id"
            :span="8"
          >
            <div class="tag-table-item">
              <div class="name">
                （{{ org.workNum }}人）{{ org.name }}
              </div>
              <i
                class="el-icon-close"
                @click="handleDeleteOrg(org)"
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
        v-if="orgList.length > 10"
        class="page-container"
      >
        <pagination
          :total="orgSearchList.length || orgList.length"
          :page.sync="orgPage.pageNo"
          :limit.sync="orgPage.pageSize"
        ></pagination>
      </div>
    </div>

    <div
      v-if="type == 'inside'"
      class="table-container"
    >
      <div class="table-header empty-header"></div>
      <div class="sub-header">
        <div class="sub-header-title">
          岗位：{{
            positionSearchList.length ? positionSearchList.length : curPositionList.length
          }}
          人数：{{ curPositionList.reduce((total, next) => (total += next.workNum || 0), 0) }}人
        </div>
        <el-button
          type="primary"
          size="medium"
          @click="positionPickerVisible = true"
        >
          添加岗位
        </el-button>
      </div>

      <div
        v-loading="curPositionList.length && positionListLoading"
        class="tag-table-container"
      >
        <el-row
          v-if="curPositionList.length"
          :gutter="20"
          class="tag-table"
        >
          <el-col
            v-for="position in curPositionList"
            :key="position.positionId"
            :span="8"
          >
            <div class="tag-table-item">
              <div class="name">
                （{{ position.workNum }}人）{{ position.positionName }}
              </div>
              <i
                class="el-icon-close"
                @click="handleDeletePosition(position)"
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
          :total="positionSearchList.length ? positionSearchList.length : positionList.length"
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
              @click="() => handleDeletePerson()"
            >
              批量删除
            </el-button>
          </div>
          <div v-else>
            人数：{{ searchName ? curPersonList.length : personList.length }}人
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
            @click="personPickerVisible = true"
          >
            添加人员
          </el-button>
        </el-row>
      </div>
      <el-table
        ref="personTable"
        style="margin-top: 12px"
        height="450"
        :data="curPersonList"
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
        >
          <template slot-scope="scope">
            {{ scope.row.bizName.replace(/\(.+\)/g, '') }}
          </template>
        </el-table-column>
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
              @click="handleDeletePerson(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="searchName ? curPersonList.length : personList.length"
        :page.sync="personPage.pageNo"
        :limit.sync="personPage.pageSize"
      ></pagination>
    </div>

    <common-picker
      ref="person-picker"
      v-model="personList"
      :visible.sync="personPickerVisible"
      :options="personPickerOptions"
      :reserve="false"
    />
    <common-picker
      v-model="orgList"
      dialog-title="添加部门"
      header-title="请选择部门"
      :visible.sync="orgPickerVisible"
      :options="orgPickerOptions"
      :props="orgPickerProps"
      :selected-style="orgSelectedStyle"
      :reserve="false"
    />
    <common-picker
      v-model="positionList"
      dialog-title="添加岗位"
      header-title="请选择岗位"
      :visible.sync="positionPickerVisible"
      :options="positionPickerOptions"
      :props="positionPickerProps"
      :selected-style="positionSelectedStyle"
      :reserve="false"
    />
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import CommonPicker from '@/components/common-picker'
import { userImportCheck, getOrgChild } from '@/api/train/train'
import { getPostionUserChild2, getGroup, getOrgUserChild, getOuterUser } from '@/api/system/user'
import XLSX from 'xlsx'
import { getUsergroupList, getPositionUserList1, getUserList } from '@/api/examManage/schedule'
import { getStationParent } from '@/api/system/station'
import { getTemplate } from '@/api/system/template'
const requiredTHeader = [
  { name: '用户手机号', key: 'phonenum' },
  { name: '姓名', key: 'userName' }
]
export default {
  name: 'TrainingEditPerson',
  components: {
    Pagination,
    CommonPicker
  },
  props: {
    isNext: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'inside'
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      downloadLoading: false,
      orgListLoading: false,
      positionListLoading: false,
      personName: '',
      personPage: {
        pageNo: 1,
        pageSize: 10
      },
      orgPage: {
        pageNo: 1,
        pageSize: 10
      },
      positionPage: {
        pageNo: 1,
        pageSize: 10
      },
      multipleSelection: [],
      personPickerVisible: false,
      positionPickerVisible: false,
      orgPickerVisible: false,
      searchName: '',
      personPickerOptions: [
        {
          name: '组织机构',
          request: getOrgUserChild,
          response: {
            props: {
              data: ['orgs', 'users'],
              total: 'totalNum'
            },
            processData(item) {
              item.userId = item.userId || item.id
              return item
            }
          },
          type: 'tree',
          placeholder: '搜索组织部门或成员姓名',
          checkRequest: {
            condition: function($data) {
              return $data.id
            },
            handler: function($data, resolve) {
              getUserList({ orgId: $data.id }).then((res = []) => {
                res = res.map((item) => {
                  item.orgId = [...new Set([item.orgId, $data.id])].filter((item) => !!item)
                  if (item.positionId) {
                    item.positionId = [item.positionId]
                  }
                  return item
                })
                resolve(res)
              })
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
          query: {
            search: {
              key: 'search',
              value: ''
            },
            id: {
              key: 'parentId',
              from: 'id',
              value: '0',
              initialValue: '0'
            }
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
          }
        },
        {
          name: '外部人员',
          request: getOuterUser,
          type: 'table',
          placeholder: '搜索成员姓名',
          response: {
            props: {
              data: 'data',
              total: 'totalNum'
            }
          },
          props: {
            value: 'userId',
            select: ['userId', 'name', 'orgName', 'positionName', 'workNo', 'phonenum']
          },
          label: function(data) {
            const { name, phonenum } = data
            if (phonenum) {
              return name + '(' + phonenum + ')'
            }
            return name
          },
          query: {
            search: {
              key: 'search',
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
          }
        },
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
      orgPickerOptions: [
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
      orgPickerProps: {
        value: 'id',
        select: ['id', 'name', 'workNum', 'parentIds']
      },
      positionPickerProps: {
        value: 'positionId',
        select: ['positionId', 'positionName', 'workNum', 'parentIds']
      },
      orgSearchList: [],
      positionSearchList: [],
      orgSelectedStyle: {
        icon: 'icon-usercircle2',
        label: 'name'
      },
      positionSelectedStyle: {
        icon: 'icon-usercircle2',
        label: function(node) {
          const { positionName } = node
          return positionName
        }
      }
    }
  },
  computed: {
    total() {
      return this.getOrgAmount() + this.getPositionAmount() + this.getPersonAmount()
    },
    personList: {
      get: function() {
        if (this.type == 'outer') {
          return this.form.trainObjectsList
        } else {
          return this.form.personnelObjects.userObjects
        }
      },
      set: function(value) {
        let allowableValue = this.checkExceed(value)
        if (allowableValue) {
          this.$alert(
            `关联人数不能超出已设置的计划人数(${this.form.people}人)，目前已关联${
              this.total
            }人，仅允许关联${allowableValue - this.total > 0 ? allowableValue - this.total : 0}人`,
            '提示',
            {
              confirmButtonText: '确定',
              type: 'warning'
            }
          )
          return
        }
        if (this.type == 'outer') {
          this.form.trainObjectsList = value
        } else {
          this.form.personnelObjects.userObjects = value
        }
        this.$nextTick(() => {
          this.multipleSelection = []
          this.$refs.personTable.clearSelection()
        })
      }
    },
    orgList: {
      get: function() {
        return this.form.personnelObjects.orgObjects
      },
      set: function(value) {
        value = value.filter(
          (item) => !value.find((v) => item.parentIds && item.parentIds.includes(v.id))
        )
        if (value.length > this.form.personnelObjects.orgObjects.length) {
          const people = this.form.people
          if (people > 0 && this.getOrgAmount(value) + this.total > this.form.people) {
            this.$alert(
              `关联人数不能超出已设置的计划人数(${this.form.people}人)，目前已关联${
                this.total
              }人，仅允许关联人数为${
                this.form.people - this.total > 0 ? this.form.people - this.total : 0
              }人及以下的部门`,
              '提示',
              {
                confirmButtonText: '确定',
                type: 'warning'
              }
            )
            return
          }
        }
        this.form.personnelObjects.orgObjects = value
      }
    },
    positionList: {
      get: function() {
        return this.form.personnelObjects.positionObjects
      },
      set: function(value) {
        if (value.length > this.form.personnelObjects.positionObjects.length) {
          const people = this.form.people
          if (people > 0 && this.getOrgAmount(value) + this.total > this.form.people) {
            this.$alert(
              `关联人数不能超出已设置的计划人数(${this.form.people}人)，目前已关联${
                this.total
              }人，仅允许关联人数为${
                this.form.people - this.total > 0 ? this.form.people - this.total : 0
              }人及以下的岗位`,
              '提示',
              {
                confirmButtonText: '确定',
                type: 'warning'
              }
            )
            return
          }
        }

        this.form.personnelObjects.positionObjects = value
      }
    },
    curOrgList: {
      get() {
        const orgSearchList = this.orgSearchList
        const orgList = this.orgList
        const { pageSize: size, pageNo: no } = this.orgPage
        if (orgSearchList.length) {
          return orgList
            .filter((org) => orgSearchList.find((_org) => _org.orgId === org.id))
            .slice(size * (no - 1), size * no)
        } else if (orgSearchList.noData) {
          orgSearchList.noData = false
          return []
        }
        return orgList.slice(size * (no - 1), size * no)
      }
    },
    curPositionList() {
      const positionList = this.positionList
      const positionSearchList = this.positionSearchList
      const { pageSize: size, pageNo: no } = this.positionPage
      if (positionSearchList.length) {
        return positionList
          .filter((pos) =>
            positionSearchList.find((_pos) => _pos.positionName === pos.positionName)
          )
          .slice(size * (no - 1), size * no)
      } else if (positionSearchList.noData) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.positionSearchList.noData = false
        return []
      }
      return this.positionList.slice(size * (no - 1), size * no)
    },
    curPersonList() {
      const { pageSize: size, pageNo: no } = this.personPage
      const list = this.personList.slice(size * (no - 1), size * no)
      const searchName = this.searchName
      if (!searchName) {
        return list
      } else {
        return this.personList.filter((item) => {
          const name = item.bizName || item.userName || item.name
          return name.indexOf(searchName) > -1
        })
      }
    }
  },
  watch: {
    total(val) {
      this.form.peopleNum = val
    },
    searchName: _.debounce(function(name, oldName) {
      if (name === oldName) return
      if (this.type === 'outer') {
        this.personPage.pageSize = 10
        this.personPage.pageNo = 1
        return
      }
      name = name.trim()
      this.orgListLoading = true
      this.positionListLoading = true
      const params = { search: name }
      getOrgChild(params)
        .then((data) => {
          this.orgSearchList = name ? data.users : []
          this.orgSearchList.noData = name && !data.users.length
          this.orgPage.pageSize = 10
          this.orgPage.pageNo = 1
        })
        .finally(() => (this.orgListLoading = false))
      getPostionUserChild2(params)
        .then((data) => {
          this.positionSearchList = name ? data.users : []
          this.positionSearchList.noData = name && !data.users.length
          this.positionPage.pageSize = 10
          this.positionPage.pageNo = 1
        })
        .finally(() => (this.positionListLoading = false))
    }, 1000)
  },
  methods: {
    checkExceed(value) {
      const { people = 0 } = this.form
      if (people === 0) return false
      if (this.type === 'inside') {
        if (this.getPersonAmount(value) > people) {
          return people
        }
      } else {
        if (this.form.id && !this.isNext) {
          const { applyJoinObjectNum = 0 } = this.form
          if (this.getPersonAmount(value) + applyJoinObjectNum > people) {
            return people - applyJoinObjectNum
          }
        } else {
          if (this.getPersonAmount(value) > people) {
            return people
          }
        }
      }
    },
    getOrgAmount(target) {
      let list
      list = target || this.curOrgList
      return list.reduce((total, next) => {
        total += next.workNum || 0
        return total
      }, 0)
    },
    getPositionAmount(target) {
      let list
      list = target || this.curPositionList
      return list.reduce((total, next) => {
        total += next.workNum || 0
        return total
      }, 0)
    },
    getPersonAmount(target) {
      let personList
      if (target) {
        personList = target
      } else {
        personList = this.searchName ? this.curPersonList : this.personList
      }
      personList = personList.filter((person) => {
        const OrgExist = this.curOrgList.some((o) => {
          return Array.isArray(person.orgId) ? person.orgId.includes(o.id) : o.id === person.orgId
        })
        const posExist = this.curPositionList.some((pos) => {
          return Array.isArray(person.positionId)
            ? person.positionId.includes(pos.positionId)
            : pos.positionId === person.positionId
        })
        return !OrgExist && !posExist
      })
      return personList.length
    },
    handleDeleteOrg(org) {
      const orgList = JSON.parse(JSON.stringify(this.orgList))
      orgList.splice(
        orgList.findIndex((o) => o.id == org.id),
        1
      )
      this.orgList = orgList
    },
    handleDeletePosition(pos) {
      const positionList = JSON.parse(JSON.stringify(this.positionList))
      positionList.splice(
        positionList.findIndex((_pos) => _pos.positionId == pos.positionId),
        1
      )
      this.positionList = positionList
    },
    handleDeletePerson(target) {
      let message = ''
      if (target) {
        message = '您确定要删除该人员吗？'
      } else {
        message = '您确定要批量删除所选人员吗？'
      }
      this.$confirm(message, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const list = this.personList
          this.personList = JSON.parse(JSON.stringify(list))
          if (target) {
            this.personList.splice(
              this.personList.findIndex((person) => person.bizId === target.bizId),
              1
            )
            return
          }
          this.personList = list.filter((person) => this.multipleSelection.indexOf(person) < 0)
          this.multipleSelection = []
          this.$refs.personTable.clearSelection()
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    handleDownloadTemplate() {
      this.downloadLoading = true
      getTemplate({ code: 't3' })
        .then((res = {}) => {
          const { fileName, fileUrl } = res
          const a = document.createElement('a')
          a.href = fileUrl
          a.setAttribute('download', fileName)
          a.click()
        })
        .finally(() => (this.downloadLoading = false))
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
    }
  }
}
</script>
<style lang="scss">
.training-edit-person {
  .sub-header {
    .sub-header-title {
      position: relative;
      // &::before {
      //   position: absolute;
      //   content: ' ';
      //   display: block;
      //   top: 5px;
      //   left: 0;
      //   height: 15px;
      //   width: 4px;
      //   border-radius: 20%;
      //   background-color: #409eff;
      // }
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
    padding-bottom: 12px;
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
</style>
