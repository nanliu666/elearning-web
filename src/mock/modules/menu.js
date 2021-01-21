import Mock from 'mockjs'
const modules = require.context('./menu/', true, /\.js$/)
let menuPrivileges = []
modules.keys().forEach((key) => {
  menuPrivileges.push(modules(key).default)
})
_.sortBy(menuPrivileges, 'sort')
/**
 * menuPrivileges是所有菜单权限
 * 已将菜单拆分出去，并按照低保真上的排序以及层级显示
 * orgPrivileges是所有组织，暂时用不到
 *
 * 注意：menuType为Menu的菜单，它的下级menuType只能为Button
 *
 * menuType为Menu的菜单,它的path在页面渲染时会生成对应的路由，所以path的值要和实际文件路径相同
 * 例如：页面文件的路径是：src\views\system\role.vue,它对应的path就是/system/role
 *
 */
const res = {
  resCode: 200,
  success: true,
  response: {
    orgPrivileges: [
      {
        orgId: '1252523599903072257',
        orgName: '百利宏12',
        orgType: 'Company',
        isOwn: 1
      },
      {
        orgId: '1252523599903072259',
        orgName: '广州易宝分公司',
        orgType: 'Company',
        isOwn: 1
      },
      {
        orgId: '1259787152448147458',
        orgName: '出差',
        orgType: 'Company',
        isOwn: 1
      }
    ],
    menuPrivileges
  },
  resMsg: '操作成功'
}

export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/sys/v1/user/menu/privilege' + '.*'), 'get', () => {
    return res
  })
}
