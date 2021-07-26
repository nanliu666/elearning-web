<template>
  <div class="diyLogo">
    <page-header title="Logo定制">
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
        <basic-container block>
          <common-table
            ref="multipleTable"
            :config="tableConfig"
            :columns="columns"
            :data="tableData"
            :loading="tableLoading"
            :page="page"
            :page-config="pageConfig"
            @current-page-change="currentChange"
            @page-size-change="sizeChange"
          >
            <template
              slot="frontUrl"
              slot-scope="scope"
            >
              <el-image
                v-if="scope.row.frontUrl"
                :src="scope.row.frontUrl"
                style="vertical-align: middle; padding: 10px 0"
              ></el-image>
            </template>
            <template
              slot="backgroundUrl"
              slot-scope="scope"
            >
              <el-image
                v-if="scope.row.backgroundUrl"
                :src="scope.row.backgroundUrl"
                style="vertical-align: middle; padding: 10px 0"
              ></el-image>
            </template>
            <!-- 列操作 -->
            <template #handler="{ row }">
              <div class="table__handler">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editLogo(row)"
                ></el-button>
              </div>
            </template>
          </common-table>
        </basic-container>
      </el-col>
    </el-row>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="visible"
      direction="rtl"
      @close="cancelDrawer"
    >
      <div
        slot="title"
        style="font-size: 20px"
      >
        {{ title }}
      </div>
      <el-divider style="margin-top: -20px"></el-divider>
      <div class="container">
        <el-form
          ref="form"
          label-width="100px"
          label-position="left"
          :rules="rules"
        >
          <el-form-item label="绑定部门：">
            <el-input
              v-model="activeOrg.orgName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="前台logo："
            prop="frontUrl"
          >
            <common-upload
              v-model="frontLogo"
              :before-upload="beforeUpload"
              :multiple="true"
              list-type="picture"
              :show-file-list="true"
              :on-remove="removeFrontLogo"
              :limit="1"
              :on-exceed="onExceed"
            >
              <el-button
                size="small"
                type="primary"
              >
                选择图片
              </el-button>
              <div
                slot="tip"
                style="color: #ff0000; font-size: 12px"
              >
                说明：图片只能是 jpg、jpeg、png 格式，且不能超过5MB!
              </div>
            </common-upload>
          </el-form-item>
          <el-form-item
            label="后台logo："
            prop="backgroundUrl"
          >
            <common-upload
              v-model="backgroundLogo"
              :before-upload="beforeUpload"
              :multiple="true"
              list-type="picture"
              :show-file-list="true"
              :on-remove="removeBackgroundLogo"
              :limit="1"
              :on-exceed="onExceed"
            >
              <el-button
                size="small"
                type="primary"
              >
                选择图片
              </el-button>
              <div
                slot="tip"
                style="color: #ff0000; font-size: 12px"
              >
                说明：图片只能是 jpg、jpeg、png 格式，且不能超过5MB!
              </div>
            </common-upload>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button
            type="primary"
            :loading="releaseLoading"
            @click="releaseLogo"
          >
            发布
          </el-button>
          <el-button
            v-if="logoData.id"
            type="success"
            :loading="resetLoading"
            @click="resetLogo"
          >
            重置
          </el-button>
          <el-button @click="cancelDrawer">
            取 消
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getOrganization } from '@/api/system/user'
import { getorganizationNew } from '@/api/org/org'
import { logoList, updateLogo, removeLogo } from '@/api/diy/diyHomePc'
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
  name: 'DiyLogo',
  components: {
    commonUpload: () => import('@/components/common-upload/commonUpload')
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
      activeOrg: { id: '0', orgId: '0', orgName: '默认Logo', hasChildren: false },
      columns: [
        {
          label: '绑定部门',
          prop: 'orgName'
        },
        {
          label: '前台logo',
          prop: 'frontUrl',
          slot: true
        },
        {
          label: '后台logo',
          prop: 'backgroundUrl',
          slot: true
        }
      ],
      tableConfig: {
        showHandler: true,
        defaultExpandAll: false,
        enableMultiSelect: false,
        enablePagination: true,
        showIndexColumn: false,
        rowKey: 'id',
        handlerColumn: {
          width: '80',
          fixed: false
        }
      },
      tableData: [],
      tableLoading: false,
      page: {
        currentPage: 1,
        size: 5,
        total: 1
      },
      pageConfig: {
        pageSizes: [5, 10, 20, 50, 100],
        layout: 'total,prev,pager,next,sizes,jumper,->'
      },
      visible: false,
      title: 'logo定制',
      rules: {
        frontUrl: [{ required: true, message: '请上传前台logo!', trigger: 'change' }],
        backgroundUrl: [{ required: true, message: '请上传后台logo!', trigger: 'change' }]
      },
      frontLogo: [],
      backgroundLogo: [],
      releaseLoading: false,
      resetLoading: false,
      logoData: {}
    }
  },
  watch: {
    // treeSearch(val) {
    //   this.$refs.orgTree.filter(val)
    // }
    treeSearch(val) {
      this.searchLoadData(val)
    },
    activeOrg: {
      handler() {
        this.initLogoList()
      },
      deep: true
    }
  },
  mounted() {
    this.isMounted = true
    // this.initLogoList()
    // await this.loadTree()
    // this.$refs.orgTree.setCurrentKey(this.activeOrg.orgId)
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
    // tree结构子节点过滤
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    // tree节点点击
    nodeClick(data) {
      this.activeOrg = data
      this.initLogoList()
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
          this.treeData.unshift({ id: '0', orgId: '0', orgName: '默认Logo', hasChildren: false })
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    //  处理页码改变
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.initLogoList()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.initLogoList()
    },
    // 编辑logo
    editLogo(row) {
      this.visible = true
      this.logoData = row
      //   判断前台logo是否存在
      if (row.frontUrl) {
        this.frontLogo.push({
          fileUrl: row.frontUrl,
          url: row.frontUrl,
          uid: Math.round(Math.random() * 10000 + 1000)
        })
      }
      //   判断后台logo是否存在
      if (row.backgroundUrl) {
        this.backgroundLogo.push({
          fileUrl: row.backgroundUrl,
          url: row.backgroundUrl,
          uid: Math.round(Math.random() * 10000 + 1000)
        })
      }
    },
    cancelDrawer() {
      this.visible = false
      this.frontLogo = []
      this.backgroundLogo = []
    },
    beforeUpload(file) {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg、jpeg、png 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isJPG && isLt5M
    },
    // 移除图片
    removeFrontLogo(file) {
      this.frontLogo = this.frontLogo.filter((v) => v.uid != file.uid)
    },
    removeBackgroundLogo(file) {
      this.backgroundLogo = this.backgroundLogo.filter((v) => v.uid != file.uid)
    },
    // 超出限制
    onExceed() {
      this.$message({
        type: 'error',
        message: '一次只能上传1个logo!'
      })
    },
    // 发布Logo
    async releaseLogo() {
      if (!this.frontLogo.length || !this.backgroundLogo.length) {
        this.$message({
          type: 'error',
          message: '前台logo和后台logo不能为空,请上传图片!'
        })
        return
      }
      this.releaseLoading = true
      let params = {
        orgId: this.activeOrg.orgId,
        frontUrl: this.frontLogo[0].fileUrl,
        backgroundUrl: this.backgroundLogo[0].fileUrl,
        deviceType: 'PC',
        remark: ''
      }
      //   判断id是否存在，存在是编辑，不存在是新增
      if (this.logoData.id) params.id = this.logoData.id
      await updateLogo(params)
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.initLogoList()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败，请联系管理员!'
          })
        })
        .finally(() => {
          this.releaseLoading = false
          this.cancelDrawer()
        })
    },
    // 重置
    resetLogo() {
      this.releaseLoading = true
      let params = {
        id: this.logoData.id
      }
      this.$confirm('您确认要重置当前的数据吗？', '确认重置？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeLogo(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.initLogoList()
          })
          .finally(() => {
            this.releaseLoading = false
            this.cancelDrawer()
          })
      })
    },
    // 获取logo列表
    async initLogoList() {
      this.tableLoading = true
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        deviceType: 'PC',
        orgId: this.activeOrg.orgId
      }
      await logoList(params)
        .then((res) => {
          this.tableData = [res]
        })
        .finally(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.diyLogo {
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
/deep/ .el-drawer__header {
  margin-bottom: 0;
}
.container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 30px);
  padding: 20px 20px 0;
  form {
    flex: 1;
  }
  .drawer__footer {
    text-align: center;
    // display: flex;
    // button {
    //   flex: 1;
    // }
  }
}
</style>
