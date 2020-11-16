<template>
  <div class="fill">
    <!-- 头部 -->
    <page-header title="目录管理">
      <el-dropdown slot="rightMenu">
        <el-button
          type="primary"
          size="medium"
        >
          新建目录
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            单个新建
          </el-dropdown-item>
          <!-- <el-dropdown-item>Excel导入</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </page-header>

    <div class="fill_in">
      <!-- 搜索 -->
      <div class="search_bar">
        <el-input
          placeholder="请输入目录名称搜索"
          suffix-icon="el-icon-search"
          class="search_bar_input"
        >
        </el-input>
        <el-button size="medium">
          默认按钮
        </el-button>
        <div class="adjustment">
          <i class="el-icon-sort icon"></i>
          <span>调整排序</span>
          <span class="wire"></span>
          <i class="el-icon-s-tools icon"></i>
        </div>
      </div>

      <!-- 表格 -->
      <div class="list_bar">
        <el-table
          ref="tableRef"
          :data="tableData"
          highlight-current-row
          style="width: 100%;"
          size="small"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'children.length>0' }"
          @selection-change="selsChange"
          @select="rowSelect"
          @select-all="selectAll"
        >
          >
          <el-table-column
            type="selection"
            width="70"
            prop="checked"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="目录名称"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
          ></el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
          >
          </el-table-column>
          <el-table-column
            prop="date"
            label="更新时间"
          ></el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
              >
                {{ scope.row.operation[0] }}
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                {{ scope.row.operation[1] }}
              </el-button>
              <el-button
                type="text"
                size="small"
              >
                {{ scope.row.operation[2] }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
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
  // 初始化函数，赋值，menusTree =>menusTable
  created() {},
  methods: {
    // 当选择项发生变化时会触发该事件
    selsChange() {},

    toggleSelection(rows, flag) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.tableRef.toggleRowSelection(row, flag)
        })
      } else {
        this.$refs.tableRef.clearSelection()
      }
    },
    rowSelect(selection, row) {
      if (selection.indexOf(row) > -1 && row.menuLevel === 1) {
        this.toggleSelection(row.children, true)
      }
      if (selection.indexOf(row) === -1 && row.menuLevel === 1) {
        this.toggleSelection(row.children, false)
      }
      if (selection.indexOf(row) > -1 && row.menuLevel === 2) {
        let s = this.dataList.filter((item) => {
          if (item.id === row.menuPid) {
            return item
          }
        })
        this.toggleSelection(s, true)
      }
    },
    selectAll(selection) {
      // (selection)
      var flag = false // 默认 为全不选
      selection.forEach((item) => {
        if (item.menuLevel === 1) {
          flag = true
          this.toggleSelection(item.children, true)
        }
      })
      if (!flag) {
        this.toggleSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fill {
  .fill_in {
    background-color: #fff;
    .search_bar {
      padding: 15px;
      .search_bar_input {
        width: 250px;
        margin-right: 25px;
      }
      .adjustment {
        float: right;
        display: flex;
        padding: 6px;
        .icon {
          margin-top: 3px;
          margin-right: 12px;
        }
        .wire {
          width: 1px;
          height: 20px;
          background-color: #ccc;
          margin: 0 12px;
        }
      }
    }
  }
}
</style>
