<template>
  <div class="editAbility">
    <!-- 面包屑 -->
    <page-header
      :title="abilityId ? '编辑能力' : '创建能力'"
      show-back
      :back="goBack"
    />
    <!-- 表单卡片 -->
    <basic-container
      v-loading="loading"
      block
    >
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="20"
          :lg="20"
          :md="22"
          :sm="22"
          :xs="22"
        >
          <common-form
            ref="form"
            :model="form"
            :columns="formColumns"
          >
            <template slot="title">
              <h3>能力基础信息</h3>
            </template>
            <template slot="abilityName">
              <div
                slot="label"
                class="form-label"
                style="display: inline-block; width: calc(100% - 10px); margin-left: 10px"
              >
                能力名称
                <span
                  style="margin-left: 10px; font-size: 12px; opacity: 0.5"
                >建议只填写能力名称，不需要带等级，例如：沟通能力，管理能力</span>
              </div>
              <el-input
                v-model="form.abilityName"
                placeholder="请输入能力名称"
                maxlength="32"
                show-word-limit
              ></el-input>
            </template>
            <template slot="abilityGrade">
              <el-row
                type="flex"
                justify="end"
              >
                <div class="abilityGrade">
                  <el-row
                    type="flex"
                    class="row-bg"
                  >
                    <el-col :span="3">
                      <i
                        class="el-icon-warning"
                        style="font-size: 22px; color: #f3ca7e"
                      ></i>
                    </el-col>
                    <el-col :span="21">
                      <el-row>
                        <el-col style="font-size: 16px">
                          能力等级展示示例
                        </el-col>
                        <el-col style="margin-top: 15px">
                          能力名称：沟通能力
                        </el-col>
                        <el-col>等级名称：初级</el-col>
                        <el-col>展示预览：沟通能力（初级）</el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-row>
            </template>
            <template slot="abilityLevel">
              <div
                slot="label"
                class="form-label"
                style="display: inline-block; width: calc(100% - 10px); margin-left: 10px"
              >
                <el-row
                  type="flex"
                  justify="space-between"
                >
                  <div>
                    能力等级<span
                      style="margin-left: 10px; font-size: 12px; opacity: 0.5"
                    >按照从低到高的等级添加，序号1为最低级，序号5为最高级</span>
                  </div>
                  <el-button
                    type="text"
                    :disabled="form.abilityLevel.length >= 5"
                    @click="addLevel"
                  >
                    添加等级
                  </el-button>
                </el-row>
                <el-divider></el-divider>
              </div>
              <!-- 能力等级表格 -->
              <div class="container-table">
                <el-table
                  v-if="form.abilityLevel.length"
                  ref="mutilTable"
                  :data="form.abilityLevel"
                  style="margin-top: 20px"
                >
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-table
                        ref="expandTable"
                        row-key="id"
                        :data="props.row.abilityLevelRoute"
                        :show-header="false"
                        class="inside-table"
                      >
                        <el-table-column
                          prop="routeName"
                          show-overflow-tooltip
                        >
                          <template slot-scope="scope">
                            【{{ associatedObj[scope.row.routeType] }}】{{ scope.row.routeName }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="levelDesc"
                          show-overflow-tooltip
                        >
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          width="200"
                          align="right"
                        >
                          <template slot-scope="scope">
                            <el-button
                              type="text"
                              @click="deleteLearningPath(scope.row, props.$index)"
                            >
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                  >
                  </el-table-column>
                  <el-table-column
                    label="等级名称"
                    prop="levelName"
                  >
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="200"
                    align="right"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="addingLearningApproaches(scope.row)"
                      >
                        添加学习途径
                      </el-button>
                      <el-button
                        type="text"
                        @click="editAbility(scope.row)"
                      >
                        编辑
                      </el-button>
                      <el-button
                        type="text"
                        @click="deleteAbility(scope.row, scope.$index)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-else
                  class="empty-block"
                >
                  <img
                    src="@/assets/images/nodata.png"
                    class="empty-img"
                  />
                  <div class="nodata">
                    您还未添加等级
                  </div>
                </div>
              </div>
            </template>
          </common-form>
        </el-col>
      </el-row>
      <!-- 底部按钮 -->
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="20"
          :lg="20"
          :md="22"
          :sm="22"
          :xs="22"
        >
          <template v-if="!abilityId">
            <el-button
              type="primary"
              size="medium"
              @click="handerConfirm(true)"
            >
              完成
            </el-button>
            <el-button
              size="medium"
              @click="handerConfirm(false)"
            >
              完成并继续创建
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="medium"
              @click="handerConfirm('edit')"
            >
              确定
            </el-button>
            <el-button
              size="medium"
              @click="goBack"
            >
              取消
            </el-button>
          </template>
        </el-col>
      </el-row>
    </basic-container>
    <!-- 添加等级 -->
    <add-level
      ref="addLevel"
      :ability-level="form.abilityLevel"
      @levelForm="levelForm(arguments)"
    ></add-level>
    <!-- 添加学习路径 -->
    <learning-approaches
      ref="learningPath"
      @levelRouter="levelRouter(arguments)"
    ></learning-approaches>
  </div>
</template>

<script>
import addLevel from './components/addLevel'
import learningApproaches from './components/learningApproaches'
import {
  addAbility,
  queryAbilityById,
  updateAbility,
  deleteAbilityLevel,
  deleteAbilityLevelRoute
} from '@/api/studyMap/studyMap'
export default {
  name: 'EditAbility',
  components: {
    addLevel,
    learningApproaches
  },
  data() {
    return {
      form: {
        abilityName: '',
        abilityDesc: '',
        abilityLevel: []
      },
      formColumns: [
        {
          prop: 'title',
          label: '',
          itemType: 'slotout',
          span: 24
        },
        {
          itemType: 'slot',
          prop: 'abilityName',
          label: '',
          span: 12,
          rules: [
            { required: true, message: '请输入能力名称', trigger: 'blur' },
            { min: 1, max: 32, message: '能力名称不能超过32个字符', trigger: 'blur' }
          ]
        },
        {
          prop: 'abilityGrade',
          itemType: 'slotout',
          span: 12
        },
        {
          itemType: 'input',
          type: 'textarea',
          prop: 'abilityDesc',
          label: '能力描述',
          span: 24,
          maxlength: 200,
          showWordLimit: true,
          autosize: { minRows: 4 },
          required: true
        },
        {
          prop: 'abilityLevel',
          itemType: 'slot',
          label: '',
          span: 24,
          rules: [{ required: true, message: '请添加能力等级', trigger: ['blur', 'change'] }]
        }
      ],
      associatedObj: {
        1: '课程',
        2: '考试',
        3: '培训',
        4: '直播',
        5: '能力提升材料'
      },
      loading: false,
      abilityId: '', // 能力id
      abilityLevelIds: [], // 需要删除的能力等级ID
      abilityLevelRouteIds: [] // 需要删除的学习途径ID
    }
  },
  watch: {
    $route: {
      handler() {
        this.abilityId = this.$route.query.abilityId
        if (this.abilityId) {
          this.queryAbilityById()
        }
      },
      immediate: true,
      deep: true
    }
  },
  activated() {
    this.$refs.form.resetFields()
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    // 根据id获取能力信息
    async queryAbilityById() {
      this.loading = true
      await queryAbilityById({ id: this.abilityId })
        .then((res) => {
          this.form = res[0]
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 添加等级
    addLevel() {
      this.$refs.addLevel.visible = true
    },
    // 获取等级
    levelForm(e) {
      // e[1]有值时是编辑，为false是新增
      if (e[1]) {
        this.form.abilityLevel.forEach((v) => {
          if (v.id == e[1]) {
            v.levelName = e[0].levelName
            v.levelDesc = e[0].levelDesc
          }
        })
      } else {
        this.form.abilityLevel.push(Object.assign(e[0], { abilityLevelRoute: [], abilityId: '' }))
      }
      this.$refs.form.clearValidate('abilityLevel')
    },
    // 添加学习路径
    addingLearningApproaches(row) {
      if (row.abilityLevelRoute.length >= 30) {
        this.$message.warning('您已经添加了30条学习途径，不能再继续添加')
        return
      }
      this.$refs.learningPath.fatherData = row.abilityLevelRoute
      this.$refs.learningPath.levelId = { id: row.id, len: row.abilityLevelRoute.length }
      this.$refs.learningPath.visible = true
    },
    levelRouter(e) {
      this.$nextTick(() => {
        let row = {}
        this.form.abilityLevel.forEach((v) => {
          if (v.id == e[1]) {
            row = v
            v.abilityLevelRoute = [...v.abilityLevelRoute, ...e[0]]
          }
        })
        // this.form.abilityLevel = this.form.abilityLevel.slice(0)
        this.$refs.mutilTable.toggleRowExpansion(row, false)
        this.$refs.mutilTable.toggleRowExpansion(row, true)
      })
    },
    // 编辑能力等级
    editAbility(row) {
      this.$refs.addLevel.form = JSON.parse(JSON.stringify(row))
      this.$refs.addLevel.visible = true
    },
    // 删除能力等级
    deleteAbility(row, index) {
      let tip = `${
        row.abilityLevelRoute && row.abilityLevelRoute.length ? '其包含的学习途径也会被删除，' : ''
      }您确定要删除该项能力等级吗？`
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //   如果存在abilityId，则把id放进abilityLevelIds
        if (row.abilityId) this.abilityLevelIds.push(row.id)
        this.form.abilityLevel.splice(index, 1)
      })
    },
    // 删除学习途径
    deleteLearningPath(row, id) {
      this.$confirm('您确定要删除该项学习途径吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //   如果存在abilityLevelId，则把id放进abilityLevelRouteIds
        if (row.abilityLevelId) this.abilityLevelRouteIds.push(row.id)
        for (let i = 0; i < this.form.abilityLevel[id].abilityLevelRoute.length; i++) {
          if (this.form.abilityLevel[id].abilityLevelRoute[i].bizId == row.bizId)
            this.form.abilityLevel[id].abilityLevelRoute.splice(i, 1)
        }
      })
    },
    // 完成
    handerConfirm: _.debounce(function(flag) {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        // 一个能力等级至少添加一个学习途径
        if (this.form.abilityLevel.length == 1) {
          if (!this.form.abilityLevel[0].abilityLevelRoute.length) {
            this.$message.warning('请给该能力等级至少添加一个学习途径')
            return
          }
        } else {
          for (let i = 0; i < this.form.abilityLevel.length; i++) {
            if (!this.form.abilityLevel[i].abilityLevelRoute.length) {
              this.$message.warning('请给每项能力等级至少添加一个学习途径')
              return
            }
          }
        }
        let data = JSON.parse(JSON.stringify(this.form))
        // 判断是新增还是编辑
        if (flag == 'edit') {
          // 判断编辑的时候是否删除了能力等级
          if (this.abilityLevelIds.length) {
            await deleteAbilityLevel({ abilityLevelIds: this.abilityLevelIds.join(',') })
          }
          // 判断是否删除了学习途径
          if (this.abilityLevelRouteIds.length) {
            await deleteAbilityLevelRoute({
              abilityLevelRouteIds: this.abilityLevelRouteIds.join(',')
            })
          }
          data.abilityLevel.forEach((v, i) => {
            if (Object.prototype.toString.call(v.id) === '[object Number]') {
              v.id = ''
            }
            v.sort = i + 1
            v.abilityLevelRoute.forEach((o, j) => {
              o.sort = j + 1
            })
          })
          this.loading = true
          await updateAbility(data)
            .then(() => {
              this.$message.success('更新信息成功!')
              this.goBack()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          // 增加排序，1开始
          data.abilityLevel.forEach((v, i) => {
            delete v.id
            v.sort = i + 1
            v.abilityLevelRoute.forEach((o, j) => {
              o.sort = j + 1
            })
          })
          this.loading = true
          await addAbility(data)
            .then(() => {
              this.$refs.form.resetFields()
              this.$message.success('新增成功!')
              if (flag) {
                this.goBack()
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.editAbility {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 170px);
    min-height: calc(100% - 170px);
  }
  /deep/ .el-table__expanded-cell {
    padding: 0;
  }
  /deep/ .inside-table tr:last-child td {
    border-bottom: none;
  }
  /deep/ .inside-table td:first-child {
    padding-left: 100px;
  }
  /deep/ .inside-table tr td .cell {
    padding-left: 10px;
  }
  .el-form {
    /deep/ .el-col:nth-child(2) .el-form-item .el-form-item__content,
    /deep/ .el-col:nth-child(5) .el-form-item .el-form-item__content {
      margin-top: -35px;
    }
  }
  .abilityGrade {
    width: 250px;
    height: 110px;
    padding: 12px;
    background: rgba(242, 242, 242, 1);
    /deep/ .el-col {
      margin-bottom: 0;
      font-size: 12px;
    }
  }
  .el-divider--horizontal {
    margin-top: 0 !important;
  }
  .empty-block {
    text-align: center;
    .empty-img {
      width: 100px;
    }
  }
  //   .form-label::before {
  //     content: '*';
  //     color: #f56c6c;
  //     margin-right: 4px;
  //   }
}
</style>
