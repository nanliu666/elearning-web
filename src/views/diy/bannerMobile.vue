<template>
  <div class="bannerPc">
    <page-header title="bannerPc">
      <div slot="rightMenu">
        <!-- <el-button size="medium" @click="preview"> 预览效果 </el-button> -->
        <el-button
          v-p="DIY_BANNER_ADD_MOBILE"
          type="primary"
          size="medium"
          @click="releaseBanner"
        >
          新建Banner
        </el-button>
      </div>
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
        <banner-table-mobile
          ref="bannerTable"
          :active-org="activeOrg"
          @bj="editActive"
        ></banner-table-mobile>
      </el-col>
    </el-row>
    <!-- 抽屉 -->
    <banner-drawer-mobile
      ref="bannerDrawer"
      :active-org="activeOrg"
      @addSuccess="addSuccess"
      @init="addSuccess"
    ></banner-drawer-mobile>
  </div>
</template>
<script>
import { getOrganization } from '@/api/system/user'
import bannerTableMobile from './components/bannerTableMobile'
import bannerDrawerMobile from './components/bannerDrawerMobile'
import { DIY_BANNER_ADD_MOBILE } from '@/const/privileges'
export default {
  name: 'BannerMobile',
  components: {
    bannerTableMobile,
    bannerDrawerMobile
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
    DIY_BANNER_ADD_MOBILE: () => DIY_BANNER_ADD_MOBILE
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
}
</style>
