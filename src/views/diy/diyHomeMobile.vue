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
        <basic-container
          block
          style="overflow: auto"
        >
          <el-input
            v-model.trim="treeSearch"
            clearable
            placeholder="组织名称"
            style="margin-bottom: 10px"
          />
          <!-- <el-tree
            ref="orgTree"
            v-loading="treeLoading"
            :filter-node-method="filterNode"
            :data="treeData"
            node-key="orgId"
            :props="treeProps"
            :expand-on-click-node="false"
            @node-click="nodeClick"
          >
          </el-tree> -->
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
import { getorganizationNew } from '@/api/org/org'
import customListMobile from './components/customListMobile'
import { DIY_HOME_ADD_MOBILE } from '@/const/privileges'
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
  name: 'DiyHomeMobile',
  components: {
    customListMobile
  },
  data() {
    const hasChildren = (data) => {
      return !data.hasChildren
    }
    return {
      loading: false,
      isMounted: false,
      treeSearch: '',
      treeLoading: false,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        label: 'orgName',
        value: 'orgId',
        isLeaf: hasChildren,
        children: 'children'
      },
      activeOrg: { id: '0', orgId: '0', orgName: '全部', hasChildren: false }
    }
  },
  computed: {
    DIY_HOME_ADD_MOBILE: () => DIY_HOME_ADD_MOBILE
  },
  watch: {
    // treeSearch(val) {
    //   this.$refs.orgTree.filter(val)
    // }
    treeSearch(val) {
      this.searchLoadData(val)
    }
  },
  mounted() {
    this.isMounted = true
    // await this.loadTree()
    // this.$refs.orgTree.setCurrentKey(this.$route.query.orgId || this.activeOrg.orgId)
  },
  methods: {
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
      if (this.isMounted) {
        this.isMounted = false
        this.activeOrg = target[0]
        this.$nextTick(() => {
          this.$refs.orgTree.setCurrentKey(this.$route.query.orgId || this.activeOrg.orgId)
        })
      }
      this.loading = false
      resolve(target)
    },
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
  .basic-container--block /deep/ .el-card {
    margin-bottom: 0;
  }
}
</style>
