<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="60%"
    @closed="cancel"
  >
    <div
      v-if="flag"
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
          prop="userId"
        >
          <el-option
            v-for="item in expertOptions"
            :key="item.userId"
            :label="item.name"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属专区"
        prop="areaId"
      >
        <el-select
          v-model="form.areaId"
          multiple
        >
          <el-option
            v-for="item in zoneOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
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
        v-if="flag"
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
import { getOrgTreeSearch } from '@/api/org/org'
import { editExpert, addExpert, queryExpert } from '@/api/community/expertDatabase'
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
    zoneOptions: {
      required: true,
      type: Array
    },
    expertId: {
      type: String
    }
  },
  data() {
    return {
      expertOptions: [],
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
      }
    }
  },
  computed: {
    flag() {
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
    }
  },
  async created() {
    const res = await getOrgTreeSearch({
      pageNo: 1,
      pageSize: 999999,
      orgId: 0
    })
    this.expertOptions = res.users
    this.expertInfoClone = _.cloneDeep(this.expertInfo)
  },
  methods: {
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
      this.$refs.form.clearValidate()
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
</style>
