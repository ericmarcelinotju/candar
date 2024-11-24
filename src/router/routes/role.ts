import RouterView from '@/components/RouterView.vue'

export const roleList = {
  path: '',
  name: 'role',
  component: () => import(/* webpackChunkName: 'p-role-list' */ '@/pages/role/List.vue'),
  meta: {
    auth: true,
    title: 'Role'
  }
}

const RoleCreateEdit = () => import(/* webpackChunkName: 'p-role-create-edit' */ '@/pages/role/CreateEdit.vue')

export const roleCreate = {
  path: 'create',
  name: 'role-create',
  component: RoleCreateEdit,
  meta: {
    auth: true,
    title: 'Create Role'
  }
}

export const roleEdit = {
  path: 'edit/:id',
  name: 'role-edit',
  component: RoleCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Role'
  }
}

export const roleRoutes = {
  path: 'role',
  redirect: 'role',
  component: RouterView,
  children: [
    roleList,
    roleCreate,
    roleEdit
  ],
  meta: {
    title: 'Role'
  }
}
