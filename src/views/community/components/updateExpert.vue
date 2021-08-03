<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="60%"
    :before-close="cancel"
    @closed="cancel"
  >
    <div
      v-if="isEdit"
      class="info"
    >
      <div>
        <span class="label">专家</span>
        <span class="content">{{
          expertInfo.name + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + expertInfo.orgName
        }}</span>
      </div>
      <div>
        <span class="label">所属专区 </span>
        <span class="content"> {{ community }}</span>
      </div>
      <div>
        <span class="label">专家介绍</span>
        <span class="content">{{ expertInfo.introduce }}</span>
      </div>
      <div>
        <span class="label">获奖情况 </span>
        <span class="content">{{ expertInfo.rewarded }}</span>
      </div>
    </div>
    <el-form
      v-else
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        label="专家"
        prop="userId"
      >
        <el-select
          v-model="form.userId"
          v-loadmore="() => loadMore(0)"
          filterable
          remote
          :remote-method="(value) => remote(value, 0)"
          @visible-change="(flag) => visibleChange(flag, queryParams[0].search, 0)"
        >
          <el-option
            v-for="item in expertOptions"
            :key="item.userId"
            :label="item.name"
            :value="item.userId"
          ></el-option>
          <el-option
            v-show="flag[0].valve"
            value="1"
            class="loading"
          >
            <i class="el-icon-loading"></i>加载中
          </el-option>
          <el-option
            v-show="flag[0].noData"
            value="1"
            class="ending"
          >
            {{ expertOptions.length === 0 ? '无数据' : '没有更多了' }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属专区"
        prop="areaId"
      >
        <el-select
          ref="areaIdSelect"
          v-model="form.areaId"
          v-loadmore="() => loadMore(1)"
          multiple
          filterable
          remote
          :remote-method="(value) => remote(value, 1)"
          @change="areaIdChange()"
          @visible-change="(flag) => visibleChange(flag, queryParams[1].name, 1)"
        >
          <el-option
            v-for="item in zoneOptions"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          ></el-option>
          <el-option
            v-show="flag[1].valve"
            value="1"
            class="loading"
          >
            <i class="el-icon-loading"></i>加载中
          </el-option>
          <el-option
            v-show="flag[1].noData"
            value="1"
            class="ending"
          >
            {{ zoneOptions.length === 0 ? '无数据' : '没有更多了' }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专家介绍">
        <el-input
          v-model="form.introduce"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="获奖情况">
        <el-input
          v-model="form.rewarded"
          autosize
          type="textarea"
          placeholder="请输入内容"
          maxlength="200"
        ></el-input>
      </el-form-item>
    </el-form>
    <footer>
      <el-button
        v-if="isEdit"
        size="medium"
        type="primary"
        @click="edit"
      >
        编辑
      </el-button>
      <el-button
        v-else
        size="medium"
        type="primary"
        @click="update"
      >
        完成
      </el-button>
      <el-button
        size="medium"
        type="primary"
        @click="cancel"
      >
        取消
      </el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { editExpert, addExpert, queryExpert, queryAllZone } from '@/api/community/expertDatabase'
import { getOrgUserList } from '@/api/system/user'
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    dialogVisible: {
      required: true,
      type: Boolean
    },
    expertId: {
      type: String
    }
  },
  data() {
    return {
      form: {
        userId: '',
        areaId: [],
        introduce: '',
        rewarded: ''
      },
      rules: {
        userId: [{ required: true, message: '请选择专家', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择所属专区', trigger: 'change' }]
      },
      expertInfo: {
        name: '',
        orgName: '',
        communityAreaDropList: [],
        introduce: '',
        rewarded: ''
      },
      expertOptions: [],
      zoneOptions: [],
      flag: [
        { valve: false, noData: false },
        { valve: false, noData: false }
      ],
      queryParams: [
        {
          pageNo: 1,
          pageSize: 20,
          orgId: 0,
          search: '',
          userStatus: '1'
        },
        {
          pageNo: 1,
          pageSize: 20,
          name: ''
        }
      ]
    }
  },
  computed: {
    isEdit() {
      return this.title === '查看专家' ? true : false
    },
    community() {
      let str = this.expertInfo.communityAreaDropList.map((item) => (item = item.name))
      return str.join('/')
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        if (this.title !== '创建专家' && this.expertId)
          queryExpert({ id: this.expertId }).then((res) => {
            this.expertInfo = res
            for (const key in this.form) {
              if (key === 'areaId')
                this.form[key] = res.communityAreaDropList.map((item) => item.id)
              else this.form[key] = res[key]
            }
          })
      }
    },
    'form.areaId'(val) {
      if (val) {
        this.$nextTick(() => {
          let textElement = this.$refs.areaIdSelect.$el.childNodes[0].children[0].children[0]
            .children[0]
          textElement.offsetWidth >= 275 &&
            (textElement.parentElement.title = textElement.innerText)
        })
      }
    }
  },
  created() {
    this.getSelectData(0)
    this.getSelectData(1)
  },
  methods: {
    loadMore(type) {
      if (this.flag[type].valve || this.flag[type].noData) return
      this.flag[type].valve = true
      this.queryParams[type].pageNo++
      this.getSelectData(type)
    },
    remote(v, type) {
      type ? (this.queryParams[type].name = v.trim()) : (this.queryParams[type].search = v.trim())
      this.queryParams[type].pageSize = 20
      this.queryParams[type].pageNo = 1
      type ? (this.zoneOptions = []) : (this.expertOptions = [])
      this.getSelectData(type)
    },
    visibleChange(show, value, type) {
      if (show && value) {
        type ? (this.queryParams[1].name = '') : (this.queryParams[0].search = '')
        this.getSelectData(type)
      }
    },
    getSelectData(type) {
      if (type === 0) {
        getOrgUserList(this.queryParams[0]).then((res) => {
          this.expertOptions.push(...res.data)
          this.flag[type].noData = !res.data.length
          this.flag[type].valve = false
        })
      } else if (type === 1) {
        queryAllZone(this.queryParams[1]).then((res) => {
          this.zoneOptions.push(...res.data)
          this.flag[type].noData = !res.data.length
          this.flag[type].valve = false
        })
      }
    },
    cancel() {
      this.$emit('cancle')
      this.expertInfo = {
        name: '',
        orgName: '',
        communityAreaDropList: [],
        introduce: '',
        rewarded: ''
      }
      this.form = {
        userId: '',
        areaId: [],
        introduce: '',
        rewarded: ''
      }
      this.$refs.form && this.$refs.form.clearValidate()
    },
    async update() {
      await this.$refs.form.validate()
      if (this.title === '编辑专家') {
        let params = {
          ...this.form
        }
        params.areaId = params.areaId = params.areaId.join(',')
        params.id = this.expertId
        await editExpert(params)
      } else {
        let params = {
          ...this.form
        }
        params.areaId = params.areaId = params.areaId.join(',')
        await addExpert(params)
      }
      this.cancel()
    },
    edit() {
      this.title = '编辑专家'
    },
    areaIdChange() {
      let arr = this.zoneOptions.filter((item) => this.form.areaId.includes(item.value))
      arr = arr.map((item) => (item = item.label))
      this.$refs.areaIdSelect.$el.children[0].children[0].title = arr.join(',')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 350px;
}
/deep/.el-form-item__label {
  float: none;
}
::v-deep span.el-tag.el-tag--info.el-tag--small.el-tag--light {
  display: flex;
  align-items: center;
  span.el-select__tags-text {
    max-width: 275px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.info {
  padding: 0 24px;
  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    line-height: 30px;
    .label {
      color: #7c7979;
      font-size: 16px;
    }
    .content {
      color: #000;
      font-size: 16px;
    }
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e3e7e9;
}
::v-deep .el-dialog__body {
  padding: 30px 0;
}
footer {
  text-align: right;
  padding-top: 14px;
  border-top: 1px solid #e3e7e9;
  padding-right: 45px;
}
::v-deep form.el-form {
  padding: 0 24px;
}
::v-deep span.el-tag.el-tag--info.el-tag--small.el-tag--light {
  max-width: 310px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.loading {
  text-align: center;
  color: #ccc;
  pointer-events: none;
  i {
    margin-right: 10px;
  }
}
.ending {
  text-align: center;
  color: #ccc;
  pointer-events: none;
}
</style>
