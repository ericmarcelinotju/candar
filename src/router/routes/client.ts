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

const ClientAddressCreateEdit = () => import(/* webpackChunkName: 'p-client-address-create-edit' */ '@/pages/client/address/CreateEdit.vue')

export const clientAddressCreate = {
  path: '/client/address/create',
  name: 'client-address-create',
  component: ClientAddressCreateEdit,
  meta: {
    auth: true,
    title: 'Client Address Create'
  }
}

export const clientAddressEdit = {
  path: '/client/address/edit/:id',
  name: 'client-address-edit',
  component: ClientAddressCreateEdit,
  meta: {
    auth: true,
    title: 'Client Address Edit'
  }
}

const ClientContactCreateEdit = () => import(/* webpackChunkName: 'p-client-contact-create-edit' */ '@/pages/client/contact/CreateEdit.vue')

export const clientContactCreate = {
  path: '/client/contact/create',
  name: 'client-contact-create',
  component: ClientContactCreateEdit,
  meta: {
    auth: true,
    title: 'Client Contact Create'
  }
}

export const clientContactEdit = {
  path: '/client/contact/edit/:id',
  name: 'client-contact-edit',
  component: ClientContactCreateEdit,
  meta: {
    auth: true,
    title: 'Client Contact Edit'
  }
}
