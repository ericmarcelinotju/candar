import RouterView from '@/components/RouterView.vue'

export const userList = {
  path: '',
  name: 'user',
  component: () => import(/* webpackChunkName: 'p-user-list' */ '@/pages/user/List.vue'),
  meta: {
    auth: true,
    title: 'User'
  }
}

const UserCreateEdit = () => import(/* webpackChunkName: 'p-user-create-edit' */ '@/pages/user/CreateEdit.vue')

export const userCreate = {
  path: 'create',
  name: 'user-create',
  component: UserCreateEdit,
  meta: {
    auth: true,
    title: 'Create User'
  }
}

export const userEdit = {
  path: 'edit/:id',
  name: 'user-edit',
  component: UserCreateEdit,
  meta: {
    auth: true,
    title: 'Edit User'
  }
}

const UserImport = () => import(/* webpackChunkName: 'p-user-import' */ '@/pages/user/import.vue')

export const userImport = {
  path: 'import',
  name: 'user-import',
  component: UserImport,
  meta: {
    auth: true,
    title: 'Import User'
  }
}

export const userRoutes = {
  path: 'user',
  redirect: 'user',
  component: RouterView,
  children: [
    userList,
    userCreate,
    userEdit,
    userImport
  ],
  meta: {
    title: 'User'
  }
}
