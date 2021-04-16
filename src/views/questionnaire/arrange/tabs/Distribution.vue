<template>
  <div class="distribution">
    <div class="header">
      <div class="header-l">
        <div class="topic-count">
          <span class="prefix">题目数量：</span><span class="content">{{total}}个</span>
        </div>
      </div>

      <div class="header-r">
        <el-button
          :disabled="!data.length"
          :loading="exportLoading"
          type="text"
      
          icon="iconimage_icon_Uploadcoursecontent1 iconfont export-btn"
          @click="exportImg"
          >导出图片</el-button
        >
      </div>
    </div>

    <div class="topic">
      <div class="topic-item" v-for="(item, index) in data" :key="item.id">
        <div class="topic-type">
          {{ `${index + 1}、${getType(item.type)}` }}
        </div>
        <div class="topic-content">
          <div class="text">{{ item.question }}</div>
          <div class="statistics">
            填写率{{ item.fillingRate }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.fillingNum }}人填写
          </div>
        </div>

        <div class="topic-table">
          <el-table header-align="center" align="center" :data="item.items">
            <el-table-column prop="content" label="选项" align="center">
            </el-table-column>
            <el-table-column prop="writeNum" label="填写人数" align="center">
            </el-table-column>
            <el-table-column prop="writeRate" label="占比率" align="center">
              <template slot-scope="scope">
                <el-progress
                  :percentage="scope.row.writeRate"
                  :color="getColor(item.type, scope.$index)"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="topic-chart">
          <div class="chart" :ref="'chart_' + item.id"></div>
        </div>
      </div>
    </div>

    <pagination
      :total="total"
      :page="query.pageNo"
      :limit="query.pageSize"
      @pagination="pagination"
    ></pagination>
  </div>
</template>

<script>
import echarts from "echarts";
import JsZip from "jszip";
import { saveAs } from "file-saver";
import { question } from '@/api/questionnaire'
import Pagination from "@/components/common-pagination";

const FOLDER_NAME = "chart";
const singleTypeColors = [
  "#01AAFC",
  "#016BFC",
  "#012CFC",
  "#1501FC",
  "#5301FC",
  "#9101FC",
  "#CF01FC",
  "#FC01E9",
  "#FC01AA",
  "#FC016B",
  "#FC012C",
  "#FC1501",
  "#FC5301",
  "#FC7C01",
  "#FCCF01",
];
const multipleTypeColors = [
  "#FE937A",
  "#FFB152",
  "#FEDC53",
  "#4DF196",
  "#BF53FE",
  "#6C52FF",
  "#52D0FF",
  "#FF52B9",
  "#51FCFF",
  "#eb52ff",
  "#52a5ff",
  "#a5ff52",
  "#ff6c52",
  "#9752ff",
  "#52ffd4",
];
export default {
  name: "distribution",
  components: {
    Pagination
  },
  props: {
    shouldResizeChart: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      charts: [],
      exportLoading: false,
      query: {
        pageNo: 1,
        pageSize: 10,
        id: ''
      },
      data: [],
      total: 0
    };
  },
  created() {
    this.query.id = '1381777442804695041'
    // this.query.id = this.$route.query.id
    this.getData();
    const that = this;
    window.addEventListener("resize", () => {
      that.resizeCharts();
    });
  },
  methods: {
    getType(type) {
      switch (type) {
        case 'single_choice':
          return '单选题'
        case 'multi_choice':
          return '多选题'
        case 'judgment':
          return '判断题'
        case 'short_answer':
          return '简答题'
        case 'blank':
          return '填空题'
          default:
            return ''
      }
    },
    pagination({ page, limit }) {
      this.query.pageNo = page
      this.query.pageSize = limit
      this.getData()
    },
    exportImg() {
      this.exportLoading = true;
      var zip = new JsZip();
      var promises = [];
      this.charts.forEach((chart) => {
        const { topicName, _dom } = chart;
        const canvas = _dom.children[0].children[0];

        // 设置背景为白色
        // const context = canvas.getContext("2d");
        // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // for (var i = 0; i < imageData.data.length; i += 4) {
        //   if (imageData.data[i + 3] == 0) {
        //     imageData.data[i] = 255;
        //     imageData.data[i + 1] = 255;
        //     imageData.data[i + 2] = 255;
        //     imageData.data[i + 3] = 255;
        //   }
        // }
        // context.putImageData(imageData, 0, 0);

        var imgFolder = zip.folder(FOLDER_NAME);
        promises.push(
          new Promise((resolve) => {
            canvas.toBlob(function (blob) {
              imgFolder.file(topicName.trim() + ".png", blob);
              resolve();
            });
          })
        );
      });

      Promise.all(promises)
        .then(() => {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, `${FOLDER_NAME}.zip`);
          });
        })
        .finally(() => (this.exportLoading = false));
    },
    resizeCharts() {
      this.charts.forEach((c) => {
        c.resize();
      });
    },
    getData() {
      question(this.query).then(res => {
        const { totalNum = 0, data = [] } = res
        this.data = data
        this.total = totalNum
        this.$nextTick(() => this.data.forEach((item) => this.initChart(item)));
      })

    },
    getColor(type, index) {
      const colors = type == 1 ? singleTypeColors : multipleTypeColors;
      return colors[index];
    },
    initChart(item) {
      const dom = this.$refs["chart_" + item.id];
      const chart = echarts.init(dom[0]);
      const data = [];
      const colors = item.type == 'single_choice' ? singleTypeColors : multipleTypeColors;
      item.items.forEach((cur, index) => {
        const { content, writeRate = 0} = cur;
        data.push({
          name: content,
          value: writeRate,
          itemStyle: {
            color: colors[index],
          },
          label: {
            formatter: "{b}：{c}%",
          },
        });
      });
      console.log(data)
      const option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            const { data = {} } = params;
            const { name, value } = data;
            return `${name} ${value}%`;
          },
        },
        legend: {
          orient: "horizontal",
          left: 30,
          top: 10,
          icon: "circle",
          itemWidth: 12, // 设置宽度
          itemHeight: 12, // 设置高度
          itemGap: 30, // 设置间距
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      chart.setOption(option);
      chart.topicName = item.question;
      if (!this.charts.includes(chart)) {
        this.charts.push(chart);
      }
    },
  },
  watch: {
    shouldResizeChart(val) {
      if (val) {
        this.resizeCharts();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.distribution {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeced;
    .header-l {
      display: flex;
      .topic-count {
        font-size: 14px;
        .prefix {
          color: rgba(0, 11, 21, 0.45);
          margin-right: 10px;
        }
        .content {
          color: rgba(0, 11, 21, 0.86);
        }
      }
    }
    .header-r {
      .export-btn {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
      }
    }
  }
  .topic {
    .topic-item {
      margin-top: 16px;
      .topic-type {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 14px;
        line-height: 24px;
        color: #000b15;
      }
      .topic-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        margin-top: 16px;
        .text {
          font-family: PingFangSC-Regular;
          color: rgba(0, 11, 21, 0.85);
        }
        .statistics {
          color: rgba(0, 11, 21, 0.45);
        }
      }
      .topic-table {
        margin-top: 16px;
        width: 100%;
      }
      .topic-chart {
        border: 1px solid #ebeced;
        margin-top: 16px;
        border-radius: 4px;
        width: 100%;
        height: 292px;
        box-sizing: border-box;
        .chart {
          width: 100%;
          height: 292px;
        }
      }
    }
  }
}
</style>
