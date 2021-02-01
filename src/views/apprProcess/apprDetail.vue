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
        <div
          v-show="show"
          class="apply-detail"
        >
          <!-- 移过来的课程详情 start-->
          <div class="details_course_detailed">
            <div class="details_course_detailed_top">
              <div class="details_course_detailed_img">
                <img
                  :src="courseData.url"
                  alt=""
                />
              </div>

              <div class="details_course_detailed_r">
                <div class="details_course_detailed_r_title">
                  {{ courseData.name }}
                </div>
                <ul>
                  <li>
                    <span class="text">讲师：</span> <span> {{ courseData.teacherId }} </span>
                  </li>
                  <li>
                    <span class="text">所在分类：</span>
                    <span> {{ courseData.catalogId }} </span>
                  </li>
                  <li>
                    <span class="text">课程类型：</span>
                    <span>
                      <span v-show="courseData.type == 1">在线课程</span>
                      <span v-show="courseData.type == 2">面授课程</span>
                      <span v-show="courseData.type == 3">直播课程</span>
                    </span>
                  </li>
                  <li>
                    <span class="text">学时（小时）：</span>
                    <span> {{ courseData.period }} </span>
                  </li>
                  <li>
                    <span class="text">学分：</span> <span> {{ courseData.credit }} </span>
                  </li>
                  <li>
                    <span class="text">通过条件：</span>
                    <span
                      v-for="(item, index) in courseData.passCondition"
                      :key="index"
                    >
                      <span v-show="item == 'a'">教师评定 </span>
                      <span
                        v-show="item == 'b'"
                      >考试通过
                        {{ courseData.passCondition.split(',').length >= 3 ? ',' : '' }}</span>
                      <span
                        v-show="item == 'c'"
                      >达到课程学时
                        {{ courseData.passCondition.split(',').length >= 2 ? ',' : '' }}
                      </span>
                    </span>
                  </li>
                  <li>
                    <span class="text">选修类型：</span>
                    <span>
                      <span v-show="courseData.electiveType == 1">在线课程</span>
                      <span v-show="courseData.electiveType == 2">面授课程</span>
                      <span v-show="courseData.electiveType == 3">直播课程</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="details_course_detailed_bar">
              <span
                :class="{ pitch: pitch == 1 }"
                @click="setPitch(1)"
              >详细信息</span>
              <span
                :class="{ pitch: pitch == 2 }"
                @click="setPitch(2)"
              >课程内容</span>
            </div>
            <div
              v-show="pitch == 1"
              class="details_course_detailed_pitch1"
            >
              <div class="title">
                <i></i>
                <span>课程介绍</span>
              </div>
              <div class="content">
                <div v-html="courseData.introduction"></div>
              </div>
              <div class="title">
                <i></i>
                <span>课前思考</span>
              </div>
              <div class="content">
                <div v-html="courseData.thinkContent"></div>
              </div>
            </div>
            <div
              v-show="pitch == 2"
              class="details_course_detailed_pitch2"
            >
              <ul>
                <li
                  v-for="(item, index) in courseData.content"
                  :key="index"
                  @click="jumpToLearn(item)"
                >
                  <div>
                    <i>{{ index + 1 }}</i> <span>{{ item.name }}</span>
                  </div>
                  <div class="btn">
                    查看内容
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- 移过来的课程详情 end-->
        </div>
      </transition>
    </basic-container>
    <basic-container style="margin-bottom: 24px">
      <div class="record-wrap">
        <div class="record-wrap-title">
          审批流程
        </div>
        <steps :progress.sync="progress" />
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
          v-if="(isReject && isApplyUser) || (isCancel && isApplyUser)"
          effect="dark"
          content="重新申请"
          placement="top"
        >
          <el-button
            type="primary"
            size="medium"
            @click="handleReapplyClick"
          >
            重新申请
          </el-button>
        </el-tooltip>
        <!-- <el-tooltip
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
          content="催一下"
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
        </el-tooltip> -->
      </div>
    </basic-container>
    <!--审批意见填写弹窗，这个功能暂时没用上-->
    <el-dialog
      :title="apprTitle"
      :visible.sync="dialogVisible"
      width="600px"
      top="30vh"
      :modal-append-to-body="false"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import steps from './components/steps'
