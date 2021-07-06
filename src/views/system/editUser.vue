<template>
  <div style="height">
    <page-header
      :title="`${id ? '编辑' : '创建'}用户`"
      show-back
      :back="goBack"
    />
    <basic-container>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <common-form
            ref="form"
            :model="form"
            :columns="columns"
            @node-click="_nodeClickFun"
          >
            <template slot="title1">
              <h3>基本信息</h3>
            </template>
            <template slot="title2">
              <h3>详细信息</h3>
            </template>

            <template slot="attachments">
              <common-upload
                v-model="uploadFileList"
                multiple
                :before-upload="beforeUpload"
                :limit="5"
                :on-exceed="onUploadExceed"
                :file-list="uploadFileList"
              >
                <div
                  slot="tip"
                  class="upload__tip"
                >
                  支持上传png、jpg、jpeg格式文件，单个文件大小＜5MB，最多5个文件
                </div>
                <template #default>
                  <el-button
                    size="medium"
                    :class="{ 'is-disabled': uploadFileList.length >= 5 }"
                    @click="handleUpload($event)"
                  >
                    上传
                  </el-button>
                  <ul
                    class="upload__files"
                    @click="handleUpload($event)"
                  >
                    <li
                      v-for="(item, index) in uploadFileList"
                      :key="index"
                    >
                      {{ item.localName }}
                      <i
                        class="el-icon-close"
                        @click.stop="handleRemoveAttachment(index)"
                      ></i>
                    </li>
                  </ul>
                </template>
              </common-upload>
            </template>
          </common-form>
          <div class="page-bottom">
            <el-button
              type="primary"
              size="medium"
              @click="handleSubmit"
            >
              保存
            </el-button>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { checkUserInfo, createUser, createNewWorkNo, editUser } from '@/api/personnel/roster'
