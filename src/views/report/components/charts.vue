<template>
  <div id="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Charts',
  props: {
    type: {
      type: String,
      default: 'course'
    },
    data: {
      type: Object,
      default() {
        return {
          dept: [],
          joinNum: [],
          passNum: [],
          passRate: []
        }
      }
    }
  },
  data() {
    return {
      charts: ''
    }
  },
  watch: {
    data: {
      handler() {
        this.initCharts()
      },
      deep: true
    }
  },
  methods: {
    setLoadingVisbile(visible) {
      if (!this.charts) return
      visible
        ? this.charts.showLoading({
            text: 'loading',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.2)',
            zlevel: 0
          })
        : this.charts.hideLoading()
    },
    initCharts() {
      const charts = (this.charts = echarts.init(document.getElementById('charts')))
      charts.clear()
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.dept
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [],
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
          }
        ],
        noDataLoadingOption: {
          effect: 'bubble',
          text: '暂无数据',
          effectOption: {
            effect: {
              n: 0
            }
          },
          textStyle: {
            fontSize: 32,
            fontWeight: 'bold'
          }
        }
      }
      const { series, legend, yAxis } = option
      series.push({
        name: '参考人数',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        data: this.data.joinNum,
        itemStyle: {
          color: 'rgba(1,170,252,1)'
        }
      })
      if (this.type === 'exam') {
        legend.data.push('参考人数', '通过人数', '通过率')
        series.push(
          {
            name: '通过人数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            data: this.data.passNum,
            itemStyle: {
              color: 'rgba(123, 212, 255, 1)'
            }
          },
          {
            name: '通过率',
            type: 'line',
            yAxisIndex: 1,
            stack: 'total',
            data: this.data.passRate,
            itemStyle: {
              color: 'rgba(0, 214, 111, 1)'
            }
          }
        )
        yAxis.push({
          type: 'value',
          name: '通过率',
          axisLabel: {
            formatter: '{value}%'
          }
        })
      }
      this.charts.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
#charts {
  width: 100%;
  height: 477px;
}
</style>
