<template>
  <div class="question-edit fill">
    <page-header
      :title="title"
      show-back
    />
    <basic-container
      block
    >
      <div class="main__container">
        <el-form ref="appform" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="应用名称" prop="serverName">
            <el-input :disabled="type==='detail'?true:false" v-model="form.serverName" placeholder="请输入APP名称"></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="versionNo">
                <el-input :disabled="type==='detail'?true:false" v-model="form.versionNo" placeholder="请输入APP版本号"></el-input>
              </el-form-item>
         <el-form-item label="平台" prop="deviceType">
                <el-radio-group v-model="form.deviceType" >
                  <el-radio :disabled="(type==='detail' || type==='edit')?true:false" label="1" value="安卓">安卓</el-radio>
                  <el-radio :disabled="(type==='detail' || type==='edit')?true:false" label="2" value="苹果">苹果</el-radio>
                </el-radio-group>
              </el-form-item>
          <el-form-item label="更新标题" prop="title">
                <el-input :disabled="type==='detail'?true:false" v-model="form.title" placeholder="请输入更新标题"></el-input>
          </el-form-item>
          <el-form-item label="更新内容" prop="content">
            <el-input
             :disabled="type==='detail'?true:false"
              type="textarea"
              :rows="2"
              placeholder="请输入更新内容"
              v-model="form.content">
            </el-input>
          </el-form-item>
          <el-form-item label="安装包" prop="uploadApk" v-if="form.deviceType==='1'">
            <common-upload
                class="upload-demo"
                drag
                :show-file-list="false"
                :before-upload="beforeUpload"
                :multiple="false"
                @input="upLoadImg"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <div>将文件拖到此处，或<em>点击上传</em><br /></div>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                  >
                    只能上传apk文件
                  </div>
                </div>
                <span
                  v-if="form.apkAddress"
                  class="avatar"
                >{{form.apkAddress}}</span>
              </common-upload>
          </el-form-item>
          <el-form-item label="包地址" prop='apkAddress'>
            <el-input :disabled="form.deviceType==='1'?true:false" v-model="form.apkAddress" @change="addressChange"></el-input>
          </el-form-item>
          <el-form-item label="强制更新">
            <el-switch :disabled="type==='detail'?true:false" v-model="form.coerceStatus"></el-switch>
          </el-form-item>
          <el-form-item label="上线发行" v-if="type==='detail'">
            <el-switch :disabled="type==='detail'?true:false" v-model="form.onlineStatus"></el-switch>
          </el-form-item>
          <el-form-item v-if="type!=='detail'">
            <el-button  type="primary" size="middle" @click="onSubmit">发布</el-button>
          </el-form-item>
        </el-form>
      </div>
    </basic-container>
  </div>
</template> 

<script>
import { updateStatus, add, updateApp, getDetail } from '@/api/updateApp.js'
export default {
  name: 'EditApp',
  components:{
     commonUpload: () => import('@/components/common-upload/commonUpload'),
  },
  data() {
    return {
      form: {
        serverName:'',
        apkAddress:'',
        title:"",
        onlineStatus:"",
        versionNo:'',
        coerceStatus:false,
        content:'',
        deviceType:'1',
        apkAddress:'',
        apkSize:'',
        apkName:'',
        uploadApk:''
      },
       rules: {
          serverName: [
            { required: true, message: '请输入APP名称', trigger: 'blur' },
          ],
          apkAddress: [
            { required: true, message: '请输入APP包地址', trigger: 'blur' },
          ],
          title: [
            { required: true, message: '请输入更新标题', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请输入更新内容', trigger: 'blur' },
          ],
          versionNo: [
            { required: true, message: '请输入APP版本号', trigger: 'blur' },
          ],
          deviceType: [
            { required: true, message: '请选择平台', trigger: 'blur' },
          ],
          uploadApk: [
            { required: true, message: '请上传安装包', trigger: 'blur' },
          ],
      }
    }
  },
  computed: {
    type(){
      return this.$route.query.type
    }, 
    id() {
      return this.$route.query.id
    },
    title() {
      return this.type==='edit'?'编辑APP':(this.type==='detail'?'APP详情':'添加APP')
    }
  },
  activated() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    addressChange(val){
      if(this.form.deviceType==='2'){
        this.form.uploadApk = val
      }
    },
     // 上传前格式校验
    beforeUpload(file) {
       if(!/^.*\.(apk)$/.test(file.name)){
         this.$message({
           type:'info',
           message:"请上传apk文件"
         })
         return
       }
    },
    // 图片上传成功
    upLoadImg(file) {
      this.form.uploadApk = file[0].url
      this.form.apkAddress = file[0].url
      this.form.apkSize = file[0].size
      this.form.apkName = file[0].name
    },
    handleSubmit(isContinue) {
    },
    goBack() {
      this.$router.go(-1)
    },
    getDetail(){
      getDetail({id:this.id}).then(res=>{
          res.deviceType = `${res.deviceType}`
          res.onlineStatus = res.onlineStatus==1?true:false
          res.coerceStatus = res.coerceStatus==1?true:false
          this.form = res
        })
    },
    onSubmit(){
      this.$refs['appform'].validate((valid) => {   
          if (valid) {
            this.form.onlineStatus = this.form.onlineStatus?1:0
            this.form.coerceStatus = this.form.coerceStatus?1:0
            let fun = this.type==='edit'?updateApp:add
            if(this.type==='edit')this.form.id = this.id
            if(this.form.deviceType==='2') delete this.form.apkSize
            fun({
              ...this.form
            }).then(res=>{
              this.goBack()
            })
          } else {
            return false;
          }
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: initial;
  min-height: calc(100% - 92px);
}
.question-edit {
  .main__container {
    padding: 0px 60px;
      .upload-demo {
    position: relative;
    .avatar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      display: block;
      word-break: break-all;
      text-align: center;
    }
  }
  }
  .title {
    font-size: 18px;
  }
  .tips {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.25);
  }
  .page-footer {
    text-align: center;
  }
}
</style>
