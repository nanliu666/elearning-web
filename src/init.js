import store from '@/store'
import router, { resetRouter } from '@/router/router'
export default function() {
  if (!store.getters.userId) {
    return
  }
  store.dispatch('GetUserPrivilege', store.getters.userId).then((menu) => {
    resetRouter()
    router.$avueRouter.formatRoutes(menu, true)
  })
}
