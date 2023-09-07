import { RouteRecordRaw } from 'vue-router'
import { forgotPassword, login, logout, resetPassword } from './auth'
import { userCreate, userEdit, userList } from './user'
import { roleCreate, roleEdit, roleList } from './role'
import { permissionCreate, permissionEdit, permissionList } from './permission'
import { clientCreate, clientEdit, clientList } from './client'
import { divisionCreate, divisionEdit, divisionList } from './division'
import { projectCreate, projectEdit, projectList } from './project'
import { logList } from './log'

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

export const permissionRoutes: Record<string, RouteRecordRaw> = {
  list: permissionList,
  create: permissionCreate,
  edit: permissionEdit
}

export const logRoutes: Record<string, RouteRecordRaw> = {
  list: logList
}

export const divisionRoutes: Record<string, RouteRecordRaw> = {
  list: divisionList,
  create: divisionCreate,
  edit: divisionEdit
}

export const clientRoutes: Record<string, RouteRecordRaw> = {
  list: clientList,
  create: clientCreate,
  edit: clientEdit
}

export const projectRoutes: Record<string, RouteRecordRaw> = {
  list: projectList,
  create: projectCreate,
  edit: projectEdit
}
