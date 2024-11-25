import RouterView from '@/components/RouterView.vue'

export const categoryList = {
  path: '',
  name: 'variant-category',
  component: () => import(/* webpackChunkName: 'p-variant-category-list' */ '@/pages/product/variant/category/List.vue'),
  meta: {
    auth: true,
    title: 'Variant Category'
  }
}

const VariantCategoryCreateEdit = () => import(/* webpackChunkName: 'p-variant-category-create-edit' */ '@/pages/product/variant/category/CreateEdit.vue')

export const categoryCreate = {
  path: 'create',
  name: 'variant-category-create',
  component: VariantCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Create Variant Category'
  }
}

export const categoryEdit = {
  path: 'edit/:id',
  name: 'variant-category-edit',
  component: VariantCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Variant Category'
  }
}

export const categoryRoute = {
  path: 'category',
  redirect: 'category',
  component: RouterView,
  children: [
    categoryList,
    categoryCreate,
    categoryEdit
  ],
  meta: {
    title: 'Category'
  }
}
