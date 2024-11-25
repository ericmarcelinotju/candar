import RouterView from '@/components/RouterView.vue'

const CompanyBankList = () => import('@/pages/company-bank/List.vue')

export const companyBankList = {
  path: '',
  name: 'company-bank',
  component: CompanyBankList,
  meta: {
    auth: true,
    title: 'Company Bank'
  }
}

const CompanyBankCreate = () => import('@/pages/company-bank/CreateEdit.vue')

export const companyBankCreate = {
  path: 'create',
  name: 'company-bank-create',
  component: CompanyBankCreate,
  meta: {
    auth: true,
    title: 'Create Company Bank'
  }
}

export const companyBankEdit = {
  path: 'edit/:id',
  name: 'company-bank-edit',
  component: CompanyBankCreate,
  meta: {
    auth: true,
    title: 'Edit Company Bank'
  }
}

export const companyBankRoute = {
  path: 'company-bank',
  redirect: 'company-bank',
  component: RouterView,
  children: [
    companyBankList,
    companyBankCreate,
    companyBankEdit
  ],
  meta: {
    title: 'Company Bank'
  }
}
