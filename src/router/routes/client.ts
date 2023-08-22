export const clientList = {
  path: '/client',
  name: 'client',
  component: () => import(/* webpackChunkName: 'p-client-list' */ '@/pages/client/List.vue'),
  meta: {
    auth: true,
    title: 'Client'
  }
}

const ClientCreateEdit = () => import(/* webpackChunkName: 'p-client-create-edit' */ '@/pages/client/CreateEdit.vue')

export const clientCreate = {
  path: '/client/create',
  name: 'client-create',
  component: ClientCreateEdit,
  meta: {
    auth: true,
    title: 'Client Create'
  }
}

export const clientEdit = {
  path: '/client/edit/:id',
  name: 'client-edit',
  component: ClientCreateEdit,
  meta: {
    auth: true,
    title: 'Client Edit'
  }
}
