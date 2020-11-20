<template>
  <div
    ref="wrapper"
    class="NewsEdit wrapper"
  >
    <page-header
      title="创建资源"
      :back="() => handleBack()"
      show-back
    />

    <basic-container
      v-loading="loading"
      block
    >
      <common-form
        ref="form"
        :columns="formColumns"
        :model="formData"
      >
        <template #attachments>
          <common-upload
            v-model="uploader.fileList"
            :limit="uploader.limit"
            class="uploader"
          >
            <template #default>
              <div
                v-if="_.size(uploader.fileList) < uploader.limit"
                style="display: flex;"
              >
                <el-button>上传</el-button>
              </div>
            </template>
            <template slot="tip">
              <span class="uploader__description">
                支持上传png、jpg、jpge格式文件，单个文件大小＜5MB，最多5个文件
              </span>
            </template>
          </common-upload>
        </template>
        <template #download>
          <el-switch v-model="allow_download_swtich" />
        </template>
      </common-form>

      <div class="container__editor">
        <tinymce v-model="formData.introduction" />
      </div>

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
          size="medium"
          @click="() => handleContinueAdd()"
        >
          完成并继续添加
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  addKnowledgeList,
  updateKnowledge,
  getKnowledgeManageTaglist,
  getKnowledgeCatalogList,
  getKnowledgeManageDetails
} from '@/api/knowledge/knowledge'
import CommonUpload from '@/components/common-upload/commonUpload'
import { mapGetters } from 'vuex'
// 接口需要的参数
const API_PARAMS = [
  'id',
  'resName',
  'catalogId',
  'uploadType',
  'resUrl',
  'introduction',
  'provideName',
  'allow_download',
  'attachments'
]

