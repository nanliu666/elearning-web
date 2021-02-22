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
        <div class="title">
          统计汇总
        </div>
        <el-date-picker
          disabled
          class="date-picker"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>

      <div class="data-wrapper">
        <ul class="data-list">
          <li class="data-item">
            <div class="desc">
              观看次数
              <el-popover
                transition="none"
                title="数据统计"
                trigger="click"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="cursor: pointer;"
                ></i>
                <template slot>
                  <div>
                    <span>数据来自第三方直播统计后台</span><br /><br />
                    <span>观看次数：播放器刷新一次算一次访问，是真实数据。</span><br /><br />
                    <span>观看人数：观看人数为观众IP地址去重后的统计结果。</span><br /><br />
                    <span>导出数据：导出所选日期及规则的详细数据（可以按照第三方直播导出详细的数据，比列表更全）。</span><br /><br />
                    <span>排序：进入时间由近及远。</span>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="data">
              {{ data.pcTimes + data.mobileTimes }}<span class="unit">次</span>
            </div>
            <div class="intro">
              <span
                class="intro-item"
              >PC端 <span class="count">{{ data.pcTimes }}</span></span>
              <span
                class="intro-item"
              >移动端 <span class="count">{{ data.mobileTimes }}</span></span>
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              观看时长
            </div>
            <div class="data">
              {{ data.pcDuration + data.mobileDuration }}<span class="unit">分钟</span>
            </div>
            <div class="intro">
              <span
                class="intro-item"
              >PC端 <span class="count">{{ data.pcDuration }}</span></span>
              <span
                class="intro-item"
              >移动端 <span class="count">{{ data.mobileDuration }}</span></span>
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              观看人数
              <el-popover
                transition="none"
                title="数据统计"
                trigger="click"
              >
                <i
                  slot="reference"
                  class="el-icon-question"
                  style="cursor: pointer;"
                ></i>
                <template slot>
                  <div>
                    <span>数据来自第三方直播统计后台</span><br /><br />
                    <span>观看次数：播放器刷新一次算一次访问，是真实数据。</span><br /><br />
                    <span>观看人数：观看人数为观众IP地址去重后的统计结果。</span><br /><br />
                    <span>导出数据：导出所选日期及规则的详细数据（可以按照第三方直播导出详细的数据，比列表更全）。</span><br /><br />
                    <span>排序：进入时间由近及远。</span>
                  </div>
                </template>
              </el-popover>
            </div>
            <div class="data">
              {{ data.pcViews + data.mobileViews }}<span class="unit">人</span>
            </div>
            <div class="intro">
              <span
                class="intro-item"
              >PC端 <span class="count">{{ data.pcViews }}</span></span>
              <span
                class="intro-item"
              >移动端 <span class="count">{{ data.mobileViews }}</span></span>
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              人均观看时长
            </div>
            <div class="data">
              {{ data.pcAveDuration + data.mobileAveDuration }}<span class="unit">分钟</span>
            </div>
            <div class="intro">
              <span
                class="intro-item"
              >PC端 <span class="count">{{ data.pcAveDuration }}</span></span>
              <span
                class="intro-item"
              >移动端 <span class="count">{{ data.mobileAveDuration }}</span></span>
            </div>
          </li>
          <li class="data-item">
            <div class="desc">
              人均观看次数
            </div>
            <div class="data">
              {{ data.pcAveTimes + data.mobileAveTimes }}<span class="unit">次</span>
            </div>
            <div class="intro">
              <span
                class="intro-item"
              >PC端 <span class="count">{{ data.pcAveTimes }}</span></span>
              <span
                class="intro-item"
              >移动端 <span class="count">{{ data.mobileAveTimes }}</span></span>
            </div>
          </li>
        </ul>
      </div>

      <div class="table-container">
        <div class="table-header">
          <div class="title">
            数据统计
          </div>

          <div class="operate-area">
            <el-checkbox
              v-model="getData2params.isMerge"
              v-p="CONCAT_LIVE_START"
              class="checkbox"
            >
              合并同一用户
            </el-checkbox>
            <el-date-picker
              v-model="getData2Date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <div
              class="export-btn"
              @click="handleDownload"
            >
              <i class="iconimage_icon_export iconfont"></i>
              导出数据
            </div>
          </div>
        </div>

        <el-table
          v-loading="tableLoading"
          :data="tableData"
          height="50vh"
        >
          <el-table-column
            align="center"
            prop="userName"
            label="用户名称"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="viewDuration"
            label="观看时长"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="startDate"
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
            prop="district"
            label="地区"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="city"
            label="城市"
          >
          </el-table-column>
        </el-table>
      </div>

      <div class="page-container">
        <pagination
          :total="total"
          :page="getData2params.pageNo"
          :limit="getData2params.pageSize"
          @pagination="pagination"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/util/util'
