import { RouteRecordRaw } from 'vue-router'

export const forbiddenRoute: RouteRecordRaw = {
  path: '/forbidden',
  name: 'forbidden',
  component: () =>
    import(/* webpackChunkName: 'c-forbidden */ '@/pages/error/Forbidden.vue'),
  meta: { title: 'Forbidden' }
}

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () =>
    import(/* webpackChunkName: 'c-not-found */ '@/pages/error/NotFound.vue'),
  meta: { title: 'Not Found' }
}

export const errorRoutes: RouteRecordRaw[] = [
  forbiddenRoute,
  notFoundRoute
]
