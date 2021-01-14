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
      <header
        v-if="value && value.type == 'start' && properties.title"
        slot="title"
        class="header"
      >
        {{ properties.title }}
      </header>
      <header
        v-else
        slot="title"
        class="header"
      >
        <span
          v-show="!titleInputVisible"
          style="cursor: pointer; color: #202940; font-size: 16px"
          @click="titleInputVisible = true"
        >
          {{ properties.title }}
          <i class="el-icon-edit" />
        </span>
        <el-input
          v-show="titleInputVisible"
          v-model="properties.title"
          v-clickoutside="(_) => (titleInputVisible = false)"
          size="mini"
          style="z-index: 9; max-width: 200px"
        />
      </header>
      <!-- 审批人 -->
      <section
        v-if="value && (isApproverNode() || isStartNode() || isParallelNode())"
        class="approver-pane"
        style="height: 100%"
      >
        <!-- 开始节点 -->
        <el-row
          v-if="value.type === 'start'"
          style="padding: 24px"
        >
          <el-row>
            <el-col style="font-size: 14px; line-height: 30px">
              发起人
            </el-col>
          </el-row>

          <el-col :span="24">
            <fc-org-select
              ref="start-org"
              v-model="initiator"
              :tab-list="['user']"
              :all="all"
              :org="org"
              :type="type"
              title="发起人"
            />
          </el-col>
        </el-row>

        <div v-else-if="value.type === 'approver' || value.type === 'parallel'">
          <div style="padding: 24px;">
            <el-radio-group
              v-model="approverForm.assigneeType"
              style="line-height: 32px"
              @change="resetOrgColl"
            >
              <el-radio
                v-for="item in assigneeTypeOptions"
                :key="item.value"
                :label="item.value"
                :disabled="item.disabled"
                class="radio-item"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </div>
          <div style="padding-bottom: 24px">
            <div
              v-if="approverForm.assigneeType === 'myself'"
              class="option-box"
              style="color: #a5a5a5"
            >
              发起人自己将作为审批人处理审批单
            </div>
            <div
              v-else-if="approverForm.assigneeType === assigneeTypeObect.optional"
              class="option-box"
            >
              <p>设置选择条件</p>
              <el-radio-group v-model="approverForm.optionalMultiUser">
                <el-radio :label="false">
                  自选一个人
                </el-radio>
                <el-radio :label="true">
                  自选多个人
                </el-radio>
              </el-radio-group>
              <!--              <el-switch-->
              <!--                v-model="approverForm.optionalMultiUser"-->
              <!--                active-color="#13ce66"-->
              <!--              />-->

              <p>选择范围</p>
              <el-select
                v-model="approverForm.optionalRange"
                style="width: 312px"
                size="medium"
              >
                <el-option
                  v-for="(item, index) in rangeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
              <div style="margin-top: 15px">
                <fc-org-select
                  ref="approver-org"
                  v-model="orgCollection"
                  button-type="button"
                  title="指定成员"
                  :tab-list="
                    fcOrgTabList.includes(approverForm.assigneeType)
                      ? [approverForm.assigneeType]
                      : ['dep']
                  "
                  @change="onOrgChange"
                />
              </div>
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.competentBusiness">
              <!-- 审批人为业务主管时候的选项 -->
              <div style="font-size: 14px; padding-left: 24px">
                <el-row>
                  <el-col style="line-height: 30px">
                    发起人的
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-select
                      v-model="infoForm.competentBusinessLevel"
                      style="width: 312px"
                      size="small"
                    >
                      <el-option
                        v-for="({ dictValue, dictKey }, index) of dictionary.ManageBizLevel"
                        :key="index"
                        :label="dictValue"
                        :value="dictKey"
                      />
                    </el-select>
                  </el-col>
                </el-row>

                <br />
              </div>
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.departmentHeads">
              <!-- 审批人为部门领导时候的选项 -->
              <div style="font-size: 14px; padding-left: 24px">
                <el-row>
                  <el-col style="line-height: 30px">
                    发起人的
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-select
                      v-model="infoForm.departmentHeadsLevel"
                      style="width: 312px"
                      size="small"
                    >
                      <el-option
                        v-for="({ dictValue, dictKey }, index) of dictionary.ManageOrgLevel"
                        :key="index"
                        :label="dictValue"
                        :value="dictKey"
                      />
                    </el-select>
                  </el-col>
                </el-row>

                <br />
              </div>
            </div>

            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.multiDepartmentHeads">
              <!-- 审批人为连续多级领导时候的选项 -->
              <div style="font-size: 14px; padding-left: 24px">
                <el-row>
                  <el-col style="line-height: 30px">
                    发起人的
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-select
                      v-model="infoForm.multiDepartmentHeadsLevel"
                      style="width: 312px"
                      size="small"
                    >
                      <el-option
                        v-for="({ dictValue, dictKey }, index) of dictionary.SerialManageOrgLevel"
                        :key="index"
                        :label="dictValue"
                        :value="dictKey"
                      />
                    </el-select>
                  </el-col>
                </el-row>

                <br />
              </div>
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.multiCompetentBusiness">
              <!-- 审批人为连续多级业务主管时 -->
              <div style="font-size: 14px; padding-left: 24px">
                <el-row>
                  <el-col style="line-height: 30px">
                    发起人的
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-select
                      v-model="infoForm.multiCompetentBusinessLevel"
                      style="width: 312px"
                      size="small"
                    >
                      <el-option
                        v-for="({ dictValue, dictKey }, index) of dictionary.SerialManageBizLevel"
                        :key="index"
                        :label="dictValue"
                        :value="dictKey"
                      />
                    </el-select>
                  </el-col>
                </el-row>

                <br />
              </div>
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.job">
              <div style="padding-bottom: 24px">
                <commonForm
                  ref="jobData"
                  :model="infoForm"
                  :columns="jobData"
                />
              </div>
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.position">
              <commonForm
                ref="positionData"
                :model="infoForm"
                :columns="positionData"
              />
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.tag">
              <commonForm
                ref="tagData"
                :model="infoForm"
                :columns="tagData"
              />
            </div>
            <div v-else-if="approverForm.assigneeType === assigneeTypeObect.role">
              <commonForm
                ref="roleForm1"
                :model="infoForm"
                :columns="roleColumns"
              />
              <div class="option-box">
                <p>设置选择条件</p>
                <el-radio-group v-model="approverForm.optionalMultiUser">
                  <el-radio :label="false">
                    自选一个人
                  </el-radio>
                  <el-radio :label="true">
                    自选多个人
                  </el-radio>
                </el-radio-group>
                <template v-if="approverForm.optionalMultiUser">
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
                </template>
              </div>
            </div>
            <div
              v-else
              class="option-box"
            >
              <fc-org-select
                ref="approver-org"
                v-model="orgCollection"
                button-type="button"
                :title="getAssignTypeLabel()"
                :tab-list="
                  fcOrgTabList.includes(approverForm.assigneeType)
                    ? [approverForm.assigneeType]
                    : ['dep']
                "
                @change="onOrgChange"
              />
            </div>
          </div>
          <div
            v-if="
              (_.size(orgCollection[approverForm.assigneeType]) > 1 &&
                !['optional'].includes(approverForm.assigneeType)) ||
                (['optional'].includes(approverForm.assigneeType) && approverForm.optionalMultiUser)
            "
            class="option-box"
          >
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
          </div>
        </div>
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
          title="抄送人"
        />
        <br />
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
import { getCategoryRole } from '@/api/processDesign/basicSetting'
import { getOrgTreeSimple, getJob, getPosition, getTagList } from '@/api/org/org'
import { mapGetters } from 'vuex'
import { NodeUtils } from '../FlowCard/util.js'
import Clickoutside from 'element-ui/src/utils/clickoutside'

