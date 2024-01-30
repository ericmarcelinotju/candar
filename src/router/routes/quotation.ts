export const quotationList = {
  path: '/quotation',
  name: 'quotation',
  component: () => import(/* webpackChunkName: 'p-quotation-list' */ '@/pages/quotation/List.vue'),
  meta: {
    auth: true,
    title: 'Quotation'
  }
}

const QuotationCreateEdit = () => import(/* webpackChunkName: 'p-quotation-create-edit' */ '@/pages/quotation/CreateEdit.vue')

export const quotationCreate = {
  path: '/quotation/create',
  name: 'quotation-create',
  component: QuotationCreateEdit,
  meta: {
    auth: true,
    title: 'Quotation Create'
  }
}

export const quotationEdit = {
  path: '/quotation/edit/:id',
  name: 'quotation-edit',
  component: QuotationCreateEdit,
  meta: {
    auth: true,
    title: 'Quotation Edit'
  }
}
