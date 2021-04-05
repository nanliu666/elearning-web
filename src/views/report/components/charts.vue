<template>
  <div id="charts"></div>
</template>

<script>
import echarts from 'echarts'
import { getCanvasImgColorUrl } from '@/util/util'
require('echarts/theme/macarons') // echarts theme

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
      const charts = (this.charts = echarts.init(document.getElementById('charts'), 'macarons'))
      charts.clear()
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: []
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.dept,
            boundaryGap: ['5%', '5%']
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
            // dataBackground:{                        //数据阴影的样式。
            //     lineStyle: '#333',              //阴影的线条样式
            //     areaStyle: '#333',              //阴影的填充样式
            // },
            // fillerColor:"rgba(167,183,204,0.4)",  //选中范围的填充颜色。
            // borderColor:"#ddd"
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

      if (this.type === 'exam') {
        legend.data.push('参考人数', '通过人数', '通过率')

        const dataURL = getCanvasImgColorUrl('#5ab1ef')
        const PatternImgA = new Image()
        PatternImgA.src = dataURL

        const itemStyle = {
          color: {
            image: PatternImgA,
            repeat: 'repeat'
          },
          barBorderColor: '#5ab1ef',
          barBorderWidth: 1,
          barBorderRadius: 0,
          borderType: 'solid'
        }

        series.push(
          {
            name: '通过人数',
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            data: this.data.passNum,
            itemStyle: {
              color: '#5ab1ef'
            },
            barWidth: '30%',
            barMaxWidth: 60
          },
          {
            name: '参考人数',
            type: 'bar',
            stack: 'total',
            barWidth: '30%',
            barMaxWidth: 60,
            label: {
              show: false
            },
            data: this.data.joinNum,
            itemStyle
          },
          {
            name: '通过率',
            type: 'line',
            yAxisIndex: 1,
            stack: 'total',
            data: this.data.passRate,
            itemStyle: {
              color: '#00D66F'
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
      } else {
        let name
        switch (this.type) {
          case 'course':
            name = '学习人数'
            break
          case 'train':
            name = '培训人数'
            break
          case 'live':
            name = '参加人数'
            break
        }

        series.push({
          name,
          type: 'bar',
          stack: 'total',
          label: {
            show: false
          },
          data: this.data.joinNum,
          itemStyle: {
            color: '#5ab1ef'
          },
          barWidth: '30%',
          barMaxWidth: 60
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
