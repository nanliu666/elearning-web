<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialog"
      width="550px"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <div v-loading="loading">
        <div>
          <commonForm
            ref="form"
            :model="form"
            :columns="columns"
          >
            <template slot="userId">
              <el-select
                v-model="form.userId"
                v-loadmore="loadMoreLeader"
                :class="isrules ? 'isrules' : ''"
                multiple
                filterable
                :multiple-limit="10"
                placeholder="请选择组织负责人"
              >
                <el-option
                  v-for="(item, k) in leaderList"
                  :key="k"
                  :label="item.name !== '空缺' ? item.name + '（' + item.workNo + '）' : item.name"
                  :value="item.userId"
                />
                <div
                  v-show="loadLeader"
                  class="addressLoading"
                >
                  <i class="el-icon-loading" />
                </div>
                <div
                  v-show="noMoreLeader"
                  style="text-align: center; font-size:14px;color: #606266;"
                >
                  没有更多了
                </div>
              </el-select>
            </template>
          </commonForm>

          <!--          <avue-form-->
          <!--            ref="form"-->
          <!--            v-model="form"-->
          <!--            :option="option"-->
          <!--          >-->
          <!--            <template slot="userId">-->
          <!--              <div>-->
          <!--                <div-->
          <!--                  v-for="(item, index) in allUserIdArr"-->
          <!--                  :key="index"-->
          <!--                >-->
          <!--                  <el-form-item-->
          <!--                    :label="labelTxt[index]"-->
          <!--                    :required="true"-->
          <!--                  >-->
          <!--                    <el-col :span="18">-->
          <!--                      <el-select-->
          <!--                        v-model="item.userIdArr"-->
          <!--                        v-loadmore="loadMoreLeader"-->
          <!--                        :class="isrules ? 'isrules' : ''"-->
          <!--                        multiple-->
          <!--                        filterable-->
          <!--                        :multiple-limit="10"-->
          <!--                        placeholder="请选择组织负责人"-->
          <!--                      >-->
          <!--                        <el-option-->
          <!--                          v-for="(item1, k) in leaderList"-->
          <!--                          :key="k"-->
          <!--                          :label="-->
          <!--                            item1.name !== '空缺'-->
          <!--                              ? item1.name + '（' + item1.workNo + '）'-->
          <!--                              : item1.name-->
          <!--                          "-->
          <!--                          :value="item1.userId"-->
          <!--                        />-->
          <!--                        <div-->
          <!--                          v-show="loadLeader"-->
          <!--                          class="addressLoading"-->
          <!--                        >-->
          <!--                          <i class="el-icon-loading" />-->
          <!--                        </div>-->
          <!--                        <div-->
          <!--                          v-show="noMoreLeader"-->
          <!--                          style="text-align: center; font-size:14px;color: #606266;"-->
          <!--                        >-->
          <!--                          没有更多了-->
          <!--                        </div>-->
          <!--                      </el-select>-->
          <!--                    </el-col>-->
          <!--                    <el-col-->
          <!--                      :span="3"-->
          <!--                      style="text-align: center"-->
          <!--                    >-->
          <!--                      <el-button-->
          <!--                        class="el-button el-button&#45;&#45;text"-->
          <!--                        @click="addSubLevel(index)"-->
          <!--                      >-->
          <!--                        添加下级-->
          <!--                      </el-button>-->
          <!--                    </el-col>-->
          <!--                    <el-col-->
          <!--                      v-if="index !== 0"-->
          <!--                      :span="3"-->
          <!--                      style="text-align: center"-->
          <!--                    >-->
          <!--                      <el-button-->
          <!--                        class="el-button el-button&#45;&#45;text"-->
          <!--                        @click="deleteSubLevel(index)"-->
          <!--                      >-->
          <!--                        删除-->
          <!--                      </el-button>-->
          <!--                    </el-col>-->
          <!--                  </el-form-item>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </avue-form>-->
        </div>
        <div
          v-if="!isEdit"
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="medium"
            @click="againAdd"
          >
            保存并继续添加
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="onClickAdd"
          >
            保存
          </el-button>
        </div>
        <div
          v-else
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="medium"
            @click="onContinue"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="medium"
            @click="onClickSave"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import treeSelect from '../../../components/treeSelect/treeSelect'
