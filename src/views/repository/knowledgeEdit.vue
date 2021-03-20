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
        <template #attachments>
          <common-upload
            :before-upload="beforeUpload"
            @getValue="getValue"
          >
            <template #default>
              <div style="display: flex;">
                <el-button>上传</el-button>
              </div>
              <div
                slot="tip"
                style="color: #a1a8ae; font-size:12px"
              >
                图片文件大小＜10MB，其他类型文件大小＜2G，最多{{ limit }}个文件
              </div>
            </template>
          </common-upload>
          <ul class="uploader-ul">
            <li
              v-for="(item, index) in formData.attachments"
              :key="index"
              class="uploader-li"
            >
              <span
                class="uploader-file ellipsis"
                @click.stop="previewFile(item)"
              >{{
                item.fileName
              }}</span>
              <i
                class="el-icon-close"
                @click.stop="deleteUpload(item)"
              />
            </li>
          </ul>
        </template>
        <template #basicTitle>
          <!-- 用来占位的 -->
          <div style="height: 85px; color: transparent;" />
        </template>
        <template #introduction>
          <tinymce
            ref="tinymceRef"
            v-model="formData.introduction"
          />
        </template>
      </common-form>

      <div class="container__buttons">
        <el-button
          :loading="submitting"
          size="medium"
          type="primary"
          @click="() => handlePublishBtnClick()"
        >
          完成
        </el-button>
        <el-button
          v-if="!id"
          size="medium"
          @click="() => handleContinueAdd()"
        >
          完成并继续添加
        </el-button>
        <el-button
          v-if="id"
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
  getKnowledgeManageDetails
} from '@/api/knowledge/knowledge'
import { queryCategoryOrgList } from '@/api/resource/classroom'
import CommonUpload from '@/components/common-upload/commonUpload'
import { mapGetters } from 'vuex'
const FORM_COLUMNS = [
  {
    itemType: 'input',
    label: '资源名称',
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
    label: '提供人',
    prop: 'providerName',
    span: 11
  },
  {
    prop: 'basicTitle',
    itemType: 'slotout',
    span: 11,
    offset: 1,
    label: ''
  },
  // {
  //   itemType: 'select',
  //   label: '添加标签',
  //   prop: 'tags',
  //   required: false,
  //   filterable: true,
  //   multiple: true,
  //   disabled: true,
  //   props: {
  //     label: 'name',
  //     value: 'id'
  //   },
  //   options: [],
  //   span: 11,
  //   offset: 1
  // },
  {
    itemType: 'radio',
    label: '上传模式',
    prop: 'uploadType',
    required: true,
    span: 11,
    options: [
      {
        label: '本地文件',
        value: 0
      },
      {
        label: '链接文件',
        value: 1
      }
    ]
  }
]
const uploadConfigList = [
  {
    itemType: 'switch',
    label: '是否允许下载',
    prop: 'allowDownload',
    required: false,
    activeValue: 1,
    inactiveValue: 0,
    span: 11,
    offset: 1
  },
  {
    itemType: 'slot',
    label: '附件',
    prop: 'attachments',
    props: {
      label: 'jobName',
      value: 'id'
    },
    required: false,
    span: 24
  }
]
const UPLOAD_ONLINE = [
  {
    itemType: 'input',
    label: '资源路径',
    prop: 'resUrl',
    required: true,
    maxlength: 2083,
    span: 24
  }
]
import { deleteHTMLTag } from '@/util/util'
export default {
  name: 'KnowledgeEdit',
  components: {
    CommonUpload
  },
  data() {
    return {
      limit: 5,
      introductionColumn: {
        prop: 'introduction',
        label: '资源介绍',
        itemType: 'slot',
        rules: [{ required: false, validator: this.checkTinyMax, trigger: ['blur', 'change'] }],
        span: 24
      },
      pageTitle: '',
      formColumns: FORM_COLUMNS,
      localColumns: [...FORM_COLUMNS, ...uploadConfigList],
      onlineColumns: [...FORM_COLUMNS, ...UPLOAD_ONLINE],
      formData: {
        resName: '',
        catalogId: '',
        providerName: '',
        // tags: [],
        uploadType: 0, // 0本地文件 1链接文件
        resUrl: '',
        allowDownload: 0, //是否运行下载 0允许 1不允许
        introduction: '',
        attachments: []
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
      formData.introduction = _.escape(formData.introduction)
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
  watch: {
    // 上传模式变化
    'formData.uploadType': {
      deep: true,
      immediate: true,
      handler(val) {
        // 本地文件（是否下载+附件），资源文件（资源路径）
        let tmp = val === 0 ? this.localColumns : this.onlineColumns
        this.formColumns = [...tmp, this.introductionColumn]
      }
    }
  },
  mounted() {
    this.pageTitle = this.id ? '编辑资源' : '创建资源'
    // TODO: 待自测新增分类后进入创建资源
    if (this.catalogId) {
      this.formData.catalogId = this.catalogId
    }
    this.initData()
  },
  methods: {
    // 最大字数限制
    checkTinyMax(rule, value, callback) {
      const pureValue = deleteHTMLTag(value)
      if (_.size(pureValue) < 2000) {
        callback()
      } else {
        callback(new Error('最大输入2000字符，已超字数限制！'))
      }
    },
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
    /**
     * 初始选择数据
     */
    initData() {
      let catalogId = _.find(this.formColumns, { prop: 'catalogId' })
      // let tagsList = _.find(this.formColumns, { prop: 'tags' })
      // if (tagsList) {
      //   getKnowledgeManageTaglist().then((res) => {
      //     tagsList.options = res
      //   })
      // }
      if (catalogId) {
        queryCategoryOrgList({ source: 'knowledge' }).then(
          (res) => (catalogId.props.treeParams.data = res)
        )
      }
      if (this.id) {
        this.loadDetail()
      }
    },
    // 点击完成
    handlePublishBtnClick(isContinue = false) {
      this.validate().then(async () => {
        try {
          this.submitting = true
          // 区分是编辑还是新增
          _.isNull(this.id)
            ? await this.createKnowledgeFun(this._formData)
            : await this.updateKnowledgeFun(this._formData)
          this.$message.success('发布成功')
          // 去往列表页
          if (!isContinue) {
            this.$router.push({ path: '/repository/knowledgeManagement' })
          } else {
            // 继续添加
            this.$refs.form.resetFields()
            this.formData.introduction = ''
            // 删除elTree的校验
            this.$nextTick(() => {
              this.clearValidate()
            })
            _.assign(this.$data, this.$options.data())
            this.pageTitle = this.id ? '编辑资源' : '创建资源'
          }
        } catch (error) {
          this.$message.error(error.message)
        } finally {
          this.submitting = false
        }
      })
    },
    handleContinueAdd() {
      this.handlePublishBtnClick(true)
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
        'attachments',
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
.uploader-ul {
  margin-top: 4px;
  .uploader-li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 4px;
    cursor: pointer;
    &:hover {
      color: $primaryColor;
    }
    .uploader-file {
      width: 50%;
    }
  }
}
</style>
