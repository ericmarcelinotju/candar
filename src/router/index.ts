import { createRouter, createWebHashHistory } from 'vue-router'
import { config } from '@/config'
import {
  dashboardRoute,
  maintenanceRoute,
  settingRoute,
  calendarRoute
} from './routes'
import DefaultContainer from '@/components/layout/Container.vue'
import { guardAuth } from './guard'

import { authRoutes } from './routes/auth'
import { errorRoutes } from './routes/error'
import { logRoutes as logRoute } from './routes/log'

import { roleRoutes as roleRoute } from './routes/role'
import { permissionRoutes as permissionRoute } from './routes/permission'

import { userRoutes as userRoute } from './routes/user'
import { clientRoutes as clientRoute } from './routes/client'
import { divisionRoute } from './routes/division'
import { productRoute } from './routes/product'
import { purchaseRoute } from './routes/purchase'
import { contractRoute } from './routes/contract'
import { dealRoute } from './routes/deal'
import { quotationRoute } from './routes/quotation'
import { companyBankRoute } from './routes/company-bank'

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

        logRoute,

        userRoute,
        permissionRoute,

        clientRoute,
        roleRoute,
        divisionRoute,

        productRoute,

        purchaseRoute,
        contractRoute,

        dealRoute,

        quotationRoute,

        companyBankRoute
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
