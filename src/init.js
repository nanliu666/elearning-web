import store from '@/store'
import router from '@/router/router'
export default function() {
  if (!store.getters.userId) {
    return
  }
  store.dispatch('GetUserPrivilege', store.getters.userId).then((menu) => {
    router.$avueRouter.formatRoutes(menu, true)
  })
}
