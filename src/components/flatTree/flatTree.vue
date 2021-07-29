<!--扁平树下拉组件-->
<template>
  <span class="flatTree">
    <el-input ref="inputRef" v-model="inputLable" clearable readonly class="flatTreeInput" @click.native="inputFn"></el-input>
    <div v-if="isOpen" ref="layerRef" class="dropDownLayer">
      <div>
        <el-input
          v-model="searchName"
          clearable
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="small"      
        >
        </el-input>
      </div>
      <div class="flBreadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span class="flatTreeChecked" @click="changNode('all')">全部</span></el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item,index) in checkData" :key="item.id" class="flatTreeChecked"><span @click="changNode(item,index)">{{ item.name }}</span></el-breadcrumb-item>          
        </el-breadcrumb>
      </div>
      <div v-loading="loading" v-scrollFn="moreFn" class="list">
        <ul v-if="listData.length>0">
          <li v-for="item in listData" :key="item.id" @click="checkFn(item)">
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <div v-else class="noData">无数据</div>
      </div>      
    </div>
  </span>
</template>
<script>
export default {
  name:'FlatTree',
  directives: {
    scrollFn: {
      bind(el, binding) {        
        //内容滚动区域 
        el.addEventListener('scroll', function() {          
          let sign = 0
          // 滚动到底部
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= sign) {
            binding.value()
          }
        })
      }
    }
  },
  props:{
    value:{
      type:[Array],
      default:function(){
        return[]
      }
    },
    options:{
      type:Object,
      default:function(){
        return{}
      }
    }
  },
  data: function() {
    return {
      setTime:'', // 定时查询控制
      loading:false,
      inputLable:'',
      pageData:{
        pageNo: 1,
        pageSize: 10,
      },
      searchName:'',
      checkData:[],
      parentId:0,
      listData:[],
      isOpen:false
    }
  },
  watch:{
    checkData:{
      handler(val){
        let text=''
        val.forEach(item => {
          text+=`${this.options.value?item[this.options.value]:item.name}>`
        })
        text=text.substring(0,text.length-1)
        this.inputLable=text
        this.$emit('input',val)
      },
      deep:true
    },
    searchName(){
      this.keypressFn()
    }
  },
  mounted(){
    //this.init()    
    document.body.addEventListener('click', this.bodyClick)
    // document.onclick=function(e){  
    //   let inputRef =th.$refs.inputRef.$el, layerRef=th.$refs.layerRef
    //   if(!(e.path.includes(inputRef)||e.path.includes(layerRef))){
    //     th.isOpen=false        
    //   } 
    //   debugger    
    //   //let inputDom =document.getElementsByClassName('flatTreeInput')[0],layerDom=document.getElementsByClassName('dropDownLayer')[0]
      
    //   // if(!(inputDom.contains(e.target)||layerDom.contains(e.target))){
    //   //   th.isOpen=false
    //   //   debugger
    //   // }      
    // }
  },  
  methods:{
    keypressFn(){
      this.loading=true
      this.listData=[]     
      if(this.setTime){
        window.clearInterval(this.setTime)
      }
      this.setTime =setTimeout(() => {        
        this.init()
      }, 2000)
      
    },
    bodyClick(e){
      let inputRef =this.$refs.inputRef.$el, layerRef=this.$refs.layerRef
      if(!(e.path.includes(inputRef)||e.path.includes(layerRef))){
        this.isOpen=false        
      }
    },
    init(){      
      this.loading=true
      let sendData={
        pageNo: this.pageData.pageNo,
        pageSize: this.pageData.pageSize,
        parentId: this.parentId,
        name:this.searchName ,
      }
      this.options.requestFn(sendData).then((res)=>{
        this.loading=false
        this.listData.push(...res.data)        
      })
    },
    moreFn(){      
      this.loading=true      
      this.pageData.pageNo++
      this.init() 
    },
    checkFn(item){ // 选中
      setTimeout(() => {
        this.checkData.push(item)
        this.parentId=item.id
        this.pageData.pageNo=0
        this.listData=[]
        this.init()
      }, 500)           
    },
    changNode(item,index){      
      this.pageData.pageNo=0
      if(item=='all'){
        this.listData=[]
        this.checkData=[]
        this.parentId=0
        this.init()
        return
      }
      if(index+1==this.checkData.length) return
      this.checkData=this.checkData.splice(0,index+1)
      this.parentId=item.id
      this.listData=[]      
      this.init()
    },
    inputFn(){      
      this.init()      
      this.isOpen=true
    }
  }
}
</script>
<style scoped>
.flatTree{position: relative;}
.flBreadcrumb{border-bottom: 1px #ccc solid;}
.flBreadcrumb .flatTreeChecked{cursor: pointer;}
.dropDownLayer{
  background: #fff;
  position: absolute;
  z-index: 1000;
  border: #ccc solid 1px;
  margin: 2px;
  padding: 10px 15px 10px 15px;
  width: 100%;
  box-sizing: border-box;
}
.dropDownLayer .list{max-height: 250px;overflow-y: auto;}
.dropDownLayer .noData{text-align: center;padding: 30px;}
.dropDownLayer .list ul{padding: 5px 0 0 0;margin: 0;}
.dropDownLayer .list li{padding: 5px 0;cursor: pointer;border-bottom: dashed #eee 1px;}
.flBreadcrumb {
  padding: 10px 0 10px 0;
}
</style>
<style>

</style>
