import RouterView from '@/components/RouterView.vue'

export const clientList = {
  path: '',
  name: 'client',
  component: () => import(/* webpackChunkName: 'p-client-list' */ '@/pages/client/List.vue'),
  meta: {
    auth: true,
    title: 'Client'
  }
}

const ClientCreateEdit = () => import(/* webpackChunkName: 'p-client-create-edit' */ '@/pages/client/CreateEdit.vue')

export const clientCreate = {
  path: 'create',
  name: 'client-create',
  component: ClientCreateEdit,
  meta: {
    auth: true,
    title: 'Create Client'
  }
}

export const clientEdit = {
  path: 'edit/:id',
  name: 'client-edit',
  component: ClientCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Client'
  }
}

const ClientAddressCreateEdit = () => import(/* webpackChunkName: 'p-client-address-create-edit' */ '@/pages/client/address/CreateEdit.vue')

export const clientAddressCreate = {
  path: 'address/create',
  name: 'client-address-create',
  component: ClientAddressCreateEdit,
  meta: {
    auth: true,
    title: 'Client Address Create'
  }
}

export const clientAddressEdit = {
  path: 'address/edit/:id',
  name: 'client-address-edit',
  component: ClientAddressCreateEdit,
  meta: {
    auth: true,
    title: 'Client Address Edit'
  }
}

const ClientContactCreateEdit = () => import(/* webpackChunkName: 'p-client-contact-create-edit' */ '@/pages/client/contact/CreateEdit.vue')

export const clientContactCreate = {
  path: 'contact/create',
  name: 'client-contact-create',
  component: ClientContactCreateEdit,
  meta: {
    auth: true,
    title: 'Client Contact Create'
  }
}

export const clientContactEdit = {
  path: 'contact/edit/:id',
  name: 'client-contact-edit',
  component: ClientContactCreateEdit,
  meta: {
    auth: true,
    title: 'Client Contact Edit'
  }
}

const ClientImport = () => import(/* webpackChunkName: 'p-client-import' */ '@/pages/client/import.vue')

export const clientImport = {
  path: 'import',
  name: 'client-import',
  component: ClientImport,
  meta: {
    auth: true,
    title: 'Import'
  }
}

export const clientRoutes = {
  path: 'client',
  redirect: 'client',
  component: RouterView,
  children: [
    clientList,
    clientCreate,
    clientEdit,
    clientImport,

    clientAddressCreate,
    clientAddressEdit,

    clientContactCreate,
    clientContactEdit
  ],
  meta: {
    title: 'Client'
  }
}
