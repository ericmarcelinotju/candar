export const variantList = {
  path: '',
  name: 'variant',
  component: () => import(/* webpackChunkName: 'p-variant-list' */ '@/pages/product/variant/List.vue'),
  meta: {
    auth: true,
    title: 'Variant'
  }
}

const VariantCreateEdit = () => import(/* webpackChunkName: 'p-variant-create-edit' */ '@/pages/product/variant/CreateEdit.vue')

export const variantCreate = {
  path: 'create',
  name: 'variant-create',
  component: VariantCreateEdit,
  meta: {
    auth: true,
    title: 'Create Variant'
  }
}

export const variantEdit = {
  path: 'edit/:id',
  name: 'variant-edit',
  component: VariantCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Variant'
  }
}
