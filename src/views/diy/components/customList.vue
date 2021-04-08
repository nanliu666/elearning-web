<template>
  <div class="customList">
    <basic-container block>
      <el-input
        v-model="customName"
        placeholder="输入方案名称查找..."
        suffix-icon="el-icon-search"
        style="width: 250px"
      >
      </el-input>
      <!-- 定制列表 -->
      <el-row
        :gutter="16"
        style="margin-top: 30px"
      >
        <el-col
          v-for="(z, i) in customData"
          :key="i"
          :span="6"
        >
          <div class="content">
            <div
              class="cover_img"
              @mouseenter=";(maskVisiable = true), (n = i)"
              @mouseleave=";(maskVisiable = false), (n = i)"
            >
              <el-image
                :src="z.src"
                style="display: block"
              >
              </el-image>
              <transition name="fade">
                <div
                  v-show="maskVisiable && n == i"
                  class="operation"
                >
                  <div
                    class="ope-item"
                    @click="deliverSolutions(z)"
                  >
                    <el-image :src="require('@/assets/images/xxdt_ck.png')"></el-image>
                    <span>发布</span>
                  </div>
                  <div
                    class="ope-item"
                    @click="editSolutions(z)"
                  >
                    <el-image :src="require('@/assets/images/xxdt_bj.png')"></el-image>
                    <span>编辑</span>
                  </div>
                  <div
                    class="ope-item"
                    @click="deleteSolutions(z)"
                  >
                    <el-image :src="require('@/assets/images/xxdt_sc.png')"></el-image>
                    <span>删除</span>
                  </div>
                </div>
              </transition>
              <div
                v-if="z.isUse"
                class="useTag"
              >
                <el-tag size="small">
                  使用中
                </el-tag>
              </div>
            </div>
            <p class="name">
              {{ z.name }}
            </p>
          </div>
        </el-col>
      </el-row>
      <div class="page">
        <el-pagination
          :current-page="pageConfig.current"
          :page-size="pageConfig.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageConfig.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </basic-container>
  </div>
</template>

<script>
export default {
  name: 'CustomList',
  data() {
    return {
      customName: '',
      customData: [
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案1',
          isUse: false
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案2',
          isUse: false
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案3',
          isUse: true
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案4',
          isUse: false
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案5',
          isUse: true
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案6',
          isUse: false
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案7',
          isUse: false
        },
        {
          src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          name: '方案8',
          isUse: false
        }
      ],
      pageConfig: {
        current: 1,
        pageSize: 8,
        total: 0
      },
      maskVisiable: false,
      n: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    // 发布操作
    deliverSolutions(data) {
      console.log(data)
    },
    // 编辑操作
    editSolutions(data) {
      console.log(data)
    },
    // 删除操作
    deleteSolutions(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.customList {
  height: 100%;
  .content {
    .cover_img {
      position: relative;
      .operation {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        color: #ffffff;
        font-size: 14px;
        .ope-item {
          cursor: pointer;
          span {
            display: block;
            margin-top: 5px;
          }
        }
      }
      .useTag {
        position: absolute;
        top: 0;
        right: 0;
        .el-tag {
          border-radius: 0;
        }
      }
    }
    .name {
      text-align: center;
    }
  }
  .page {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
