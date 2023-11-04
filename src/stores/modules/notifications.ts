import { Notification } from '@/typings/models/notification.type'
import { get as getNotifications } from '@/api/notification'

interface State {
    notification?: Notification[]
}

const state = (): State => ({
  notification: []
})

const getters = {
  getNotification (state: State): Notification[] {
    console.log(state.notification)
    return state.notification
  }
}

const mutations = {
  setNotifications (state: State, value: Notification[]) {
    state.notification = [...value]
  }
}

const actions = {
  getNotifications ({ commit }) {
    return getNotifications()
      .then((res) => {
        commit('setNotifications', res.data?.data)
        return res
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
