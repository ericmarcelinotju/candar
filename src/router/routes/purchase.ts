export const purchaseList = {
  path: '/purchase',
  name: 'purchase',
  component: () => import(/* webpackChunkName: 'p-purchase-list' */ '@/pages/purchase/List.vue'),
  meta: {
    auth: true,
    title: 'Purchase'
  }
}

const PurchaseCreateEdit = () => import(/* webpackChunkName: 'p-purchase-create-edit' */ '@/pages/purchase/CreateEdit.vue')

export const purchaseCreate = {
  path: '/purchase/create',
  name: 'purchase-create',
  component: PurchaseCreateEdit,
  meta: {
    auth: true,
    title: 'Create Purchase'
  }
}
