const state = () => ({
  locale: 'en',
  isMobile: false
})

const mutations = {
  setLocale (state, value: string) {
    state.locale = value
  },
  setIsMobile (state, value: string) {
    state.isMobile = value
  }
}

const actions = {}

const getters = {
  locale (state) {
    return state.locale
  },
  isMobile (state) {
    return state.isMobile
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
