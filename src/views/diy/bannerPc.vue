<template>
  <div class="bannerPc">
    <page-header title="bannerPc">
      <div slot="rightMenu">
        <!-- <el-button size="medium" @click="preview"> 预览效果 </el-button> -->
        <el-button
          type="primary"
          size="medium"
          @click="releaseBanner"
        >
          发布Banner
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
      @addSuccess="addSuccess"
    ></banner-drawer-pc>
  </div>
</template>
<script>
import { getOrganization } from '@/api/system/user'
import bannerTablePc from './components/bannerTablePc'
import bannerDrawerPc from './components/bannerDrawerPc'
export default {
  name: 'BannerPc',
  components: {
    bannerTablePc,
    bannerDrawerPc
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
      activeOrg: {}
    }
  },
  watch: {
    treeSearch(val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    //   预览效果
    preview() {},
    //  发布Banner
    releaseBanner() {
      if (!Object.keys(this.activeOrg).length || this.activeOrg.orgId == '0') {
        this.$message({
          type: 'error',
          message: '请先在左侧选择一个部门!'
        })
        return
      }
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
          this.treeData = data
          this.treeData.unshift({ id: '0', orgId: '0', orgName: '全部', hasChildren: false })
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
