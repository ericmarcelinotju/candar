import RouterView from '@/components/RouterView.vue'
import { categoryRoute } from './category'
import { variantCreate, variantEdit, variantList } from './variant'

export const variantRoute = {
  path: 'variant',
  redirect: 'variant',
  component: RouterView,
  children: [
    variantList,
    variantCreate,
    variantEdit,
    categoryRoute
  ],
  meta: {
    title: 'Variant'
  }
}
