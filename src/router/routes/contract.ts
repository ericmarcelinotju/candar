export const contractList = {
  path: '/contract',
  name: 'contract',
  component: () => import(/* webpackChunkName: 'p-contract-list' */ '@/pages/contract/List.vue'),
  meta: {
    auth: true,
    title: 'Contract'
  }
}

const ContractCreateEdit = () => import(/* webpackChunkName: 'p-contract-create-edit' */ '@/pages/contract/CreateEdit.vue')

export const contractCreate = {
  path: '/contract/create',
  name: 'contract-create',
  component: ContractCreateEdit,
  meta: {
    auth: true,
    title: 'Contract Create'
  }
}

export const contractEdit = {
  path: '/contract/edit/:id',
  name: 'contract-edit',
  component: ContractCreateEdit,
  meta: {
    auth: true,
    title: 'Contract Edit'
  }
}
