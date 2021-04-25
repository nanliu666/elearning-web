<template>
  <div class="diyHomeMobile">
    <page-header title="首页定制(移动)">
      <el-button
        slot="rightMenu"
        v-p="DIY_HOME_ADD_MOBILE"
        type="primary"
        size="medium"
        @click="addNewPlan"
      >
        创建方案
      </el-button>
    </page-header>
    <el-row
      style="height: calc(100% - 92px)"
      :gutter="8"
    >
      <!-- 左侧组织架构 -->
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
            @node-click="nodeClick"
          >
          </el-tree>
        </basic-container>
      </el-col>
      <!-- 右侧定制列表 -->
      <el-col
        class="content"
        style="height: 100%"
      >
        <custom-list-mobile :active-org="activeOrg"></custom-list-mobile>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getOrganization } from '@/api/system/user'
import customListMobile from './components/customListMobile'
import { DIY_HOME_ADD_MOBILE } from '@/const/privileges'
export default {
  name: 'DiyHomeMobile',
  components: {
    customListMobile
  },
  data() {
    return {
      treeSearch: '',
      treeLoading: false,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
        children: 'children'
      },
      activeOrg: { id: '0', orgId: '0', orgName: '全部', hasChildren: false }
    }
  },
  computed: {
    DIY_HOME_ADD_MOBILE: () => DIY_HOME_ADD_MOBILE
  },
  watch: {
    treeSearch(val) {
      this.$refs.orgTree.filter(val)
    }
  },
  async mounted() {
    await this.loadTree()
    this.$refs.orgTree.setCurrentKey(this.activeOrg.orgId)
  },
  methods: {
    //  创建方案
    addNewPlan() {
      this.$router.push({
        path: '/diy/diyHomeEditMobile',
        query: { orgId: this.activeOrg.orgId }
      })
    },
    // tree结构子节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // tree节点点击
    nodeClick(data) {
      this.activeOrg = data
    },
    // 初始化组织架构
    async loadTree(parentOrgId = '0') {
      this.treeLoading = true
      await getOrganization({ parentOrgId })
        .then((data) => {
          if (parentOrgId === '0') {
            data.push({ orgId: null, orgName: '外部人员' })
          }
          this.treeData = data
          this.treeData.unshift({ id: '0', orgId: '0', orgName: '默认方案', hasChildren: false })
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
.diyHomeMobile {
  .sidebar {
    width: 300px;
  }
  .content {
    width: calc(100% - 300px);
  }
  .fill /deep/.el-tree-node__content {
    line-height: 36px;
  }
}
</style>
