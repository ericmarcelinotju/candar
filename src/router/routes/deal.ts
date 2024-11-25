import RouterView from '@/components/RouterView.vue'

export const dealList = {
  path: '',
  name: 'deal',
  component: () =>
    import(/* webpackChunkName: 'p-deal-list' */ '@/pages/deal/List.vue'),
  meta: {
    auth: true,
    title: 'Deal'
  }
}

const dealCreateEdit = () =>
  import(/* webpackChunkName: 'p-deal-create-edit' */ '@/pages/deal/CreateEdit.vue')

export const dealCreate = {
  path: 'create',
  name: 'deal-create',
  component: dealCreateEdit,
  meta: {
    auth: true,
    title: 'Create Deal'
  }
}

export const dealEdit = {
  path: 'edit/:id',
  name: 'deal-edit',
  component: dealCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Deal'
  }
}

export const dealRoute = {
  path: 'deal',
  redirect: 'deal',
  component: RouterView,
  children: [
    dealList,
    dealCreate,
    dealEdit
  ],
  meta: {
    title: 'Deal'
  }
}
