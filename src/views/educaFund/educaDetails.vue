<template>
  <div class="fill">
    <page-header title="经费明细">
      <div slot="rightMenu">
        <el-button
          v-p="EDUCA_DETAIL_CREATE"
          type="primary"
          size="medium"
          @click="handleAdd"
        >
          创建费用预算
        </el-button>
        <el-button
          v-p="EDUCA_DETAIL_EXPORT"
          size="medium"
          @click="handlePopup('import')"
        >
          导出
        </el-button>
      </div>
    </page-header>

    <el-row
      style="height: calc(100% - 92px)"
      :gutter="8"
    >
      <el-col class="fill sidebar">
        <div class="left-treeSearch">
          <el-input
            v-model="treeSearch"
            clearable
            suffix-icon="el-icon-search"
            placeholder="组织名称"
          />
        </div>
        <div class="left-tree">
          <el-tree
            ref="orgTree"
            v-loading="treeLoading"
            show-checkbox
            :data="treeData"
            :filter-node-method="filterNode"
            node-key="orgId"
            :props="treeProps"
            :expand-on-click-node="false"
            default-expand-all
            @check="nodeClick"
          >
          </el-tree>
        </div>
      </el-col>
      <el-col
        class="content"
        style="height: 100%"
      >
        <cost-list
          ref="costList"
          :active-org="activeOrg"
        />
      </el-col>
    </el-row>

    <!--导出弹窗-->
    <el-dialog
      v-loading="loading"
      element-loading-text="正在导出..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :close-on-click-modal="false"
      append-to-body
      :visible="importVisible"
      width="550px"
      :modal-append-to-body="false"
      @close="handlePopup"
    >
      <div
        slot="title"
        class="import_title"
      >
        导出<span>（提示：由于系统限制，每次只能导出5000条数据）</span>
      </div>
      <div class="import_total">
        共{{ page.total }}条数据，请选择你需要导出的数据范围：
      </div>
      <el-row class="import_list">
        <el-col
          v-for="(item, index) in importData"
          :key="index"
        >
          <el-radio
            v-model="page.pageNo"
            :label="item.pageNo"
          >
            {{ item.startNum }} ~ {{ item.endNum }}
          </el-radio>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="handlePopup"
        >取消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="importUser"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrgTree } from '@/api/org/org'
import { exportProject } from '@/api/educaFund/educaFund'
import { EDUCA_DETAIL_CREATE, EDUCA_DETAIL_EXPORT } from '@/const/privileges'
var timeout = null
export default {
  name: 'EducaDetails',
  components: {
    // 用户列表组件
    costList: () => import('./components/costList')
  },
  data() {
    const treeLabel = (data) => {
      return `${data.orgName}（${data.userNum}）`
    }
    return {
      loading: false,
      importData: [],
      page: {
        pageNo: 1,
        pageSize: 5000,
        total: 0
      },
      importVisible: false,
      treeData: [], // 组织架构数据
      treeProps: {
        labelText: '标题',
        label: treeLabel,
        value: 'orgId',
        children: 'children'
      },
      activeOrg: [],
      treeSearch: '',
      treeLoading: false
    }
  },
  computed: {
    EDUCA_DETAIL_CREATE: () => EDUCA_DETAIL_CREATE,
    EDUCA_DETAIL_EXPORT: () => EDUCA_DETAIL_EXPORT
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
    // 创建费用预算
    handleAdd() {
      const y = new Date().getFullYear()
      this.$refs.costList.getAllType(y)
      this.$refs.costList.opera = 'add'
      this.$refs.costList.visible = true
    },
    handlePopup(key) {
      if (key === 'import') {
        this.page.total = this.$refs.costList.page.total
        if (this.page.total < 1) {
          this.$message.warning('暂无数据')
          return
        }
        const totalPage = Math.ceil(this.page.total / 5000)
        const prevPage = totalPage - 1
        this.importData = []
        if (this.page.total > 5000) {
          for (let i = 0; i < prevPage; i++) {
            this.importData.push({ pageNo: i + 1, startNum: i * 5000 + 1, endNum: (i + 1) * 5000 })
          }
          this.importData.push({
            pageNo: totalPage,
            startNum: prevPage * 5000 + 1,
            endNum: this.page.total
          })
        } else {
          this.importData.push({ pageNo: 1, startNum: 1, endNum: this.page.total })
        }
        this.importVisible = true
      } else {
        this.importVisible = false
        this.page.pageNo = 1
      }
    },
    //导出
    importUser() {
      const list = this.$refs.costList
      this.loading = true
      exportProject({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        orgIds: list.searchParams.orgIds || '',
        startTime: list.searchParams.startTime || '',
        endTime: list.searchParams.endTime || '',
        catalogueName: list.searchParams.catalogueName || '',
        projectName: list.searchParams.projectName || ''
      })
        .then((res) => {
          const { data, headers } = res
          const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
          const blob = new Blob([data], { type: headers['content-type'] })
          let dom = document.createElement('a')
          let url = window.URL.createObjectURL(blob)
          dom.href = url
          dom.download = decodeURI(fileName)
          dom.style.display = 'none'
          document.body.appendChild(dom)
          dom.click()
          dom.parentNode.removeChild(dom)
          window.URL.revokeObjectURL(url)
        })
        .finally(() => {
          this.loading = false
        })
    },
    //获取组织名称
    loadTree(parentOrgId = '0') {
      this.treeLoading = true
      getOrgTree({ parentOrgId })
        .then((data) => {
          this.treeData = data || []
        })
        .finally(() => {
          this.treeLoading = false
        })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    nodeClick() {
      const checkedId = this.$refs.orgTree.getCheckedKeys()
      if (timeout !== null) clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.activeOrg = checkedId
      }, 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.import_title {
  color: #303133;
  font-size: 18px;
  span {
    font-size: 14px;
    color: #202940;
  }
}
.import_total {
  margin-bottom: 16px;
}
.import_list {
  max-height: 320px;
  overflow: auto;
  box-sizing: border-box;
  padding: 16px 16px 0;
  border: 1px solid #eee;
  border-radius: 4px;
  /deep/.el-col {
    margin-bottom: 12px;
  }
}
/deep/ .el-tabs__content {
  height: calc(100% - 55px);
  overflow: auto;
}
/deep/.el-dialog__body {
  padding: 20px;
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
  border-radius: 4px;
  .left-treeSearch {
    padding: 24px 24px 10px;
    background: #fff;
  }
  .left-tree {
    height: calc(100% - 70px);
    box-sizing: border-box;
    padding: 0 24px 24px;
    background: #fff;
    overflow: auto;
  }
}
.content {
  width: calc(100% - 350px);
}
.fill /deep/.el-tree-node__content {
  line-height: 36px;
}
</style>
