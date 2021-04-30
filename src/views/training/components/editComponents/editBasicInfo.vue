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
            :allow-create="true"
            :searchable="true"
            :option-props="personOptionProps"
            @select="selectContact"
          >
          </lazySelect>
        </template>
        <template #introduction>
          <div class="container__editor">
            <tinymce v-model="formData.introduction" />
          </div>
        </template>
        <template #trainObjectsList>
          <SelectUser
            v-model="formData.trainObjectsList"
            select-type="Org,OuterUser,Position,Group"
          ></SelectUser>
        </template>
      </common-form>
    </section>
  </div>
</template>

<script>
import lazySelect from '@/components/lazy-select/lazySelect'
import { getWorkList, getAllCatalog } from '@/api/system/user'
import SelectUser from '@/components/trainingSelectUser/trainingSelectUser'
import { mapGetters } from 'vuex'
import { getUserList, getPositionUserList } from '@/api/examManage/schedule'
const personOptionProps = {
  label: 'name',
  value: 'workNo',
  key: 'userId'
}
import moment from 'moment'
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
      personOptionProps,
      infoFormColumns: [
        {
          itemType: 'input',
          label: '培训班名称',
          prop: 'trainName',
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                const target = value.trim()
                if (!target) {
                  this.$nextTick(() => {
                    return callback(new Error('请输入培训班名称'))
                  })
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }
          ],
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
          pickerOptions: {
            disabledDate(time) {
              return moment(new Date()).isAfter(time, 'day')
            }
          },
          label: '培训时间',
          prop: 'trainTime',
          options: [''],
          required: true,
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          span: 11,
          offset: 0
        },
        {
          itemType: 'input',
          label: '计划人数',
          prop: 'people',
          rules: [{ required: false, validator: this.validatePeople, trigger: ['blur', 'change'] }],
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
          isHidden: false,
          itemType: 'input',
          label: '培训地点',
          prop: 'address',
          maxlength: 32,
          required: false,
          span: 11,
          offset: 0
        },
        {
          itemType: 'slot',
          label: '联系人',
          prop: 'contactName',
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
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                const target = value.trim()
                if (!target) {
                  return callback(new Error('请输入主办单位'))
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }
          ],
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
          rules: [
            { required: true, message: '请输入培训介绍', trigger: 'blur' },
            { max: 5000, message: '培训介绍最多不超过5000字', trigger: ['blur', 'change'] }
          ],
          options: [],
          span: 24,
          offset: 0
        }
      ],
      userList: [],
      formData: {
        contactName: '',
        trainName: '',
        categoryId: '',
        trainTime: [],
        people: '',
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
    'formData.trainTime': {
      handler(data) {
        this.$store.commit('SET_TRAIN_TIME', data)
      },
      deep: true
    },
    'formData.trainObjectsList': {
      handler(data) {
        if (!_.isEmpty(data)) {
          this.handlerData(_.cloneDeep(data))
        }
      },
      deep: true,
      immediate: true
    },
    'formData.trainWay': {
      handler(val) {
        this.$emit('changeWay', val)
        // 找到地址的配置
        const temp = _.find(this.infoFormColumns, { prop: 'address' })
        _.set(temp, 'isHidden', val === 1)
        let contactNameIndex = _.findIndex(this.infoFormColumns, (item) => {
          return item.prop === 'contactName'
        })
        _.map(this.infoFormColumns, (item, index) => {
          if (index >= contactNameIndex && index < this.infoFormColumns.length - 1) {
            let offset
            if (val === 1) {
              offset = index % 2 == 0 ? 2 : 0
            } else {
              offset = index % 2 == 0 ? 0 : 2
            }
            _.set(item, 'offset', offset)
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
      // 非人员且部门下员工不为0
      let examList = _.groupBy(data, (item) => {
        return item.type === 'Org'
      })
      // 岗位员工不为0
      const positionList = _.groupBy(data, (item) => {
        return item.type === 'Position'
      })
      let personList = _.filter(data, (item) => {
        return item.type === 'User'
      })
      // 如果是部门/公司（org）需要把当前部门的直属人员拉回来处理
      let orgResult = []
      if (examList.true) {
        orgResult = await Promise.all(
          examList.true.map(async (item) => {
            return (async () => {
              return await getUserList({
                orgId: _.get(item, 'bizId') ? _.get(item, 'bizId') : item.id
              })
            })()
          })
        )
      }
      // 岗位人数校验
      let positionResult = []
      if (positionList.true) {
        positionResult = await Promise.all(
          positionList.true.map(async (item) => {
            return (async () => {
              await getPositionUserList({
                parentId: _.get(item, 'bizId') ? _.get(item, 'bizId') : item.positionId
              })
            })()
          })
        )
      }
      const positionLength = _.sum(positionResult)
      if (_.size(personList)) {
        data = [...examList.false, ..._.flattenDeep(orgResult)]
      } else {
        data = [..._.flattenDeep(orgResult)]
      }
      this.userList = _.isEmpty(positionResult) ? data : data + positionLength
      this.$refs.form && this.$refs.form.validateField('trainObjectsList')
    },
    // 计划人数的变动
    validatePeople(rule, value, callback) {
      if (value === '') {
        this.$refs.form.clearValidate()
        callback()
      } else {
        const numberValue = Number(value)
        if (_.isNaN(numberValue)) {
          return callback(new Error('计划人数必须填数字'))
        } else {
          if (!_.isInteger(numberValue)) {
            return callback(new Error('计划人数不能为小数'))
          }
          if (value > 100000) {
            return callback(new Error('计划人数最大限制输入值 100000'))
          } else if (value <= 100000 && value > 0) {
            this.$refs.form.validateField('trainObjectsList')
            callback()
          } else {
            return callback(new Error('计划人数必须为正整数'))
          }
        }
      }
    },
    // 超计划人数的检验
    validateTrain(rule, value, callback) {
      if (this.formData.people !== '') {
        const moreThan = _.size(this.userList) - this.formData.people
        this.$nextTick(() => {
          if (_.size(this.userList) > 0 && moreThan > 0 && this.formData.people !== 0) {
            callback(new Error(`超过计划${moreThan}人，请酌量删除`))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    },
    getCatalogs() {
      getAllCatalog().then((res) => {
        this.infoFormColumns.find((it) => it.prop === 'categoryId').props.treeParams.data = res
      })
    },
    getData(type) {
      // 如果是草稿，直接返回数据
      if (type === 1) {
        return new Promise((resolve) => {
          resolve(this.formData)
        })
      } else {
        return new Promise((resolve, reject) => {
          this.$refs['form']
            .validate()
            .then(() => {
              resolve(this.formData) // TODO 提交表单
            })
            .catch(() => {
              this.$message.error('请完整填写基本信息')
              reject()
            })
        })
      }
    },
    selectContact(data) {
      if (data.phonenum) {
        this.formData.contactPhone = data.phonenum
      } else {
        this.formData.contactPhone = ''
      }
    },
    loadCoordinator(params) {
      if (_.size(_.get(params, 'search')) > 32) {
        this.$message.error('您输入的联系人姓名过长，无法搜索！')
      }
      return getWorkList(_.assign(params, { orgId: 0 }))
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
