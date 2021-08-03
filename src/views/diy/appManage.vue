<template>
  <div class="fill">
    <page-header title="App管理">
      <el-button
        v-p="DIY_ADD_APP"
        slot="rightMenu"
        size="medium"
        @click="goEdit({},'add')"
      >
        发布新版
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="loading"
        @current-page-change="pageChange"
        @page-size-change="sizeChange"
      >
        <template #deviceType="{ row }">
          <div>
            {{ row.deviceType==1?'安卓':'苹果' }}
          </div>
        </template>
        <template #onlineStatus="{ row }">
          <div>
            {{ row.onlineStatus==0?'未上线':'已上线' }}
          </div>
        </template>
        <template
         #d="{ row }"
        >
          <el-button
            v-p="DIY_EDIT_APP"
            type="text"
            size="medium"
            :disabled="row.onlineStatus==0?false:true"
            @click.stop="goEdit(row,'edit')"
          >
            编辑
          </el-button>
          <el-button
            v-p="DIY_DEl_APP"
            type="text"
            size="medium"
            :disabled="row.onlineStatus==0?false:true"
            @click.stop="handleDel(row,'online')"
          >
            上线
          </el-button>
          <el-dropdown
              @command="commandCallback"
            > 
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{data:row,type:'detail'}"
                >
                  查看
                </el-dropdown-item>
                <el-dropdown-item
                :disabled="row.onlineStatus==0?false:true"
                  :command="{data:row,type:'del'}"
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { updateStatus, getAppList } from '@/api/updateApp.js'
import { DIY_ADD_APP,DIY_EDIT_APP,DIY_DEl_APP } from '@/const/privileges'

const TABLE_CONFIG = {
  showHandler: false, //是否显示操作列
  rowKey: 'id',
  handlerColumn: {
    //操作列配置
    width: 110,
    fixed: false
  }
}
const COLUMNS = [
  {
    label: 'AppID',
    prop: 'id',
    minWidth: 120
  },
  {
    label: '应用名称',
    prop: 'serverName',
  },
  {
    label: '更新标题',
    prop: 'title',
  },
  {
    label: '平台',
    prop: 'deviceType',
    width: 100,
    slot:true
  },
  {
    label: '版本号',
    prop: 'versionNo',
    width: 100,
  },
  {
    label: '安装包状态',
    prop: 'onlineStatus',
    width: 100,
    slot:true
  },
  {
    label: '上传时间',
    prop: 'createTime'
  },
   {
    label: '操作',
    prop: 'd',
    slot: true
  },
]

export default {
  name: 'AppManage',
  data() {
    return {
      loading: false,
      tableConfig:TABLE_CONFIG,
      columns:COLUMNS,
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      params:{
          deviceType:'',
          serverName:'',
          versionNo:''
      },
      tableData:[], 
      comeIn: 0 // 进入页面是次数
    }
  },
  computed: {
    DIY_ADD_APP: () => DIY_ADD_APP,
    DIY_EDIT_APP: () => DIY_EDIT_APP,
    DIY_DEl_APP: () => DIY_DEl_APP
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.comeIn = this.comeIn + 1
    if (this.comeIn > 1) {
      // 进来的次数 > 1
      this.getList()
    }
  },
  methods: {
      getList(){
          getAppList({
              pageNo:this.page.currentPage,
              pageSize:this.page.size,
              ...this.params
          }).then(res=>{
              this.tableData = res.data

              this.page.total = res.totalNum
              console.log(this)
          })
      },
      pageChange(val) {
        this.page.currentPage = val
        this.getList()
      },
      sizeChange(val) {
        this.page.size = val
        this.getList()
      },
      handleDel(obj,type){
        updateStatus({
          id:obj.id,
          operType:type==='del'?'1':'3'
        }).then(res=>{
          this.getList()
        })
      },
      commandCallback({data,type}){
        if(type==='detail'){
          this.goEdit(data,type)
        }else{
          this.handleDel(data,type)
        }
      },
      goEdit(obj,type){
        this.$router.push({
          path: '/diy/editAppInfo',
          query: {
            type,
            id:obj.id
          }
        })
      }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
</style>
