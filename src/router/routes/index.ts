import { RouteRecordRaw } from 'vue-router'

export const dashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: () =>
    import(/* webpackChunkName: 'p-dashboard */ '@/pages/Dashboard.vue'),
  meta: {
    auth: true,
    title: 'Dashboard'
  }
}

export const calendarRoute: RouteRecordRaw = {
  path: '/calendar',
  name: 'calendar',
  component: () =>
    import(/* webpackChunkName: 'p-calendar */ '@/pages/Calendar.vue'),
  meta: {
    auth: true,
    title: 'Calendar'
  }
}

export const settingRoute: RouteRecordRaw = {
  path: '/setting',
  name: 'setting',
  component: () =>
    import(/* webpackChunkName: 'p-setting' */ '@/pages/setting/Setting.vue'),
  meta: {
    auth: true,
    title: 'Setting'
  }
}

export const maintenanceRoute: RouteRecordRaw = {
  path: '/maintenance',
  name: 'maintenance',
  component: () =>
    import(/* webpackChunkName: 'p-maintenance' */ '@/pages/Maintenance.vue'),
  meta: {
    auth: true,
    title: 'Maintenance'
  }
}
