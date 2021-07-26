<template>
  <div class="bannerPc">
    <page-header title="bannerPc">
      <div slot="rightMenu">
        <!-- <el-button size="medium" @click="preview"> 预览效果 </el-button> -->
        <el-button
          v-p="DIY_BANNER_ADD_PC"
          type="primary"
          size="medium"
          @click="releaseBanner"
        >
          创建Banner
        </el-button>
      </div>
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
        <banner-table-pc
          ref="bannerTable"
          :active-org="activeOrg"
          @bj="editActive"
        ></banner-table-pc>
      </el-col>
    </el-row>
    <!-- 抽屉 -->
    <banner-drawer-pc
      ref="bannerDrawer"
      :active-org="activeOrg"
      @addSuccess="addSuccess"
      @init="addSuccess"
    ></banner-drawer-pc>
  </div>
</template>
<script>
import { getOrganization } from '@/api/system/user'
import { getorganizationNew } from '@/api/org/org'
import bannerTablePc from './components/bannerTablePc'
import bannerDrawerPc from './components/bannerDrawerPc'
import { DIY_BANNER_ADD_PC } from '@/const/privileges'
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
  name: 'BannerPc',
  components: {
    bannerTablePc,
    bannerDrawerPc
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
    DIY_BANNER_ADD_PC: () => DIY_BANNER_ADD_PC
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
    //   预览效果
    preview() {},
    //  发布Banner
    releaseBanner() {
      this.$refs.bannerDrawer.showDrawer('add')
    },
    // 编辑
    editActive(data) {
      this.$refs.bannerDrawer.showDrawer('edit', data)
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
            data.push({ orgId: '', orgName: '外部人员' })
          }
          this.treeData = data
          this.treeData.unshift({ id: '0', orgId: '0', orgName: '默认banner', hasChildren: false })
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    addSuccess() {
      this.$refs.bannerTable.initBannerData()
    }
  }
}
</script>
<style lang="scss" scoped>
.bannerPc {
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
