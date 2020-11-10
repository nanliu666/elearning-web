<template>
  <div v-loading="loading">
    <page-header
      :title="`${applyDetail.processName}`"
      show-back
      :back="handleBack"
    />
    <basic-container>
      <div class="apply-info-wrap">
        <div class="title">
          <div>{{ applyDetail.title }}申请</div>
        </div>
        <div class="info">
          <div class="num-box">
            <div>
              <div>审批编号：</div>
              <div>{{ applyDetail.apprNo }}</div>
            </div>
          </div>
          <div class="apply-user-box">
            <div>
              <div>申请人：</div>
              <div>{{ applyDetail.userName }}</div>
            </div>
          </div>
          <div class="apply-time">
            <div>
              <div>申请时间：</div>
              <div>{{ applyDetail.applyTime }}</div>
            </div>
          </div>
          <div class="apply-status">
            <div>
              <div>状态</div>
              <div>{{ StatusCN[applyDetail.status] }}</div>
            </div>
          </div>
        </div>
      </div>
    </basic-container>
    <basic-container class="apply-detail-title">
      <div class="title-box">
        <div class="title">
          审批详情
        </div>
        <div @click="show = !show">
          <div
            v-if="show"
            class="btn-box"
          >
            <i
              class="el-icon-arrow-up icon"
              style="margin-right: 12px"
            /> 收起
          </div>
          <div
            v-else
            class="btn-box"
          >
            <i
              class="el-icon-arrow-down icon"
              style="margin-right: 12px"
            /> 打开
          </div>
        </div>
      </div>
      <transition name="show">
        <el-row>
          <el-col
            :xl="16"
            :lg="16"
            :md="18"
            :sm="20"
            :xs="22"
          >
            <div
              v-show="show"
              class="apply-detail"
            >
              <ApplyRecruitment
                v-if="applyDetail.formKey === 'Recruitment'"
                :form-key="applyDetail.formKey"
                :form-id="applyDetail.formId"
              />
              <ApplyPersonOffer
                v-else-if="applyDetail.formKey === 'PersonOfferApply'"
                :form-key="applyDetail.formKey"
                :form-id="applyDetail.formId"
              />
              <div v-else>
                <form-parser
                  ref="formParser"
                  @downFile="downFile"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </transition>
    </basic-container>
    <basic-container style="margin-bottom: 24px">
      <div class="record-wrap">
        <div class="record-wrap-title">
          审批流程
        </div>
        <steps
          :progress.sync="progress"
          :wait-progress.sync="waitProgress"
        />
      </div>
      <div
        v-if="!isFished && !isPreview"
        class="cancel-btn-box"
      >
        <el-button
          v-if="!isFished && hasCancel && isApplyUser"
          type="primary"
          size="medium"
          @click="handleCancelClick"
        >
          撤回
        </el-button>
        <el-tooltip
          effect="dark"
          content="拒绝审批后，该审批将终止"
          :enterable="false"
          placement="top"
        >
          <el-button
            v-if="isApprover"
            type="primary"
            size="medium"
            @click="handelClick('Reject')"
          >
            拒绝
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="同意该审批，审批将继续向下流转"
          :enterable="false"
          placement="top"
        >
          <el-button
            v-if="isApprover"
            type="primary"
            size="medium"
            @click="handelClick('Pass')"
          >
            同意
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="退回"
          :enterable="false"
          placement="top"
        >
          <el-button
            v-if="isApprover && hasReturn && backOffNodeList.length > 0"
            type="primary"
            size="medium"
            @click="() => (backOffDialog = true)"
          >
            退回
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="重新申请"
          :enterable="false"
          placement="top"
        >
          <el-button
            v-if="
              (isReject && isApplyUser && !isCustomProcess) ||
                (isCancel && isApplyUser && !isCustomProcess)
            "
            type="primary"
            size="medium"
            @click="handleReapplyClick"
          >
            重新申请
          </el-button>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="重新申请"
          :enterable="false"
          placement="top"
        >
          <el-button
            v-if="!isCancel && !isFished && !isReject && isApplyUser"
            type="primary"
            size="medium"
            @click="handelUrgeClick"
          >
            催一下
          </el-button>
        </el-tooltip>
      </div>
    </basic-container>
    <el-dialog
      :title="apprTitle"
      :visible.sync="dialogVisible"
      width="600px"
      top="30vh"
      :modal-append-to-body="false"
      @close="handleApprFormClose"
    >
      <el-form
        ref="apprForm"
        label-position="top"
        :model="apprForm"
        :rules="{
          comment: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
        }"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="审批意见"
          :prop="isOpinion ? 'comment' : ''"
        >
          <el-input
            v-model="apprForm.comment"
            type="textarea"
            :rows="4"
            :placeholder="tip"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="dialogVisible = false"
        >取 消</el-button>
        <el-button
          size="medium"
          type="primary"
          :loading="btnloading"
          @click="handelConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
    <backOffDialog
      v-if="backOffDialog"
      :visible.sync="backOffDialog"
      :nodelist="backOffNodeList"
      :process-instance-id="processInstanceId"
      :task-id="taskId"
      @load="loadData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import backOffDialog from './components/backOffDialog'
