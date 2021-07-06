import store from '@/store'
import router, { resetRouter } from '@/router/router'
import { fulllist as getApprList } from '@/api/approvalCenter/approvalCenter'
import { filterTree } from '@/util/util'

// 更新菜单数据里待我审批菜单的menuName,添加待审批数量
export const updateWaitApprCount = async (count) => {
  const userId = store.getters.userId
  if (!userId) {
    return
  }
  let totalNum
  if (!count) {
    const prarams = { userId, pageNo: 1, pageSize: 1, status: 'Approve' }
    const res = await getApprList(prarams)
    totalNum = res.totalNum
  } else {
    totalNum = count
  }
  const menuAll = _.cloneDeep(store.getters.menuAll)
  const waitApprMenu = filterTree(
    menuAll,
    (menu) => menu.path == '/approvalCenter/center' || menu.menuName == '课程审核',
    true
  )[0]
  if (!waitApprMenu) {
    return
  }
  waitApprMenu.menuName = totalNum ? `课程审核（${totalNum}）` : waitApprMenu.menuName
  store.commit('SET_MENU_ALL', menuAll)
}

export default function() {
  if (!store.getters.userId) {
    return
  }
  if (!store.getters.token) {
    return
  }
  setTimeout(() => {
    store.dispatch('tokeLogin', store.getters.token).then((res) => {
      if (res.account) {
        resetRouter()
        store.dispatch('GetUserPrivilege', res.user_id).then((menu) => {
          router.$avueRouter.formatRoutes(menu, true)
        })
      }
    })
  }, 2000)  
}
