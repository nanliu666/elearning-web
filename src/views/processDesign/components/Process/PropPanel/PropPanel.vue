<template>
  <div>
    <el-drawer
      v-if="properties"
      size="360px"
      class="drawer"
      :visible.sync="visible"
      :show-close="true"
      :wrapper-closable="false"
      style="text-align: left"
      @close="cancel"
    >
      <!-- 标题 -->
      <!-- 标题 -->
      <header
        slot="title"
        class="header"
      >
        {{ properties.title }}
      </header>
      <!-- 审批人 -->
      <section
        v-if="value && isApproverNode()"
        class="approver-pane"
        style="height: 100%;padding-left: 24px;"
      >
        <fc-org-select
          ref="approver-org"
          v-model="orgCollection"
          button-type="button"
          title="指定成员"
          :is-range="true"
          :tab-list="['user']"
        />
        <br />
        <p>多人审批时采用的审批方式</p>
        <el-radio
          v-model="approverForm.counterSign"
          :label="true"
          class="radio-item"
        >
          会签（须所有审批人同意）
        </el-radio>
        <br />
        <el-radio
          v-model="approverForm.counterSign"
          :label="false"
          class="radio-item"
        >
          或签（一名审批人同意或拒绝即可）
        </el-radio>
      </section>

      <section
        v-if="value && isCopyNode()"
        style="padding-left: 24px"
      >
        <fc-org-select
          ref="copy-org"
          v-model="members"
          :tab-list="['copy']"
          button-type="button"
          :is-range="true"
          title="抄送人"
        />
      </section>

      <div class="actions">
        <div class="flex flex-align-items flex-center">
          <el-button
            class="btn"
            size="small"
            type="primary"
            @click="confirm"
          >
            保存
          </el-button>
          <el-button
            class="btn"
            size="small"
            @click="cancel"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { NodeUtils } from '../FlowCard/util.js'
import Clickoutside from 'element-ui/src/utils/clickoutside'

// 审批人类型枚举
const ASSIGNEE_TYPE = {
  // competentBusiness: 'competentBusiness', // 业务主管
  // departmentHeads: 'departmentHeads', // 部门领导
  // multiCompetentBusiness: 'multiCompetentBusiness', // 多级业务主管
  // multiDepartmentHeads: 'multiDepartmentHeads', // 多级部门领导
  // optional: 'optional', // 发起人自选
  // role: 'role', // 指定角色
  // tag: 'tag', // 指定标签
  user: 'user' // 指定成员
}

// 默认表单模版
const defaultApproverForm = {
  approvers: [], // 审批人集合
  assigneeType: 'user', // 指定审批人
  counterSign: false, //是否为会签
  // 审批类型为自选 出现 optionalMultiUser optionalRange
  optionalMultiUser: false,
  infoForm: {
    roleId: [],
    orgId: null, //部门
    jobId: null, //职位
    positionId: '', //岗位
    tagId: '' //标签
  },
  optionalRange: 'USER' // USER<最多十个> / ALL / ROLE
}

