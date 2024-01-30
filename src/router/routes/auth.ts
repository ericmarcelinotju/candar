import { RouteRecordRaw } from 'vue-router'
import { guardGuest } from '../guard'

export const login: RouteRecordRaw = {
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: 'p-login' */ '@/pages/auth/Login.vue'),
  meta: {
    title: 'Login'
  },
  beforeEnter: guardGuest
}

export const logout: RouteRecordRaw = {
  path: '/logout',
  name: 'logout',
  component: () => import(/* webpackChunkName: 'p-logout' */ '@/pages/auth/Logout.vue')
}

export const forgotPassword: RouteRecordRaw = {
  path: '/forgot-password',
  name: 'forgot-password',
  component: () => import(/* webpackChunkName: 'p-forgot-password' */ '@/pages/auth/ForgotPassword.vue'),
  meta: {
    title: 'Forgot Password'
  },
  beforeEnter: guardGuest
}

export const resetPassword: RouteRecordRaw = {
  path: '/reset-password',
  name: 'reset-password',
  component: () => import(/* webpackChunkName: 'p-reset-password' */ '@/pages/auth/ResetPassword.vue'),
  meta: {
    title: 'Reset Password'
  },
  beforeEnter: guardGuest
}
