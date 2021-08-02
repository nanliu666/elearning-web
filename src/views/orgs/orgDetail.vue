<template>
  <div style="height: 100%">
    <page-header
      title="组织详情"
      show-back
    />
    <basic-container block>
      <div class="container">
        <div class="treeBox">
          <el-input
            v-model="filterText"
            placeholder="输入组织名称进行过滤"
            suffix-icon="el-icon-search"
            clearable
          />
          <el-tree
            ref="tree"
            v-loading="loading"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            node-key="orgId"
            @node-click="handleNodeClick"
          />
        </div>
        <div
          v-loading="loading"
          class="detailBox"
        >
          <div class="mainHeader">
            <h3>{{ orgData.orgName }}</h3>
            <div class="btnBox">
              <el-button
                v-p="EDIT_ORGDETAIL"
                size="medium"
                type="text"
                icon="el-icon-edit-outline"
                @click="handleOrgEdit(orgData)"
              >
                编辑
              </el-button>
              <el-button
                v-if="orgData.parentId !== '0'"
                v-p="DELETE_ORGDELETE"
                type="text"
                size="medium"
                icon="el-icon-delete"
                @click="deleteOrg"
              >
                删除
              </el-button>
            </div>
          </div>
          <div class="mainNum">
            <div
              class="parent"
              :style="{ visibility: orgData.orgType === 'Enterprise' ? 'hidden' : 'visible' }"
            >
              上级组织：{{ findFatherOrgName(orgData) || '' }}
            </div>
            <div class="numInfo">
              用户人数 <em class="count">{{ orgData.userNum }}</em> 人
            </div>
          </div>
          <div class="baseInfo">
            <h4>基本信息</h4>
            <el-row class="infoBox">
              <el-col :span="4">
                组织编码
              </el-col>
              <el-col :span="20">
                {{ orgData.orgCode || '暂无' }}
              </el-col>
              <el-col :span="4">
                组织类型
              </el-col>
              <el-col :span="20">
                {{ orgTypeObj[orgData.orgType] || '暂无' }}
              </el-col>
              <org-leaders :leaders="orgData.leaders" />
              <el-col :span="4">
                备注
              </el-col>
              <el-col
                :span="20"
                style="white-space:normal;word-break:break-all"
              >
                {{ orgData.remark || '暂无' }}
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <org-edit
        ref="orgEdit"
        :visible.sync="createOrgDailog"
        @changevisible="changevisible"
        @refresh="loadData"
      />
    </basic-container>
  </div>
</template>

<script>
import { getOrgTree, deleteOrg } from '@/api/org/org'
import OrgEdit from './components/orgEdit'
import OrgLeaders from './components/orgLeaders'
import { EDIT_ORGDETAIL, DELETE_ORGDELETE } from '@/const/privileges'

export default {
  name: 'OrgDetail',
  components: { OrgEdit, OrgLeaders },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      orgData: {},
      orgTypeObj: { Enterprise: '企业', Company: '公司', Department: '部门', Group: '小组' },
      createOrgDailog: false,
      originOrgId: '',
      loading: false
    }
  },
  computed: {
    EDIT_ORGDETAIL: () => EDIT_ORGDETAIL,
    DELETE_ORGDELETE: () => DELETE_ORGDELETE
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  activated() {
    this.originOrgId = this.$route.query.orgId
    this.loadData()
    if (this.$route.query.orgId !== this.originOrgId) {
      this.$refs.tree.setCurrentKey(this.$route.query.orgId)
      this.handleNodeClick(this.$refs.tree.getCurrentNode())
    }
  },
  methods: {
    loadData() {
      this.loading = true
      getOrgTree({ parentOrgId: 0 }).then((res) => {
        this.treeData = res
        this.$nextTick(() => {
          if (this.$route.query.orgId !== this.originOrgId) {
            this.$refs.tree.setCurrentKey(this.orgData.orgId)
          } else {
            this.$refs.tree.setCurrentKey(this.$route.query.orgId)
          }
          this.handleNodeClick(this.$refs.tree.getCurrentNode())
          this.loading = false
        })
      })
    },
    deleteOrg() {
      if (this.orgData.parentId === 0) {
        this.$message.error('顶级组织不可删除')
        return
      }
      this.$confirm('您确定要删除选中的组织么？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          ids: this.orgData.orgId
        }
        deleteOrg(params).then(() => {
          this.$message.success('删除成功')
          this.loadData()
        })
      })
    },
    changevisible(data) {
      this.createOrgDailog = data
    },
    handleOrgEdit(row) {
      this.$refs.orgEdit.edit(row)
      this.createOrgDailog = true
    },
    findFatherOrgName(org) {
      let fatherOrg = this.findFather(org)
      return (fatherOrg && fatherOrg.orgName) || ''
    },
    findFather(row) {
      let fatherOrg
      function deep(arr, orgId) {
        arr.forEach((item) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((it) => {
              if (it.orgId === orgId) fatherOrg = item
            })
            deep(item.children, orgId)
          }
        })
      }
      deep(this.treeData, row.orgId)
      return fatherOrg
    },
    handleNodeClick(data) {
      this.orgData = data
      console.log(this.orgData)
    },
    goBack() {
      this.$router.push('/orgs/orgManagement')
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
$color_active: #368afa;
$color_link_active: $color_active;
$color_font_label: #999999;

.pageHeader {
  height: 48px;
  // padding: 0 24px;
  line-height: 48px;
  font-size: 18px;
}
.basic-container--block {
  height: calc(100% - 92px);
}
.container {
  display: flex;
  height: 100%;
  .treeBox {
    flex: 1;
    height: 100%;
    padding: 0 10px;
    border-right: 1px solid #f2f2f2;
    overflow: scroll;
    .filter-tree {
      margin-top: 20px;
    }
  }
  .detailBox {
    flex: 4;
    padding: 0 50px;
    .mainHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mainNum {
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .parent {
        color: $color_font_label;
      }
      .numInfo {
        align-self: flex-end;
        color: $color_font_label;
        float: right;
        margin-left: 20px;
        .count {
          color: $color_active;
          font-style: normal;
          font-weight: bold;
        }
      }
    }
    .baseInfo {
      .infoBox {
        padding: 0 40px;
        line-height: 20px;
        .el-col {
          margin-bottom: 20px;
        }
        .el-col-4 {
          color: $color_font_label;
        }
      }
    }
  }
}

/deep/ .el-tree-node__content {
  height: 40px;
}
</style>
