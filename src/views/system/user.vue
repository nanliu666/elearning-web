<template>
  <div class="fill">
    <page-header title="用户管理">
      <el-dropdown
        slot="rightMenu"
        @command="handleCommand"
      >
        <el-button
          type="primary"
          size="medium"
        >
          添加用户
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">
            单个添加
          </el-dropdown-item>
          <!-- <el-dropdown-item>Excel导入员工</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </page-header>
    <el-row
      style="height: calc(100% - 92px);"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <basic-container block>
          <el-input
            v-model="treeSearch"
            clearable
            placeholder="组织名称"
            style="margin-bottom:10px;"
          />
          <el-tree
            ref="orgTree"
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
              <span>{{ data.orgName }}{{ '  ' }} ({{ data.userNum }})</span>
            </span>
          </el-tree>
        </basic-container>
      </el-col>
      <el-col
        class="content"
        style="height:100%"
      >
        <user-list
          ref="userList"
          :active-org="activeOrg"
          style="padding-right:0;"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrganization } from '@/api/system/user'
import { mapGetters } from 'vuex'

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
      businessTreeData: [], // 业务部门数据
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
        children: 'children'
      },
      activeTag: null,
      activeOrg: null,
      activeBus: null,
      parentOrgId: 0,
      treeSearch: '',
      businessSearch: '',
      treeLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    treeSearch(val) {
      this.$refs.orgTree.filter(val)
    },
    businessSearch(val) {
      this.$refs.businessTree.filter(val)
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    filterBusNode(value, data) {
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
    loadTree(parentOrgId = '0') {
      this.treeLoading = true
      getOrganization({ parentOrgId })
        .then((data) => {
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
