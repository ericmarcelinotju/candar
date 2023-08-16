export const locationList = {
  path: '/location',
  name: 'location',
  component: () => import(/* webpackChunkName: 'p-location-list' */ '@/pages/location/List.vue'),
  meta: {
    auth: true,
    title: 'Location'
  }
}

const LocationCreateEdit = () => import(/* webpackChunkName: 'p-location-create-edit' */ '@/pages/location/CreateEdit.vue')

export const locationCreate = {
  path: '/location/create',
  name: 'location-create',
  component: LocationCreateEdit,
  meta: {
    auth: true,
    title: 'Location Create'
  }
}

export const locationEdit = {
  path: '/location/edit/:id',
  name: 'location-edit',
  component: LocationCreateEdit,
  meta: {
    auth: true,
    title: 'Location' +
      'Location Edit'
  }
}
