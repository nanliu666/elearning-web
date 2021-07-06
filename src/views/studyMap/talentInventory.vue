<template>
  <div class="talentInventory">
    <!-- 面包屑 -->
    <page-header title="能力匹配度">
    </page-header>
    <basic-container block>
      <!-- 筛选 -->
      <div class="screening">
        <el-input
          v-model="nickname"
          placeholder="请输入用户名称"
          suffix-icon="el-icon-search"
          style="width: 260px"
          @input="search"
        >
        </el-input>
      </div>
      <el-row
        :gutter="20"
        style="margin-top: 20px"
      >
        <!-- 左侧岗位列表 -->
        <el-col :span="4">
          <div
            v-loading="treeLoading"
            class="tree-container"
          >
            <div class="hearder-title">
              岗位名称
            </div>
            <div class="tree-box">
              <el-tree
                ref="jobsTree"
                :data="jobsTreeData"
                node-key="id"
                :expand-on-click-node="false"
                :highlight-current="true"
                :check-strictly="true"
                :default-expand-all="true"
                :props="{
                  children: 'children',
                  label: 'name',
                  disabled: 'disabled'
                }"
                @node-click="treeNode"
              >
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <!-- 数据表格 -->
          <el-table
            ref="mutilTable"
            :key="Math.random()"
            v-loading="loading"
            class="mutilTable"
            :data="tableData"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column
              label="姓名"
              prop="nickname"
              show-overflow-tooltip
              fixed="left"
            >
            </el-table-column>
            <el-table-column
              label="用户编号"
              prop="usercode"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="岗位晋升路线"
              prop="fullUserRoute"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="当前岗位学习状态"
              prop="status"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ studyStatusTemp[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-p="TALENTINVENTORY_LEARNINGSITUATION"
                  type="text"
                  @click="learningSituation(scope.row)"
                >
                  学习情况
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="page">
            <el-pagination
              :current-page="pageConfig.current"
              :page-sizes="pageConfig.pageSizes"
              :page-size="pageConfig.pageSize"
              :layout="pageConfig.layou"
              :total="pageConfig.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { TALENTINVENTORY_LEARNINGSITUATION } from '@/const/privileges'
import { getInventoryList } from '@/api/studyMap/studyMap'
import { queryStation } from '@/api/system/station'
export default {
  name: 'TalentInventory',
  data() {
    return {
      pageConfig: {
        current: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        layou: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      nickname: '',
      loading: false,
      treeLoading: false,
      jobsTreeData: [],
      tableData: [],
      studyStatusTemp: {
        0: '未开始',
        1: '进行中',
        2: '未完成',
        3: '已完成'
      },
      positionId: '' // 岗位ID
    }
  },
  computed: {
    TALENTINVENTORY_LEARNINGSITUATION: () => TALENTINVENTORY_LEARNINGSITUATION
  },
  activated() {
    this.initInventoryList()
    this.initJobsList()
  },
  methods: {
    //   分页筛选
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initInventoryList()
    },
    handleCurrentChange(val) {
      this.pageConfig.current = val
      this.initInventoryList()
    },
    // 筛选
    search: _.debounce(function(value) {
      this.nickname = value
      this.pageConfig.current = 1
      this.positionId = ''
      this.initInventoryList()
    }, 500),
    async initJobsList() {
      let _this = this
      _this.treeLoading = true
      await queryStation()
        .then(async (res) => {
          _this.jobsTreeData = res
        })
        .finally(() => {
          _this.treeLoading = false
        })
    },
    // 学习情况
    learningSituation(row) {
      this.$router.push({ path: '/studyMap/learningSituation', query: { userId: row.userId } })
    },
    // 初始化盘点人才列表
    async initInventoryList() {
      let _this = this
      _this.loading = true
      let params = {
        pageSize: _this.pageConfig.pageSize,
        pageNo: _this.pageConfig.current,
        positionId: _this.positionId,
        search: _this.nickname
      }
      await getInventoryList(params)
        .then((res) => {
          _this.tableData = res.data
          _this.pageConfig.total = res.totalNum
          _this.tableData.forEach((v) => {
            v.fullUserRoute = v.fullUserRoute.replace(/,/, '——')
          })
        })
        .finally(() => {
          _this.loading = false
        })
    },
    // 点击树节点时触发
    treeNode(data) {
      this.pageConfig.current = 1
      this.positionId = data.id
      this.initInventoryList()
    }
  }
}
</script>

<style lang="scss" scoped>
.talentInventory {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  .tree-container {
    height: 600px;
    .hearder-title {
      line-height: 42px;
      width: 100%;
      background: #f7f8fa;
      color: #a1a7ae;
      text-align: center;
      border-bottom: 1px solid #ebeef5;
    }
    .tree-box {
      overflow-y: scroll;
      height: calc(100% - 42px);
    }
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
