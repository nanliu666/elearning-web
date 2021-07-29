<template>
  <div class="f1">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="活动名称">
        <flat-tree
          v-model="flatData"
          :options="options"
        ></flat-tree>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select
          v-model="form.region"
          placeholder="请选择活动区域"
        >
          <el-option
            label="区域一"
            value="shanghai"
          ></el-option>
          <el-option
            label="区域二"
            value="beijing"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <treeSelector
      v-model="pppp"
      :tree-params="treeParams"
      :auto-text="'232222'"
      :options="optionsList"
    ></treeSelector>

    <!-- <flat-tree v-model="flatData" :options="options"></flat-tree>     -->
  </div>
</template>
<script>
import flatTree from '@/components/flatTree/flatTree.vue'
import { getStationParent } from '@/api/system/station'
import treeSelector from '@/components/tree-selectorNew/index.vue'
// import {getOrganization} from '@/api/org/org'
import { getorganizationNew } from '@/api/org/org'
export default {
  name: 'FlatTreeDemo',
  components: {
    flatTree,
    treeSelector
  },
  data: function() {
    return {
      flatData: [],
      form: {},
      pppp: '222',
      options: {
        elType: 'station', //组件类型 station 岗位 ；organization 组织
        value: 'name', // input显示的内容
        requestFn: getStationParent //请求数据绑定的api
      },
      optionsList: [
        {
          orgId: '1',
          orgName: '上海易宝有限公司',
          orgType: 'Enterprise',
          orgCode: 'A100',
          userNum: 1413,
          workNum: 1413,
          sort: 100,
          remark: 'ePRO Learning',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1385067797654032385',
              workNo: '000797',
              userName: '测试直播的讲师',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: true,
          userId: '1385067797654032385',
          level: '',
          parentId: '0',
          id: '1'
        },
        {
          orgId: '3',
          orgName: '多层级企业',
          orgType: 'Enterprise',
          orgCode: 'A101',
          userNum: 12,
          workNum: 12,
          sort: 101,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '3'
        },
        {
          orgId: '4',
          orgName: '思思',
          orgType: 'Enterprise',
          orgCode: 'A102',
          userNum: 26,
          workNum: 26,
          sort: 102,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '4'
        },
        {
          orgId: '5',
          orgName: '@电器',
          orgType: 'Enterprise',
          orgCode: 'A103',
          userNum: 1194,
          workNum: 1194,
          sort: 103,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '5'
        },
        {
          orgId: '10',
          orgName: '徐工有限公司',
          orgType: 'Enterprise',
          orgCode: 'A104',
          userNum: 105,
          workNum: 105,
          sort: 104,
          remark: '',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1404644172157194241',
              workNo: '015630',
              userName: '胡焕苗',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: true,
          userId: '1404644172157194241',
          level: '',
          parentId: '0',
          id: '10'
        },
        {
          orgId: '5257',
          orgName: '泽学院',
          orgType: 'Company',
          orgCode: 'A105',
          userNum: 7,
          workNum: 7,
          sort: 105,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '5257'
        },
        {
          orgId: '5305',
          orgName: '新部门',
          orgType: 'Company',
          orgCode: 'A106',
          userNum: 0,
          workNum: 0,
          sort: 106,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: false,
          userId: '',
          level: '',
          parentId: '0',
          id: '5305'
        },
        {
          orgId: '5590',
          orgName: '软件部',
          orgType: 'Company',
          orgCode: 'A107',
          userNum: 16,
          workNum: 16,
          sort: 107,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '5590'
        },
        {
          orgId: '1367046126150205442',
          orgName: 'js',
          orgType: 'Department',
          orgCode: 'A108',
          userNum: 1,
          workNum: 1,
          sort: 108,
          remark: '1111',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1366928384482983937',
              workNo: '0199',
              userName: '测试添加用户',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: false,
          userId: '1366928384482983937',
          level: '',
          parentId: '0',
          id: '1367046126150205442'
        },
        {
          orgId: '1369914114469552129',
          orgName: '父辈组织1',
          orgType: 'Company',
          orgCode: 'A109',
          userNum: 12,
          workNum: 12,
          sort: 109,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1369914114469552129'
        },
        {
          orgId: '1385133452264755203',
          orgName: '易宝智能',
          orgType: 'Enterprise',
          orgCode: 'A110',
          userNum: 9,
          workNum: 9,
          sort: 110,
          remark: 'epro smart',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1386511000071622657',
              workNo: '000805',
              userName: '易宝智能总经理',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: true,
          userId: '1386511000071622657',
          level: '',
          parentId: '0',
          id: '1385133452264755203'
        },
        {
          orgId: '1385133452264755204',
          orgName: '易宝智能-1',
          orgType: 'Enterprise',
          orgCode: 'A111',
          userNum: 2,
          workNum: 2,
          sort: 111,
          remark:
            '11010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911010119000101100911',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1385133452264755204'
        },
        {
          orgId: '1385133452264755205',
          orgName: '单层级组织-企业',
          orgType: 'Enterprise',
          orgCode: 'A112',
          userNum: 10,
          workNum: 10,
          sort: 112,
          remark: 'epro learning',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1385133452264755205'
        },
        {
          orgId: '1387307412053053445',
          orgName: 'tjTest企业',
          orgType: 'Enterprise',
          orgCode: 'A113',
          userNum: 14,
          workNum: 14,
          sort: 113,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1387307412053053445'
        },
        {
          orgId: '1387713402248245789',
          orgName: '第二轮测试企业',
          orgType: 'Enterprise',
          orgCode: 'A114',
          userNum: 41,
          workNum: 41,
          sort: 114,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1387713402248245789'
        },
        {
          orgId: '1388748875071300001',
          orgName: '独立营企业',
          orgType: 'Enterprise',
          orgCode: 'A115',
          userNum: 3,
          workNum: 3,
          sort: 115,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1388748875071300001'
        },
        {
          orgId: '1391961357049397251',
          orgName: '易思训测试组织',
          orgType: 'Enterprise',
          orgCode: 'A116',
          userNum: 20,
          workNum: 20,
          sort: 116,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: false,
          userId: '',
          level: '',
          parentId: '0',
          id: '1391961357049397251'
        },
        {
          orgId: '1407332400161116161',
          orgName: '测试的',
          orgType: 'Department',
          orgCode: 'A117',
          userNum: 0,
          workNum: 0,
          sort: 117,
          remark: '测试',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1395297763188572162',
              workNo: '015516',
              userName: '管理员3',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: true,
          userId: '1395297763188572162',
          level: '',
          parentId: '0',
          id: '1407332400161116161'
        },
        {
          orgId: '1407335036721582082',
          orgName: '测试的1',
          orgType: 'Department',
          orgCode: 'A118',
          userNum: 0,
          workNum: 0,
          sort: 118,
          remark: '测试',
          parentOrgId: '0',
          leaders: [
            {
              userId: '1395297763188572162',
              workNo: '015516',
              userName: '管理员3',
              level: ''
            }
          ],
          scopeFlag: '',
          hasChildren: false,
          userId: '1395297763188572162',
          level: '',
          parentId: '0',
          id: '1407335036721582082'
        },
        {
          orgId: '1410845018385666050',
          orgName: '徐工集团工程机械有限公司',
          orgType: 'Enterprise',
          orgCode: 'A119',
          userNum: 4,
          workNum: 4,
          sort: 119,
          remark: '徐工有限',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: true,
          userId: '',
          level: '',
          parentId: '0',
          id: '1410845018385666050'
        },
        {
          orgId: '1411955926759378946',
          orgName: '搞事情23',
          orgType: 'Enterprise',
          orgCode: 'A120',
          userNum: 2,
          workNum: 2,
          sort: 120,
          remark: '',
          parentOrgId: '0',
          leaders: [],
          scopeFlag: '',
          hasChildren: false,
          userId: '1396665409398153218',
          level: '',
          parentId: '0',
          id: '1411955926759378946'
        }
      ],
      // selectOption:{
      //   type: 'treeSelect',
      //   field: 'parentId',
      //   label: '',
      //   data: '',
      //   config: {
      //     selectParams: {
      //       placeholder: '请输入内容',
      //       multiple: false,
      //     },
      //     treeParams: {
      //       data: [],
      //       'check-strictly': true,
      //       'default-expand-all': false,
      //       'expand-on-click-node': false,
      //       clickParent: true,
      //       load:this.loadSelectTreeFn,
      //       lazy:true,
      //       filterable: false,
      //       'show-checkbox':true,
      //       props: {
      //         isLeaf:'hasChildren',
      //         children: 'children',
      //         label: 'orgName',
      //         disabled: 'disabled',
      //         value: 'orgId'
      //       }
      //     }
      //   }
      // },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        load: this.loadSelectTreeFn,
        lazy: true,
        filterable: false,
        'show-checkbox': false,
        props: {
          isLeaf: 'hasChildren',
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'orgId'
        }
      }
    }
  },
  methods: {
    async loadSelectTreeFn(node, resolve) {
      //  懒加载下拉树数据
      if (this.$refs.tree != undefined) this.checkedKeys = this.$refs.tree.getCheckedKeys()
      let params = { parentId: node.data && node.data.id ? node.data.id : '0' }
      getorganizationNew(params).then((res) => {
        // res.map(val=>val.hasChildren=true)
        resolve(res)
      })
      if (this.$refs.tree != undefined) this.$refs.tree.setCheckedKeys(this.checkedKeys)
    }
  }
}
</script>
<style scoped>
.f1 {
  width: 500px;
  margin: 50px 0 0 30px;
}
</style>