export default {
  directives: {
    Clickoutside
  },
  components: {},
  props: {
    /*当前节点数据*/
    value: {
      type: Object,
      default: null
    },
    /*整个节点数据*/
    processData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: {
        istag: true,
        isposition: true
      },
      isValid: false,
      infoForm: {
        roleId: [],
        orgId: null,
        jobId: null,
        positionId: '',
        tagId: ''
      },
      formConf: {
        fields: []
      },
      fcOrgTabList: ['user'],
      visible: false, // 控制面板显隐
      titleInputVisible: false, // 是否显示标题输入框  startNode 不显示
      activeName: 'config', // or formAuth/config Tab面板key
      dialogVisible: false, // 控制流程条件选项Dialog显隐
      // 当前节点数据
      properties: {},
      // 发起人  start节点和condition节点需要
      orgCollection: {
        user: []
      },
      useDirectorProxy: true, // 找不到主管时 上级主管代理审批
      approverForm: JSON.parse(JSON.stringify(defaultApproverForm)),
      members: {
        //抄送节点
        dep: [],
        copy: []
      },
      dictionary: {}
    }
  },
  computed: {
    assigneeTypeObect: () => ASSIGNEE_TYPE,

    ...mapGetters(['fieldList'])
  },
  watch: {
    processData: {
      handler() {},
      deep: true
    },
    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true
        this.properties = newVal.properties
      }
    },
    visible(val) {
      if (!val) {
        this.approverForm = JSON.parse(JSON.stringify(defaultApproverForm)) // 重置数据为默认状态
        return
      }
      this.isApproverNode() && this.initApproverNodeData()
      this.isCopyNode() && this.initCopyNodeData()
    }
  },
  methods: {
    copyNodeConfirm() {
      let attribute = []
      this.members['copy'].map((it) => {
        attribute.push(it.bizId)
      })
      attribute = attribute.join(',')
      this.properties.attribute = attribute
      this.properties.members = this.members['copy']
      this.$emit('confirm', this.properties, this.getOrgSelectLabel('copy') || '请选择抄送人')
      this.visible = false
    },

    getOrgSelectLabel(type) {
      return this.$refs[type + '-org'] ? this.$refs[type + '-org']['selectedLabels'] : ''
    },
    /**
     * 审批节点确认保存
     */
    async approverNodeComfirm() {
      const assigneeType = this.approverForm.assigneeType
      let content = this.getOrgSelectLabel('approver')

      this.approverForm.approvers = this.orgCollection[assigneeType] //这里处理发起人自选和发起人及抄送人姓名等
      let attribute = []
      this.orgCollection[assigneeType] &&
        this.orgCollection[assigneeType].map((it) => {
          attribute.push(it.bizId)
        })
      attribute = attribute.join()

      this.properties.attribute = attribute // 获取值（抄送人姓名等）

      Object.assign(this.properties, this.approverForm)
      this.$emit('confirm', this.properties, content || '请选择审批人')
      this.visible = false
    },
    // 确认修改
    confirm() {
      this.isCopyNode() && this.copyNodeConfirm()
      this.isApproverNode() && this.approverNodeComfirm()
    },
    // 关闭抽屉
    cancel() {
      setTimeout(() => {
        this.$emit('cancel')
        this.visible = false
      }, 0)
    },

    /** 判断是否是审批节点*/
    isApproverNode() {
      return this.value ? NodeUtils.isApproverNode(this.value) : false
    },

    isStartNode() {
      return this.value ? NodeUtils.isStartNode(this.value) : false
    },

    isCopyNode() {
      return this.value ? NodeUtils.isCopyNode(this.value) : false
    },

    /**
     * 初始化审批节点所需数据
     */
    initApproverNodeData() {
      for (const key in this.approverForm) {
        if (this.value.properties.hasOwnProperty(key)) {
          this.approverForm[key] = this.value.properties[key]
        }
        if (key === 'infoForm') {
          this.infoForm = Object.assign(this.infoForm, this.value.properties[key])
        }
      }
      this.approverForm.counterSign =
        this.approverForm.counterSign === null ? true : this.approverForm.counterSign
      const approvers = this.approverForm.approvers
      if (Array.isArray(this.approverForm.approvers)) {
        this.orgCollection[this.approverForm.assigneeType] = approvers
      } else {
        this.orgCollection[this.approverForm.assigneeType] = []
      }
    },
    /**
     * @author guanfenda
     * @desc 初始发送人节点数据
     * */
    initCopyNodeData() {
      this.members.copy = []
      this.value.properties.members &&
        this.value.properties.members.length > 0 &&
        (this.members.copy = this.value.properties.members)
    },
    // 查询字典字段
    // 翻译字典
    translator({ value, dictKey, $config: config }) {
      if (!(dictKey = dictKey || _.get(config, 'dictKey'))) {
        return value
      }

      const dicts = this.dictionary[dictKey]
      // 如果字典为 undefined 时候加载字典
      !dicts && this.loadDictionary(dictKey)
      let result = value
      _.each(dicts, (item) => {
        if (item.dictKey === _.trim(value)) {
          result = item.dictValue
          return false
        }
      })
      return result
    },

    async loadDictionary(dictKey) {
      const dict = await this.$store.dispatch('CommonDict', dictKey)
      this.$set(this.dictionary, dictKey, dict)
    }
  }
}
</script>

<style lang="stylus">
.condition-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
}
</style>
<style lang="stylus" scoped>
.drawer {
  font-size: 14px;
  color: #202940;

  >>> .el-drawer__header {
    margin-bottom: 0;
    /*border-bottom: 1px solid #c5c5c5;*/
    /*padding-bottom: 8px;*/
    padding: 24px;
  }

  >>> .el-drawer__body {
    padding-bottom: 0px;
    overflow: hidden;
    overflow-y: auto;
    margin-bottom: 60px;
  }

  .pane-tab {
    height: 100%;
  }

  .pane-tab >>> .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  >>> .el-tabs__item:focus {
    box-shadow: none !important;
  }

  >>> .el-tabs__header {
    margin-bottom: 0;
  }
}

.header {
  line-height: 28px;
}

.actions {
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 6px 12px;
  width: 100%;
  box-sizing: border-box;
  text-align: right;

  .btn {
    width: 84px;
  }
}

.radio-item {
  width: 110px;
  padding: 6px;
}

.priority-select {
  width: 118px;
  position: absolute;
  right: 26px;
}

.form-auth-table {
  font-size: 14px;
  padding: 10px 24px;
  .auth-table-header {
    border-bottom: 1px solid #E3E7E9;
    line-height: 40px;
    font-size: 14px;
    font-weight: 550;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-title {
      flex: 1;
    }
    .header-ul {
      display: flex;
      width: 70%;
      align-items: center;
      justify-content: space-between;
    }
  }

  .row {
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 0px;
    border-bottom: 1px solid #efefef;

    &:hover {
      background: #f5f7fa;
    }

    .label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .required {
        color: #f2725e;
      }
    }

    .radio-group {
      flex: 2;
      width: 70%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.approver-pane {
  //  overflow-y: scroll;
  // overflow-x: hidden;

  .option-box {
    font-size 14px
    padding-left 24px
  }
}

.condition-pane {
  height: calc(100% -50px)
  ///*overflow scroll*/
}

.flex {
  display: flex;
  display: -webkit-flex;
  display: -ms-flex;
  display: -moz-flex;
  flex-flow: row nowrap;
}

.flex-center {
  justify-content: center;

}

.flex-align-items {
  align-items: center;
}

.tabs_div {
  /*margin: 0 auto;*/
  text-align center;
  border: 1px solid #C6CBCE;
  border-radius: 4px;
  /*width: 312px;*/
    width :312px;
  margin-left :24px;
  > div {
    width: 312px;
    height: 34px;
    font-size: 14px;
    color: #202940;
    line-height: 34px;
    cursor: pointer;
  }

  .active {
    background: $primaryColor;
    color: #FFFFFF;
  }
}

/deep/ .el-radio {
  color: #202940;
  cursor: pointer;
  margin-right: 30px;
}

.formAuth {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 100px)
}
</style>
