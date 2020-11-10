<template>
  <div class="setting-container">
    <commonForm
      ref="elForm"
      :model="formData"
      :columns="info"
    >
      <div slot="initiator">
        <fc-org-select
          ref="org-select"
          v-model="formData.initiator"
          title="发起人"
          :all="all"
          :org="org"
          :type="type"
          empty-text="所有人"
          @change="emitInitiator"
        />
      </div>
      <div slot="processAdmin">
        <fc-org-select
          ref="org-select"
          v-model="formData.processAdmin"
          title="审批管理人"
          :all="all"
          :type="type"
          empty-text="请选择"
        />
      </div>
      <div
        slot="icon"
        class="icon-box"
      >
        <svg
          aria-hidden="true"
          width="40px"
          height="40px"
        >
          <use :[symbolKey]="'#' + selectedIcon" />
        </svg>
        <el-button
          plain
          size="mini"
          style="margin-left: 10px;"
          @click="dialogVisible = true"
        >
          选择图标
        </el-button>
      </div>
    </commonForm>
    <el-dialog
      title="选择图标"
      :visible.sync="dialogVisible"
      width="612px"
    >
      <svg
        v-for="(icon, index) in iconList"
        :key="index"
        aria-hidden="true"
        width="40px"
        height="40px"
        class="icon-item"
        :class="{ active: selectedIcon === icon }"
        @click="selectedIcon = icon"
      >
        <use :[symbolKey]="'#' + icon" />
      </svg>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click=";(dialogVisible = false), (selectedIcon = activeIcon)"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click=";(dialogVisible = false), (activeIcon = selectedIcon)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { info } from './config'
import { getApprCategory, getConfigAdmin } from '@/api/processDesign/basicSetting'

export default {
  components: {},
  // props: ['tabName', 'initiator', 'conf'],
  props: {
    tabName: { type: String, default: '' },
    initiator: { type: Array, default: () => [] },
    conf: { type: Object, default: null }
  },
  data() {
    let iconList = [
      'icondirectories-bicolor',
      'iconleaveoffice-bicolor',
      'iconrecruit-bicolor',
      'icontravel-outlined',
      'iconremind-bicolor',
      'iconinvitation-bicolor',
      'iconcheckin-bicolor',
      'iconbranch-bicolor',
      'iconchange-bicolor',
      'iconinterview-bicolor',
      'iconCC-bicolor',
      'iconleave-bicolor1'
    ]
    return {
      type: {
        istag: true,
        isposition: true
      },
      symbolKey: 'xlink:href',
      info,
      all: true, //显示所有人
      org: true, //可以选择部门
      infoForm: {},
      dialogVisible: false,
      iconList: iconList,
      activeIcon: iconList[0],
      selectedIcon: iconList[0],
      formData: {
        icon: '',
        processName: '',
        categoryId: '',
        processAdmin: [],
        remark: '',
        initiator: []
      },
      rules: {
        flowName: [
          {
            required: true,
            message: '请输入审批名称',
            trigger: 'blur'
          }
        ],
        flowGroup: [
          {
            required: true,
            message: '请选择选择分组',
            trigger: 'change'
          }
        ]
      },
      flowGroupOptions: []
    }
  },
  computed: {
    activeIconSrc() {
      const icon = this.iconList.find((t) => t.id === this.activeIcon)
      return icon ? icon.src : ''
    }
  },
  watch: {
    initiator: {
      handler(val) {
        this.formData.initiator = val || []
      },
      immediate: true
    },
    selectedIcon: {
      handler() {},
      deep: true
    },
    activeIcon: {
      handler() {},
      immediate: true,
      deep: true
    },
    formData: {
      handler() {},
      immediate: true
    },
    conf: {
      handler() {
        if (typeof this.conf === 'object' && this.conf !== null) {
          Object.assign(this.formData, this.conf)
          !Array.isArray(this.formData.processAdmin) &&
            (this.formData.processAdmin = [this.formData.processAdmin])
          this.selectedIcon = this.formData.icon
          this.activeIcon = this.formData.icon
        }
      },
      deep: true
    }
  },
  created() {
    if (typeof this.conf === 'object' && this.conf !== null) {
      Object.assign(this.formData, this.conf)
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    /**
     *  author guanfenda
     *  @desc 获取管理员列表
     * */
    getAdmin() {
      let params = {}
      getConfigAdmin(params).then((res) => {
        this.info.find((it) => it.prop === 'processAdmin').options = res
      })
    },
    /**
     *  author fuanfenda
     *  @desc 获取分类列表
     * */
    getCategory() {
      let params = {
        name: ''
      }
      getApprCategory(params).then((res) => {
        this.info.find((it) => it.prop === 'categoryId').options = res
      })
    },
    // 当基础设置中的发起人发生改变的时候，发出事件通过流程设计页面更新数据
    emitInitiator(data) {
      this.$nextTick(() => {
        this.formData.initiator = data
        this.$emit('initiatorChange', this.formData.initiator, _.map(data, 'bizName').join())
      })
    },
    // 给父级页面提供得获取本页数据得方法
    getData() {
      this.formData.icon = this.activeIcon
      return new Promise((resolve, reject) => {
        this.$refs['elForm']
          .validate()
          .then((valid) => {
            if (!valid) {
              reject({ target: this.tabName })
              return
            }

            resolve({ formData: this.formData, target: this.tabName }) // TODO 提交表单
          })
          .catch(() => {
            this.$emit('jump', 'basicSetting')
          })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.icon-box {
  display: flex;
  align-items: center;
  margin-top: 4px
}
.icon-item{
  width 40px
  height 40px
  margin: 6px;
  position relative
  cursor pointer
  opacity .5

  &.active{
    opacity 1
  }
  &:hover{
    opacity 1
  }
}

.setting-container{
  width: 600px;
  height: 100%;
  margin: auto;
  background: white;
  padding: 16px;

  >>>.el-form--label-top .el-form-item__label{
    padding-bottom: 0;
  }
}
</style>
