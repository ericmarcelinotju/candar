import RouterView from '@/components/RouterView.vue'

export const permissionList = {
  path: '',
  name: 'permission',
  component: () => import(/* webpackChunkName: 'p-permission-list' */ '@/pages/permission/List.vue'),
  meta: {
    auth: true,
    title: 'Permission'
  }
}

const PermissionCreateEdit = () => import(/* webpackChunkName: 'p-permission-create-edit' */ '@/pages/permission/CreateEdit.vue')

export const permissionCreate = {
  path: 'create',
  name: 'permission-create',
  component: PermissionCreateEdit,
  meta: {
    auth: true,
    title: 'Create Permission'
  }
}

export const permissionEdit = {
  path: 'edit/:id',
  name: 'permission-edit',
  component: PermissionCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Permission'
  }
}

export const permissionRoutes = {
  path: 'permission',
  redirect: 'permission',
  component: RouterView,
  children: [
    permissionList,
    permissionCreate,
    permissionEdit
  ],
  meta: {
    title: 'Permission'
  }
}