import {
  getApprDetail,
  getApprRecord,
  createApprCancel,
  createApprPass,
  createApprReject,
  createApprUrge,
  getProcessDetail
  // postOverrule
  // putApprForm,
} from '@/api/apprProcess/apprProcess'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { listTeacher, getCourse, getCatalog } from '@/api/course/course'
moment.locale('zh-cn')

// 审批状态
const APPROVE_STATUS_TYPE = {
  CANCEL: 'Cancel',
  EMPTY: '',
  PASS: 'Pass',
  REJECT: 'Reject'
}
const { CANCEL, EMPTY, PASS, REJECT } = APPROVE_STATUS_TYPE

export default {
  name: 'Apprv2Detail',
  components: {
    steps
  },
  data() {
    return {
      // 课程详情
      courseData: {},
      pitch: 1,
      // 审批进行返回
      applyRecord: {},
      applyDetail: {},
      progress: [],
      nodeList: [],
      // 审批中的节点ID数组
      currentApproveNode: [],
      // 审批中的用户ID数组
      apprUserIdList: [],
      // 审批记录列表（接口返回
      recordList: [],
      nodeData: [],
      loading: false,
      // 流程ID
      processId: '',
      // 审批详情
      StatusCN: {
        Approve: '审批中',
        Pass: '已通过',
        Reject: '已拒绝',
        Cancel: '已撤回'
      },
      show: true,
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
    // 当前审批详情的审批id
    formId() {
      return _.get(this.applyDetail, 'formId', null)
    },
    // 发起用户的id
    applyUserId() {
      return _.get(this.applyRecord, 'data[0].userId', null)
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
    // 查看课程内容
    jumpToLearn(item) {
      this.$router.push({
        path: '/approvalCenter/chapter',
        query: { courseId: item.courseId, chapterId: item.id }
      })
    },
    // 获取课程信息
    async getCourseData() {
      let res = await getCourse({ courseId: this.formId })
      res.introduction = _.unescape(res.introduction)
      res.thinkContent = _.unescape(res.thinkContent)
      this.courseData = res
      // 讲师
      listTeacher().then((teacherRes) => {
        teacherRes.map((item) => {
          if (this.courseData.teacherId == item.idStr) this.courseData.teacherId = item.name
        })
      })
      // 所在分类
      getCatalog().then((Catalog) => {
        let CatalogData = this.findPathByLeafId(this.courseData.catalogId, Catalog)
        this.courseData.catalogId = CatalogData[0]
      })
    },
    //递归实现
    //@leafId  查找的id，
    //@nodes   原始Json数据
    //@path    供递归使用
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) {
        path = []
      }
      for (let i = 0; i < nodes.length; i++) {
        let tmpPath = path.concat()
        tmpPath.push(nodes[i].name)
        if (leafId == nodes[i].id) {
          return tmpPath
        }
        if (nodes[i].children) {
          let findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath)
          if (findResult) {
            return findResult
          }
        }
      }
    },
    setPitch(i) {
      this.pitch = i
    },
    // 处理重新发起申请
    handleReapplyClick() {
      this.$router.push({
        path: '/course/establishCourse',
        query: { id: this.formId }
      })
    },

    // 流程数据通过当前审批节点是否存在当前用户获取流程内的节点
    // 当前审批节点可以有多个
    findCurrentNode(processData) {
      let currentNode = Object.create(null)
      const loop = (node) => {
        if (this.currentApproveNode.includes(node.nodeId)) {
          currentNode = node
        } else {
          node.childNode && loop(node.childNode)
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
        const { apprNo, nodeData } = applyDetail
        this.applyDetail = {
          ...applyDetail,
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
        // 记录所有审批中节点的用户id
        this.apprUserIdList = []
        this.recordList.forEach((item, index) => {
          if (index && item.result === EMPTY) {
            this.apprUserIdList.push(item.userId)
          }
        })
        // 获取课程详情
        this.getCourseData()
        // 获取审批流程详情
        this.getProcessDetail()
        // 处理流程数据
        this.handleNodeData()
      } catch (error) {
        console.error(error)
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
    // 遍历nodeData找到对应的节点进行复制
    tagNode(record, nodeList) {
      if (record.nodeId === 'start') {
        this.copyNode(record, nodeList[0], '0')
        return
      }
      nodeList.forEach((node, index) => {
        if (node.nodeId && node.nodeId.slice(0, 3) === record.nodeId) {
          this.copyNode(record, node, `${index}`)
          return
        }
      })
    },
    // 遍历recordList给每个record补充节点数据
    tagAllNode(recordList, nodeList) {
      recordList.forEach((record) => {
        record.createTimeStamp = Date.parse(record.createTime)
        record.approveTimeStamp = Date.parse(record.approveTime || new Date())
        this.tagNode(record, nodeList)
      })
    },
    // 设置当前审批流的状态
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
    // 处理审批记录数组：添加抄送人，合并会签或签节点，去重
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

      let result = []
      _.each(group, (value, key) => {
        const nodeLabel = _.get(value, 'properties.title', '')
        const nodeValue = value.nodeId

        result[key] = {
          ...value,
          label: nodeLabel,
          value: nodeValue
        }
      })
      return _.compact(_.map(result))
    },
    // 合并recordList和nodeData组装流程数据，this.progress
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
      })

      // （添加抄送节点，合并会签节点，合并并行审批节点）
      this.progress = _.flatten(this.resolveRecordList(this.recordList, cc))

      if (this.isReject) {
        return
      }
      const lastIndex = +_.last(this.progress).pos + 1
      // 追加审批记录里没有的流程节点
      let addNodes = this.nodeData.slice(lastIndex)
      addNodes = addNodes.map((node, index) => {
        return {
          ...node,
          pos: `${lastIndex + index}`,
          label: node.properties.title
        }
      })
      this.progress = _.concat(this.progress, addNodes)
    },

    handleBack() {
      this.$store.commit('DEL_TAG', this.tag)
      this.$router.back()
    },
    // 点击撤回
    handleCancelClick() {
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
    },
    // 点击同意或拒绝按钮展示模态框
    getProcessDetail(type) {
      // 获取审批流程，获取审批意见是否必填，和审批提示语
      getProcessDetail({ processId: this.processId })
        .then((res) => {
          this.apprType = type
          let { isOpinion, tip } = res
          this.tip = tip
          this.isOpinion = isOpinion
          this.apprForm.comment = ''
        })
        .finally(() => {})
    },
    // 点击确定审批
    handelConfirm() {
      const { apprType } = this
      this.$refs.apprForm.validate().then((result) => {
        if (!result) return
        this.btnloading = true
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
          comment: this.comment
        })
          .then(() => {
            this.$message.success(`你已${TYPE[apprType].text}这个申请`)
          })
          .finally(() => {
            this.dialogVisible = false
            this.btnloading = false
            this.handleBack()
          })
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-col {
  margin-bottom: 0;
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

.details_course {
  width: 100%;
  &_detailed {
    padding: 0 24px 24px;
    &_top {
      display: flex;
    }
    &_img {
      width: 320px;
      height: 180px;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &_r {
      flex: 1;
      margin-left: 40px;
      &_title {
        font-size: 18px;
        color: #000b15;
        letter-spacing: 0;
      }
      ul {
        li {
          width: 50%;
          float: left;
          margin-top: 16px;
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          .text {
            opacity: 0.45;
          }
        }
      }
    }
    &_bar {
      margin-top: 40px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      display: flex;
      border-bottom: 1px solid #ebeced;
      .pitch {
        color: #01aafc;
        border-bottom: 1px solid #01aafc;
      }
      span {
        margin-right: 40px;
        cursor: pointer;
      }
    }
    &_pitch1 {
      .title {
        margin-top: 24px;
        display: flex;
        i {
          display: inline-block;
          background: #01aafc;
          width: 4px;
          height: 16px;
          margin-right: 8px;
        }
        span {
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          margin-top: -2px;
        }
      }
      .content {
        margin-top: 16px;
      }
    }
    &_pitch2 {
      ul {
        margin-top: 24px;
        li {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ebeced;
          height: 48px;
          line-height: 48px;
          opacity: 0.85;
          font-size: 14px;
          color: #000b15;
          letter-spacing: 0;
          i {
            font-style: normal;
            margin-left: 24px;
          }
          span {
            margin-left: 27px;
          }
          .btn {
            opacity: 0.85;
            font-size: 14px;
            color: #01aafc;
            letter-spacing: 0;
            margin-right: 24px;
            cursor: pointer;
            display: none;
          }

          &:hover {
            background-color: #f0fafe;
            .btn {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
