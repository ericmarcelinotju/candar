export const productList = {
  path: '/product',
  name: 'product',
  component: () => import(/* webpackChunkName: 'p-product-list' */ '@/pages/product/List.vue'),
  meta: {
    auth: true,
    title: 'Variant'
  }
}

const ProductCreateEdit = () => import(/* webpackChunkName: 'p-product-create-edit' */ '@/pages/product/CreateEdit.vue')

export const productCreate = {
  path: '/product/create',
  name: 'product-create',
  component: ProductCreateEdit,
  meta: {
    auth: true,
    title: 'Product Create'
  }
}

const ProductImport = () => import('@/pages/product/import.vue')

export const productImport = {
  path: '/product/import',
  name: 'product-import',
  component: ProductImport,
  meta: {
    auth: true,
    title: 'Product Import'
  }
}

export const productEdit = {
  path: '/product/edit/:id',
  name: 'product-edit',
  component: ProductCreateEdit,
  meta: {
    auth: true,
    title: 'Product Edit'
  }
}

export const productCategoryList = {
  path: '/product-category',
  name: 'product-category',
  component: () => import(/* webpackChunkName: 'p-product-category-list' */ '@/pages/product/category/List.vue'),
  meta: {
    auth: true,
    title: 'Product Category'
  }
}

const ProductCategoryCreateEdit = () => import(/* webpackChunkName: 'p-product-category-create-edit' */ '@/pages/product/category/CreateEdit.vue')

export const productCategoryCreate = {
  path: '/product-category/create',
  name: 'product-category-create',
  component: ProductCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Product Category Create'
  }
}

export const productCategoryEdit = {
  path: '/product-category/edit/:id',
  name: 'product-category-edit',
  component: ProductCategoryCreateEdit,
  meta: {
    auth: true,
    title: 'Product Category Edit'
  }
}
