<template>
  <div class="abilityManage">
    <el-dialog
      :visible="visible"
      width="800px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <!-- 头部插槽 -->
      <div
        slot="title"
        class="dialogTitle"
      >
        管理能力
        <el-tooltip
          effect="dark"
          content="建议每个岗位添加3-10个能力，每个能力仅能选择一个等级"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-divider></el-divider>
      </div>
      <!-- 主体内容 -->
      <div class="main-container">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-input
            v-model="abilityName"
            placeholder="输入能力名称搜索"
            suffix-icon="el-icon-search"
            style="width: 260px"
            @input="search"
          >
          </el-input>
          <el-button
            type="text"
            @click="clearChoice"
          >
            清空选择
          </el-button>
        </el-row>
        <!-- 数据表格 -->
        <el-table
          ref="mutilTable"
          v-loading="loading"
          :data="tableData"
          style="margin-top: 20px"
          default-expand-all
          max-height="500"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-radio-group v-model="levelTemp[props.row.id]">
                <el-radio
                  v-for="(item, index) in props.row.abilityLevel"
                  :key="index"
                  :label="item.id"
                  @click.native.prevent="cancelRadio(props.row.id, item.id)"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="margin-top: -35px"
                  >
                    <el-col
                      :span="9"
                      :offset="1"
                    >
                      <template v-if="item.levelName.length < 14">
                        {{ item.levelName }}
                      </template>
                      <template v-else>
                        <el-tooltip
                          effect="dark"
                          :content="item.levelName"
                          placement="top"
                        >
                          <span>{{ item.levelName.slice(0, 14) + '...' }}</span>
                        </el-tooltip>
                      </template>
                    </el-col>
                    <el-col :span="14">
                      <template v-if="item.levelDesc.length < 29">
                        {{ item.levelDesc }}
                      </template>
                      <template v-else>
                        <el-tooltip
                          effect="dark"
                          :content="item.levelDesc"
                          placement="top"
                        >
                          <span>{{ item.levelDesc.slice(0, 29) + '...' }}</span>
                        </el-tooltip>
                      </template>
                    </el-col>
                  </el-row>
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            label="能力等级名称"
            prop="abilityName"
            show-overflow-tooltip
            width="265"
          >
          </el-table-column>
          <el-table-column
            label="能力描述"
            prop="abilityDesc"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
      <!-- 底部插槽 -->
      <div slot="footer">
        <el-divider></el-divider>
        <el-button
          size="medium"
          @click="handleClose"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          :loading="comfirmLoading"
          @click="handleConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAbility, addPositionAbility } from '@/api/studyMap/studyMap'
export default {
  name: 'AbilityManage',
  data() {
    return {
      visible: false,
      abilityName: '',
      loading: false,
      comfirmLoading: false,
      tableData: [],
      levelTemp: {}, // 单选绑定的值
      positionId: '' // 岗位id
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.visible = false
      Object.keys(this.levelTemp).forEach((key) => {
        this.levelTemp[key] = ''
      })
    },
    // 筛选
    search: _.debounce(function(value) {
      this.abilityName = value
      this.getAbilityTemp()
    }, 500),
    // 获取能力词典列表
    async getAbilityTemp() {
      let _this = this
      let params = {
        abilityName: _this.abilityName,
        pageSize: 9999,
        pageNo: 1
      }
      _this.loading = true
      await queryAbility(params)
        .then((res) => {
          let cloneTemp = {}
          _this.tableData = res.data
          _this.tableData.map((v) => {
            cloneTemp[v.id] = ''
          })
          _this.levelTemp = cloneTemp
        })
        .finally(() => {
          _this.loading = false
        })
    },
    //   等级信息回填
    backfill(abilityLevelModels) {
      if (!abilityLevelModels || !abilityLevelModels.length) return
      abilityLevelModels.map((v) => {
        this.levelTemp[v.abilityId] = v.abilityLevelId
      })
    },
    // 单选取消选中
    cancelRadio(abilityId, levelId) {
      let total = 0
      levelId === this.levelTemp[abilityId]
        ? (this.levelTemp[abilityId] = '')
        : (this.levelTemp[abilityId] = levelId)
      // 判断勾选是否超过了10个
      for (let key in this.levelTemp) {
        if (this.levelTemp[key]) total++
      }
      if (total > 10) {
        this.$message.warning('您添加的能力等级不能超过10个!')
        this.levelTemp[abilityId] = ''
      }
    },
    // 清空选择
    clearChoice() {
      this.$confirm('您确认要清空所有选择吗？', '确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Object.keys(this.levelTemp).forEach((key) => {
          this.levelTemp[key] = ''
        })
      })
    },
    // 确定按钮
    async handleConfirm() {
      let _this = this,
        abilityLevelModels = []
      _this.comfirmLoading = true
      // 遍历拿到选中的值的长度，组装数据提交
      Object.keys(_this.levelTemp).forEach((key) => {
        if (_this.levelTemp[key]) {
          abilityLevelModels.push({
            abilityId: key,
            abilityLevelId: _this.levelTemp[key]
          })
        }
      })
      //  符合条件提交数据
      let params = {
        positionId: _this.positionId,
        abilityLevelModels: abilityLevelModels
      }
      await addPositionAbility(params)
        .then(() => {
          _this.$message.success('添加成功!')
          _this.$emit('addAbility')
          _this.getAbilityTemp()
        })
        .finally(() => {
          _this.comfirmLoading = false
          _this.handleClose()
        })
    }
  },
  mounted() {
    this.getAbilityTemp()
  }
}
</script>
<style lang="scss" scoped>
.abilityManage {
  .dialogTitle {
    font-size: 20px;
  }
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  /deep/ .el-table__expanded-cell {
    padding: 10px 50px;
  }
  /deep/ .el-radio-group {
    width: 100%;
    .el-radio {
      display: block;
      line-height: 35px;
      margin-right: 0;
    }
  }
}
</style>
