<template>
  <div class="addPromotionRoute">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="padding: 25px 0 20px"
    >
      <el-breadcrumb-item>管理晋升路线</el-breadcrumb-item>
      <el-breadcrumb-item>添加晋升路线</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <basic-container block>
      <div class="header-title">
        当前岗位 {{ positionInfo.name }}
      </div>
      <div class="sub-title">
        选择岗位<span>（选择当前岗位的上级岗位，右边会列出选择岗位的全部晋升路线请选择一条或多条添加到配置）</span>
      </div>
      <el-row
        :gutter="20"
        style="margin-top: 20px"
      >
        <!-- 左侧岗位tree -->
        <el-col :span="6">
          <div class="tree-box">
            <div class="tree-filter">
              <el-input
                v-model="jobsName"
                placeholder="请输入岗位名称"
                suffix-icon="el-icon-search"
                class="search-input"
              >
              </el-input>
            </div>
            <div
              v-loading="loading"
              class="tree-container"
            >
              <el-tree
                ref="jobsTree"
                :data="jobsTreeData"
                node-key="id"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :highlight-current="true"
                :check-strictly="true"
                :default-expand-all="true"
                :props="{
                  children: 'children',
                  label: 'name',
                  disabled: 'disabled'
                }"
              >
                <span slot-scope="{ node, data }">
                  <span><el-radio
                    v-model="positionId"
                    :label="data.id"
                    :disabled="
                      data.disabled || data.id === positionInfo.positionId || idEditRouter
                    "
                    @change="treeNodeClick(data)"
                  >{{ data.name }}</el-radio></span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col
          v-loading="routeLoading"
          :span="18"
        >
          <el-row>
            <el-checkbox-group
              v-if="mutilRouter.length"
              v-model="fixChecked"
              @change="checkRouter"
            >
              <el-col
                v-for="(item, index) in mutilRouter"
                :key="index"
                class="mutilRouter"
              >
                <el-checkbox
                  :label="item.routeId"
                  :disabled="item.isDefualt === 1 && item.positionId === positionInfo.positionId"
                >
                  {{ item.fullRoute }}
                </el-checkbox>
              </el-col>
            </el-checkbox-group>
            <div
              v-else
              class="empty-block"
            >
              <img
                src="@/assets/images/nodata.png"
                class="empty-img"
              />
              <div class="nodata">
                该岗位暂时没有晋升路线!
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </basic-container>
    <!-- 底部按钮 -->
    <basic-container style="margin-top: 6px">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            size="medium"
            :loading="submitLoading"
            @click="handlerComfirm"
          >
            确定
          </el-button>
          <el-button
            size="medium"
            @click="handlerCancer"
          >
            取消
          </el-button>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { queryStation } from '@/api/system/station'
