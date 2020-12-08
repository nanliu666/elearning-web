<template>
  <div>
    <page-header
      title="表单模板页"
      show-back
    />
    <basic-container>
      <el-row
        type="flex"
        justify="center"
        style="padding-top:40px;"
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
            <template slot="title">
              <h4>详细信息</h4>
            </template>
            <template slot="name-label">
              姓名
              <el-tooltip
                class="item"
                effect="dark"
                content="提示文字"
                placement="top-start"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
            <template slot="resume">
              <common-upload
                v-model="form.resume"
                :multiple="false"
                :before-upload="beforeResumeUpload"
              >
                <el-button
                  v-if="form.resume.length === 0"
                  size="medium"
                >
                  上传简历
                </el-button>
                <el-button
                  v-else
                  size="medium"
                  type="text"
                >
                  {{ form.resume[0].localName }}
                </el-button>
              </common-upload>
            </template>
            <template #pictures="">
              <common-upload
                v-model="uploadFileList"
                multiple
                :before-upload="beforeUpload"
                :limit="5"
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
                  <ul
                    class="upload__files"
                    @click.stop=""
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
import { provinceAndCityData } from 'element-china-area-data'
import { getRecruitmentList } from '@/api/personnel/person'
import { getOrgTreeSimple } from '@/api/org/org'

export default {
  name: 'DemoForm',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
  },
  data() {
    return {
      personId: null,
      form: {
        recruitmentId: null,
        name: null,
        sex: null,
        age: null,
        email: null,
        addressArr: [],
        recruitment: null,
        resume: [],
        remark: '',
        orgId: '',
        date: null
      },
      uploadFileList: [],
      columns: [
        {
          prop: 'recruitmentId',
          itemType: 'select',
          label: '招聘需求',
          options: [],
          props: {
            label: 'jobName',
            value: 'id'
          },
          required: true
        },
        {
          prop: 'orgName',
          label: '部门名称',
          disabled: true,
          itemType: 'input',
          type: 'textarea',
          offset: 4
        },
        {
          prop: 'name',
          label: '姓名',
          itemType: 'input',
          required: true
          // placeholder:'test'
        },
        {
          prop: 'age',
          itemType: 'input',
          label: '年龄',
          props: {
            onlyNumber: true
          },
          offset: 4,
          required: true
        },
        {
          prop: 'sex',
          itemType: 'radio',
          label: '性别',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '0' }
          ],
          required: true
        },
        {
          prop: 'phonenum',
          itemType: 'input',
          label: '手机号码',
          maxLength: 11,
          props: {
            onlyNumber: true
          },
          offset: 4,
          required: true,
          rules: [{ pattern: /^[0-9]{11}$/, message: '长度必须为11位', trigger: 'blur' }]
        },
        { prop: 'title', itemType: 'slotout', span: 24 },
        {
          prop: 'email',
          itemType: 'input',
          label: '邮箱',
          required: true,
          rules: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
        },
        {
          prop: 'addressArr',
          itemType: 'cascader',
          label: '目前所在地',
          offset: 4,
          options: provinceAndCityData
        },
        {
          prop: 'resume',
          itemType: 'slot',
          label: '简历',
          required: true
        },
        {
          prop: 'date',
          itemType: 'datePicker',
          label: '入职日期',
          offset: 4,
          required: true
        },
        {
          prop: 'recruitment',
          itemType: 'select',
          label: '招聘渠道',
          required: true,
          props: {
            label: 'dictValue',
            value: 'dictKey'
          }
        },
        {
          prop: 'remark',
          itemType: 'input',
          label: '备注',
          offset: 4,
          rows: 2,
          type: 'textarea'
        },
        {
          prop: 'orgId',
          itemType: 'treeSelect',
          label: '部门',
          props: {
            selectParams: {
              placeholder: '请选择组织',
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
          prop: 'pictures',
          itemType: 'slot',
          label: '图片',
          offset: 4
        }
      ],
      recruitmentList: []
    }
  },
  watch: {
    uploadFileList(val) {
      this.$set(
        this.form,
        'attachments',
        val.map((item) => ({ url: item.url, name: item.localName }))
      )
    },
    'form.recruitmentId': function(val) {
      if (val) {
        this.form.orgName = (this.recruitmentList.find((item) => item.id === val) || {}).orgName
      }
    }
  },
  async created() {
    this.$store.dispatch('CommonDict', 'RecruitmentChannel').then((res) => {
      this.columns.find((item) => item.prop === 'recruitment').options = res
    })
    // await this.getRecruitment()
    this.loadOrgData()
  },
  methods: {
    beforeUpload(file) {
      const regx = /^.*\.(png|jpg|jpeg)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (this.uploadFileList.length >= 5) {
        this.$message.error('上传附件不能超过5张')
        return false
      }
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
      this.uploadFileList.splice(index, 1)
    },
    beforeResumeUpload(file) {
      const regx = /^.*\.(doc|docx|pdf)$/
      // const isLt2M = file.size / 1024 / 1024 < 3

      // if (!isLt2M) {
      //   this.$message.error('上传图片大小不能超过 3MB!')
      //   return false
      // }
      if (!regx.test(file.name)) {
        this.$message.error('上传简历只支持word或pdf文件')
        return false
      }
      return true
    },
    getRecruitment() {
      getRecruitmentList().then((res) => {
        this.recruitmentList = res
        this.columns.find((item) => item.prop === 'recruitmentId').options = res
      })
    },
    handleSubmit() {
      // eslint-disable-next-line
      console.log('form', JSON.parse(JSON.stringify(this.form)))
      this.$refs.form
        .validate()
        .then((res) => {
          // eslint-disable-next-line
          console.log('validate', res)
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('validate error:', error)
        })
    },
    loadOrgData() {
      getOrgTreeSimple({ parentOrgId: '0' }).then((res) => {
        this.columns.find((item) => item.prop === 'orgId').props.treeParams.data = res
      })
    },
    clear() {
      this.form = this.$options.data().form
      setTimeout(() => {
        this.$refs.form.clearValidate()
      })
    },
    goBack() {
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader,
.el-select {
  width: 100%;
}
.el-col {
  margin-bottom: 0;
}
.page-bottom {
  display: inline-block;
  padding-bottom: 20px;
}
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
