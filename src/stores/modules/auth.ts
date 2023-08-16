import {
  login,
  logout
} from '@/api/auth'
import router from '@/router'
import { login as loginRoute } from '@/router/routes/auth'
import { User } from '@/typings/models/user.type'

interface State {
  user?: User,
  token?: string
}

const state = (): State => ({
  user: null,
  token: null
})

const getters = {
  user (state: State): User {
    return state.user
  },
  token (state: State): string {
    return state.token
  },
  isLoggedIn (state: State) {
    return state.token !== null
  },
  hasPermission (state: State) {
    return (module, method) => {
      if (!state.user || !state.user.role) {
        return false
      }
      const found = state.user?.role?.permissions?.find(item => {
        if (Array.isArray(method)) {
          return item.module === module && method.includes(item.method)
        }
        return item.module === module && item.method === method
      })
      return !!found
    }
  }
}

const mutations = {
  setLogin (state: State, value: State) {
    state.user = value.user
    state.token = value.token
  },
  setLogout (state: State) {
    state.user = null
    state.token = null
    router.replace(loginRoute)
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
