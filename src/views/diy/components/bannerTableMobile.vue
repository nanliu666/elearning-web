<template>
  <div class="bannerTable">
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
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <!-- <el-button type="text" @click="setToVisible(selection)"> 设为可见 </el-button>
          <el-button type="text" @click="setToUnVisible(selection)"> 设为不可见 </el-button> -->
          <el-button
            v-p="DIY_BANNER_DELETE_MOBILE"
            type="text"
            @click="deleteBanner(selection)"
          >
            删除
          </el-button>
        </template>
        <!-- <template #topMenu>
          <div class="operations">
            <seach-popover
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
          </div>
        </template> -->
        <template
          slot="picUrl"
          slot-scope="scope"
        >
          <el-image
            :src="scope.row.picUrl"
            style="vertical-align: middle; padding: 10px 0"
          ></el-image>
        </template>
        <template
          slot="linkUrl"
          slot-scope="scope"
        >
          {{ scope.row.linkUrl || '无' }}
        </template>
        <template #handler="{ row }">
          <div class="table__handler">
            <el-button
              v-p="DIY_BANNER_EDIT_MOBILE"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editBanner(row)"
            ></el-button>
          </div>
        </template>
        <template slot="empty">
          <div class="empty-block">
            <img
              src="@/assets/images/nodata.png"
              class="empty-img"
            />
            <div class="nodata">
              暂无数据
            </div>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getBannerList, removeBanner } from '@/api/diy/diyHomePc'
import { DIY_BANNER_EDIT_MOBILE, DIY_BANNER_DELETE_MOBILE } from '@/const/privileges'
export default {
  name: 'BannerTableMobile',
  components: {
    // SeachPopover: () => import('@/components/searchPopOver')
  },
  props: {
    activeOrg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: 'Banner图',
          prop: 'picUrl',
          slot: true
        },
        {
          label: '设备类型',
          prop: 'deviceType'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '链接地址',
          prop: 'linkUrl',
          slot: true
        },
        {
          label: '发布时间',
          prop: 'createTime'
        },
        {
          label: '发布者',
          prop: 'creatorName'
        },
        {
          label: '绑定部门',
          prop: 'orgName'
        }
      ],
      tableConfig: {
        showHandler: true,
        defaultExpandAll: false,
        enableMultiSelect: true,
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
        total: 0
      },
      pageConfig: {
        pageSizes: [5, 10, 20, 50, 100],
        layout: 'total,prev,pager,next,sizes,jumper,->'
      },
      searchPopoverConfig: {
        requireOptions: [
          {
            config: { placeholder: '请输入发布者名称搜索', 'suffix-icon': 'el-icon-search' },
            data: '',
            field: 'creatorName',
            label: '',
            type: 'input'
          }
        ]
      },
      device: 'all'
    }
  },
  computed: {
    DIY_BANNER_EDIT_MOBILE: () => DIY_BANNER_EDIT_MOBILE,
    DIY_BANNER_DELETE_MOBILE: () => DIY_BANNER_DELETE_MOBILE
  },
  watch: {
    activeOrg: {
      handler(val) {
        if (Object.keys(val).length) {
          this.activeOrg = val
          this.initBannerData()
        }
      },
      deep: true
      // immediate: true
    }
  },
  mounted() {
    // this.initBannerData()
  },
  methods: {
    //  处理页码改变
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.initBannerData()
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
      this.initBannerData()
    },
    // 编辑操作
    editBanner(data) {
      this.$emit('bj', data)
    },
    // 设为可见
    setToVisible(selection) {
      console.log(selection)
    },
    // 设为不可见
    setToUnVisible(selection) {
      console.log(selection)
    },
    // 删除
    async deleteBanner(selection) {
      let idsArr = selection.map((v) => v.id)
      let params = { ids: idsArr.join(',') }
      this.$confirm('您确认要删除选中的banner吗？', '确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeBanner(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initBannerData()
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败，请联系管理员!'
            })
          })
          .finally(() => {
            this.$refs.multipleTable.clearSelection()
          })
      })
    },
    // 输入框搜索
    async handleSearch(params) {
      console.log(params)
    },
    // 获取banner列表
    async initBannerData() {
      this.tableLoading = true
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        deviceType: 'APP',
        orgId: this.$route.query.orgId || this.activeOrg.orgId
      }
      //   if (this.activeOrg) Object.assign(params, { orgId: this.activeOrg.orgId })
      //   判断是否是全部
      //   if (this.activeOrg && this.activeOrg.orgId == '0') Object.assign(params, { orgId: '' })
      await getBannerList(params)
        .then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.bannerTable {
  height: 100%;
}
</style>
