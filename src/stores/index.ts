import { createLogger, createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import { config } from '@/config'
import main from './main'
import auth from './modules/auth'
import columns from './modules/columns'

// TODO :: use pinia

const isProduction = config.environment === 'production'

const vuexLocal = new VuexPersistence({
  modules: ['auth', 'log', 'fields'],
  key: config.appShortName
})

const modules = {
  auth,
  columns
}

export default createStore({
  state: main.state,
  mutations: main.mutations,
  actions: main.actions,
  getters: main.getters,
  modules,
  strict: isProduction,
  plugins: isProduction ? [vuexLocal.plugin] : [createLogger(), vuexLocal.plugin]
})