import steps from './components/steps'
import {
  getApprDetail,
  getApprRecord,
  createApprCancel,
  createApprPass,
  createApprReject,
  createApprUrge,
  putApprForm,
  getProcessDetail
  // postOverrule
  // putApprForm,
} from '@/api/apprProcess/apprProcess'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
import { Base64 } from 'js-base64'

import ApplyRecruitment from './components/applyRecruitment'
import ApplyPersonOffer from './components/applyPersonOffer'

// 审批状态
const APPROVE_STATUS_TYPE = {
  CANCEL: 'Cancel',
  EMPTY: '',
  PASS: 'Pass',
  REJECT: 'Reject',
  RETURN: 'Return'
}
const { CANCEL, EMPTY, PASS, REJECT, RETURN } = APPROVE_STATUS_TYPE

export default {
  name: 'Apprv2Detail',
  components: {
    ApplyRecruitment,
    ApplyPersonOffer,
    backOffDialog,
    steps
  },
  filters: {
    content(data) {
      if (data.result !== RETURN) {
        return data.remark
      } else {
        return data.remark.split('|')[0]
      }
    },
    result(data) {
      let result = {
        Pass: '审批同意',
        Reject: '审批拒绝',
        Cancel: '审批已撤回',
        Return: ''
      }
      if (data.result === RETURN) {
        result.Return = data.remark.split('|')[1]
      }
      return result[data.result] || '审批中'
    }
  },
  data() {
    return {
      // 审批进行返回
      applyRecord: {},
      applyDetail: {},
      noProgressList: [],
      waitProgress: [],
      parallelRecordList: [],
      progress: [],
      backOffNodeList: [],
      nodeList: [],
      backOffDialog: false,
      processData: {}, // 给表单修改的时候暂存流程数据
      JSONData: {},
      currentApproveNode: [],
      // 审批记录列表（接口返回
      recordList: [],
      nodeData: [],
      loading: false,
      // 流程ID
      processId: '',
      // 当前审批人id
      apprUserIdList: [],
      // 审批详情
      StatusCN: {
        Approve: '审批中',
        Pass: '已通过',
        Reject: '已拒绝',
        Cancel: '已撤回'
      },
      show: true,
      // 审批进度
      activeStep: 0,
      // 是否已撤销 已拒绝 已完成
      isCancel: false,
      isFished: false,
      isReject: false,
      // 控制显示模态框
      dialogVisible: false,
      btnloading: false,
      // 审批意见表单
      apprForm: {
        processInstanceId: '',
        taskId: '',
        userId: '',
        comment: ''
      },

      // 校验是否审批意见是否必填
      // 判断是同意审批还是拒绝审批
      apprType: '',
      // 头像配置
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      // 审批提示
      tip: '',
      // 审批意见是否必填
      isOpinion: 0
    }
  },

  computed: {
    // 当前审批详情的审批id
    apprNo() {
      return _.get(this.applyDetail, 'apprNo', null)
    },
    // 发起用户的id
    applyUserId() {
      return _.get(this.applyRecord, 'data[0].userId', null)
    },
    // 是否是自定义审批 （不同于系统定制审批）
    isCustomProcess() {
      return _.isEmpty(_.get(this.applyDetail, 'formKey'))
    },
    // 审批实例ID
    processInstanceId() {
      return _.get(this.applyRecord, 'processInstanceId', null)
    },
    // 当前用户的taskId（可以用于标记退回）
    taskId() {
      const { recordList, userId } = this
      return _.get(_.find(_.filter(recordList, { result: EMPTY }), { userId }), 'taskId', null)
    },
    // 模态框标题
    apprTitle() {
      let apprTitleCN = {
        Pass: '同意审批',
        Reject: '拒绝审批'
      }
      return apprTitleCN[this.apprType] || ''
    },
    // 撤回按钮是否显示
    hasCancel() {
      // 如果流程已经有人进行了审批则不可以撤回
      return [CANCEL, PASS, REJECT].every(
        (status) => !_.map(this.recordList, 'result').includes(status)
      )
    },
    // 是否可以退回
    hasReturn() {
      // 如果同时包含空与通过，则可以退回该审批
      return [EMPTY, PASS].every((status) => _.map(this.recordList, 'result').includes(status))
    },
    // 当前用户是否审批人
    isApprover() {
      // 当前用户是否审批人
      const { userId } = this
      // todo: 取消使用apprUserIdList变量（简化）
      return this.apprUserIdList.includes(userId)
    },

    // 提交人跟当前用户是否同一个人
    isApplyUser: function() {
      return this.userId === this.applyUserId
    },

    // 是否是预览状态
    isPreview() {
      return _.get(this.$route.query, 'preview', false)
    },

    ...mapGetters(['userId', 'tag'])
  },
  activated() {
    this.loadData()
  },
  methods: {
    downFile(data) {
      window.open(data.fileUrl)
    },
    // TODO: 退回指定节点

    // 处理重新发起申请
    handleReapplyClick() {
      this.$store.commit('DEL_TAG', this.tag)
      this.$router.push({
        path: '/apprProcess/apprSubmit',
        query: { processId: this.processId, apprNo: this.apprNo }
      })
    },
    // 流程数据通过当前审批节点是否存在当前用户获取流程内的节点
    // 当前审批节点可以有多个
    findCurrentNode(processData) {
      let currentNode = Object.create(null)
      const loop = (node) => {
        if (this.currentApproveNode.includes(node.nodeId)) {
          // 并行审批存在多个审批人需要选出当前审批人
          if (node.type === 'parallel') {
            if (
              _.findIndex(node.properties.approvers, (item) => {
                return item.userId === this.userId
              }) > -1
            ) {
              currentNode = node
            }
          } else {
            currentNode = node
          }
        } else {
          node.childNode && loop(node.childNode)
          node.conditionNodes &&
            node.conditionNodes.forEach((conditionNode) => {
              loop(conditionNode)
            })
          node.parallelNodes &&
            node.parallelNodes.forEach((parallelNode) => {
              loop(parallelNode)
            })
        }
      }
      loop(processData)
      return currentNode
    },
    // 获取当前节点id，用来获取当前审批人是否有当前账号，从而进一步判断权限
    getCurrentNode(data) {
      // result字段为空时，为待审批节点
      let currentApproveNodeList = _.filter(data, (item) => {
        return item.result === EMPTY
      })
      currentApproveNodeList.forEach((item) => {
        // nodeId约定为3位数字，但连续审批内拼接了index，故截取前三位作为当前审批节点的nodeId
        this.currentApproveNode.push(item.nodeId)
      })
    },
    async loadData() {
      try {
        this.loading = true
        const applyDetail = await getApprDetail({
          apprNo: this.$route.query.apprNo
        })
        // 缓存当前审批详情
        const { apprNo, formData, nodeData } = applyDetail
        this.applyDetail = {
          ...applyDetail,
          formData: JSON.parse(Base64.decode(formData)),
          nodeData: JSON.parse(nodeData || '[]')
        }
        const applyRecord = await getApprRecord({ apprNo })
        const { data, processInstanceId, processId } = applyRecord
        this.getCurrentNode(data)
        // 缓存审批记录
        this.applyRecord = applyRecord
        this.apprForm.processInstanceId = processInstanceId
        this.processId = processId
        this.recordList = data
        // 当前审批处于审批中状态
        if (!(this.isCancel || this.isReject || this.isFinished)) {
          this.apprUserIdList = []
          this.recordList.forEach((item, index) => {
            if (index && item.result === EMPTY) {
              this.apprUserIdList.push(item.userId)
            }
          })
        }
        this.handleNodeData()
        // 因为watch progressRecord值后触发，所以异步一下
        setTimeout(() => {
          this.initForm()
        })
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    },
    // 给record添加标识,并添加部分node数据
    copyNode(target, origin, pos) {
      target.type = origin.type
      target.prevId = origin.prevId
      target.properties = origin.properties
      // 或签不copy userlist
      if (target.nodeType !== 'or') {
        target.userList = origin.userList
      }
      target.pos = pos
    },
    tagNode(record, nodeList, idMap) {
      if (record.nodeId === 'start') {
        this.copyNode(record, nodeList[0], '0')
        return
      }
      // 审批记录里多级领导人的nodeId是相同的，所以要记录每个nodeId的出现次数
      idMap.has(record.nodeId)
        ? idMap.set(record.nodeId, idMap.get(record.nodeId) + 1)
        : idMap.set(record.nodeId, 0)
      nodeList.forEach((node, index) => {
        if (node.nodeId && node.nodeId.slice(0, 3) === record.nodeId) {
          // nodeId长度大于3的为多级领导节点，nodeId最后一位标识领导人的级数
          if (node.nodeId.length > 3) {
            let id = idMap.get(record.nodeId)
            let nodeId = `${record.nodeId}${id}`
            if (nodeId === node.nodeId)
              this.copyNode(_.assign(record, { nodeId: `${record.nodeId}${id}` }), node, `${index}`)
            return
          }
          this.copyNode(record, node, `${index}`)
          return
        }
        // 并行审批
        if (Array.isArray(node)) {
          node.forEach((line, j) => {
            if (Array.isArray(line)) {
              line.forEach((item, k) => {
                if (item.nodeId && item.nodeId.slice(0, 3) === record.nodeId) {
                  if (item.nodeId.length > 3) {
                    let id = idMap.get(record.nodeId)
                    let nodeId = `${record.nodeId}${id}`
                    if (nodeId === item.nodeId)
                      this.copyNode(
                        _.assign(record, { nodeId: `${record.nodeId}${id}` }),
                        item,
                        `${index}.${j}.${k}`
                      )
                    return
                  }
                  this.copyNode(record, item, `${index}.${j}.${k}`)
                  return
                }
              })
            }
          })
        }
      })
      if (record.result === 'return') {
        // 如果当前节点为退回，重新开始计数
        idMap.clear()
      }
    },
    tagAllNode(recordList, nodeList) {
      let idMap = new Map()
      recordList.forEach((record) => {
        // TODO: 消除 backParams
        record.createTimeStamp = Date.parse(record.createTime)
        record.approveTimeStamp = Date.parse(record.approveTime || new Date())
        this.tagNode(record, nodeList, idMap)
      })
    },
    handleStatus() {
      // 开始节点的状态即代表整个流程的状态
      const firstNode = _.head(this.recordList)
      switch (firstNode.result) {
        case 'Reject':
          this.isReject = true
          this.isFished = true
          break
        case 'Cancel':
          this.isCancel = true
          this.isFished = true
          break
        case 'Pass':
          this.isFished = true
          break
      }
    },
    resolveRecordList(recordList, cc) {
      recordList = _.sortBy(recordList, 'pos')
      let recordListWithCC = []
      let ccCopy = cc.slice()
      // 插入抄送人
      // recordList里没有抄送人节点，所以要按流程设计数据把抄送人节点添加进去
      if (ccCopy.length > 0) {
        let ccCurrent = ccCopy.shift()
        // 插入抄送人
        for (const index in recordList) {
          const record = recordList[index]
          if (
            recordList[index - 1] &&
            ccCurrent &&
            recordList[index - 1].pos < ccCurrent.pos &&
            record.pos > ccCurrent.pos
          ) {
            recordListWithCC.push(ccCurrent, record)
            ccCurrent = ccCopy.shift()
          } else {
            recordListWithCC.push(record)
          }
        }
      }
      const posList = _.compact(_.uniq(_.map(recordList, 'pos')))
      let group = {}
      // 合并会签或签节点
      const hqHandler = (users) => {
        const firstUser = _.head(users)
        if (_.size(users) > 1) {
          // 处理会签或签合并节点的状态
          let result = null
          const results = _.map(users, 'result')
          if (firstUser.properties.counterSign) {
            if (_.includes(results, EMPTY)) result = EMPTY
            else if (_.includes(results, REJECT)) result = REJECT
            else if (_.every(results, (item) => item === PASS)) result = PASS
          } else {
            if (_.includes(results, EMPTY)) result = EMPTY
            else if (_.includes(results, REJECT)) result = REJECT
            else if (_.includes(results, PASS)) result = PASS
          }
          return {
            ...firstUser,
            result,
            userList: users
          }
        } else {
          return firstUser
        }
      }
      _.values(posList).forEach((pos) => {
        group[pos] = hqHandler(_.filter(recordList, { pos }))
      })
      // 用于并行审批节点重命名
      const parallelIndexs = _.compact(
        _.map(this.nodeData, (item, index) => {
          if (Array.isArray(item)) {
            return `${index}`
          }
        })
      )
      let result = []
      _.each(group, (value, key) => {
        const nodeLabel = _.get(value, 'properties.title', '')
        const nodeValue = value.nodeId
        if (key.includes('.')) {
          const [i, j, k] = key.split('.')
          if (!result[i]) {
            result[i] = {
              pos: `${i}`,
              type: 'parallelNode',
              label: `并行审批${
                _.size(parallelIndexs) > 1 ? _.indexOf(parallelIndexs, i) + 1 : ''
              }`,
              value: 'parallelGateway_' + value.prevId,
              parallelLines: []
            }
          }
          _.set(result[i], `parallelLines[${j}][${k}]`, {
            ...value,
            label: nodeLabel,
            value: nodeValue
          })
        } else {
          result[key] = {
            ...value,
            label: nodeLabel,
            value: nodeValue
          }
        }
      })
      return _.compact(_.map(result))
    },
    handleNodeData() {
      let { nodeData } = this.applyDetail
      this.nodeData = _.cloneDeep(nodeData)
      // 给所有节点打上标记
      this.tagAllNode(this.recordList, this.nodeData)
      const firstNode = _.find(this.recordList, { type: 'start' })
      this.recordList = [
        firstNode,
        ..._.sortBy(_.reject(this.recordList, { type: 'start' }), [
          // 'createTimeStamp',
          'approveTimeStamp'
        ])
      ]
      this.handleStatus()
      const cc = []
      // 记录流程设计里所有的抄送人节点
      this.nodeData.forEach((node, index) => {
        if (node.type === 'copy') {
          node.pos = `${index}`
          cc.push(node)
        }
        if (Array.isArray(node)) {
          node.forEach((line, j) => {
            if (Array.isArray(line)) {
              line.forEach((item, k) => {
                if (item.type === 'copy') {
                  item.pos = `${index}.${j}.${k}`
                  cc.push(item)
                }
              })
            }
          })
        }
      })

      // 记录所有退回节点的index
      const returnNodeIndex = []
      this.recordList.forEach((record, index) => {
        if (record.result === 'Return') {
          returnNodeIndex.push(index)
        }
      })
      // 将审批记录按退回节点切分成二维数组
      const splitByReturn = _.times(returnNodeIndex.length + 1, (i) => {
        return this.recordList.slice(
          returnNodeIndex[i - 1] ? returnNodeIndex[i - 1] + 1 : 0,
          returnNodeIndex[i] + 1 || Infinity
        )
      })
      // 对切分出来的数组进行处理（添加抄送节点，合并会签节点，合并并行审批节点）
      this.progress = _.flatten(splitByReturn.map((section) => this.resolveRecordList(section, cc)))

      // 获取可退回的节点数组
      this.backOffNodeList = _(this.progress)
        .slice()
        // 过滤掉开始节点，抄送人节点，审批中节点
        .filter((node) => !['start', 'copy'].includes(node.type) && node.result !== '')
        // 多级领导节点只保留一个
        .reject((item) => _.size(item.nodeId) > 3 && item.nodeId.slice(3) !== '0')
        .map((item) => {
          // 多级领导节点重命名
          if (_.size(item.nodeId) > 3) {
            return {
              ...item,
              label: item.nodeName
            }
          } else {
            return item
          }
        })
        .uniqBy('value')
        .value()

      if (this.isReject) {
        return
      }
      const lastIndex = +_.last(this.progress).pos + 1
      // 如果审批记录里最后一个节点是并行审批节点时，要判断里面的节点是否完整
      // 不完整时要根据流程设计数据补充节点
      const lastProgress = _.last(this.progress)
      if (lastProgress && lastProgress.parallelLines) {
        if (
          _.flatten(nodeData[lastProgress.pos]).length >
          _.flatten(lastProgress.parallelLines).length
        ) {
          nodeData[lastProgress.pos].forEach((nodeLine, index) => {
            nodeLine.forEach((node, k) => {
              if (!_.get(lastProgress.parallelLines, `[${index}][${k}]`)) {
                _.set(lastProgress.parallelLines, `[${index}][${k}]`, {
                  ...node,
                  pos: `${lastProgress.pos}.${index}.${k}`
                })
              }
            })
          })
        }
      }
      const parallelIndexs = _.compact(
        _.map(this.nodeData, (item, index) => {
          if (Array.isArray(item)) {
            return index
          }
        })
      )

      // 追加审批记录里没有的流程节点
      let addNodes = this.nodeData.slice(lastIndex)
      addNodes = addNodes.map((node, index) => {
        if (Array.isArray(node)) {
          return {
            pos: `${lastIndex + index}`,
            type: 'parallelNode',
            // 并行审批名后缀补上index用于区分多个并行
            label: `并行审批${
              _.size(parallelIndexs) > 1 ? _.indexOf(parallelIndexs, lastIndex + index) + 1 : ''
            }`,
            parallelLines: node
          }
        } else {
          return {
            ...node,
            pos: `${lastIndex + index}`,
            label: node.properties.title
          }
        }
      })
      this.progress = _.concat(this.progress, addNodes)
    },
    /**
     * 初始化表单生成器的数据，拼接成当前节点的表单权限的数据
     */
    initForm() {
      const { formData } = this.applyDetail
      this.processData = formData.processData
      // 如果表单数据为空直接跳出
      this.JSONData = _.cloneDeep(formData)
      if (_.isEmpty(formData.formData.fields)) return
      const assignObj = {
        labelPosition: 'right',
        labelWidth: '120px',
        isDetail: true // 新增isDetail字段区分是否为详情页
      }
      formData.formData = _.assign(formData.formData, assignObj)
      // 以下的都是手动赋值权限
      if (typeof formData === 'object') {
        // 当前审批节点的审批人包含当前用户，并且是从非审批记录列表进去的
        if (this.apprUserIdList.includes(this.userId) && !this.isPreview) {
          // 获取当前的审批节点
          const currentNode = this.findCurrentNode(formData.processData)
          // 当前节点的权限数组
          const formOperates = currentNode.properties.formOperates
          // 遍历对比的权限数组，用权限数组内的权限以及必填，更换初始表格的数据的权限以及必填
          _.each(formOperates, (item) => {
            _.each(formData.formData.fields, (formItem) => {
              if (item.formId === formItem.__config__.formId) {
                // 选中初始表格的每一项，更换当前的权限以及必填
                formItem.__config__.formPrivilege = item.formPrivilege
                formItem.__config__.required = item.required
                if (formItem.children) {
                  formItem.children.forEach((childrenItem) => {
                    childrenItem.map((deepItem) => {
                      deepItem.__config__.formPrivilege = item.formPrivilege
                    })
                  })
                }
                if (formItem.__config__.formPrivilege === 1) {
                  formItem.__config__.required = false
                  if (formItem.children) {
                    formItem.children.forEach((childrenItem) => {
                      childrenItem.map((deepItem) => {
                        deepItem.__config__.required = false
                      })
                    })
                  }
                }
              }
            })
          })
        } else {
          // 详情内，当前用户不拥有审批权限时，权限设置只读，并去除必填校验
          formData.formData.fields.forEach((formItem) => {
            formItem.__config__.formPrivilege = 1
            formItem.__config__.required = false
            // 兼容处理明细控件
            if (formItem.children) {
              formItem.children.forEach((childrenItem) => {
                childrenItem.forEach((deepItem) => {
                  deepItem.__config__.formPrivilege = 1
                  deepItem.__config__.required = false
                })
              })
            }
          })
        }
        this.$refs.formParser.init(formData.formData)
      }
    },
    handleBack() {
      this.$store.commit('DEL_TAG', this.tag)
      this.$router.back()
    },
    // 点击撤回
    handleCancelClick() {
      this.$refs.formParser.validate().then(() => {
        this.$confirm('确定撤销申请吗?', '撤销申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true

          createApprCancel({ processInstanceId: this.processInstanceId })
            .then(() => {
              this.$message.success('撤回成功')
              this.$router.go(-1)
            })
            .finally(() => {
              this.loading = false
            })
        })
      })
    },
    /**
     * 将需要比较的值做数据调整
     */
    pickField(data) {
      let targetList = []
      _.each(data, (item) => {
        targetList.push(
          _.assign(_.pick(item.__config__, ['label', 'defaultValue', 'type']), { origin: item })
        )
      })
      return targetList
    },
    /**
     * 获取到修改记录
     */
    getFixComment() {
      let comment = ''
      let that = this
      if (!_.isEmpty(this.JSONData.formData.fields)) {
        let prevFields = this.pickField(this.JSONData.formData.fields)
        let afterFields = this.pickField(this.$refs.formParser.formConfCopy.fields)
        // 如果之前的与提交参数不一样，apprForm.comment需要修改
        if (!_.isEqual(prevFields, afterFields)) {
          _.each(prevFields, (prevItem) => {
            _.each(afterFields, (afterItem) => {
              if (
                prevItem.label === afterItem.label &&
                !_.isEqual(prevItem.defaultValue, afterItem.defaultValue)
              ) {
                comment += `\n修改记录：${
                  afterItem.label
                }："${that.$refs.formParser.getFieldContent(
                  prevItem.origin
                )}"修改成"${that.$refs.formParser.getFieldContent(afterItem.origin)}"`
              }
            })
          })
        }
      }
      return comment
    },
    // 点击同意或拒绝按钮展示模态框
    handelClick(type) {
      this.$refs.formParser.validate().then(async () => {
        this.apprType = type
        //TODO: putApprForm 接口需要在此处在调用一次，参数为表格的数据，apprNo，暂时先注释
        const putParams = {
          apprNo: this.$route.query.apprNo,
          formData: Base64.encode(
            JSON.stringify({
              formData: this.$refs.formParser.formConfCopy,
              processData: this.processData
            })
          )
        }
        await putApprForm(putParams)
        // 获取审批流程，获取审批意见是否必填，和审批提示语
        getProcessDetail({ processId: this.processId })
          .then((res) => {
            let { isOpinion, tip } = res
            this.tip = tip
            this.isOpinion = isOpinion
            this.dialogVisible = true
            this.apprForm.comment = ''
          })
          .finally(() => {})
      })
    },
    // 点击确定审批
    handelConfirm() {
      const { apprType } = this
      Promise.all([this.$refs.apprForm.validate(), this.$refs.formParser.validate()]).then(
        (result) => {
          if (!result) return
          this.btnloading = true
          // let { userId, taskId } = this.recordList[this.activeStep]
          let userId = this.userId
          let taskId = ''
          this.recordList.forEach((it) => {
            userId === it.userId && it.result === '' && (taskId = it.taskId)
          })
          let TYPE = {
            Reject: {
              api: createApprReject,
              text: '拒绝'
            },
            Pass: {
              api: createApprPass,
              text: '同意'
            }
          }
          let submitFun = TYPE[apprType].api
          submitFun({
            userId,
            taskId,
            processInstanceId: this.processInstanceId,
            comment: this.comment + this.getFixComment()
          })
            .then(() => {
              this.$message.success(`你已${TYPE[apprType].text}这个申请`)
            })
            .finally(() => {
              this.dialogVisible = false
              this.btnloading = false
              this.handleBack()
            })
        }
      )
    },
    // 点击催一下
    handelUrgeClick() {
      createApprUrge({
        apprNo: this.apprNo,
        processInstanceId: this.processInstanceId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '催办成功'
        })
      })
    },
    handleApprFormClose() {
      // 关闭表单的时候重置表单校验数据
      this.$refs.apprForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 10px;
}

