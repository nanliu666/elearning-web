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
        @current-page-change="currentChange"
        @page-size-change="sizeChange"
      >
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            @click="setToVisible(selection)"
          >
            设为可见
          </el-button>
          <el-button
            type="text"
            @click="setToUnVisible(selection)"
          >
            设为不可见
          </el-button>
          <el-button
            type="text"
            @click="deleteBanner(selection)"
          >
            删除
          </el-button>
        </template>
        <template #topMenu>
          <div class="operations">
            <seach-popover
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
          </div>
        </template>
        <template
          slot="banner"
          slot-scope="scope"
        >
          <el-image
            :src="scope.row.banner"
            style="vertical-align: middle; padding: 10px 0"
          ></el-image>
        </template>
        <template
          slot="linkAddress"
          slot-scope="scope"
        >
          <el-link
            :href="scope.row.banner"
            target="_blank"
            type="primary"
          >
            {{ scope.row.linkAddress || '无' }}
          </el-link>
        </template>
        <template #handler="{ row }">
          <div class="table__handler">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editBanner(row)"
            ></el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
export default {
  name: 'BannerTable',
  components: {
    SeachPopover: () => import('@/components/searchPopOver')
  },
  data() {
    return {
      columns: [
        {
          label: 'Banner图',
          prop: 'banner',
          slot: true,
          sortable: true
        },
        {
          label: '设备类型',
          prop: 'deviceType',
          sortable: true
        },
        {
          label: '排序',
          prop: 'sorting',
          sortable: true
        },
        {
          label: '链接地址',
          prop: 'linkAddress',
          slot: true,
          sortable: true
        },
        {
          label: '发布时间',
          prop: 'releaseTime',
          sortable: true
        },
        {
          label: '发布者',
          prop: 'publisher',
          sortable: true
        },
        {
          label: '绑定部门',
          prop: 'department',
          sortable: true
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
      tableData: [
        {
          banner: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          deviceType: 'PC',
          sorting: '1',
          linkAddress: '',
          releaseTime: '2020/12/28 15:40',
          publisher: '小明',
          department: '开发部'
        }
      ],
      tableLoading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      searchPopoverConfig: {
        requireOptions: [
          {
            config: { placeholder: '请输入发布者名称搜索', 'suffix-icon': 'el-icon-search' },
            data: '',
            field: 'publisher',
            label: '',
            type: 'input'
          }
        ]
      }
    }
  },
  methods: {
    //  处理页码改变
    currentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    sizeChange(pageSize) {
      this.page.size = pageSize
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
    deleteBanner(selection) {
      console.log(selection)
    },
    // 输入框搜索
    async handleSearch(params) {
      console.log(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.bannerTable {
  height: 100%;
}
</style>
