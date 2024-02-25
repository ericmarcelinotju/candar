import { Navigation } from '@/typings/navigation.type'
import {
  HomeIcon,
  UserIcon,
  PresentationChartLineIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  DocumentReportIcon,
  CalendarIcon,
  ClipboardListIcon,
  CogIcon,
  CreditCardIcon
} from '@heroicons/vue/outline'

export const navigations: Navigation[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon
  },
  {
    name: 'Product',
    icon: ShoppingBagIcon,
    children: [
      {
        name: 'Variant Category',
        module: 'VARIANT_CATEGORY',
        href: '/variant-category'
      },
      {
        name: 'Variant',
        module: 'VARIANT',
        href: '/variant'
      },
      {
        name: 'Product Category',
        module: 'PRODUCT_CATEGORY',
        href: '/product-category'
      },
      {
        name: 'Product',
        module: 'PRODUCT',
        href: '/product'
      },
      {
        name: 'Product Import',
        module: 'PRODUCT',
        href: '/product/import'
      }
    ]
  },
  {
    name: 'Deal',
    module: 'PROJECT',
    href: '/deal',
    icon: PresentationChartLineIcon
  },
  {
    name: 'Quotation',
    module: 'QUOTATION',
    href: '/quotation',
    icon: DocumentReportIcon
  },
  {
    name: 'Client',
    module: 'CLIENT',
    icon: UsersIcon,
    children: [
      {
        name: 'Client',
        module: 'CLIENT',
        href: '/client'
      },
      {
        name: 'Client Import',
        module: 'CLIENT',
        href: '/client/import'
      }
    ]
  },
  {
    name: 'Contract',
    module: 'CONTRACT',
    href: '/contract',
    icon: ClipboardListIcon
  },
  {
    name: 'Purchase',
    module: 'PURCHASE',
    href: '/purchase',
    icon: ShoppingCartIcon
  },
  {
    name: 'Company Bank',
    module: 'COMPANY_BANK',
    href: '/company-bank',
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
        href: '/user'
      },
      {
        name: 'User Import',
        module: 'USER',
        href: '/user/import'
      },
      {
        name: 'Division',
        module: 'DIVISION',
        href: '/division'
      },
      {
        name: 'Role',
        module: 'ROLE',
        href: '/role'
      },
      {
        name: 'Permission',
        module: 'PERMISSION',
        href: '/permission'
      }
    ]
  }
]

export const secondaryNavigations: Navigation[] = [
  {
    name: 'Settings',
    module: 'SETTING',
    href: '/setting',
    icon: CogIcon
  }
  // {
  //   name: 'Maintenance',
  //   icon: CalculatorIcon,
  //   children: [{
  //     name: 'System Log',
  //     module: 'LOG',
  //     href: '/log',
  //     icon: BellIcon
  //   },
  //   {
  //     name: 'Statistic',
  //     module: 'STATISTIC',
  //     href: '/statistic',
  //     icon: CodeIcon
  //   }]
  // }
]
