<template>
  <div class="adjustSort">
    <div class="header">
      <i class="el-icon-arrow-left"></i>
      <span>调整排序</span>
    </div>

    <div class="sort">
      <el-table
        ref="tableRef"
        :data="tableData"
        highlight-current-row
        style="width: 100%;"
        size="small"
        row-key="id"
      >
        >
        <el-table-column
          prop="name"
          label="操作提示：鼠拖点击并拖拽目录调整排序。"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="bottom_box">
        <el-row>
          <el-button
            type="primary"
            size="medium"
          >
            保存
          </el-button>
          <el-button size="medium">
            取消
          </el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          checked: false,
          name: 'java11111',
          state: '正常',
          creator: '大小小',
          date: '2016-05-02',
          operation: ['信用', '编辑', '删除']
        },
        {
          id: 2,
          checked: false,
          name: 'java11111',
          state: '正常',
          creator: '大小小',
          date: '2016-05-02',
          operation: ['信用', '编辑', '删除']
        },
        {
          id: 3,
          checked: false,
          name: 'java11111',
          state: '正常',
          creator: '大小小',
          date: '2016-05-02',
          operation: ['信用', '编辑', '删除'],
          children: [
            {
              id: 4,
              checked: false,
              name: 'java22222',
              state: '正常',
              creator: '大小小',
              date: '2016-05-02',
              operation: ['信用', '编辑', '删除']
            },
            {
              id: 5,
              checked: false,
              name: 'java22222',
              state: '正常',
              creator: '大小小',
              date: '2016-05-02',
              operation: ['信用', '编辑', '删除'],
              children: [
                {
                  id: 6,
                  checked: false,
                  name: 'java3333',
                  state: '正常',
                  creator: '大小小',
                  date: '2016-05-02',
                  operation: ['信用', '编辑', '删除']
                },
                {
                  id: 7,
                  checked: false,
                  name: 'java3333',
                  state: '正常',
                  creator: '大小小',
                  date: '2016-05-02',
                  operation: ['信用', '编辑', '删除']
                }
              ]
            }
          ]
        },
        {
          id: 8,
          checked: false,
          name: 'java11111',
          state: '正常',
          creator: '大小小',
          date: '2016-05-02',
          operation: ['信用', '编辑', '删除']
        }
      ]
    }
  },
  mounted() {
    this.dragSort()
  },
  //表格拖动排序
  methods: {
    dragSort() {
      // 表格拖拽事件的添加
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      let self = this
      Sortable.create(el, {
        // 拖拽结束后的操作
        onEnd({ newIndex, oldIndex }) {
          // 修改data中的数组，
          const targetRow = self.tableData.splice(oldIndex, 1)[0]
          self.tableData.splice(newIndex, 0, targetRow)
          //  修改之后的data  self.tableData
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.adjustSort {
  .header {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
  }
  .sort {
    background-color: #fff;
    .bottom_box {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      height: 60px;
      border-top: 1px solid #cccccc;
      box-shadow: 0px 1px 7px rgb(122, 122, 122);
    }
  }
}
</style>
