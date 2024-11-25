import RouterView from '@/components/RouterView.vue'

export const contractList = {
  path: '',
  name: 'contract',
  component: () => import(/* webpackChunkName: 'p-contract-list' */ '@/pages/contract/List.vue'),
  meta: {
    auth: true,
    title: 'Contract'
  }
}

const ContractCreateEdit = () => import(/* webpackChunkName: 'p-contract-create-edit' */ '@/pages/contract/CreateEdit.vue')

export const contractCreate = {
  path: 'create',
  name: 'contract-create',
  component: ContractCreateEdit,
  meta: {
    auth: true,
    title: 'Create Contract'
  }
}

export const contractEdit = {
  path: 'edit/:id',
  name: 'contract-edit',
  component: ContractCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Contract'
  }
}

export const contractRoute = {
  path: 'contract',
  redirect: 'contract',
  component: RouterView,
  children: [
    contractList,
    contractCreate,
    contractEdit
  ],
  meta: {
    title: 'Contract'
  }
}
