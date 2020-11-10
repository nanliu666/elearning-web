<template>
  <el-dialog
    :before-close="close"
    :title="_.get(dialog, 'title', '')"
    :visible="visible"
    append-to-body
    class="AddUser"
    top="5%"
    width="600px"
  >
    <common-form
      ref="form"
      class="form"
      :model="formData"
      :columns="formData | formColumnsFilter"
    >
      <template #account>
        <el-input
          v-model="formData.account"
          placeholder="请输入"
          onkeyup="this.value = this.value.replace(/[^A-Za-z0-9]/g,'');"
          maxlength="20"
        />
      </template>
      <template #roles>
        <el-select
          v-model="formData.roles"
          placeholder="请选择"
          multiple
        >
          <el-option-group
            v-for="group in roleList"
            :key="group.categoryId"
            :label="group.categoryName"
          >
            <el-option
              v-for="item in group.roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-option-group>
        </el-select>
      </template>
      <template #categoryId>
        <el-select
          v-model="formData.categoryId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </template>
      <template #phonenum>
        <el-input
          v-model="formData.phonenum"
          placeholder="请输入"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          maxlength="11"
        />
      </template>
    </common-form>
    <span slot="footer">
      <div v-if="!editMode">
        <el-button
          :loading="submitting"
          size="medium"
          type="primary"
          @click="handleSubmit(false)"
        >
          完 成
        </el-button>
        <el-button
          :loading="submitting"
          size="medium"
          @click="handleSubmit(true)"
        >
          完成并继续添加
        </el-button>
      </div>
      <div v-else>
        <el-button
          :loading="submitting"
          size="medium"
          type="primary"
          :disabled="canSubmit"
          @click="handleSubmit(false)"
        >
          保 存
        </el-button>
        <el-button
          size="medium"
          @click="close"
        >取 消</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { getRolesList } from '@/api/system/user'
import { equalsObj } from '@/util/util'
import { FORM_COLUMNS } from './config'

const DIALOG_TYPE = {
  add: {
    eventName: 'submitAdd',
    title: '添加外部联系人'
  },
  edit: {
    eventName: 'submitEdit',
    title: '编辑外部联系人'
  }
}

export default {
  name: 'UserEdit',
  components: {},
  filters: {
    formColumnsFilter: function(formData) {
      let res = _(FORM_COLUMNS)
      if (_.eq(formData.menuType, 'Button') || _.isNil(formData.menuType)) {
        res = res.difference([_.find(FORM_COLUMNS, { prop: 'sort' })])
      }
      return res.value()
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    categoryList: {
      type: Array,
      defualt: () => []
    }
  },
  data() {
    return {
      dialog: null,
      formColumns: FORM_COLUMNS,
      formData: {},
      loading: false,
      submitting: false,
      editMode: false,
      roleList: [],
      formDataInit: {}
    }
  },
  computed: {
    canSubmit() {
      return equalsObj(this.formData, this.formDataInit)
    }
  },
  created() {
    this.loadRoleListData()
  },
  methods: {
    close() {
      this.submitting = false
      this.editMode = false
      this.$emit('update:visible', false)
    },
    clearValidate() {
      this.$nextTick(() => this.$refs.form.clearValidate())
    },
    // 提交
    handleSubmit(again) {
      this.$refs.form.validate().then(() => {
        this.submitting = true
        this.$emit(this.dialog.eventName, this.formData, again)
      })
    },
    // 保存并添加联系人
    AddContactPerson() {
      this.$refs.form.validate().then(() => {
        this.submitting = true
        this.$emit(this.dialog.eventName, this.formData)
      })
    },
    init(row = {}) {
      // 设置title
      this.formData = _.cloneDeep(row)
      this.formDataInit = _.cloneDeep(row)
      if (!_.isEmpty(row)) {
        this.formData.roles = _.cloneDeep(row).roles.map((role) => {
          return role.roleId
        })
        this.formDataInit.roles = _.cloneDeep(row).roles.map((role) => {
          return role.roleId
        })
      }

      this.dialog = _.isEmpty(row) ? DIALOG_TYPE.add : DIALOG_TYPE.edit
      this.editMode = _.isEmpty(row) ? false : true
      this.$emit('update:visible', true)
      this.clearValidate()
    },
    // 加载角色数据
    loadRoleListData() {
      getRolesList()
        .then((res) => {
          this.roleList = res
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="sass">
$padding: 2rem

.AddUser
.form
  padding: 
  left: $padding
  right: $padding
.require-container
  margin-left: 20%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-start
  line-height: 20px
</style>
