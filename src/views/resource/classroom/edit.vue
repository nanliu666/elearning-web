<template>
  <div
    ref="wrapper"
    class="NewsEdit wrapper"
  >
    <page-header
      :title="pageTitle"
      :back="() => handleBack()"
      show-back
    />
    <basic-container block>
      <common-form
        ref="form"
        :columns="formColumns"
        :model="formData"
      >
        <template #basicTitle>
          <div class="title-box">
            基础信息
          </div>
        </template>
        <template #expendTitle>
          <div class="title-box">
            扩展信息
          </div>
        </template>

        <template #resName2>
          <el-input
            v-model="formData.resName2"
            placeholder="请输入"
          >
            <template slot="append">
              m²
            </template>
          </el-input>
        </template>
        <template #imageTitle>
          <div style="margin-bottom: -15px">
            场地照片
            <el-tooltip
              class="item"
              effect="dark"
              content="仅支持上传1张场地照片"
              placement="top-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
        </template>
        <template #attachments>
          <common-upload
            :before-upload="beforeUpload"
            @getValue="getValue"
          >
            <template #default>
              <div class="upload__wrapper">
                <i class="el-icon-picture-outline wrapper__icon" />
                <div class="wrapper__title">
                  点击或者拖拽附件到此区域
                </div>
                <div class="wrapper__tips">
                  上传的图片格式要求jpg，jpeg，bmp，png，大小不超过10M
                </div>
              </div>
            </template>
          </common-upload>
        </template>
      </common-form>

      <div class="container__buttons">
        <el-button
          :loading="submitting"
          size="medium"
          type="primary"
          @click="() => handlePublishBtnClick()"
        >
          保存
        </el-button>
        <el-button
          size="medium"
          @click="handleBack"
        >
          取消
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  addKnowledgeList,
  updateKnowledge,
  getKnowledgeCatalogList,
  getKnowledgeManageDetails
} from '@/api/knowledge/knowledge'
import { mapGetters } from 'vuex'
import CommonUpload from '@/components/common-upload/commonUpload'
const FORM_COLUMNS = [
  {
    prop: 'basicTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    label: '教室名称',
    prop: 'resName',
    required: true,
    span: 11,
    offset: 0
  },
  {
    label: '所在分类',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 11,
    offset: 1,
    props: {
      selectParams: {
        placeholder: '请选择所在分类',
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
    }
  },
  {
    itemType: 'input',
    label: '地址',
    prop: 'providerName',
    span: 11
  },
  {
    itemType: 'inputNumber',
    label: '最大容纳人数',
    prop: 'providerName1',
    offset: 1,
    span: 11
  },
  {
    prop: 'expendTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    label: '投影仪',
    prop: 'resName1',
    placeholder: '请输入',
    span: 11,
    offset: 0
  },
  {
    itemType: 'slot',
    label: '面积',
    prop: 'resName2',
    span: 11,
    offset: 1
  },
  {
    prop: 'imageTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    label: '',
    prop: 'attachments',
    props: {
      label: 'jobName',
      value: 'id'
    },
    required: false,
    span: 11
  }
]
export default {
  name: 'KnowledgeEdit',
  components: {
    CommonUpload
  },
  data() {
    return {
      pageTitle: '创建教室',
      formColumns: FORM_COLUMNS,
      formData: {
        resName: '',
        catalogId: '',
        providerName: '',
        uploadType: 0, // 0本地文件 1链接文件
        resUrl: '',
        allowDownload: 0 //是否运行下载 0允许 1不允许
      },
      submitting: false
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  computed: {
    // 查询参数
    _formData() {
      const formData = _.cloneDeep(this.formData)
      return formData
    },
    catalogId() {
      return this.$route.query.catalogId || null
    },
    id() {
      return this.$route.query.id || null
    },
    ...mapGetters(['tag'])
  },
  mounted() {
    this.pageTitle = this.id ? '编辑教室' : '创建教室'
    if (this.catalogId) {
      this.formData.catalogId = this.catalogId
    }
    this.initData()
  },
  methods: {
    // 新增附件时，直接赋值
    getValue(value) {
      _.each(value, (item) => {
        item.fileName = item.localName
      })
      let index = _.findIndex(
        this.formData.attachments,
        (item) => item.fileName === value[0].fileName
      )
      if (index > -1) {
        this.$message.error('附件已存在，请勿重复上传')
      }
      this.formData.attachments = _.uniqBy([...this.formData.attachments, ...value], 'fileName')
    },
    // 预览附件
    previewFile(data) {
      window.open(data.fileUrl)
    },
    // 删除上传文件
    deleteUpload(data) {
      let index = _.findIndex(this.formData.attachments, (item) => {
        return item.uid === data.uid
      })
      this.formData.attachments.splice(index, 1)
    },
    // 上传格式校验
    beforeUpload(file) {
      const fileTypeIndex = file.name.lastIndexOf('.')
      const fileType = file.name.substring(fileTypeIndex + 1, file.length)
      const imageSizeLimit = file.size / 1024 / 1024 < 10 //图片限制10M
      const othersSizeLimit = file.size / 1024 / 1024 / 1024 < 2 // 其余文件限制大小为2G
      const TYPE_LIST = ['exe', 'bat']
      const IMAGE_TYPE = ['jpg', 'jpeg', 'pbg', 'GIF', 'BMP']
      const isImage = _.some(IMAGE_TYPE, (item) => {
        return item === fileType
      })
      let isLtFileSize = isImage ? imageSizeLimit : othersSizeLimit
      const notBatNorExe = _.some(TYPE_LIST, (item) => {
        return item === fileType
      })
      const isEmpty = file.size === 0
      const isLimitLength = _.size(this.formData.attachments) < this.limit
      if (isEmpty) {
        this.$message.error('上传文件不能为空!')
        return false
      }
      if (!isLtFileSize) {
        this.$message.error(
          `上传${isImage ? '图片' : ''}文件大小不能超过${isImage ? '10M' : '2G'}!`
        )
        return false
      }
      if (!isLimitLength) {
        this.$message.error('上传文件数量超过限制!')
        return false
      }
      if (notBatNorExe) {
        this.$message.error('不允许上传.exe .bat类型文件')
        return false
      }
      return isLtFileSize && isLimitLength && !notBatNorExe && !isEmpty
    },
    /**
     * 初始选择数据
     */
    initData() {
      let catalogId = _.find(this.formColumns, { prop: 'catalogId' })
      getKnowledgeCatalogList().then((res) => (catalogId.props.treeParams.data = res))
      if (this.id) {
        this.loadDetail()
      }
    },
    // 点击完成
    handlePublishBtnClick() {
      this.validate().then(async () => {
        try {
          this.submitting = true
          // 区分是编辑还是新增
          _.isNull(this.id)
            ? await this.createKnowledgeFun(this._formData)
            : await this.updateKnowledgeFun(this._formData)
          this.$message.success('发布成功')
          this.handleBack()
        } catch (error) {
          this.$message.error(error.message)
        } finally {
          this.submitting = false
        }
      })
    },
    handleBack() {
      this.$router.back()
      this.$store.commit('DEL_TAG', this.tag)
    },
    // 加载详细
    async loadDetail(id = this.id) {
      const data = await getKnowledgeManageDetails({ id })
      for (let key in data) {
        this.$set(this.formData, key, data[key])
      }
      this.formData.introduction = _.unescape(this.formData.introduction) // 反转义获取 dom
    },
    validate(...args) {
      // const BRIEF_MIN_LEN = 10 // 限制最小输入长度
      return new Promise((resolve, reject) => {
        this.$refs.form
          .validate(...args)
          .then((data) => {
            resolve(data)
          })
          .catch((error) => reject(error))
      })
    },
    clearValidate(...args) {
      return this.$refs.form.clearValidate(...args)
    },
    // 新增资源
    async createKnowledgeFun(params) {
      const data = await addKnowledgeList(params)
      return data
    },
    // 更新数据
    async updateKnowledgeFun(params) {
      const API_PARAMS = [
        'allowDownload',
        'catalogId',
        'introduction',
        'knowledgeId',
        'providerName',
        'resName',
        'resUrl',
        'updateTime',
        'uploadType'
      ]
      const param = _.assign({ knowledgeId: this.id }, _.pick(params, API_PARAMS))
      await updateKnowledge(param)
      return { knowledgeId: this.id }
    }
  }
}
</script>

<style lang="scss" scoped>
$color_active: #368afa;
$color_border: #e3e7e9;
$color_placeholder: #757c85;
$color_font_uploader: #a0a8ae;
.upload__wrapper {
  width: calc(100%);
  border: 1px solid #e4e4e4;
  padding: 20px;
  border-radius: 4px;
  .wrapper__icon {
    font-size: 100px;
  }
  .wrapper__title {
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: 500;
  }
  .wrapper__tips {
    font-size: 10px;
    color: #999999;
  }
}
.title-box {
  font-size: 18px;
  color: rgba(0, 11, 21, 0.85);
  font-weight: 550;
  margin-top: 8px;
}
.wrapper {
  .basic-container--block {
    height: 0;
    min-height: calc(100% - 92px);
    .editor__title {
      margin-bottom: 10px;
    }
  }
}
.container__buttons {
  margin-top: 1rem;
}
</style>
