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
import { mapGetters } from 'vuex'
import { getUserList } from '@/api/examManage/schedule'
const personOptionProps = {
  label: 'name',
  value: 'name',
  key: 'userId'
}
const addressConfig = {
  itemType: 'input',
  label: '培训地点',
  prop: 'address',
  maxlength: 32,
  required: false,
  span: 11,
  offset: 0
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
          maxlength: 32,
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
          min: 0,
          span: 11,
          offset: 2
        },
        {
          itemType: 'slot',
          label: '培训对象',
          prop: 'trainObjectsList',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          options: [],
          rules: [
            { required: true, message: '请选择培训对象', trigger: blur },
            { required: true, validator: this.validateTrain, trigger: ['blur', 'change'] }
          ],
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
          itemType: 'slot',
          label: '联系人',
          prop: 'contactName',
          options: [],
          maxlength: 32,
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
          maxlength: 32,
          required: true,
          span: 11,
          offset: 2
        },
        {
          itemType: 'input',
          label: '承办单位',
          prop: 'organizer',
          maxlength: 32,
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
      userList: [],
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'formData.trainObjectsList': {
      handler(data) {
        this.handlerData(_.cloneDeep(data))
      },
      deep: true
    },
    'formData.people': {
      handler(val) {
        this.formData.people = Math.abs(val)
      },
      deep: true,
      immediate: true
    },
    'formData.trainWay': {
      handler(val) {
        this.$emit('changeWay', val)
        let adressIndex = _.findIndex(this.infoFormColumns, (item) => {
          return item.prop === 'address'
        })
        let trainWayIndex = _.findIndex(this.infoFormColumns, (item) => {
          return item.prop === 'trainWay'
        })

        if (val === 1) {
          if (adressIndex !== -1) {
            this.infoFormColumns.splice(adressIndex, 1)
          }
        } else {
          if (adressIndex === -1) {
            this.infoFormColumns.splice(trainWayIndex + 1, 0, addressConfig)
          }
        }
        let contactNameIndex = _.findIndex(this.infoFormColumns, (item) => {
          return item.prop === 'contactName'
        })
        _.each(this.infoFormColumns, (item, index) => {
          if (index >= contactNameIndex && index < this.infoFormColumns.length - 1) {
            item.offset = index % 2 == 0 ? 0 : 2
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.formData.contactName = this.userInfo.nick_name
    this.formData.contactPhone = this.userInfo.account
    this.getCatalogs()
  },
  methods: {
    // 拉取公司的直属员工，在map中遍历await
    async handlerData(data) {
      let examList = _.groupBy(data, (item) => {
        // 非人员且部门下员工不为0
        return item.type === 'Org'
      })
      let personList = _.filter(data, (item) => {
        return item.type === 'User'
      })
      // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
      if (examList.true) {
        let result = []
        result = await Promise.all(
          examList.true.map(async (item) => {
            return (async () => {
              return await getUserList({ orgId: item.id })
            })()
          })
        )
        if (_.size(personList)) {
          data = [...examList.false, ..._.flattenDeep(result)]
        } else {
          data = _.flattenDeep(result)
        }
      }
      this.userList = data
    },
    // 超计划人数的检验
    validateTrain(rule, value, callback) {
      const moreThan = _.size(this.userList) - this.formData.people
      this.$nextTick(() => {
        if (_.size(this.userList) > 0 && moreThan) {
          callback(new Error(`超过计划${moreThan}人，请酌量删除`))
        } else {
          callback()
        }
      })
    },
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
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: 0 }))
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
