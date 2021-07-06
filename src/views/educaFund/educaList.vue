<template>
  <div class="fill">
    <page-header title="经费管理">
      <el-button
        v-if="!isShowYear"
        slot="rightMenu"
        v-p="EDUCA_MANAGE_CREATE"
        size="medium"
        type="primary"
        @click="onHandleEdit('add')"
      >
        创建年度经费
      </el-button>
      <el-button
        v-else
        slot="rightMenu"
        v-p="EDUCA_MANAGE_CREATE"
        size="medium"
        :disabled="true"
      >
        创建年度经费
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="loading"
        @current-page-change="pageChange"
        @page-size-change="sizeChange"
      >
        <template #year="{ row }">
          <div
            class="ellipsis title"
            @click="getDetail(row)"
          >
            {{ row.year + '年度经费' }}
          </div>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-p="EDUCA_MANAGE_EDIT"
            type="text"
            size="medium"
            @click.stop="onHandleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-p="EDUCA_MANAGE_DEL"
            type="text"
            size="medium"
            @click.stop="handleDel(scope.row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { getEducatList, removeEducat, yearsList } from '@/api/educaFund/educaFund'
import { EDUCA_MANAGE_EDIT, EDUCA_MANAGE_DEL, EDUCA_MANAGE_CREATE } from '@/const/privileges'

const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  rowKey: 'id',
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: false
  }
}
const COLUMNS = [
  {
    label: '年度经费',
    prop: 'year',
    slot: true,
    minWidth: 120
  },
  {
    label: '经费类型',
    prop: 'type',
    minWidth: 200,
    formatter: (row) => {
      const name = row.type.map((val) => val.catalogueName).join('、')
      return name || '--'
    }
  },
  {
    label: '年度预算（元）',
    prop: 'budget',
    width: 130
  },
  {
    label: '使用费用（元）',
    prop: 'budgetUsed',
    width: 130
  },
  {
    label: '剩余费用（元）',
    prop: 'name',
    width: 130,
    formatter: (row) => {
      const money = row.budget - row.budgetUsed
      return money || '--'
    }
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '创建人',
    prop: 'creatorName'
  }
]

export default {
  name: 'EducaList',
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      columns: COLUMNS,
      tableConfig: TABLE_CONFIG,
      yearOptions: [],
      isShowYear: false
    }
  },
  beforeRouteLeave(to, from, next) {
    const router = ['/educaFund/newsEduca', '/educaFund/educaInfo', '/educaFund/educaDetails']
    if (router.includes(to.path)) {
      to.meta.$keepAlive = false // 禁用页面缓存
    }
    next()
  },
  computed: {
    EDUCA_MANAGE_CREATE: () => EDUCA_MANAGE_CREATE,
    EDUCA_MANAGE_DEL: () => EDUCA_MANAGE_DEL,
    EDUCA_MANAGE_EDIT: () => EDUCA_MANAGE_EDIT
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([EDUCA_MANAGE_DEL, EDUCA_MANAGE_EDIT])
      },
      deep: true
    }
  },
  created() {
    this.setYear()
  },
  activated() {
    this.loadData(false, true)
  },
  methods: {
    sizeChange(val) {
      this.page.size = val
      this.loadData(true)
    },
    pageChange(val) {
      this.page.currentPage = val
      this.loadData()
    },
    setYear() {
      //设置年度
      this.yearOptions = []
      const y = new Date().getFullYear()
      const q = y - 2020
      for (let i = 0; i < q + 3; i++) {
        this.yearOptions.push({ label: 2020 + i, value: false })
      }
    },
    getYear() {
      //设置年度
      yearsList().then((res) => {
        const year = res || []
        this.yearOptions.forEach((item) => {
          item.value = false
          if (year.join(',').indexOf(item.label) > -1) {
            item.value = true
          }
        })
        this.isShowYear = this.yearOptions.every((item) => item.value)
      })
    },
    //查看年度经费详情
    getDetail(row) {
      this.$router.push({
        path: '/educaFund/educaInfo',
        query: {
          id: row.id,
          year: row.year
        }
      })
    },
    // 删除年度经费列表
    handleDel(rows) {
      const content = '您确定要删除该年度经费类型吗？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const id = rows.id
          removeEducat({ id }).then(() => {
            this.$message.success('删除成功')
            this.loadData(true, true)
          })
        })
        .catch(() => {})
    },
    //添加、年度经费
    onHandleEdit(key) {
      let query = {}
      if (key === 'add') {
        //新建
        query.operation = 'add'
      } else {
        //编辑
        query.operation = 'edit'
        query.operData = key
      }
      this.$router.push({
        path: '/educaFund/newsEduca',
        query: query
      })
    },
    // 加载分组数据
    loadData(isLoad, loadYear) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        id: ''
      }
      this.loading = true
      getEducatList(params)
        .then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
          this.loading = false
          if (loadYear) {
            this.getYear()
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
</style>
