<template>
  <div class="mark-by-paper">
    <page-header
      title="逐题评卷"
      show-back
    />
    <el-card class="examinee-card">
      <div slot="header">
        <div class="header-box">
          <span>{{ $route.query.examName }}</span>
          <el-tag
            type="success"
            style="margin-left: 10px"
          >
            标签二
          </el-tag>
        </div>
      </div>
      <common-form
        :model="formData"
        :columns="columns"
        :config="{ labelPosition: 'left', labelWidth: '70px' }"
      />
      <div class="button-box">
        <el-button
          size="medium"
          @click="reset"
        >
          重置
        </el-button>
        <el-button
          size="medium"
          type="primary"
          @click="search"
        >
          搜索
        </el-button>
      </div>
    </el-card>
    <el-card class="paper-card">
      <div
        slot="header"
        class="card-header"
      >
        <div class="card-left">
          <span class="title">试题答卷</span>
          <span class="sub-title">
            <span>（搜索结果：</span>
            <span>{{ `${_.size(qustionList) > 0 ? `共${_.size(qustionList)}题` : '--'}）` }}</span>
          </span>
        </div>
        <div class="card-right">
          <el-button
            size="medium"
            :disabled="_.isEmpty(qustionList)"
          >
            上一题
          </el-button>
          <span class="number-box">
            <span>{{ currentIndex + 1 }}</span>
            <span>/</span>
            <span>{{ _.size(qustionList) }}</span>
          </span>
          <el-button
            size="medium"
            :disabled="_.isEmpty(qustionList)"
          >
            下一题
          </el-button>
        </div>
      </div>
      <ul
        v-if="!_.isEmpty(qustionList)"
        class="card-content"
      >
        <li
          v-for="(item, index) in qustionList"
          :key="index"
          class="card-li"
        >
          <div class="card-title">
            <span>{{ (index + 1) | number2zhcn }}、</span>
            <span>{{ item.type | typeFilter }}</span>
            <span>（每题{{ item.score / 10 }}分，共{{ item.length }}题）</span>
          </div>
          <div class="card-sub-title">
            {{ item.subTitle }}
          </div>
          <div class="stem-main">
            <span>{{ index + 1 }}.</span>
            <span v-html="item.qustionStem" />
            <el-tooltip
              class="item"
              effect="dark"
              :content="`试题分析：${item.tips || '暂无'}`"
              placement="top-start"
            >
              <el-button type="text">
                [查看试题分析]
              </el-button>
            </el-tooltip>
          </div>
          <div class="standard-class">
            <span class="standard-label"> 标准答案：</span>
            <span class="standard-value">{{ item.standard }}</span>
          </div>
        </li>
      </ul>
      <com-empty
        v-if="_.isEmpty(qustionList)"
        height="38vh"
        :text="emptyText"
        :src="emptySrc"
      />
    </el-card>
  </div>
</template>

<script>
// 逐人评卷
import addPng from '@/assets/images/add.jpg'
import noData from '@/assets/images/noData.jpg'
import ComEmpty from '@/components/common-empty/empty'
const nzhcn = require('nzh/cn')
const EventColumns = [
  {
    itemType: 'select',
    span: 7,
    required: false,
    options: [
      {
        label: '对',
        value: '0'
      },
      {
        label: '错',
        value: '1'
      },
      {
        label: '部分对',
        value: '2'
      }
    ],
    prop: 'result',
    label: '试题题型'
  },
  {
    prop: 'category',
    itemType: 'treeSelect',
    props: {
      selectParams: {
        placeholder: '题目分类',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        required: true
      }
    },
    label: '组织架构',
    span: 7,
    offset: 1,
    required: false
  },
  {
    itemType: 'select',
    span: 8,
    offset: 1,
    required: false,
    options: [
      {
        label: '对',
        value: '0'
      },
      {
        label: '错',
        value: '1'
      },
      {
        label: '部分对',
        value: '2'
      }
    ],
    prop: 'comment',
    label: '试题状态'
  }
]
import { QUESTION_TYPE_MAP } from '@/const/examMange'
export default {
  name: 'MarkByPaper',
  components: {
    ComEmpty
  },
  filters: {
    typeFilter(data) {
      return QUESTION_TYPE_MAP[data]
    },
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  data() {
    return {
      currentIndex: 0,
      emptySrc: noData,
      emptyText: '请搜索需要评分的考生试题~',
      columns: EventColumns,
      formData: {},
      qustionList: [
        {
          type: 'blank',
          score: 50,
          subTitle: '大题副标题',
          standard: '春秋|战国',
          qustionStem:
            '____时期出现了老子、孔子、孙子等为代表的学派。 ______时期形成了墨家、儒家、道家、法家等学派的“百家争鸣”。',
          tips: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        }
      ]
    }
  },
  activated() {
    this.loadData()
  },
  methods: {
    reset() {
      this.$refs.form.resetForm()
      this.search()
    },
    search() {
      this.loadData()
    },
    loadData() {
      this.emptySrc = addPng
      this.emptyText = '暂无搜索结果~'
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-by-paper {
  .examinee-card {
    .header-box {
      padding: 18px 0 10px;
    }
    /deep/ .el-form-item {
      margin-bottom: 8px;
    }
    .button-box {
      display: flex;
      justify-content: flex-end;
    }
  }
  .paper-card {
    margin-top: 16px;
    margin-bottom: 24px;
    .card-header {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .card-left {
        display: flex;
        align-items: flex-end;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .sub-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.45);
        }
      }
      .card-right {
        .number-box {
          margin: 0 10px;
        }
      }
    }
    .card-content {
      .card-li {
        margin: 0 13.5%;
        .card-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
        }
        .card-sub-title {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.25);
          margin: 10px 0 18px;
        }
        .stem-main {
        }
        .standard-class {
          position: relative;
          padding-left: 34px;
          margin-bottom: 8px;
          &::before {
            content: '';
            position: absolute;
            left: 24px;
            bottom: 6px;
            width: 6px;
            height: 6px;
            background-color: rgba(0, 11, 21, 0.25);
            border-radius: 100%;
          }
          .standard-label {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.25);
          }
          .standard-value {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
          }
        }
      }
    }
  }
}
</style>
