<template>
  <div class="abilityDictionary">
    <!-- 面包屑 -->
    <page-header title="能力词典库">
      <el-button
        slot="rightMenu"
        v-p="ABILITYDICTIONARY_ADD"
        type="primary"
        size="medium"
        @click="createAbility"
      >
        创建能力
      </el-button>
    </page-header>
    <basic-container block>
      <!-- 筛选 -->
      <!-- 多选批量操作 -->
      <div
        v-if="seleteData.length"
        class="seletion"
        style="line-height: 34px"
      >
        已选中{{ seleteData.length }}项<el-divider direction="vertical"></el-divider><el-button
          v-p="ABILITYDICTIONARY_BATCHDELETE"
          type="text"
          style="padding: 0"
          icon="el-icon-delete"
          @click="deleteAbility(false)"
        >
          批量删除
        </el-button>
      </div>
      <div
        v-else
        class="screening"
      >
        <el-input
          v-model="abilityName"
          placeholder="请输入能力名称"
          suffix-icon="el-icon-search"
          style="width: 260px"
          @input="search"
        >
        </el-input>
      </div>
      <!-- 数据表格 -->
      <el-table
        ref="mutilTable"
        v-loading="loading"
        :data="tableData"
        style="margin-top: 20px"
        default-expand-all
        @selection-change="handlerSeletion"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.abilityLevel"
              :show-header="false"
              class="inside-table"
            >
              <el-table-column
                prop="levelName"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="levelDesc"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="50"
        >
        </el-table-column>
        <el-table-column
          label="能力名称"
          prop="abilityName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="能力描述"
          prop="abilityDesc"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-p="ABILITYDICTIONARY_EDIT"
              type="text"
              @click="editAbility(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="ABILITYDICTIONARY_DELETE"
              type="text"
              @click="deleteAbility(scope.row)"
            >
              删除
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
    </basic-container>
  </div>
</template>

<script>
import { queryAbility, deleteAbility, queryAbilityBindPosition } from '@/api/studyMap/studyMap'
import {
  ABILITYDICTIONARY_ADD,
  ABILITYDICTIONARY_EDIT,
  ABILITYDICTIONARY_DELETE,
  ABILITYDICTIONARY_BATCHDELETE
} from '@/const/privileges'
export default {
  name: 'AbilityDictionary',
  data() {
    return {
      pageConfig: {
        current: 1,
        pageSizes: [3, 6, 9, 12],
        pageSize: 3,
        layou: 'total, sizes, prev, pager, next, jumper',
        total: 0
      },
      loading: false,
      tableData: [],
      seleteData: [],
      abilityName: ''
    }
  },
  computed: {
    ABILITYDICTIONARY_ADD: () => ABILITYDICTIONARY_ADD,
    ABILITYDICTIONARY_EDIT: () => ABILITYDICTIONARY_EDIT,
    ABILITYDICTIONARY_DELETE: () => ABILITYDICTIONARY_DELETE,
    ABILITYDICTIONARY_BATCHDELETE: () => ABILITYDICTIONARY_BATCHDELETE
  },
  activated() {
    this.getAbilityTemp()
  },
  methods: {
    //   分页筛选
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.getAbilityTemp()
    },
    handleCurrentChange(val) {
      this.pageConfig.current = val
      this.getAbilityTemp()
    },
    // 获取能力词典列表
    async getAbilityTemp() {
      let _this = this
      let params = {
        abilityName: _this.abilityName,
        pageSize: _this.pageConfig.pageSize,
        pageNo: _this.pageConfig.current
      }
      _this.loading = true
      await queryAbility(params)
        .then((res) => {
          _this.tableData = res.data
          _this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          _this.loading = false
        })
    },
    //   创建能力
    createAbility() {
      this.$router.push({ path: '/studyMap/editAbility' })
    },
    // 编辑能力
    editAbility(row) {
      this.$router.push({
        path: '/studyMap/editAbility',
        query: { abilityId: row.id, tagName: '编辑能力' }
      })
    },
    // 删除能力
    async deleteAbility(row) {
      let _this = this,
        params = {},
        tip = ''
      // 当row是对象时是删除，否则批量删除
      if (!row) {
        let ids = _this.seleteData.map((v) => v.id)
        params = { abilityIds: ids.join(',') }
        tip = '您确定要删除选择的能力及描述吗？'
      } else {
        params = { abilityIds: row.id }
        // 判断能力是否绑定了岗位
        await queryAbilityBindPosition({ abilityId: row.id }).then((res) => {
          // res对应的值 >0 即有绑定岗位
          tip = `${res > 0 ? '该能力已被绑定了岗位，' : ''}您确定要删除该能力及描述吗？`
        })
      }
      _this.$confirm(tip, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            await deleteAbility(params)
              .then(() => {
                this.$message.success('删除成功!')
              })
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
                _this.$refs.mutilTable.clearSelection()
                _this.getAbilityTemp()
              })
          } else {
            done()
          }
        }
      })
    },
    // 多选
    handlerSeletion(seletion) {
      this.seleteData = seletion
    },
    // 筛选
    search: _.debounce(function(value) {
      this.abilityName = value
      this.pageConfig.current = 1
      this.getAbilityTemp()
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
.abilityDictionary {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  /deep/ .el-table__expanded-cell {
    padding: 0;
  }
  /deep/ .inside-table tr:last-child td {
    border-bottom: none;
  }
  /deep/ .inside-table td:first-child {
    padding-left: 98px;
  }
  /deep/ .inside-table tr td .cell {
    padding-left: 10px;
  }
  /deep/.el-tooltip__popper {
    max-width: 30%;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
