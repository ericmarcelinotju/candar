import RouterView from '@/components/RouterView.vue'

export const logList = {
  path: '',
  name: 'log',
  component: () => import(/* webpackChunkName: 'p-log-list' */ '@/pages/log/List.vue'),
  meta: {
    auth: true,
    title: 'Log'
  }
}

export const logRoutes = {
  path: 'log',
  redirect: 'log',
  component: RouterView,
  children: [
    logList
  ],
  meta: {
    title: 'Log'
  }
}
