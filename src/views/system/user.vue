<template>
  <div class="fill">
    <page-header title="用户管理">
      <!-- <el-dropdown
        slot="rightMenu"
        v-p="ADD_USER"
        @command="handleCommand"
      >
        <el-button
          type="primary"
          size="medium"
        >
          创建用户
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">
            单个添加
          </el-dropdown-item>
          <el-dropdown-item>Excel导入员工</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-button
        slot="rightMenu"
        v-p="ADD_USER"
        type="primary"
        size="medium"
        @click="handleCommand('add')"
      >
        创建用户
      </el-button>
      <el-button
        slot="rightMenu"
        v-p="IMPORT_USER"
        type="primary"
        size="medium"
        @click="importUser"
      >
        导入用户
      </el-button>
    </page-header>
    <el-row
      style="height: calc(100% - 92px)"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <basic-container block>
          <el-input
            v-model="treeSearch"
            clearable
            placeholder="组织名称"
            style="margin-bottom: 10px"
          />
          <el-tree
            ref="orgTree"
            v-loading="treeLoading"
            :filter-node-method="filterNode"
            :data="treeData"
            node-key="orgId"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="nodeClick"
          >
            <span
              slot-scope="{ node, data }"
              class="custom-tree-node"
            >
              <span>{{ data.orgName }}{{ '  ' }} ({{
                data.orgId ? data.userNum : outerUserCount
              }})</span>
            </span>
          </el-tree>
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
          @orgUserListUpdate="updateOrgUserList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrganization, getOuterUser } from '@/api/system/user'
import { mapGetters } from 'vuex'
import { ADD_USER, IMPORT_USER } from '@/const/privileges'
export default {
  name: 'User',
  components: {
    // 用户列表组件
    userList: () => import('./components/userList')
  },
  data() {
    return {
      activeTabName: 'orgTree',
      loading: true,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
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
    ADD_USER: () => ADD_USER,
    IMPORT_USER: () => IMPORT_USER,
    ...mapGetters(['userInfo'])
  },
  watch: {
    treeSearch(val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted() {
    this.loadData()
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === '/system/importUser') {
      next((vm) => {
        vm.loadData()
      })
    } else {
      next()
    }
  },
  methods: {
    //如果列表删除了数据   更新父组件组织数据
    updateOrgUserList() {
      this.loadData()
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
      this.loadTree()
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
