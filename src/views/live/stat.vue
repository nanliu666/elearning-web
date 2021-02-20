<template>
  <div class="live-stat">
    <page-header title="数据统计"></page-header>
    <div class="body">
      <div class="filter-container">
        <div class="tab-buttons">
          <span
            class="button"
            :class="{ active: currentTable === 'live' }"
            @click="currentTable = 'live'"
          >按直播查看</span>
          <span
            class="button"
            :class="{ active: currentTable === 'person' }"
            @click="currentTable = 'person'"
          >按人员查看</span>
        </div>

        <div class="operate-wrapper">
          <div class="operate-left">
            <div class="input-wrapper">
              <el-input
                v-model="filterForm[currentTable].titleOrNo"
                :disabled="loading[currentTable]"
                clearable
                size="medium"
                :placeholder="
                  currentTable === 'live' ? '输入直播标题或编号搜索' : '输入用户名称搜索'
                "
              ></el-input>
            </div>

            <el-popover
              v-model="filterFormVisible"
              placement="bottom"
              width="725"
              transition="false"
            >
              <el-form
                v-if="currentTable === 'live'"
                label-position="left"
                :inline="true"
                :model="filterForm[currentTable]"
                class="filter-form"
                label-width="80px"
                style="padding: 24px;"
              >
                <el-form-item label="所属分类">
                  <el-cascader
                    v-model="filterForm[currentTable].categoryId"
                    style="width: 202px;"
                    placeholder="请选择所属分类"
                    :options="categoryData"
                    :props="{ checkStrictly: true, label: 'name', value: 'idStr' }"
                    clearable
                  ></el-cascader>
                </el-form-item>

                <el-form-item label="创建人">
                  <el-input
                    v-model="filterForm[currentTable].creatorId"
                    clearable
                    style="width: 202px;"
                    placeholder="请输入创建人"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select
                    v-model="filterForm[currentTable].isUsed"
                    clearable
                    placeholder="请选择状态"
                  >
                    <el-option
                      label="正常"
                      value="1"
                    ></el-option>
                    <el-option
                      label="停用"
                      value="0"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div style="text-align: right; margin-right: 75px;">
                  <el-button
                    type="primary"
                    size="medium"
                    :disabled="loading[currentTable]"
                    @click.native="resetPageAndGetList"
                  >
                    搜索
                  </el-button>
                  <el-button
                    size="medium"
                    @click="
                      filterForm[currentTable] = {
                        ...initForm[currentTable],
                        titleOrNo: filterForm[currentTable].titleOrNo
                      }
                    "
                  >
                    重置
                  </el-button>
                </div>
              </el-form>

              <el-form
                v-else
                label-position="left"
                :inline="true"
                :model="filterForm[currentTable]"
                class="filter-form"
                label-width="80px"
                style="padding: 24px;"
              >
                <el-form-item label="所属部门">
                  <el-cascader
                    v-model="filterForm[currentTable].orgId"
                    :options="orgData"
                    :props="{ checkStrictly: true, label: 'orgName', value: 'orgId' }"
                    clearable
                  ></el-cascader>
                </el-form-item>

                <div style="text-align: right; margin-right: 75px;">
                  <el-button
                    type="primary"
                    size="medium"
                    :disabled="loading[currentTable]"
                    @click.native="resetPageAndGetList"
                  >
                    搜索
                  </el-button>
                  <el-button
                    size="medium"
                    @click="
                      filterForm[currentTable] = {
                        ...initForm[currentTable],
                        titleOrNo: filterForm[currentTable].titleOrNo
                      }
                    "
                  >
                    重置
                  </el-button>
                </div>
              </el-form>
              <el-button
                slot="reference"
                size="medium"
                icon="icon-basics-filter-outlined"
                :disabled="loading[currentTable]"
              >
                筛选
              </el-button>
            </el-popover>
          </div>

          <div class="operate-right">
            <div class="fresh-wrap">
              <div
                class="fresh-btn"
                :style="{ cursor: loading[currentTable] ? 'not-allowed' : 'pointer' }"
                @click="resetFormAndGetList"
              >
                <i
                  class="el-icon-refresh-right"
                  style="margin-right: 2px;"
                ></i>刷新
              </div>
            </div>
            <el-dropdown
              :hide-on-click="false"
              trigger="click"
            >
              <i class="el-icon-setting set-btn"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(val, key) in columns[currentTable]"
                  :key="key"
                >
                  <el-checkbox v-model="columns[currentTable][key]">
                    {{ key }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="table-container">
        <el-table
          v-show="currentTable === 'live'"
          v-loading="loading[currentTable]"
          :data="data[currentTable]"
          height="60vh"
        >
          <el-table-column
            v-if="columns[currentTable]['直播编号']"
            align="center"
            prop="liveNo"
            label="直播编号"
            :show-overflow-tooltip="true"
            width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['直播名称']"
            align="center"
            prop="channelName"
            :show-overflow-tooltip="true"
            label="直播名称"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['所属分类']"
            align="center"
            prop="categoryName"
            :show-overflow-tooltip="true"
            label="所属分类"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['包含课程']"
            align="center"
            prop="courses"
            :show-overflow-tooltip="true"
            label="包含课程"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['创建人']"
            align="center"
            :show-overflow-tooltip="true"
            prop="creatorName"
            label="创建人"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['状态']"
            align="center"
            prop="isUsed"
            :show-overflow-tooltip="true"
            label="状态"
          >
            <template slot-scope="scope">
              {{ scope.row.isUsed == '1' ? '正常' : '停用' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="toDetail(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-show="currentTable === 'person'"
          v-loading="loading[currentTable]"
          height="60vh"
          :data="data[currentTable]"
        >
          <el-table-column
            v-if="columns[currentTable]['用户编号']"
            align="center"
            prop="workNo"
            label="用户编号"
            :show-overflow-tooltip="true"
            width="180"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['用户名称']"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
            label="用户名称"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['所属部门']"
            align="center"
            prop="orgLinkName"
            :show-overflow-tooltip="true"
            label="所属部门"
          >
          </el-table-column>
          <el-table-column
            v-if="columns[currentTable]['累计时长']"
            align="center"
            prop="viewDuration"
            :show-overflow-tooltip="true"
            label="累计时长"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="operate"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="toDetail(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total[currentTable]"
          :page="filterForm[currentTable].pageNo"
          :limit="filterForm[currentTable].pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import { getLiveList, getAudienceListPerson, getCategoryTree } from '@/api/live'
import { getOrgTree } from '@/api/org/org'
export default {
  name: 'LiveStat',
  components: {
    Pagination
  },
  data() {
    return {
      personData: [],
      currentTable: 'live',
      filterFormVisible: false,
      data: {
        live: [],
        person: []
      },
      columns: {
        live: {
          直播编号: true,
          直播名称: true,
          所属分类: true,
          包含课程: true,
          创建人: true,
          状态: true
        },
        person: { 用户编号: true, 用户名称: true, 所属部门: true, 累计时长: true }
      },
      initForm: {
        live: {
          titleOrNo: '',
          categoryId: '',
          creatorId: '',
          isUsed: '',
          pageNo: 1,
          pageSize: 10
        },
        person: {
          titleOrNo: '',
          orgId: '',
          pageNo: 1,
          pageSize: 10
        }
      },
      filterForm: {
        live: {
          titleOrNo: '',
          categoryId: '',
          creatorId: '',
          isUsed: '',
          pageNo: 1,
          pageSize: 10
        },
        person: {
          titleOrNo: '',
          orgId: '',
          pageNo: 1,
          pageSize: 10
        }
      },
      total: {
        live: 0,
        person: 0
      },
      loading: {
        live: true,
        person: true
      },
      orgData: [],
      categoryData: []
    }
  },
  computed: {
    searchValWatcher() {
      return this.filterForm[this.currentTable].titleOrNo
    }
  },
  watch: {
    searchValWatcher() {
      this.resetPageAndGetList()
    },
    currentTable() {
      this.getList()
    }
  },
  created() {
    this.getList()
    this.getOrgTree()
    this.getCategoryTree()
  },
  methods: {
    getCategoryTree() {
      getCategoryTree({ source: 'live' }).then((res) => {
        this.categoryData = res
      })
    },
    getOrgTree() {
      getOrgTree({ parentOrgId: 0 }).then((res) => {
        this.orgData = res
      })
    },
    pagination({ page, limit }) {
      this.filterForm[this.currentTable].pageNo = page
      this.filterForm[this.currentTable].pageSize = limit
      this.getList()
    },
    toDetail(item) {
      const currentTable = this.currentTable
      const path = currentTable === 'live' ? '/live/live-stat-detail' : '/live/person-stat-detail'
      const query = {}
      Object.keys(item).forEach((key) => {
        query[key] = item[key]
      })
      this.$router.push({
        path,
        query
      })
    },
    resetPageAndGetList() {
      if (this.loading[this.currentTable]) return
      this.filterForm[this.currentTable].pageNo = 1
      this.filterForm[this.currentTable].pageSize = 10
      this.getList()
    },
    resetFormAndGetList() {
      if (this.loading[this.currentTable]) return
      this.filterForm[this.currentTable] = { ...this.initForm[this.currentTable] }
      this.getList()
    },
    getList() {
      this.loading[this.currentTable] = true
      const api = this.currentTable === 'live' ? getLiveList : getAudienceListPerson

      const data = this.filterForm[this.currentTable]

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key] = data[key][0]
        }
      })

      api(data)
        .then((res) => {
          const { data, totalNum } = res
          this.data[this.currentTable] = data
          this.total[this.currentTable] = totalNum
          this.loading[this.currentTable] = false
        })
        .catch(() => {
          this.loading[this.currentTable] = false
        })
    }
  }
}
</script>

<style lang="scss">
.live-stat {
  .operate-wrapper .operate-left .input-wrapper {
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .icon-basics-filter-outlined {
    font-size: 14px;
  }

  .filter-form {
    .el-form-item__label {
      text-align: center;
    }
  }
}
</style>
<style lang="scss" scoped>
.live-stat {
  .body {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 24px;
    .filter-container {
      .tab-buttons {
        margin-bottom: 16px;
        .button {
          cursor: pointer;
          display: inline-block;
          margin-right: 12px;
          &.active {
            color: #409eff;
          }
        }
      }
      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .operate-left {
          display: flex;
          align-items: center;
          .input-wrapper {
            width: 202px;
            margin-right: 10px;
          }
          .filter-btn {
            width: 85px;
          }
        }
        .operate-right {
          display: flex;
          align-items: center;
          height: 36px;
          margin-right: 10px;
          color: #a0a8ae;
          .fresh-wrap {
            padding-right: 10px;
            border-right: 1px solid #a0a8ae;
            .fresh-btn {
              cursor: pointer;
            }
          }
          .set-btn {
            cursor: pointer;
            margin-left: 10px;
            margin-top: 2px;
          }
        }
      }
    }
    .table-container {
    }
  }
}
</style>