import {
  configurationPromotionRoute,
  getPromotionRouteSenior,
  deletePromotionRoute
} from '@/api/studyMap/studyMap'
export default {
  name: 'AddPromotionRoute',
  data() {
    return {
      loading: false,
      routeLoading: false,
      submitLoading: false,
      jobsName: '',
      idEditRouter: false, // 判断是新增还是编辑
      jobsTreeData: [],
      positionInfo: {}, // 岗位信息
      positionId: '', // 岗位id
      mutilRouter: [],
      fixChecked: [],
      checkedList: [], // 用来保存当前岗位勾选路线的id
      unCheckedList: [], // 用来保存当前岗位没有勾选路线的id
      addCheckedList: [], // 用来保存当前岗位新增路线的id
      deleteCheckedList: [] // 用来保存当前岗位删除路线的id
    }
  },
  watch: {
    jobsName: _.debounce(function(value) {
      this.$refs.jobsTree.filter(value)
    }, 500)
  },
  methods: {
    async initJobsList() {
      let _this = this
      _this.loading = true
      await queryStation()
        .then(async (res) => {
          // 递归过滤掉禁用当前节点的所有父级和子级，只能选择兄弟节点
          const disabledChildren = function(nodes) {
            nodes.forEach((node) => {
              node.disabled = true
              const children = node.children
              if (children && children.length) {
                disabledChildren(children)
              }
            })
          }
          const disabledParentAndChildren = function(nodes, id, parentId, parentNodes = []) {
            nodes.forEach((node) => {
              const pNodes = parentNodes.concat(node)
              const children = node.children
              if (node.id === parentId) {
                pNodes.forEach((node) => (node.disabled = true))
              } else {
                node.disabled = false
              }
              if (node.id === id) {
                if (children && children) {
                  disabledChildren(children)
                }
              } else {
                if (children && children.length) {
                  disabledParentAndChildren(children, id, parentId, pNodes)
                }
              }
            })
          }
          disabledParentAndChildren(res, _this.positionInfo.positionId, _this.positionInfo.parentId)
          _this.jobsTreeData = res
        })
        .finally(() => {
          _this.loading = false
        })
    },
    // 配置晋升路线
    async initRouter() {
      this.routeLoading = true
      await getPromotionRouteSenior({ positionId: this.positionInfo.positionId })
        .then((res) => {
          this.mutilRouter = [...res.checked, ...res.uncheck]
          if (res.checked.length) {
            res.checked.map((v) => {
              if (v.isDefualt !== 1) {
                this.checkedList.push(v.routeId)
                this.fixChecked.push(v.routeId)
              }
            })
          }
          if (res.uncheck.length) {
            res.uncheck.map((v) => {
              this.unCheckedList.push(v.routeId)
            })
          }
          this.mutilRouter.forEach((v) => {
            v.fullRoute = v.fullRoute.replace(/,/g, '——')
          })
        })
        .finally(() => {
          this.routeLoading = false
        })
    },
    // 编辑晋升路线
    async editRouter(parentId) {
      this.routeLoading = true
      await getPromotionRouteSenior({
        positionId: this.positionInfo.positionId,
        otherPositionId: parentId
      })
        .then((res) => {
          this.mutilRouter = [...res.checked, ...res.uncheck]
          if (res.checked.length) {
            res.checked.map((v) => {
              if (v.isDefualt !== 1) {
                this.checkedList.push(v.routeId)
                this.fixChecked.push(v.routeId)
              }
            })
          }
          if (res.uncheck.length) {
            res.uncheck.map((v) => {
              this.unCheckedList.push(v.routeId)
            })
          }
          this.mutilRouter.forEach((v) => {
            v.fullRoute = v.fullRoute.replace(/,/g, '——')
          })
        })
        .finally(() => {
          this.routeLoading = false
        })
    },
    // 点击树节点
    async treeNodeClick(data) {
      this.routeLoading = true
      this.fixChecked = []
      this.checkedList = []
      this.unCheckedList = []
      this.addCheckedList = []
      this.deleteCheckedList = []
      await getPromotionRouteSenior({
        positionId: this.positionInfo.positionId,
        otherPositionId: data.id
      })
        .then((res) => {
          this.mutilRouter = [...res.checked, ...res.uncheck]
          if (res.checked.length) {
            res.checked.map((v) => {
              if (v.isDefualt !== 1) {
                this.checkedList.push(v.routeId)
                this.fixChecked.push(v.routeId)
              }
            })
          }
          if (res.uncheck.length) {
            res.uncheck.map((v) => {
              this.unCheckedList.push(v.routeId)
            })
          }
          this.mutilRouter.forEach((v) => {
            v.fullRoute = v.fullRoute.replace(/,/g, '——')
          })
        })
        .finally(() => {
          this.routeLoading = false
        })
    },
    // 点击复选框时触发,返回当前勾选的数组
    checkRouter(checked) {
      this.addCheckedList = []
      this.deleteCheckedList = []
      checked.map((v) => {
        if (!this.checkedList.includes(v)) this.addCheckedList.push(v)
      })
      this.checkedList.map((v) => {
        if (!checked.includes(v)) this.deleteCheckedList.push(v)
      })
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    backParent() {
      this.positionId = ''
      this.fixChecked = []
      this.checkedList = []
      this.unCheckedList = []
      this.addCheckedList = []
      this.deleteCheckedList = []
      this.idEditRouter = false
      this.$emit('initRouter')
    },
    // 确认按钮
    async handlerComfirm() {
      this.submitLoading = true
      //   删除掉数据
      if (this.deleteCheckedList.length) {
        await deletePromotionRoute({ ids: this.deleteCheckedList.join(',') })
      }
      //   新增数据
      if (this.addCheckedList.length) {
        let params = {
          positionId: this.positionInfo.positionId,
          routeIds: this.addCheckedList
        }
        await configurationPromotionRoute(params)
      }
      this.submitLoading = false
      this.$message.success('保存成功!')
      this.backParent()
    },
    // 取消按钮
    handlerCancer() {
      this.$confirm('您确定要取消当前操作吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.backParent()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addPromotionRoute {
  height: 100%;
  font-size: 16px;
  padding: 0 20px;
  /deep/ .basic-container .el-card {
    height: 100%;
  }
  .basic-container--block {
    height: calc(100% - 172px);
    min-height: calc(100% - 172px);
  }
  .sub-title {
    margin-top: 20px;
    span {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.4);
    }
  }
  .tree-box {
    position: relative;
    border: 1px solid #dcdfe6;
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 430px);
    .tree-filter {
      margin-top: 20px;
      text-align: center;
      .search-input {
        width: calc(100% - 30px);
      }
    }
    .tree-container {
      position: relative;
      padding: 10px 0;
      overflow-y: scroll;
      height: calc(100vh - 500px);
    }
  }
  .mutilRouter {
    background-color: rgba(247, 248, 250, 1);
    padding: 18px;
    margin-bottom: 20px;
  }
  .empty-block {
    text-align: center;
    margin-top: 15%;
    .empty-img {
      width: 100px;
    }
  }
}
</style>