export default {
  name: 'KnowledgeEdit',
  components: {
    CommonUpload
  },

  data() {
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
        label: '所在目录',
        itemType: 'treeSelect',
        prop: 'catalogId',
        required: true,
        span: 11,
        offset: 1,
        props: {
          selectParams: {
            placeholder: '请选择所在目录',
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
        prop: 'provideName',
        span: 11,
        offset: 0
      },
      {
        itemType: 'select',
        label: '添加标签',
        prop: 'tags',
        required: false,
        filterable: true,
        multiple: true,
        props: {
          label: 'name',
          value: 'id'
        },
        options: [],
        span: 11,
        offset: 1
      },
      {
        itemType: 'radio',
        label: '上传模式',
        prop: 'uploadType',
        required: true,
        span: 12,
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
      },
      {
        itemType: 'slot',
        label: '是否允许下载',
        prop: 'download',
        required: false,
        span: 12
      }
    ]
    const UPLOAD_FILE = {
      itemType: 'slot',
      label: '附件',
      prop: 'attachments',
      props: {
        label: 'jobName',
        value: 'id'
      },
      required: true,
      span: 24
    }
    const UPLOAD_INPUT = {
      itemType: 'input',
      label: '资源路径',
      prop: 'resUrl',
      required: true,
      span: 24
    }
    return {
      UPLOAD_FILE,
      UPLOAD_INPUT,
      formColumns: FORM_COLUMNS,
      loading: false,
      allow_download_swtich: true,
      formData: {
        resName: '',
        catalogId: '',
        provideName: '',
        tags: [],
        uploadType: 0, // 0本地文件 1链接文件
        resUrl: '',
        allow_download: 0, //是否运行下载 0允许 1不允许
        introduction: '',
        attachments: []
      },
      uploader: {
        fileList: [],
        limit: 5,
        loading: false,
        previewVisible: false,
        progress: 0
      },
      submitting: false,
      hasEdit: false // 用于标记是否进行了修改
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  computed: {
    // 查询参数
    _formData() {
      const formData = _.cloneDeep(this.formData)
      formData.introduction = _.escape(formData.introduction)
      return _(null)
        .assign(formData)
        .pick(API_PARAMS)
        .value()
    },
    id() {
      return this.$route.query.id || null
    },
    ...mapGetters(['tag'])
  },

  watch: {
    allow_download_swtich: {
      handler(val) {
        this.formData.allow_download = val ? 0 : 1
      }
    },
    // 上传模式变化
    'formData.uploadType': {
      deep: true,
      immediate: true,
      handler(val) {
        this.formColumns[6] = val === 0 ? this.UPLOAD_FILE : this.UPLOAD_INPUT
      }
    },
    // 同步uploader与表单
    'uploader.fileList'(val) {
      const file = _.head(val)
      const url = _.get(file, 'fileUrl', null)
      this.$set(this.formData, 'attachments', url)
    },

    formData: {
      deep: true,
      handler() {
        this.clearValidate()
        this.hasEdit = true
      }
    }
  },

  mounted() {
    this.initData()
  },
  methods: {
    /**
     * 初始选择数据
     */
    initData() {
      let catalogId = _.find(this.formColumns, { prop: 'catalogId' })
      let tagsList = _.find(this.formColumns, { prop: 'tags' })
      if (tagsList) {
        getKnowledgeManageTaglist().then((res) => {
          tagsList.options = res
        })
      }
      if (catalogId) {
        getKnowledgeCatalogList().then((res) => (catalogId.props.treeParams.data = res))
      }
    },
    // 点击完成
    handlePublishBtnClick() {
      this.validate()
        .then(async () => {
          try {
            this.submitting = true
            // 区分是编辑还是新增
            _.isNull(this.id)
              ? await this.createKnowledgeFun(_.pickBy(this._formData))
              : await this.updateKnowledgeFun(_.pickBy(this._formData))
            this.$message.success('发布成功')
            this.hasEdit = false
            this.handleBack()
          } catch (error) {
            this.$message.error(error.message)
          } finally {
            this.submitting = false
          }
        })
        .catch(() => {
          this.$message.error('请填写完整必填项')
        })
    },
    handleContinueAdd() {},
    handleBack() {
      this.$router.back()
      this.$store.commit('DEL_TAG', this.tag)
      // this.handleLeave().then(() => {
      //   this.$router.back()
      //   this.$store.commit('DEL_TAG', this.tag)
      // })
    },
    handleUploaderRemove() {
      this.uploader.fileList = []
    },
    // 处理用户离开进行保存等相关操作
    async handleLeave() {
      // 如果表单为空 或 用户没有对数据进行编辑
      if (
        _(this.formData)
          .pickBy()
          .isEmpty() ||
        !this.hasEdit
      ) {
        return
      } else {
        try {
          await this.$confirm(
            '是否对已编辑的内容进行保存，保存的新闻可以在草稿箱中重新编辑',
            '提示',
            {
              confirmButtonText: '保存',
              cancelButtonText: '不保存',
              type: 'warning'
            }
          )
        } catch (error) {
          // 不保存操作
        }
      }
    },
    // 加载详细
    async loadDetail(id = this.id) {
      this.loading = true
      const data = _(await getKnowledgeManageDetails({ id }))
        .pick(API_PARAMS)
        .omit('id')
        .value()
      for (let key in data) {
        this.$set(this.formData, key, data[key])
      }
      this.formData.introduction = _.unescape(this.formData.introduction) // 反转义获取 dom
      this.loading = false
      // 修改了formData 重置标记
      this.$nextTick(() => (this.hasEdit = false))
      return data
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
      this.loading = true
      const data = await addKnowledgeList(params)
      this.loading = false
      return data
    },
    // 更新数据
    async updateKnowledgeFun(params) {
      this.loading = true
      await updateKnowledge(_.assign({ id: this.id }, params))
      this.loading = false
      return { id: this.id }
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
  }
  .uploader {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .uploader__description {
      font-size: smaller;
      color: $color_placeholder;
    }
  }
}
.container__buttons {
  margin-top: 1rem;
}
</style>
