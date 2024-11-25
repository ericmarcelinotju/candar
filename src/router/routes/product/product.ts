export const productList = {
  path: '',
  name: 'product',
  component: () => import(/* webpackChunkName: 'p-product-list' */ '@/pages/product/List.vue'),
  meta: {
    auth: true,
    title: 'Product'
  }
}

const ProductCreateEdit = () => import(/* webpackChunkName: 'p-product-create-edit' */ '@/pages/product/CreateEdit.vue')

export const productCreate = {
  path: 'create',
  name: 'product-create',
  component: ProductCreateEdit,
  meta: {
    auth: true,
    title: 'Create Product'
  }
}

export const productEdit = {
  path: 'edit/:id',
  name: 'product-edit',
  component: ProductCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Product'
  }
}

const ProductImport = () => import(/* webpackChunkName: 'p-product-import' */ '@/pages/product/Import.vue')

export const productImport = {
  path: 'import',
  name: 'product-import',
  component: ProductImport,
  meta: {
    auth: true,
    title: 'Import Product'
  }
}
