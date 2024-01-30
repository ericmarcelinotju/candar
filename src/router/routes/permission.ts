export const permissionList = {
  path: '/permission',
  name: 'permission',
  component: () => import(/* webpackChunkName: 'p-permission-list' */ '@/pages/permission/List.vue'),
  meta: {
    auth: true,
    title: 'Permission'
  }
}

const PermissionCreateEdit = () => import(/* webpackChunkName: 'p-permission-create-edit' */ '@/pages/permission/CreateEdit.vue')

export const permissionCreate = {
  path: '/permission/create',
  name: 'permission-create',
  component: PermissionCreateEdit,
  meta: {
    auth: true,
    title: 'Permission Create'
  }
}

export const permissionEdit = {
  path: '/permission/edit/:id',
  name: 'permission-edit',
  component: PermissionCreateEdit,
  meta: {
    auth: true,
    title: 'Permission Edit'
  }
}
