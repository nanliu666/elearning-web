<template>
  <div class="postPromotion">
    <!-- 面包屑 -->
    <page-header title="晋升线路图">
    </page-header>
    <basic-container block>
      <!-- 筛选 -->
      <div class="screening">
        <el-input
          v-model="jobsName"
          placeholder="请输入岗位名称"
          suffix-icon="el-icon-search"
          style="width: 260px"
          @input="search"
        >
        </el-input>
      </div>
      <!-- 数据表格 -->
      <el-table
        ref="mutilTable"
        :key="Math.random()"
        v-loading="loading"
        class="mutilTable"
        :data="tableData"
        style="margin-top: 20px"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          label="岗位名称"
          prop="name"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="岗位描述"
          prop="desc"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.desc || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="岗位晋升路线（条）"
          prop="routeNum"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-p="POST_PROMOTION_ROUTE"
              type="text"
              @click="promotionRoute(scope.row)"
            >
              管理晋升路线
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { positionTreeRoute } from '@/api/studyMap/studyMap'
import { POST_PROMOTION_ROUTE } from '@/const/privileges'
export default {
  name: 'PostPromotion',
  data() {
    return {
      jobsName: '',
      tableData: [],
      loading: false
    }
  },
  computed: {
    POST_PROMOTION_ROUTE: () => POST_PROMOTION_ROUTE
  },
  activated() {
    this.initJobsList()
  },
  methods: {
    // 筛选
    search: _.debounce(function(value) {
      this.jobsName = value
      this.initJobsList()
    }, 500),
    // 查询岗位树形结构
    async initJobsList() {
      let _this = this
      _this.loading = true
      await positionTreeRoute({ name: _this.jobsName })
        .then(async (res) => {
          // 递归过滤掉子节点hasChildren
          const loop = (tree) => {
            _.each(tree, (item) => {
              delete item.hasChildren
              if (item.children) loop(item.children)
            })
          }
          loop(res)
          _this.tableData = res
        })
        .finally(() => {
          _this.loading = false
        })
    },
    // 管理晋升路线
    promotionRoute(row) {
      this.$router.push({
        path: '/studyMap/managementPromotionRoute',
        query: { positionId: row.positionId, name: row.name, parentId: row.parentId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.postPromotion {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
}
</style>
