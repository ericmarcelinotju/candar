import {
  login,
  logout
} from '@/api/auth'
import router from '@/router'
import { login as loginRoute } from '@/router/routes/auth'
import { User } from '@/typings/models/user.type'

interface State {
  user?: User
}

const state = (): State => ({
  user: null
})

const getters = {
  user (state: State): User {
    return state.user
  },
  isManager (state: State): boolean {
    return state.user?.role?.isManager
  },
  isLoggedIn (state: State): boolean {
    return !!state.user
  },
  hasClicked (state: State) {
    return !!state.user?.notification
  },
  hasPermission (state: State) {
    return (module, method) => {
      if (!state.user || !state.user.role) {
        return false
      }
      const found = state.user?.role?.permissions?.find(item => {
        return item.module.toLowerCase() === module.toLowerCase() &&
          item.method.toLowerCase() === method.toLowerCase()
      })
      return !!found
    }
  }
}

const mutations = {
  setLogin (state: State, value: State) {
    value.user.notification = false
    state.user = value.user
  },
  setLogout (state: State) {
    state.user = null
    router.replace(loginRoute)
  },
  setClickNotif (state: State) {
    state.user.notification = true
  }
}

const actions = {
  login ({ commit }, data) {
    return login(data)
      .then((res) => {
        commit('setLogin', res.data)
        return res
      })
  },
  logout ({ commit }) {
    return logout()
      .finally(() => {
        commit('setLogout')
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
