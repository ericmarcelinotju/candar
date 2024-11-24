import { createRouter, createWebHashHistory } from 'vue-router'
import { config } from '@/config'
import {
  dashboardRoute,
  maintenanceRoute,
  settingRoute,
  permissionRoutes,
  logRoutes,
  divisionRoutes,
  projectRoutes,
  variantRoutes,
  variantCategoryRoutes,
  productRoutes,
  productCategoryRoutes,
  quotationRoutes,
  calendarRoute,
  contractRoutes,
  purchaseRoutes,
  companyBankRoutes
} from './routes'

import DefaultContainer from '@/components/layout/Container.vue'
import { guardAuth } from './guard'
import { clientRoutes } from './routes/client'
import { errorRoutes } from './routes/error'
import { userRoutes } from './routes/user'
import { roleRoutes } from './routes/role'
import { authRoutes } from './routes/auth'

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
        calendarRoute,
        maintenanceRoute,
        settingRoute,

        ...Object.values(logRoutes),

        userRoutes,
        ...Object.values(permissionRoutes),

        clientRoutes,
        roleRoutes,
        ...Object.values(divisionRoutes),
        ...Object.values(purchaseRoutes),

        ...Object.values(contractRoutes),

        ...Object.values(projectRoutes),
        ...Object.values(quotationRoutes),

        ...Object.values(productRoutes),
        ...Object.values(productCategoryRoutes),

        ...Object.values(variantRoutes),
        ...Object.values(variantCategoryRoutes),

        ...Object.values(companyBankRoutes)
      ],
      beforeEnter: guardAuth,
      meta: {
        auth: true,
        title: 'Home'
      }
    },
    ...authRoutes,
    ...errorRoutes
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | ${config.appName}`
  next()
})

export default router
