<template>
  <div class="editBasicInfo">
    <section class="config-section">
      <common-form
        ref="form"
        class="person-form-style"
        :columns="infoFormColumns"
        :model="formData"
      >
        <template #contact_name>
          <lazySelect
            v-model="formData.contact_name"
            :load="loadCoordinator"
            :is-create="isCreate"
            :searchable="remote"
            :option-props="personOptionProps"
            @handleChange="change"
          >
          </lazySelect>
        </template>
        <template #introduction>
          <div class="container__editor">
            <tinymce v-model="formData.introduction" />
          </div>
        </template>
      </common-form>
    </section>
  </div>
</template>

<script>
import lazySelect from '@/components/lazy-select/lazySelect'
import { getOrgUserList } from '@/api/system/user'

const personOptionProps = {
  label: 'name',
  value: 'name',
  key: 'userId'
}
export default {
  name: 'EditBasicInfo',
  components: { lazySelect },
  data() {
    const validMobile = function(rule, value, callback) {
      if (!/^1[0-9]{10}$/.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      remote: true,
      isCreate: true,
      personOptionProps,
      infoFormColumns: [
        {
          itemType: 'input',
          label: '培训班名称',
          prop: 'trainName',
          required: true,
          span: 11,
          offset: 0
        },
        {
          itemType: 'select',
          label: '分类',
          prop: 'categoryId',
          options: [
            {
              id: '12344',
              name: '测试'
            },
            {
              id: '1232344',
              name: '生产'
            }
          ],
          props: {
            label: 'name',
            value: 'id'
          },
          required: false,
          span: 11,
          offset: 2
        },
        {
          itemType: 'datePicker',
          label: '培训时间',
          prop: 'trainTime',
          options: [''],
          required: true,
          type: 'daterange',
          span: 11,
          offset: 0
        },
        {
          itemType: 'input',
          label: '计划人数',
          prop: 'people',
          type: 'Number',
          required: false,
          span: 11,
          offset: 2
        },
        {
          itemType: 'select',
          label: '培训对象',
          prop: 'trainObject',
          options: [''],
          required: true,
          span: 11,
          offset: 0
        },
        {
          itemType: 'radio',
          label: '培训方式',
          prop: 'trainWay',
          options: [
            {
              label: '在线',
              value: 1
            },
            {
              label: '面授',
              value: 2
            },
            {
              label: '混合',
              value: 3
            }
          ],
          required: true,
          span: 11,
          offset: 2
        },
        {
          itemType: 'input',
          label: '培训地点',
          prop: 'address',
          required: false,
          span: 11,
          offset: 0
        },
        {
          itemType: 'slot',
          label: '联系人',
          prop: 'contactName',
          options: [''],
          required: true,
          span: 11,
          offset: 2
        },
        {
          itemType: 'input',
          label: '手机号码',
          prop: 'contactPhone',
          props: {
            onlyNumber: true
          },
          rules: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              required: true,
              validator: validMobile,
              trigger: 'blur'
            }
          ],
          maxlength: 11,
          span: 11,
          offset: 0
        },
        {
          itemType: 'input',
          label: '主办单位',
          prop: 'sponsor',
          required: true,
          span: 11,
          offset: 2
        },
        {
          itemType: 'input',
          label: '承办单位',
          prop: 'organizer',
          required: false,
          span: 11,
          offset: 0
        },
        {
          itemType: 'slot',
          label: '培训介绍',
          prop: 'introduction',
          options: [''],
          required: true,
          span: 24,
          offset: 0
        }
      ],
      formData: {
        contactName: '',
        trainName: '',
        categoryId: '',
        trainTime: '',
        people: '',
        trainObject: '',
        trainWay: '',
        address: '',
        contactPhone: '',
        sponsor: '',
        introduction: ''
      }
    }
  },
  methods: {
    getdata() {
      return new Promise((resolve, reject) => {
        this.$refs['form']
          .validate()
          .then((valid) => {
            if (!valid) {
              reject()
              return
            }

            resolve({ formData: this.formData }) // TODO 提交表单
          })
          .catch(() => {
            this.$emit('jump', 'basicInfo')
          })
      })
    },
    change(data) {
      if (data.phonenum) {
        this.formData.contact_phone = data.phonenum
      }
    },
    loadCoordinator() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        search: '',
        orgId: this.$store.getters.userInfo.org_id || 0
      }

      return getOrgUserList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.editBasicInfo {
  background-color: #fff;
  padding: 10px 60px;
  /*height: calc(100% - 30px);*/
  margin-bottom: 30px;
  .config-section {
    margin: 20px 0;
  }
}
/deep/.tox-tinymce {
  height: 400px !important;
}
</style>
