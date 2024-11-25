import RouterView from '@/components/RouterView.vue'

export const purchaseList = {
  path: '',
  name: 'purchase',
  component: () =>
    import(
      /* webpackChunkName: 'p-purchase-list' */ '@/pages/purchase/List.vue'
    ),
  meta: {
    auth: true,
    title: 'Purchase'
  }
}

const PurchaseCreateEdit = () =>
  import(
    /* webpackChunkName: 'p-purchase-create-edit' */ '@/pages/purchase/CreateEdit.vue'
  )

export const purchaseCreate = {
  path: 'create',
  name: 'purchase-create',
  component: PurchaseCreateEdit,
  meta: {
    auth: true,
    title: 'Purchase Create'
  }
}

export const purchaseEdit = {
  path: 'edit/:id',
  name: 'purchase-edit',
  component: PurchaseCreateEdit,
  meta: {
    auth: true,
    title: 'Purchase Edit'
  }
}

export const purchaseRoute = {
  path: 'purchase',
  redirect: 'purchase',
  component: RouterView,
  children: [
    purchaseList,
    purchaseCreate,
    purchaseEdit
  ],
  meta: {
    title: 'Purchase'
  }
}
