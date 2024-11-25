import RouterView from '@/components/RouterView.vue'

export const divisionList = {
  path: '',
  name: 'division',
  component: () => import(/* webpackChunkName: 'p-division-list' */ '@/pages/division/List.vue'),
  meta: {
    auth: true,
    title: 'Division'
  }
}

const DivisionCreateEdit = () => import(/* webpackChunkName: 'p-division-create-edit' */ '@/pages/division/CreateEdit.vue')

export const divisionCreate = {
  path: 'create',
  name: 'division-create',
  component: DivisionCreateEdit,
  meta: {
    auth: true,
    title: 'Create Division'
  }
}

export const divisionEdit = {
  path: 'edit/:id',
  name: 'division-edit',
  component: DivisionCreateEdit,
  meta: {
    auth: true,
    title: 'Edit Division'
  }
}

export const divisionRoute = {
  path: 'division',
  redirect: 'division',
  component: RouterView,
  children: [
    divisionList,
    divisionCreate,
    divisionEdit
  ],
  meta: {
    title: 'Division'
  }
}
