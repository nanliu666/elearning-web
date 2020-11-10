<template>
  <div :class="['appr-user-item__box', { 'appr-user-item__parallel': isParallel }]">
    <div
      v-show="!(data && data.noData)"
      v-loading="loading"
      class="appr-user-item"
    >
      <div
        v-if="!(isLast || isLastParallelNode)"
        class="appr-user-item__tail"
      />
      <div class="appr-user-item__node" />
      <div class="appr-user-item__wrapper">
        <div class="appr-user-item__header">
          <span class="appr-user-item__title">{{
            data && data.properties ? data.properties.title : ''
          }}</span>
          <span class="appr-user-item__tips">{{ tips }}</span>
        </div>
        <div class="appr-user-item__content">
          <template v-for="(user, index) in _.get(data, 'userList', [])">
            <div
              v-if="index !== 0"
              :key="`separator-${index}`"
              class="appr-user-item__separator"
            >
              {{ isCounterSign ? '+' : '/' }}
            </div>
            <div
              :key="user.userId"
              class="appr-user-item__user"
            >
              <div class="appr-user-item__avatar">
                <img
                  v-if="user.avatarUrl"
                  :src="user.avatarUrl"
                />
                <i
                  v-else
                  class="icon-usercircle avatar"
                />
                <i
                  v-if="selectable"
                  class="icon-tips-error-small close"
                  @click="deleteUser(index)"
                />
              </div>
              <div class="appr-user-item__username">
                {{ user.name }}
              </div>
            </div>
          </template>
          <div
            v-if="isMulti && _.get(data, 'userList.length', 0) > 0"
            class="appr-user-item__separator"
          >
            {{ isCounterSign ? '+' : '/' }}
          </div>
          <div
            v-if="(isMulti || _.get(data, 'userList.length', 0) === 0) && selectable"
            class="appr-user-item__plusWr"
          >
            <div
              class="el-dropdown-link appr-user-item__plus"
              @click="handleSelectUser"
            >
              <i class="icon-tips-plus-outlined" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多级审批人节点 -->
    <appr-picker-item
      v-for="(item, index) of _.get(data, 'multiCompetentBusiness', [])"
      :key="index"
      :biz-id="bizId"
      :child-node="item"
      :form-data="item.formData"
      :org-id="orgId"
      :path="`${path}-0.${index}`"
      :type="item.type"
      is-multi-approver
    />
    <appr-picker-item
      v-for="(item, index) of _.get(data, 'multiDepartmentHeads', [])"
      :key="index"
      :biz-id="bizId"
      :child-node="item"
      :form-data="item.formData"
      :org-id="orgId"
      :path="`${path}-0.${index}`"
      :type="item.type"
      is-multi-approver
    />

    <appr-picker-item
      v-if="data && (data.childNode || data.conditionNodes || data.parallelNodes)"
      :path="`${path}-1`"
      :child-node="data.childNode"
      :type="data.type"
      :form-data="formData"
      :org-id="orgId"
      :biz-id="bizId"
      :condition-nodes="data.conditionNodes"
      :parallel-nodes="data.parallelNodes"
      :is-in-parallel="isParallel || isInParallel"
    />
    <div
      v-if="parallelNodes"
      class="appr-user-item__parallel--wrapper"
    >
      <div class="appr-user-item__tail" />
      <div class="appr-user-item__node" />
      <div class="appr-user-item__header">
        <span class="appr-user-item__title"> 并行审批{{ parrentParallelCount + 1 }} </span>
        <span class="appr-user-item__tips">需全部并行审批完成后才可继续流转</span>
      </div>

      <appr-picker-item
        v-for="(node, index) of parallelNodes"
        :key="index"
        type="parallel"
        :path="`${path}-2.${index}`"
        :form-data="formData"
        :org-id="orgId"
        :biz-id="bizId"
        :child-node="node"
        :is-parallel="true"
      />
    </div>

    <appr-picker-item
      v-if="nextNode"
      :form-data="formData"
      :path="`${path}-3`"
      :org-id="orgId"
      :biz-id="bizId"
      :child-node="nextNode.childNode"
      :condition-nodes="nextNode.conditionNodes"
      :parallel-nodes="nextNode.parallelNodes"
      :is-in-parallel="isParallel || isInParallel"
      :type="nextNode.type"
    />
  </div>
</template>

