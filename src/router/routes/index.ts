import { RouteRecordRaw } from 'vue-router'
import { permissionCreate, permissionEdit, permissionList } from './permission'
import { divisionCreate, divisionEdit, divisionList } from './division'
import { projectCreate, projectEdit, projectList } from './project'
import { logList } from './log'
import {
  variantCategoryCreate,
  variantCategoryEdit,
  variantCategoryList,
  variantCreate,
  variantEdit,
  variantList
} from './variant'
import {
  productCategoryCreate,
  productCategoryEdit,
  productCategoryList,
  productCreate,
  productEdit,
  productList,
  productImport
} from './product'
import { quotationCreate, quotationEdit, quotationList } from './quotation'
import { contractCreate, contractEdit, contractList } from './contract'
import { purchaseCreate, purchaseEdit, purchaseList } from './purchase'
import { companyBankCreate, companyBankEdit, companyBankList } from './company-bank'

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

export const variantRoutes: Record<string, RouteRecordRaw> = {
  list: variantList,
  create: variantCreate,
  edit: variantEdit
}

export const contractRoutes: Record<string, RouteRecordRaw> = {
  list: contractList,
  create: contractCreate,
  edit: contractEdit
}

export const productRoutes: Record<string, RouteRecordRaw> = {
  list: productList,
  create: productCreate,
  edit: productEdit,
  import: productImport
}
export const productCategoryRoutes: Record<string, RouteRecordRaw> = {
  list: productCategoryList,
  create: productCategoryCreate,
  edit: productCategoryEdit
}
export const variantCategoryRoutes: Record<string, RouteRecordRaw> = {
  list: variantCategoryList,
  create: variantCategoryCreate,
  edit: variantCategoryEdit
}

export const purchaseRoutes: Record<string, RouteRecordRaw> = {
  list: purchaseList,
  create: purchaseCreate,
  edit: purchaseEdit
}

export const companyBankRoutes: Record<string, RouteRecordRaw> = {
  list: companyBankList,
  create: companyBankCreate,
  edit: companyBankEdit
}

export const projectRoutes: Record<string, RouteRecordRaw> = {
  list: projectList,
  create: projectCreate,
  edit: projectEdit
}

export const quotationRoutes: Record<string, RouteRecordRaw> = {
  list: quotationList,
  create: quotationCreate,
  edit: quotationEdit
}
