import { createApp } from 'vue'
// import { registerSW } from 'virtual:pwa-register'
import Notifications from 'notiwind'

import App from './App.vue'
import DefaultSearch from './components/default/Search.vue'
import DefaultModal from './components/default/Modal.vue'
import DefaultPage from './components/default/Page.vue'
import Loading from './components/helper/Loading.vue'
import router from './router'
import stores from './stores'
import i18n from './plugins/i18n'

/** styling */
import '@/assets/scss/main.scss'

const initApp = () => {
  console.log('[atum] initializing vue app...')
  /** register service worker */
  // registerSW()

  createApp(App)
    .use(router)
    .use(stores)
    .use(i18n)
    .use(Notifications)
    .component('DefaultSearch', DefaultSearch)
    .component('DefaultModal', DefaultModal)
    .component('DefaultPage', DefaultPage)
    .component('Loading', Loading)
    .mount('#app')
}

initApp()

// /** api mocks */
// import('@/api-mock')
//   .then(initApp)
//   .catch(err => console.log('[atum] error creating vue-app:\n', err))
