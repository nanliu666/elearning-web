<template>
  <div>
    <el-input
      v-model="pName"
      style="width:100%;"
      readonly
      :disabled="isEditPos"
      :placeholder="placeholder"
      @focus="showPosTree"
    />
    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="title"
      :visible="visible"
      width="700px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-input
        v-model="name"
        style="display:block;"
        class="pos-search"
        :placeholder="searchPlace"
        clearable
        @input="searchData"
      />
      <div :class="{ 'pos-box': treeData[0] && treeData[0].data && treeData[0].data.length > 0 }">
        <div class="box">
          <template v-if="treeData[0] && treeData[0].data && treeData[0].data.length > 0">
            <div
              v-for="(item, index) in treeData"
              :key="index"
              class="warp"
            >
              <ul
                class="box2"
                @scroll="DropdownMore($event, index)"
              >
                <li
                  v-for="(val, idx) in item.data"
                  :key="idx"
                  class="myDrop-item"
                  :class="{ active: ativeArray.includes(`${index}-${idx}`) }"
                >
                  <span @click="backPos(`${index}-${idx}`)">{{ val.name }}</span>
                  <i
                    v-if="val.hasChildren && index < 4"
                    class="el-icon-arrow-right right-arrow"
                    @click="getNextData(val.id, index)"
                  />
                </li>
                <div
                  v-if="item.isLoading"
                  class="empty"
                >
                  <i class="el-icon-loading"></i>
                </div>
                <div
                  v-if="!item.isLoading && item.isEmpty"
                  class="empty"
                >
                  没有更多数据了~
                </div>
              </ul>
            </div>
          </template>
          <template v-else>
            <div style="text-align:center">
              暂无数据~
            </div>
          </template>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="handleClose"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStationParent } from '@/api/system/station'
let [timeOut, timeOut2] = [null, null]
export default {
  name: 'MyPosition',
  props: {
    placeholder: {
      //岗位框占位符
      type: String,
      default: '请选择'
    },
    searchPlace: {
      //搜索框岗位占位符
      type: String,
      default: '请输入岗位名称搜索'
    },
    posName: {
      //回显传入岗位名称
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '岗位选择'
    },
    positionBreadcrumb: {
      type: Array,
      default: () => []
    },
    opear: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      isEditPos: false,
      pName: '',
      loading: false,
      visible: false,
      treeData: [],
      page: {
        currentPage: 1,
        size: 20
      },
      name: '',
      ativeArray: ''
    }
  },
  watch: {
    // positionBreadcrumb:{
    //   handler:function(val){
    //     if(val.length>1){
    //       this.pName=val[val.length-1].label
    //     }else{
    //       this.pName=''
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    visible(val) {
      if (val) {
        this.loadData(0, 0)
      }
    }
  },
  mounted() {},
  methods: {
    editPosition() {
      //仅用于岗位管理回显
      if (this.positionBreadcrumb.length > 1) {
        this.pName = this.positionBreadcrumb[this.positionBreadcrumb.length - 1].label
      } else {
        this.pName = ''
      }
    },
    createPosition() {
      this.pName = this.posName.name
    },
    showPosTree() {
      this.visible = true
    },
    searchData() {
      if (timeOut !== null) {
        clearInterval(timeOut)
      }
      timeOut = setTimeout(() => {
        this.loadData(0, 0)
      }, 500)
    },
    backPos(key) {
      // const allIdx = key.split('-')
      // const idx0 = allIdx[0]
      // this.ativeArray=this.ativeArray.filter((val)=>{
      //   return !val.includes(idx0+'-')
      // })
      // this.ativeArray.push(key)
      this.ativeArray = key
    },
    //确定
    submit() {
      if (!this.ativeArray) {
        this.$message.error('请选择岗位')
        return
      }
      // const key=this.ativeArray[this.ativeArray.length-1].split('-')
      const key = this.ativeArray.split('-')
      const item = this.treeData[key[0]].data[key[1]]
      this.pName = item.name
      this.handleClose()
      this.$emit('getPosData', { label: item.name, value: item.id })
    },
    //点击获取下一级
    getNextData(id, key) {
      this.ativeArray = ''
      if (timeOut2 !== null) {
        clearInterval(timeOut2)
      }
      timeOut2 = setTimeout(() => {
        this.loadData(id, parseInt(key) + 1)
      }, 300)
    },
    getMore(idx) {
      if (
        this.treeData[idx].totalPage > this.treeData[idx].currentPage &&
        !this.treeData[idx].isLoading
      ) {
        this.treeData[idx].isLoading = true
        this.treeData[idx].currentPage++
        this.loadData(this.treeData[idx].id, idx, true)
      } else {
        this.treeData[idx].isEmpty = true
      }
    },
    //下拉加载
    DropdownMore(e, idx) {
      // eslint-disable-next-line max-len
      const { scrollTop, offsetHeight, scrollHeight } = e.srcElement
      if (scrollTop + offsetHeight > scrollHeight - 10) {
        this.getMore(idx)
      }
    },
    //列表数据
    loadData(parentId = 0, parentIdx, isLoad) {
      const pageNo = isLoad ? this.treeData[parentIdx].currentPage : 1
      const param = {
        pageNo,
        pageSize: this.page.size,
        parentId,
        name: parentIdx == '0' ? this.name : ''
      }
      getStationParent(param)
        .then((res) => {
          if (isLoad) {
            this.treeData[parentIdx].data = this.treeData[parentIdx].data.concat(res.data || [])
          } else {
            this.treeData[parentIdx] = {
              id: parentId, //将当前查询列表id保存下来
              currentPage: 1, //当前滚动的页数
              isLoading: false,
              isEmpty: false,
              totalPage: res.totalPage,
              total: res.totalNum,
              data: res.data || []
            }
            this.treeData = this.treeData.slice(0, parentIdx + 1)
            const elem = document.getElementsByClassName('box2')
            if (!isLoad && elem[parentIdx]) {
              elem[parentIdx].scrollTop = 0
            }
          }
        })
        .finally(() => {
          if (isLoad) {
            this.treeData[parentIdx].isLoading = false
          }
        })
    },
    //关闭弹出层
    handleClose() {
      this.ativeArray = ''
      this.name = ''
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box2::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.pos-box {
  display: inline-block;
  border: 1px solid #e3e7e9;
  border-radius: 4px;
  overflow: auto;
  max-width: 100%;
}
.box {
  display: flex;
}
.warp + .warp {
  border-left: 1px solid #e3e7e9;
}
.box2 {
  box-sizing: border-box;
  width: 220px;
  height: 324px;
  overflow: auto;
  background: #fff;
  li {
    height: 44px;
    padding-left: 16px;
  }
  li:hover,
  .active {
    background: #f0f9ff;
    color: #2875d4;
  }
  .myDrop-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      cursor: pointer;
      flex: 1;
    }
    .right-arrow {
      cursor: pointer;
      padding: 8px;
    }
  }
}
.empty {
  padding: 10px 0 12px;
  text-align: center;
  color: #bbb;
}
.pos-search {
  margin-bottom: 16px;
  width: 294px;
}
</style>
