import { RouteRecordRaw } from 'vue-router'
import { userCreate, userEdit, userList } from './user'
import { roleCreate, roleEdit, roleList } from './role'
import { forgotPassword, login, logout, resetPassword } from './auth'
import { permissionCreate, permissionEdit, permissionList } from './permission'
import { logList } from './log'
import { inspectionCreate, inspectionDetail, inspectionEdit, inspectionList } from './inspection'
import { deviceCreate, deviceEdit, deviceList } from './device'
import { deviceTypeCreate, deviceTypeEdit, deviceTypeList } from './deviceType'
import { locationCreate, locationEdit, locationList } from './location'
import { articleCreate, articleEdit, articleList } from './article'

export const dashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: () => import(/* webpackChunkName: 'p-dashboard */ '@/pages/Dashboard.vue'),
  meta: {
    auth: true,
    title: 'Dashboard'
  }
}

export const settingRoute: RouteRecordRaw = {
  path: '/setting',
  name: 'setting',
  component: () => import(/* webpackChunkName: 'p-setting' */ '@/pages/setting/Setting.vue'),
  meta: {
    auth: true,
    title: 'Setting'
  }
}

export const maintenanceRoute: RouteRecordRaw = {
  path: '/maintenance',
  name: 'maintenance',
  component: () => import(/* webpackChunkName: 'p-maintenance' */ '@/pages/Maintenance.vue'),
  meta: {
    auth: true,
    title: 'Maintenance'
  }
}

export const forbiddenRoute: RouteRecordRaw = {
  path: '/forbidden',
  name: 'forbidden',
  component: () => import(/* webpackChunkName: 'c-forbidden */ '@/pages/error/Forbidden.vue'),
  meta: { title: 'Forbidden' }
}

export const notFoundRoute: RouteRecordRaw = {
  path: '/404',
  name: 'not-found',
  component: () => import(/* webpackChunkName: 'c-not-found */ '@/pages/error/NotFound.vue'),
  meta: { title: 'Not Found' }
}

export const authRoutes: RouteRecordRaw[] = [
  login,
  logout,
  forgotPassword,
  resetPassword
]

export const userRoutes: Record<string, RouteRecordRaw> = {
  list: userList,
  create: userCreate,
  edit: userEdit
}

export const roleRoutes: Record<string, RouteRecordRaw> = {
  list: roleList,
  create: roleCreate,
  edit: roleEdit
}

export const inspectionRoutes: Record<string, RouteRecordRaw> = {
  list: inspectionList,
  create: inspectionCreate,
  edit: inspectionEdit,
  detail: inspectionDetail
}

export const workRoute = {
  path: '/work/:id',
  name: 'work',
  component: () => import(/* webpackChunkName: 'p-work' */ '@/pages/work/Work.vue'),
  meta: {
    auth: true,
    title: 'Start Inspection'
  }
}

export const permissionRoutes: Record<string, RouteRecordRaw> = {
  list: permissionList,
  create: permissionCreate,
  edit: permissionEdit
}

export const logRoutes: Record<string, RouteRecordRaw> = {
  list: logList
}

export const deviceRoutes: Record<string, RouteRecordRaw> = {
  list: deviceList,
  create: deviceCreate,
  edit: deviceEdit
}

export const deviceTypeRoutes: Record<string, RouteRecordRaw> = {
  list: deviceTypeList,
  create: deviceTypeCreate,
  edit: deviceTypeEdit
}

export const locationRoutes: Record<string, RouteRecordRaw> = {
  list: locationList,
  create: locationCreate,
  edit: locationEdit
}

export const articleRoutes: Record<string, RouteRecordRaw> = {
  list: articleList,
  create: articleCreate,
  edit: articleEdit
}
