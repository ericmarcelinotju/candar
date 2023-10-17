import { createRouter, createWebHashHistory } from 'vue-router'
import { config } from '@/config'
import {
  dashboardRoute,
  maintenanceRoute,
  settingRoute,
  authRoutes,
  userRoutes,
  roleRoutes,
  permissionRoutes,
  logRoutes,
  divisionRoutes,
  clientRoutes,
  projectRoutes,
  errorRoutes,
  clientAddressRoutes,
  clientContactRoutes,
  variantRoutes,
  variantCategoryRoutes,
  productRoutes,
  productCategoryRoutes,
  quotationRoutes
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

        ...Object.values(logRoutes),

        ...Object.values(userRoutes),
        ...Object.values(roleRoutes),
        ...Object.values(permissionRoutes),

        ...Object.values(clientRoutes),
        ...Object.values(clientAddressRoutes),
        ...Object.values(clientContactRoutes),
        ...Object.values(divisionRoutes),

        ...Object.values(projectRoutes),
        ...Object.values(quotationRoutes),

        ...Object.values(productRoutes),
        ...Object.values(productCategoryRoutes),

        ...Object.values(variantRoutes),
        ...Object.values(variantCategoryRoutes)
      ],
      beforeEnter: guardAuth
    },
    ...authRoutes,
    ...Object.values(errorRoutes)
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | ${config.appName}`
  next()
})

export default router
