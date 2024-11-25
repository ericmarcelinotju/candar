import RouterView from '@/components/RouterView.vue'
import { productCreate, productEdit, productImport, productList } from './product'
import { categoryRoute } from './category'
import { variantRoute } from './variant'

export const productRoute = {
  path: 'product',
  redirect: 'product',
  component: RouterView,
  children: [
    productList,
    productCreate,
    productEdit,
    productImport,
    categoryRoute,
    variantRoute
  ],
  meta: {
    title: 'Product'
  }
}
