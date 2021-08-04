<template>
  <div
    v-loading.fullscreen="loading"
    class="writeZone"
  >
    <page-header
      :title="zoneTitle"
      show-back
    />
    <basic-container>
      <keep-alive>
        <component
          :is="component"
          :ref="component"
          :form="form"
          :rules="formRule"
        ></component>
      </keep-alive>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="10">
          <el-button
            v-if="component === 'zoneInfo'"
            size="medium"
            type="primary"
            @click.stop.prevent="next"
          >
            下一步
          </el-button>
          <el-button
            v-if="component === 'relation'"
            size="medium"
            type="primary"
            @click.stop.prevent="component = 'zoneInfo'"
          >
            上一步
          </el-button>
          <el-button
            v-if="component === 'relation'"
            size="medium"
            type="primary"
            @click.stop.prevent="submitZone"
          >
            完成
          </el-button>
          <el-button
            size="medium"
            type="primary"
            @click.stop.prevent="goOut"
          >
            返回
          </el-button>
        </el-col>
        <el-col :span="12" />
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { addZone, quertZone, aditZone } from '@/api/community/zone'
export default {
  components: {
    zoneInfo: () => import('@/views/community/components/zoneInfo.vue'),
    relation: () => import('@/views/community/components/relation.vue')
  },
  data() {
    return {
      form: {
        name: '',
        postRule: '',
        introduce: '',
        headImg: '',
        coverPic: '',
        managerId: [],
        orgIds: [],
        positionIds: [],
        userIds: [],
        managerList: []
      },
      formRule: {
        name: [{ required: true, message: '请输入专区名称', trigger: 'blur' }],
        postRule: [{ required: true, message: '请选择专区发帖规则', trigger: 'change' }],
        introduce: [{ required: true, message: '请输入专区介绍', trigger: 'blur' }],
        headImg: [{ required: true, message: '请上传专区头像' }],
        coverPic: [{ required: true, message: '请上传专区封面' }],
        managerId: [{ required: true, message: '请选择专区管理员', trigger: 'change' }]
      },
      component: 'zoneInfo',
      loading: false
    }
  },
  computed: {
    zoneTitle() {
      return this.$route.query.id ? '编辑专区' : '创建专区'
    }
  },
  async created() {
    if (this.$route.query.id) {
      const res = await quertZone({ id: this.$route.query.id })
      for (const key in this.form) {
        if (key === 'managerId') {
          this.form.managerId = res.managerId.split(/,/g)
        } else if (key === 'orgIds') {
          this.form.orgIds = res.orgList
        } else if (key === 'positionIds') {
          this.form.positionIds = res.positionList
        } else if (key === 'userIds') {
          this.form.userIds = res.userList
        } else {
          this.form[key] = res[key]
        }
      }
    }
  },

  methods: {
    async submitZone() {
      await this.$refs.relation.validate()
      this.loading = true
      const orgIds = this.$refs.relation.departmentList.map((item) => (item = item.id))
      const positionIds = this.$refs.relation.positionList.map((item) => (item = item.positionId))
      const userIds = this.$refs.relation.personList.map((item) => (item = item.bizId))
      const params = {
        ...this.form,
        orgIds,
        positionIds,
        userIds
      }
      params.managerId = params.managerId.join(',')
      try {
        if (this.$route.query.id) await aditZone({ id: this.$route.query.id, ...params })
        else await addZone(params)
      } catch {
        this.loading = false
        return
      }
      this.$message.success('添加成功')
      this.goOut()
    },
    async next() {
      await this.$refs.zoneInfo.validateForm()
      this.component = 'relation'
    },
    goOut() {
      this.loading = false
      this.component = 'zoneInfo'
      this.$router.push('/community/zone')
    }
  },
  beforeRouteEnter(to, form, next) {
    to.meta.$keepAlive = false
    next()
  }
}
</script>
