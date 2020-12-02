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
            :limit="uploaderLimit"
            :before-upload="beforeUpload"
            @getValue="getValue"
          >
            <template #default>
              <div
                v-if="_.size(formData.attachments) < uploaderLimit"
                style="display: flex;"
              >
                <el-button>上传</el-button>
              </div>
            </template>
          </common-upload>
          <ul class="uploader-ul">
            <li
              v-for="(item, index) in formData.attachments"
              :key="index"
            >
              <span
                class="uploader-file"
                @click.stop="previewFile(item)"
              >{{ item.fileName }}</span>
              <i
                class="el-icon-close"
                @click.stop="deleteUpload(item)"
              />
            </li>
          </ul>
        </template>
        <template #download>
          <el-switch v-model="allow_download_swtich" />
        </template>
      </common-form>

      <div class="container__editor">
        <tinymce
          ref="tinymceRef"
          v-model="formData.introduction"
        />
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
  // getKnowledgeManageTaglist,
  getKnowledgeCatalogList,
  getKnowledgeManageDetails
} from '@/api/knowledge/knowledge'
import CommonUpload from '@/components/common-upload/commonUpload'
import { mapGetters } from 'vuex'

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
        label: '所在分类',
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
        prop: 'providerName',
        span: 11,
        offset: 0
      },
      // {
      //   itemType: 'select',
      //   label: '添加标签',
      //   prop: 'tags',
      //   required: false,
      //   filterable: true,
      //   multiple: true,
      //   props: {
      //     label: 'name',
      //     value: 'id'
      //   },
      //   options: [],
      //   span: 11,
      //   offset: 1
      // },
      {
        itemType: 'slot',
        label: '是否允许下载',
        prop: 'download',
        required: false,
        span: 11,
        offset: 1
      },
      {
        itemType: 'radio',
        label: '上传模式',
        prop: 'uploadType',
        required: true,
        span: 24,
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

    return {
      pageTitle: '',
      formColumns: FORM_COLUMNS,
      allow_download_swtich: true,
      formData: {
        resName: '',
        catalogId: '',
        providerName: '',
        // tags: [],
        uploadType: 0, // 0本地文件 1链接文件
        resUrl: '',
        allow_download: 0, //是否运行下载 0允许 1不允许
        introduction: '',
        attachments: []
      },
      uploaderLimit: 5,
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
        const UPLOAD_FILE = {
          itemType: 'slot',
          label: '附件',
          prop: 'attachments',
          props: {
            label: 'jobName',
            value: 'id'
          },
          required: false,
          span: 12
        }
        var checkAge = (rule, value, callback) => {
          if (!this.checkURL(value)) {
            callback(new Error('正确的url路径'))
          } else {
            callback()
          }
        }
        const UPLOAD_INPUT = {
          itemType: 'input',
          label: '资源路径',
          prop: 'resUrl',
          required: false,
          rules: [{ validator: checkAge, trigger: 'blur' }],
          span: 24
        }
        let index = _.findIndex(this.formColumns, (item) => {
          return item.prop === 'uploadType'
        })
        this.formColumns[index + 1] = val === 0 ? UPLOAD_FILE : UPLOAD_INPUT
      }
    }
  },
  mounted() {
    this.pageTitle = this.id ? '编辑资源' : '创建资源'
    // TODO: 待自测新增分类后进入创建资源
    this.formData.catalogId = this.catalogId
    this.initData()
  },
  methods: {
    // 检测资源路径的格式
    checkURL(URL) {
      var sRegex =
        '^((https|http|ftp|rtsp|mms)?://)' +
        '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + //ftp的user@
        '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
        '|' + // 允许IP和DOMAIN（域名）
        '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
        '[a-z]{2,6})' + // first level domain- .com or .museum
        '(:[0-9]{1,4})?' + // 端口- :80
        '((/?)|' + // a slash isn't required if there is no file name
        '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
      var re = new RegExp(sRegex)
      if (re.test(URL)) {
        return true
      }
      return false
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
      const isLt100M = file.size / 1024 / 1024 < 10
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt100M
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
        getKnowledgeCatalogList().then((res) => (catalogId.props.treeParams.data = res))
      }
      if (this.id) {
        this.loadDetail()
      }
    },
    // 点击完成
    handlePublishBtnClick(isContinue = false) {
      this.validate()
        .then(async () => {
          try {
            this.submitting = true
            // 区分是编辑还是新增
            _.isNull(this.id)
              ? await this.createKnowledgeFun(this._formData)
              : await this.updateKnowledgeFun(this._formData)
            this.$message.success('发布成功')
            this.hasEdit = false
            if (!isContinue) {
              this.handleBack()
            }
            this.$refs.form.resetFields()
            this.formData.introduction = ''
            this.$nextTick(() => {
              this.clearValidate()
            })
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
  }
}
.container__buttons {
  margin-top: 1rem;
}
.uploader-ul {
  margin-top: 4px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    &:hover {
      color: $primaryColor;
    }
  }
}
</style>