import Pagination from '@/components/common-pagination'
import { getSummary, getAudience } from '@/api/live'
import { CONCAT_LIVE_START } from '@/const/privileges'

export default {
  name: 'LiveStatDetail',
  components: {
    Pagination
  },
  data() {
    return {
      checked: false,
      tableData: [],
      filename: '直播数据统计',
      autoWidth: true,
      bookType: 'xlsx',
      downloadLoading: false,
      tableLoading: true,
      total: 0,
      data: {
        pcTimes: 0,
        pcDuration: 0,
        pcViews: 0,
        pcAveTimes: 0,
        pcAveDuration: 0,
        mobileTimes: 0,
        mobileDuration: 0,
        mobileViews: 0,
        mobileAveTimes: 0,
        mobileAveDuration: 0
      },
      getData2params: {
        livePlanId: '',
        startDate: '',
        endDate: '',
        isMerge: false,
        pageNo: 1,
        pageSize: 10
      },
      getData2Date: ''
    }
  },
  computed: {
    CONCAT_LIVE_START: () => CONCAT_LIVE_START
  },
  watch: {
    getData2Date(val) {
      const [startDate = '', endDate = ''] = val || []
      this.getData2params.startDate = startDate
      this.getData2params.endDate = endDate
    },
    getData2params: {
      handler() {
        this.getTableData()
      },
      deep: true
    }
  },

  activated() {
    this.getData2params.livePlanId = this.$route.query.liveId
    this.getData()
  },
  methods: {
    getData() {
      this.getSummary()
      this.getTableData()
    },
    getSummary() {
      getSummary({ livePlanId: this.$route.query.liveId }).then((res) => {
        Object.keys(res).forEach((key) => {
          this.data[key] = +res[key]
        })
      })
    },
    getTableData() {
      this.tableLoading = true
      getAudience(this.getData2params)
        .then((res) => {
          this.tableData = res.data
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['用户名称', '观看时长', '进入时间', '离开时间', '地区', '城市']
        const filterVal = ['userName', 'viewDuration', 'startDate', 'leaveDate', 'district', 'city']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'startDate' || j == 'leaveDate') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    pagination({ page, limit }) {
      this.getData2params.pageNo = page
      this.getData2params.pageSize = limit
      this.getTableData()
    }
  }
}
</script>

<style lang="scss">
.stat-detail .el-date-editor .el-range__close-icon {
  line-height: 28px;
}
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
      margin-bottom: 40px;
      .title {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 600;
      }
      .date-picker {
      }
    }
    .data-wrapper {
      margin-top: 20px;
      .data-list {
        display: flex;
        .data-item {
          cursor: default;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex: 1;
          height: 80px;
          &:not(:last-child) {
            border-right: 1px solid #ebeced;
          }
          .desc {
            opacity: 0.45;
            font-size: 14px;
            color: #000b15;
            margin-bottom: 8px;
          }
          .data {
            font-size: 28px;
            color: rgba(0, 11, 21, 0.85);
            margin-bottom: 16px;
            .unit {
              font-size: 12px;
              color: rgba(0, 11, 21, 0.45);
              margin-left: 6px;
            }
          }
          .intro {
            .intro-item {
              font-size: 12px;
              color: rgba(0, 11, 21, 0.45);
              font-weight: 600;
              &:first-child {
                margin-right: 40px;
              }
              .count {
                display: inline-block;
                vertical-align: bottom;
                max-width: 80px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 12px;
                color: rgba(0, 11, 21, 0.85);
              }
            }
          }
        }
      }
    }

    .table-container {
      margin-top: 64px;
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
