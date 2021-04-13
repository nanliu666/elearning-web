<template>
  <div class="customList">
    <basic-container block>
      <el-input
        v-model="customName"
        placeholder="输入方案名称查找..."
        suffix-icon="el-icon-search"
        style="width: 250px"
        @input.native="searchName"
      >
      </el-input>
      <!-- 定制列表 -->
      <el-row
        v-loading="loading"
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
                src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
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
                    <i class="iconimage_icon_Preview1 iconfont"></i>
                    <span>发布</span>
                  </div>
                  <div
                    class="ope-item"
                    @click="editSolutions(z)"
                  >
                    <i class="iconimage_icon_edit iconfont"></i>
                    <span>编辑</span>
                  </div>
                  <div
                    class="ope-item"
                    @click="deleteSolutions(z)"
                  >
                    <i class="iconimage_icon_close iconfont"></i>
                    <span>删除</span>
                  </div>
                </div>
              </transition>
              <div
                v-if="z.status"
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
      <div
        v-if="!customData.length"
        class="empty-block"
      >
        暂无数据
      </div>
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
import { getHomePc, releaseHomePc, deleteHomePc } from '@/api/diy/diyHomePc'
export default {
  name: 'CustomListMobile',
  props: {
    activeOrg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      customName: '',
      customData: [],
      pageConfig: {
        current: 1,
        pageSize: 8,
        total: 0
      },
      maskVisiable: false,
      n: 0,
      loading: false
    }
  },
  watch: {
    activeOrg: {
      handler(val) {
        this.activeOrg = val
        this.initHomeData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initHomeData()
    },
    handleCurrentChange(val) {
      this.pageConfig.current = val
      this.initHomeData()
    },
    // 发布操作
    async deliverSolutions(data) {
      await releaseHomePc({ id: data.id }).then((res) => {
        this.$confirm('您确认要发布选中的方案吗？', '确认发布？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (res) {
            this.$message({
              type: 'success',
              message: '发布成功!'
            })
            this.initHomeData()
          } else {
            this.$message({
              type: 'error',
              message: '发布失败,请联系管理人员!'
            })
          }
        })
      })
    },
    // 编辑操作
    editSolutions(data) {
      this.$router.push({ path: '/diy/diyHomeEditPc', query: { id: data.id, orgId: data.orgId } })
    },
    // 删除操作
    async deleteSolutions(data) {
      await deleteHomePc({ ids: data.id }).then((res) => {
        this.$confirm('您确认要删除选中的方案吗？', '确认删除？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initHomeData()
          } else {
            this.$confirm
            this.$message({
              type: 'error',
              message: '删除失败,请联系管理人员!'
            })
          }
        })
      })
    },
    // 查询
    searchName: _.debounce(function() {
      this.initHomeData()
    }, 500),
    // 初始化数据
    async initHomeData() {
      this.loading = true
      let params = {
        name: this.customName,
        device: 0, //写死0：APP
        pageNo: this.pageConfig.current,
        pageSize: this.pageConfig.pageSize
      }
      if (this.activeOrg) Object.assign(params, { orgId: this.activeOrg.orgId })
      //   判断是否是全部
      //   if (this.activeOrg && this.activeOrg.orgId == '0') Object.assign(params, { orgId: '' })
      await getHomePc(params)
        .then((res) => {
          this.customData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
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
          text-align: center;
          .iconfont {
            font-size: 26px;
          }
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
  .empty-block {
    text-align: center;
  }
  .page {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
