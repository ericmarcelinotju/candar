const CompanyBankList = () => import('@/pages/company-bank/List.vue')

export const companyBankList = {
  path: '/company-bank',
  name: 'company-bank',
  component: CompanyBankList,
  meta: {
    auth: true,
    title: 'Company Bank'
  }
}

const CompanyBankCreate = () => import('@/pages/company-bank/CreateEdit.vue')

export const companyBankCreate = {
  path: '/company-bank/create',
  name: 'company-bank-create',
  component: CompanyBankCreate,
  meta: {
    auth: true,
    title: 'Company Bank Create'
  }
}

export const companyBankEdit = {
  path: '/company-bank/edit/:id',
  name: 'company-bank-edit',
  component: CompanyBankCreate,
  meta: {
    auth: true,
    title: 'Company Bank Edit'
  }
}
