import RouterView from '@/components/RouterView.vue'

export const quotationList = {
  path: '',
  name: 'quotation',
  component: () => import(/* webpackChunkName: 'p-quotation-list' */ '@/pages/quotation/List.vue'),
  meta: {
    auth: true,
    title: 'Quotation'
  }
}

const QuotationCreateEdit = () => import(/* webpackChunkName: 'p-quotation-create-edit' */ '@/pages/quotation/CreateEdit.vue')

export const quotationCreate = {
  path: 'create',
  name: 'quotation-create',
  component: QuotationCreateEdit,
  meta: {
    auth: true,
    title: 'Create Quotation'
  }
}

export const quotationEdit = {
  path: 'edit/:id',
  name: 'quotation-edit',
  component: QuotationCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Quotation'
  }
}

export const quotationRoute = {
  path: 'quotation',
  redirect: 'quotation',
  component: RouterView,
  children: [
    quotationList,
    quotationCreate,
    quotationEdit
  ],
  meta: {
    title: 'Contract'
  }
}
