<template>
  <div class="wlGantt">
    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      stripe
      border
      :header-cell-style="{ 'text-align': 'center' }"
      max-height="600"
      @cell-mouse-enter="tableCellEnter"
      @cell-mouse-leave="tableCellLeave"
      @cell-click="tableCellClick"
    >
      <el-table-column
        prop="trainProject"
        label="计划子项"
      >
        <template slot-scope="scope">
          <div
            style="
              padding: 20px 15px;
              word-break: break-all;
              word-wrap: break-word;
              line-height: 24px;
            "
          >
            <el-tag
              v-if="scope.row.planFeature !== 1"
              size="mini"
              :type="scope.row.planFeature === 2 ? 'info' : ''"
            >
              {{ planFeatureTemp[scope.row.planFeature] }}
            </el-tag>
            <span :style="{ marginLeft: scope.row.planFeature !== 1 ? 10 + 'px' : 0 + 'px' }">{{
              scope.row.trainProject
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in 12"
        :key="item"
        :label="item + '月'"
        width="90"
      >
        <template slot-scope="scope">
          <div class="container-box">
            <div
              v-if="
                showWlBg(
                  item,
                  scope.row.trainStart,
                  scope.row.trainEnd,
                  scope.row.status,
                  scope.row.overdueDate,
                  scope.row.year,
                  scope.row.month
                )
              "
              class="wl-gantt-bg"
              :class="{}"
              :style="{
                background: calculatedPercentage(
                  scope.row.status,
                  item,
                  scope.row.trainStart,
                  scope.row.trainEnd,
                  scope.row.numOfDone,
                  scope.row.sessions,
                  scope.row.overdueDate,
                  scope.row.completion,
                  scope.row.month,
                  scope.row.year
                )
              }"
            ></div>
            <div
              v-if="item === scope.row.month && scope.row.year == new Date().getFullYear()"
              class="now-line"
              :style="{ left: scope.row.completion + '%' }"
            >
              <span
                v-if="scope.$index === 0"
                class="triangle"
              ></span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'WlGantt',
  data() {
    return {
      tableData: [],
      legendTemp: {
        1: '#A7D5FA',
        2: '#2875D4',
        3: '#97D681',
        4: '#F5623B',
        5: 'rgba(0,11,21,0.25)'
      },
      planFeatureTemp: {
        0: '新增',
        1: '计划内',
        2: '取消'
      }
    }
  },
  methods: {
    //   overdueDate只有status=3(完成状态时才有)
    showWlBg(item, trainStart, trainEnd, status, overdueDate, year, month) {
      switch (status) {
        case 3: {
          if (overdueDate) {
            return new Date(overdueDate).getMonth() + 1 >= item && trainStart <= item
          } else {
            return trainEnd >= item && trainStart <= item
          }
        }
        case 4: {
          // 判断是否是今年
          if (year == new Date().getFullYear()) {
            return month >= item && trainStart <= item
          } else {
            // 如果没有完成时间则显示到当前日期，否则显示到12月底
            return 12 >= item && trainStart <= item
          }
        }
        default:
          return trainEnd >= item && trainStart <= item
      }
    },
    /**
     * @description: 根据不同状态计算背景色百分比,计划状态 status: 1-未开始,2-进行中,3-已完成,4-超期,5-已取消
     * @param {*} overdue：是否超期,0-否,1-是,overdueDate:超期完成时间
     * @param {*} status:状态
     * @return {*} 返回背景色
     */
    calculatedPercentage(
      status,
      item,
      trainStart,
      trainEnd,
      numOfDone,
      sessions,
      overdueDate,
      completion,
      month,
      year
    ) {
      let bgColor = ''
      switch (status) {
        //   1、4、5状态直接返回背景色
        case 1:
        case 5:
          return this.legendTemp[status]
        //   2状态计算完成度
        case 2: {
          let averagePercentage = (100 / (trainEnd - trainStart + 1)).toFixed(2) // 平均每个月百分比
          let percent = ((numOfDone / sessions) * 100).toFixed(2) // 计算进行中百分比
          let currentMonth = ((percent / averagePercentage) | 0) + trainStart // 计算百分比到哪个月
          let monthPercent =
            (
              ((percent - averagePercentage * (currentMonth - trainStart)) / averagePercentage) *
              100
            ).toFixed(2) + '%'
          if (item > currentMonth) {
            bgColor = this.legendTemp[1]
          } else if (item < currentMonth) {
            bgColor = this.legendTemp[status]
          } else {
            bgColor = `linear-gradient(to right, ${this.legendTemp[status]} ${monthPercent}, ${this.legendTemp[1]} 0%)`
          }
          return bgColor
        }
        //   3完成状态计算
        case 3:
          // 判断是否超期完成还是规定时间内完成
          if (overdueDate) {
            if (trainEnd >= item && trainStart <= item) {
              bgColor = this.legendTemp[status]
            } else if (item < month) {
              bgColor = this.legendTemp[4]
            } else {
              bgColor = `linear-gradient(to right, ${this.legendTemp[4]} ${completion +
                '%'}, transparent 0%)`
            }
            return bgColor
          } else {
            return this.legendTemp[status]
          }
        //   4超期状态
        case 4:
          // 判断是否是今年
          if (year == new Date().getFullYear()) {
            if (item == month) {
              bgColor = `linear-gradient(to right, ${this.legendTemp[status]} ${completion +
                '%'}, transparent 0%)`
            } else {
              bgColor = this.legendTemp[status]
            }
            return bgColor
          } else {
            return this.legendTemp[status]
          }
      }
    },
    tableCellEnter(row, column) {
      if (column.label.indexOf('月') === -1) return
      let element = document.getElementsByClassName(`${column.id}`)
      for (let i = 0; i < element.length; i++) {
        element[i].style.background = '#f0f9ff'
        element[i].style.cursor = 'pointer'
      }
    },
    tableCellLeave(row, column) {
      if (column.label.indexOf('月') === -1) return
      let element = document.getElementsByClassName(`${column.id}`)
      for (let i = 0; i < element.length; i++) {
        element[i].style.background = ''
      }
    },
    // 单元格点击事件
    tableCellClick(row, column) {
      if (column.label.indexOf('月') === -1) return
      this.$emit('tableCell', column.label.replace(/月/g, ''))
    },
    // 处理表格数据
    processingTabular(data) {
      let date = new Date()
      data.forEach((v) => {
        v.completion = (
          (date.getDate() / new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) *
          100
        ).toFixed(2)
        v.month = date.getMonth() + 1
      })
      this.tableData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.wlGantt {
  margin-top: 20px;
  /deep/ .el-table td {
    position: relative;
    line-height: 75px;
  }
  /deep/ .el-table .el-table__body .cell {
    line-height: 75px;
    padding: 0;
  }
  /deep/ .el-table__body tr:hover > td {
    background: none;
  }
  /deep/ .el-table__body tr.el-table__row--striped:hover > td {
    background: #fafafa;
  }
  .wl-gantt-bg {
    position: relative;
    z-index: 2;
    height: 25px;
    width: 100%;
  }
  .now-line {
    position: absolute;
    top: 0;
    background: #f5623b;
    width: 2px;
    height: 100%;
    z-index: 3;
    .triangle {
      top: 0;
      left: -4px;
      position: absolute;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 8px solid #f5623b;
    }
  }
}
</style>