/deep/ .el-col {
  margin-bottom: 0;
}

/deep/ .el-form-item__content {
  line-height: 36px;
}

// 用户提交的申请
.apply-info-wrap {
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    color: #333333;
    font-weight: bold;
  }

  .info {
    display: flex;
    justify-content: space-between;

    & > div {
      margin-top: 16px;
      height: 43px;
    }

    & > div :first-child {
      margin-bottom: 7px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #545b66;
    }

    & > div :last-child {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #a1a7ae;
    }

    .num-box {
      flex: 1;
    }

    .apply-user-box {
      text-align: center;
      flex: 1;
      display: flex;
      justify-content: center;

      > div {
        text-align: start;
      }

      border-left: 1px solid #e3e7e9;
    }

    .apply-time {
      text-align: center;
      flex: 1.5;
      border-left: 1px solid #e3e7e9;
      display: flex;
      justify-content: center;

      > div {
        text-align: start;
      }
    }

    .apply-status {
      text-align: end;
      border-left: 1px solid #e3e7e9;
      flex: 0.5;

      :nth-child(2) {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #368afa;
        font-weight: bold;
      }
    }
  }
}

// 申请详情标题
.apply-detail-title {
  margin-top: 24px;
  margin-bottom: 2px;

  .title-box {
    display: flex;
    justify-content: space-between;

    // border-bottom: #c6cbce solid 1px;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      font-weight: bold;
    }

    .btn-box {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #757c85;
      text-align: right;
      cursor: pointer;
    }
  }
}

