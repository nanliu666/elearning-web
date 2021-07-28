//minix.js
import { queryStation } from '@/api/system/station'
import { getOrgTree } from '@/api/org/org'
export default {
  data() {
    return {}
  },
  methods: {
    //获取组织名称
    loadTree(parentOrgId = '0') {
      getOrgTree({ parentOrgId }).then((data) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'orgId') {
            val.config.treeParams.data = data || []
          }
        })
      })
    },
    //获取岗位
    loadPosition() {
      queryStation().then((res) => {
        this.searchConfig.popoverOptions.forEach((val) => {
          if (val.field === 'positionId') {
            val.config.treeParams.data = res || []
          }
        })
      })
    }
  }
}
