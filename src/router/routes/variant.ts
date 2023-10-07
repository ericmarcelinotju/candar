export const variantList = {
  path: '/variant',
  name: 'variant',
  component: () => import(/* webpackChunkName: 'p-variant-list' */ '@/pages/variant/List.vue'),
  meta: {
    auth: true,
    title: 'Variant'
  }
}

const VariantCreateEdit = () => import(/* webpackChunkName: 'p-variant-create-edit' */ '@/pages/variant/CreateEdit.vue')

export const variantCreate = {
  path: '/variant/create',
  name: 'variant-create',
  component: VariantCreateEdit,
  meta: {
    auth: true,
    title: 'Variant Create'
  }
}

export const variantEdit = {
  path: '/variant/edit/:id',
  name: 'variant-edit',
  component: VariantCreateEdit,
  meta: {
    auth: true,
    title: 'Variant Edit'
  }
}

export const variantCategoryList = {
  path: '/variant-category',
  name: 'variant-category',
  component: () => import(/* webpackChunkName: 'p-variant-category-list' */ '@/pages/variant/category/List.vue'),
  meta: {
    auth: true,
    title: 'Variant Category'
  }
}

const VariantCategoryCreateEdit = () => import(/* webpackChunkName: 'p-variant-category-create-edit' */ '@/pages/variant/category/CreateEdit.vue')

export const variantCategoryCreate = {
  path: '/variant-category/create',
  name: 'variant-category-create',
  component: VariantCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Variant Category Create'
  }
}

export const variantCategoryEdit = {
  path: '/variant-category/edit/:id',
  name: 'variant-category-edit',
  component: VariantCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Variant Category Edit'
  }
}
