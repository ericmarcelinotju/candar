import { Navigation } from '@/typings/navigation.type'
import {
  ViewGridIcon,
  UserIcon,
  PresentationChartLineIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  DocumentReportIcon,
  CalendarIcon,
  ClipboardListIcon,
  CogIcon,
  CreditCardIcon
} from '@heroicons/vue/outline'

export const navigations: Navigation[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    icon: ViewGridIcon
  },
  {
    name: 'Calendar',
    route: 'calendar',
    icon: CalendarIcon
  },
  {
    name: 'Product',
    icon: ShoppingBagIcon,
    children: [
      {
        name: 'Variant Category',
        module: 'VARIANT_CATEGORY',
        route: 'variant-category'
      },
      {
        name: 'Variant',
        module: 'VARIANT',
        route: 'variant'
      },
      {
        name: 'Product Category',
        module: 'PRODUCT_CATEGORY',
        route: 'product-category'
      },
      {
        name: 'Product',
        module: 'PRODUCT',
        route: 'product'
      }
    ]
  },
  {
    name: 'Deal',
    module: 'PROJECT',
    route: 'deal',
    icon: PresentationChartLineIcon
  },
  {
    name: 'Quotation',
    module: 'QUOTATION',
    route: 'quotation',
    icon: DocumentReportIcon
  },
  {
    name: 'Client',
    module: 'CLIENT',
    route: 'client',
    icon: UserGroupIcon
  },
  {
    name: 'Contract',
    module: 'CONTRACT',
    route: 'contract',
    icon: ClipboardListIcon
  },
  {
    name: 'Purchase',
    module: 'PURCHASE',
    route: 'purchase',
    icon: ShoppingCartIcon
  },
  {
    name: 'Company Bank',
    module: 'COMPANY_BANK',
    route: 'company-bank',
    icon: CreditCardIcon
  },
  {
    name: 'User Access',
    module: 'USER',
    icon: UserIcon,
    children: [
      {
        name: 'User',
        module: 'USER',
        route: 'user'
      },
      {
        name: 'User Import',
        module: 'USER',
        route: 'user-import'
      },
      {
        name: 'Division',
        module: 'DIVISION',
        route: 'division'
      },
      {
        name: 'Role',
        module: 'ROLE',
        route: 'role'
      },
      {
        name: 'Permission',
        module: 'PERMISSION',
        route: 'permission'
      }
    ]
  }
]

export const secondaryNavigations: Navigation[] = [
  {
    name: 'Settings',
    module: 'PERMISSION',
    route: 'setting',
    icon: CogIcon
  }
  // {
  //   name: 'Maintenance',
  //   icon: CalculatorIcon,
  //   children: [{
  //     name: 'System Log',
  //     module: 'LOG',
  //     route: '/log',
  //     icon: BellIcon
  //   },
  //   {
  //     name: 'Statistic',
  //     module: 'STATISTIC',
  //     route: '/statistic',
  //     icon: CodeIcon
  //   }]
  // }
]
