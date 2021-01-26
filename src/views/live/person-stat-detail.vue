<template>
  <div class="stat-detail">
    <div class="header">
      <div
        class="back-btn"
        @click="$router.back()"
      >
        <i class="el-icon-arrow-left"></i>
        <div class="text">
          返回统计列表
        </div>
      </div>
    </div>

    <div class="container">
      <div class="container-header">
        <div class="header-list">
          <div class="list">
            <div class="name">
              用户编号：
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="data.workNo"
              placement="top-start"
            >
              <div class="content">
                {{ data.workNo }}
              </div>
            </el-tooltip>
          </div>
          <div class="list">
            <div class="name">
              用户名称：
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="data.name"
              placement="top-start"
            >
              <div class="content">
                {{ data.name }}
              </div>
            </el-tooltip>
          </div>
          <div class="list">
            <div class="name">
              所属部门：
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="data.orgLinkName"
              placement="top-start"
            >
              <div class="content">
                {{ data.orgLinkName }}
              </div>
            </el-tooltip>
          </div>
          <div class="list">
            <div class="name">
              累计时长：
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="data.viewDuration"
              placement="top-start"
            >
              <div class="content">
                {{ data.viewDuration }}
              </div>
            </el-tooltip>
          </div>
        </div>
        <el-date-picker
          v-model="getDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>

      <div class="table-container">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          height="60vh"
        >
          <el-table-column
            align="center"
            prop="channelName"
            label="直播名称"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="liveNo"
            label="直播编号"
          >
          </el-table-column>
          <el-table-column
            prop="startDate"
            align="center"
            label="进入时间"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="leaveDate"
            label="离开时间"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="viewDuration"
            label="累计时长"
          >
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          :page="query.pageNo"
          :limit="query.pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/common-pagination'
import { getAudienceDetail } from '@/api/live'

export default {
  name: 'PersonStatDetail',
  components: {
    Pagination
  },
  data() {
    return {
      loading: true,
      data: {},
      tableData: [],
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        startDate: '',
        endDate: '',
        userId: ''
      },
      getDate: '',
      tableLoading: true
    }
  },
  watch: {
    getDate(val) {
      const [startDate = '', endDate = ''] = val || []
      this.query.startDate = startDate
      this.query.endDate = endDate
    },
    query: {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  activated() {
    this.data = this.$route.query
    this.query.userId = this.data.userId
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      getAudienceDetail(this.query)
        .then((res) => {
          this.tableLoading = false
          const { data, totalNum } = res
          this.tableData = data
          this.total = totalNum
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    pagination({ page, limit }) {
      this.query.pageNo = page
      this.query.pageSize = limit
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.stat-detail .el-date-editor .el-range__icon {
  line-height: 27px;
}

.stat-detail .el-date-editor {
  width: 390px;
}
</style>
<style lang="scss" scoped>
.stat-detail {
  .header {
    .back-btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      width: 130px;
      margin-top: 29px;
      margin-bottom: 20px;
      i {
        font-size: 18px;
        color: #8c9195;
        margin-right: 3px;
        font-weight: 600;
      }
      .text {
        font-size: 17px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 600;
      }
    }
  }
  .container {
    padding: 24px 24px 60px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    margin-bottom: 24px;
    .container-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      .header-list {
        cursor: default;
        display: flex;
        .list {
          display: flex;
          align-items: center;
          &:not(:last-child) {
            margin-right: 80px;
          }
          font-weight: 500;
          font-family: Microsoft YaHei;
          font-size: 14px;
          .name {
            color: rgba(0, 11, 21, 0.45);
            max-width: 70px;
          }
          .content {
            max-width: 150px;
            color: rgba(0, 11, 21, 0.85);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .date-picker {
      }
    }

    .table-container {
      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        .title {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 600;
        }
        .operate-area {
          display: flex;
          align-items: center;
          .checkbox {
            margin-right: 24px;
          }
          .export-btn {
            cursor: pointer;
            margin-left: 24px;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.65);
            .iconimage_icon_export {
              color: rgba(0, 11, 21, 0.65);
            }
          }
        }
      }
    }
  }
}
</style>
