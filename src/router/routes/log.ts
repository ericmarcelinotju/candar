export const logList = {
  path: '/log',
  name: 'log',
  component: () => import(/* webpackChunkName: 'p-log-list' */ '@/pages/log/List.vue'),
  meta: {
    auth: true,
    title: 'Log'
  }
}
