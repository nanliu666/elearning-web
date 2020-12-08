<template>
  <div class="editBasicInfo">
    <section class="config-section">
      <common-form
        ref="form"
        class="person-form-style"
        :columns="infoFormColumns"
        :model="formData"
      >
        <template #contactName>
          <lazySelect
            v-model="formData.contactName"
            :load="loadCoordinator"
            :allow-create="isCreate"
            :searchable="remote"
            :option-props="personOptionProps"
            @selectItem="selectContact"
          >
          </lazySelect>
        </template>
        <template #introduction>
          <div class="container__editor">
            <tinymce v-model="formData.introduction" />
          </div>
        </template>
        <template #trainObjectsList>
          <SelectUser v-model="formData.trainObjectsList"></SelectUser>
        </template>
      </common-form>
    </section>
  </div>
</template>

<script>
import lazySelect from '@/components/lazy-select/lazySelect'
import { getOrgUserList, getTrainGetCatalogs } from '@/api/system/user'
import SelectUser from '@/components/trainingSelectUser/trainingSelectUser'
const personOptionProps = {
  label: 'name',
  value: 'name',
  key: 'userId'
}
export default {
  name: 'EditBasicInfo',
  components: { lazySelect, SelectUser },
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
          itemType: 'treeSelect',
          label: '分类',
          prop: 'categoryId',
          props: {
            selectParams: {
              placeholder: '请选择分类',
              multiple: false
            },
            treeParams: {
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              data: [],
              filterable: false,
              props: {
                children: 'list',
                label: 'name',
                value: 'id'
              },
              required: true
            }
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
          itemType: 'slot',
          label: '培训对象',
          prop: 'trainObjectsList',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          options: [],
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
          options: [],
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
              trigger: 'change'
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
          options: [],
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
        people: 0,
        trainObjectsList: [],
        trainWay: 3,
        address: '',
        contactPhone: '',
        sponsor: '',
        organizer: '',
        introduction: ''
      }
    }
  },
  watch: {
    'formData.trainWay': {
      handler(val) {
        this.$emit('changeWay', val)
      },
      deep: true,
      immediate: true
    },
    'formData.categoryId': {
      handler(val) {
        this.formData.categoryId = _.isNumber(val) ? val : Number(val)
      },
      deep: true
    }
  },
  mounted() {
    this.getCatalogs()
  },
  methods: {
    getCatalogs() {
      getTrainGetCatalogs().then((res) => {
        this.infoFormColumns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['form']
          .validate()
          .then(() => {
            resolve(this.formData) // TODO 提交表单
          })
          .catch(() => {
            reject()
          })
      })
    },
    selectContact(data) {
      if (data.phonenum) {
        this.formData.contactPhone = data.phonenum
      } else {
        this.formData.contactPhone = ''
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
