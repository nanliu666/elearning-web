<template>
  <div class="competencyModel">
    <!-- 面包屑 -->
    <page-header title="胜任力模型">
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
        lazy
        :load="loadTree"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          label="岗位名称"
          prop="name"
          show-overflow-tooltip
          width="300"
        >
        </el-table-column>
        <el-table-column
          label="能力要求"
          prop="abilityLevelModels"
        >
          <template slot-scope="scope">
            <div class="table-container">
              <i
                v-if="scope.row.abilityLevelModels && scope.row.abilityLevelModels.length > 5"
                class="el-icon-arrow-down toggle-arrow"
                :class="{ 'is-active': toggleData.includes(scope.row.id) }"
                @click="toggleArrow(scope.row.id)"
              ></i>
              <el-collapse-transition>
                <el-row :gutter="14">
                  <div
                    v-for="(item, index) in toggleData.includes(scope.row.id)
                      ? scope.row.abilityLevelModels
                      : scope.row.abilityLevelModels && scope.row.abilityLevelModels.slice(0, 5)"
                    :key="index"
                    class="tag-box"
                  >
                    <el-tag size="medium">
                      {{
                        `${
                          item.abilityName.length > 10
                            ? item.abilityName.slice(0, 10) + '...'
                            : item.abilityName
                        }(${
                          item.levelName.length > 4
                            ? item.levelName.slice(0, 4) + '...'
                            : item.levelName
                        })`
                      }}
                    </el-tag>
                  </div>
                </el-row>
              </el-collapse-transition>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-p="COMPETENCY_MODEL_ABILITYMANAGE"
              type="text"
              @click="handerAbilityManage(scope.row)"
            >
              管理能力
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
    <!-- 管理能力弹窗 -->
    <ability-manage
      ref="abilityManage"
      @addAbility="initJobsList"
    ></ability-manage>
  </div>
</template>

<script>
import { queryStation, getStationChild, positionLevelList } from '@/api/system/station'
import { queryPositionAbility } from '@/api/studyMap/studyMap'
import abilityManage from './components/abilityManage'
import { COMPETENCY_MODEL_ABILITYMANAGE } from '@/const/privileges'
export default {
  name: 'CompetencyModel',
  components: {
    abilityManage
  },
  data() {
    return {
      jobsName: '',
      loading: false,
      tableData: [],
      toggleData: [] // 用来保存展开数据的id
    }
  },
  computed: {
    COMPETENCY_MODEL_ABILITYMANAGE: () => COMPETENCY_MODEL_ABILITYMANAGE
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
      await (_this.jobsName ? queryStation({ name: _this.jobsName }) : positionLevelList()).then(
        async (res) => {
          _this.tableData = res
          //   获取
          let ids = _this.tableData.map((v) => v.id)
          await queryPositionAbility({ ids: ids.join(',') })
            .then((res) => {
              _this.tableData.forEach((v) => {
                for (let i = 0; i < res.length; i++) {
                  if (v.id == res[i].positionId) {
                    v.abilityLevelModels = res[i].abilityLevelModels
                    break
                  }
                }
              })
              _this.tableData = _this.tableData.slice(0)
            })
            .finally(() => {
              _this.loading = false
            })
        }
      )
    },
    // 懒加载
    async loadTree(tree, treeNode, resolve) {
      try {
        let params = {
          parentId: tree.id
        }
        await getStationChild(params).then(async (res) => {
          let result = JSON.parse(JSON.stringify(res)),
            ids = res.map((v) => v.id)
          await queryPositionAbility({ ids: ids.join(',') }).then((res) => {
            result.forEach((v) => {
              for (let i = 0; i < res.length; i++) {
                if (v.id == res[i].positionId) {
                  v.abilityLevelModels = res[i].abilityLevelModels
                  break
                }
              }
            })
          })

          resolve(result)
        })
      } catch (err) {
        resolve([])
      }
    },
    // 展开箭头
    toggleArrow(positionId) {
      if (this.toggleData.includes(positionId)) {
        this.toggleData.splice(this.toggleData.indexOf(positionId), 1)
      } else {
        this.toggleData.push(positionId)
      }
    },
    // 管理能力
    handerAbilityManage(row) {
      this.$refs.abilityManage.positionId = row.id
      this.$refs.abilityManage.backfill(row.abilityLevelModels)
      this.$refs.abilityManage.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.competencyModel {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  .table-container {
    position: relative;
    line-height: 30px;
    padding: 5px 50px 5px 0;
    .toggle-arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      padding: 5px;
      cursor: pointer;
      margin-top: -12px;
      transition: transform 0.5s;
      &.is-active {
        transform: rotate(180deg);
      }
    }
    .tag-box {
      display: inline-block;
      padding: 0 6px;
    }
  }
}
</style>
