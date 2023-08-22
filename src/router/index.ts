import { createRouter, createWebHashHistory } from 'vue-router'
import { config } from '@/config'
import {
  dashboardRoute, maintenanceRoute, settingRoute,
  authRoutes,
  userRoutes,
  roleRoutes,
  locationRoutes,
  permissionRoutes,
  logRoutes,
  inspectionRoutes,
  divisionRoutes,
  clientRoutes,
  projectRoutes,
  workRoute
} from './routes'

import DefaultContainer from '@/components/layout/Container.vue'
import { guardAuth } from './guard'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Pages
    {
      path: '/',
      component: DefaultContainer,
      redirect: '/dashboard',
      children: [
        dashboardRoute,
        maintenanceRoute,
        settingRoute,

        workRoute,

        ...Object.values(clientRoutes),
        ...Object.values(divisionRoutes),
        ...Object.values(locationRoutes),
        ...Object.values(projectRoutes),

        ...Object.values(userRoutes),
        ...Object.values(roleRoutes),
        ...Object.values(permissionRoutes),
        ...Object.values(inspectionRoutes),
        ...Object.values(logRoutes),
        ...Object.values(locationRoutes),
        ...Object.values(roleRoutes)
      ],
      beforeEnter: guardAuth
    },
    ...authRoutes
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | ${config.appName}`
  next()
})

export default router
