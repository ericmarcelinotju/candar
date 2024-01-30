export const divisionList = {
  path: '/division',
  name: 'division',
  component: () => import(/* webpackChunkName: 'p-division-list' */ '@/pages/division/List.vue'),
  meta: {
    auth: true,
    title: 'Division'
  }
}

const DivisionCreateEdit = () => import(/* webpackChunkName: 'p-division-create-edit' */ '@/pages/division/CreateEdit.vue')

export const divisionCreate = {
  path: '/division/create',
  name: 'division-create',
  component: DivisionCreateEdit,
  meta: {
    auth: true,
    title: 'Division Create'
  }
}

export const divisionEdit = {
  path: '/division/edit/:id',
  name: 'division-edit',
  component: DivisionCreateEdit,
  meta: {
    auth: true,
    title: 'Division Edit'
  }
}
