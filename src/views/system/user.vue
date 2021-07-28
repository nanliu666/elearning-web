<template>
  <div class="fill">
    <page-header title="用户管理">
      <div slot="rightMenu">
        <el-button
          v-p="EXPORT_USER"
          type="primary"
          size="medium"
          :disabled="exportDisable"
          @click="exportData"
        >
          导出
        </el-button>
        <el-button
          v-p="ADD_USER"
          type="primary"
          size="medium"
          @click="handleCommand('add')"
        >
          创建用户
        </el-button>
        <el-button
          v-p="IMPORT_USER"
          type="primary"
          size="medium"
          @click="importUser"
        >
          导入用户
        </el-button>
      </div>
    </page-header>
    <el-row
      style="height: calc(100% - 92px)"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <basic-container block>
          <el-input
            v-model.trim="treeSearch"
            clearable
            placeholder="组织名称"
            style="margin-bottom: 10px"
          />
          <el-tree
            ref="orgTree"
            :load="lazyLoadOrgTree"
            node-key="id"
            lazy
            :data="treeData"
            :props="treeProps"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          />
        </basic-container>
      </el-col>
      <el-col
        class="content"
        style="height: 100%"
      >
        <user-list
          ref="userList"
          :active-org="activeOrg"
          style="padding-right: 0"
          @refresh="loadData"
          @updateList="updateList"
        />
      </el-col>
    </el-row>
    <export-dialog
      :visible.sync="isShowExportDialog"
      :total-num="_.get($refs, 'userList.page.total')"
      :export-api="exportUserList"
      :export-params="_.get($refs, 'userList.queryListParams')"
    />
  </div>
</template>

<script>
import { getOrganization, getOuterUser, exportUserList } from '@/api/system/user'
import { getorganizationNew } from '@/api/org/org'
import { mapGetters } from 'vuex'
import { ADD_USER, IMPORT_USER, EXPORT_USER } from '@/const/privileges'
const loadOrgTree = async ({ parentId, parentPath }) => {
  // 只能传入一个参数 当传入search的时候不使用parentId
  const data = await getorganizationNew({ parentId })
  // 在这里处理两个数组为树形组件需要的结构
  const orgs = data || []
  const target = _.concat(
    _.map(orgs, (item) =>
      _.assign(
        {
          path: `${parentPath || '0'}_${item.id}`,
          orgId: item.id,
          orgName: item.name
        },
        item
      )
    )
  )
  return target
}

export default {
  name: 'User',
  components: {
    // 用户列表组件
    userList: () => import('./components/userList'),
    exportDialog: () => import('@/components/common-export/exportDialog.vue')
  },
  data() {
    const treeLabel = (data) => {
      return `${data.orgName}（${data.orgId ? data.userNum : this.outerUserCount}）`
    }
    const hasChildren = (data) => {
      return !data.hasChildren
    }
    return {
      exportDisable: false,
      isShowExportDialog: false, // 是否展示导出弹窗
      activeTabName: 'orgTree',
      loading: false,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        // label: 'orgName',
        label: treeLabel,
        value: 'orgId',
        isLeaf: hasChildren,
        children: 'children'
      },
      outerUserCount: 0,
      activeOrg: { orgId: '0' },
      parentOrgId: 0,
      treeSearch: '',
      businessSearch: '',
      treeLoading: false
    }
  },
  computed: {
    exportUserList: () => exportUserList,
    ADD_USER: () => ADD_USER,
    EXPORT_USER: () => EXPORT_USER,
    IMPORT_USER: () => IMPORT_USER,
    ...mapGetters(['userInfo'])
  },
  watch: {
    treeSearch(val) {
      // this.$refs.orgTree.filter(val)
      this.searchLoadData(val)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateList(data) {
      this.exportDisable = _.isEmpty(data)
    },
    exportData() {
      this.isShowExportDialog = true
    },
    searchLoadData: _.debounce(function(orgName) {
      let params
      if (orgName) {
        params = { orgName }
      } else {
        params = { parentId: '0' }
      }
      this.loading = true
      getorganizationNew(params)
        .then((res) => {
          const orgs = res || []
          const target = _.concat(
            _.map(orgs, (item) =>
              _.assign(
                {
                  orgId: item.id,
                  orgName: item.name
                },
                item
              )
            )
          )
          this.treeData = target
        })
        .finally(() => {
          this.loading = false
        })
    }, 400),
    async lazyLoadOrgTree(node, resolve) {
      const parentId = node.level > 0 ? node.data.orgId : '0'
      if (parentId === '0') this.loading = true
      const target = await loadOrgTree({
        parentId
      })
      if (parentId === '0') {
        target.push({ orgId: null, orgName: '外部人员', isPush: true })
      }
      this.loading = false
      resolve(target)
    },

    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    nodeClick(data) {
      this.activeOrg = data
    },
    handleCommand(command) {
      if (command === 'add') {
        this.$router.push('/system/editUser')
      }
    },
    importUser() {
      this.$router.push('/system/importUser')
    },
    loadData() {
      this.loadOuterUserCount()
      // this.loadTree()
    },
    loadOuterUserCount() {
      getOuterUser({ pageSize: 1, pageNo: 1 }).then((res) => {
        this.outerUserCount = res.totalNum
      })
    },
    loadTree(parentOrgId = '0') {
      this.treeLoading = true
      getOrganization({ parentOrgId })
        .then((data) => {
          if (parentOrgId === '0') {
            data.push({ orgId: null, orgName: '外部人员' })
          }
          this.treeData = data
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__content {
  height: calc(100% - 55px);
  overflow: auto;
}
/deep/ .basic-container--block {
  height: 100%;
  min-height: 100%;
  > .el-card {
    height: 100%;
    > .el-card__body {
      height: 100%;
      overflow: auto;
    }
  }
}
.sidebar {
  width: 350px;
}
.content {
  width: calc(100% - 350px);
}
.fill /deep/.el-tree-node__content {
  line-height: 36px;
}
</style>