import { getStaffBasicInfo } from '@/api/personalInfo'
import { getRoleList, getPositionAll } from '@/api/system/role'
import { getUserWorkList, getOrgTree } from '@/api/org/org'
import { mapGetters } from 'vuex'
import commonUpload from '@/components/common-upload/commonUpload'
import { getRankTree } from '@/api/system/rank'
export default {
  name: 'EditUser',
  components: {
    commonUpload
  },
  data() {
    var checkPhonenum = (rule, value, callback) => {
      if (this.id) {
        callback()
        return
      }
      checkUserInfo({ phonenum: value })
        .then(() => {
          callback()
        })
        .catch(() => {
          callback(new Error('该手机号已存在'))
        })
    }
    var checkEmail = (rule, value, callback) => {
      if (this.id) {
        callback()
        return
      }
      checkUserInfo({ email: value })
        .then(() => {
          callback()
        })
        .catch(() => {
          callback(new Error('该邮箱已存在'))
        })
    }
    return {
      treeName: '组织', //切换组织部门
      submitting: false,
      form: {
        remark: '',
        name: '',
        sex: '',
        idNo: '',
        phonenum: '',
        password: '',
        email: '',
        roleIds: [],
        orgId: '',
        birthDate: '',
        leaderId: '',
        positionId: '',
        postLevelId: '',
        post: '',
        positionTitle: '',
        entryDate: null,
        ipScope: '',
        attachments: []
      },
      uploadFileList: [],
      columns: [
        {
          prop: 'title1',
          itemType: 'slotout',
          span: 24,
          label: ''
        },
        {
          span: 10,
          itemType: 'input',
          prop: 'name',
          label: '姓名',
          rules: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        {
          prop: 'phonenum',
          itemType: 'input',
          label: '手机号码',
          maxlength: 11,
          offset: 3,
          span: 10,
          props: {
            onlyNumber: true
          },
          required: true,
          rules: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            {
              pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
              message: '手机号码不合法',
              trigger: 'blur'
            },
            { validator: checkPhonenum, trigger: 'blur' }
          ]
        },
        {
          itemType: 'input',
          prop: 'email',
          label: '电子邮件',
          span: 10,
          rules: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
            { validator: checkEmail, trigger: 'blur' }
          ]
        },
        {
          itemType: 'radio',
          prop: 'sex',
          label: '性别',
          offset: 3,
          span: 10,
          options: [
            { label: '男', value: 1 },
            { label: '女', value: 0 }
          ]
        },
        {
          span: 10,
          itemType: 'input',
          prop: 'idNo',
          label: '身份证号',
          rules: [
            { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '您的身份证格式不正确' }
          ]
        },
        {
          span: 10,
          itemType: 'select',
          prop: 'roleIds',
          label: '角色',
          offset: 3,
          multiple: true,
          props: {
            label: 'roleName',
            value: 'roleId'
          },
          options: []
        },
        {
          span: 10,
          prop: 'birthDate',
          itemType: 'datePicker',
          label: '出生日期',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          }
        },
        {
          span: 10,
          prop: 'password',
          itemType: 'input',
          label: '密码',
          offset: 3,
          rules: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              pattern: /^[\w*_]{6,20}$/,
              message: '只能输入6-20个字母、数字、下划线 、*',
              trigger: 'blur'
            }
          ]
        },

        { itemType: 'slotout', span: 24, prop: 'title2' },
        {
          span: 10,
          prop: 'orgId',
          itemType: 'treeSelect',
          label: '所在部门',
          props: {
            selectParams: {
              placeholder: '请选择所在部门',
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
          itemType: 'lazySelect',
          load: this.loadUser,
          span: 10,
          offset: 3,
          optionProps: {
            formatter: (item) => `${item.name}`,
            key: 'userId',
            value: 'userId'
          },
          searchable: true,
          prop: 'leaderId',
          label: '直接领导'
        },
        {
          prop: 'positionId',
          itemType: 'treeSelect',
          label: '岗位',
          treeKey: 'positionId',
          span: 10,
          props: {
            selectParams: {
              placeholder: '请选择岗位',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: true,
              props: {
                children: 'children',
                label: 'name',
                value: 'id'
              }
            }
          }
        },
        {
          options: [],
          prop: 'postLevelId',
          itemType: 'treeSelect',
          label: '职级',
          treeKey: 'postLevelId',
          offset: 3,
          span: 10,
          props: {
            selectParams: {
              placeholder: '请选择职级',
              multiple: false
            },
            treeParams: {
              data: [],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: true,
              props: {
                children: 'children',
                label: 'name',
                value: 'id',
                disabled: 'disabled'
              }
            }
          }
        },

        {
          span: 10,
          itemType: 'input',
          prop: 'post',
          maxlength: 32,
          label: '职务'
        },
        {
          span: 10,
          itemType: 'input',
          prop: 'positionTitle',
          offset: 3,
          maxlength: 32,
          label: '职称'
        },
        {
          span: 10,
          prop: 'entryDate',
          label: '入职日期',
          itemType: 'datePicker'
        },
        // {
        //   itemType: 'input',
        //   prop: 'ipScope',
        //   offset: 3,
        //   label: '允许IP范围',
        //   rules: [
        //     {
        //       pattern: /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/,
        //       message: 'IP地址格式错误',
        //       trigger: 'blur'
        //     }
        //   ]
        // },
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'remark',
          label: '备注',
          span: 24,
          maxLength: 100
        },
        {
          itemType: 'slot',
          prop: 'attachments',
          span: 24,
          label: '附件'
        }
      ],
      orgTreeData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userId']),
    id() {
      return this.$route.query.userId
    }
  },
  watch: {
    uploadFileList(val) {
      this.$set(
        this.form,
        'attachments',
        val.map((item) => ({ url: item.url, name: item.localName }))
      )
    }
    // 'form.orgId'(val) {}
  },

  activated() {
    this.loadOrgData()
    this.loadRoleData()
    this.loadUserData()
    this.resetForm()
    if (!this.id) {
      //如果是创建  设置密码默认值
      this.form.password = 'xcmg123456'
    }
    //修改tab  标题
    this.$store.commit('SET_TAG_LABEL', `${this.id?'编辑用户':'添加用户'}`)
    getPositionAll().then((res) => {
      const positionConfig = _.find(this.columns, { prop: 'positionId' })
      _.set(positionConfig, 'props.treeParams.data', res)
    })

    getRankTree().then((res) => {
      // debugger
      const postLevelConfig = _.find(this.columns, { prop: 'postLevelId' })
      console.log('postLevelConfig333', res)
      _.set(postLevelConfig, 'props.treeParams.data', res)
    })
  },
  methods: {
    _nodeClickFun(val,node) {

      // this.form.position = val.name
    },
    onUploadExceed() {
      this.$message.warning('上传附件不能超过5个')
    },
    handleUpload(e) {
      if (this.uploadFileList.length >= 5) {
        e.stopPropagation()
      }
    },
    resetForm() {
      this.uploadFileList = []
      this.$refs['form'].resetFields()
    },
    loadUserData() {
      if (!this.id) {
        return
      }
      getStaffBasicInfo({ userId: this.id }).then((res) => {
        this.uploadFileList = _.map(res.attachments, (item) => ({
          url: item.url,
          localName: item.name
        }))
        if (res.leaderId) {
          this.$set(
            this.columns.find((item) => item.prop === 'leaderId'),
            'firstOption',
            [
              {
                userId: res.leaderId + '',
                name: res.leaderName
              }
            ]
          )
        }
        this.form = {
          roleIds: _.map(res.roles, 'roleId'),
          leaderId: res.leaderId + '',
          remark: res.userRemark,
          password: '**********', //如果是编辑用户信息    设置默认密码
          ...res
        }
        delete this.form.roles
      })
    },
    loadOrgData() {
      getOrgTree({ parentOrgId: '0' }).then((res) => {
        this.columns.find((item) => item.prop === 'orgId').props.treeParams.data = res
        this.orgTreeData = res
      })
    },
    loadRoleData() {
      getRoleList({ categoryId: '' }).then((res) => {
        this.columns.find((item) => item.prop === 'roleIds').options = res
      })
    },

    loadUser(params) {
      return getUserWorkList(params)
    },
    beforeUpload(file) {
      const regx = /^.*\.(png|jpg|jpeg)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (this.uploadFileList.length >= 5) {
        this.$message.error('上传附件不能超过5个')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传附件只支持png、jpg、jpeg格式文件')
        return false
      }
      return true
    },
    handleRemoveAttachment(index) {
      this.uploadFileList.splice(index, 1)
    },
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$refs.form.clearValidate()
      this.$router.back(-1)
    },
    async submitAndCreate() {
      await this.onSubmit()
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.form.clearValidate()
    },
    async handleSubmit() {
      await this.onSubmit()
      this.goBack()
    },
    createWorkNo() {
      return new Promise((resolve, reject) => {
        createNewWorkNo()
          .then((res) => {
            resolve(res.workNo)
          })
          .catch((err) => reject(err))
      })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
      } catch (error) {
        this.$message.error('请完善信息')
        throw error
      }

      const params = { ...this.form, entryUser: this.userId }

      
      if (this.id) {
        //如果是编辑   设置密码不可见
        if (params.password === '**********') {
          //如果 修改了密码    就传参     如果没有修改  删除属性
          delete params.password
        }
      }
      this.loading = true
      let func
      if (this.id) {
        func = editUser
      } else {
        func = createUser
        const workNo = await this.createWorkNo()
        params.workNo = workNo
      }
      try {
        await func(params)
        this.$message.success('保存成功')
        this.loading = false
        Object.assign(this.$data.form, this.$options.data().form)
      } catch (error) {
        this.loading = false
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload__tip {
  font-size: 12px;
}
/deep/ .el-upload {
  text-align: left;
  display: block;
}
.upload__files {
  margin-top: 4px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    &:hover {
      color: $primaryColor;
    }
  }
}
/deep/.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
