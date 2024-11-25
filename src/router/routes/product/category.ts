import RouterView from '@/components/RouterView.vue'

export const categoryList = {
  path: '',
  name: 'product-category',
  component: () => import(/* webpackChunkName: 'p-product-category-list' */ '@/pages/product/category/List.vue'),
  meta: {
    auth: true,
    title: 'Product Category'
  }
}

const ProductCategoryCreateEdit = () => import(/* webpackChunkName: 'p-product-category-create-edit' */ '@/pages/product/category/CreateEdit.vue')

export const categoryCreate = {
  path: 'create',
  name: 'product-category-create',
  component: ProductCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Product Category Create'
  }
}

export const categoryEdit = {
  path: 'edit/:id',
  name: 'product-category-edit',
  component: ProductCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Product Category Edit'
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