<script>
import moment from 'moment'
import pickUser from './userPicker.js'
import elFormEmitter from '@/mixins/elFormEmitter'
import {
  getBizLeader,
  getOrgLeader,
  getUserByJob,
  getUserByPosition,
  getUserByTag
} from '@/api/apprProcess/apprProcess'
import { getUserRole } from '@/api/processDesign/basicSetting'
import { mapGetters } from 'vuex'

const apprTypes = ['approver', 'parallel']
export default {
  name: 'ApprPickerItem',
  mixins: [elFormEmitter],
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    path: {
      type: String,
      default: '0'
    },
    conditionNodes: {
      type: Array,
      default: null
    },
    childNode: {
      type: Object,
      default: null
    },
    // 并行审批
    parallelNodes: {
      type: Array,
      default: null
    },
    // 是否并行审批节点
    isParallel: {
      type: Boolean,
      default: false
    },
    // 是否多级审批人
    isMultiApprover: {
      type: Boolean,
      default: false
    },
    // 当前节点是否在并行审批分支里
    isInParallel: {
      type: Boolean,
      default: false
    },
    bizId: {
      type: String,
      default: null
    },
    // 当前用户所选组织
    orgId: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data: null,
      nextNode: null,
      watcher: null,
      isLast: false,
      isLastParallelNode: false,
      conditionOrgId: null,
      // 流程上级里并行审批的数量
      parrentParallelCount: 0,
      noMatchOrg: false,
      loading: false
    }
  },

  inject: ['isLastNode'],
  computed: {
    ...mapGetters(['userId']),
    // 是否会签
    isCounterSign() {
      return _.get(this.data, 'properties.counterSign', false)
    },
    // 选项数组
    optionList() {
      return apprTypes.includes(_.get(this.data, 'type'))
        ? _.get(this.data, 'properties.approvers', [])
        : this.data.type === 'copy'
        ? _.get(this.data, 'properties.members', [])
        : []
    },
    // 是否多选
    isMulti() {
      return _.get(this.data, 'properties.optionalMultiUser', false)
    },
    // 是否支持用户选择审批人
    selectable() {
      return (
        apprTypes.includes(_.get(this.data, 'type')) &&
        _.get(this.data, 'properties.assigneeType', null) !== 'user'
      )
    },
    tips() {
      if (apprTypes.includes(_.get(this.data, 'type'))) {
        if (
          (this.selectable && !this.isMulti) ||
          (!this.selectable && this.optionList.length == 1)
        ) {
          return '一人审批'
        }
        return this.isCounterSign ? '需所有审批人同意' : '一人同意即可'
      } else if (_.get(this.data, 'type') === 'copy') {
        return `抄送${
          _.get(this.data, 'userList.length', 0) > 0
            ? _.get(this.data, 'userList.length', 0) + '人'
            : ''
        }`
      }
      return ''
    }
  },
  watch: {
    ditionary: {
      deep: true,
      handler() {
        this.$forceUpdate()
      }
    }
  },
  beforeDestroy() {
    this.watcher && this.watcher()
    this.unwatch1 && this.unwatch1()
    this.unwatch2 && this.unwatch2()
  },
  created() {
    // 当前节点是条件分支节点
    if (!_.isEmpty(this.conditionNodes)) {
      if (this.childNode && this.childNode.type !== 'empty') {
        this.nextNode = { childNode: this.childNode, type: this.childNode.type }
      } else {
        this.nextNode = this.childNode
      }
      let init = false
      this.watcher = this.$watch(
        () => JSON.stringify(this.formData) + this.orgId,
        function() {
          // 遍历当前节点的所有条件分支
          let mainflag = this.conditionNodes.some((node) => {
            let flag = true
            // 遍历当前条件分支的所有条件
            node.properties.conditions.forEach((condition) => {
              // 数字类型
              if (['money', 'number'].includes(condition.type) && condition.defaultValue) {
                // 介于两数之间
                if (condition.defaultValue.type === 'bet') {
                  if (
                    _[condition.defaultValue.value[1]](
                      condition.defaultValue.value[0],
                      this.formData[condition.vModel]
                    ) &&
                    _[condition.defaultValue.value[2]](
                      this.formData[condition.vModel],
                      condition.defaultValue.value[3]
                    )
                  ) {
                    return
                  }
                  // defaultValue.type { lt: '<', lte: '≤', gt: '>', gte: '≥', eq: '=' }
                  // 使用lodash的比较函数
                } else if (
                  _[condition.defaultValue.type](
                    this.formData[condition.vModel],
                    condition.defaultValue.value
                  )
                ) {
                  return
                }
                // 单选框
              } else if (condition.type === 'radio' && typeof condition.val !== 'undefined') {
                if (this.formData[condition.vModel] === condition.val) {
                  return
                }
                // 多选框
              } else if (condition.type === 'checkbox' && typeof condition.val !== 'undefined') {
                if (condition.selectMode === 'some') {
                  // 选中任意一个
                  if (
                    _.some(condition.val, (val) => this.formData[condition.vModel].includes(val))
                  ) {
                    // 防止添加了多个-1标记 , condition.val字段在设计审批的时候已经排序完成了(耦合)
                    _(this.formData[condition.vModel])
                      .pull(-1, [-1, ...condition.val].join())
                      .push(-1, [-1, ...condition.val].join())
                      .commit()
                    return
                  }
                } else if (
                  // 选中所有的项
                  _.isEqual(
                    _(this.formData[condition.vModel])
                      .without(-1)
                      .reject(_.isString)
                      .sortBy()
                      .value(),
                    _.sortBy(condition.val)
                  )
                ) {
                  _(this.formData[condition.vModel])
                    .pull(-1)
                    .remove(_.isString)
                    .commit()
                  return
                }
              } else if (condition.type === 'daterange') {
                const { defaultValue, vModel } = condition
                const [date1, date2] = this.formData[vModel]
                // diff date1以免出现负数，区间计算当天（+1天）
                const days = moment.duration(moment(date2).diff(date1)).days() + 1
                if (defaultValue.type === 'bet') {
                  const [val1, operator1, operator2, val2] = defaultValue.value
                  // between => val1 lte days lte val2
                  if (_[operator1](val1, days) && _[operator2](days, val2)) return
                } else {
                  if (_[defaultValue.type](days, defaultValue.value)) return
                }
              }
              flag = false
            })
            if (node.properties.idDefault) {
              flag = true
            }
            // 处理发起人条件
            if (!_.isEmpty(node.properties.initiator)) {
              // FIX: #ID1001622 【审批管理】流程走向有误
              if (this.orgId || this.bizId) {
                // 标识满足发起人条件的组织ID
                this.conditionOrgId = (
                  node.properties.initiator.find((item) => {
                    if (item.type === 'Org') {
                      return this.orgId === item.bizId
                    } else if (item.type === 'Biz') {
                      return this.bizId === item.bizId
                    }
                    return false
                  }) || {}
                ).bizId
              } else {
                this.conditionOrgId = null
              }
              flag = flag !== false && !!this.conditionOrgId
              // 标识没有符合当前节点的组织
              this.noMatchOrg = !flag
            }

            if (flag) {
              // 当这个节点只有条件没有内容时设置noData为true
              if (node.childNode && !node.conditionNodes) {
                !node.childNode.userList && this.initUserList(node.childNode)
                this.data = node.childNode
                this.$set(this.data, 'noData', false)
              } else if (node.conditionNodes) {
                this.data = {
                  noData: true,
                  childNode: node.childNode,
                  conditionNodes: node.conditionNodes,
                  type: node.type
                }
              } else {
                this.data = { noData: true, type: node.type }
              }
            }
            return flag
          })
          if (!mainflag) {
            this.data = {}
          }
          if (init === false) {
            init = true
          } else {
            setTimeout(() => {
              this.dispatch('ElFormItem', 'el.form.change')
            }, 0)
          }
          this.updateLast()
          this.updateLastParallelNode()
        },
        { deep: true, immediate: true }
      )
    } else if (!_.isEmpty(this.parallelNodes)) {
      this.data = { noData: true }
      if (this.childNode && this.childNode.type !== 'empty') {
        this.nextNode = { childNode: this.childNode, type: this.childNode.type }
      } else {
        this.nextNode = this.childNode
      }
    } else {
      // 不是条件节点时也要监听childNode，随时更新this.data
      this.watcher = this.$watch(
        'childNode',
        () => {
          !this.childNode.userList && this.initUserList(this.childNode)
          this.data = JSON.parse(JSON.stringify(this.childNode))
          if (this.data.type === 'empty') {
            this.$set(this.data, 'noData', true)
          }
          this.updateLast()
          this.updateLastParallelNode()
        },
        { deep: true, immediate: true }
      )
    }
    if (this.parallelNodes) {
      this.getParentParallelCount()
    }
  },
  methods: {
    getSelectable(data) {
      return (
        apprTypes.includes(_.get(data, 'type')) &&
        _.get(data, 'properties.assigneeType', null) !== 'user'
      )
    },
    // 计算上级里并行审批的数量
    getParentParallelCount() {
      let count = 0
      let el = this
      while (el.$options.name === 'ApprPickerItem') {
        el = el.$parent
        if (el.parallelNodes) {
          count++
        }
      }
      this.parrentParallelCount = count
    },
    // 判断当前节点是否最后一个节点
    updateLast() {
      setTimeout(() => {
        this.isLast = this.isLastNode(this.path)
      }, 0)
    },
    // 判断当前节点是否是并行审批分支的最后一个节点
    updateLastParallelNode() {
      if (!this.isInParallel && !this.isParallel) {
        this.isLastParallelNode = false
        return
      }
      setTimeout(() => {
        this.isLastParallelNode = !this.$children.some((item) => item.isInParallel)
      })
    },
    // 初始化当前节点的userList
    initUserList(data) {
      let userList
      if (data.type === 'copy') {
        userList = _.get(data, 'properties.members', [])
      } else if (apprTypes.includes(data.type)) {
        if (this.getSelectable(data)) {
          userList = []
        } else {
          userList = _.get(data, 'properties.approvers', [])
        }
        this.loadApprovers(data)
      }
      this.$set(data, 'userList', userList)
    },
    // 加载审批人
    loadApprovers(data) {
      const properties = _.get(data, 'properties', { infoForm: {} })
      let loadFunc = null,
        params = {}
      if (properties.assigneeType == 'tag') {
        loadFunc = getUserByTag
        params = { id: properties.infoForm.tagId }
      } else if (properties.assigneeType == 'job') {
        loadFunc = getUserByJob
        params = { id: properties.infoForm.jobId }
      } else if (properties.assigneeType == 'position') {
        loadFunc = getUserByPosition
        params = { id: properties.infoForm.positionId }
        // 修改上级领导为业务主管 directorLevel -> competentBusiness
        // } else if (properties.assigneeType === 'directorLevel') {
      } else if (properties.assigneeType === 'competentBusiness') {
        // 查询指定level业务主管
        this.unwatch1 = this.$watch(
          () => this.bizId,
          (bizId) => {
            if (_.isNil(bizId)) return

            this.loading = true
            getBizLeader({
              level: properties.infoForm.competentBusinessLevel,
              bizId
            })
              .then((res) => {
                this.$set(properties, 'approvers', res)
                this.$set(data, 'noData', _.isEmpty(res))
              })
              .finally(() => (this.loading = false))
          },
          {
            immediate: true
          }
        )
        return
        // loadFunc = getBizLeader
        // params = {
        //   userId: this.userId,
        //   level: properties.infoForm.competentBusinessLevel,
        //   bizId: this.bizId
        // }
      } else if (properties.assigneeType === 'departmentHeads') {
        // 查询指定level部门领导
        this.unwatch2 = this.$watch(
          () => this.orgId,
          (orgId) => {
            if (_.isNil(orgId)) return

            this.loading = true
            getOrgLeader({
              level: properties.infoForm.departmentHeadsLevel,
              orgId
            })
              .then((res) => {
                this.$set(properties, 'approvers', res)
                this.$set(data, 'noData', _.isEmpty(res))
              })
              .finally(() => (this.loading = false))
          },
          {
            immediate: true
          }
        )
        return
        // loadFunc = getOrgLeader
        // params = {
        //   userId: this.userId,
        //   level: properties.infoForm.departmentHeadsLevel,
        //   orgId: this.orgId
        // }
      } else if (properties.assigneeType === 'multiCompetentBusiness') {
        const level = _.get(properties, 'infoForm.multiCompetentBusinessLevel', 0)
        this.$set(data, 'type', 'multiLevel')
        this.$set(data, 'noData', true)
        // 从vuex中获取字典后更新title
        this.$store.dispatch('CommonDict', 'ManageBizLevel').then((dicts) => {
          this.$set(
            data,
            'multiCompetentBusiness',
            _.times(level, (i) => ({
              type: 'approver',
              nodeId: `${data.nodeId}${i}`,
              prevId: this.data.prevId,
              properties: {
                title: _.chain(dicts)
                  .find({ dictKey: `${i + 1}` })
                  .get('dictValue', '')
                  .value(),
                // 添加nodeName属性用于在详情页面退回的时候显示退回到哪一层级时候使用。
                nodeName: _.get(data, 'properties.title', ''),
                attribute: '',
                assigneeType: 'competentBusiness',
                counterSign: true,
                optionalMultiUser: false,
                infoForm: {
                  competentBusinessLevel: i + 1
                },
                optionalRange: 'USER'
              },
              variable: data.variable
            }))
          )
        })
      } else if (properties.assigneeType === 'multiDepartmentHeads') {
        const level = _.get(properties, 'infoForm.multiDepartmentHeadsLevel', 0)
        this.$set(data, 'noData', true)
        this.$set(data, 'type', 'multiLevel')
        this.$store.dispatch('CommonDict', 'ManageOrgLevel').then((dicts) => {
          this.$set(
            data,
            'multiDepartmentHeads',
            _.times(level, (i) => ({
              type: 'approver',
              nodeId: `${data.nodeId}${i}`,
              prevId: data.prevId,
              properties: {
                title: _.chain(dicts)
                  .find({ dictKey: `${i + 1}` })
                  .get('dictValue', '')
                  .value(),
                // 添加nodeName属性用于在详情页面退回的时候显示退回到哪一层级时候使用。
                nodeName: _.get(data, 'properties.title', ''),
                attribute: '',
                assigneeType: 'departmentHeads',
                counterSign: true,
                optionalMultiUser: false,
                infoForm: {
                  departmentHeadsLevel: i + 1
                },
                optionalRange: 'USER'
              },
              variable: data.variable
            }))
          )
        })
      } else if (properties.assigneeType === 'role') {
        params = { roleId: _.join(properties.infoForm.roleId) }
        loadFunc = getUserRole
      }
      if (!loadFunc) {
        return
      }
      this.loading = true
      loadFunc(params)
        .then((res) => {
          this.$set(properties, 'approvers', res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSelectUser() {
      pickUser(this.data.userList, {
        callback: (selectedUsers) => {
          this.data.userList = selectedUsers
          this.dispatch('ElFormItem', 'el.form.change')
        },
        optionList: this.optionList,
        multiple: this.isMulti
      })
    },
    deleteUser(index) {
      this.data.userList.splice(index, 1)
      this.dispatch('ElFormItem', 'el.form.change')
    },
    checkUserSelected(user) {
      return !!_.find(this.data.userList, (item) => item.id === user.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.appr-user-item {
  position: relative;
  &__empty {
    padding: 0 20px;
  }
  &__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #e4e7ed;
  }
  &__node {
    position: absolute;
    background-color: #e4e7ed;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    left: -1px;
  }
  &__header {
    line-height: 24px;
  }
  &__wrapper {
    position: relative;
    padding-left: 28px;
    top: -3px;
  }
  &__title {
    font-size: 18px;
    margin-right: 6px;
  }
  &__content {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }
  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(245, 246, 246, 0.5);
    text-align: center;
    margin: 8px auto;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .avatar {
      font-size: 40px;
      line-height: 40px;
      color: #757c85;
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 14px;
      z-index: 100;
      cursor: pointer;
      line-height: 14px;
    }
  }
  &__username {
    line-height: 16px;
    text-align: center;
  }
  &__separator {
    height: 40px;
    line-height: 40px;
    margin: 8px;
  }
  &__plusWr {
    margin: 8px 0 8px;
  }
  &__plus {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(245, 246, 246, 0.5);
    border: 1px dashed rgba(117, 124, 133, 0.5);
    text-align: center;
    cursor: pointer;
    color: #757c85;
    i {
      line-height: 40px;
      height: 40px;
      font-size: 20px;
    }
  }
}
.appr-user-item__parallel--wrapper {
  padding-left: 28px;
  position: relative;
  padding-bottom: 10px;
  .appr-user-item__header {
    top: -3px;
    position: relative;
  }
}
.appr-user-item__parallel {
  margin-bottom: 12px;
  background-color: #f7f8fa;
  padding-top: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
  .appr-user-item {
    margin-left: 20px;
  }
}
</style>