// 审批详情
.apply-detail {
  margin-top: 10px;
  border-bottom: 2px transparent solid;

  /deep/ .detail-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .detail-item {
      display: flex;
      font-size: 14px;

      :first-child {
        margin-right: 15px;
        font-family: PingFangSC-Regular;
        color: #718199;
        text-align: right;
        width: 246px;
        vertical-align: middle;
      }

      :nth-child(2) {
        max-width: 252px;
      }
    }
  }
}

// 流程进度
.progress-wrap {
  .progress-wrap-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #202940;
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  /deep/ .el-step__icon.is-text {
    border: 0px;
  }

  /deep/ .el-step__title.is-wait .title {
    color: #212a3f;
    font-size: 14px;
  }

  /deep/ .el-step__title.is-process {
    font-weight: normal;
  }

  /deep/ .el-step__title.is-process .title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #212a3f;
  }

  /deep/ .el-step__title.is-finish .title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #212a3f;
  }

  .icon-box {
    position: relative;

    .tip {
      position: absolute;
      top: -30px;
      left: -20px;
    }

    .cancel-text {
      color: red;
    }

    .reject-text {
      color: red;
    }

    .fished-text {
      color: #368afa;
    }
  }

  // 小圆圈
  .icon {
    width: 9px;
    height: 9px;
    background: #a0a8ae;
    border-radius: 100%;
  }

  .description-box {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #738399;
  }

  // 催一下
  .isUrge {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #368afa;
    cursor: pointer;
  }

  .active {
    background: #368afa;
  }

  .cancel {
    background: red;
  }

  .reject {
    background: red;
  }
}

.cancel-btn-box {
  display: flex;
  justify-content: center;
}

// 审批框
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}

/deep/ .el-dialog__body {
  padding: 0 20px;
}

.record_start {
  line-height: 30px;
  margin-left: 15px;
  font-size: 14px;
  color: #333;

  .text {
    color: #999;
    margin: 0 12px;
  }

  .time {
    color: #999;
    font-size: 14px;
  }
}

.counterSign_text {
  margin-left: 8px;
  color: #999;
}

.textName {
  color: #333;
  font-size: 14px;

  span {
    display: inline-block;
    line-height: 30px;
  }
}

.record-wrap {
  // margin-top: 43px;

  .record-wrap-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #202940;
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 24px;
  }
}
</style>
