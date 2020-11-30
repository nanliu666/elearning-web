<template>
  <div style="height">
    <page-header
      :title="`${id ? '编辑' : '添加'}用户`"
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
              >
                <div
                  slot="tip"
                  class="upload__tip"
                >
                  支持上传png、jpg、jpge格式文件，单个文件大小＜5MB，最多5个文件
                </div>
                <template #default>
                  <el-button size="medium">
                    上传
                  </el-button>
                  <ul class="upload__files">
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
import { getRoleList } from '@/api/system/role'
import { getUserWorkList, getOrgTreeSimple } from '@/api/org/org'
import { mapGetters } from 'vuex'
import commonUpload from '@/components/common-upload/commonUpload'
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
        name: '',
        sex: '',
        phonenum: '',
        email: '',
        roleIds: [],
        orgId: '',
        birthDate: '',
        leaderId: '',
        position: '',
        postLevel: '',
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
          offset: 4,
          props: {
            onlyNumber: true
          },
          required: true,
          rules: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '手机号码不合法', trigger: 'blur' },
            { validator: checkPhonenum, trigger: 'blur' }
          ]
        },
        {
          itemType: 'input',
          prop: 'email',
          label: '电子邮件',
          rules: [
            // { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
            { validator: checkEmail, trigger: 'blur' }
          ]
        },
        {
          itemType: 'radio',
          prop: 'sex',
          label: '性别',
          offset: 4,
          options: [
            { label: '男', value: 1 },
            { label: '女', value: 0 }
          ]
        },
        {
          itemType: 'select',
          prop: 'roleIds',
          label: '角色',
          multiple: true,
          props: {
            label: 'roleName',
            value: 'roleId'
          },
          options: []
        },
        {
          prop: 'birthDate',
          offset: 4,
          itemType: 'datePicker',
          label: '出生日期'
        },

        { itemType: 'slotout', span: 24, prop: 'title2' },
        {
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
          offset: 4,
          optionProps: {
            formatter: (item) => `${item.name}`,
            key: 'userId',
            value: 'userId'
          },
          // firstOption: null,
          prop: 'leaderId',
          label: '直接领导'
        },
        {
          itemType: 'input',
          prop: 'position',
          label: '岗位'
        },
        {
          itemType: 'input',
          prop: 'postLevel',
          offset: 4,
          label: '职级'
        },
        {
          itemType: 'input',
          prop: 'post',
          label: '职务'
        },
        {
          itemType: 'input',
          prop: 'positionTitle',
          offset: 4,
          label: '职称'
        },
        {
          prop: 'entryDate',
          label: '入职日期',
          itemType: 'datePicker'
        },
        {
          itemType: 'input',
          prop: 'ipScope',
          offset: 4,
          label: '允许IP范围',
          rules: [
            {
              pattern: /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/,
              message: 'IP地址格式错误',
              trigger: 'blur'
            }
          ]
        },
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
  },

  activated() {
    this.loadUserData()
    this.resetForm()
  },
  created() {
    this.loadOrgData()
    this.loadRoleData()
  },

  methods: {
    resetForm() {
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
        // this.columns.find((item) => item.prop === 'leaderId').firstOption = {
        //   userId: res.leaderId + '',
        //   name: res.leaderName
        // }
        this.form = {
          roleIds: _.map(res.roles, 'roleId'),
          leaderId: res.leaderId + '',
          ...res
        }
        delete this.form.roles
      })
    },
    loadOrgData() {
      getOrgTreeSimple({ parentOrgId: '0' }).then((res) => {
        this.columns.find((item) => item.prop === 'orgId').props.treeParams.data = res
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

      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传附件只支持png、jpg、jpge格式文件')
        return false
      }
      return true
    },
    handleRemoveAttachment(index) {
      this.form.attachment.splice(index, 1)
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
        this.$message.success('创建成功')
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
</style>