// 审批人类型枚举
const ASSIGNEE_TYPE = {
  competentBusiness: 'competentBusiness', // 业务主管
  departmentHeads: 'departmentHeads', // 部门领导
  multiCompetentBusiness: 'multiCompetentBusiness', // 多级业务主管
  multiDepartmentHeads: 'multiDepartmentHeads', // 多级部门领导
  optional: 'optional', // 发起人自选
  role: 'role', // 指定角色
  tag: 'tag', // 指定标签
  user: 'user' // 指定成员
}

const notEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0
const hasBranch = (data) => notEmptyArray(data.conditionNodes)
const hasParallelBranch = (data) => notEmptyArray(data.parallelNodes)

// 默认表单模版
const defaultApproverForm = {
  approvers: [], // 审批人集合
  assigneeType: 'user', // 指定审批人
  formOperates: [], // 表单操作权限集合
  counterSign: true, //是否为会签
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

const ROLE_COLUMNS = [
  {
    itemType: 'treeSelect',
    label: '请选择角色',
    offset: 2,
    // infoForm.roleId
    prop: 'roleId',
    props: {
      selectParams: {
        multiple: true,
        collapseTags: true,
        placeholder: '请选择角色'
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'roles',
          label: 'roleName',
          value: 'roleId',
          disabled: 'disabled'
        }
      }
    },
    required: true,
    span: 20
  }
]

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
      tagData: [
        {
          span: 20,
          offset: 2,
          prop: 'tagId',
          options: [],
          itemType: 'select',
          clearable: true,
          label: '请选择标签',
          props: {
            label: 'name',
            value: 'id'
          },
          required: true
        }
      ],
      positionData: [
        {
          span: 20,
          offset: 2,
          prop: 'positionId',
          options: [],
          itemType: 'select',
          label: '请选择岗位',
          clearable: true,
          props: {
            label: 'name',
            value: 'id'
          },
          required: true
        }
      ],
      jobData: [
        {
          span: 20,
          prop: 'orgId',
          itemType: 'treeSelect',
          label: '请选择部门',
          required: true,
          offset: 2,
          props: {
            selectParams: {
              placeholder: '请选择部门',
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
          prop: 'jobId',
          options: [],
          clearable: true,
          itemType: 'select',
          label: '请选择职位',
          props: {
            label: 'name',
            value: 'id'
          },
          required: true
        }
      ],
      isShowInitiator: false,
      org: true,
      coms: [],
      all: true, //显示所有人
      members: {
        //抄送节点
        dep: [],
        copy: []
      },
      formConf: {
        fields: []
      },
      fcOrgTabList: ['dep', 'user', 'optional'],
      visible: false, // 控制面板显隐
      titleInputVisible: false, // 是否显示标题输入框  startNode 不显示
      activeName: 'config', // or formAuth/config Tab面板key
      showingPCons: [], // 用户选择了得条件  被选中的才会被展示在面板上编辑
      pconditions: [], // 从vuex中获取的可以作为流程图条件的集合
      dialogVisible: false, // 控制流程条件选项Dialog显隐
      // 当前节点数据
      properties: {},
      // 发起人  start节点和condition节点需要
      initiator: [],
      priorityLength: 0, // 当为条件节点时  显示节点优先级选项的数据
      orgCollection: {
        dep: [],
        role: [],
        user: [],
        position: [],
        optional: []
      },
      useDirectorProxy: true, // 找不到主管时 上级主管代理审批
      approverForm: JSON.parse(JSON.stringify(defaultApproverForm)),

      optionalOptions: [
        {
          label: '自选一个人',
          value: false
        },
        {
          label: '自选多个人',
          value: true
        }
      ],
      rangeOptions: [
        {
          label: '指定成员',
          value: 'USER'
        }
      ],

      assigneeTypeOptions: [
        {
          label: '发起人自选',
          value: 'optional',
          disabled: false
        },
        {
          label: '指定成员',
          value: 'user',
          disabled: false
        },
        {
          label: '业务主管',
          value: 'competentBusiness',
          disabled: false
        },
        {
          label: '连续多级主管',
          value: 'multiCompetentBusiness',
          disabled: false
        },
        {
          label: '部门领导',
          value: 'departmentHeads',
          disabled: false
        },
        {
          label: '连续多级领导',
          value: 'multiDepartmentHeads',
          disabled: false
        },
        {
          label: '角色',
          value: 'role',
          disabled: false
        },
        {
          label: '指定标签',
          value: 'tag',
          disabled: false
        }
      ],

      dictionary: {}
    }
  },
  computed: {
    assigneeTypeObect: () => ASSIGNEE_TYPE,
    // 未使用的条件个数
    notUseConNum() {
      // 发起人是默认就有得  所以需要加 1
      if (this.showingPCons.includes(-1)) {
        return this.pconditions.length - this.showingPCons.length + 1
      } else {
        return this.pconditions.length - this.showingPCons.length
      }
    },
    roleColumns: () => ROLE_COLUMNS,

    ...mapGetters(['fieldList'])
  },
  watch: {
    'infoForm.orgId': async function(orgId) {
      if (_.isNil(orgId)) return
      await this.getJobData()
      // 处理如果部门改变了。职位跟部门一起改变
      if (
        _.chain(this.jobData)
          .find({ prop: 'jobId' })
          .get('options')
          .find({ id: this.infoForm.jobId })
          .isNil()
          .value()
      ) {
        this.infoForm.jobId = null
      }
    },
    processData: {
      handler() {},
      deep: true
    },
    visible(val) {
      if (!val) {
        this.approverForm = JSON.parse(JSON.stringify(defaultApproverForm)) // 重置数据为默认状态
        return
      }
      this.isStartNode() && this.initStartNodeData()
      this.isApproverNode() && this.initApproverNodeData()
      this.isParallelNode() && this.initApproverNodeData()
      this.isConditionNode() && this.initConditionNodeData()
      this.isCopyNode() && this.initCopyNodeData()
    },

    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true
        this.properties = newVal.properties
        if (this.properties) {
          NodeUtils.isConditionNode(newVal) && this.getPriorityLength()
        }
        let formOperatesTemp = newVal.properties.formOperates || []
        // 请检测Process.vue内的watch中的fieldList时NodeUtils.initAllOperate初始化
        // 每次点击节点人员，会重置当前表单权限
        this.properties.formOperates = []
        // 表单设计内容不为空，才会去赋值（vuex存）
        if (_.isEmpty(formOperatesTemp)) {
          newVal = NodeUtils.initCurrentOperate(this.fieldList, newVal, [])
        } else {
          // 已存在表单权限
          this.properties.formOperates = formOperatesTemp
        }
      }
    },

    // 切换审批人类型时候为选项设置默认值(与字典组)
    'approverForm.assigneeType'(assigneeType) {
      switch (assigneeType) {
        case ASSIGNEE_TYPE.multiCompetentBusiness: // 相同处理
        case ASSIGNEE_TYPE.multiDepartmentHeads: // 相同处理
        case ASSIGNEE_TYPE.competentBusiness: // 相同处理
        case ASSIGNEE_TYPE.departmentHeads:
          if (_.isNil(this.infoForm[`${assigneeType}Level`])) {
            // 如果当前业务主管选中的为空，默认选中第一个
            this.$set(this.infoForm, `${assigneeType}Level`, '1')
          }
          break
      }
    }
  },
  mounted() {
    // 加载字典组
    _.each(
      ['ManageBizLevel', 'SerialManageBizLevel', 'ManageOrgLevel', 'SerialManageOrgLevel'],
      this.loadDictionary
    )
    this.getOrgTree()
    this.getPositionData()
    this.getTagData()
    getCategoryRole().then((res) => {
      ROLE_COLUMNS[0].props.treeParams.data = _.map(res, (item) =>
        _.assign({ roleId: item.id, roleName: item.name, disabled: true }, item)
      )
    })
  },
  methods: {
    /**
     * 是否是不可编辑的表格字段权限规则
     * 必须是审批节点
     * 必须是作为已存在的条件的判断依据
     */
    hasTooltip(item) {
      let hasTooltipFlag = this.isApproverNode() && this.$parent.isFilledPCon([item.formId])
      // 设置为条件后的字段，如果有审批人是可编辑，需要设置为只读
      if (hasTooltipFlag) item.formPrivilege = item.formPrivilege === 0 ? 1 : item.formPrivilege
      return hasTooltipFlag
    },
    valid() {
      const assigneeType = this.approverForm.assigneeType
      let refsForm = {
        tag: ['tagData'],
        position: ['positionData'],
        job: ['jobData']
      }
      if (!refsForm[assigneeType]) return
      return Promise.all(
        refsForm[assigneeType].map((it) => {
          return new Promise((resolve, reject) => {
            this.$refs[it]
              .validate()
              .then(() => {
                this.isValid = true
                resolve(true)
              })
              .catch(() => {
                this.isValid = true
                reject(false)
              })
          })
        })
      ).then(() => {})
    },
    /**
     *
     * @author guanfenda
     * @desc 获取标签
     *
     * */
    getTagData() {
      getTagList().then((res) => {
        this.tagData.find((it) => it.prop === 'tagId').options = res
      })
    },
    /**
     *  @author guanfenda
     *
     * */
    getPositionData() {
      getPosition().then((res) => {
        this.positionData.find((it) => it.prop === 'positionId').options = res
      })
    },
    /**
     * @author guanfenda
     * @desc 根据部门id获取职位
     *
     * */
    getJobData() {
      let params = {
        orgId: this.infoForm.orgId
      }
      return new Promise((resolve, reject) => {
        getJob(params)
          .then((res) => {
            this.jobData.find((it) => it.prop === 'jobId').options = res
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    /**
     * @author guanfenda
     * @desc 获取部门
     *
     * */
    getOrgTree() {
      getOrgTreeSimple({ parentOrgId: '0' }).then((res) => {
        this.jobData.find((item) => item.prop === 'orgId').props.treeParams.data = res
      })
    },
    showCons() {
      this.formConf.fields = []
      this.pconditions &&
        this.pconditions.map((it) => {
          if (this.showingPCons.includes(it.__config__.formId)) {
            it.__pc__.span = 24
            this.formConf.fields.push(it)
          }
        })
      this.dialogVisible = false
    },
    sumbitForm() {},
    resetOrgColl(data) {
      let list = ['competentBusiness', 'departmentHeads', 'job', 'position', 'tag']
      if (list.includes(data)) {
        this.approverForm.counterSign = null
      }
      for (let key in this.orgCollection) {
        this.$set(this.orgCollection, key, [])
      }
    },
    onOrgChange() {},
    timeTangeLabel(item) {
      const index = ['fc-time-duration', 'fc-date-duration'].findIndex((t) => t === item.tag)
      if (index > -1) {
        return '时长' + ['(小时)', '(天)'][index]
      } else {
        return item.label
      }
    },
    getAssignTypeLabel() {
      const res = this.assigneeTypeOptions.find((t) => t.value === this.approverForm.assigneeType)
      return res ? res.label : ''
    },
    // 是否可以显示当前条件组件
    couldShowIt(item, ...tag) {
      return (
        tag.includes(item.__config__.type) && this.showingPCons.includes(item.__config__.formId)
      )
    },

    initStartNodeData() {
      this.initInitiator()
    },

    copyNodeConfirm() {
      let attribute = []
      this.members['copy'].map((it) => {
        attribute.push(it.bizId)
      })
      attribute = attribute.join(',')
      this.properties.attribute = attribute
      this.properties.members = this.members['copy']
      this.$emit('confirm', this.properties, this.getOrgSelectLabel('copy') || '发起人自选')
      this.visible = false
    },

    getOrgSelectLabel(type) {
      return this.$refs[type + '-org'] ? this.$refs[type + '-org']['selectedLabels'] : ''
    },
    /**
     * 开始节点确认保存
     */
    startNodeComfirm() {
      // 兼容修复，不知道怎么丢失的所有人的initiator
      this.properties.initiator = this.initiator['user'] ? this.initiator['user'] : []
      this.$emit('confirm', this.properties, this.getOrgSelectLabel('start') || '所有人')
      this.visible = false
    },
    /**
     * 审批节点确认保存
     */
    async approverNodeComfirm() {
      await this.valid()
      // if(!this.isValid) return
      const assigneeType = this.approverForm.assigneeType
      let content = ''
      if (this.assigneeTypeObect.position === assigneeType) {
        // 处理岗位类型的审批人
        let positionName = ''
        let options = this.positionData.find((it) => it.prop === 'positionId').options
        options.map((it) => {
          it.id === this.infoForm.positionId && (positionName = it.name)
        })
        content = '岗位 = ' + positionName
      } else if (this.assigneeTypeObect.tag === assigneeType) {
        // 处理角标签型的审批人
        let tagName = ''
        let options = this.tagData.find((it) => it.prop === 'tagId').options
        options.map((it) => {
          it.id === this.infoForm.tagId && (tagName = it.name)
        })
        content = '标签 = ' + tagName
      } else if (this.assigneeTypeObect.role === assigneeType) {
        // 处理角色类型的审批人
        const roleName = _.chain(this.roleColumns)
          .find({ prop: 'roleId' })
          .get('props.treeParams.data')
          .mapValues('roles')
          .toArray()
          .flattenDeep()
          .filter(({ roleId }) => this.infoForm.roleId.includes(roleId))
          .map('roleName')
          .join()
          .value()
        content = `角色 = ${roleName}`
      } else if (this.assigneeTypeObect.job === assigneeType) {
        // Deprecated biz code
        let jobName = ''
        let options = this.jobData.find((it) => it.prop === 'jobId').options
        options.map((it) => {
          it.id === this.infoForm.jobId && (jobName = it.name)
        })
        content = '职位 = ' + jobName
      } else if (this.assigneeTypeObect.competentBusiness === assigneeType) {
        // 业务主管
        const competentBusiness = _.get(
          _.find(this.dictionary.ManageBizLevel, { dictKey: this.infoForm.competentBusinessLevel }),
          'dictValue',
          ''
        )
        content = `业务主管 = ${competentBusiness}`
      } else if (this.assigneeTypeObect.departmentHeads === assigneeType) {
        const departmentHeads = _.get(
          _.find(this.dictionary.ManageOrgLevel, { dictKey: this.infoForm.departmentHeadsLevel }),
          'dictValue',
          ''
        )
        content = `部门领导 = ${departmentHeads}`
      } else if (this.assigneeTypeObect.multiCompetentBusiness === assigneeType) {
        // 连续多级主管
        const multiCompetentBusiness = _.get(
          _.find(this.dictionary.SerialManageBizLevel, {
            dictKey: this.infoForm.multiCompetentBusinessLevel
          }),
          'dictValue',
          ''
        )
        content = `连续多级主管 = ${multiCompetentBusiness}`
      } else if (this.assigneeTypeObect.multiDepartmentHeads === assigneeType) {
        // 连续多级领导
        const multiDepartmentHeads = _.get(
          _.find(this.dictionary.SerialManageOrgLevel, {
            dictKey: this.infoForm.multiDepartmentHeadsLevel
          }),
          'dictValue',
          ''
        )
        content = `连续多级领导 = ${multiDepartmentHeads}`
      } else {
        content = this.getOrgSelectLabel('approver')
      }
      _.keys(this.infoForm).forEach((key) => {
        if (!_.includes(['orgId', `${assigneeType}Id`, `${assigneeType}Level`], key)) {
          this.infoForm[key] = null
        }
      })

      !this.infoForm.jobId && (this.infoForm.orgId = null)
      this.approverForm.infoForm = JSON.parse(JSON.stringify(this.infoForm))

      this.approverForm.approvers = this.orgCollection[assigneeType] //这里处理发起人自选和发起人及抄送人姓名等
      let attribute = []
      this.orgCollection[assigneeType] &&
        this.orgCollection[assigneeType].map((it) => {
          attribute.push(it.bizId)
        })
      attribute = attribute.join()

      this.properties.attribute = attribute // 获取值（抄送人姓名等）
      this.approverForm.assigneeType === this.assigneeTypeObect.optional &&
        !this.approverForm.optionalMultiUser &&
        (this.approverForm.counterSign = null)

      if (
        this.approverForm.approvers &&
        this.approverForm.approvers.length.length < 2 &&
        this.approverForm.assigneeType !== this.assigneeTypeObect.optional
      ) {
        this.approverForm.counterSign = null
      }
      this.approverForm.formOperates = this.properties.formOperates
      Object.assign(this.properties, this.approverForm)
      this.$emit('confirm', this.properties, content || '请设置审批人')
      this.visible = false
    },
    // 确认修改
    confirm() {
      this.isCopyNode() && this.copyNodeConfirm()
      this.isStartNode() && this.startNodeComfirm()
      this.isApproverNode() && this.approverNodeComfirm()
      this.isParallelNode() && this.approverNodeComfirm()
    },
    // 关闭抽屉
    cancel() {
      setTimeout(() => {
        this.$emit('cancel')
        this.visible = false
      }, 0)
    },
    /**
     * 删除流程条件
     */
    onDelCondition(condition) {
      const index = this.showingPCons.findIndex((id) => id === condition.__config__.formId)
      if (index > -1) {
        this.showingPCons.splice(index, 1)
        this.pconditions.find((t) => t.formId === condition.formId).defaultValue = undefined
      }
    },
    // 配合getPriorityLength 获取前一个节点条件数组长度 用于设置优先级
    getPrevData() {
      return NodeUtils.getPreviousNode(this.value.prevId, this.processData)
    },
    // 用于获取节点优先级范围
    getPriorityLength() {
      this.priorityLength = this.getPrevData().conditionNodes.length
    },
    // 判断是否是条件节点
    isParallelNode() {
      return this.value ? NodeUtils.isParallelNode(this.value) : false
    },
    // 判断是否是条件节点
    isConditionNode() {
      return this.value ? NodeUtils.isConditionNode(this.value) : false
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

    initInitiator() {
      const initiator = this.value.properties && this.value.properties.initiator
      this.initiator = Array.isArray(initiator) ? { user: initiator } : []
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
      this.resetOrgColl()
      if (Array.isArray(this.approverForm.approvers)) {
        this.orgCollection[this.approverForm.assigneeType] = approvers
      }
    },
    firstComdition(data, firstConditinoNode) {
      // 这里会查询第一个条件分支
      if (hasBranch(data) || hasParallelBranch(data)) {
        if (!firstConditinoNode.length > 0) {
          firstConditinoNode.push(data)
        }
      }
      if (data.childNode) {
        return this.firstComdition(data.childNode, firstConditinoNode)
      }
    },
    /**
     * 初始化条件节点数据
     */
    initConditionNodeData() {
      // 初始化条件表单数据
      this.showingPCons = []
      this.pconditions = []
      let nodeConditions = this.value.properties && this.value.properties.conditions
      this.pconditions = JSON.parse(JSON.stringify(this.$store.state.process.processConditions))
      this.initiator['user'] = this.value.properties.initiator
      if (Array.isArray(this.pconditions)) {
        let temp = undefined
        this.value.prevId === this.processData.nodeId && (this.showingPCons = [-1]) //处理发起人子节点是条件。给他选择部门
        let firstConditinoNode = []
        this.firstComdition(this.processData, firstConditinoNode)
        if (!this.showingPCons.includes(-1)) {
          //处理发起人子节点是条件。给他选择部门
          firstConditinoNode.length > 0 &&
            firstConditinoNode[0].type === 'empty' &&
            (this.showingPCons = [-1])
        }
        if (this.showingPCons.includes(-1)) {
          this.isShowInitiator = true
        } else {
          this.isShowInitiator = false
        }
        this.pconditions.forEach((t) => {
          if (Array.isArray(nodeConditions)) {
            // if(nodeConditions.)
            const con = nodeConditions.find((item) => item.formId == t.__config__.formId)
            if (con && con.defaultValue) {
              temp = con.defaultValue
              this.showingPCons.push(t.__config__.formId)
            }
            if (con && con.selectMode) {
              this.$set(t.__config__, 'selectMode', con.selectMode)
            }
          }

          this.$set(t.__config__, 'defaultValue', temp)
          // fix undefined
          if (t.__config__.type === 'checkbox' && !temp) {
            this.$set(t.__config__, 'defaultValue', [])
          }
        })
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