const options = []
let orgList = []
let orgType = [
  {
    label: '公司',
    value: 0,
    list: ['Enterprise', 'Company'],
    disabled: false
  },
  {
    label: '部门',
    value: 1,
    list: ['Enterprise', 'Company', 'Department'],
    disabled: false
  },
  {
    label: '小组',
    value: 2,
    list: ['Enterprise', 'Company', 'Department', 'Group'],
    disabled: false
  }
]
import { getOrganization, postOrganization, putOrganization } from '@/api/organize/grade'
import { getUserWorkList } from '@/api/org/org'
const consc = []
export default {
  name: 'OrgDialog',
  props: {
    isEdit: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    dialogVisible: {
      type: Boolean
    },
    orgData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    treechecked: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    const validateTree = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请选择关联职位'))
      } else {
        callback()
      }
    }
    return {
      isrules: false,
      allUserIdArr: [],
      labelTxt: [
        '负责人',
        '二级负责人',
        '三级负责人',
        '四级负责人',
        '五级负责人',
        '六级负责人',
        '七级负责人',
        '八级负责人',
        '九级负责人',
        '十级负责人'
      ],
      noMoreLeader: false,
      allType: ['Enterprise', 'Company', 'Department', 'Group', 'Jod'],
      key: ['orgName', 'code', 'parentOrgId', 'orgType', 'userId', 'remark'],
      loading: false,
      leaderList: [],
      totalPage: '',
      leaderPageNo: 1,
      loadLeader: false,
      limitCheck: true,
      isSingle: true,

      form: {
        orgName: '',
        remark: '',
        orgType: '',
        userId: [],
        parentOrgId: '',
        code: ''
      },
      columns: [
        {
          span: 20,
          offset: 2,
          prop: 'orgName',
          itemType: 'input',
          type: 'input',
          label: '组织名称',
          props: {},
          required: true
        },
        {
          span: 20,
          offset: 2,
          prop: 'code',
          itemType: 'input',
          options: [],
          disabled: true,
          type: 'input',
          label: '组织编码',
          props: {}
        },
        {
          span: 20,
          offset: 2,
          prop: 'parentOrgId',
          itemType: 'treeSelect',
          type: 'input',
          label: '上级组织',
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择用人部门',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'orgName',
                disabled: 'disabled',
                value: 'orgId'
              }
            }
          }
        },
        {
          span: 20,
          offset: 2,
          prop: 'orgType',
          itemType: 'radio',
          options: orgType,
          type: 'radio',
          label: '组织类型',
          required: true,
          props: {}
        },
        {
          span: 20,
          offset: 2,
          prop: 'userId',
          itemType: 'slot',
          options: [],
          type: 'select',
          label: '组织负责人',
          props: {}
        },
        {
          span: 20,
          offset: 2,
          prop: 'remark',
          itemType: 'input',
          type: 'textarea',
          label: '描述',
          rows: 3,
          props: {},
          maxlength: '1000'
        }
      ],
      option: {
        menuBtn: false,
        labelPosition: 'top',
        size: 'medium',
        column: [
          {
            label: '组织名称',
            prop: 'orgName',
            type: 'input',
            row: true,
            span: 24,
            placeholder: '请输入名称',
            rules: [
              {
                required: true,
                message: '请输入职位名称',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '组织编码',
            prop: 'code',
            type: 'input',
            row: true,
            display: false,
            span: 24,
            placeholder: '请输入组织编码',
            disabled: true,
            rules: [
              {
                required: true,
                message: '请输入组织编码',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '上级组织',
            prop: 'parentOrgId',
            type: 'tree',
            props: {
              label: 'label',
              value: 'id'
            },
            span: 24,
            disabled: false,
            limitCheck: false,
            placeholder: '请选择所属组织',
            rules: [
              {
                required: true,
                message: '请选择所属组织',
                trigger: 'blur'
              },
              {
                validator: validateTree,
                trigger: 'blur'
              }
            ],
            dicData: orgList,
            change: ({ value }) => {
              if (value && value !== '0') {
                // orgList.filter(it)
                let orgs = []
                this.filterOrg(orgList, value, orgs)

                let selectIndex = this.allType.findIndex((value) => value === orgs[0].orgType)
                let dataIndex = this.allType.findIndex((value) => value === this.orgData.type)
                // let type = selectIndex > dataIndex ? orgs[0].orgType : this.orgData.type
                let type = orgs[0].orgType
                if (selectIndex > dataIndex) {
                  this.form.orgType = ''
                }

                let i = this.find_index(this.option.column, 'orgType')
                this.option.column[i].dicData.map((it, index) => {
                  if (it.list.includes(type)) {
                    // if (selectIndex > dataIndex) {
                    if (!this.form.orgType) this.form.orgType = index
                    // }
                    it.disabled = false
                  } else {
                    it.disabled = true
                  }
                })
              }
            }
          },
          {
            label: '组织类型',
            prop: 'orgType',
            type: 'radio',
            limitCheck: false,
            row: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请选择组织类型',
                trigger: 'blur'
              }
            ],
            dicData: [
              {
                label: '公司',
                value: 0,
                list: ['Enterprise', 'Company'],
                disabled: false
              },
              {
                label: '部门',
                value: 1,
                list: ['Enterprise', 'Company', 'Department'],
                disabled: false
              },
              {
                label: '小组',
                value: 2,
                list: ['Enterprise', 'Company', 'Department', 'Group'],
                disabled: false
              }
            ]
          },

          {
            label: '',
            prop: 'userId',
            formslot: true,
            required: true,
            labelslot: true,
            errorslot: true,
            display: true,
            filterable: true,
            multiple: true,
            clearable: true,
            placeholder: '请选择组织负责人',
            span: 24,
            dicData: consc
          },
          {
            label: '描述',
            prop: 'remark',
            type: 'textarea',
            row: true,
            span: 24,
            placeholder: '请输入描述'
          }
        ]
      },
      dialog: true,
      options
    }
  },
  watch: {
    dialogVisible: {
      handler: function(val) {
        this.dialog = val
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    isEdit: {
      handler(val) {
        if (!val) {
          this.columns = this.columns.filter((it) => it.prop !== 'code')
          this.columns.find((it) => it.prop === 'parentOrgId').disabled = true
        } else {
          this.orgData.parentId === '0' &&
            (this.columns = this.columns.filter((it) => it.prop !== 'parentOrgId'))
        }
      },
      immediate: true
    },
    orgData: {
      handler: async function() {
        this.loading = true
        await this.getorgData()

        this.loading = false
        if (this.isEdit) {
          this.form.orgName = this.orgData.name
          this.form.code = this.orgData.code
          this.form.parentOrgId = this.orgData.parentId
          this.form.remark = this.orgData.remark
          this.form.userId = this.orgData.userId
          this.form.userId = this.orgData.leaders.reduce((pre, cur) => {
            if (cur) {
              pre.push(cur.userId)
            }
            return pre
          }, [])
        } else {
          setTimeout(() => {
            this.form.parentOrgId = this.orgData.id
          }, 500)
        }
        let types = {
          Enterprise: 0,
          Company: 0,
          Department: 1,
          Group: 2
        }
        this.form.orgType = types[this.orgData.type]
      },
      immediate: true,
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
    getUserWorkList({ pageNo: this.leaderPageNo, pageSize: 1000 }).then((res) => {
      this.leaderList = res.data
      this.leaderList.splice(0, 0, {
        userId: '',
        name: '空缺',
        workNo: ''
      })
      this.leaderPageNo += 1
    })
  },
  methods: {
    findOrg(id) {
      let org = {}
      function deep(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].orgId === id) {
            org = arr[i]
            return
          }
          if (arr[i].children && arr[i].children.length > 0) {
            deep(arr[i].children)
          }
        }
      }
      deep(this.orgTree)
      return org
    },
    edit(row) {
      this.leaderPageNo = 1
      this.type = 'edit'
      let leadersIdList = []
      if (row.leaders.length > 0) {
        //有负责人数据
        leadersIdList = this.turnToLevelArray(row.leaders)
        this.allUserIdArr = JSON.parse(JSON.stringify(leadersIdList))

        this.form.orgId = row.id
      } else {
        this.allUserIdArr = [{ level: 1, userId: [] }] //初始化责任人内容
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    filterOrg(org, value, orgs) {
      org.filter((it) => {
        if (it.id === value) {
          orgs.push(it)
          // orgs = JSON.parse(JSON.stringify(it))
        }
        if (it.children && it.children.length > 0) {
          this.filterOrg(it.children, value, orgs)
        }
      })
    },

    loadMoreLeader() {
      if (this.loadLeader || this.noMoreLeader) return
      this.loadLeader = true
      getUserWorkList({ pageNo: this.leaderPageNo, pageSize: 100 }).then((res) => {
        if (res.data.length > 0) {
          this.leaderList.push(...res.data)
          this.leaderPageNo += 1
          this.loadLeader = false
        } else {
          this.noMoreLeader = true
          this.loadLeader = false
        }
      })
    },
    getorgData(parentOrgId = '0') {
      let params = {
        parentOrgId: parentOrgId,
        orgName: '',
        orgType: '',
        userId: '',
        minUserNum: '',
        maxUserNum: ''
      }
      return new Promise((resolve) => {
        getOrganization(params).then((res) => {
          orgList = res
          function maps(data) {
            data.map((it) => {
              it.id = it.orgId
              it.label = it.orgName
              if (it.children) {
                maps(it.children)
              }
            })
          }

          maps(orgList)
          // let i = this.find_index(this.option.column, 'parentOrgId')
          // this.option.column[i].dicData = orgList
          this.columns.find((item) => item.prop === 'parentOrgId').props.treeParams.data = orgList

          resolve()
        })
      })
    },
    onContinue() {
      this.$emit('update:dialogVisible', false)
    },
    postOrg() {},
    //单个uesr数据转换成按级别分的数组
    turnToLevelArray(data = []) {
      let responsibleList = []
      const maxLevel = Math.max.apply(
        Math,
        data.map((item) => item.level)
      )
      for (var j = 0; j < maxLevel; j++) {
        responsibleList.push({
          level: j + 1,
          userIdArr: []
        })
      }
      data.map((item) => {
        responsibleList[item.level - 1]['userIdArr'].push(item.userId)
      })
      return responsibleList
    },
    //按级别分的数据转换成单个数据
    turnToLeaderList(data = []) {
      let leaderList = []
      if (data[0].userIdArr !== undefined) {
        for (var k = 0; k < data.length; k++) {
          for (var n = 0; n < data[k].userIdArr.length; n++) {
            leaderList.push({
              level: k + 1,
              userId: data[k].userIdArr[n]
            })
          }
        }
      }

      this.form.leaders = leaderList
    },
    //编辑新建添加下级
    addSubLevel(index) {
      if (this.allUserIdArr.length >= 10) {
        this.$message.warning('添加失败，最多只能十级负责人！')
        return
      }
      this.allUserIdArr.splice(index + 1, 0, [
        {
          level: index + 2,
          userId: []
        }
      ])
      for (var i = index + 1; i < this.allUserIdArr.length; i++) {
        this.allUserIdArr[i].level = this.allUserIdArr[i].level + 1
      }
    },
    //删除负责人下级
    deleteSubLevel(index) {
      this.allUserIdArr.splice(index, 1)
      for (var i = index; i < this.allUserIdArr.length; i++) {
        this.allUserIdArr[i].level = this.allUserIdArr[i].level - 1
      }
    },
    onClickAdd({ ishow = true }) {
      this.$refs.form.validate((vaild) => {
        this.turnToLeaderList(this.allUserIdArr)
        if (this.form.leaders.length == 0) {
          this.isrules = true
          return
        }
        this.isrules = false
        if (vaild) {
          let { orgName, parentOrgId, orgType, remark, leaders } = { ...this.form }
          // userId = userId.join(',')
          let type = {
            0: 'Company',
            1: 'Department',
            2: 'Group',
            3: 'Enterprise'
          }
          orgType = type[orgType]
          let params = {
            orgName,
            parentOrgId,
            orgType,
            remark,
            leaders
          }
          this.loading = true
          postOrganization(params)
            .then(() => {
              this.$emit('onsubmit')
              this.$message.success('添加成功')
              this.loading = false
              if (ishow) {
                this.$emit('update:dialogVisible', false)
              } else {
                let parentOrgId = JSON.parse(JSON.stringify(this.form.parentOrgId))
                this.$refs.form.resetFields()
                this.form.parentOrgId = parentOrgId
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    againAdd() {
      this.onClickAdd({ ishow: false })
    },
    onClickSave() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.turnToLeaderList(this.allUserIdArr)
          let { orgId, orgName, parentOrgId, orgType, remark, leaders } = { ...this.form }
          // userId = userId.join(',')
          let type = {
            0: 'Company',
            1: 'Department',
            2: 'Group',
            3: 'Enterprise'
          }
          orgType = type[orgType]
          let params = {
            orgId: orgId || this.orgData.id,
            orgName,
            parentOrgId,
            orgType,
            remark,
            leaders
          }
          this.loading = true

          putOrganization(params)
            .then(() => {
              this.$emit('onsubmit')
              this.$message.success('修改成功')
              this.loading = false
              this.handleClose()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    find_index(data, key) {
      let index = ''
      data.map((it, i) => {
        if (it.prop === key) {
          index = i
        }
      })
      return index
    },
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style>
.isrules .el-input__inner {
  border: 1px solid #f56c6c;
}
.isrules {
  position: relative;
}
.isrules:after {
  position: absolute;
  top: 28px;
  font-size: 12px;
  left: 1px;
  color: #f56c6c;

  content: '请选择负责人';
}
</style>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  border-bottom: 1px solid rgba(208, 211, 214, 0.44);
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}
/deep/ .el-dialog__body {
  padding: 24px;
}
/deep/.el-dialog__footer {
  padding: 0px 24px 24px;
}
/deep/.el-form-item__label {
  line-height: 20px;
  font-size: 14px;
  color: #0f0000;
}
/deep/ .el-form-item {
  margin-bottom: 24px;
}
.dialog-footer {
  text-align: right;
}
</style>
